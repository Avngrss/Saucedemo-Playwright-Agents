# Kit holes — the route gate, and the sandbox browser download

Working note for the kit fix. Two separate problems. Both are global: every user of this kit hits them. The Toolshop search plan is only the example that showed the first one. Do not implement that plan as it stands.

## Global, not a one-off

The routing algorithm itself decides the right owner. The gate that enforces it does not. `scripts/gate/routes.mjs` accepts any three-word excuse after `contract:` and any `intercept` followed by a later `screen-only`. So this is not a bad plan of one feature.

- Every plan of an app that has an API can hide a second contract call in a parenthesis and stay green.
- Every multi-step TMS case whose last step is "look at the screen" can tear that screen off the intercept and stay green.

The next agent stops when `qa:gate` is green. Until the two checks below exist, the algorithm for the agent ends at the shape of the line.

Plan: `specs/toolshop/products/search-field/search-field.md`
Stand: Toolshop, `https://practicesoftwaretesting.com`, API `https://api.practicesoftwaretesting.com`
Contract named in the map: `{API_BASE_URL}/docs?api-docs.json`
TMS: Qase project `TOOLSSHOP`, suite Search field (suite 6). Case link in the map: `https://app.qase.io/project/TOOLSSHOP?case={id}`
`npm run qa:gate` was green on this plan.

## What the plan got right

Both Qase cases are UI. The result is on the catalog. One owner, UI. A second spec that calls the same search again is a duplicate (`docs/Layer Routing Algorithm.md` §6: "The same happy path as a separate API test"). The data check belongs inside the UI test, on the intercept.

Qase step 3 data is literally `Example: Laptop` (case 15) and `Example: Sheet Sander` (case 16). Treating those strings as illustrations, not as the only allowed query, follows the illustration rule. Steps 1–3 send no request. Smoke on case 16 is the feature's main scenario.

## What is wrong

### 1. The other contract call never became a Gap

`/products/search` is two operations:

| Call | Who uses it |
|---|---|
| `QUERY /products/search` with a body | the page. The plan routes this on step 4 |
| `GET /products/search?q=&page=` | the contract. The page does not send it |

The API brief says so in parentheses: "the contract also lists GET /products/search?q=; the page sends QUERY." `## Not now` is empty.

The rule that was not applied (`agents/rules/plans.md`, TMS cases): a documented rule or critical risk no case covers goes to *Not now* `Gap`. A call the page does not make is an API place (`plans.md` §Layers). Basis `test-cases` does not allow inventing a third case, and it does not allow dropping the uncovered call into silence.

The Owners line that passed:

```text
found: UI 2 · API 0 · E2E 0 — none · other inputs: both cases are the one search the screen shows · access: the catalog is public and names no other id · contract: the page shows the match and the empty message
```

`contract:` explains why there is no API twin of the screen. It does not mention `GET /products/search`.

### 2. Step 5 is `screen-only` for a result the intercept already holds

Case 15 routes:

```text
Route (step 4): intercept QUERY /products/search → sent: q · data, total
Route (step 5): screen-only · screen results=state, message=text
```

Case 16 routes:

```text
Route (step 4): intercept QUERY /products/search → sent: q · check: namesMatchQuery(query)
Route (step 5): screen-only · screen results=value
```

`screen-only` means the fact exists only on the screen and nothing is listened to (`Layer Routing Algorithm.md` §5, §7). The result list comes from the step 4 answer, so its screen tokens belong on that intercept line. The empty message "There are no products found." is not in the JSON. That text can stay a screen token on the same intercept line. It is not a reason to make the whole results step `screen-only`.

Qase case 15 step 5 expected result is only the empty list and that message. Case 16 step 5 is "Only items matching Sheet Sander are displayed." Step 4 in both cases is only "The search request is triggered." The plan copied that split.

## Where the gate lets it through

### Owners excuse — `scripts/gate/routes.mjs`, `checkOwners`

When a plan of an app that has an API lists `API 0`, the gate takes the text after `other inputs:`, `access:` and `contract:`. A place fails only when the text is missing, starts with `<`, has fewer than three words, or is a bare `none` / `n/a` / `no` / `nothing`.

"the page shows the match and the empty message" is nine words. The check passes. The gate does not read `## API brief` and does not require a Not now line.

### Split route — `scripts/gate/routes.mjs`, `checkPlanRoutes`

Each route is checked on its own: the formula parses, and an `api` route belongs to an API scenario while every other kind belongs to UI or E2E. `intercept` without screen tokens parses. `screen-only` parses. Nothing asks whether a later `screen-only` is the rendering of an earlier intercept in the same case.

