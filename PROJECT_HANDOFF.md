# TTU Marketplace — Project Handoff

This document describes the **actual current codebase** as of 12 September 2026. It is written so a new Cursor chat can continue backend and remaining frontend work **without redesigning or breaking completed pages**.

Do **not** treat this file as permission to restyle, rewrite, or “unify” the UI. The frontend is a working vanilla HTML/CSS/JS prototype assembled from several downloaded page kits. Those kits do not share one visual system, and that is expected.

---

## 1. Purpose of the TTU Marketplace

TTU Marketplace (also labeled **Matador Marketplace** on the login page only) is a Texas Tech student buy/sell site in the style of Facebook Marketplace.

Students with `@ttu.edu` emails should be able to:

- browse campus listings
- filter and search
- view a product
- add items to a cart
- check out (card or pay-at-meetup)
- list an item for sale
- save favorites
- message a seller

**What exists today:** a static frontend demo. There is no server, no database, no real accounts, no real payments, no real messaging, and no git remote. Pages talk to each other through query strings plus `localStorage` / `sessionStorage`.

The intended audience is TTU students only. Campus meetup / public pickup is the fulfillment model. Marketplace fee is currently hardcoded as `$0.00`.

---

## 2. Every completed frontend page

These six HTML pages are implemented and linked. There are **no other application pages**.

| File | Browser title | Role | Status |
|---|---|---|---|
| `index.html` | Matador Marketplace \| Log In | Login gate | UI complete; auth is fake |
| `listings.html` | All Listings — TTU Marketplace | Marketplace home / browse | Working client-side catalog |
| `sell.html` | Sell an Item — TTU Marketplace | Create a listing | Saves to `localStorage` only |
| `product.html` | Listing \| TTU Marketplace | Product detail | Loads `?id=`; TI-84 has full copy |
| `cart.html` | Your Cart \| TTU Marketplace | Cart | Reads/writes `ttuCart` |
| `payment.html` | Checkout \| TTU Marketplace | Checkout | Validates form; does not charge |

**Pages that do not exist** (UI chrome points at them, but there is no file):

- Sign up / create account
- Forgot password / reset
- Favorites / saved listings
- Messages / inbox / conversation
- Profile / account
- My listings / edit listing
- Order confirmation / order history
- Marketplace terms (the checkout checkbox mentions them)

---

## 3. Purpose of every HTML, CSS, JavaScript, and asset file

### HTML

| File | Purpose |
|---|---|
| `index.html` | Split login: campus photo left, form right. Requires `@ttu.edu` email format plus any non-empty password, then sends the browser to `listings.html`. |
| `listings.html` | Sticky marketplace navbar, search, sort, grid/list toggle, filter sidebar, product grid. Loads `products.js` then `listings.js`. |
| `sell.html` | Listing form (photos, title, price, category, condition, optional description, meetup location). Reuses `listings.css` plus `sell.css`. |
| `product.html` | Gallery, seller card, quantity stepper, Add to cart, Check out now. Loads `products.js` then `product.js`. |
| `cart.html` | Cart lines, qty +/−, save for later, remove, order summary, empty state. Loads only `cart.js`. |
| `payment.html` | Card vs pay-at-meetup, card fields, agreement checkbox, order summary. Loads `products.js` then `payment.js`. |

### CSS (each page owns its stylesheet)

| File | Used by | Purpose |
|---|---|---|
| `style.css` | `index.html` only | Login layout, Inter/Montserrat, `#c50013` red, campus panel. |
| `listings.css` | `listings.html` and `sell.html` | White Inter marketplace chrome: navbar, filters, cards. Red `#cc0000`. |
| `sell.css` | `sell.html` | Form card, photo grid, condition radios. Relies on `listings.css` variables. |
| `product.css` | `product.html` | Cream/serif product kit: Graduate wordmark, DM Sans body, Playfair headings. Red `#c8102e`. |
| `cart.css` | `cart.html` | Same cream kit as product/payment. |
| `payment.css` | `payment.html` | Same cream kit as product/cart. |
| **`styles.css`** | **nothing** | Leftover unused stylesheet from an older black/red split login (`Source Sans 3`, Oswald, `#e90802`). Safe to leave. Do not wire it up. Do not delete unless asked. |

### JavaScript

| File | Loaded on | Purpose |
|---|---|---|
| `script.js` | `index.html` | Email/password validation, password toggle, toast stubs for Google / forgot / create account. Redirects to `listings.html` on valid submit. |
| `products.js` | listings, product, payment | Global `const products = [...]` catalog of 24 seed listings. Not a module. Must load **before** the page script. |
| `listings.js` | `listings.html` | Merges `ttuUserListings` + `products`, search/filter/sort/render, favorite hearts. |
| `sell.js` | `sell.html` | Photo FileReader previews, description toggle, validates form, prepends listing to `ttuUserListings`, redirects to listings. |
| `product.js` | `product.html` | Resolves `?id=`, fills gallery/copy, qty 1–5, save heart, add-to-cart → `cart.html`, checkout link → `payment.html?id=&qty=`. |
| `cart.js` | `cart.html` | Renders `ttuCart`, qty, remove, save-for-later (adds id to `ttuFavorites` and removes from cart), checkout href. |
| `payment.js` | `payment.html` | Builds order lines from `?from=cart` or `?id=&qty=` (fallback `sessionStorage.ttuCheckout`, then product id 1), card formatting/validation, toast on submit. |

