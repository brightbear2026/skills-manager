const TRANSLATIONS = {
  en: {
    "app.tagline": "Manage and copy local Agent Skills",
    "app.language": "Language",
    "inspector.title": "Details",
    "inspector.reviewTitle": "Review panel",
    "inspector.distributeTitle": "Copy panel",
    "inspector.guideTitle": "Guide",
    "inspector.resultTitle": "Result",
    "inspector.current": "Current selection",
    "inspector.localState": "Local State",
    "inspector.nextStep": "Next Step",
    "inspector.setupTitle": "Local scan status",
    "inspector.importTitle": "Import flow",
    "inspector.importResultTitle": "Check result",
    "inspector.runtimeTitle": "Run snapshot",
    "inspector.bridgeTitle": "Bridge status",
    "inspector.profilesTitle": "Agent folders",
    "inspector.ready": "Ready",
    "inspector.reviewNeeded": "Needs review",
    "inspector.published": "Copied",
    "inspector.notInstalled": "Not installed",
    "inspector.stepScan": "Scan existing agent skill folders.",
    "inspector.stepAdopt": "Save low-risk skills.",
    "inspector.stepReview": "Review high-risk skills one by one.",
    "inspector.stepFinish": "Finish setup without changing existing agent folders.",
    "inspector.stepPreview": "Preview the source before any install.",
    "inspector.stepInstall": "Save this skill before copying it.",
    "inspector.stepPublish": "Copy later from Managed Skills to a selected agent.",
    "inspector.stepProfiles": "Confirm the folders agents read from.",
    "nav.setup": "Console",
    "nav.setupHint": "Local agent skills overview",
    "nav.skills": "All Skills",
    "nav.skillsHint": "Scanned results and risk",
    "nav.library": "Managed Skills",
    "nav.libraryHint": "Managed, ready to copy",
    "nav.import": "Get Skills",
    "nav.importHint": "Folder, Git, or archive",
    "nav.advanced": "Advanced",
    "nav.runtime": "Runs",
    "nav.runtimeHint": "Invocation history",
    "nav.bridge": "Bridge",
    "nav.bridgeHint": "Optional handoff",
    "nav.profiles": "Agent Folders",
    "nav.profilesHint": "Where skills are copied",
    "workspace.setup.kicker": "Console",
    "workspace.setup.title": "Local Agent Skills Console",
    "workspace.setup.subtitle": "See skills found across local agents, risk signals, managed skills, and copy targets in one place.",
    "workspace.skills.kicker": "All Skills",
    "workspace.skills.title": "All Agent Skills",
    "workspace.skills.subtitle": "Scanned results from this Mac's agent skill folders. Review state and risk, then decide what should be managed.",
    "workspace.library.kicker": "Managed Skills",
    "workspace.library.title": "Managed Skills",
    "workspace.library.subtitle": "These skills are saved by Skills Manager and can be copied to any enabled agent folder.",
    "workspace.import.kicker": "Get Skills",
    "workspace.import.title": "Get Skills",
    "workspace.import.subtitle": "Paste a local folder, Git repository URL, archive file, or GitHub owner/repo shortcut. Skills Manager checks the source before adding it.",
    "workspace.runtime.kicker": "Advanced",
    "workspace.runtime.title": "Run History",
    "workspace.runtime.subtitle": "Inspect optional local invocation records, locks, and queues.",
    "workspace.bridge.kicker": "Advanced",
    "workspace.bridge.title": "Agent Bridge",
    "workspace.bridge.subtitle": "Optional helper skill for agents that need to call back into Skills Manager.",
    "workspace.profiles.kicker": "Agent Folders",
    "workspace.profiles.title": "Agent Folders",
    "workspace.profiles.subtitle": "Set the local folders each agent reads from. Copy settings are chosen on each skill.",
    "home.ctaGet": "Get new skill",
    "home.ctaDistribute": "Copy to agent",
    "home.ctaAgents": "Agent folders",
    "home.discovered": "Discovered on this Mac",
    "home.managed": "Managed",
    "home.review": "Need a decision",
    "home.agents": "Copy targets",
    "home.nextTitle": "Recommended actions",
    "home.nextReviewTitle": "{count} need a decision",
    "home.nextReviewBody": "Allow or block high-risk skills before copying them to agents.",
    "home.nextManageTitle": "{count} total skills",
    "home.nextManageBody": "Open the full scanned list from all local agent folders.",
    "home.nextLibraryTitle": "{count} managed",
    "home.nextLibraryBody": "Open skills already saved by Skills Manager.",
    "home.nextImportTitle": "Get a skill",
    "home.nextImportBody": "Paste a local folder, Git link, or archive and check it first.",
    "home.nextDistributionTitle": "{count} agent folder(s)",
    "home.nextDistributionBody": "Check where copied skills will be placed.",
    "home.statusTitle": "Status",
    "home.metricAgents": "Agents",
    "home.metricDiscovered": "Found locations",
    "home.metricManaged": "Managed skills",
    "home.metricNeedsAction": "Need attention",
    "home.metricCopyGaps": "Copy gaps",
    "home.agentMapTitle": "Agent distribution",
    "home.skillMapTitle": "Skill distribution",
    "home.actionsTitle": "Needs attention",
    "home.columnAgent": "Agent",
    "home.columnSkills": "Skills",
    "home.columnManaged": "Managed",
    "home.columnRisk": "Risk",
    "home.columnUnique": "Unique",
    "home.columnCopied": "Copied",
    "home.columnFolder": "Folder",
    "home.folderReady": "Ready",
    "home.folderMissing": "Unavailable",
    "home.noSkillsForAgent": "0",
    "home.skillColumnSkill": "Skill",
    "home.skillColumnAgents": "Available in agents",
    "home.skillColumnState": "State",
    "home.skillMore": "+{count} more",
    "home.foundOnly": "Not managed",
    "home.instanceCount": "{count} location(s)",
    "home.copyGap": "Can copy to {count} more agent(s)",
    "home.noCopyGap": "Already copied where needed",
    "home.actionHighRisk": "{count} high-risk skill(s) need a copy decision",
    "home.actionHighRiskBody": "Open All Skills and choose allow or block before copying.",
    "home.actionCopyGaps": "{count} managed skill(s) are not copied anywhere",
    "home.actionCopyGapsBody": "Open Managed Skills and copy important ones to agents.",
    "home.actionMissingFolders": "{count} agent folder(s) are unavailable",
    "home.actionMissingFoldersBody": "Open Agent Folders and fix the path before copying.",
    "home.actionConflicts": "{count} duplicate/conflicting skill(s)",
    "home.actionConflictsBody": "Open All Skills and compare the conflicting agent folders.",
    "home.actionReady": "No urgent relationship issue",
    "home.actionReadyBody": "The current agent folders, managed skills, and copy targets look clean.",
    "summary.skills": "Skills",
    "summary.roots": "Roots",
    "summary.conflicts": "Conflicts",
    "sections.scannedRoots": "Scanned Roots",
    "sections.governance": "Local Control",
    "sections.distribution": "Next action",
    "sections.invocationRuntime": "Run Test",
    "sections.activeLocks": "Active Locks",
    "sections.recentInvocations": "Recent Invocations",
    "sections.riskFindings": "Risk Findings",
    "sections.validation": "Validation",
    "sections.dependencies": "Dependencies",
    "sections.files": "Files",
    "sections.frontmatter": "Frontmatter",
    "sections.instructions": "Instructions Preview",
    "sections.publishFromLibrary": "Choose an Agent",
    "sections.publishedAgents": "Copied Locations",
    "sections.distributionTargets": "Agent folders",
    "sections.runtimeRuns": "Recent Runs",
    "sections.policy": "Copy Decision",
    "sections.bridge": "Bridge",
    "sections.profiles": "Agent Folders",
    "actions.refresh": "Scan Mac",
    "actions.preview": "Check skill",
    "actions.install": "Save skill",
    "actions.viewSavedSkill": "View saved skill",
    "actions.finish": "Done",
    "actions.adoptLowRisk": "Add safe skills",
    "actions.adoptSelected": "Add selected ({count})",
    "actions.saveMode": "Save",
    "actions.publishManagedMirror": "Copy to Agent",
    "actions.copyToProfile": "Copy to {profile}",
    "actions.updateProfileCopy": "Update {profile}",
    "actions.copyAgainToProfile": "Copy again to {profile}",
    "actions.republish": "Update copy",
    "actions.unpublish": "Remove copy",
    "actions.installBridge": "Set up bridge",
    "actions.saveTrust": "Save decision",
    "actions.saveProfile": "Save settings",
    "actions.addProfile": "Add folder",
    "actions.deleteProfile": "Delete folder",
    "actions.chooseFolder": "Choose folder",
    "actions.resetProfiles": "Restore default folders",
    "actions.adoptIntoLibrary": "Save skill",
    "actions.openInLibrary": "Open managed skill",
    "actions.startInvocation": "Test run",
    "actions.complete": "Complete",
    "filters.search": "Search skills, tools, paths",
    "filters.allRisks": "All risks",
    "filters.allTools": "All tools",
    "risk.high": "High",
    "risk.medium": "Medium",
    "risk.low": "Low",
    "risk.label": "{level} risk",
    "labels.source": "Source",
    "labels.status": "Status",
    "labels.fingerprint": "Fingerprint",
    "labels.library": "Saved",
    "labels.path": "Path",
    "labels.updated": "Updated",
    "labels.files": "Files",
    "labels.version": "Version",
    "labels.libraryPath": "Saved location",
    "labels.agent": "Agent name",
    "labels.publishToAgent": "Copy target",
    "labels.concurrency": "Concurrency",
    "labels.resourceKey": "Resource key",
    "labels.prompt": "Prompt",
    "labels.noLock": "no lock",
    "labels.blockedBy": "blocked by {runId}",
    "labels.unknown": "unknown",
    "labels.trust": "Copy decision",
    "labels.notes": "Note (optional)",
    "labels.reviewer": "Handled by",
    "labels.enabled": "Use this folder",
    "labels.skillRoot": "Skills folder",
    "labels.profileName": "Agent name",
    "labels.adapter": "Agent type",
    "labels.resolvedCommit": "Resolved commit",
    "labels.diff": "Diff",
    "status.loading": "Loading local skills...",
    "status.scanning": "Scanning local skill roots...",
    "status.scanned": "Scanned {count} available root(s) at {time}.",
    "status.creatingInvocation": "Creating simulated invocation...",
    "status.invocationFailed": "Invocation failed: {status}",
    "status.invocationCreated": "Invocation {id} is {status}.",
    "status.completing": "Completing {id}...",
    "status.completeFailed": "Complete failed: {status}",
    "status.invocationCompleted": "Invocation {id} completed.{promoted}",
    "status.promoted": " Promoted {count} queued run(s).",
    "status.runtimeFailed": "Runtime load failed: {status}",
    "status.scanFailed": "Scan failed: {status}",
    "status.libraryFailed": "Saved skills failed to load: {status}",
    "status.firstRunFailed": "First-run load failed: {status}",
    "status.selectSkillToAdopt": "Select at least one existing skill to add.",
    "status.adoptingLowRisk": "Saving low-risk existing skills...",
    "status.adoptingSelected": "Saving selected existing skills...",
    "status.firstRunAdoptFailed": "Save failed: {status}",
    "status.firstRunAdopted": "Saved {adopted} existing skill(s). {skipped} skipped.",
    "status.finishingFirstRun": "Finishing first-run import...",
    "status.finishFailed": "Finish failed: {status}",
    "status.firstRunFinished": "First-run import finished.",
    "status.adoptingSkill": "Saving skill...",
    "status.adoptFailed": "Adopt failed: {status}",
    "status.skillAdopted": "Skill saved.",
    "status.publishingSkill": "Copying skill to agent...",
    "status.publishFailed": "Copy failed: {status}",
    "status.publishedTo": "Copied to {profile}.",
    "status.selectLibraryRecord": "Select a saved skill first.",
    "status.publishingRecord": "Copying saved skill to agent...",
    "status.publishedRecord": "{record} copied to {profile}.",
    "status.savingMode": "Saving invocation mode...",
    "status.saveFailed": "Save failed: {status}",
    "status.modeSaved": "Invocation mode saved as {mode}.",
    "status.enterSource": "Enter a local folder, Git repository, or archive source first.",
    "status.analyzeFirst": "Check this skill before saving it.",
    "status.previewingSource": "Checking source...",
    "status.previewFailed": "Check failed: {status}",
    "status.previewed": "Checked {name}.",
    "status.aiFailed": "AI interpretation failed: {status}",
    "status.aiInterpreted": "AI interpretation is ready.",
    "status.aiTested": "Model connection works.",
    "status.aiTestFailed": "Model connection failed: {status}",
    "status.aiIncomplete": "Add Base URL, model, and API key before testing.",
    "status.aiNotEnabled": "Enable AI interpretation before running it.",
    "status.installingSource": "Saving source...",
    "status.installFailed": "Install failed: {status}",
    "status.installedSource": "Saved {name}.",
    "status.sourceAlreadySaved": "{name} is already saved.",
    "status.savingTrust": "Saving copy decision...",
    "status.trustSaved": "Copy decision saved as {status}.",
    "status.installingBridge": "Installing bridge skill...",
    "status.bridgeInstalled": "Bridge skill saved.",
    "status.savingProfile": "Saving profile...",
    "status.profileSaved": "Profile saved.",
    "status.profileDeleted": "Agent folder deleted.",
    "status.folderPickerUnavailable": "Folder picker is available in the Mac app. Paste the folder path here instead.",
    "status.folderPickerFailed": "Folder picker failed: {status}",
    "status.republishingRecord": "Updating copy...",
    "status.unpublishingRecord": "Removing copy...",
    "status.recordUnpublished": "Removed copy from {profile}.",
    "setup.doneTitle": "Local console is ready",
    "setup.doneBody": "Your Mac has been scanned. Use the console to review all local agent skills, manage trusted ones, and copy them to agents.",
    "firstRun.title": "Save existing skills",
    "firstRun.body": "Review skills already installed in agent folders, then save safe ones. Nothing is copied, overwritten, or deleted from here.",
    "firstRun.discovered": "Discovered",
    "firstRun.ready": "Ready to save",
    "firstRun.lowRisk": "Low risk",
    "firstRun.review": "Review",
    "firstRun.noSkills": "No existing skills were found in the scanned roots.",
    "firstRun.rootSummary": "{count} skill(s) / {ready} ready / {high} high risk",
    "firstRun.reviewIndividually": "review individually",
    "library.emptyTitle": "No saved skills yet",
    "library.emptyBody": "Get a skill from a local folder, Git repository, or archive, then copy it to an agent.",
    "library.publicationCount": "Copied to {count} agent(s)",
    "library.notPublished": "Not copied to any agent yet.",
    "library.publishNote": "Click an agent to copy this saved version into that agent's local skills folder.",
    "library.availableTargets": "Choose the target agent",
    "library.copyMethodTitle": "Copy method for this skill",
    "library.copyMethodHelp": "Safe copy is recommended. Plain copy and link are useful only when you know the target folder should mirror the source differently.",
    "library.publishedEmptyNext": "Copy this skill to an agent when you are ready.",
    "library.targetPath": "Target folder",
    "library.lastCopied": "Last copied",
    "library.copyMode": "Copy mode",
    "library.target.available": "Ready",
    "library.target.managed": "Already copied",
    "library.target.outdated": "Update available",
    "library.target.stale": "Missing copy",
    "library.target.conflict": "Has existing skill",
    "library.target.managedOther": "Used by another record",
    "library.conflictHelp": "Skills Manager will not overwrite a user-owned skill folder. Remove or rename the existing folder first.",
    "library.outdatedHelp": "The target copy does not match the current saved version. Use Update copy.",
    "library.staleHelp": "This record says it was copied, but the target folder is missing. Copy it again or remove the stale record.",
    "import.source": "Skill source",
    "import.sourcePlaceholder": "/path/to/skill, Git URL, .zip/.tar, or owner/repo",
    "import.ref": "Version or branch (optional)",
    "import.refPlaceholder": "leave empty for default, or enter tag, branch, commit",
    "import.subdir": "Skill folder inside source (optional)",
    "import.subdirPlaceholder": "only needed when the skill is not at repo root",
    "import.advanced": "Optional settings, usually not needed",
    "import.advancedNote": "Most skills do not need these. Use them only when the source has multiple versions or folders.",
    "import.replace": "Allow replacing a same-name saved skill",
    "import.pin": "Lock to the checked commit",
    "import.historyTitle": "Recent sources",
    "import.historyBody": "Pick a recent source to check it again.",
    "import.historyEmpty": "Checked sources will appear here.",
    "import.historyClear": "Clear",
    "sourcePreview.analyzed": "Checked",
    "sourcePreview.added": "Saved",
    "sourcePreview.summaryTitle": "Source summary",
    "sourcePreview.localCheckTitle": "Local check",
    "sourcePreview.sourcePath": "Source",
    "sourcePreview.checkStats": "Checked content",
    "sourcePreview.aiTitle": "AI interpretation",
    "sourcePreview.aiUnavailable": "Not configured yet",
    "sourcePreview.aiBody": "AI can later summarize what this skill does, explain risky lines, and suggest whether to add or copy it. Local check results are still available without a model.",
    "sourcePreview.aiNext": "Next: add model settings, then run AI interpretation on demand.",
    "sourcePreview.aiReady": "Configured",
    "sourcePreview.aiRun": "Run AI interpretation",
    "sourcePreview.aiRunning": "Interpreting...",
    "sourcePreview.aiResult": "AI result",
    "sourcePreview.aiSummary": "What it does",
    "sourcePreview.aiRisk": "Risk explanation",
    "sourcePreview.aiRecommendation": "Recommended next step",
    "sourcePreview.filesChecked": "{count} file(s) checked",
    "sourcePreview.scriptsFound": "{count} script file(s)",
    "sourcePreview.noValidationIssues": "No validation issues.",
    "sourcePreview.validationTitle": "Validation",
    "ai.settingsTitle": "AI interpretation settings (optional)",
    "ai.settingsBody": "Choose a provider preset or use any OpenAI-compatible endpoint. The API key stays on this Mac and is never shown again.",
    "ai.enabled": "Enable AI interpretation",
    "ai.provider": "Model provider",
    "ai.providerCustom": "Custom OpenAI-compatible",
    "ai.providerDeepseek": "DeepSeek",
    "ai.providerQwenDashscope": "Qwen / Alibaba Cloud Model Studio",
    "ai.providerKimi": "Kimi / Moonshot",
    "ai.providerZhipu": "GLM / Zhipu",
    "ai.baseUrl": "Base URL",
    "ai.baseUrlPlaceholder": "https://api.openai.com/v1",
    "ai.model": "Model",
    "ai.modelPlaceholder": "gpt-5.5",
    "ai.apiKey": "API key",
    "ai.apiKeyPlaceholder": "Leave blank to keep existing key",
    "ai.save": "Save AI settings",
    "ai.test": "Test connection",
    "ai.testing": "Testing...",
    "ai.testRunning": "Testing the saved model settings...",
    "ai.testSuccess": "Connection works: {provider} / {model}.",
    "ai.saved": "AI settings saved.",
    "ai.keySet": "API key is set.",
    "ai.keyMissing": "API key is not set.",
    "suggestion.title": "Suggestion",
    "suggestion.noPreview": "Paste a source, then check it here.",
    "suggestion.safe": "Looks safe to save.",
    "suggestion.review": "Review the risk signals before adding or copying.",
    "suggestion.blocked": "Do not copy this to an agent until validation issues are resolved.",
    "suggestion.addNext": "Next: save it, then copy it from Managed Skills.",
    "suggestion.inspectNext": "Next: inspect the findings in the preview before taking action.",
    "empty.selectSkillTitle": "Select a skill",
    "empty.selectSkillBody": "Review metadata, files, risk hints, and local path details.",
    "empty.selectLibraryTitle": "Select a saved skill",
    "empty.selectLibraryBody": "Choose a skill to see where it has been copied and copy it to an agent.",
    "empty.setupTitle": "Local Agent Skills Console",
    "empty.setupBody": "Scan all local agent skill folders, then review risk and decide what Skills Manager should manage.",
    "empty.importTitle": "Import workspace",
    "empty.importBody": "Check a local folder, Git repository, or archive first, then save it.",
    "empty.runtimeTitle": "Runtime workspace",
    "empty.runtimeBody": "Runtime details appear here after you select a skill with invocation history.",
    "common.noDescription": "No description provided.",
    "common.noRiskFindings": "No risk findings",
    "common.notInLibrary": "not saved",
    "common.none": "(none)",
    "common.empty": "(empty)",
    "common.truncated": "Large instruction body truncated by the local API.",
    "common.truncatedMarker": "...truncated...",
    "root.available": "available",
    "root.missing": "missing",
    "runtime.running": "Running",
    "runtime.queued": "Queued",
    "runtime.locks": "Locks",
    "runtime.runs": "Runs",
    "runtime.unavailable": "Runtime unavailable",
    "runtime.noRuns": "No invocation runs yet.",
    "bridge.notInstalled": "Bridge skill is not installed yet.",
    "bridge.installed": "Bridge skill is installed and allowed.",
    "bridge.body": "Optional helper skill for agents that need to call back into Skills Manager.",
    "profiles.disabled": "Disabled",
    "profiles.enabled": "Enabled",
    "profiles.none": "No agent folders are enabled.",
    "profiles.resetNote": "Reset restores Claude, Codex, and OpenClaw default skills folders.",
    "profiles.addTitle": "Add an Agent folder",
    "profiles.custom": "Custom",
    "profiles.default": "Default",
    "profiles.deleteConfirm": "Delete this custom Agent folder?",
    "profiles.namePlaceholder": "My Agent",
    "profiles.pathPlaceholder": "~/my-agent/skills",
    "profiles.inspectorTitle": "What is this for?",
    "profiles.inspectorBody": "These are not account connections. They only tell Skills Manager where to copy a skill when you choose an agent.",
    "profiles.inspectorWhenTitle": "When it matters",
    "profiles.inspectorWhenBody": "Agent folders are used only when copying one saved skill. Saving these folders does not scan, copy, overwrite, or delete existing skills.",
    "profiles.listTitle": "Agent folders",
    "profiles.listBody": "Enabled folders appear as copy targets when you copy a saved skill.",
    "profiles.edit": "Edit",
    "profiles.targetPreviewTitle": "Copy target preview",
    "profiles.targetPreviewBody": "This is the list you will choose from when copying a saved skill to an agent.",
    "profiles.enabledSummary": "{enabled}/{total} enabled",
    "profiles.disabledSummary": "{count} disabled",
    "profiles.readyTarget": "Will show as a copy target",
    "profiles.disabledTarget": "Hidden when copying",
    "profiles.noEnabledTargets": "No enabled copy targets yet.",
    "profiles.targetNoteTitle": "What to check",
    "profiles.targetNoteBody": "Keep the path as the folder that the agent itself reads for skills. Change it only when an agent uses a custom skills folder.",
    "profiles.stepConfirmFolders": "Confirm each agent's skills folder.",
    "profiles.stepCopySavedSkill": "Go to Managed Skills, choose one skill, then copy it to an agent.",
    "trust.unreviewed": "Not decided",
    "trust.trusted": "Allowed",
    "trust.reviewed": "Allowed",
    "trust.blocked": "Blocked",
    "trust.effectTitle": "Current result",
    "trust.effectUnreviewed": "Low and medium risk skills can be copied. High risk skills are stopped until you allow or block them.",
    "trust.effectReviewed": "You allow this skill to be copied to agent folders.",
    "trust.effectBlocked": "This skill cannot be copied to agents.",
    "trust.currentAllowed": "Copying is allowed.",
    "trust.currentReviewRequired": "High risk is not decided, so copying is stopped.",
    "trust.currentBlocked": "Blocked by you, so copying is stopped.",
    "governance.managed": "Copied",
    "governance.adopted": "Saved",
    "governance.unmanaged": "Found only",
    "governance.library": "Managed",
    "governance.notPublished": "Not copied to an agent yet.",
    "governance.publishNote": "Copying creates a normal skill folder for the agent. If Skills Manager is removed later, that agent can still read the skill.",
    "governance.manageOnlyNote": "All Skills is for risk and management decisions. Copying to agents happens from Managed Skills.",
    "governance.inLibraryNext": "This skill is already managed. Open it there to choose an agent.",
    "governance.unmanagedNext": "Save this skill first. Then copy the managed version to an agent.",
    "invocation.note": "serialized locks this skill, singleton locks this skill name globally, keyed locks the resource key, and parallel does not lock.",
    "invocation.promptValue": "Simulate {name} invocation",
    "locks.none": "No active lock for this skill.",
    "runs.none": "No invocations yet. Start one above.",
    "risk.none": "No risk findings from the heuristic scanner.",
    "risk.basisTitle": "Static local check",
    "risk.basisBody": "Risk is based on SKILL.md and bundled script previews. It is a review signal, not a final security verdict.",
    "riskFinding.destructive-delete.label": "Destructive delete command",
    "riskFinding.destructive-delete.body": "Matched commands such as rm -rf, rimraf, or recursive Remove-Item.",
    "riskFinding.permission-change.label": "Permission or ownership change",
    "riskFinding.permission-change.body": "Matched chmod, chown, or chgrp usage.",
    "riskFinding.privileged-command.label": "Privileged or system command",
    "riskFinding.privileged-command.body": "Matched sudo, su, launchctl, or Keychain security commands.",
    "riskFinding.network-download.label": "Network download or upload",
    "riskFinding.network-download.body": "Matched curl, wget, fetch, scp, rsync, or similar network access.",
    "riskFinding.secret-access.label": "Secret or credential access",
    "riskFinding.secret-access.body": "Matched environment variables or common secret names such as TOKEN, API_KEY, or PRIVATE_KEY.",
    "riskFinding.sensitive-path.label": "Sensitive local path",
    "riskFinding.sensitive-path.body": "Matched paths such as .ssh, .aws, .kube, Keychain, or private key files.",
    "riskFinding.shell-eval.label": "Dynamic execution",
    "riskFinding.shell-eval.body": "Matched eval, exec, spawn, child_process, subprocess, or osascript.",
    "riskFinding.dynamic-context-command.label": "Dynamic context command",
    "riskFinding.dynamic-context-command.body": "SKILL.md appears to request command output as dynamic context.",
    "riskFinding.bundled-scripts.label": "Bundled script files",
    "riskFinding.bundled-scripts.body": "The skill contains script files that should be checked before copying to an agent.",
    "validation.none": "No validation issues found.",
    "validation.conflict": "Name conflict across: {roots}",
    "dependencies.none": "No dependency hints detected.",
    "files.none": "No files detected.",
    "skills.noMatchesTitle": "No matching skills",
    "skills.noMatchesBody": "Try clearing filters or adding a skills root.",
  },
  zh: {
    "app.tagline": "管理和复制本地 Agent Skills",
    "app.language": "语言",
    "inspector.title": "详情",
    "inspector.reviewTitle": "审查面板",
    "inspector.distributeTitle": "复制面板",
    "inspector.guideTitle": "说明",
    "inspector.resultTitle": "结果",
    "inspector.current": "当前选择",
    "inspector.localState": "本机状态",
    "inspector.nextStep": "下一步",
    "inspector.setupTitle": "本机扫描状态",
    "inspector.importTitle": "导入流程",
    "inspector.importResultTitle": "检查结果",
    "inspector.runtimeTitle": "运行快照",
    "inspector.bridgeTitle": "Bridge 状态",
    "inspector.profilesTitle": "Agent 目录",
    "inspector.ready": "就绪",
    "inspector.reviewNeeded": "需要审查",
    "inspector.published": "已复制",
    "inspector.notInstalled": "未安装",
    "inspector.stepScan": "扫描已有 agent 原生 skill 根目录。",
    "inspector.stepAdopt": "把低风险 skills 保存起来。",
    "inspector.stepReview": "逐个审查高风险 skills。",
    "inspector.stepFinish": "完成设置，同时保留 agent 原生可用性。",
    "inspector.stepPreview": "添加前先检查来源。",
    "inspector.stepInstall": "先保存这个 skill。",
    "inspector.stepPublish": "之后从已纳管 Skills 复制到指定 agent。",
    "inspector.stepProfiles": "确认每个 Agent 从哪个文件夹读取 skills。",
    "nav.setup": "控制台",
    "nav.setupHint": "本机 Agent Skills 总览",
    "nav.skills": "全部 Skills",
    "nav.skillsHint": "扫描结果和风险",
    "nav.library": "已纳管",
    "nav.libraryHint": "已纳管，可复制",
    "nav.import": "获取",
    "nav.importHint": "文件夹 / Git / 压缩包",
    "nav.advanced": "高级",
    "nav.runtime": "运行记录",
    "nav.runtimeHint": "调用历史",
    "nav.bridge": "桥接",
    "nav.bridgeHint": "可选 agent 回传",
    "nav.profiles": "Agent 目录",
    "nav.profilesHint": "复制到哪里",
    "workspace.setup.kicker": "控制台",
    "workspace.setup.title": "本地 Agent Skills 控制台",
    "workspace.setup.subtitle": "统一查看这台 Mac 上各个 Agent 的 skills、风险、已纳管内容和复制目标。",
    "workspace.skills.kicker": "全部 Skills",
    "workspace.skills.title": "全部 Agent Skills",
    "workspace.skills.subtitle": "来自这台 Mac 上各个 Agent skills 文件夹的扫描结果。这里看状态和风险，决定哪些交给 Skills Manager 纳管。",
    "workspace.library.kicker": "已纳管",
    "workspace.library.title": "已纳管 Skills",
    "workspace.library.subtitle": "这些 skills 已由 Skills Manager 纳管，可以复制到任意启用的 Agent 目录。",
    "workspace.import.kicker": "获取",
    "workspace.import.title": "获取 Skills",
    "workspace.import.subtitle": "贴本地文件夹、Git 仓库链接、压缩包，或 GitHub owner/repo 快捷写法。Skills Manager 会先检查来源再保存。",
    "workspace.runtime.kicker": "高级",
    "workspace.runtime.title": "运行记录",
    "workspace.runtime.subtitle": "查看可选的本地调用记录、锁和队列。",
    "workspace.bridge.kicker": "高级",
    "workspace.bridge.title": "Agent 桥接",
    "workspace.bridge.subtitle": "可选 bridge skill，用于让 agent 把托管调用交回 Skills Manager。",
    "workspace.profiles.kicker": "Agent 目录",
    "workspace.profiles.title": "Agent 目录",
    "workspace.profiles.subtitle": "这里只设置每个 Agent 从哪个本机文件夹读取 skills。复制方式会在复制某个 skill 时选择。",
    "home.ctaGet": "获取新 skill",
    "home.ctaDistribute": "复制到 Agent",
    "home.ctaAgents": "Agent 目录",
    "home.discovered": "本机已发现",
    "home.managed": "已纳管",
    "home.review": "需处理",
    "home.agents": "复制目标",
    "home.nextTitle": "建议处理",
    "home.nextReviewTitle": "{count} 个需处理",
    "home.nextReviewBody": "高风险 skill 复制到 Agent 前，需要选择允许或阻止。",
    "home.nextManageTitle": "全部 {count} 个 Skills",
    "home.nextManageBody": "查看从所有本机 Agent 目录扫描到的 skills。",
    "home.nextLibraryTitle": "已纳管 {count} 个",
    "home.nextLibraryBody": "查看已经由 Skills Manager 保存的 skills。",
    "home.nextImportTitle": "获取新 skill",
    "home.nextImportBody": "贴本地文件夹、Git 链接或压缩包，先检查再保存。",
    "home.nextDistributionTitle": "{count} 个 Agent 目录",
    "home.nextDistributionBody": "确认复制 skill 时会放到哪些 Agent 目录。",
    "home.statusTitle": "当前状态",
    "home.metricAgents": "Agent",
    "home.metricDiscovered": "已发现位置",
    "home.metricManaged": "已纳管",
    "home.metricNeedsAction": "需处理",
    "home.metricCopyGaps": "复制缺口",
    "home.agentMapTitle": "Agent 分布",
    "home.skillMapTitle": "Skill 分布",
    "home.actionsTitle": "需要处理",
    "home.columnAgent": "Agent",
    "home.columnSkills": "Skills",
    "home.columnManaged": "已纳管",
    "home.columnRisk": "风险",
    "home.columnUnique": "独有",
    "home.columnCopied": "已复制",
    "home.columnFolder": "目录",
    "home.folderReady": "正常",
    "home.folderMissing": "不可用",
    "home.noSkillsForAgent": "0",
    "home.skillColumnSkill": "Skill",
    "home.skillColumnAgents": "在哪些 Agent 可用",
    "home.skillColumnState": "风险 / 纳管",
    "home.skillMore": "另有 {count} 个",
    "home.foundOnly": "未纳管",
    "home.instanceCount": "{count} 个位置",
    "home.copyGap": "还可复制到 {count} 个 Agent",
    "home.noCopyGap": "已覆盖需要的 Agent",
    "home.actionHighRisk": "{count} 个高风险 skill 需要复制决定",
    "home.actionHighRiskBody": "进入全部 Skills，先选择允许或阻止，再决定是否复制。",
    "home.actionCopyGaps": "{count} 个已纳管 skill 还没复制到任何 Agent",
    "home.actionCopyGapsBody": "进入已纳管 Skills，把常用 skill 复制到需要的 Agent。",
    "home.actionMissingFolders": "{count} 个 Agent 目录不可用",
    "home.actionMissingFoldersBody": "进入 Agent 目录，先修正路径，再复制 skill。",
    "home.actionConflicts": "{count} 个同名或冲突 skill",
    "home.actionConflictsBody": "进入全部 Skills，对比来自不同 Agent 目录的版本。",
    "home.actionReady": "当前没有紧急关系问题",
    "home.actionReadyBody": "Agent 目录、已纳管 Skills 和复制目标目前看起来正常。",
    "summary.skills": "Skills",
    "summary.roots": "根目录",
    "summary.conflicts": "冲突",
    "sections.scannedRoots": "扫描根目录",
    "sections.governance": "本机控制",
    "sections.distribution": "下一步",
    "sections.invocationRuntime": "运行测试",
    "sections.activeLocks": "当前锁",
    "sections.recentInvocations": "最近调用",
    "sections.riskFindings": "风险发现",
    "sections.validation": "校验",
    "sections.dependencies": "依赖",
    "sections.files": "文件",
    "sections.frontmatter": "Frontmatter",
    "sections.instructions": "指令预览",
    "sections.publishFromLibrary": "选择 Agent",
    "sections.publishedAgents": "已复制位置",
    "sections.distributionTargets": "Agent 目录",
    "sections.runtimeRuns": "最近运行",
    "sections.policy": "复制决定",
    "sections.bridge": "Bridge",
    "sections.profiles": "Agent 目录",
    "actions.refresh": "扫描本机",
    "actions.preview": "检查这个 skill",
    "actions.install": "保存 skill",
    "actions.viewSavedSkill": "查看已纳管",
    "actions.finish": "完成",
    "actions.adoptLowRisk": "保存安全项",
    "actions.adoptSelected": "添加已选（{count}）",
    "actions.saveMode": "保存",
    "actions.publishManagedMirror": "复制到 Agent",
    "actions.copyToProfile": "复制到 {profile}",
    "actions.updateProfileCopy": "更新 {profile} 副本",
    "actions.copyAgainToProfile": "重新复制到 {profile}",
    "actions.republish": "更新副本",
    "actions.unpublish": "移除副本",
    "actions.installBridge": "设置桥接",
    "actions.saveTrust": "保存决定",
    "actions.saveProfile": "保存设置",
    "actions.addProfile": "添加目录",
    "actions.deleteProfile": "删除目录",
    "actions.chooseFolder": "选择文件夹",
    "actions.resetProfiles": "恢复默认目录",
    "actions.adoptIntoLibrary": "保存 skill",
    "actions.openInLibrary": "去已纳管复制",
    "actions.startInvocation": "测试运行",
    "actions.complete": "完成",
    "filters.search": "搜索 skill、工具、路径",
    "filters.allRisks": "全部风险",
    "filters.allTools": "全部工具",
    "risk.high": "高",
    "risk.medium": "中",
    "risk.low": "低",
    "risk.label": "{level}风险",
    "labels.source": "来源",
    "labels.status": "状态",
    "labels.fingerprint": "指纹",
    "labels.library": "保存状态",
    "labels.path": "路径",
    "labels.updated": "更新时间",
    "labels.files": "文件",
    "labels.version": "版本",
    "labels.libraryPath": "保存位置",
    "labels.agent": "Agent 名称",
    "labels.publishToAgent": "复制目标",
    "labels.concurrency": "并发策略",
    "labels.resourceKey": "资源键",
    "labels.prompt": "提示词",
    "labels.noLock": "无锁",
    "labels.blockedBy": "被 {runId} 阻塞",
    "labels.unknown": "未知",
    "labels.trust": "复制决定",
    "labels.notes": "备注（可选）",
    "labels.reviewer": "处理人",
    "labels.enabled": "使用这个目录",
    "labels.skillRoot": "Skills 文件夹",
    "labels.profileName": "Agent 名称",
    "labels.adapter": "Agent 类型",
    "labels.resolvedCommit": "解析 commit",
    "labels.diff": "差异",
    "status.loading": "正在加载本地 skills...",
    "status.scanning": "正在扫描本地 skill 根目录...",
    "status.scanned": "已扫描 {count} 个可用根目录，时间 {time}。",
    "status.creatingInvocation": "正在创建模拟调用...",
    "status.invocationFailed": "调用失败：{status}",
    "status.invocationCreated": "调用 {id} 当前状态为 {status}。",
    "status.completing": "正在完成 {id}...",
    "status.completeFailed": "完成失败：{status}",
    "status.invocationCompleted": "调用 {id} 已完成。{promoted}",
    "status.promoted": " 已推进 {count} 个排队调用。",
    "status.runtimeFailed": "运行时加载失败：{status}",
    "status.scanFailed": "扫描失败：{status}",
    "status.libraryFailed": "已纳管 Skills 加载失败：{status}",
    "status.firstRunFailed": "首次导入加载失败：{status}",
    "status.selectSkillToAdopt": "请至少选择一个要保存的已有 skill。",
    "status.adoptingLowRisk": "正在保存低风险已有 skills...",
    "status.adoptingSelected": "正在保存已选择的已有 skills...",
    "status.firstRunAdoptFailed": "保存失败：{status}",
    "status.firstRunAdopted": "已保存 {adopted} 个已有 skill，跳过 {skipped} 个。",
    "status.finishingFirstRun": "正在完成首次导入...",
    "status.finishFailed": "完成失败：{status}",
    "status.firstRunFinished": "首次导入已完成。",
    "status.adoptingSkill": "正在保存 skill...",
    "status.adoptFailed": "保存失败：{status}",
    "status.skillAdopted": "Skill 已保存。",
    "status.publishingSkill": "正在复制到 agent...",
    "status.publishFailed": "复制失败：{status}",
    "status.publishedTo": "已复制到 {profile}。",
    "status.selectLibraryRecord": "请先选择一个已保存 skill。",
    "status.publishingRecord": "正在把已保存 skill 复制到 agent...",
    "status.publishedRecord": "{record} 已复制到 {profile}。",
    "status.savingMode": "正在保存调用模式...",
    "status.saveFailed": "保存失败：{status}",
    "status.modeSaved": "调用模式已保存为 {mode}。",
    "status.enterSource": "请先输入本地文件夹、Git 仓库或压缩包来源。",
    "status.analyzeFirst": "先检查这个 skill，再保存。",
    "status.previewingSource": "正在检查来源...",
    "status.previewFailed": "检查失败：{status}",
    "status.previewed": "已检查 {name}。",
    "status.aiFailed": "AI 解读失败：{status}",
    "status.aiInterpreted": "AI 解读已完成。",
    "status.aiTested": "模型连接正常。",
    "status.aiTestFailed": "模型连接失败：{status}",
    "status.aiIncomplete": "请先填写 Base URL、模型和 API Key。",
    "status.aiNotEnabled": "请先启用 AI 解读。",
    "status.installingSource": "正在保存 skill...",
    "status.installFailed": "安装失败：{status}",
    "status.installedSource": "已保存 {name}。",
    "status.sourceAlreadySaved": "{name} 已经保存。",
    "status.savingTrust": "正在保存复制决定...",
    "status.trustSaved": "复制决定已保存为 {status}。",
    "status.installingBridge": "正在安装 bridge skill...",
    "status.bridgeInstalled": "Bridge skill 已保存。",
    "status.savingProfile": "正在保存 Agent 目录...",
    "status.profileSaved": "Agent 目录已保存。",
    "status.profileDeleted": "Agent 目录已删除。",
    "status.folderPickerUnavailable": "选择文件夹仅在 Mac App 中可用。当前可以直接粘贴文件夹路径。",
    "status.folderPickerFailed": "选择文件夹失败：{status}",
    "status.republishingRecord": "正在更新副本...",
    "status.unpublishingRecord": "正在移除副本...",
    "status.recordUnpublished": "已从 {profile} 移除副本。",
    "setup.doneTitle": "本地控制台已就绪",
    "setup.doneBody": "这台 Mac 已完成扫描。你可以在控制台查看全部本机 Agent Skills、处理风险、纳管可信 skills，并复制到 Agent。",
    "firstRun.title": "保存已有 skills",
    "firstRun.body": "先审查 agent 目录里已有的 skills，再把安全项保存起来。这里不会复制、覆盖或删除任何原目录内容。",
    "firstRun.discovered": "已发现",
    "firstRun.ready": "可保存",
    "firstRun.lowRisk": "低风险",
    "firstRun.review": "需审查",
    "firstRun.noSkills": "扫描根目录中没有发现已有 skills。",
    "firstRun.rootSummary": "{count} 个 skill / {ready} 个可保存 / {high} 个高风险",
    "firstRun.reviewIndividually": "逐个审查",
    "library.emptyTitle": "还没有保存的 Skills",
    "library.emptyBody": "先从本地文件夹、Git 仓库或压缩包获取一个 skill，然后再复制到 agent。",
    "library.publicationCount": "已复制到 {count} 个 agent",
    "library.notPublished": "尚未复制到任何 agent。",
    "library.publishNote": "点击某个 Agent，就会把已保存版本复制到它的本地 skills 文件夹。",
    "library.availableTargets": "选择要复制到的 Agent",
    "library.copyMethodTitle": "这个 skill 的复制方式",
    "library.copyMethodHelp": "建议保持安全副本。普通复制和链接到原目录只适合你明确知道目标目录需要用另一种写入方式时。",
    "library.publishedEmptyNext": "准备好后，选择一个 Agent 复制过去。",
    "library.targetPath": "目标文件夹",
    "library.lastCopied": "上次复制",
    "library.copyMode": "复制方式",
    "library.target.available": "可复制",
    "library.target.managed": "已复制",
    "library.target.outdated": "需要更新",
    "library.target.stale": "副本缺失",
    "library.target.conflict": "已有 skill",
    "library.target.managedOther": "被其他记录占用",
    "library.conflictHelp": "Skills Manager 不会覆盖用户自己的 skill 文件夹。请先移除或重命名已有文件夹。",
    "library.outdatedHelp": "目标副本和当前保存版本不一致。可以点击更新副本。",
    "library.staleHelp": "记录显示曾经复制过，但目标文件夹已不存在。可以重新复制或移除这条记录。",
    "import.source": "Skill 来源",
    "import.sourcePlaceholder": "本地文件夹、Git 链接、.zip/.tar，或 owner/repo",
    "import.ref": "版本或分支（可不填）",
    "import.refPlaceholder": "默认留空；也可以填 tag、branch 或 commit",
    "import.subdir": "来源里的 skill 文件夹（可不填）",
    "import.subdirPlaceholder": "skill 不在仓库根目录时才需要填",
    "import.advanced": "可选设置，一般不用填",
    "import.advancedNote": "大多数 skills 不需要这些设置。只有来源包含多个版本或多个文件夹时，才需要手动指定。",
    "import.replace": "允许替换已保存的同名 skill",
    "import.pin": "固定到本次检查到的 commit",
    "import.historyTitle": "最近来源",
    "import.historyBody": "选择一个最近来源，可以再次检查。",
    "import.historyEmpty": "检查过的来源会显示在这里。",
    "import.historyClear": "清空",
    "sourcePreview.analyzed": "已检查",
    "sourcePreview.added": "已保存",
    "sourcePreview.summaryTitle": "来源摘要",
    "sourcePreview.localCheckTitle": "本地检查",
    "sourcePreview.sourcePath": "来源",
    "sourcePreview.checkStats": "检查内容",
    "sourcePreview.aiTitle": "AI 解读",
    "sourcePreview.aiUnavailable": "尚未配置",
    "sourcePreview.aiBody": "后续可用 AI 总结这个 skill 做什么、解释风险位置，并建议是否保存或复制。没有模型时，本地检查仍可离线使用。",
    "sourcePreview.aiNext": "下一步：添加模型设置后，按需运行 AI 解读。",
    "sourcePreview.aiReady": "已配置",
    "sourcePreview.aiRun": "运行 AI 解读",
    "sourcePreview.aiRunning": "解读中...",
    "sourcePreview.aiResult": "AI 结果",
    "sourcePreview.aiSummary": "它做什么",
    "sourcePreview.aiRisk": "风险解释",
    "sourcePreview.aiRecommendation": "建议操作",
    "sourcePreview.filesChecked": "已检查 {count} 个文件",
    "sourcePreview.scriptsFound": "{count} 个脚本文件",
    "sourcePreview.noValidationIssues": "没有校验问题。",
    "sourcePreview.validationTitle": "校验",
    "ai.settingsTitle": "AI 解读设置（可选）",
    "ai.settingsBody": "可以选择模型提供方预设，也可以使用任意 OpenAI-compatible 接口。API Key 只保存在这台 Mac，本页面不会再次显示原文。",
    "ai.enabled": "启用 AI 解读",
    "ai.provider": "模型提供方",
    "ai.providerCustom": "自定义 OpenAI-compatible",
    "ai.providerDeepseek": "DeepSeek",
    "ai.providerQwenDashscope": "通义千问 / 阿里云百炼",
    "ai.providerKimi": "Kimi / 月之暗面",
    "ai.providerZhipu": "GLM / 智谱",
    "ai.baseUrl": "Base URL",
    "ai.baseUrlPlaceholder": "https://api.openai.com/v1",
    "ai.model": "模型",
    "ai.modelPlaceholder": "gpt-5.5",
    "ai.apiKey": "API Key",
    "ai.apiKeyPlaceholder": "留空表示保留已有 Key",
    "ai.save": "保存 AI 设置",
    "ai.test": "测试连接",
    "ai.testing": "测试中...",
    "ai.testRunning": "正在测试已保存的模型设置...",
    "ai.testSuccess": "连接正常：{provider} / {model}。",
    "ai.saved": "AI 设置已保存。",
    "ai.keySet": "API Key 已设置。",
    "ai.keyMissing": "API Key 未设置。",
    "suggestion.title": "建议",
    "suggestion.noPreview": "贴上来源后，在这里检查。",
    "suggestion.safe": "看起来可以保存。",
    "suggestion.review": "保存或复制前建议先审查风险项。",
    "suggestion.blocked": "校验问题解决前，不建议复制这个 skill。",
    "suggestion.addNext": "下一步：先保存，再从已纳管 Skills 复制到 Agent。",
    "suggestion.inspectNext": "下一步：先查看预览里的风险和校验结果。",
    "empty.selectSkillTitle": "选择一个 skill",
    "empty.selectSkillBody": "查看元数据、文件、风险提示和本地路径。",
    "empty.selectLibraryTitle": "选择一个已保存 skill",
    "empty.selectLibraryBody": "查看它已复制到哪些 agent，并继续复制到指定 agent。",
    "empty.setupTitle": "本地 Agent Skills 控制台",
    "empty.setupBody": "扫描所有本机 Agent skills 文件夹后，在这里查看总览、风险和后续处理建议。",
    "empty.importTitle": "导入工作区",
    "empty.importBody": "先检查本地文件夹、Git 仓库或压缩包，再保存。",
    "empty.runtimeTitle": "运行协调工作区",
    "empty.runtimeBody": "选择有调用历史的 skill 后，这里会显示运行细节。",
    "common.noDescription": "暂无描述。",
    "common.noRiskFindings": "没有风险发现",
    "common.notInLibrary": "未保存",
    "common.none": "（无）",
    "common.empty": "（空）",
    "common.truncated": "指令内容较大，已由本地 API 截断。",
    "common.truncatedMarker": "...已截断...",
    "root.available": "可用",
    "root.missing": "缺失",
    "runtime.running": "运行中",
    "runtime.queued": "排队中",
    "runtime.locks": "锁",
    "runtime.runs": "运行记录",
    "runtime.unavailable": "运行时不可用",
    "runtime.noRuns": "还没有调用运行记录。",
    "bridge.notInstalled": "Bridge skill 尚未安装。",
    "bridge.installed": "Bridge skill 已安装并允许复制。",
    "bridge.body": "这是可选辅助 skill，用于让 agent 在需要时回调 Skills Manager。",
    "profiles.disabled": "已禁用",
    "profiles.enabled": "已启用",
    "profiles.none": "还没有启用的 Agent 目录。",
    "profiles.resetNote": "重置会恢复 Claude、Codex 和 OpenClaw 的默认 skills 文件夹。",
    "profiles.addTitle": "添加 Agent 目录",
    "profiles.custom": "自定义",
    "profiles.default": "默认",
    "profiles.deleteConfirm": "删除这个自定义 Agent 目录？",
    "profiles.namePlaceholder": "我的 Agent",
    "profiles.pathPlaceholder": "~/my-agent/skills",
    "profiles.inspectorTitle": "这里用来做什么？",
    "profiles.inspectorBody": "这里不是账号连接。它只告诉 Skills Manager：复制某个 skill 时，应该写入哪些本机文件夹。",
    "profiles.inspectorWhenTitle": "什么时候会用到？",
    "profiles.inspectorWhenBody": "只有从已纳管 Skills 复制某个 skill 时，才会用到这些目录。保存目录不会扫描、复制、覆盖或删除已有 skills。",
    "profiles.listTitle": "Agent 目录",
    "profiles.listBody": "已启用的目录会在复制 skill 时作为目标出现。",
    "profiles.edit": "编辑",
    "profiles.targetPreviewTitle": "复制目标预览",
    "profiles.targetPreviewBody": "这里显示复制已保存 skill 时，用户真正会选择的 Agent 目标。",
    "profiles.enabledSummary": "{enabled}/{total} 已启用",
    "profiles.disabledSummary": "{count} 个已禁用",
    "profiles.readyTarget": "复制时会出现",
    "profiles.disabledTarget": "复制时隐藏",
    "profiles.noEnabledTargets": "还没有启用的复制目标。",
    "profiles.targetNoteTitle": "需要确认什么",
    "profiles.targetNoteBody": "路径应保持为该 Agent 自己读取 skills 的文件夹。只有 Agent 使用自定义 skills 文件夹时才需要修改。",
    "profiles.stepConfirmFolders": "确认每个 Agent 的 skills 文件夹。",
    "profiles.stepCopySavedSkill": "进入已纳管 Skills，选择一个 skill，再复制到目标 Agent。",
    "trust.unreviewed": "未决定",
    "trust.trusted": "允许复制",
    "trust.reviewed": "允许复制",
    "trust.blocked": "阻止复制",
    "trust.effectTitle": "当前结果",
    "trust.effectUnreviewed": "低/中风险可以复制；高风险会先拦下，直到你选择允许或阻止。",
    "trust.effectReviewed": "你允许这个 skill 复制到 agent 目录。",
    "trust.effectBlocked": "这个 skill 不能复制到 agent。",
    "trust.currentAllowed": "可以复制。",
    "trust.currentReviewRequired": "高风险尚未处理，暂不能复制。",
    "trust.currentBlocked": "已被你阻止，不能复制。",
    "governance.managed": "已复制",
    "governance.adopted": "已纳管",
    "governance.unmanaged": "未纳管",
    "governance.library": "已纳管",
    "governance.notPublished": "尚未复制到任何 agent。",
    "governance.publishNote": "复制会创建 agent 原生 skill 目录。即使之后移除 Skills Manager，该 agent 仍可读取此 skill。",
    "governance.manageOnlyNote": "全部 Skills 负责查看风险和决定是否纳管；复制到 Agent 请在已纳管 Skills 完成。",
    "governance.inLibraryNext": "这个 skill 已纳管。进入已纳管 Skills 后选择 Agent。",
    "governance.unmanagedNext": "先保存这个 skill，再从已纳管 Skills 复制到 Agent。",
    "invocation.note": "serialized 锁定当前 skill，singleton 按 skill 名全局锁定，keyed 锁定资源键，parallel 不加锁。",
    "invocation.promptValue": "模拟调用 {name}",
    "locks.none": "此 skill 当前没有活跃锁。",
    "runs.none": "还没有调用记录。可先在上方开始一次调用。",
    "risk.none": "启发式扫描未发现风险。",
    "risk.basisTitle": "本地静态检查",
    "risk.basisBody": "风险来自 SKILL.md 和随附脚本预览的启发式匹配。它是审查信号，不是最终安全结论。",
    "riskFinding.destructive-delete.label": "破坏性删除命令",
    "riskFinding.destructive-delete.body": "匹配到 rm -rf、rimraf 或递归 Remove-Item 等命令。",
    "riskFinding.permission-change.label": "权限或所有权变更",
    "riskFinding.permission-change.body": "匹配到 chmod、chown 或 chgrp。",
    "riskFinding.privileged-command.label": "提权或系统命令",
    "riskFinding.privileged-command.body": "匹配到 sudo、su、launchctl 或 Keychain security 命令。",
    "riskFinding.network-download.label": "网络下载或上传",
    "riskFinding.network-download.body": "匹配到 curl、wget、fetch、scp、rsync 或类似网络访问。",
    "riskFinding.secret-access.label": "密钥或凭据访问",
    "riskFinding.secret-access.body": "匹配到环境变量或 TOKEN、API_KEY、PRIVATE_KEY 等常见密钥名。",
    "riskFinding.sensitive-path.label": "敏感本地路径",
    "riskFinding.sensitive-path.body": "匹配到 .ssh、.aws、.kube、Keychain 或私钥文件路径。",
    "riskFinding.shell-eval.label": "动态执行",
    "riskFinding.shell-eval.body": "匹配到 eval、exec、spawn、child_process、subprocess 或 osascript。",
    "riskFinding.dynamic-context-command.label": "动态上下文命令",
    "riskFinding.dynamic-context-command.body": "SKILL.md 似乎要求读取命令输出作为动态上下文。",
    "riskFinding.bundled-scripts.label": "随附脚本文件",
    "riskFinding.bundled-scripts.body": "该 skill 包含脚本文件，复制到 Agent 前应审查内容。",
    "validation.none": "未发现校验问题。",
    "validation.conflict": "名称冲突：{roots}",
    "dependencies.none": "未检测到依赖提示。",
    "files.none": "未检测到文件。",
    "skills.noMatchesTitle": "没有匹配的 skills",
    "skills.noMatchesBody": "可以清空筛选条件，或添加新的 skills 根目录。",
  },
};

