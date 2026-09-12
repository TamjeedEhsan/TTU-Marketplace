# TTU Marketplace — TODO

Checklist based on the **current vanilla frontend only**. Nothing here is already a backend feature. Check items off as they are actually implemented.

Do not redesign completed pages while working through this list. See `PROJECT_HANDOFF.md` section 17.

---

## Frontend cleanup

- [ ] Keep `index.html`, `listings.html`, `sell.html`, `product.html`, `cart.html`, and `payment.html` as the live pages. Do not replace them.
- [ ] Leave `styles.css` unused unless the owner asks to delete the old login stylesheet.
- [ ] Leave unused `assets/images/calculator.jpg` and `assets/images/calculus-book.jpg` unless asked to remove them.
- [ ] Add a cart icon/link to `listings.html` and `sell.html` that goes to `cart.html` and shows a `ttuCart` qty badge. Do not restyle those navbars beyond that addition.
- [ ] Point listings/sell/product/cart heart buttons to a future `favorites.html` (or hide them until that page exists). They currently do nothing as nav actions.
- [ ] Point listings/sell messages icons and product `#messageButton` to a future inbox. They currently toast or do nothing.
- [ ] Point profile avatar/buttons to a future profile/logout page. Initials `NS` and `assets/images/avatar.jpg` are placeholders.
- [ ] Build `signup.html` / forgot-password using the **login card styles** (`style.css`). Wire `#createLink` and `#forgotLink` away from `href="#"`.
- [ ] Stop defaulting `product.html` with no `id` to listing 1. Show the existing “Listing not found” state and disable purchase controls.
- [ ] Stop defaulting `payment.html` with no `id` / empty cart to `products[0]` (TI-84). Redirect back to cart or listings.
- [ ] After a successful mock/real checkout, redirect to a confirmation page and clear `ttuCart`.
- [ ] Align sell `#location` with filter values (`TTU` or `Lubbock, TX`) plus an optional meetup note, so new listings are filterable.
- [ ] Store all sell photos on the listing as `images[]`, not only `image` = first data URL.
- [ ] Escape user titles/descriptions in `listings.js` / `product.js` (`innerHTML` XSS).
- [ ] Enable or remove the disabled search input on `sell.html`.
- [ ] Decide whether login `<title>` stays “Matador Marketplace” or matches “TTU Marketplace”.
- [ ] Add a favicon. There is none.
- [ ] Initialize git when the team is ready. This folder is not a repository.

---

## Authentication

- [ ] Replace the `script.js` submit redirect with a real login API. Keep `#loginForm`, `#email`, `#password`, and the `@ttu.edu` regex.
- [ ] Persist a session (HttpOnly cookie or equivalent). `listings.html` and later pages are currently open with no gate.
- [ ] Honor `#remember` (“Keep me logged in”). It is visual only.
- [ ] Implement `#googleButton` as Google / eRaider OAuth. Reject any email that is not `@ttu.edu`.
- [ ] Implement create-account (`#createLink`) with the same domain rule.
- [ ] Implement forgot-password (`#forgotLink`).
- [ ] Add logout on the profile control.
- [ ] Show the signed-in user’s initials/name instead of hardcoded `NS` / stock avatar.
- [ ] Server-side enforce `/^[^\s@]+@ttu\.edu$/i` on signup, login, and OAuth callback. Do not trust the client.

---

## Database

- [ ] Add a real database (Postgres preferred; SQLite acceptable for local hackathon).
- [ ] Create `users`, `listings`, `listing_images`, `carts`/`cart_items`, `favorites`, `conversations`, `messages`, `orders`, `order_items`, `payments` as described in `PROJECT_HANDOFF.md` §13.
- [ ] Seed the 24 rows from `products.js` (ids 1–24, including TI-84 gallery and Calculus seller copy).
- [ ] Replace fake `time` / `hoursAgo` with `created_at`.
- [ ] Stop treating `products.js` as the source of truth once the API returns listings. Keep the file only as seed/fallback until cutover.
- [ ] Move `ttuUserListings` off `localStorage` into `listings` owned by `seller_id`.

---

## Product listings

- [ ] `GET /api/listings` with the current filters: search, category, min/max price, location, condition, sort (`newest` | `price-asc` | `price-desc`).
- [ ] `GET /api/listings/:id` for `product.html?id=`.
- [ ] Keep category strings exact: Textbooks, Furniture, Electronics, Clothing, Bikes, Other.
- [ ] Keep condition strings exact: New, Like New, Good, Fair, For Parts.
- [ ] Keep seed locations as `TTU` and `Lubbock, TX` until a richer location model exists.
- [ ] Give listings 2–4 and 6–24 real photos that match the title (several placeholders are generic).
- [ ] Add seller-owned edit/delete (“My listings”). No page exists yet.
- [ ] Mark listings sold/`hidden` instead of leaving them purchasable forever.
- [ ] Attach a real `seller` object to user-created listings. `sell.js` currently omits `seller`.

---

## Image uploads

