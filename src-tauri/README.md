# Skills Manager Tauri Shell

This is the first native shell scaffold for the local Agent Skills console.

The shell intentionally stays small:

- it opens the local web console at `http://127.0.0.1:5173`
- development startup runs `npm run app:ensure-ready`
- service status, port checks, and startup plans stay in the Node app-shell helpers
- no team registry, account login, cloud sync, or managed invocation UI is introduced here

## Development

Start the Tauri shell after installing the Tauri toolchain:

```bash
cargo tauri dev
```

The `beforeDevCommand` runs:

```bash
npm run app:ensure-ready
```

That command starts the local Node service when needed and waits until `/api/health`
confirms the service is Skills Manager.

## Packaging Notes

This scaffold does not yet decide whether the final app bundles Node or requires an
installed Node runtime. Until that decision is made, production packaging should be treated
as an engineering spike rather than a release-ready build.