const AI_PROVIDER_PRESETS = {
  "openai-compatible": {
    baseUrl: "https://api.openai.com/v1",
    model: "gpt-5.5",
  },
  deepseek: {
    baseUrl: "https://api.deepseek.com",
    model: "deepseek-v4-flash",
  },
  "qwen-dashscope": {
    baseUrl: "https://dashscope.aliyuncs.com/compatible-mode/v1",
    model: "qwen-plus",
  },
  kimi: {
    baseUrl: "https://api.moonshot.cn/v1",
    model: "kimi-k2.7-code",
  },
  zhipu: {
    baseUrl: "https://open.bigmodel.cn/api/paas/v4",
    model: "glm-5.2",
  },
};

const state = {
  catalog: null,
  runtime: null,
  library: null,
  profiles: null,
  firstRun: null,
  filteredSkills: [],
  firstRunSelected: new Set(),
  language:
    localStorage.getItem("skillsmanager.language") ||
    (navigator.language?.toLowerCase().startsWith("zh") ? "zh" : "en"),
  view: localStorage.getItem("skillsmanager.view") || "setup",
  selectionType: "skill",
  selectedId: null,
  selectedRecordId: null,
  sourcePreview: null,
  sourcePreviewMode: "preview",
  sourceHistory: readSourceHistory(),
  aiSettings: null,
  aiInterpretation: null,
  aiSkillInterpretations: new Map(),
  aiLibraryInterpretations: new Map(),
  aiBusy: false,
  aiSkillBusyId: null,
  aiLibraryBusyId: null,
  aiTesting: false,
  importBusy: false,
  filters: {
    search: "",
    risk: "all",
    tool: "all",
  },
};