There is no shared `auth.js`, `api.js`, `cart-utils.js`, or router.

### Assets that are actually referenced

| Path | Used by |
|---|---|
| `assets/ttu-logo.png` | Login Double T |
| `assets/campus-panel.png` | Login left panel background |
| `assets/calculator-front.png` | Listing id 1 card + gallery + payment HTML fallback |
| `assets/calculator-angle.png` | Listing id 1 gallery |
| `assets/calculator-case.png` | Listing id 1 gallery |
| `assets/textbook.png` | Listing id 5 card |
| `assets/images/avatar.jpg` | Listings + sell navbar avatar |
| `assets/images/desk.jpg` | id 2 |
| `assets/images/ipad.jpg` | id 3 |
| `assets/images/lamp.jpg` | id 4 |
| `assets/images/ttu-hoodie.jpg` | id 6 |
| `assets/images/shoes.jpg` | id 7 |
| `assets/images/bike.jpg` | id 8 |
| `assets/images/mini-fridge.jpg` | id 9 |
| `assets/images/chair.jpg` | id 10 |
| `assets/images/airpods.jpg` | id 11 |
| `assets/images/ttu-shirt.jpg` | id 12 |
| `assets/images/charger.jpg` | id 13 |
| `assets/images/dresser.jpg` | id 14 |
| `assets/images/textbook.jpg` | id 15 |
| `assets/images/monitor.jpg` | id 16 |
| `assets/images/backpack.jpg` | id 17, and sell-form fallback image when no photo is uploaded |
| `assets/images/microwave.jpg` | id 18 |
| `assets/images/coffee-maker.jpg` | id 19 |
| `assets/images/jacket.jpg` | id 20 |
| `assets/images/controller.jpg` | id 21 |
| `assets/images/mirror.jpg` | id 22 |
| `assets/images/fan.jpg` | id 23 |
| `assets/images/console.jpg` | id 24 |

### Assets present but **not referenced** by current HTML/JS

| Path | Notes |
|---|---|
| `assets/images/calculator.jpg` | Replaced by `assets/calculator-front.png` for id 1 |
| `assets/images/calculus-book.jpg` | Replaced by `assets/textbook.png` for id 5. Same byte size as `textbook.jpg` (58543) — likely a duplicate file |

`assets/images/console.jpg` and `assets/images/controller.jpg` are both 44993 bytes. They are referenced as two different listings but are probably the same stock photo.

Several Unsplash-style placeholders do not closely match their listing titles. That is a content issue, not a missing-file issue.

---

## 4. Current folder structure

There is **no** `src/`, `package.json`, `README.md`, `.env`, test folder, backend folder, or `.git` directory.

```
TTU Marketplace/
├── index.html              login
├── style.css
├── script.js
├── listings.html
├── listings.css
├── listings.js
├── sell.html
├── sell.css
├── sell.js
├── product.html
├── product.css
├── product.js
├── products.js             shared catalog
├── cart.html
├── cart.css
├── cart.js
├── payment.html
├── payment.css
├── payment.js
├── styles.css              UNUSED leftover
├── PROJECT_HANDOFF.md      this file
├── TODO.md
└── assets/
    ├── ttu-logo.png
    ├── campus-panel.png
    ├── calculator-front.png
    ├── calculator-angle.png
    ├── calculator-case.png
    ├── textbook.png
    └── images/
        ├── avatar.jpg
        ├── airpods.jpg
        ├── backpack.jpg
        ├── bike.jpg
        ├── calculator.jpg          unused
        ├── calculus-book.jpg       unused
        ├── chair.jpg
        ├── charger.jpg
        ├── coffee-maker.jpg
        ├── console.jpg
        ├── controller.jpg
        ├── desk.jpg
        ├── dresser.jpg
        ├── fan.jpg
        ├── ipad.jpg
        ├── jacket.jpg
        ├── lamp.jpg
        ├── microwave.jpg
        ├── mini-fridge.jpg
        ├── mirror.jpg
        ├── monitor.jpg
        ├── shoes.jpg
        ├── textbook.jpg
        ├── ttu-hoodie.jpg
        └── ttu-shirt.jpg
```

Workspace path: `C:\HP Laptop\Hackathon project\TTU Marketplace`

---

## 5. How the pages are linked