- [ ] Change `#photo-input` / `sell.js` to POST files to the API (max 5). Stop `FileReader` → `localStorage` data URLs.
- [ ] Do not use `assets/images/backpack.jpg` as the fallback for a listing with no photo.
- [ ] Persist every uploaded photo in `listing_images` so `product.js` `getImages()` can show a gallery.
- [ ] Validate type/size server-side (images only).
- [ ] Serve uploaded files from `/uploads` (dev) or object storage (deploy).
- [ ] Keep existing static files in `assets/` for seed listings and login art (`ttu-logo.png`, `campus-panel.png`, calculator set, `textbook.png`).

---

## Cart

- [ ] Keep `cart.html` markup. Swap `cart.js` `ttuCart` reads/writes for `GET/POST/PATCH/DELETE /api/cart`.
- [ ] Keep qty cap at 5 (`product.js` and `cart.js` already enforce this).
- [ ] Preserve checkout URLs: one line → `payment.html?id={id}&qty={qty}`; multiple → `payment.html?from=cart`.
- [ ] Add listings/sell navbar cart link (missing today).
- [ ] Clear the server cart only after a successful order, not on payment-page load.
- [ ] Handle deleted/sold listings that are still sitting in a cart.

---

## Favorites

- [ ] Keep listing-card `.fav-btn` and product `#saveButton` behavior; persist via `PUT/DELETE /api/favorites/:id` instead of `ttuFavorites`.
- [ ] Cart `.save-item` should favorite **and** still remove from cart, then be visible on a saved-items page.
- [ ] Build `favorites.html` using **listings** card styles (`listings.css`), not a new theme.
- [ ] Wire every heart icon in the headers to that page.

---

## Messaging

- [ ] Replace the product `#messageButton` toast (`Opening a conversation with …`) with `POST /api/conversations`.
- [ ] Build inbox + thread pages. No messaging files exist.
- [ ] Wire listings/sell envelope icons.
- [ ] Store messages per buyer/seller/listing.
- [ ] Unread badge on the envelope icon.
- [ ] Do not allow messaging without a signed-in `@ttu.edu` user.

---

## Orders

- [ ] Create an order from payment submit (`#paymentForm`), both `card` and `meetup` methods.
- [ ] Snapshot title, price, qty, image, seller at purchase time.
- [ ] Support multi-seller carts (`payment.js` already totals every `ttuCart` line when `from=cart`).
- [ ] Add a confirmation page after submit. `payment.html` currently only toasts.
- [ ] Add buyer order history and seller “sold / pending meetup” views. Neither exists.
- [ ] Set listing status when the only available unit is sold.
- [ ] Keep marketplace fee `$0.00` until a real fee is specified. Do not invent a fee in the UI.

---

## Payments

- [ ] Keep the two methods already in `payment.html`: `paymentMethod=card` and `paymentMethod=meetup`.
- [ ] Meetup: no card fields, create `pending_meetup` order, toast/page “Campus meetup request confirmed.”
- [ ] Card: do **not** POST PAN/CVV to our server. Use Stripe (or similar) via `#expressButton` / Payment Element.
- [ ] `#expressButton` is a stub toast today (“Express checkout is ready to connect to a payment provider.”).
- [ ] Keep the on-page copy: “This demo does not transmit or store payment information” until a provider is live; then replace with a real security note, not a restyle.
- [ ] Validate agreement `#agreement` server-side as well as in `payment.js`.
- [ ] Never commit `STRIPE_SECRET_KEY` or card data into the repo. There is no `.env` yet — create one when keys exist.

---

## Testing

- [ ] There are **zero** tests in this repo. Add some before calling backend work done.
- [ ] Auth: accept `user@ttu.edu`; reject `user@gmail.com` and `user@ttu.edu.com`.
- [ ] Listings filters match current `listings.js` rules (search title+category, price, location equality, condition set, sort).
- [ ] Cart qty never exceeds 5; merge lines by listing id.
- [ ] Checkout totals equal `price * qty` with fee 0.
- [ ] Sell requires title, price ≥ 0, category, condition, location.
- [ ] Browser golden path (until automated): login → listings → `product.html?id=1` → Add to cart → cart → checkout.
- [ ] Second path: `product.html?id=5` buy-now → `payment.html?id=5&qty=`.
- [ ] Third path: two cart lines → `payment.html?from=cart`.
- [ ] Empty cart shows `#emptyCart`, not the summary.

---

## Deployment

- [ ] No deploy config exists (`package.json`, Docker, CI, host files). Add one when ready.
- [ ] Host the current static files without bundling/rewriting CSS.
- [ ] Host the API separately (or same origin `/api`).
- [ ] Provision Postgres + object storage.
- [ ] Set env vars from `PROJECT_HANDOFF.md` §15.
- [ ] Restrict CORS / cookies to the real frontend origin.
- [ ] HTTPS required before Google OAuth and Stripe.
- [ ] Confirm login assets load on the host: `assets/ttu-logo.png`, `assets/campus-panel.png`.
- [ ] Confirm seed images still resolve at their current relative paths, or update `products.js` / DB URLs in one pass.

---

## Suggested order

1. Frontend cleanup that is strictly wiring (cart icon on listings, dead-link targets).
2. Authentication.
3. Database + seed listings.
4. Image uploads on sell.
5. Cart + favorites APIs.
6. Orders + meetup confirmation.
7. Stripe (or keep meetup-only if the hackathon does not need cards).
8. Messaging.
9. Testing + deployment.