const elements = {
  shell: document.querySelector(".shell"),
  languageSelect: document.querySelector("#languageSelect"),
  viewButtons: [...document.querySelectorAll("[data-view]")],
  viewPanels: [...document.querySelectorAll("[data-view-panel]")],
  workspaceKicker: document.querySelector("#workspaceKicker"),
  workspaceTitle: document.querySelector("#workspaceTitle"),
  workspaceSubtitle: document.querySelector("#workspaceSubtitle"),
  skillCount: document.querySelector("#skillCount"),
  rootCount: document.querySelector("#rootCount"),
  conflictCount: document.querySelector("#conflictCount"),
  rootList: document.querySelector("#rootList"),
  governanceStats: document.querySelector("#governanceStats"),
  libraryList: document.querySelector("#libraryList"),
  sourceImportForm: document.querySelector("#sourceImportForm"),
  sourceInput: document.querySelector("#sourceInput"),
  previewSourceButton: document.querySelector("#previewSourceButton"),
  installSourceButton: document.querySelector("#installSourceButton"),
  sourceHistory: document.querySelector("#sourceHistory"),
  aiSettingsForm: document.querySelector("#aiSettingsForm"),
  testAiSettingsButton: document.querySelector("#testAiSettingsButton"),
  aiSettingsFeedback: document.querySelector("#aiSettingsFeedback"),
  sourcePreview: document.querySelector("#sourcePreview"),
  runtimeHome: document.querySelector("#runtimeHome"),
  runtimeStats: document.querySelector("#runtimeStats"),
  runtimeRunList: document.querySelector("#runtimeRunList"),
  bridgePanel: document.querySelector("#bridgePanel"),
  profilesPanel: document.querySelector("#profilesPanel"),
  searchInput: document.querySelector("#searchInput"),
  riskFilter: document.querySelector("#riskFilter"),
  toolFilter: document.querySelector("#toolFilter"),
  refreshButton: document.querySelector("#refreshButton"),
  statusLine: document.querySelector("#statusLine"),
  firstRunImport: document.querySelector("#firstRunImport"),
  firstRunDone: document.querySelector("#firstRunDone"),
  skillList: document.querySelector("#skillList"),
  detailPane: document.querySelector(".detail-pane"),
  inspectorTitle: document.querySelector("#inspectorTitle"),
  inspectorContext: document.querySelector("#inspectorContext"),
  emptyDetail: document.querySelector("#emptyDetail"),
  emptyDetailTitle: document.querySelector("#emptyDetailTitle"),
  emptyDetailBody: document.querySelector("#emptyDetailBody"),
  skillDetail: document.querySelector("#skillDetail"),
};

elements.languageSelect.value = state.language;

elements.languageSelect.addEventListener("change", () => {
  setLanguage(elements.languageSelect.value);
});

for (const button of elements.viewButtons) {
  button.addEventListener("click", () => {
    setView(button.getAttribute("data-view") || "skills");
  });
}

elements.searchInput.addEventListener("input", () => {
  state.filters.search = elements.searchInput.value.trim().toLowerCase();
  applyFilters();
});

elements.riskFilter.addEventListener("change", () => {
  state.filters.risk = elements.riskFilter.value;
  applyFilters();
});

elements.toolFilter.addEventListener("change", () => {
  state.filters.tool = elements.toolFilter.value;
  applyFilters();
});

elements.refreshButton.addEventListener("click", () => {
  loadCatalog();
});

elements.previewSourceButton.addEventListener("click", () => {
  previewSource();
});

elements.installSourceButton.addEventListener("click", () => {
  installSource();
});

elements.sourceImportForm.addEventListener("input", handleSourceFormChanged);
elements.sourceImportForm.addEventListener("change", handleSourceFormChanged);

elements.sourceHistory?.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) return;
  const clearButton = event.target.closest("[data-clear-source-history]");
  if (clearButton) {
    state.sourceHistory = [];
    writeSourceHistory(state.sourceHistory);
    renderSourceHistory();
    return;
  }
  const button = event.target.closest("[data-source-history-index]");
  if (!button) return;
  const item = state.sourceHistory[Number(button.getAttribute("data-source-history-index"))];
  if (!item) return;
  fillSourceForm(item);
});

elements.aiSettingsForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  await saveAiSettings();
});

elements.testAiSettingsButton?.addEventListener("click", async () => {
  await testAiSettings();
});

elements.aiSettingsForm?.addEventListener("change", (event) => {
  if (!(event.target instanceof HTMLSelectElement) || event.target.name !== "provider") return;
  applyAiProviderPreset(event.target.value);
  setAiSettingsFeedback("", "neutral");
});

elements.sourcePreview.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-run-ai]");
  if (!button) return;
  await runAiInterpretation();
});

elements.bridgePanel?.addEventListener("click", async (event) => {
  if (!(event.target instanceof Element)) return;
  if (event.target.closest("[data-install-bridge]")) {
    await installBridgeSkill();
  }
});

elements.profilesPanel?.addEventListener("submit", async (event) => {
  if (!(event.target instanceof HTMLFormElement)) return;
  event.preventDefault();
  const formData = new FormData(event.target);
  if (event.target.matches("[data-profile-create]")) {
    await createProfile({
      name: formData.get("name"),
      skillRoot: formData.get("skillRoot"),
      enabled: true,
    });
    return;
  }
  if (!event.target.matches("[data-profile-form]")) return;
  await saveProfile(event.target.getAttribute("data-profile-form"), {
    name: formData.get("name"),
    skillRoot: formData.get("skillRoot"),
    enabled: Boolean(formData.get("enabled")),
  });
});

elements.profilesPanel?.addEventListener("click", async (event) => {
  if (!(event.target instanceof Element)) return;
  if (event.target.closest("[data-reset-profiles]")) {
    await resetProfileSettings();
  }
  const folderButton = event.target.closest("[data-pick-skill-root]");
  if (folderButton) {
    await pickSkillRoot(folderButton);
    return;
  }
  const deleteButton = event.target.closest("[data-delete-profile]");
  if (deleteButton) {
    const profileId = deleteButton.getAttribute("data-delete-profile");
    if (profileId && window.confirm(t("profiles.deleteConfirm"))) {
      await deleteProfile(profileId);
    }
  }
});

elements.firstRunImport.addEventListener("change", (event) => {
  if (!(event.target instanceof HTMLInputElement)) return;
  if (!event.target.matches("[data-first-run-select]")) return;
  const skillId = event.target.getAttribute("data-first-run-select");
  if (!skillId) return;
  if (event.target.checked) {
    state.firstRunSelected.add(skillId);
  } else {
    state.firstRunSelected.delete(skillId);
  }
  renderFirstRunImport();
});

elements.firstRunImport.addEventListener("click", async (event) => {
  if (!(event.target instanceof Element)) return;
  if (event.target.closest("[data-first-run-adopt-low]")) {
    await adoptFirstRun({ mode: "low-risk" });
    return;
  }
  if (event.target.closest("[data-first-run-adopt-selected]")) {
    await adoptFirstRun({
      mode: "selected",
      skillIds: [...state.firstRunSelected],
    });
    return;
  }
  if (event.target.closest("[data-first-run-complete]")) {
    await completeFirstRun();
  }
});