```
index.html  --valid @ttu.edu + password-->  listings.html
                                              |  |
                    + Sell an Item / Sell ----+  +-- card click --> product.html?id={id}
                    |                                              |         |
                    v                                              |         |
                 sell.html --List Item--> listings.html            |         |
                                                                   |         |
                                          Add to cart -------------+         |
                                          (writes ttuCart)                   |
                                                |                            |
                                                v                            |
                                           cart.html                         |
                                                |                            |
                     1 item: payment.html?id={id}&qty={qty}                  |
                     2+ items: payment.html?from=cart                        |
                                                ^                            |
                                                +-- Check out now -----------+
                                                    payment.html?id={id}&qty={qty}
                                                    also writes sessionStorage.ttuCheckout
```

**Working navigation**

- Login submit → `listings.html`
- Logo / Home / Browse / Continue shopping / Back to marketplace → `listings.html` (except login, which has no marketplace chrome)
- `+ Sell an Item` and product/cart `Sell` → `sell.html`
- Sell `Back to listings` → `listings.html`
- Listing card → `product.html?id={id}`
- Product cart icon → `cart.html`
- Product Add to cart → writes `ttuCart`, then `cart.html`
- Product Check out now → `payment.html?id={id}&qty={qty}`
- Cart checkout → `payment.html?id=&qty=` if one line, else `payment.html?from=cart`
- Cart item image/title → `product.html?id={id}`
- Payment Back / Edit → `product.html?id=` or `cart.html` depending on `from=cart`

**Dead / stub navigation**

- Login `#forgotLink` and `#createLink` are `href="#"` and only show a toast
- Login Google button only shows a toast
- Listings / sell heart and messages icon buttons have **no** `href` and **no** click handlers
- Product / cart header heart and avatar buttons have **no** handlers
- Product `#messageButton` only shows a toast
- Payment `#expressButton` only shows a toast
- Listings / sell have **no cart icon** at all
- Sell search input is `disabled`

**Default / fallback URLs (demo behavior, not real routing)**

- `product.html` with no `id` → treats id as `1` (TI-84)
- `payment.html` with no query and empty checkout storage → falls back to `products[0]` (TI-84, qty 1)

---

## 6. Features that currently work

Client-side only, in the same browser profile:

- Login email must match `/^[^\s@]+@ttu\.edu$/` (case-insensitive). Password must be non-empty. Then redirect.
- Password show/hide on login.
- Catalog of 24 seed products from `products.js`.
- User listings from `localStorage.ttuUserListings` appear **above** seed products.
- Search by title + category (case-insensitive substring).
- Category filter: All, Textbooks, Furniture, Electronics, Clothing, Bikes, Other.
- Price min/max Apply.
- Location filter: `all` | `TTU` | `Lubbock, TX`.
- Condition checkboxes: New, Like New, Good, Fair, For Parts.
- Sort: newest (`hoursAgo` ascending), price low/high.
- Grid vs list view.
- Mobile filter drawer toggle (`#filters-toggle`).
- Listing cards link to the matching product page.
- Favorite hearts on listing cards persist ids in `ttuFavorites`.
- Product page loads any catalog or user listing by numeric `id`.
- TI-84 (id 1) has 3 gallery images, retail note, and custom `aboutHtml`.
- Calculus book (id 5) has a custom `detailTitle` and seller.
- Other products get generated description copy.
- Product image thumbnails switch the main image.
- Product save heart reads/writes `ttuFavorites`.
- Quantity stepper 1–5 on product and cart.
- Add to cart merges qty for the same `id`, cap 5, then opens cart.
- Cart empty state vs filled layout.
- Cart qty, remove, line totals, header badge.
- Cart save-for-later: add id to `ttuFavorites`, remove from cart.
- Single-item and multi-item checkout into payment.
- Payment order summary rebuilds from cart or product.
- Card number spacing, expiry `MM/YY`, digits-only CVV/ZIP.
- Card validation (name ≥ 2 chars, 16-digit PAN, expiry regex, 3–4 digit CVV, 5-digit ZIP).
- Agreement checkbox required.
- Pay-at-meetup hides card fields and changes the button to “Confirm campus meetup”.
- Toasts for several stub actions.
- Sell form required-field validation.
- Sell photo previews (up to 5 FileReader data URLs). First photo becomes the listing image.
- Sell create listing and return to listings.

**How to run the current app**

Node is not part of this project. Serve the folder as static files:

```bash
python -m http.server 5180
```

Then open `http://127.0.0.1:5180/` (login) or `http://127.0.0.1:5180/listings.html`.

Port 5173 was used earlier and became unreliable; 5180 was the last working local port. Any free port is fine.

---

## 7. Features that are only frontend demonstrations

These look real and must not be described as finished product behavior:

| Feature | What it actually does |
|---|---|
| Login | No password check, no user record, no session cookie/token. Any `@ttu.edu` + any password works. |
| Keep me logged in | Checkbox is visual only. |
| Continue with TTU e-raider Account | Toast: “Connect this button to TTU Google authentication.” |
| Forgot password / Create one | Toast stubs. No pages. |
| Navbar avatar | Hardcoded photo (`avatar.jpg`) or initials `NS`. Not a user. |
| Favorites navbar icon | No saved-items page. Hearts persist ids locally only. |
| Messages navbar icon / Message seller | Toast only. No threads. |
| Profile button | No profile. |
| Seller “verified” checkmarks and star ratings | Hardcoded copy in `products.js`. |
| Add to cart / cart | Browser `localStorage` only. Not per-account. |
| Marketplace fee | Always `$0.00`. |
| Payment card form | Client validation only. Explicit copy: “This demo does not transmit or store payment information.” Submit toast: “Payment form is ready to connect to your backend.” |
| Pay at meetup | Toast: “Campus meetup request confirmed.” No order, no seller notify. |
| Express Pay button | Toast only. |
| Sell photos | Data URLs in `localStorage`. Not uploaded to a server. If none chosen, uses `assets/images/backpack.jpg`. |
| Sell listings | Local to that browser. Lost on cache clear. Not visible to other users. |
| Seed catalog | Static JS array. Not a database. |

---

## 8. All unfinished work

### Missing product surfaces

- Sign up
- Password reset
- Session gate on listings / sell / product / cart / payment (pages are directly URL-accessible)
- Favorites page that reads `ttuFavorites`
- Messaging inbox + thread
- Profile / logout
- My listings and edit/delete
- Order confirmation after pay
- Order history for buyer and seller
- Terms page

### Missing backend

- No API, no database, no auth provider, no image storage, no payments, no email, no websocket/polling for chat
- No `package.json`, no Python app, no Docker, no CI
- No environment variables file

### Incomplete frontend wiring

- Listings/sell nav has favorites + messages but **no cart**
- Product/cart nav has cart + heart but heart does not navigate
- Two navbar implementations (see design section)
- Payment success does not clear `ttuCart` or redirect
- Sell meetup location is free text and usually will not match the listings location filter values `TTU` / `Lubbock, TX`
- Only the first sell photo is stored on the listing object (`image`), not `images[]`
- User listings have no `seller` object
- Quantity has no inventory / stock field
- No shared cart badge on listings

### Engineering hygiene

- Not a git repo
- No tests
- Unused `styles.css`
- Two unused images
- User-generated HTML interpolated with `innerHTML` (XSS risk once listings are real)
- Data URLs in `localStorage` can exceed quota
- No 404 page

---

## 9. Known bugs, broken links, duplicate styles, and missing assets

### Bugs / sharp edges

1. **No auth persistence.** Closing login and opening `listings.html` directly skips login. That is current behavior.
2. **`payment.html` with no params defaults to the TI-84.** Easy to mistake for a real order.
3. **`product.html` with no/invalid id.** Missing `id` becomes `1`. Unknown id shows “Listing not found” but purchase controls still exist in the DOM; add-to-cart/checkout no-op if `item` is missing, but the page is not a clean empty state.
4. **Location filter vs sell form.** Filter compares `item.location === "TTU"` or `"Lubbock, TX"`. Sell placeholder is `"Student Union Building, TTU, Lubbock, TX"`. A user-created listing with that text will **not** match either filter chip.
5. **Newest sort uses `hoursAgo`.** User listings set `hoursAgo: 0`, so they stay on top, which is intended. Seed “newest” is fake recency, not a timestamp.
6. **Favorite Set vs mixed ids.** Seed ids are `1–24`. User ids are `Date.now()`. Both are numbers. Do not later store favorites as strings without migrating.
7. **Cart save-for-later removes the item** and only stores the id. There is no UI to get it back except the listing grid heart state.
8. **Successful payment does not clear the cart** and does not disable a second submit.
9. **Card “validation” accepts any 16 digits.** No Luhn, no expiry-in-the-future check. Fine for demo; not for production.
10. **XSS:** `listings.js` and `product.js` inject `item.title`, `item.description`, and `aboutHtml` with `innerHTML`. Safe for seed data; unsafe for user listings.
11. **Sell photo input** replaces the whole preview set from the current file picker selection; it does not append.
12. **Login title mismatch:** “Matador Marketplace” vs “TTU Marketplace” everywhere else.

### Broken or empty links

- `index.html`: `#forgotLink`, `#createLink` → `#`
- Heart / messages / profile buttons: no destination
- No `favorites.html`, `messages.html`, `profile.html`, `signup.html`

### Duplicate / overlapping styles

There are **three live design systems** plus one dead one:

1. Login (`style.css`) — warm white, Inter, Montserrat, Georgia, `#c50013`
2. Listings + sell (`listings.css` / `sell.css`) — gray/white marketplace, Inter, `#cc0000`
3. Product + cart + payment (`product.css` / `cart.css` / `payment.css`) — cream paper, DM Sans + Graduate + Playfair Display, `#c8102e`
4. Unused `styles.css` — older login, `#e90802`

`product.css`, `cart.css`, and `payment.css` duplicate the same `:root` tokens and header wordmark rules. That duplication is from the downloaded kits. **Do not merge them** unless the user asks. A shared CSS file would risk visual drift.

### Missing assets

- No favicon
- No shared Double T in the listings/product headers (those wordmarks are text, not `ttu-logo.png`)
- Seed listings 2–4 and 6–24 have only one image each (no gallery set)
- Id 5 uses `textbook.png` only (no `images[]`)

