#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{
    env,
    fs::{self, OpenOptions},
    io::{Read, Write},
    net::TcpStream,
    path::PathBuf,
    process::{Child, Command, Stdio},
    sync::Mutex,
    thread,
    time::{Duration, Instant},
};
use tauri::{Manager, WebviewUrl, WebviewWindowBuilder, WindowEvent};

const PORT: &str = "5173";
const BASE_URL: &str = "http://127.0.0.1:5173";

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            if let Err(error) = launch_main_window(app) {
                let manager_home = resolve_manager_home();
                let _ = fs::create_dir_all(manager_home.join("logs"));
                let detail = error.to_string();
                let _ = fs::write(manager_home.join("logs/native-startup-error.log"), &detail);
                show_startup_error_window(app)?;
            }
            Ok(())
        })
        .on_window_event(|window, event| {
            if matches!(event, WindowEvent::CloseRequested { .. }) {
                window.app_handle().exit(0);
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running Skills Manager");
}

struct ServiceProcess(Mutex<Child>);

impl Drop for ServiceProcess {
    fn drop(&mut self) {
        if let Ok(child) = self.0.get_mut() {
            let _ = child.kill();
            let _ = child.wait();
        }
    }
}

fn launch_main_window(app: &mut tauri::App) -> tauri::Result<()> {
    let resource_root = resolve_resource_root(app)?;
    let manager_home = resolve_manager_home();
    fs::create_dir_all(manager_home.join("logs"))?;

    let mut service_child = None;
    if !health_ready() {
        service_child = Some(start_service(&resource_root, &manager_home)?);
        wait_for_health(Duration::from_secs(8))?;
    }

    if let Some(child) = service_child {
        app.manage(ServiceProcess(Mutex::new(child)));
    }

    WebviewWindowBuilder::new(
        app,
        "main",
        WebviewUrl::External(BASE_URL.parse().expect("valid local url")),
    )
    .title("Skills Manager")
    .inner_size(1280.0, 820.0)
    .min_inner_size(1040.0, 700.0)
    .build()?;

    Ok(())
}

fn show_startup_error_window(app: &mut tauri::App) -> tauri::Result<()> {
    WebviewWindowBuilder::new(app, "main", WebviewUrl::App("native-error.html".into()))
        .title("Skills Manager")
        .inner_size(920.0, 640.0)
        .min_inner_size(760.0, 520.0)
        .build()?;

    Ok(())
}

fn resolve_resource_root(app: &mut tauri::App) -> tauri::Result<PathBuf> {
    if let Ok(path) = env::var("SKILLSMANGER_TAURI_RESOURCE_ROOT") {
        return Ok(PathBuf::from(path));
    }

    let bundled = app.path().resource_dir()?.join("app");
    if bundled.join("src/server.mjs").exists() {
        return Ok(bundled);
    }

    Ok(PathBuf::from(env!("CARGO_MANIFEST_DIR")).join(".."))
}

fn resolve_manager_home() -> PathBuf {
    if let Ok(path) = env::var("SKILLSMANGER_HOME") {
        return PathBuf::from(path);
    }

    PathBuf::from(env::var("HOME").unwrap_or_else(|_| ".".to_string())).join(".skillsmanager")
}

fn resolve_node_path(resource_root: &PathBuf) -> PathBuf {
    if let Ok(path) = env::var("SKILLSMANGER_NODE_PATH") {
        return PathBuf::from(path);
    }

    let bundled = resource_root.join("node/bin/node");
    if bundled.exists() {
        return bundled;
    }

    PathBuf::from("node")
}

fn start_service(resource_root: &PathBuf, manager_home: &PathBuf) -> tauri::Result<Child> {
    let node_path = resolve_node_path(resource_root);
    let server_path = resource_root.join("src/server.mjs");
    let public_dir = resource_root.join("public");
    let stdout = OpenOptions::new()
        .create(true)
        .append(true)
        .open(manager_home.join("logs/service.out.log"))?;
    let stderr = OpenOptions::new()
        .create(true)
        .append(true)
        .open(manager_home.join("logs/service.err.log"))?;

    Command::new(node_path)
        .arg(&server_path)
        .current_dir(resource_root)
        .env("PORT", PORT)
        .env("SKILLSMANGER_HOME", manager_home)
        .env("SKILLSMANGER_PROJECT_ROOT", resource_root)
        .env("SKILLSMANGER_SERVER_PATH", server_path)
        .env("SKILLSMANGER_PUBLIC_DIR", public_dir)
        .env("SKILLSMANGER_SERVICE_LABEL", "com.skillsmanager.local")
        .stdin(Stdio::null())
        .stdout(Stdio::from(stdout))
        .stderr(Stdio::from(stderr))
        .spawn()
        .map_err(Into::into)
}

fn wait_for_health(timeout: Duration) -> tauri::Result<()> {
    let deadline = Instant::now() + timeout;
    while Instant::now() < deadline {
        if health_ready() {
            return Ok(());
        }
        thread::sleep(Duration::from_millis(150));
    }

    Err(std::io::Error::new(
        std::io::ErrorKind::TimedOut,
        "Skills Manager service did not become ready in time",
    )
    .into())
}

fn health_ready() -> bool {
    let mut stream = match TcpStream::connect("127.0.0.1:5173") {
        Ok(stream) => stream,
        Err(_) => return false,
    };

    let _ = stream.set_read_timeout(Some(Duration::from_millis(500)));
    let _ = stream.set_write_timeout(Some(Duration::from_millis(500)));
    if stream
        .write_all(b"GET /api/health HTTP/1.1\r\nHost: 127.0.0.1\r\nConnection: close\r\n\r\n")
        .is_err()
    {
        return false;
    }

    let mut body = String::new();
    stream.read_to_string(&mut body).is_ok()
        && body.contains("200 OK")
        && body.contains("\"service\": \"com.skillsmanager.local\"")
}