elements.firstRunDone?.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) return;
  const button = event.target.closest("[data-home-view]");
  if (!button) return;
  setView(button.getAttribute("data-home-view") || "skills");
});

elements.skillDetail.addEventListener("submit", async (event) => {
  if (!(event.target instanceof HTMLFormElement) || event.target.id !== "invokeForm") return;
  event.preventDefault();
  const formData = new FormData(event.target);
  await startInvocation({
    skillId: state.selectedId,
    agentId: formData.get("agentId"),
    policy: formData.get("policy"),
    resourceKey: formData.get("resourceKey"),
    prompt: formData.get("prompt"),
  });
});

elements.skillDetail.addEventListener("submit", async (event) => {
  if (!(event.target instanceof HTMLFormElement) || event.target.id !== "libraryPublishForm") return;
  event.preventDefault();
  const submitter = event.submitter instanceof HTMLElement ? event.submitter : null;
  const formData = new FormData(event.target);
  await publishLibraryRecord({
    recordId: state.selectedRecordId,
    profileId: submitter?.getAttribute("data-profile-id") || formData.get("profileId"),
    invocationMode: "native",
    publishMode: formData.get("publishMode"),
  });
});

elements.skillDetail.addEventListener("submit", async (event) => {
  if (!(event.target instanceof HTMLFormElement) || event.target.id !== "trustForm") return;
  event.preventDefault();
  const formData = new FormData(event.target);
  await saveTrust({
    type: state.selectionType,
    skillId: state.selectedId,
    recordId: state.selectedRecordId,
    status: formData.get("status"),
    notes: formData.get("notes"),
    reviewer: formData.get("reviewer"),
  });
});

elements.skillDetail.addEventListener("click", async (event) => {
  if (!(event.target instanceof Element)) return;
  const aiButton = event.target.closest("[data-run-skill-ai]");
  if (aiButton) {
    await runSkillAiInterpretation(aiButton.getAttribute("data-run-skill-ai"));
    return;
  }
  const libraryAiButton = event.target.closest("[data-run-library-ai]");
  if (libraryAiButton) {
    await runLibraryAiInterpretation(libraryAiButton.getAttribute("data-run-library-ai"));
    return;
  }
  const openLibraryButton = event.target.closest("[data-open-library-record]");
  if (openLibraryButton) {
    state.selectionType = "library";
    state.selectedRecordId = openLibraryButton.getAttribute("data-open-library-record");
    setView("library");
    renderLibrary();
    renderSelectedDetail();
    return;
  }
  const button = event.target.closest("[data-adopt-skill]");
  if (!button) return;
  const skill = (state.catalog?.skills || []).find((item) => item.id === state.selectedId);
  const mode = skill?.governance?.invocationMode || "native";
  await adoptSkill({
    skillId: state.selectedId,
    invocationMode: mode,
  });
});

elements.skillDetail.addEventListener("click", async (event) => {
  if (!(event.target instanceof Element)) return;
  const button = event.target.closest("[data-complete-run-id]");
  if (!button) return;
  await completeInvocation(button.getAttribute("data-complete-run-id"));
});

elements.skillDetail.addEventListener("click", async (event) => {
  if (!(event.target instanceof Element)) return;
  const republishButton = event.target.closest("[data-republish-record]");
  if (republishButton) {
    await republishLibraryRecord({
      recordId: state.selectedRecordId,
      profileId: republishButton.getAttribute("data-profile-id"),
    });
    return;
  }
  const unpublishButton = event.target.closest("[data-unpublish-record]");
  if (unpublishButton) {
    await unpublishLibraryRecord({
      recordId: state.selectedRecordId,
      profileId: unpublishButton.getAttribute("data-profile-id"),
    });
  }
});

applyStaticTranslations();
setStatus(t("status.loading"));
setView(state.view, { persist: false });
await loadCatalog();

async function loadCatalog() {
  setStatus(t("status.scanning"));
  elements.refreshButton.disabled = true;
  try {
    const [skillsResponse, runtimeResponse, libraryResponse, firstRunResponse, profilesResponse, aiResponse] = await Promise.all([
      fetch("/api/skills"),
      fetch("/api/runtime"),
      fetch("/api/library"),
      fetch("/api/first-run"),
      fetch("/api/profiles"),
      fetch("/api/ai/settings"),
    ]);
    if (!skillsResponse.ok) throw new Error(t("status.scanFailed", { status: skillsResponse.status }));
    if (!runtimeResponse.ok) throw new Error(t("status.runtimeFailed", { status: runtimeResponse.status }));
    if (!libraryResponse.ok) throw new Error(t("status.libraryFailed", { status: libraryResponse.status }));
    if (!firstRunResponse.ok) throw new Error(t("status.firstRunFailed", { status: firstRunResponse.status }));
    if (!profilesResponse.ok) throw new Error(t("status.runtimeFailed", { status: profilesResponse.status }));
    if (!aiResponse.ok) throw new Error(t("status.runtimeFailed", { status: aiResponse.status }));
    state.catalog = await skillsResponse.json();
    state.runtime = await runtimeResponse.json();
    state.library = await libraryResponse.json();
    state.firstRun = await firstRunResponse.json();
    state.profiles = await profilesResponse.json();
    state.aiSettings = await aiResponse.json();
    reconcileFirstRunSelection();
    populateToolFilter();
    applyFilters();
    renderSummary();
    renderRoots();
    renderGovernanceSummary();
    renderLibrary();
    renderRuntime();
    renderBridgePanel();
    renderProfilesPanel();
    renderAiSettingsForm();
    renderSourceHistory();
    renderFirstRunImport();
    renderWorkspace();
    setStatus(
      t("status.scanned", {
        count: state.catalog.counts.availableRoots,
        time: formatTime(state.catalog.scannedAt),
      }),
    );
  } catch (error) {
    setStatus(error instanceof Error ? error.message : String(error));
  } finally {
    elements.refreshButton.disabled = false;
  }
}

function setLanguage(language) {
  state.language = language === "zh" ? "zh" : "en";
  localStorage.setItem("skillsmanager.language", state.language);
  document.documentElement.lang = state.language === "zh" ? "zh-CN" : "en";
  elements.languageSelect.value = state.language;
  applyStaticTranslations();
  populateToolFilter();
  renderSummary();
  renderRoots();
  renderGovernanceSummary();
  renderLibrary();
  renderRuntime();
  renderAiSettingsForm();
  renderSourceHistory();
  renderFirstRunImport();
  renderSkills();
  renderWorkspace();
  renderSelectedDetail();
  if (state.catalog) {
    setStatus(
      t("status.scanned", {
        count: state.catalog.counts.availableRoots,
        time: formatTime(state.catalog.scannedAt),
      }),
    );
  } else {
    setStatus(t("status.loading"));
  }
}

function applyStaticTranslations() {
  document.documentElement.lang = state.language === "zh" ? "zh-CN" : "en";
  for (const node of document.querySelectorAll("[data-i18n]")) {
    node.textContent = t(node.getAttribute("data-i18n"));
  }
  for (const node of document.querySelectorAll("[data-i18n-placeholder]")) {
    node.setAttribute("placeholder", t(node.getAttribute("data-i18n-placeholder")));
  }
}

function setView(view, options = {}) {
  const nextView = ["setup", "skills", "library", "import", "profiles"].includes(view)
    ? view
    : "skills";
  state.view = nextView;
  if (options.persist !== false) {
    localStorage.setItem("skillsmanager.view", nextView);
  }
  if (nextView === "skills") state.selectionType = "skill";
  if (nextView === "library") {
    state.selectionType = "library";
    if (!state.selectedRecordId && state.library?.records?.length) {
      state.selectedRecordId = state.library.records[0].id;
    }
  }
  renderWorkspace();
  if (nextView === "skills") renderSkills();
  if (nextView === "library") renderLibrary();
  renderSelectedDetail();
}

function renderWorkspace() {
  syncDetailPaneVisibility();
  elements.refreshButton?.classList.toggle("hidden", state.view !== "setup");
  for (const button of elements.viewButtons) {
    button.classList.toggle("active", button.getAttribute("data-view") === state.view);
  }
  for (const panel of elements.viewPanels) {
    panel.classList.toggle("hidden", panel.getAttribute("data-view-panel") !== state.view);
  }
  elements.workspaceKicker.textContent = t(`workspace.${state.view}.kicker`);
  elements.workspaceTitle.textContent = t(`workspace.${state.view}.title`);
  elements.workspaceSubtitle.textContent = t(`workspace.${state.view}.subtitle`);
  elements.firstRunDone?.classList.toggle("hidden", !state.firstRun || Boolean(state.firstRun.isFirstRun));
  if (state.view === "setup" && state.firstRun && !state.firstRun.isFirstRun) {
    renderHomeOverview();
  }
  if (state.view === "import") {
    if (state.sourcePreview) {
      renderSourcePreview(state.sourcePreview, state.sourcePreviewMode);
    } else {
      renderImportEmptySuggestion();
    }
  }
  syncImportActions();
  renderBridgePanel();
  renderProfilesPanel();
}

function shouldHideDetailPane() {
  return state.view === "setup" || (state.view === "import" && !state.sourcePreview);
}

function syncDetailPaneVisibility() {
  const hideDetailPane = shouldHideDetailPane();
  elements.shell.classList.toggle("detail-hidden", hideDetailPane);
  elements.detailPane?.classList.toggle("hidden", hideDetailPane);
}

function t(key, variables = {}) {
  const dictionary = TRANSLATIONS[state.language] || TRANSLATIONS.en;
  const fallback = TRANSLATIONS.en[key] || key;
  const template = dictionary[key] || fallback;
  return template.replace(/\{([A-Za-z0-9_]+)\}/g, (_, name) => {
    return Object.hasOwn(variables, name) ? String(variables[name]) : `{${name}}`;
  });
}

function populateToolFilter() {
  const current = elements.toolFilter.value;
  const tools = [...new Set((state.catalog?.skills || []).map((skill) => skill.tool))].sort();
  elements.toolFilter.innerHTML = `<option value="all">${escapeHtml(t("filters.allTools"))}</option>`;
  for (const tool of tools) {
    const option = document.createElement("option");
    option.value = tool;
    option.textContent = tool;
    elements.toolFilter.appendChild(option);
  }
  elements.toolFilter.value = tools.includes(current) ? current : "all";
  state.filters.tool = elements.toolFilter.value;
}