---

## 10. Current colors, fonts, spacing, and design conventions

**Do not “fix” the three live palettes into one.** Match the page you are on.

### Login — `style.css`

- Tokens: `--ttu-red: #c50013`, `--ink: #101010`, `--muted: #747474`, `--line: #c8c8c8`, `--warm-white: #f8f5f0`
- Body: Inter, background `#f8f5f0`
- Heading: Georgia 42px / 700
- Eyebrow labels: Montserrat, ~9–11px, letter-spacing 4px
- Card: 636px max, 23px radius, translucent white, 35×71 padding
- Inputs: 51px tall, 10px radius
- Buttons: 56px tall, 9px radius
- Login button gradient: `#b90012 → #d00918 → #bd0012`
- Toast: `#202020`

### Listings / sell — `listings.css` + `sell.css`

- Tokens: `--red: #cc0000`, `--red-hover: #b00000`, `--red-soft: #fdecec`, `--text: #111827`, `--muted: #6b7280`, `--border: #e5e7eb`, `--page: #fafafa`, `--white: #ffffff`, `--input: #f3f4f6`
- Font: Inter 400–700
- Navbar: 72px, 12×28 padding, white, 1px `#e5e7eb` border
- Wordmark: `TTU` red + `MARKETPLACE` black, 22px / 700
- Search pill: 44px, full radius, max 560px
- Page width: `min(1440px, calc(100% - 48px))`; sell card width `min(780px, calc(100% - 48px))`
- Filters column: 250px
- Controls: 40px height, 8px radius
- Sell primary button: 48px, 8px radius
- Focus rings: `0 0 0 3px rgba(204, 0, 0, 0.1)`

### Product / cart / payment

- Tokens: `--red: #c8102e`, `--deep-red: #a5001b`, `--black: #151515`, `--cream: #f5f1ea`, `--paper: #fffdf9`, `--muted: #716d66` (product `#73706b`), `--line: #d8d1c7` (product `#d9d3ca`)
- Body: DM Sans on cream `#f5f1ea`
- Wordmark: Graduate; `TTU` red with light black text-stroke; `MARKETPLACE` black, 2.2px letter-spacing
- Page titles: Playfair Display 50px / 700
- Header: 78px, cream blur `rgba(255,253,249,.94)`
- Cards: 1px line, paper background, ~2–3px radius (sharper than listings)
- Primary buttons: full-width ~57–59px, `#c8102e`, hover `#a5001b` + 1px lift
- Toast: `#202020` with 4px red left border

### Conventions to keep

- Red Raider language, campus pickup, public meetup, inspect-before-pay
- Uppercase micro-labels with wide letter-spacing on cream pages (`YOUR CART`, `ORDER SUMMARY`)
- Toast `#id="toast"` + class `.visible` / `.toast.visible`
- Quantity always capped at 5
- Categories and conditions must stay exactly:  
  `Textbooks | Furniture | Electronics | Clothing | Bikes | Other`  
  `New | Like New | Good | Fair | For Parts`
- Locations used by seed data: `TTU` and `Lubbock, TX` only

---

## 11. Important element IDs and JavaScript functions

### Browser storage keys (keep these names if you migrate)

| Key | Where | Shape |
|---|---|---|
| `localStorage.ttuCart` | product.js, cart.js, payment.js | `[{ id, title, price, qty, image, condition, category, seller }]` |
| `localStorage.ttuFavorites` | listings.js, product.js, cart.js | JSON array of numeric listing ids |
| `localStorage.ttuUserListings` | sell.js, listings.js, product.js, payment.js | Array of listing objects (see sell.js) |
| `sessionStorage.ttuCheckout` | product.js write, payment.js read | `{ id, qty }` |

### Seed listing object (`products.js`)

Required on every item: `id`, `title`, `price`, `location`, `time`, `hoursAgo`, `category`, `condition`, `image`.

Optional (used when present): `detailTitle`, `retailNote`, `images[{src,alt}]`, `aboutHtml`, `seller{initials,name,meta}`, `description`, `highlights[]`.

User listing from `sell.js`:

```js
{
  id: Date.now(),
  title, price, location,
  time: "Just now",
  hoursAgo: 0,
  category, condition,
  image: photoDataUrls[0] || "assets/images/backpack.jpg",
  description
}
```

### `script.js` (login)

IDs: `#loginForm`, `#email`, `#password`, `#passwordToggle`, `#emailError`, `#passwordError`, `#remember`, `#forgotLink`, `#googleButton`, `#createLink`, `#toast`

Functions: `showToast`, `setError`, `validateEmail`, `validatePassword`

### `listings.js`

IDs: `#search-input`, `#sort-select`, `#grid-view-btn`, `#list-view-btn`, `#filters-toggle`, `#filters`, `#min-price`, `#max-price`, `#apply-price`, `#location-select`, `#listing-count`, `#product-grid`, `#empty-state`

