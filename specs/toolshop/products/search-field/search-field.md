# Products — Search field
- Ticket: none

## Owners
- this run: auto
- found: UI 2 · API 0 · E2E 0 — none · other inputs: both cases are the one search the screen shows · access: the catalog is public and names no other id · contract: the page shows the match and the empty message

## Scope
- in: catalog search on the home page — a name the catalog shows, and a query that matches nothing
- out: category filters, sort, price range, pagination, signed-in account pages

## Feature Targets (from specs/project-map.md)
- UI app: toolshop-web / env UI_BASE_URL
- API service: toolshop-api / env API_BASE_URL

## Auth (from map)
- auth as: none · role: none

## Test cases

### 1. TOOLSSHOP-15 · Verify Search Functionality When No Results Are Found
- Level: UI — the result is on the catalog screen · Tag: @regression @responsive · Role: none · TMS: TOOLSSHOP-15
- Route (step 1): no-request · screen search=state
- Route (step 2): no-request · screen search=state
- Route (step 3): no-request · screen search=value
- Route (step 4): intercept QUERY /products/search → sent: q · data, total
- Route (step 5): screen-only · screen results=state, message=text
- Value: Common · Severity: Major · Priority: P2 (TMS: "Medium")
- Why: case TOOLSSHOP-15 empty result
- Status: ready to implement now
- Data: none — case says "Laptop" → a query that matches no product name
- Preconditions: Navigate to https://practicesoftwaretesting.com/
- Steps:
  1. Locate the search input. On a phone, open Filters first; the field is in that panel.
     - expect: The search input is visible and available for interaction.
  2. Click on the search input field.
     - expect: The cursor appears inside the field, ready for input.
  3. Enter a valid search query.
     - expect: The text appears in the search field.
  4. Click the Search button.
     - expect: The search request is triggered with q, and the answer's data is empty and total is 0.
  5. Verify the search results.
     - expect: No items are displayed. A message "There are no products found." is displayed.
- Cleanup: none

### 2. TOOLSSHOP-16 · Verify Search Functionality
- Level: UI — the result is on the catalog screen · Tag: @regression @smoke @responsive · Role: none · TMS: TOOLSSHOP-16
- Route (step 1): no-request · screen search=state
- Route (step 2): no-request · screen search=state
- Route (step 3): no-request · screen search=value
- Route (step 4): intercept QUERY /products/search → sent: q · check: namesMatchQuery(query)
- Route (step 5): screen-only · screen results=value
- Value: Core · Severity: Critical · Priority: P1 (TMS: "High")
- Why: case TOOLSSHOP-16 main scenario
- Status: ready to implement now
- Data: stand — case says "Sheet Sander" → a product name the catalog shows, and every result matches it
- Rules: namesMatchQuery — case TOOLSSHOP-16 step 5, only items matching the query
- Preconditions: Navigate to https://practicesoftwaretesting.com/
- Steps:
  1. Locate the search input. On a phone, open Filters first; the field is in that panel.
     - expect: The search input is visible and available for interaction.
  2. Click on the search input field.
     - expect: The cursor appears inside the field, ready for input.
  3. Enter a valid search query.
     - expect: The text appears in the search field.
  4. Click the Search button.
     - expect: The search request is triggered with q, and every returned name matches the query.
  5. Verify the search results.
     - expect: Only items matching the query are displayed.
- Cleanup: none

## Browsers, phone, screenshots
- browsers: none — the search is a text field and a button; no date, file, colour, range, editable or draggable control
- phone: #1 @responsive — at 393 px the search field and Search button sit in the collapsed Filters panel, and the empty message stays on the page · #2 @responsive — the same panel hides the field and the button the case uses
- screenshots: #1 the empty result — after the tests, Layer: visual

## Not now

## Manual case corrections
- TOOLSSHOP-15 step 3 — data "Laptop" → a query that matches no product name
- TOOLSSHOP-16 step 3 — data "Sheet Sander" → a product name the catalog shows

## Change log
- 2026-11-19 — new plan from Qase suite Search field (suite 6) — cases affected: TOOLSSHOP-15, TOOLSSHOP-16

## API brief
- QUERY /products/search, body `{ "q" }` → 200 `data[].name`, `total` (the contract also lists GET /products/search?q=; the page sends QUERY). A second search of the same text sends the request again.
- A query no name contains → `data` empty, `total` 0. A catalog name → every `data[].name` matches it, `total` at least 1.

## UI brief
- page: the catalog home. actions: locate Search, click it, type the query, click Search
- Messages: empty search → "There are no products found." · the count line reads how many products were found for the query ("1 product found for 'Sheet Sander'", "0 products found for 'Laptop'")
- Components: new CatalogPage (the search lives on the catalog home)
- Lands: none
- Locks: none