function applyFilters() {
  const skills = state.catalog?.skills || [];
  state.filteredSkills = skills.filter((skill) => {
    if (state.filters.risk !== "all" && skill.risk.level !== state.filters.risk) return false;
    if (state.filters.tool !== "all" && skill.tool !== state.filters.tool) return false;
    if (!state.filters.search) return true;

    const haystack = [
      skill.name,
      skill.description,
      skill.tool,
      skill.rootLabel,
      skill.path,
      skill.relativePath,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(state.filters.search);
  });
  renderSkills();
  renderSelectedDetail();
}

function renderSummary() {
  const counts = state.catalog?.counts || {};
  if (elements.skillCount) elements.skillCount.textContent = counts.skills ?? 0;
  if (elements.rootCount) elements.rootCount.textContent = counts.availableRoots ?? 0;
  if (elements.conflictCount) elements.conflictCount.textContent = counts.conflicts ?? 0;
}

function renderRoots() {
  const roots = state.catalog?.roots || [];
  elements.rootList.innerHTML = roots
    .map((root) => {
      const ok = root.exists && root.readable;
      return `
        <div class="root-item">
          <strong>${escapeHtml(root.label)}</strong>
          <div class="root-path">${escapeHtml(root.path)}</div>
          <span class="root-state ${ok ? "ok" : "missing"}">${ok ? t("root.available") : t("root.missing")}</span>
        </div>
      `;
    })
    .join("");
}

function renderRuntime() {
  if (!elements.runtimeHome || !elements.runtimeStats || !elements.runtimeRunList) return;
  const runtime = state.runtime;
  if (!runtime) {
    elements.runtimeHome.textContent = t("runtime.unavailable");
    elements.runtimeStats.innerHTML = "";
    elements.runtimeRunList.innerHTML = "";
    return;
  }

  elements.runtimeHome.textContent = runtime.home;
  elements.runtimeStats.innerHTML = `
    <div class="runtime-stat">
      <strong>${runtime.counts.running}</strong>
      <span>${t("runtime.running")}</span>
    </div>
    <div class="runtime-stat">
      <strong>${runtime.counts.queued}</strong>
      <span>${t("runtime.queued")}</span>
    </div>
    <div class="runtime-stat">
      <strong>${runtime.counts.locks}</strong>
      <span>${t("runtime.locks")}</span>
    </div>
    <div class="runtime-stat">
      <strong>${runtime.counts.runs}</strong>
      <span>${t("runtime.runs")}</span>
    </div>
  `;
  renderRuntimeRuns();
}

function renderRuntimeRuns() {
  const runs = state.runtime?.runs || [];
  if (!elements.runtimeRunList) return;
  if (!runs.length) {
    elements.runtimeRunList.innerHTML = `
      <section class="runtime-runs">
        <div class="section-title">${t("sections.runtimeRuns")}</div>
        <p class="status-line compact">${t("runtime.noRuns")}</p>
      </section>
    `;
    return;
  }

  elements.runtimeRunList.innerHTML = `
    <section class="runtime-runs">
      <div class="section-title">${t("sections.runtimeRuns")}</div>
      <ul class="run-list">
        ${runs
          .slice(0, 12)
          .map(
            (run) => `
              <li>
                <div class="run-head">
                  <strong>${escapeHtml(run.id)} / ${escapeHtml(run.agentName)}</strong>
                  <span class="badge ${statusClass(run.status)}">${escapeHtml(statusName(run.status))}</span>
                </div>
                <div class="meta-line">
                  <span>${escapeHtml(run.skillName)}</span>
                  <span>${escapeHtml(run.policy)}</span>
                  ${run.lockKey ? `<span>${escapeHtml(run.lockKey)}</span>` : `<span>${t("labels.noLock")}</span>`}
                </div>
              </li>
            `,
          )
          .join("")}
      </ul>
    </section>
  `;
}

function renderBridgePanel() {
  if (!elements.bridgePanel) return;
  const record = getBridgeRecord();
  elements.bridgePanel.innerHTML = `
    <div class="source-preview-card bridge-card">
      <div class="badge-line">
        <span class="badge ${record ? "low" : "medium"}">${escapeHtml(record ? t("bridge.installed") : t("bridge.notInstalled"))}</span>
        ${record?.trust?.status ? `<span class="badge neutral">${escapeHtml(trustName(record.trust.status))}</span>` : ""}
      </div>
      <h3>${t("workspace.bridge.title")}</h3>
      <p>${t("bridge.body")}</p>
      ${record ? `<code>${escapeHtml(record.libraryPath)}</code>` : ""}
      <div class="source-import-actions single">
        <button type="button" data-install-bridge>${t("actions.installBridge")}</button>
      </div>
    </div>
  `;
}

function renderProfilesPanel() {
  if (!elements.profilesPanel) return;
  const profiles = state.profiles?.profiles || state.runtime?.profiles || [];
  const enabled = profiles.filter((profile) => profile.enabled !== false);
  elements.profilesPanel.innerHTML = `
    <div class="profiles-overview">
      <div>
        <strong>${t("profiles.listTitle")}</strong>
        <span>${t("profiles.listBody")}</span>
      </div>
      <span class="badge ${enabled.length ? "low" : "medium"}">${t("profiles.enabledSummary", { enabled: enabled.length, total: profiles.length })}</span>
    </div>
    <details class="profile-add-card">
      <summary>
        <div>
          <strong>${t("profiles.addTitle")}</strong>
          <small>${t("profiles.custom")}</small>
        </div>
        <span class="secondary-button">${t("actions.addProfile")}</span>
      </summary>
      <form class="profile-create-form" data-profile-create>
        <div class="profile-fields-grid">
          <label>
            ${t("labels.profileName")}
            <input name="name" placeholder="${escapeHtml(t("profiles.namePlaceholder"))}" required />
          </label>
          ${renderSkillRootField("", t("profiles.pathPlaceholder"))}
        </div>
        <button type="submit">${t("actions.addProfile")}</button>
      </form>
    </details>
    <div class="profile-list">
      ${profiles.map((profile) => renderProfileForm(profile)).join("")}
    </div>
    <div class="profiles-actions">
      <button type="button" class="secondary-button" data-reset-profiles>${t("actions.resetProfiles")}</button>
      <span>${t("profiles.resetNote")}</span>
    </div>
  `;
}

function renderProfileForm(profile) {
  const typeLabel = profile.canDelete ? t("profiles.custom") : t("profiles.default");
  const statusLabel = profile.enabled ? t("profiles.enabled") : t("profiles.disabled");
  return `
    <form class="profile-card profile-card-simple" data-profile-form="${escapeHtml(profile.id)}">
      <div class="profile-summary-row">
        <span class="profile-summary-main">
          <strong>${escapeHtml(profile.name)}</strong>
          <small>${escapeHtml(profile.skillRoot)}</small>
        </span>
        <span class="profile-summary-meta">
          <span class="badge neutral">${escapeHtml(typeLabel)}</span>
          <span class="badge ${profile.enabled ? "low" : "neutral"}">${escapeHtml(statusLabel)}</span>
        </span>
      </div>
      <details class="profile-edit-details">
        <summary>${t("profiles.edit")}</summary>
        <div class="profile-edit-grid">
          <label>
            ${t("labels.profileName")}
            <input name="name" value="${escapeHtml(profile.name)}" />
          </label>
          ${renderSkillRootField(profile.skillRoot)}
          <label class="profile-enable-toggle">
            <input type="checkbox" name="enabled" ${profile.enabled ? "checked" : ""} />
            <span>${escapeHtml(statusLabel)}</span>
          </label>
          <div class="profile-card-actions">
            <button type="submit">${t("actions.saveProfile")}</button>
            ${
              profile.canDelete
                ? `<button type="button" class="secondary-button danger-button" data-delete-profile="${escapeHtml(profile.id)}">${t("actions.deleteProfile")}</button>`
                : ""
            }
          </div>
        </div>
      </details>
    </form>
  `;
}

function renderSkillRootField(value = "", placeholder = "") {
  const picker = isTauriApp()
    ? `<button type="button" class="secondary-button folder-picker-button" data-pick-skill-root>${t("actions.chooseFolder")}</button>`
    : "";
  return `
    <label class="profile-field">
      <span>${t("labels.skillRoot")}</span>
      <span class="input-with-action">
        <input name="skillRoot" value="${escapeHtml(value)}" placeholder="${escapeHtml(placeholder)}" required />
        ${picker}
      </span>
    </label>
  `;
}

function renderGovernanceSummary() {
  const governance = state.catalog?.governance;
  if (!elements.governanceStats || !governance) {
    if (elements.governanceStats) elements.governanceStats.innerHTML = "";
    return;
  }

  elements.governanceStats.innerHTML = `
    <div class="runtime-stat">
      <strong>${governance.managed}</strong>
      <span>${t("governance.managed")}</span>
    </div>
    <div class="runtime-stat">
      <strong>${governance.adopted}</strong>
      <span>${t("governance.adopted")}</span>
    </div>
    <div class="runtime-stat">
      <strong>${governance.unmanaged}</strong>
      <span>${t("governance.unmanaged")}</span>
    </div>
    <div class="runtime-stat">
      <strong>${governance.records}</strong>
      <span>${t("governance.library")}</span>
    </div>
  `;
}

function renderFirstRunImport() {
  const firstRun = state.firstRun;
  if (!firstRun || !firstRun.isFirstRun) {
    elements.firstRunImport.classList.add("hidden");
    elements.firstRunImport.innerHTML = "";
    return;
  }

  elements.firstRunImport.classList.remove("hidden");
  const summary = firstRun.summary || {};
  const selectedCount = [...state.firstRunSelected].filter((id) =>
    (firstRun.skills || []).some((skill) => skill.id === id && skill.canAdopt),
  ).length;
  const adoptable = summary.adoptable || 0;
  const lowRisk = summary.lowRiskAdoptable || 0;
  const reviewRequired = summary.reviewRequired || 0;

  elements.firstRunImport.innerHTML = `
    <div class="first-run-head">
      <div>
        <div class="section-title">${t("workspace.setup.title")}</div>
        <h2>${t("firstRun.title")}</h2>
        <p>${t("firstRun.body")}</p>
      </div>
      <button type="button" class="secondary-button" data-first-run-complete>${t("actions.finish")}</button>
    </div>

    <div class="first-run-stats">
      <div><strong>${summary.totalSkills || 0}</strong><span>${t("firstRun.discovered")}</span></div>
      <div><strong>${adoptable}</strong><span>${t("firstRun.ready")}</span></div>
      <div><strong>${lowRisk}</strong><span>${t("firstRun.lowRisk")}</span></div>
      <div><strong>${reviewRequired}</strong><span>${t("firstRun.review")}</span></div>
    </div>

    ${renderFirstRunRoots(firstRun.roots || [])}

    <div class="first-run-actions">
      <button type="button" data-first-run-adopt-low ${lowRisk ? "" : "disabled"}>${t("actions.adoptLowRisk")}</button>
      <button type="button" data-first-run-adopt-selected ${selectedCount ? "" : "disabled"}>${t("actions.adoptSelected", { count: selectedCount })}</button>
    </div>

    ${renderFirstRunSkills(firstRun.skills || [])}
  `;
}

function renderHomeOverview() {
  if (!elements.firstRunDone) return;
  const relationship = buildHomeRelationship();

  elements.firstRunDone.className = "home-overview";
  elements.firstRunDone.innerHTML = `
    <section class="relationship-hero">
      <div class="relationship-metrics">
        <button type="button" data-home-view="profiles">
          <strong>${relationship.enabledProfiles}</strong>
          <span>${t("home.metricAgents")}</span>
        </button>
        <button type="button" data-home-view="skills">
          <strong>${relationship.totalSkills}</strong>
          <span>${t("home.metricDiscovered")}</span>
        </button>
        <button type="button" data-home-view="library">
          <strong>${relationship.totalManaged}</strong>
          <span>${t("home.metricManaged")}</span>
        </button>
        <button type="button" data-home-view="skills">
          <strong>${relationship.needsAction}</strong>
          <span>${t("home.metricNeedsAction")}</span>
        </button>
        <button type="button" data-home-view="library">
          <strong>${relationship.copyGaps}</strong>
          <span>${t("home.metricCopyGaps")}</span>
        </button>
      </div>
    </section>

    <section class="relationship-panel">
      <div class="relationship-section-head">
        <h3>${t("home.actionsTitle")}</h3>
      </div>
      ${renderRelationshipActions(relationship)}
    </section>

    <section class="relationship-panel">
      <div class="relationship-section-head">
        <h3>${t("home.skillMapTitle")}</h3>
        <button type="button" class="secondary-button" data-home-view="skills">${t("nav.skills")}</button>
      </div>
      ${renderSkillRelationshipTable(relationship.skills)}
    </section>

    <section class="relationship-panel">
      <div class="relationship-section-head">
        <h3>${t("home.agentMapTitle")}</h3>
        <button type="button" class="secondary-button" data-home-view="profiles">${t("nav.profiles")}</button>
      </div>
      ${renderAgentRelationshipTable(relationship.agents)}
    </section>
  `;
}

function buildHomeRelationship() {
  const skills = state.catalog?.skills || [];
  const records = state.library?.records || [];
  const profiles = state.profiles?.profiles || state.runtime?.profiles || [];
  const enabledProfiles = profiles.filter((profile) => profile.enabled !== false);
  const roots = state.catalog?.roots || [];
  const recordsByName = new Map(records.map((record) => [normalizeKey(record.name), record]));
  const profilesById = new Map(profiles.map((profile) => [profile.id, profile]));
  const profileByTool = buildProfileToolIndex(enabledProfiles);
  const rootByTool = buildRootToolIndex(roots);
  const skillNames = skills.map((skill) => normalizeKey(skill.name));
  const nameCounts = new Map();
  for (const name of skillNames) nameCounts.set(name, (nameCounts.get(name) || 0) + 1);

  const agents = profiles.map((profile) => {
    const profileSkills = skills.filter((skill) => skillMatchesProfile(skill, profile, profileByTool));
    const uniqueNames = new Set(profileSkills.map((skill) => normalizeKey(skill.name)));
    const highRisk = profileSkills.filter((skill) => skill.risk?.level === "high").length;
    const managed = [...uniqueNames].filter((name) => recordsByName.has(name)).length;
    const unique = [...uniqueNames].filter((name) => nameCounts.get(name) === 1).length;
    const copied = records.filter((record) =>
      (record.publishedTo || []).some((item) => item.profileId === profile.id),
    ).length;
    const root = rootByTool.get(profile.adapter) || rootByTool.get(profile.id);
    const folderReady = root ? Boolean(root.exists && root.readable) : profile.enabled !== false;
    return {
      ...profile,
      skills: profileSkills.length,
      managed,
      highRisk,
      unique,
      copied,
      folderReady,
      folderPath: profile.skillRoot || root?.path || "",
    };
  });

  const relationshipSkills = buildRelationshipSkills({
    skills,
    records,
    enabledProfiles,
    profilesById,
    profileByTool,
  });
  const unmanagedHighRisk = skills.filter(
    (skill) => skill.risk?.level === "high" && !recordsByName.has(normalizeKey(skill.name)),
  ).length;
  const missingFolders = agents.filter((agent) => agent.enabled !== false && !agent.folderReady).length;
  const conflicts = state.catalog?.counts?.conflicts || 0;
  const unmanagedCopyGaps = records.filter((record) => !(record.publishedTo || []).length).length;
  const copyGaps = relationshipSkills.reduce((sum, skill) => sum + skill.copyGap, 0);

  return {
    agents,
    skills: relationshipSkills,
    totalSkills: state.catalog?.counts?.skills || skills.length,
    totalManaged: state.library?.counts?.records || records.length,
    enabledProfiles: enabledProfiles.length,
    needsAction: unmanagedHighRisk + missingFolders + conflicts,
    unmanagedHighRisk,
    missingFolders,
    conflicts,
    unmanagedCopyGaps,
    copyGaps,
  };
}

function buildRelationshipSkills({ skills, records, enabledProfiles, profilesById, profileByTool }) {
  const byName = new Map();
  for (const skill of skills) {
    const key = normalizeKey(skill.name);
    if (!byName.has(key)) {
      byName.set(key, {
        name: skill.name,
        description: skill.description || "",
        risk: skill.risk?.level || "low",
        agents: new Set(),
        instanceCount: 0,
        managed: false,
        copiedTo: new Set(),
      });
    }
    const item = byName.get(key);
    item.instanceCount += 1;
    item.risk = strongestRisk(item.risk, skill.risk?.level || "low");
    const profile = profileForSkill(skill, profileByTool);
    if (profile) item.agents.add(profile.name);
  }

  for (const record of records) {
    const key = normalizeKey(record.name);
    if (!byName.has(key)) {
      byName.set(key, {
        name: record.name,
        description: record.description || "",
        risk: record.risk?.level || "low",
        agents: new Set(),
        instanceCount: 0,
        managed: true,
        copiedTo: new Set(),
      });
    }
    const item = byName.get(key);
    item.managed = true;
    for (const publication of record.publishedTo || []) {
      const profile = profilesById.get(publication.profileId);
      if (profile) {
        item.agents.add(profile.name);
        item.copiedTo.add(profile.id);
      }
    }
  }

  return [...byName.values()]
    .map((item) => ({
      ...item,
      agents: [...item.agents],
      copyGap: item.managed ? Math.max(0, enabledProfiles.length - item.copiedTo.size) : 0,
    }))
    .sort((a, b) => {
      if (a.risk !== b.risk) return riskWeight(b.risk) - riskWeight(a.risk);
      if (a.managed !== b.managed) return a.managed ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
}

function renderAgentRelationshipTable(agents) {
  if (!agents.length) return `<p class="status-line compact">${t("profiles.none")}</p>`;
  return `
    <div class="relationship-table agent-relationship-table">
      <div class="relationship-row relationship-row-head">
        <span>${t("home.columnAgent")}</span>
        <span>${t("home.columnSkills")}</span>
        <span>${t("home.columnManaged")}</span>
        <span>${t("home.columnRisk")}</span>
        <span>${t("home.columnUnique")}</span>
        <span>${t("home.columnCopied")}</span>
        <span>${t("home.columnFolder")}</span>
      </div>
      ${agents
        .map(
          (agent) => `
            <button type="button" class="relationship-row ${agent.enabled === false ? "is-disabled" : ""}" data-home-view="skills">
              <span class="relationship-entity">
                <strong>${escapeHtml(agent.name)}</strong>
                <small>${escapeHtml(agent.folderPath || t("profiles.none"))}</small>
              </span>
              <span data-label="${escapeHtml(t("home.columnSkills"))}">${agent.skills}</span>
              <span data-label="${escapeHtml(t("home.columnManaged"))}">${agent.managed}</span>
              <span data-label="${escapeHtml(t("home.columnRisk"))}" class="${agent.highRisk ? "relationship-danger" : ""}">${agent.highRisk}</span>
              <span data-label="${escapeHtml(t("home.columnUnique"))}">${agent.unique}</span>
              <span data-label="${escapeHtml(t("home.columnCopied"))}">${agent.copied}</span>
              <span data-label="${escapeHtml(t("home.columnFolder"))}"><span class="badge ${agent.folderReady ? "low" : "medium"}">${escapeHtml(agent.folderReady ? t("home.folderReady") : t("home.folderMissing"))}</span></span>
            </button>
          `,
        )
        .join("")}
    </div>
  `;
}

function renderSkillRelationshipTable(skills) {
  if (!skills.length) return `<p class="status-line compact">${t("skills.noMatchesTitle")}</p>`;
  return `
    <div class="relationship-table skill-relationship-table">
      <div class="relationship-row relationship-row-head">
        <span>${t("home.skillColumnSkill")}</span>
        <span>${t("home.skillColumnAgents")}</span>
        <span>${t("home.skillColumnState")}</span>
      </div>
      ${skills
        .map((skill) => {
          const visibleAgents = skill.agents.slice(0, 3);
          const hiddenCount = Math.max(0, skill.agents.length - visibleAgents.length);
          return `
            <button type="button" class="relationship-row" data-home-view="${skill.managed ? "library" : "skills"}">
              <span class="relationship-entity">
                <strong>${escapeHtml(skill.name)}</strong>
                <small>${escapeHtml(skill.description || "")}</small>
                <small>${escapeHtml(t("home.instanceCount", { count: skill.instanceCount }))}</small>
              </span>
              <span class="agent-chip-list" data-label="${escapeHtml(t("home.skillColumnAgents"))}">
                ${visibleAgents.map((agent) => `<span class="agent-chip">${escapeHtml(agent)}</span>`).join("")}
                ${hiddenCount ? `<span class="agent-chip muted">${escapeHtml(t("home.skillMore", { count: hiddenCount }))}</span>` : ""}
              </span>
              <span class="relationship-state" data-label="${escapeHtml(t("home.skillColumnState"))}">
                <span class="badge ${skill.risk}">${escapeHtml(t("risk.label", { level: riskName(skill.risk) }))}</span>
                <span class="badge ${skill.managed ? "low" : "neutral"}">${escapeHtml(skill.managed ? t("governance.library") : t("home.foundOnly"))}</span>
                ${skill.managed ? `<small>${escapeHtml(skill.copyGap ? t("home.copyGap", { count: skill.copyGap }) : t("home.noCopyGap"))}</small>` : ""}
              </span>
            </button>
          `;
        })
        .join("")}
    </div>
  `;
}

function renderRelationshipActions(relationship) {
  const actions = [];
  if (relationship.unmanagedHighRisk) {
    actions.push({
      view: "skills",
      primary: true,
      title: t("home.actionHighRisk", { count: relationship.unmanagedHighRisk }),
      body: t("home.actionHighRiskBody"),
    });
  }
  if (relationship.unmanagedCopyGaps) {
    actions.push({
      view: "library",
      title: t("home.actionCopyGaps", { count: relationship.unmanagedCopyGaps }),
      body: t("home.actionCopyGapsBody"),
    });
  }
  if (relationship.missingFolders) {
    actions.push({
      view: "profiles",
      title: t("home.actionMissingFolders", { count: relationship.missingFolders }),
      body: t("home.actionMissingFoldersBody"),
    });
  }
  if (relationship.conflicts) {
    actions.push({
      view: "skills",
      title: t("home.actionConflicts", { count: relationship.conflicts }),
      body: t("home.actionConflictsBody"),
    });
  }
  if (!actions.length) {
    actions.push({
      view: "skills",
      title: t("home.actionReady"),
      body: t("home.actionReadyBody"),
    });
  }
  return `
    <div class="relationship-actions">
      ${actions
        .map(
          (action) => `
            <button type="button" class="relationship-action ${action.primary ? "is-primary" : ""}" data-home-view="${escapeHtml(action.view)}">
              <strong>${escapeHtml(action.title)}</strong>
              <span>${escapeHtml(action.body)}</span>
            </button>
          `,
        )
        .join("")}
    </div>
  `;
}

function buildProfileToolIndex(profiles) {
  const index = new Map();
  for (const profile of profiles) {
    if (profile.adapter) {
      index.set(profile.adapter, profile);
      index.set(normalizeKey(profile.adapter), profile);
    }
    index.set(profile.id, profile);
    index.set(normalizeKey(profile.id), profile);
    index.set(normalizeKey(profile.name), profile);
    for (const alias of profileToolAliases(profile)) {
      index.set(alias, profile);
    }
  }
  return index;
}

function profileToolAliases(profile) {
  const aliases = {
    claude: ["claude code", "claude"],
    codex: ["codex"],
    openclaw: ["openclaw"],
  };
  return aliases[normalizeKey(profile.adapter)] || [];
}

function buildRootToolIndex(roots) {
  const index = new Map();
  for (const root of roots) {
    if (root.tool) index.set(root.tool, root);
    if (root.key) index.set(root.key, root);
  }
  return index;
}

function skillMatchesProfile(skill, profile, profileByTool) {
  return profileForSkill(skill, profileByTool)?.id === profile.id;
}

function profileForSkill(skill, profileByTool) {
  return (
    profileByTool.get(skill.tool) ||
    profileByTool.get(normalizeKey(skill.tool || "")) ||
    profileByTool.get(skill.rootKey) ||
    profileByTool.get(normalizeKey(skill.rootKey || "")) ||
    profileByTool.get(normalizeKey(skill.rootLabel || ""))
  );
}

function normalizeKey(value) {
  return String(value || "").trim().toLowerCase();
}

function strongestRisk(current, next) {
  return riskWeight(next) > riskWeight(current) ? next : current;
}

function riskWeight(level) {
  if (level === "high") return 3;
  if (level === "medium") return 2;
  return 1;
}

function renderFirstRunRoots(roots) {
  const activeRoots = roots.filter((root) => root.total > 0);
  if (!activeRoots.length) {
    return `<p class="status-line compact">${t("firstRun.noSkills")}</p>`;
  }

  return `
    <div class="first-run-roots">
      ${activeRoots
        .map(
          (root) => `
            <div class="first-run-root">
              <strong>${escapeHtml(root.tool)} / ${escapeHtml(root.label)}</strong>
              <span>${t("firstRun.rootSummary", {
                count: root.total,
                ready: root.adoptable,
                high: root.highRisk,
              })}</span>
            </div>
          `,
        )
        .join("")}
    </div>
  `;
}

function renderFirstRunSkills(skills) {
  if (!skills.length) return "";

  return `
    <div class="first-run-skill-list">
      ${skills
        .map((skill) => {
          const checked = state.firstRunSelected.has(skill.id);
          const disabled = !skill.canAdopt;
          const findings = skill.risk.findings.length
            ? skill.risk.findings.map((finding) => finding.label).join(", ")
            : t("common.noRiskFindings");
          return `
            <label class="first-run-skill ${disabled ? "disabled" : ""}">
              <input
                type="checkbox"
                data-first-run-select="${escapeHtml(skill.id)}"
                ${checked ? "checked" : ""}
                ${disabled ? "disabled" : ""}
              />
              <span>
                <span class="badge-line">
                  <span class="badge ${skill.risk.level}">${escapeHtml(t("risk.label", { level: riskName(skill.risk.level) }))}</span>
                  <span class="badge neutral">${escapeHtml(skill.tool)}</span>
                  <span class="badge ${firstRunStatusClass(skill.importStatus)}">${escapeHtml(statusName(skill.importStatus))}</span>
                  ${skill.reviewRequired ? `<span class="badge high">${t("firstRun.reviewIndividually")}</span>` : ""}
                </span>
                <strong>${escapeHtml(skill.name)}</strong>
                <small>${escapeHtml(skill.rootLabel)} / ${escapeHtml(skill.relativePath)} / ${escapeHtml(findings)}</small>
              </span>
            </label>
          `;
        })
        .join("")}
    </div>
  `;
}

function firstRunStatusClass(status) {
  if (status === "ready") return "medium";
  if (status === "managed" || status === "adopted-existing" || status === "adopted") return "low";
  return "neutral";
}

function libraryStatusClass(status) {
  if (status === "managed" || status === "adopted-existing") return "low";
  if (status === "adopted") return "medium";
  return "neutral";
}

function reconcileFirstRunSelection() {
  const adoptableIds = new Set(
    (state.firstRun?.skills || []).filter((skill) => skill.canAdopt).map((skill) => skill.id),
  );
  state.firstRunSelected = new Set([...state.firstRunSelected].filter((id) => adoptableIds.has(id)));
}

function renderLibrary() {
  const records = state.library?.records || [];
  if (!records.length) {
    elements.libraryList.innerHTML = `
      <div class="library-row">
        <strong>${t("library.emptyTitle")}</strong>
        <p>${t("library.emptyBody")}</p>
      </div>
    `;
    return;
  }

  if (
    state.selectionType === "library" &&
    (!state.selectedRecordId || !records.some((record) => record.id === state.selectedRecordId))
  ) {
    state.selectedRecordId = records[0].id;
  }

  elements.libraryList.innerHTML = records
    .map((record) => {
      const published = record.publishedTo?.length || 0;
      const publicationLabel = published
        ? t("library.publicationCount", { count: published })
        : t("library.notPublished");
      return `
        <button class="library-row ${state.selectionType === "library" && state.selectedRecordId === record.id ? "selected" : ""}" data-library-record-id="${escapeHtml(record.id)}">
          <div class="badge-line">
            <span class="badge ${libraryStatusClass(record.status)}">${escapeHtml(statusName(record.status))}</span>
          </div>
          <strong>${escapeHtml(record.name)}@${escapeHtml(record.version)}</strong>
          <p>${escapeHtml(publicationLabel)}</p>
        </button>
      `;
    })
    .join("");

  for (const row of elements.libraryList.querySelectorAll("[data-library-record-id]")) {
    row.addEventListener("click", () => {
      state.selectionType = "library";
      state.selectedRecordId = row.getAttribute("data-library-record-id");
      setView("library");
      renderLibrary();
      renderSkills();
      renderSelectedDetail();
    });
  }
}

function renderSourceHistory() {
  if (!elements.sourceHistory) return;
  const history = state.sourceHistory || [];
  if (!history.length) {
    elements.sourceHistory.innerHTML = `
      <div class="source-history-empty">
        <strong>${t("import.historyTitle")}</strong>
        <p>${t("import.historyEmpty")}</p>
      </div>
    `;
    return;
  }
  elements.sourceHistory.innerHTML = `
    <div class="source-history-head">
      <span>
        <strong>${t("import.historyTitle")}</strong>
        <small>${t("import.historyBody")}</small>
      </span>
      <button type="button" class="secondary-button" data-clear-source-history>${t("import.historyClear")}</button>
    </div>
    <div class="source-history-list">
      ${history
        .map(
          (item, index) => `
            <button type="button" class="source-history-item" data-source-history-index="${index}">
              <strong>${escapeHtml(item.source)}</strong>
              <span>${escapeHtml(sourceHistoryMeta(item))}</span>
            </button>
          `,
        )
        .join("")}
    </div>
  `;
}

function sourceHistoryMeta(item) {
  const parts = [];
  if (item.ref) parts.push(item.ref);
  if (item.subdir) parts.push(item.subdir);
  parts.push(formatTime(item.checkedAt));
  return parts.join(" / ");
}

function rememberSource(payload) {
  if (!payload.source) return;
  const item = {
    source: payload.source,
    ref: payload.ref || "",
    subdir: payload.subdir || "",
    checkedAt: new Date().toISOString(),
  };
  const key = sourceHistoryKey(item);
  state.sourceHistory = [
    item,
    ...(state.sourceHistory || []).filter((entry) => sourceHistoryKey(entry) !== key),
  ].slice(0, 8);
  writeSourceHistory(state.sourceHistory);
  renderSourceHistory();
}

function sourceHistoryKey(item) {
  return [item.source, item.ref || "", item.subdir || ""].join("\n");
}

function fillSourceForm(item) {
  elements.sourceImportForm.querySelector('[name="source"]').value = item.source || "";
  elements.sourceImportForm.querySelector('[name="ref"]').value = item.ref || "";
  elements.sourceImportForm.querySelector('[name="subdir"]').value = item.subdir || "";
  handleSourceFormChanged();
  setStatus(t("status.enterSource"));
}

function readSourceHistory() {
  try {
    const parsed = JSON.parse(localStorage.getItem("skillsmanager.sourceHistory") || "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item) => item && typeof item.source === "string")
      .map((item) => ({
        source: String(item.source || ""),
        ref: String(item.ref || ""),
        subdir: String(item.subdir || ""),
        checkedAt: item.checkedAt || new Date().toISOString(),
      }))
      .slice(0, 8);
  } catch {
    return [];
  }
}

function writeSourceHistory(history) {
  localStorage.setItem("skillsmanager.sourceHistory", JSON.stringify(history || []));
}

function renderSourcePreview(preview, mode = "preview") {
  if (!preview) {
    state.sourcePreview = null;
    state.sourcePreviewMode = "preview";
    elements.sourcePreview.innerHTML = "";
    syncDetailPaneVisibility();
    renderSelectedDetail();
    syncImportActions();
    return;
  }
  const isNewPreview = state.sourcePreview !== preview;
  state.sourcePreview = preview;
  state.sourcePreviewMode = mode;
  if (isNewPreview) state.aiInterpretation = null;

  const previewModeLabel = mode === "installed" ? t("sourcePreview.added") : t("sourcePreview.analyzed");
  const files = preview.files || [];
  const scriptCount = files.filter((file) => file.kind === "script").length;

  elements.sourcePreview.innerHTML = `
    <div class="source-preview-card">
      <section class="source-result-section">
        <div class="source-section-head">
          <h3>${t("sourcePreview.summaryTitle")}</h3>
          <span class="badge neutral">${escapeHtml(previewModeLabel)}</span>
        </div>
        <div class="source-summary">
          <div>
            <strong>${escapeHtml(preview.name)}</strong>
            <p>${escapeHtml(preview.description || t("common.noDescription"))}</p>
          </div>
          <div class="source-meta-grid">
            <span>${escapeHtml(t("sourcePreview.filesChecked", { count: files.length }))}</span>
            <span>${escapeHtml(t("sourcePreview.scriptsFound", { count: scriptCount }))}</span>
            ${preview.origin?.resolvedCommit ? `<span>${t("labels.resolvedCommit")}: ${escapeHtml(preview.origin.resolvedShortCommit || preview.origin.resolvedCommit.slice(0, 12))}</span>` : ""}
          </div>
        </div>
        ${
          preview.diff
            ? `<p class="compact-note"><strong>${t("labels.diff")}:</strong> ${preview.diff.changed} changed / ${preview.diff.added.length} added / ${preview.diff.modified.length} modified / ${preview.diff.removed.length} removed</p>`
            : ""
        }
        <code>${escapeHtml(preview.origin?.url || preview.origin?.path || preview.skillPath)}</code>
      </section>

      <section class="source-result-section">
        <div class="source-section-head">
          <h3>${t("sourcePreview.localCheckTitle")}</h3>
          <span class="badge ${preview.risk?.level || "neutral"}">${escapeHtml(t("risk.label", { level: riskName(preview.risk?.level || "low") }))}</span>
        </div>
        ${renderRiskFindings(preview)}
        ${renderSourceValidation(preview)}
      </section>

      ${renderAiInterpretationSection()}
    </div>
  `;
  syncDetailPaneVisibility();
  renderSelectedDetail();
  syncImportActions();
}

function renderAiInterpretationSection() {
  const ready = Boolean(state.aiSettings?.enabled && state.aiSettings?.apiKeySet && state.aiSettings?.model);
  const badge = ready ? t("sourcePreview.aiReady") : t("sourcePreview.aiUnavailable");
  const buttonLabel = state.aiBusy ? t("sourcePreview.aiRunning") : t("sourcePreview.aiRun");
  return `
    <section class="source-result-section ai-result-section">
      <div class="source-section-head">
        <h3>${t("sourcePreview.aiTitle")}</h3>
        <span class="badge ${ready ? "low" : "neutral"}">${escapeHtml(badge)}</span>
      </div>
      ${
        state.aiInterpretation
          ? renderAiOutput(state.aiInterpretation)
          : `<p>${t("sourcePreview.aiBody")}</p><small>${t("sourcePreview.aiNext")}</small>`
      }
      <button type="button" data-run-ai ${ready && !state.aiBusy ? "" : "disabled"}>${escapeHtml(buttonLabel)}</button>
    </section>
  `;
}

function renderAiOutput(interpretation) {
  const sections = interpretation.sections || {};
  const rows = [
    { title: t("sourcePreview.aiSummary"), body: sections.summary || interpretation.text },
    { title: t("sourcePreview.aiRisk"), body: sections.riskExplanation },
    { title: t("sourcePreview.aiRecommendation"), body: sections.recommendation },
  ].filter((row) => row.body);
  return `
    <div class="ai-output">
      <strong>${t("sourcePreview.aiResult")}</strong>
      <div class="ai-output-grid">
        ${rows
          .map(
            (row) => `
              <article>
                <h4>${escapeHtml(row.title)}</h4>
                <p>${escapeHtml(row.body)}</p>
              </article>
            `,
          )
          .join("")}
      </div>
      <small>${escapeHtml(interpretation.model)} · ${escapeHtml(formatTime(interpretation.interpretedAt))}</small>
    </div>
  `;
}

function renderSkillAiInterpretationSection(skill) {
  const ready = Boolean(state.aiSettings?.enabled && state.aiSettings?.apiKeySet && state.aiSettings?.model);
  const busy = state.aiSkillBusyId === skill.id;
  const interpretation = state.aiSkillInterpretations.get(skill.id);
  const badge = ready ? t("sourcePreview.aiReady") : t("sourcePreview.aiUnavailable");
  const buttonLabel = busy ? t("sourcePreview.aiRunning") : t("sourcePreview.aiRun");
  return `
    <section class="detail-section ai-result-section">
      <div class="source-section-head">
        <h3>${t("sourcePreview.aiTitle")}</h3>
        <span class="badge ${ready ? "low" : "neutral"}">${escapeHtml(badge)}</span>
      </div>
      ${
        interpretation
          ? renderAiOutput(interpretation)
          : `<p>${t("sourcePreview.aiBody")}</p><small>${t("sourcePreview.aiNext")}</small>`
      }
      <button type="button" data-run-skill-ai="${escapeHtml(skill.id)}" ${ready && !busy ? "" : "disabled"}>${escapeHtml(buttonLabel)}</button>
    </section>
  `;
}

function renderLibraryAiInterpretationSection(record) {
  const ready = Boolean(state.aiSettings?.enabled && state.aiSettings?.apiKeySet && state.aiSettings?.model);
  const busy = state.aiLibraryBusyId === record.id;
  const interpretation = state.aiLibraryInterpretations.get(record.id);
  const badge = ready ? t("sourcePreview.aiReady") : t("sourcePreview.aiUnavailable");
  const buttonLabel = busy ? t("sourcePreview.aiRunning") : t("sourcePreview.aiRun");
  return `
    <section class="detail-section ai-result-section">
      <div class="source-section-head">
        <h3>${t("sourcePreview.aiTitle")}</h3>
        <span class="badge ${ready ? "low" : "neutral"}">${escapeHtml(badge)}</span>
      </div>
      ${
        interpretation
          ? renderAiOutput(interpretation)
          : `<p>${t("sourcePreview.aiBody")}</p><small>${t("sourcePreview.aiNext")}</small>`
      }
      <button type="button" data-run-library-ai="${escapeHtml(record.id)}" ${ready && !busy ? "" : "disabled"}>${escapeHtml(buttonLabel)}</button>
    </section>
  `;
}

function renderImportEmptySuggestion() {
  elements.sourcePreview.innerHTML = "";
  syncDetailPaneVisibility();
}

function sourceSuggestion(preview) {
  const hasValidationError = (preview.validation || []).some((item) => item.level === "error");
  if (hasValidationError) {
    return {
      tone: "high",
      body: t("suggestion.blocked"),
      next: t("suggestion.inspectNext"),
    };
  }
  if (preview.risk?.level === "high") {
    return {
      tone: "high",
      body: t("suggestion.review"),
      next: t("suggestion.inspectNext"),
    };
  }
  if (preview.risk?.level === "medium") {
    return {
      tone: "medium",
      body: t("suggestion.review"),
      next: t("suggestion.inspectNext"),
    };
  }
  return {
    tone: "low",
    body: t("suggestion.safe"),
    next: t("suggestion.addNext"),
  };
}

function renderSuggestionBox(suggestion) {
  return `
    <div class="suggestion-box ${escapeHtml(suggestion.tone)}">
      <strong>${escapeHtml(t("suggestion.title"))}</strong>
      <p>${escapeHtml(suggestion.body)}</p>
      <small>${escapeHtml(suggestion.next)}</small>
    </div>
  `;
}

function handleSourceFormChanged() {
  if (!state.sourcePreview) {
    syncDetailPaneVisibility();
    syncImportActions();
    return;
  }
  state.sourcePreview = null;
  state.sourcePreviewMode = "preview";
  renderImportEmptySuggestion();
  syncImportActions();
}

function renderSkills() {
  const skills = state.filteredSkills;
  if (skills.length === 0) {
    elements.skillList.innerHTML = `
      <div class="skill-row">
        <h2>${t("skills.noMatchesTitle")}</h2>
        <p>${t("skills.noMatchesBody")}</p>
      </div>
    `;
    return;
  }

  if (
    state.selectionType === "skill" &&
    (!state.selectedId || !skills.some((skill) => skill.id === state.selectedId))
  ) {
    state.selectedId = skills[0]?.id || null;
  }

  elements.skillList.innerHTML = skills
    .map((skill) => {
      const description = skill.description || t("common.noDescription");
      const conflictBadge =
        skill.conflicts.length > 1
          ? `<span class="badge medium">${skill.conflicts.length} ${t("summary.conflicts").toLowerCase()}</span>`
          : "";
      const governanceBadge = renderGovernanceBadge(skill.governance);
      return `
        <button class="skill-row ${state.selectionType === "skill" && skill.id === state.selectedId ? "selected" : ""}" data-skill-id="${skill.id}">
          <div class="badge-line">
            <span class="badge ${skill.risk.level}">${escapeHtml(t("risk.label", { level: riskName(skill.risk.level) }))}</span>
            <span class="badge neutral">${escapeHtml(skill.tool)}</span>
            ${governanceBadge}
            ${conflictBadge}
          </div>
          <h2>${escapeHtml(skill.name)}</h2>
          <p>${escapeHtml(description)}</p>
          <div class="meta-line">
            <span>${escapeHtml(skill.rootLabel)}</span>
            <span>/</span>
            <span>${escapeHtml(skill.relativePath)}</span>
          </div>
        </button>
      `;
    })
    .join("");

  for (const row of elements.skillList.querySelectorAll("[data-skill-id]")) {
    row.addEventListener("click", () => {
      state.selectionType = "skill";
      state.selectedId = row.getAttribute("data-skill-id");
      setView("skills");
      renderSkills();
      renderLibrary();
      renderSelectedDetail();
    });
  }
}

function renderSelectedDetail() {
  if (shouldHideDetailPane()) {
    elements.emptyDetail.classList.add("hidden");
    elements.skillDetail.classList.add("hidden");
    return;
  }
  if (state.view === "library") {
    renderSelectedLibraryRecord();
    return;
  }
  if (state.view !== "skills") {
    renderWorkspaceEmptyDetail();
    return;
  }
  renderSelectedSkill();
}

function renderWorkspaceEmptyDetail() {
  elements.emptyDetail.classList.add("hidden");
  elements.skillDetail.classList.remove("hidden");
  elements.skillDetail.innerHTML = renderWorkspaceInspector();
}

function renderWorkspaceInspector() {
  setInspectorTitle(state.view === "import" && state.sourcePreview ? t("inspector.resultTitle") : t("inspector.guideTitle"));
  setInspectorContext(t(`workspace.${state.view}.title`));
  if (state.view === "setup") return renderSetupInspector();
  if (state.view === "import") return renderImportInspector();
  if (state.view === "runtime") return renderRuntimeInspector();
  if (state.view === "bridge") return renderBridgeInspector();
  if (state.view === "profiles") return renderProfilesInspector();
  return renderGenericInspector();
}

function renderSetupInspector() {
  const firstRun = state.firstRun;
  const summary = firstRun?.summary || {};
  const isComplete = firstRun && !firstRun.isFirstRun;
  return `
    ${renderInspectorHeader({
      title: t("inspector.setupTitle"),
      body: t("workspace.setup.subtitle"),
      badges: [
        { label: isComplete ? t("setup.doneTitle") : t("inspector.ready"), tone: isComplete ? "low" : "medium" },
      ],
    })}
    ${renderStepSection([
      { text: t("inspector.stepScan"), done: Boolean(state.catalog) },
      { text: t("inspector.stepAdopt"), done: Boolean(summary.adoptedExisting || isComplete), current: !isComplete && Boolean(summary.lowRiskAdoptable) },
      { text: t("inspector.stepReview"), done: isComplete || !summary.reviewRequired, current: !isComplete && Boolean(summary.reviewRequired) },
      { text: t("inspector.stepFinish"), done: Boolean(isComplete), current: !isComplete && !summary.lowRiskAdoptable && !summary.reviewRequired },
    ])}
  `;
}

function renderImportInspector() {
  const preview = state.sourcePreview;
  if (!preview) return "";
  const suggestion = sourceSuggestion(preview);
  const files = preview.files || [];
  const scriptCount = files.filter((file) => file.kind === "script").length;
  const previewModeLabel = state.sourcePreviewMode === "installed" ? t("sourcePreview.added") : t("sourcePreview.analyzed");
  return `
    ${renderInspectorHeader({
      title: t("inspector.importResultTitle"),
      body: preview.name,
      badges: [
        { label: previewModeLabel, tone: "neutral" },
        { label: t("risk.label", { level: riskName(preview.risk?.level || "low") }), tone: preview.risk?.level || "low" },
      ],
    })}
    <section class="detail-section">
      <h3>${t("suggestion.title")}</h3>
      ${renderSuggestionBox(suggestion)}
    </section>
    <section class="detail-section">
      <h3>${t("sourcePreview.summaryTitle")}</h3>
      <dl class="kv">
        <dt>${t("sourcePreview.checkStats")}</dt>
        <dd><strong>${escapeHtml(t("sourcePreview.filesChecked", { count: files.length }))} · ${escapeHtml(t("sourcePreview.scriptsFound", { count: scriptCount }))}</strong></dd>
        <dt>${t("sourcePreview.sourcePath")}</dt>
        <dd>${escapeHtml(preview.origin?.url || preview.origin?.path || preview.skillPath || "")}</dd>
        ${
          preview.origin?.resolvedCommit
            ? `<dt>${t("labels.resolvedCommit")}</dt><dd>${escapeHtml(preview.origin.resolvedShortCommit || preview.origin.resolvedCommit.slice(0, 12))}</dd>`
            : ""
        }
      </dl>
    </section>
    <section class="detail-section">
      <h3>${t("sourcePreview.validationTitle")}</h3>
      ${renderSourceValidation(preview)}
    </section>
  `;
}

function renderRuntimeInspector() {
  const runtime = state.runtime;
  return `
    ${renderInspectorHeader({
      title: t("inspector.runtimeTitle"),
      body: t("workspace.runtime.subtitle"),
      badges: [{ label: runtime ? t("inspector.ready") : t("runtime.unavailable"), tone: runtime ? "low" : "medium" }],
    })}
    <section class="detail-section">
      <h3>${t("inspector.localState")}</h3>
      <div class="runtime-stats runtime-stats-wide">
        <div class="runtime-stat"><strong>${runtime?.counts?.running || 0}</strong><span>${t("runtime.running")}</span></div>
        <div class="runtime-stat"><strong>${runtime?.counts?.queued || 0}</strong><span>${t("runtime.queued")}</span></div>
        <div class="runtime-stat"><strong>${runtime?.counts?.locks || 0}</strong><span>${t("runtime.locks")}</span></div>
        <div class="runtime-stat"><strong>${runtime?.counts?.runs || 0}</strong><span>${t("runtime.runs")}</span></div>
      </div>
    </section>
    <section class="detail-section">
      <h3>${t("sections.runtimeRuns")}</h3>
      ${renderRecentRunPreview(runtime?.runs || [])}
    </section>
  `;
}

function renderBridgeInspector() {
  const record = getBridgeRecord();
  return `
    ${renderInspectorHeader({
      title: t("inspector.bridgeTitle"),
      body: t("bridge.body"),
      badges: [{ label: record ? t("bridge.installed") : t("inspector.notInstalled"), tone: record ? "low" : "medium" }],
    })}
    <section class="detail-section">
      <h3>${t("inspector.localState")}</h3>
      <dl class="kv">
        <dt>${t("labels.status")}</dt>
        <dd>${escapeHtml(record ? statusName(record.status) : t("inspector.notInstalled"))}</dd>
        <dt>${t("labels.libraryPath")}</dt>
        <dd>${escapeHtml(record?.libraryPath || t("common.notInLibrary"))}</dd>
        <dt>${t("labels.trust")}</dt>
        <dd>${escapeHtml(trustName(record?.trust?.status || "unreviewed"))}</dd>
      </dl>
    </section>
  `;
}

function renderProfilesInspector() {
  const profiles = state.profiles?.profiles || state.runtime?.profiles || [];
  const enabled = profiles.filter((profile) => profile.enabled !== false);
  const disabledCount = Math.max(0, profiles.length - enabled.length);
  return `
    ${renderInspectorHeader({
      title: t("profiles.targetPreviewTitle"),
      body: t("profiles.targetPreviewBody"),
      badges: [
        { label: t("profiles.enabledSummary", { enabled: enabled.length, total: profiles.length }), tone: enabled.length ? "low" : "medium" },
        ...(disabledCount ? [{ label: t("profiles.disabledSummary", { count: disabledCount }), tone: "neutral" }] : []),
      ],
    })}
    <section class="detail-section">
      <h3>${t("sections.distributionTargets")}</h3>
      ${renderProfileTargetPreview(profiles)}
    </section>
    <section class="detail-section compact-note">
      <h3>${t("profiles.targetNoteTitle")}</h3>
      <p>${t("profiles.targetNoteBody")}</p>
    </section>
  `;
}

function renderProfileTargetPreview(profiles) {
  if (!profiles.length) return `<p class="status-line compact">${t("profiles.noEnabledTargets")}</p>`;
  return `
    <ul class="profile-target-preview">
      ${profiles
        .map((profile) => {
          const enabled = profile.enabled !== false;
          const typeLabel = profile.canDelete ? t("profiles.custom") : t("profiles.default");
          return `
            <li class="${enabled ? "enabled" : "disabled"}">
              <span>
                <strong>${escapeHtml(profile.name)}</strong>
                <small>${escapeHtml(profile.skillRoot)}</small>
              </span>
              <span class="profile-target-meta">
                <span class="badge neutral">${escapeHtml(typeLabel)}</span>
                <span class="badge ${enabled ? "low" : "neutral"}">${escapeHtml(enabled ? t("profiles.readyTarget") : t("profiles.disabledTarget"))}</span>
              </span>
            </li>
          `;
        })
        .join("")}
    </ul>
  `;
}

function renderGenericInspector() {
  return `
    ${renderInspectorHeader({
      title: t(`workspace.${state.view}.title`),
      body: t(`workspace.${state.view}.subtitle`),
      badges: [{ label: t("inspector.ready"), tone: "low" }],
    })}
  `;
}

function renderInspectorHeader({ title, body, badges = [] }) {
  return `
    <header class="detail-header inspector-summary">
      <div class="badge-line">
        ${badges
          .map((badge) => `<span class="badge ${badge.tone || "neutral"}">${escapeHtml(badge.label)}</span>`)
          .join("")}
      </div>
      <h2>${escapeHtml(title)}</h2>
      <p>${escapeHtml(body)}</p>
    </header>
  `;
}

function renderStepSection(steps) {
  return `
    <section class="detail-section">
      <h3>${t("inspector.nextStep")}</h3>
      <ol class="inspector-steps">
        ${steps
          .map(
            (step) => `
              <li class="${step.done ? "done" : step.current ? "current" : ""}">
                <span></span>
                <p>${escapeHtml(step.text)}</p>
              </li>
            `,
          )
          .join("")}
      </ol>
    </section>
  `;
}

function renderRecentRunPreview(runs) {
  if (!runs.length) return `<p class="status-line compact">${t("runtime.noRuns")}</p>`;
  return `
    <ul class="run-list">
      ${runs
        .slice(0, 5)
        .map(
          (run) => `
            <li>
              <div class="run-head">
                <strong>${escapeHtml(run.skillName)}</strong>
                <span class="badge ${statusClass(run.status)}">${escapeHtml(statusName(run.status))}</span>
              </div>
              <div class="meta-line">
                <span>${escapeHtml(run.agentName)}</span>
                <span>${escapeHtml(run.execution?.type || run.policy)}</span>
              </div>
            </li>
          `,
        )
        .join("")}
    </ul>
  `;
}

function renderSelectedSkill() {
  const skill = (state.catalog?.skills || []).find((item) => item.id === state.selectedId);
  if (!skill) {
    setInspectorTitle(t("inspector.reviewTitle"));
    setInspectorContext(t("empty.selectSkillTitle"));
    elements.emptyDetailTitle.textContent = t("empty.selectSkillTitle");
    elements.emptyDetailBody.textContent = t("empty.selectSkillBody");
    elements.emptyDetail.classList.remove("hidden");
    elements.skillDetail.classList.add("hidden");
    elements.skillDetail.innerHTML = "";
    return;
  }

  setInspectorTitle(t("inspector.reviewTitle"));
  setInspectorContext(skill.name);
  elements.emptyDetail.classList.add("hidden");
  elements.skillDetail.classList.remove("hidden");
  elements.skillDetail.innerHTML = `
    <header class="detail-header">
      <div class="badge-line">
        <span class="badge ${skill.risk.level}">${escapeHtml(t("risk.label", { level: riskName(skill.risk.level) }))}</span>
        <span class="badge neutral">${escapeHtml(skill.tool)}</span>
        <span class="badge neutral">${escapeHtml(skill.rootLabel)}</span>
        ${renderGovernanceBadge(skill.governance)}
        ${renderTrustBadge(skill.governance?.trust)}
      </div>
      <h2>${escapeHtml(skill.name)}</h2>
      <p>${escapeHtml(skill.description || t("common.noDescription"))}</p>
      <dl class="kv">
        <dt>${t("labels.path")}</dt>
        <dd>${escapeHtml(skill.path)}</dd>
        <dt>${t("labels.updated")}</dt>
        <dd>${escapeHtml(formatTime(skill.updatedAt))}</dd>
        <dt>${t("labels.files")}</dt>
        <dd>${skill.files.length}</dd>
      </dl>
    </header>

    <section class="detail-section">
      <h3>${t("sections.policy")}</h3>
      ${renderTrustForm(skill.governance?.trust, skill.governance?.policy)}
    </section>

    <section class="detail-section">
      <h3>${t("sections.distribution")}</h3>
      ${renderGovernance(skill)}
    </section>

    <section class="detail-section">
      <h3>${t("sections.riskFindings")}</h3>
      ${renderRiskFindings(skill)}
    </section>

    ${renderSkillAiInterpretationSection(skill)}

    <section class="detail-section">
      <h3>${t("sections.validation")}</h3>
      ${renderValidation(skill)}
    </section>

    <section class="detail-section">
      <h3>${t("sections.dependencies")}</h3>
      ${renderDependencies(skill)}
    </section>

    <section class="detail-section">
      <h3>${t("sections.files")}</h3>
      ${renderFiles(skill)}
    </section>

    <section class="detail-section">
      <h3>${t("sections.frontmatter")}</h3>
      <pre>${escapeHtml(skill.frontmatterRaw || t("common.none"))}</pre>
    </section>

    <section class="detail-section">
      <h3>${t("sections.instructions")}</h3>
      <pre>${escapeHtml(trimPreview(skill.body || "", 5000) || t("common.empty"))}</pre>
      ${skill.bodyTruncated ? `<p class="status-line">${t("common.truncated")}</p>` : ""}
    </section>
  `;

}

function renderSelectedLibraryRecord() {
  const records = state.library?.records || [];
  if (!state.selectedRecordId && records.length) {
    state.selectedRecordId = records[0].id;
  }
  const record = records.find((item) => item.id === state.selectedRecordId);
  if (!record) {
    setInspectorTitle(t("inspector.distributeTitle"));
    setInspectorContext(t("empty.selectLibraryTitle"));
    elements.emptyDetailTitle.textContent = t("empty.selectLibraryTitle");
    elements.emptyDetailBody.textContent = t("empty.selectLibraryBody");
    elements.emptyDetail.classList.remove("hidden");
    elements.skillDetail.classList.add("hidden");
    elements.skillDetail.innerHTML = "";
    return;
  }

  setInspectorTitle(t("inspector.distributeTitle"));
  setInspectorContext(record.name);
  elements.emptyDetail.classList.add("hidden");
  elements.skillDetail.classList.remove("hidden");
  elements.skillDetail.innerHTML = `
    <header class="detail-header">
      <div class="badge-line">
        <span class="badge ${libraryStatusClass(record.status)}">${escapeHtml(statusName(record.status))}</span>
        ${renderTrustBadge(record.trust)}
        <span class="badge neutral">${t("governance.library")}</span>
      </div>
      <h2>${escapeHtml(record.name)}</h2>
      <p>${escapeHtml(record.description || t("common.noDescription"))}</p>
      <dl class="kv">
        <dt>${t("labels.version")}</dt>
        <dd>${escapeHtml(record.version)}</dd>
        <dt>${t("labels.fingerprint")}</dt>
        <dd>${escapeHtml((record.fingerprint || "").slice(0, 16))}</dd>
        <dt>${t("labels.libraryPath")}</dt>
        <dd>${escapeHtml(record.libraryPath)}</dd>
        <dt>${t("labels.source")}</dt>
        <dd>${escapeHtml(renderRecordSource(record))}</dd>
      </dl>
    </header>

    <section class="detail-section primary-action-section">
      <h3>${t("sections.publishFromLibrary")}</h3>
      ${renderLibraryPublishForm(record)}
    </section>

    <section class="detail-section">
      <h3>${t("sections.publishedAgents")}</h3>
      ${renderLibraryPublications(record)}
    </section>

    <section class="detail-section">
      <h3>${t("sections.policy")}</h3>
      ${renderTrustForm(record.trust, null)}
    </section>

    ${renderLibraryAiInterpretationSection(record)}
  `;
}

function renderLibraryPublishForm(record) {
  const profiles = getEnabledProfiles();
  const targetStates = record.targetStates || profiles.map((profile) => ({
    profileId: profile.id,
    profileName: profile.name,
    status: "available",
    targetPath: profile.skillRoot,
  }));
  if (!profiles.length) {
    return `<p class="status-line">${t("profiles.none")}</p>`;
  }

  return `
    <form class="invoke-form" id="libraryPublishForm">
      <div class="copy-target-summary">
        <strong>${t("sections.distributionTargets")}</strong>
        <span>${t("library.availableTargets", { count: profiles.length })}</span>
      </div>
      <div class="copy-method-panel">
        <label>
          <span>${t("library.copyMethodTitle")}</span>
          <select name="publishMode">
            ${renderPublishModeOptions("managed-mirror")}
          </select>
        </label>
        <p>${t("library.copyMethodHelp")}</p>
      </div>
      ${renderCopyTargetActionList(targetStates)}
      <div class="invoke-note">
        ${t("library.publishNote")}
      </div>
    </form>
  `;
}

function renderCopyTargetActionList(targetStates) {
  if (!targetStates.length) return "";
  return `
    <div class="target-state-list action-list">
      ${targetStates
        .map((target) => {
          const blocked = ["conflict", "managed-other"].includes(target.status);
          return `
            <div class="target-state-item ${escapeHtml(target.status)}">
              <span>
                <strong>${escapeHtml(target.profileName)}</strong>
                <small>${escapeHtml(target.targetPath)}</small>
                ${target.status === "conflict" ? `<small>${escapeHtml(t("library.conflictHelp"))}</small>` : ""}
                ${target.status === "outdated" ? `<small>${escapeHtml(t("library.outdatedHelp"))}</small>` : ""}
                ${target.status === "stale" ? `<small>${escapeHtml(t("library.staleHelp"))}</small>` : ""}
              </span>
              <span class="target-action">
                <span class="badge ${targetStateTone(target.status)}">${escapeHtml(targetStateName(target.status))}</span>
                <button
                  type="submit"
                  class="secondary-button copy-target-button"
                  data-profile-id="${escapeHtml(target.profileId)}"
                  ${blocked ? "disabled" : ""}
                >
                  ${escapeHtml(copyTargetActionName(target))}
                </button>
              </span>
            </div>
          `;
        })
        .join("")}
    </div>
  `;
}

function copyTargetActionName(target) {
  if (target.status === "conflict") {
    return state.language === "zh"
      ? `${target.profileName} 已有同名 skill`
      : `${target.profileName} already has this skill`;
  }
  if (target.status === "managed-other") {
    return state.language === "zh"
      ? `${target.profileName} 已被其他记录占用`
      : `${target.profileName} used by another record`;
  }
  if (target.status === "stale") return t("actions.copyAgainToProfile", { profile: target.profileName });
  if (["managed", "outdated"].includes(target.status)) return t("actions.updateProfileCopy", { profile: target.profileName });
  return t("actions.copyToProfile", { profile: target.profileName });
}

function renderLibraryPublications(record) {
  const published = record.publishedTo || [];
  const targetStatesByProfile = new Map((record.targetStates || []).map((target) => [target.profileId, target]));
  if (!published.length) {
    return `
      <div class="empty-card compact">
        <h3>${t("library.notPublished")}</h3>
        <p>${t("library.publishedEmptyNext")}</p>
      </div>
    `;
  }
  return `
    <div class="published-list">
      ${published
        .map((item) => {
          const targetState = targetStatesByProfile.get(item.profileId);
          return `
            <div class="published-item">
              <span>
                <strong>${escapeHtml(item.profileName)}</strong>
                <small>${escapeHtml(t("library.targetPath"))}: ${escapeHtml(item.targetPath)}</small>
                <small>${escapeHtml(t("library.copyMode"))}: ${escapeHtml(publishModeName(item.publishMode))}</small>
                <small>${escapeHtml(t("library.lastCopied"))}: ${escapeHtml(formatTime(item.publishedAt))}</small>
              </span>
              ${targetState ? `<span class="badge ${targetStateTone(targetState.status)}">${escapeHtml(targetStateName(targetState.status))}</span>` : ""}
              <span class="published-actions">
                <button type="button" class="secondary-button" data-republish-record data-profile-id="${escapeHtml(item.profileId)}">${t("actions.republish")}</button>
                <button type="button" class="secondary-button" data-unpublish-record data-profile-id="${escapeHtml(item.profileId)}">${t("actions.unpublish")}</button>
              </span>
            </div>
          `;
        })
        .join("")}
    </div>
  `;
}

function renderRecordSource(record) {
  if (record.source?.url) return record.source.url;
  if (record.source?.path) return record.source.path;
  return record.sourcePath || record.sourceType || t("labels.unknown");
}

function renderTrustForm(trust, policy) {
  const current = trust?.status || "unreviewed";
  const selected = current === "trusted" ? "reviewed" : current;
  const decisions = ["unreviewed", "reviewed", "blocked"];
  return `
    <form class="invoke-form safety-form" id="trustForm">
      <div class="safety-result ${trustResultTone(trust, policy)}">
        <strong>${t("trust.effectTitle")}</strong>
        <p>${escapeHtml(trustCurrentMessage(trust, policy))}</p>
      </div>
      <div class="trust-choice-grid" role="radiogroup" aria-label="${escapeHtml(t("labels.trust"))}">
        ${decisions
          .map(
            (status) => `
              <label class="trust-choice trust-${escapeHtml(status)} ${selected === status ? "selected" : ""}">
                <input type="radio" name="status" value="${status}" ${selected === status ? "checked" : ""} />
                <span>
                  <strong>${escapeHtml(trustName(status))}</strong>
                  <small>${escapeHtml(trustEffect(status))}</small>
                </span>
              </label>
            `,
          )
          .join("")}
      </div>
      <input type="hidden" name="reviewer" value="${escapeHtml(trust?.reviewer || "local")}" />
      <label>
        ${t("labels.notes")}
        <input name="notes" value="${escapeHtml(trust?.notes || "")}" />
      </label>
      <button type="submit">${t("actions.saveTrust")}</button>
    </form>
  `;
}

function trustEffect(status) {
  if (status === "blocked") return t("trust.effectBlocked");
  if (status === "reviewed" || status === "trusted") return t("trust.effectReviewed");
  return t("trust.effectUnreviewed");
}

function trustCurrentMessage(trust, policy) {
  const status = trust?.status || "unreviewed";
  if (status === "blocked" || policy?.blocked) return t("trust.currentBlocked");
  if (policy?.allowedToPublish === false) return t("trust.currentReviewRequired");
  return t("trust.currentAllowed");
}

function trustResultTone(trust, policy) {
  const status = trust?.status || "unreviewed";
  if (status === "blocked" || policy?.blocked) return "high";
  if (policy?.allowedToPublish === false) return "medium";
  return "low";
}

function renderGovernance(skill) {
  const governance = skill.governance || {};
  const published = governance.publishedTo || [];
  const recordId = governance.recordId || governance.record?.id || "";
  const inLibrary = Boolean(governance.inLibrary || recordId || governance.libraryPath);

  return `
    <dl class="kv">
      <dt>${t("labels.status")}</dt>
      <dd>${escapeHtml(statusName(governance.status || "unmanaged"))}</dd>
      <dt>${t("labels.fingerprint")}</dt>
      <dd>${escapeHtml((governance.fingerprint || "").slice(0, 16))}</dd>
      <dt>${t("labels.library")}</dt>
      <dd>${escapeHtml(governance.libraryPath || t("common.notInLibrary"))}</dd>
    </dl>

    <div class="next-action-panel">
      <strong>${escapeHtml(inLibrary ? t("actions.openInLibrary") : t("actions.adoptIntoLibrary"))}</strong>
      <p>${escapeHtml(inLibrary ? t("governance.inLibraryNext") : t("governance.unmanagedNext"))}</p>
      <button type="button" ${inLibrary ? `data-open-library-record="${escapeHtml(recordId)}"` : "data-adopt-skill"}>
        ${escapeHtml(inLibrary ? t("actions.openInLibrary") : t("actions.adoptIntoLibrary"))}
      </button>
      <small>${escapeHtml(t("governance.manageOnlyNote"))}</small>
    </div>

    ${
      published.length
        ? `<div class="published-list">
            ${published
              .map(
                (item) => `
                  <div class="published-item">
                    ${escapeHtml(item.profileName)} / ${escapeHtml(publishModeName(item.publishMode))} / ${escapeHtml(item.targetPath)}
                  </div>
                `,
              )
              .join("")}
          </div>`
        : `<p class="status-line">${t("governance.notPublished")}</p>`
    }
  `;
}

function renderPublishModeOptions(selected) {
  return ["managed-mirror", "copy", "symlink"]
    .map((mode) => `<option value="${mode}" ${mode === selected ? "selected" : ""}>${escapeHtml(publishModeName(mode))}</option>`)
    .join("");
}

function publishModeName(mode) {
  const names = {
    "managed-mirror": state.language === "zh" ? "安全副本" : "Safe copy",
    copy: state.language === "zh" ? "普通复制" : "Plain copy",
    symlink: state.language === "zh" ? "链接到原目录" : "Link to original",
  };
  return names[mode] || mode;
}

function targetStateName(status) {
  const names = {
    available: t("library.target.available"),
    managed: t("library.target.managed"),
    outdated: t("library.target.outdated"),
    stale: t("library.target.stale"),
    conflict: t("library.target.conflict"),
    "managed-other": t("library.target.managedOther"),
  };
  return names[status] || status;
}

function targetStateTone(status) {
  if (status === "available" || status === "managed") return "low";
  if (status === "outdated" || status === "stale") return "medium";
  if (status === "conflict" || status === "managed-other") return "high";
  return "medium";
}

function renderInvocationForm(skill) {
  const profiles = getEnabledProfiles();
  const profileOptions = profiles
    .map((profile) => `<option value="${escapeHtml(profile.id)}">${escapeHtml(profile.name)}</option>`)
    .join("");

  return `
    <form class="invoke-form" id="invokeForm">
      <div class="invoke-grid">
        <label>
          ${t("labels.agent")}
          <select name="agentId">${profileOptions}</select>
        </label>
        <label>
          ${t("labels.concurrency")}
          <select name="policy">
            <option value="parallel">parallel</option>
            <option value="serialized" selected>serialized</option>
            <option value="singleton">singleton</option>
            <option value="keyed">keyed</option>
          </select>
        </label>
      </div>
      <label>
        ${t("labels.resourceKey")}
        <input name="resourceKey" value="${escapeHtml(skill.rootPath || skill.path)}" />
      </label>
      <label>
        ${t("labels.prompt")}
        <input name="prompt" value="${escapeHtml(t("invocation.promptValue", { name: skill.name }))}" />
      </label>
      <button type="submit">${t("actions.startInvocation")}</button>
      <div class="invoke-note">
        ${t("invocation.note")}
      </div>
    </form>
  `;
}

function renderLocks(skill) {
  const locks = (state.runtime?.locks || []).filter((lock) => lock.skillId === skill.id);
  if (!locks.length) return `<p class="status-line">${t("locks.none")}</p>`;
  return `
    <ul class="lock-list">
      ${locks
        .map(
          (lock) => `
            <li>
              <span>${escapeHtml(lock.lockKey)}</span>
              <span>${escapeHtml(lock.agentName)} / ${escapeHtml(lock.runId)}</span>
            </li>
          `,
        )
        .join("")}
    </ul>
  `;
}

function renderRuns(skill) {
  const runs = (state.runtime?.runs || [])
    .filter((run) => run.skillId === skill.id)
    .slice(0, 8);
  if (!runs.length) return `<p class="status-line">${t("runs.none")}</p>`;
  return `
    <ul class="run-list">
      ${runs
        .map(
          (run) => `
            <li>
              <div class="run-head">
                <strong>${escapeHtml(run.id)} / ${escapeHtml(run.agentName)}</strong>
                <span class="badge ${statusClass(run.status)}">${escapeHtml(statusName(run.status))}</span>
              </div>
              <div class="meta-line">
                <span>${escapeHtml(run.policy)}</span>
                ${run.lockKey ? `<span>${escapeHtml(run.lockKey)}</span>` : `<span>${t("labels.noLock")}</span>`}
                ${run.blockedBy ? `<span>${t("labels.blockedBy", { runId: escapeHtml(run.blockedBy) })}</span>` : ""}
              </div>
              ${
                run.status === "running"
                  ? `<div class="run-actions"><button type="button" data-complete-run-id="${escapeHtml(run.id)}">${t("actions.complete")}</button></div>`
                  : ""
              }
            </li>
          `,
        )
        .join("")}
    </ul>
  `;
}

async function startInvocation(payload) {
  setStatus(t("status.creatingInvocation"));
  const response = await fetch("/api/invocations", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    setStatus(error.detail || t("status.invocationFailed", { status: response.status }));
    return;
  }
  const result = await response.json();
  await loadRuntime();
  setStatus(t("status.invocationCreated", { id: result.run.id, status: statusName(result.run.status) }));
}

async function completeInvocation(runId) {
  setStatus(t("status.completing", { id: runId }));
  const response = await fetch(`/api/invocations/${runId}/complete`, {
    method: "POST",
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    setStatus(error.detail || t("status.completeFailed", { status: response.status }));
    return;
  }
  const result = await response.json();
  await loadRuntime();
  const promoted = result.promoted?.length
    ? t("status.promoted", { count: result.promoted.length })
    : "";
  setStatus(t("status.invocationCompleted", { id: runId, promoted }));
}

async function loadRuntime() {
  const response = await fetch("/api/runtime");
  if (!response.ok) throw new Error(t("status.runtimeFailed", { status: response.status }));
  state.runtime = await response.json();
  renderRuntime();
  renderSelectedDetail();
}

async function refreshCatalogAndRuntime() {
  const [skillsResponse, runtimeResponse, libraryResponse, firstRunResponse, profilesResponse] = await Promise.all([
    fetch("/api/skills"),
    fetch("/api/runtime"),
    fetch("/api/library"),
    fetch("/api/first-run"),
    fetch("/api/profiles"),
  ]);
  if (!skillsResponse.ok) throw new Error(t("status.scanFailed", { status: skillsResponse.status }));
  if (!runtimeResponse.ok) throw new Error(t("status.runtimeFailed", { status: runtimeResponse.status }));
  if (!libraryResponse.ok) throw new Error(t("status.libraryFailed", { status: libraryResponse.status }));
  if (!firstRunResponse.ok) throw new Error(t("status.firstRunFailed", { status: firstRunResponse.status }));
  if (!profilesResponse.ok) throw new Error(t("status.runtimeFailed", { status: profilesResponse.status }));
  state.catalog = await skillsResponse.json();
  state.runtime = await runtimeResponse.json();
  state.library = await libraryResponse.json();
  state.firstRun = await firstRunResponse.json();
  state.profiles = await profilesResponse.json();
  reconcileFirstRunSelection();
  populateToolFilter();
  applyFilters();
  renderSummary();
  renderRoots();
  renderGovernanceSummary();
  renderLibrary();
  renderRuntime();
  renderBridgePanel();
  renderProfilesPanel();
  renderFirstRunImport();
  renderWorkspace();
}

async function adoptFirstRun(payload) {
  if (payload.mode === "selected" && (!payload.skillIds || payload.skillIds.length === 0)) {
    setStatus(t("status.selectSkillToAdopt"));
    return;
  }

  setFirstRunBusy(true);
  setStatus(payload.mode === "low-risk" ? t("status.adoptingLowRisk") : t("status.adoptingSelected"));
  try {
    const response = await fetch("/api/first-run/adopt", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        mode: payload.mode,
        skillIds: payload.skillIds || [],
        invocationMode: "native",
      }),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      setStatus(error.detail || t("status.firstRunAdoptFailed", { status: response.status }));
      return;
    }
    const result = await response.json();
    state.firstRunSelected.clear();
    await refreshCatalogAndRuntime();
    setStatus(t("status.firstRunAdopted", result.counts));
  } finally {
    setFirstRunBusy(false);
  }
}

async function completeFirstRun() {
  setFirstRunBusy(true);
  setStatus(t("status.finishingFirstRun"));
  try {
    const response = await fetch("/api/first-run/complete", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({}),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      setStatus(error.detail || t("status.finishFailed", { status: response.status }));
      return;
    }
    await refreshCatalogAndRuntime();
    setStatus(t("status.firstRunFinished"));
  } finally {
    setFirstRunBusy(false);
  }
}

async function adoptSkill(payload) {
  setStatus(t("status.adoptingSkill"));
  const response = await fetch(`/api/skills/${payload.skillId}/adopt`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      invocationMode: payload.invocationMode,
    }),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    setStatus(error.detail || t("status.adoptFailed", { status: response.status }));
    return;
  }
  await refreshCatalogAndRuntime();
  setStatus(t("status.skillAdopted"));
}

async function publishSkill(payload) {
  setStatus(t("status.publishingSkill"));
  const response = await fetch(`/api/skills/${payload.skillId}/publish`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      profileId: payload.profileId,
      invocationMode: payload.invocationMode,
      publishMode: payload.publishMode,
    }),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    setStatus(error.detail || t("status.publishFailed", { status: response.status }));
    return;
  }
  const result = await response.json();
  await refreshCatalogAndRuntime();
  setStatus(t("status.publishedTo", { profile: result.profile.name }));
}