Functions: `saveFavorites`, `getAllProducts`, `getFilteredProducts`, `render`

State object: `{ search, category, minPrice, maxPrice, location, conditions, sort }`

### `sell.js`

IDs: `#listing-form`, `#photo-grid`, `#photo-input`, `#item-title`, `#price`, `#category`, `#description-toggle`, `#description-box`, `#description`, `#location`, `#form-error`

Functions: `showError`, `renderPreviews`

### `product.js`

IDs: `#cartCount`, `#product-layout`, `#saveButton`, `#mainProductImage`, `#imageCounter`, `#thumbnailRow`, `#descriptionCopy`, `#productCategory`, `#productCondition`, `#productTitle`, `#listingMeta`, `#productPrice`, `#retailNote`, `#sellerAvatar`, `#sellerName`, `#sellerMeta`, `#messageButton`, `#decreaseQuantity`, `#quantity`, `#increaseQuantity`, `#addToCart`, `#checkoutButton`, `#toast`

Functions: `showToast`, `getImages`, `getDescriptionHtml`, `updateCheckoutLink`, `getCartCount`

### `cart.js`

IDs: `#headerCartCount`, `#itemHeading`, `#cartLayout`, `#cartItems`, `#summaryCard`, `#summaryItemCount`, `#subtotal`, `#total`, `#checkoutLink`, `#emptyCart`, `#toast`

Functions: `getCart`, `saveCart`, `showToast`, `money`, `renderCart`, `updateCart`

Delegated clicks on `.increase`, `.decrease`, `.remove-item`, `.save-item` inside `.cart-item[data-id]`.

### `payment.js`

IDs: `#backLink`, `#paymentForm`, `#cardFields`, `#expressButton`, `#cardName`, `#cardNameError`, `#cardNumber`, `#cardNumberError`, `#expiry`, `#expiryError`, `#cvv`, `#cvvToggle`, `#cvvError`, `#zipCode`, `#zipCodeError`, `#meetupFields`, `#agreement`, `#agreementError`, `#payButton`, `#payButtonText`, `#editLink`, `#orderItems`, `#subtotalAmount`, `#totalAmount`, `#toast`

Static leftover IDs inside `#orderItems` (`#orderImage`, `#orderTitle`, `#orderMeta`, `#orderSeller`, `#orderPrice`) are **wiped on load** when JS replaces `innerHTML`. Do not rely on them.

Functions: `catalogItem`, `checkoutLines`, `showToast`, `selectedMethod`, `setError`, `validateCard`

Query params: `id`, `qty`, `from=cart`.

---

## 12. Recommended backend architecture

Keep the **existing HTML/CSS/JS as the client**. Do not convert to React/Vue/Next unless the user explicitly asks. The completed UI is vanilla and page-based.

Recommended stack for this repo:

1. **Keep serving the current static files** from the project root (or a `public/` copy that does not restyle them).
2. **Add a Python FastAPI app** alongside the frontend. Python is already how the prototype is served; Node is not installed in this environment.
3. **PostgreSQL** for shared data. Use **SQLite** only if a cloud Postgres instance is not available yet.
4. **Session cookie or JWT in an HttpOnly cookie** after login. Do not keep `ttuCart` as the source of truth once accounts exist.
5. **Object storage** for listing photos (S3-compatible, or local `uploads/` for the hackathon). Stop storing data URLs in `localStorage`.
6. **Google OAuth for “TTU e-raider”** with hosted-domain / email suffix restricted to `ttu.edu`.
7. **Stripe Checkout or Payment Intents** later for the card path. Meetup path creates an `orders` row with `payment_method = meetup` and `status = pending_meetup`.
8. **REST JSON** that mirrors the current page flows. Add WebSockets or polling only when messaging is built.

Suggested layout when backend work starts (do not move existing HTML until the team agrees):

```
/                  existing frontend files stay put
/api               FastAPI routes
/uploads           local listing images (dev)
```

Alternative if the team standardizes on JavaScript later: Express + Prisma + Postgres. Same tables and routes. Do not introduce that migration just to “modernize.”

---

## 13. Recommended database tables and relationships

Minimum schema that maps to **screens that already exist** plus the obvious missing ones.

### `users`
- `id` PK
- `email` unique, must end with `@ttu.edu`
- `password_hash` nullable if Google-only
- `google_sub` nullable unique
- `name`
- `initials`
- `avatar_url`
- `created_at`

### `listings`
- `id` PK
- `seller_id` → users
- `title`, `detail_title` nullable
- `description`
- `price` numeric
- `category` enum as listed above
- `condition` enum as listed above
- `location` (start with `TTU` | `Lubbock, TX`; extra meetup detail in `meetup_note`)
- `status` (`active`, `sold`, `hidden`)
- `created_at` (replace fake `hoursAgo` / `time`)

### `listing_images`
- `id` PK
- `listing_id` → listings
- `url`
- `alt`
- `sort_order`

### `carts` + `cart_items`  (or one cart per user)
- `carts.user_id` unique → users
- `cart_items`: `listing_id`, `qty` (1–5)

