# Migration Map — sigarena

**Installed:** 2026-08-19
**Mode:** migrate
**Profile:** product

## Existing structure preserved

All existing root directories declared in `allowed_root_dirs_extra`:
- `app/`, `components/`, `lib/` — Next.js App Router application code

All existing root files declared in `allowed_root_files_extra`:
- `.env.example`, `cloudflare-globals.d.ts`, `middleware.ts`, `open-next.config.ts`,
  `postcss.config.mjs`, `tailwind.config.ts`, `wrangler.toml` — Cloudflare/Next.js config

## Pre-existing coordination

- Legacy coordination via `~/Developer/active/SigRank-repos/D-REP-SCRATCH.md` (Drep1/Drep2 naming)
- Legacy scratchpad preserved as historical record, NOT the active bus
- Canonical DREP now installed at `system-devin/` with rep1=LEAD, rep2=ASSIST
- Active coordination bus: `.coord/micro/SCRATCHPAD.md`

## Canon context

- Authority role: `implementation`
- Canon contexts: `sigrank`
- Authority owner: `search_authority`

## Migration steps (before enforce)

1. [ ] Run `repo_check.py --ci` until clean (currently clean)
2. [ ] Verify GitHub ruleset application (solo-fast)
3. [ ] Switch REPO.yaml mode from `migrate` → `enforce`

## Enforce readiness

Ready after ruleset verification — no structural defects.