async function publishLibraryRecord(payload) {
  if (!payload.recordId) {
    setStatus(t("status.selectLibraryRecord"));
    return;
  }
  setStatus(t("status.publishingRecord"));
  const response = await fetch(`/api/library/${encodeURIComponent(payload.recordId)}/publish`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      profileId: payload.profileId,
      invocationMode: payload.invocationMode,
      publishMode: payload.publishMode,
    }),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    setStatus(error.detail || t("status.publishFailed", { status: response.status }));
    return;
  }
  const result = await response.json();
  state.selectionType = "library";
  state.selectedRecordId = result.record.id;
  setView("library");
  await refreshCatalogAndRuntime();
  setStatus(t("status.publishedRecord", { record: result.record.name, profile: result.profile.name }));
}

async function republishLibraryRecord(payload) {
  if (!payload.recordId || !payload.profileId) return;
  setStatus(t("status.republishingRecord"));
  const response = await fetch(`/api/library/${encodeURIComponent(payload.recordId)}/republish`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      profileId: payload.profileId,
    }),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    setStatus(error.detail || t("status.publishFailed", { status: response.status }));
    return;
  }
  const result = await response.json();
  await refreshCatalogAndRuntime();
  setStatus(t("status.publishedRecord", { record: result.record.name, profile: result.profile.name }));
}