### `favorites`
- unique (`user_id`, `listing_id`)

### `conversations` + `messages`
- conversation between `buyer_id` and `seller_id` about optional `listing_id`
- messages: `sender_id`, `body`, `created_at`, `read_at`

### `orders` + `order_items`
- `buyer_id`, `status` (`pending_payment`, `pending_meetup`, `paid`, `cancelled`, `completed`)
- `payment_method` (`card`, `meetup`)
- `subtotal`, `fee` (0 for now), `total`
- items snapshot: listing_id, title, price, qty, image, seller_id

### `payments`
- `order_id`
- `provider` (`stripe`, `demo`)
- `provider_ref`
- `amount`
- `status`

Relationships: a user sells many listings; a listing has many images; a user has one cart and many favorites; a buyer and seller share conversations; an order belongs to a buyer and contains snapshots of listings (possibly from multiple sellers — the current cart already allows that).

---

## 14. Authentication requirements (`@ttu.edu`)

Current frontend rule in `script.js`:

```js
/^[^\s@]+@ttu\.edu$/
```

Backend must enforce the same, not only the client.

Requirements:

- Reject any email that is not `*@ttu.edu` (case-insensitive) at signup, login, and OAuth callback.
- For Google / eRaider: request Google OAuth and **reject the token** if `email_verified` is false or `email` domain ≠ `ttu.edu`. Prefer Google `hd=ttu.edu` if TTU Workspace allows it.
- Do not create an account for `@gmail.com` or other schools.
- After login, set a secure session. Redirect remains `listings.html` (or `/listings.html`).
- Protect sell, cart checkout, favorites, and messaging. Browse/product can stay public if the team wants, but today the UX assumes you already “logged in.”
- Logout must clear the session. The current header avatar should become the real user’s initials or photo.
- “Keep me logged in” should map to a longer-lived refresh cookie; it does nothing now.
- Create account and forgot-password links on `index.html` (`#createLink`, `#forgotLink`) are the intended entry points — add pages or modals, but **keep the login card layout**.
- Never log or store raw card data. The payment page already says the demo does not transmit cards.

---

## 15. Required APIs and environment variables

None exist today. These are the endpoints the **current UI** will need, named to match existing actions.

### Auth
- `POST /api/auth/signup` `{ email, password, name }`
- `POST /api/auth/login` `{ email, password, remember }`
- `POST /api/auth/google` `{ idToken }`
- `POST /api/auth/forgot` `{ email }`
- `POST /api/auth/reset` `{ token, password }`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Listings
- `GET /api/listings` query: `search`, `category`, `minPrice`, `maxPrice`, `location`, `condition`, `sort`
- `GET /api/listings/:id`
- `POST /api/listings` multipart: title, price, category, condition, location, description, photos[]
- `PATCH /api/listings/:id` seller only
- `DELETE /api/listings/:id` seller only

### Cart
- `GET /api/cart`
- `POST /api/cart/items` `{ listingId, qty }`
- `PATCH /api/cart/items/:listingId` `{ qty }`
- `DELETE /api/cart/items/:listingId`

### Favorites
- `GET /api/favorites`
- `PUT /api/favorites/:listingId`
- `DELETE /api/favorites/:listingId`

### Messaging
- `GET /api/conversations`
- `POST /api/conversations` `{ listingId }` or `{ sellerId }`
- `GET /api/conversations/:id/messages`
- `POST /api/conversations/:id/messages` `{ body }`

### Orders / payments
- `POST /api/checkout` `{ source: "cart" | "buy_now", listingId?, qty?, method: "card" | "meetup" }`
- `POST /api/payments/stripe-intent` (card path)
- `GET /api/orders`
- `GET /api/orders/:id`

### Suggested environment variables (create `.env` when backend starts; do not commit secrets)

```
APP_ENV=development
PORT=8000
PUBLIC_ORIGIN=http://127.0.0.1:5180
DATABASE_URL=postgresql://USER:PASS@HOST:5432/ttu_marketplace
SESSION_SECRET=
JWT_SECRET=
ALLOWED_EMAIL_DOMAIN=ttu.edu
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=http://127.0.0.1:8000/api/auth/google/callback
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
UPLOAD_DIR=uploads
S3_BUCKET=
S3_REGION=
S3_ACCESS_KEY=
S3_SECRET_KEY=
```

There is **no** `.env` in the repo now. The frontend currently needs none.

---

## 16. Prioritized plan for completing the application

### P0 — Do not break the frontend
- Leave completed HTML/CSS alone.
- Add backend beside it.
- When wiring APIs, change **JS only** (or additive JS), not layout/CSS, unless a new page is required.

### P1 — Auth that matches the login card
- Implement `@ttu.edu` email/password + Google eRaider.
- Persist session.
- Build create-account and forgot-password without restyling `index.html`.
- Redirect stays `listings.html`.

### P2 — Listings from a database
- Migrate the 24 `products.js` rows into `listings` + `listing_images`.
- `GET /api/listings` feeds `listings.js` instead of the in-memory array.
- Keep card markup and filters identical.
- Replace `hoursAgo` with real `created_at`.