The sentence the agent followed is in `docs/Layer Routing Algorithm.md` §7 and `agents/rules/plans.md`: a scenario of several steps has one `- Route (step <n>):` line per step, numbered as the case numbers them. Qase step 4 is the request, step 5 is the screen, so one line each looks obedient. The formula examples put `· screen` on the intercept line, and they never say that a later step which only renders that answer is not a new route.

## What to change

Prose alone will not stop the next plan. The agent stopped when the gate was green. Two checks in `scripts/gate/routes.mjs`, and one sentence each in `docs/Layer Routing Algorithm.md` §7 and `agents/rules/plans.md` (the source; then `npm run agents:sync`, which refreshes `.cursor/`).

1. A method and path named in `## API brief` and named in no `Route` and no Not now line fails the gate. `GET /products/search` cannot stay in a parenthesis. The Not now line for this plan, when someone refreshes it, is a `Gap`: the contract's GET search, the page never sends it, the suite has no case.
2. A case with an `intercept` and a later `screen-only` for the same result fails the gate. Screen tokens of that answer move onto the intercept line. `screen-only` stays only for a fact the answer does not hold.

After the rule edit, refresh this plan before any test is written. The two UI cases stay. Step 5's screen tokens join step 4. `GET /products/search` becomes a Gap, not a third test, unless someone decides to cover it.

## Sandbox downloads Chromium on every agent install

Also global, and unrelated to the routes. Any person who runs this kit's `npm install` from a Cursor agent chat downloads Chromium again, even when that exact build is already on the machine.

Cursor's command sandbox sets `PLAYWRIGHT_BROWSERS_PATH` to an empty folder:

```text
C:\Users\Avngr\AppData\Local\Temp\cursor-sandbox-cache\<hash>\playwright
```

The hash changes with the sandbox. The folder starts empty (`.links`, `__dirlock`). The kit's `postinstall` is `node scripts/run-tests.mjs --browsers`, which calls `ensureBrowsers()`. `browsersDirectory()` in that file trusts `PLAYWRIGHT_BROWSERS_PATH` whenever it is set, so the required `chromium-1248` and `chromium_headless_shell-1248` look missing and `npx playwright install chromium` runs.

The browsers Playwright actually uses are not in `node_modules`. On Windows they live in `%LOCALAPPDATA%\ms-playwright`. This machine already had `chromium-1248` and `chromium_headless_shell-1248` there (Playwright 1.64.1, Chrome for Testing 156.0.8078.4). A sandboxed install does not look at that cache. One observed run downloaded Chrome 197.5 MiB and the headless shell 118.1 MiB into the temp folder, then ffmpeg. The next chat with another sandbox hash downloads them again.

A terminal outside the sandbox does not set the variable, so a person's own `npm install` does not do this. Setting `PLAYWRIGHT_BROWSERS_PATH` in the user environment does not win: the sandbox overwrites it. `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1` stops the download and leaves tests looking in the empty folder, so they fail with a missing executable.

This copy already drops the sandbox path before the check, in `scripts/run-tests.mjs` and `playwright.config.ts` (`delete` when the value includes `cursor-sandbox-cache`). Checked with the variable pointed at a folder that does not exist: `node scripts/run-tests.mjs --browsers --check` printed `ready: chromium-1248, chromium_headless_shell-1248` and created nothing. Those two lines are not in the kit other people install until they are in the source those people clone. A raw `npx playwright install` from a sandboxed chat still downloads, because it never loads those files.

## Sources checked

- Plan file above, including the empty `## Not now` and the API brief.
- Qase `TOOLSSHOP` cases 15 and 16: titles, five steps, step 3 data `Example: Laptop` / `Example: Sheet Sander`, step 4 "The search request is triggered.", step 5 the empty message / "Only items matching Sheet Sander".
- Live contract `https://api.practicesoftwaretesting.com/docs?api-docs.json`: `/products/search` has `GET` (`q`, `page` in the query) and `QUERY` (body).
- Gate: `scripts/gate/routes.mjs` `checkOwners` and `checkPlanRoutes`.
- Rules: `docs/Layer Routing Algorithm.md` §5–§7, `agents/rules/plans.md` (owner check, route table, Gap).
- Sandbox: a running `npm install` in another chat logged `Playwright needs chromium-1248, chromium_headless_shell-1248 in …\Temp\cursor-sandbox-cache\…\playwright` and downloaded there. The same builds were already in `%LOCALAPPDATA%\ms-playwright`. `scripts/run-tests.mjs` `browsersDirectory()` / `ensureBrowsers()`, `package.json` `postinstall`.