async function unpublishLibraryRecord(payload) {
  if (!payload.recordId || !payload.profileId) return;
  setStatus(t("status.unpublishingRecord"));
  const response = await fetch(`/api/library/${encodeURIComponent(payload.recordId)}/unpublish`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      profileId: payload.profileId,
    }),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    setStatus(error.detail || t("status.publishFailed", { status: response.status }));
    return;
  }
  const result = await response.json();
  await refreshCatalogAndRuntime();
  setStatus(t("status.recordUnpublished", { profile: result.profile.name }));
}

async function saveTrust(payload) {
  const isLibrary = payload.type === "library";
  const id = isLibrary ? payload.recordId : payload.skillId;
  if (!id) return;
  setStatus(t("status.savingTrust"));
  const url = isLibrary
    ? `/api/library/${encodeURIComponent(id)}/trust`
    : `/api/skills/${encodeURIComponent(id)}/trust`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      status: payload.status,
      notes: payload.notes,
      reviewer: payload.reviewer,
    }),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    setStatus(error.detail || t("status.saveFailed", { status: response.status }));
    return;
  }
  await refreshCatalogAndRuntime();
  setStatus(t("status.trustSaved", { status: trustName(payload.status) }));
}

async function installBridgeSkill() {
  setStatus(t("status.installingBridge"));
  const response = await fetch("/api/bridge", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({}),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    setStatus(error.detail || t("status.installFailed", { status: response.status }));
    return;
  }
  await refreshCatalogAndRuntime();
  setStatus(t("status.bridgeInstalled"));
}