### P3 — Image uploads
- Sell form posts files to the API.
- Stop writing data URLs into `localStorage`.
- Support up to 5 photos as `images[]` on the product page.

### P4 — Cart + favorites as account data
- Replace `ttuCart` / `ttuFavorites` after login.
- Add a **small** cart icon to the listings/sell navbar (do not redesign the bar).
- Add a saved-listings page using the **existing listings card styles**, not a new visual language.

### P5 — Orders
- Meetup path creates a pending order and confirmation screen.
- Card path goes through Stripe; never persist PAN/CVV.
- Clear cart only after a successful order create.
- Add a confirmation page; do not restyle payment.html into that page.

### P6 — Messaging
- Wire `#messageButton` and the listings messages icon to a real inbox.
- New page may use listings Inter chrome **or** cream chrome; pick one and do not invent a third look.

### P7 — Hardening and deploy
- Escape HTML; CSRF; rate limits; image type/size checks.
- Tests for auth domain rule, listing filters, cart qty cap, checkout totals.
- Deploy static host + API + Postgres + object storage.
- Initialize git if the team wants version control (this folder is not a repo).

---

## 17. Exact instructions for another Cursor chat

Copy the following block into a new chat.

---

**Continue TTU Marketplace. Read `PROJECT_HANDOFF.md` and `TODO.md` first.**

Project path: `C:\HP Laptop\Hackathon project\TTU Marketplace`

This is a **vanilla HTML/CSS/JS** Texas Tech student marketplace. There is **no React, no Node app, no database, no git repo**.

**Hard rules**

1. Do **not** redesign, restyle, or “unify” the completed frontend.
2. Do **not** rewrite pages in React/Next/Vue.
3. Do **not** merge `style.css`, `listings.css`, `product.css`, `cart.css`, and `payment.css` into one theme.
4. Do **not** change completed layout, fonts, or colors unless fixing a functional bug the user asked for.
5. Do **not** delete `styles.css` or unused images unless asked.
6. Preserve filenames: `index.html`, `listings.html`, `sell.html`, `product.html`, `cart.html`, `payment.html`, and their current CSS/JS pairs.
7. Preserve storage key names (`ttuCart`, `ttuFavorites`, `ttuUserListings`, `ttuCheckout`) until an API replaces them.
8. Preserve category and condition strings exactly.
9. Quantity maximum is 5.
10. Login must remain `@ttu.edu` only.
11. Serve with `python -m http.server` unless you are adding a real API server.
12. If you add a feature page (favorites, messages, signup, confirmation), match the **nearest existing** page’s CSS. Listings-like pages use Inter + `listings.css`. Product/cart/payment-like pages use DM Sans / Graduate / Playfair + those stylesheets.
13. Wire existing IDs and buttons instead of inventing duplicate UI: `#loginForm`, `#googleButton`, `#createLink`, `#forgotLink`, `#addToCart`, `#checkoutButton`, `#messageButton`, `#saveButton`, `.fav-btn`, cart `.save-item` / `.remove-item`, `#paymentForm`.
14. Verify UI changes in the browser. Login → listings → product `?id=1` → add to cart → cart → checkout is the golden path.

**Completed and working (do not rebuild)**

- Login UI (`index.html` / `style.css` / `script.js`)
- Listings grid + filters (`listings.html` / `listings.css` / `listings.js` + `products.js`)
- Sell form (`sell.html` / `sell.css` / `sell.js`)
- Product detail (`product.html` / `product.css` / `product.js`)
- Cart (`cart.html` / `cart.css` / `cart.js`)
- Payment demo (`payment.html` / `payment.css` / `payment.js`)

**Current golden path**

1. Open `http://127.0.0.1:5180/`
2. Enter any `name@ttu.edu` and any password → listings
3. Open TI-84 (`product.html?id=1`) or Calculus (`product.html?id=5`)
4. Add to cart → `cart.html`
5. Proceed to checkout → `payment.html?id=1&qty=1` or `?from=cart`

**First recommended implementation tasks** (see `TODO.md`): authentication, then database-backed listings, then image uploads, then cart/favorites APIs. Do not start with a visual refresh.

---

## Quick reference for developers

| Topic | Fact |
|---|---|
| Stack | Static HTML/CSS/JS only |
| Catalog | `products.js` global `products` |
| User listings | `localStorage.ttuUserListings` |
| Cart | `localStorage.ttuCart` |
| Favorites | `localStorage.ttuFavorites` |
| Buy-now memory | `sessionStorage.ttuCheckout` |
| Best-specified product | id `1` TI-84 Plus |
| Second custom product | id `5` Calculus book |
| Local server | `python -m http.server 5180` |
| Last known URL | `http://127.0.0.1:5180/` |
| Git | Not initialized |
| Package manager | None |
| Unused CSS | `styles.css` |
| Unused images | `assets/images/calculator.jpg`, `assets/images/calculus-book.jpg` |
