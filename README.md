Copy everything inside this box and paste it into your `README.md` file:

````markdown
# TTU Marketplace

> Buy it. Sell it. Keep it on campus.

TTU Marketplace is a campus-focused marketplace designed to help Texas Tech University students buy and sell items within their university community. The project aims to make it easier for students to find affordable textbooks, electronics, furniture, dorm essentials, clothing, and other useful items from fellow Red Raiders.

The current version is a responsive **frontend prototype** built with HTML, CSS, and JavaScript. Authentication, database storage, messaging, APIs, and real payment processing are planned but are not yet connected.

## Project Goals

- Create a marketplace intended for verified TTU students.
- Make buying and selling used items simple and convenient.
- Encourage reuse and reduce waste on campus.
- Provide clear product, cart, checkout, and account experiences.
- Support safer exchanges through public campus meetup reminders.

## Current Features

- TTU-themed responsive interface
- Login page with TTU email validation
- Marketplace browsing interface
- Product listing creation page
- Individual product details page
- Product image gallery
- Product description and seller information
- Save-item interface
- Shopping cart with quantity controls
- Automatic cart-total calculations
- Remove Item and Save for Later controls
- Empty-cart state
- Checkout and payment interface
- Card-field formatting and frontend validation
- Pay-at-meetup option
- User profile and marketplace activity interface
- Mobile, tablet, and desktop layouts

## Important Project Status

The following features are currently visual or frontend demonstrations:

- User registration and login
- TTU email verification
- Google authentication
- Saving and retrieving listings
- Product image uploads
- Persistent carts and saved items
- Buyer–seller messaging
- Order management
- Payment processing
- User profiles and order history

No real card information is transmitted or stored by the current frontend. A secure backend and payment provider must be implemented before accepting payments.

## Built With

- HTML5
- CSS3
- Vanilla JavaScript
- Responsive CSS Grid and Flexbox
- Inline SVG icons and local image assets
- Google Fonts

No frontend framework is required for the current version.

## Main Pages

| Page | Purpose |
| --- | --- |
| Login | Allows users to enter a TTU email and password. |
| Marketplace Home | Displays categories, featured items, and recent listings. |
| List an Item | Collects product pictures, category, condition, price, and description. |
| Product Details | Shows product images, price, seller, pickup information, and description. |
| Cart | Lets users review items, change quantities, save items, and remove items. |
| Payment | Displays the order summary and payment or campus-meetup options. |
| Profile | Shows user information, listing activity, purchases, sales, and order status. |

## Getting Started

### 1. Clone the repository

```bash
git clone YOUR_REPOSITORY_URL
cd YOUR_REPOSITORY_NAME
```

Replace `YOUR_REPOSITORY_URL` and `YOUR_REPOSITORY_NAME` with your actual GitHub repository information.

### 2. Open the project

Open the project folder in Cursor, Visual Studio Code, or another code editor.

### 3. Run the frontend

You can open the main HTML file directly in a browser. For a better development experience, use the **Live Server** extension:

1. Install Live Server in Cursor or Visual Studio Code.
2. Right-click the main HTML file.
3. Select **Open with Live Server**.

The project currently does not require `npm install` or a build command.

## Suggested Project Structure

```text
ttu-marketplace/
├── index.html
├── login.html
├── list-item.html
├── product.html
├── cart.html
├── payment.html
├── profile.html
├── css/
│   └── styles.css
├── js/
│   └── main.js
├── assets/
│   ├── images/
│   └── icons/
└── README.md
```

Your exact filenames may differ. Update links and paths consistently if files are renamed or reorganized.

## Recommended Backend Plan

A practical backend setup for this project is:

- **Supabase Authentication** for accounts and sessions
- **PostgreSQL through Supabase** for users, listings, carts, messages, and orders
- **Supabase Storage** for product images
- **Supabase Realtime** for buyer–seller messaging
- **Stripe Checkout** for real payments, if online payments are added
- **Vercel or Netlify** for frontend deployment

### Recommended Implementation Order

1. Organize and connect all frontend pages.
2. Create user authentication and session handling.
3. Restrict registration to valid `@ttu.edu` email addresses.
4. Create the database tables and security policies.
5. Connect product creation and image uploads.
6. Load marketplace listings from the database.
7. Add persistent favorites and carts.
8. Add messaging and notifications.
9. Add orders and transaction statuses.
10. Add secure payment processing, testing, and deployment.

## Proposed Database Tables

- `profiles`
- `listings`
- `listing_images`
- `favorites`
- `cart_items`
- `conversations`
- `messages`
- `orders`
- `order_items`
- `reports`

Database access should be protected with row-level security so users can modify only their own profiles, listings, carts, messages, and orders.

## Authentication Notes

Checking for `@ttu.edu` in browser JavaScript is useful for interface feedback, but it is **not sufficient security**. The backend must also:

- Reject non-TTU email addresses.
- Require email verification.
- Protect authenticated routes.
- Validate every database request.
- Never trust user IDs, prices, or seller information sent by the browser.

Google sign-in for university accounts may also depend on Texas Tech University’s Google Workspace and administrator policies.

## Payment Safety

Do not collect, store, or process raw card numbers in this project’s own database. If online payments are implemented, use a trusted payment provider such as Stripe and complete payment creation on a secure server.

For an initial campus marketplace release, buyers and sellers can arrange payment and pickup themselves. This keeps the first version simpler while authentication, listings, messaging, and order tracking are developed.

## Roadmap

- [x] Design responsive frontend pages
- [x] Add frontend form validation and interactions
- [x] Build product, cart, and checkout interfaces
- [ ] Standardize filenames, navigation, and shared styles
- [ ] Add TTU-only authentication
- [ ] Create the database schema
- [ ] Add database security policies
- [ ] Connect listing creation and image storage
- [ ] Load real product data
- [ ] Save carts and favorites
- [ ] Build real-time messaging
- [ ] Add order-status management
- [ ] Connect secure payments
- [ ] Add automated testing
- [ ] Deploy the application

## Contributing

Contributions should preserve the existing TTU-inspired visual style and responsive behavior.

1. Create a new branch.
2. Make focused changes.
3. Test desktop and mobile layouts.
4. Confirm that image paths and page links work.
5. Open a pull request describing the change.

## Disclaimer

This project is an independent student project and is not currently an official Texas Tech University service.

Texas Tech University names, colors, logos, and other marks belong to their respective owners. Any public release should follow applicable university branding, privacy, marketplace, and acceptable-use requirements.

## License

No license has been selected yet. Add a `LICENSE` file before allowing others to reuse or distribute the project.
````