async function saveProfile(profileId, payload) {
  if (!profileId) return;
  setStatus(t("status.savingProfile"));
  const response = await fetch(`/api/profiles/${encodeURIComponent(profileId)}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    setStatus(error.detail || t("status.saveFailed", { status: response.status }));
    return;
  }
  await refreshCatalogAndRuntime();
  setStatus(t("status.profileSaved"));
}

async function createProfile(payload) {
  setStatus(t("status.savingProfile"));
  const response = await fetch("/api/profiles", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    setStatus(error.detail || t("status.saveFailed", { status: response.status }));
    return;
  }
  await refreshCatalogAndRuntime();
  setStatus(t("status.profileSaved"));
}

async function deleteProfile(profileId) {
  setStatus(t("status.savingProfile"));
  const response = await fetch(`/api/profiles/${encodeURIComponent(profileId)}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    setStatus(error.detail || t("status.saveFailed", { status: response.status }));
    return;
  }
  await refreshCatalogAndRuntime();
  setStatus(t("status.profileDeleted"));
}

async function pickSkillRoot(trigger) {
  const input = trigger.closest("form")?.querySelector('input[name="skillRoot"]');
  const invoke = getTauriInvoke();
  if (!(input instanceof HTMLInputElement) || !invoke) {
    setStatus(t("status.folderPickerUnavailable"));
    return;
  }
  if (trigger instanceof HTMLButtonElement) trigger.disabled = true;
  try {
    const selectedPath = await invoke("pick_agent_skill_folder", {});
    if (typeof selectedPath === "string" && selectedPath.trim()) {
      input.value = selectedPath.trim();
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.focus();
    }
  } catch (error) {
    setStatus(t("status.folderPickerFailed", { status: error?.message || String(error) }));
  } finally {
    if (trigger instanceof HTMLButtonElement) trigger.disabled = false;
  }
}

function getTauriInvoke() {
  return window.__TAURI_INTERNALS__?.invoke || null;
}

function isTauriApp() {
  return Boolean(window.isTauri && getTauriInvoke());
}

async function resetProfileSettings() {
  setStatus(t("status.savingProfile"));
  const response = await fetch("/api/profiles/reset", {
    method: "POST",
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    setStatus(error.detail || t("status.saveFailed", { status: response.status }));
    return;
  }
  await refreshCatalogAndRuntime();
  setStatus(t("status.profileSaved"));
}

async function updateGovernance(payload) {
  setStatus(t("status.savingMode"));
  const response = await fetch(`/api/skills/${payload.skillId}/mode`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      invocationMode: payload.invocationMode,
    }),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    setStatus(error.detail || t("status.saveFailed", { status: response.status }));
    return;
  }
  await refreshCatalogAndRuntime();
  setStatus(t("status.modeSaved", { mode: payload.invocationMode }));
}

async function previewSource() {
  const payload = getSourcePayload();
  if (!payload.source) {
    setStatus(t("status.enterSource"));
    return;
  }
  setImportBusy(true);
  setStatus(t("status.previewingSource"));
  try {
    const response = await fetch("/api/sources/preview", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      setStatus(error.detail || t("status.previewFailed", { status: response.status }));
      return;
    }
    const preview = await response.json();
    rememberSource(payload);
    renderSourcePreview(preview, "preview");
    renderSelectedDetail();
    setStatus(t("status.previewed", { name: preview.name }));
  } finally {
    setImportBusy(false);
  }
}

async function installSource() {
  const payload = getSourcePayload();
  if (!payload.source) {
    setStatus(t("status.enterSource"));
    return;
  }
  if (!state.sourcePreview) {
    setStatus(t("status.analyzeFirst"));
    return;
  }
  const existingRecordId = getSavedSourceRecordId();
  if (existingRecordId && !payload.replace) {
    openLibraryRecord(existingRecordId);
    setStatus(t("status.sourceAlreadySaved", { name: state.sourcePreview.name }));
    return;
  }
  setImportBusy(true);
  setStatus(t("status.installingSource"));
  try {
    const response = await fetch("/api/sources/install", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      setStatus(error.detail || t("status.installFailed", { status: response.status }));
      return;
    }
    const result = await response.json();
    const recordId = result.install.record.id;
    const installedPreview = {
      ...result.preview,
      libraryRecord: {
        exists: true,
        id: recordId,
        name: result.install.record.name,
        version: result.install.record.version,
        fingerprint: result.install.record.fingerprint,
        libraryPath: result.install.record.libraryPath,
        status: result.install.record.status,
        updatedAt: result.install.record.updatedAt || result.install.record.installedAt || null,
      },
    };
    renderSourcePreview(installedPreview, "installed");
    await refreshCatalogAndRuntime();
    state.selectionType = "library";
    state.selectedRecordId = recordId;
    setView("library");
    setStatus(t("status.installedSource", { name: result.install.record.name }));
  } finally {
    setImportBusy(false);
  }
}

function getSavedSourceRecordId(preview = state.sourcePreview) {
  const record = preview?.libraryRecord;
  if (!record?.exists || !record.id) return null;
  if (record.fingerprint && preview.fingerprint && record.fingerprint !== preview.fingerprint) return null;
  return record.id;
}

function openLibraryRecord(recordId) {
  state.selectionType = "library";
  state.selectedRecordId = recordId;
  setView("library");
  renderLibrary();
  renderSelectedDetail();
}

function getSourcePayload() {
  const formData = new FormData(elements.sourceImportForm);
  return {
    source: String(formData.get("source") || "").trim(),
    ref: String(formData.get("ref") || "").trim(),
    subdir: String(formData.get("subdir") || "").trim(),
    invocationMode: String(formData.get("invocationMode") || "native"),
    replace: Boolean(formData.get("replace")),
    pin: Boolean(formData.get("pin")),
  };
}

function setImportBusy(isBusy) {
  state.importBusy = isBusy;
  syncImportActions();
}

function syncImportActions() {
  elements.previewSourceButton.disabled = state.importBusy;
  elements.installSourceButton.disabled = state.importBusy || !state.sourcePreview;
  elements.installSourceButton.textContent = getSavedSourceRecordId()
    ? t("actions.viewSavedSkill")
    : t("actions.install");
}

function renderAiSettingsForm() {
  if (!elements.aiSettingsForm || !state.aiSettings) return;
  elements.aiSettingsForm.enabled.checked = Boolean(state.aiSettings.enabled);
  elements.aiSettingsForm.provider.value = state.aiSettings.provider || "openai-compatible";
  elements.aiSettingsForm.baseUrl.value = state.aiSettings.baseUrl || "";
  elements.aiSettingsForm.model.value = state.aiSettings.model || "";
  elements.aiSettingsForm.apiKey.value = "";
  elements.aiSettingsForm.apiKey.placeholder = state.aiSettings.apiKeySet
    ? t("ai.keySet")
    : t("ai.apiKeyPlaceholder");
  syncAiSettingsActions();
}

function applyAiProviderPreset(provider) {
  if (!elements.aiSettingsForm) return;
  const preset = AI_PROVIDER_PRESETS[provider];
  if (!preset) return;
  elements.aiSettingsForm.baseUrl.value = preset.baseUrl;
  elements.aiSettingsForm.model.value = preset.model;
}

async function saveAiSettings() {
  if (!elements.aiSettingsForm) return;
  const response = await saveAiSettingsFromForm();
  if (!response) return;
  setStatus(t("ai.saved"));
  setAiSettingsFeedback(t("ai.saved"), "low");
}

async function saveAiSettingsFromForm() {
  if (!elements.aiSettingsForm) return null;
  const formData = new FormData(elements.aiSettingsForm);
  const payload = {
    enabled: Boolean(formData.get("enabled")),
    provider: String(formData.get("provider") || "openai-compatible").trim(),
    baseUrl: String(formData.get("baseUrl") || "").trim(),
    model: String(formData.get("model") || "").trim(),
    apiKey: String(formData.get("apiKey") || "").trim(),
  };
  const response = await fetch("/api/ai/settings", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const message = t("status.saveFailed", { status: response.status });
    setStatus(message);
    setAiSettingsFeedback(message, "high");
    return null;
  }
  state.aiSettings = await response.json();
  renderAiSettingsForm();
  if (state.sourcePreview) renderSourcePreview(state.sourcePreview, state.sourcePreviewMode);
  return response;
}

async function testAiSettings() {
  if (!elements.aiSettingsForm) return;
  state.aiTesting = true;
  setAiSettingsFeedback(t("ai.testRunning"), "medium");
  syncAiSettingsActions();
  try {
    const saved = await saveAiSettingsFromForm();
    if (!saved) return;
    const response = await fetch("/api/ai/test", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ locale: state.language }),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      const message = aiErrorMessage(error, t("status.aiTestFailed", { status: response.status }));
      setStatus(message);
      setAiSettingsFeedback(message, "high");
      return;
    }
    const result = await response.json();
    const message = t("ai.testSuccess", {
      provider: result.provider || state.aiSettings?.provider || "",
      model: result.model || state.aiSettings?.model || "",
    });
    setStatus(t("status.aiTested"));
    setAiSettingsFeedback(message, "low");
  } finally {
    state.aiTesting = false;
    syncAiSettingsActions();
  }
}

function syncAiSettingsActions() {
  if (!elements.testAiSettingsButton) return;
  elements.testAiSettingsButton.disabled = state.aiTesting;
  elements.testAiSettingsButton.textContent = state.aiTesting ? t("ai.testing") : t("ai.test");
}

function setAiSettingsFeedback(message, tone = "neutral") {
  if (!elements.aiSettingsFeedback) return;
  elements.aiSettingsFeedback.textContent = message || "";
  elements.aiSettingsFeedback.classList.toggle("hidden", !message);
  elements.aiSettingsFeedback.classList.remove("low", "medium", "high");
  if (["low", "medium", "high"].includes(tone)) {
    elements.aiSettingsFeedback.classList.add(tone);
  }
}

async function runAiInterpretation() {
  if (!state.sourcePreview) return;
  state.aiBusy = true;
  renderSourcePreview(state.sourcePreview, state.sourcePreviewMode);
  try {
    const response = await fetch("/api/ai/interpret", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ preview: state.sourcePreview, locale: state.language }),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      setStatus(aiErrorMessage(error, t("status.aiFailed", { status: response.status })));
      return;
    }
    state.aiInterpretation = await response.json();
    setStatus(t("status.aiInterpreted"));
  } finally {
    state.aiBusy = false;
    renderSourcePreview(state.sourcePreview, state.sourcePreviewMode);
  }
}

async function runSkillAiInterpretation(skillId) {
  const skill = (state.catalog?.skills || []).find((item) => item.id === skillId);
  if (!skill) return;
  state.aiSkillBusyId = skillId;
  renderSelectedDetail();
  try {
    const response = await fetch("/api/ai/interpret", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ preview: skill, locale: state.language }),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      setStatus(aiErrorMessage(error, t("status.aiFailed", { status: response.status })));
      return;
    }
    state.aiSkillInterpretations.set(skillId, await response.json());
    setStatus(t("status.aiInterpreted"));
  } finally {
    state.aiSkillBusyId = null;
    renderSelectedDetail();
  }
}

async function runLibraryAiInterpretation(recordId) {
  const record = (state.library?.records || []).find((item) => item.id === recordId);
  if (!record) return;
  state.aiLibraryBusyId = recordId;
  renderSelectedDetail();
  try {
    const detailResponse = await fetch(`/api/library/${encodeURIComponent(recordId)}/detail`);
    if (!detailResponse.ok) {
      setStatus(t("status.libraryFailed", { status: detailResponse.status }));
      return;
    }
    const detail = await detailResponse.json();
    const response = await fetch("/api/ai/interpret", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ preview: detail, locale: state.language }),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      setStatus(aiErrorMessage(error, t("status.aiFailed", { status: response.status })));
      return;
    }
    state.aiLibraryInterpretations.set(recordId, await response.json());
    setStatus(t("status.aiInterpreted"));
  } finally {
    state.aiLibraryBusyId = null;
    renderSelectedDetail();
  }
}

function aiErrorMessage(error, fallback) {
  if (error?.code === "AI_SETTINGS_INCOMPLETE") return t("status.aiIncomplete");
  if (error?.code === "AI_NOT_ENABLED") return t("status.aiNotEnabled");
  return error?.detail || fallback;
}

function setFirstRunBusy(isBusy) {
  if (!isBusy) {
    renderFirstRunImport();
    return;
  }
  for (const control of elements.firstRunImport.querySelectorAll("button, input")) {
    control.disabled = true;
  }
}

function renderRiskFindings(skill) {
  const basis = `
    <div class="risk-basis">
      <strong>${t("risk.basisTitle")}</strong>
      <p>${t("risk.basisBody")}</p>
    </div>
  `;
  if (!skill.risk.findings.length) {
    return `${basis}<p class="status-line">${t("risk.none")}</p>`;
  }
  return `
    ${basis}
    <ul class="finding-list">
      ${skill.risk.findings
        .map(
          (finding) => `
            <li>
              <span>
                <strong>${escapeHtml(riskFindingLabel(finding))}</strong>
                <small>${escapeHtml(riskFindingBody(finding))}</small>
              </span>
              <span class="badge ${finding.level}">${escapeHtml(riskName(finding.level))}</span>
            </li>
          `,
        )
        .join("")}
    </ul>
  `;
}

function renderSourceValidation(preview) {
  const validation = preview.validation || [];
  if (!validation.length) {
    return `<p class="status-line compact">${t("sourcePreview.noValidationIssues")}</p>`;
  }
  return `
    <div class="source-validation">
      <strong>${t("sourcePreview.validationTitle")}</strong>
      <ul class="validation-list compact">
        ${validation
          .map(
            (item) => `
              <li>
                <span class="badge ${item.level === "error" ? "high" : "medium"}">${escapeHtml(item.level)}</span>
                <span>${escapeHtml(item.message)}</span>
              </li>
            `,
          )
          .join("")}
      </ul>
    </div>
  `;
}

function riskFindingLabel(finding) {
  const key = `riskFinding.${finding.id}.label`;
  return (TRANSLATIONS[state.language] || {})[key] || finding.label || finding.id;
}

function riskFindingBody(finding) {
  const key = `riskFinding.${finding.id}.body`;
  return (TRANSLATIONS[state.language] || {})[key] || (TRANSLATIONS.en || {})[key] || finding.id;
}

function renderValidation(skill) {
  const validations = [...(skill.validation || [])];
  if (skill.conflicts.length > 1) {
    validations.push({
      level: "warning",
      message: t("validation.conflict", {
        roots: skill.conflicts.map((item) => item.rootLabel).join(", "),
      }),
    });
  }
  if (!validations.length) {
    return `<p class="status-line">${t("validation.none")}</p>`;
  }
  return `
    <ul class="validation-list">
      ${validations
        .map(
          (item) => `
            <li>
              <span>${escapeHtml(item.message)}</span>
              <span class="badge ${item.level === "error" ? "high" : "medium"}">${escapeHtml(statusName(item.level))}</span>
            </li>
          `,
        )
        .join("")}
    </ul>
  `;
}

function renderDependencies(skill) {
  if (!skill.dependencies.length) {
    return `<p class="status-line">${t("dependencies.none")}</p>`;
  }
  return `
    <ul class="file-list">
      ${skill.dependencies
        .map(
          (dependency) => `
            <li>
              <code>${escapeHtml(dependency.name)}</code>
              <span class="badge ${dependency.installed ? "low" : "medium"}">
                ${dependency.installed ? t("root.available") : t("root.missing")}
              </span>
            </li>
          `,
        )
        .join("")}
    </ul>
  `;
}

function renderFiles(skill) {
  if (!skill.files.length) {
    return `<p class="status-line">${t("files.none")}</p>`;
  }
  return `
    <ul class="file-list">
      ${skill.files
        .map(
          (file) => `
            <li>
              <code>${escapeHtml(file.path)}</code>
              <span>${escapeHtml(file.kind)} / ${formatBytes(file.size)}</span>
            </li>
          `,
        )
        .join("")}
    </ul>
  `;
}

function setStatus(message) {
  elements.statusLine.textContent = message;
}

function setInspectorTitle(label) {
  if (elements.inspectorTitle) {
    elements.inspectorTitle.textContent = label || t("inspector.title");
  }
}

function setInspectorContext(label) {
  if (elements.inspectorContext) {
    elements.inspectorContext.textContent = label || t("inspector.current");
  }
}

function formatTime(value) {
  if (!value) return t("labels.unknown");
  return new Intl.DateTimeFormat(state.language === "zh" ? "zh-CN" : "en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function statusClass(status) {
  if (status === "running") return "medium";
  if (status === "queued") return "high";
  return "low";
}

function renderGovernanceBadge(governance) {
  const status = governance?.status || "unmanaged";
  const badgeClass =
    status === "managed" || status === "adopted-existing"
      ? "low"
      : status === "adopted"
        ? "medium"
        : "neutral";
  return `<span class="badge ${badgeClass}">${escapeHtml(statusName(status))}</span>`;
}

function renderTrustBadge(trust) {
  const status = trust?.status || "unreviewed";
  const badgeClass = status === "blocked" ? "high" : status === "unreviewed" ? "medium" : "low";
  return `<span class="badge ${badgeClass}">${escapeHtml(trustName(status))}</span>`;
}

function trustName(status) {
  return t(`trust.${status || "unreviewed"}`);
}

function getEnabledProfiles() {
  return (state.profiles?.profiles || state.runtime?.profiles || []).filter(
    (profile) => profile.enabled !== false,
  );
}

function getBridgeRecord() {
  return (state.library?.records || []).find((record) => record.id === "skills-manager-bridge@0.1.0");
}

function trimPreview(text, maxLength) {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}\n\n${t("common.truncatedMarker")}`;
}

function riskName(level) {
  if (level === "high") return t("risk.high");
  if (level === "medium") return t("risk.medium");
  return t("risk.low");
}

function statusName(status) {
  const names = {
    running: t("runtime.running"),
    queued: t("runtime.queued"),
    completed: state.language === "zh" ? "已完成" : "completed",
    warning: state.language === "zh" ? "警告" : "warning",
    error: state.language === "zh" ? "错误" : "error",
    ready: state.language === "zh" ? "可保存" : "ready to save",
    managed: state.language === "zh" ? "已复制" : "copied",
    adopted: state.language === "zh" ? "已纳管" : "managed",
    "adopted-existing": state.language === "zh" ? "已纳管" : "managed",
    unmanaged: state.language === "zh" ? "未纳管" : "found only",
    library: state.language === "zh" ? "已纳管" : "managed",
  };
  return names[status] || status;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
