# 🎓 Matador Marketplace

A student-only online marketplace built for the **Texas Tech University (TTU)** community.

Matador Marketplace allows TTU students to securely buy, sell, save, and manage items within the university community. Users authenticate using their `@ttu.edu` email address, create listings, upload product images, add items to their cart, complete demo checkout orders, and track purchases and sales from their profile.

---

## 🚀 Project Overview

College students frequently need to buy or sell textbooks, electronics, furniture, clothing, school supplies, and other items.

Matador Marketplace provides a centralized marketplace designed specifically for TTU students.

Instead of using general marketplaces, students can interact with other members of the Texas Tech community through a platform built around student needs.

---

## ✨ Features

### 🔐 Authentication

- TTU student account registration
- `@ttu.edu` email restriction
- Email confirmation
- Secure login using Supabase Authentication
- Persistent user sessions
- Logout functionality
- Automatic user profile creation after signup

### 🛍️ Marketplace Listings

- Browse active marketplace listings
- View individual product pages
- View product images, descriptions, prices, conditions, categories, and locations
- View seller information
- Sort and filter marketplace listings
- Automatically hide sold listings from active marketplace results

### ➕ Sell an Item

Students can create marketplace listings with:

- Item title
- Description
- Price
- Category
- Condition
- Location
- Product image

Listing information is stored in the Supabase database.

Product images are uploaded using **Supabase Storage**.

### 🛒 Shopping Cart

Users can:

- Add items to their cart
- Increase or decrease quantity
- Remove items
- Save items for later
- View dynamic cart totals
- Continue to checkout

Cart data is connected directly to each authenticated user's account.

### ❤️ Saved Items

Students can:

- Save listings they are interested in
- Remove saved listings
- Move items from the cart to saved items
- View saved items from their profile

Saved items are stored in the database rather than only in browser storage.

### 💳 Checkout

Users can complete a demo marketplace checkout.

The checkout system:

- Verifies the authenticated buyer
- Prevents users from purchasing their own listings
- Creates an order
- Records the buyer and seller
- Records the purchase amount
- Updates the listing to `sold`
- Removes the purchased item from the buyer's cart
- Updates buyer and seller history

The current payment interface is a **demonstration checkout system**.

No real card information is processed, transmitted, or stored.

### 📦 Order Management

Orders support the following statuses:

```text
Pending
↓
Ready for Meetup
↓
Completed
```

Sellers can update the status of their orders.

Buyers can see the updated order status from their purchase history.

### 👤 User Profile

Each student has a marketplace profile displaying:

- Name
- TTU email
- Major
- Classification
- Member since date
- Items listed
- Items sold
- Items purchased
- Active listings
- Saved items

The profile also contains sections for:

- User listings
- Purchase history
- Sales history
- Saved items

### 🤝 Seller Management

Sellers can:

- View their listings
- See whether listings are active or sold
- View orders from buyers
- See buyer information
- Mark an order as ready for meetup
- Mark an order as completed
- Track sold items

---

## 🧑‍💻 Tech Stack

### Frontend

- HTML5
- CSS3
- JavaScript
- Responsive web design

### Backend

- Supabase

Supabase provides:

- PostgreSQL database
- Authentication
- Row Level Security (RLS)
- Storage
- Database functions / RPC
- User session management

### Development Tools

- Cursor
- Visual Studio Code / Live Server
- Git
- GitHub
- Supabase Dashboard

---

## 🗄️ Database Structure

The application currently uses the following main tables:

### `profiles`

Stores marketplace user information.

```text
id
email
full_name
major
classification
avatar_url
created_at
```

### `listings`

Stores items listed on the marketplace.

```text
id
seller_id
title
description
price
category
condition
location
image_url
status
created_at
```

### `saved_items`

Stores listings saved by users.

```text
id
user_id
listing_id
created_at
```

### `cart`

Stores items added to each user's cart.

```text
id
user_id
listing_id
quantity
created_at
```

### `orders`

Stores completed marketplace checkout transactions.

```text
id
buyer_id
seller_id
listing_id
amount
quantity
order_status
created_at
```

---

## 🔒 Security

Matador Marketplace uses **Supabase Row Level Security (RLS)** to control access to database records.

Security rules include:

- Users can update only their own profiles
- Users can create listings only under their own account
- Users can update/delete only their own listings
- Users can access their own cart
- Users can access their own saved items
- Buyers and sellers can view their associated orders
- Sellers can update the status of their orders
- Authentication is restricted to `@ttu.edu` email addresses

Checkout also validates transactions on the backend.

Users cannot purchase their own listings.

---

## ⚙️ Secure Checkout Function

The marketplace uses a Supabase PostgreSQL function for completing purchases.

The function performs several operations together:

1. Verifies that the buyer is authenticated
2. Verifies that the listing exists
3. Verifies that the listing is active
4. Prevents users from purchasing their own listing
5. Validates the requested quantity
6. Creates the order
7. Marks the listing as sold
8. Removes the listing from the buyer's cart
9. Returns the created order ID

This keeps important checkout logic on the backend instead of trusting only frontend JavaScript.

---

## 🖼️ Image Storage

Listing images are stored using **Supabase Storage**.

Storage bucket:

```text
listing-images
```

Authenticated users can upload listing images.

Uploaded images are connected to marketplace listings through their public image URLs.

---

## 📁 Project Structure

```text
TTU-Marketplace/
│
├── index.html
├── signup.html
├── listings.html
├── product.html
├── sell.html
├── cart.html
├── payment.html
├── profile.html
│
├── style.css
├── listings.css
├── product.css
├── sell.css
├── cart.css
├── payment.css
├── profile.css
│
├── script.js
├── auth.js
├── supabase.js
├── listings.js
├── product.js
├── sell.js
├── cart.js
├── payment.js
├── profile.js
├── products.js
├── utils.js
│
└── assets/
    ├── images/
    └── ttu-logo.png
```

Additional frontend assets and styles may also be included in the repository.

---

## 🔄 Marketplace Workflow

The main marketplace flow is:

```text
Student creates TTU account
        ↓
Email authentication
        ↓
Student logs in
        ↓
Browse marketplace
        ↓
View product
        ↓
Add to cart / Save item
        ↓
Checkout
        ↓
Order created
        ↓
Listing becomes sold
        ↓
Seller receives sale
        ↓
Seller marks Ready for Meetup
        ↓
Buyer meets seller
        ↓
Seller marks order Completed
```

---

## 🧪 Tested Functionality

The following workflow has been tested successfully:

```text
Seller creates listing
        ↓
Listing appears in marketplace
        ↓
Different user logs in
        ↓
Buyer adds seller's item to cart
        ↓
Buyer completes checkout
        ↓
Order is created
        ↓
Item is removed from cart
        ↓
Listing becomes sold
        ↓
Buyer purchase history updates
        ↓
Seller sold-item statistics update
        ↓
Seller sees sale
        ↓
Seller updates order status
```

The system also correctly prevents a seller from purchasing their own listing.

---

## 🖥️ Running the Project Locally

Clone the repository:

```bash
git clone https://github.com/TamjeedEhsan/TTU-Marketplace.git
```

Navigate into the project:

```bash
cd TTU-Marketplace
```

Run the website using a local development server such as **Live Server**.

Example:

```text
http://127.0.0.1:5500
```

Supabase must be configured for the project for authentication and backend features to function.

---

## 🛠️ Current Development Status

### Frontend

Approximately **90–95% complete**

Core pages and interfaces are implemented.

### Backend

Approximately **90% complete**

Implemented backend functionality includes:

- Authentication
- TTU email restriction
- User profiles
- Listings database
- Product image storage
- Shopping cart
- Saved items
- Checkout
- Orders
- Purchase history
- Sales history
- Order status management
- Row Level Security

---

## 🔮 Planned Improvements

Future improvements may include:

- Edit profile functionality
- Edit listing functionality
- Improved authentication guards
- Password reset functionality
- TTU eRaider / OAuth integration
- Buyer/seller messaging
- Notifications
- Improved search and filtering
- Improved mobile responsiveness
- Additional order-management controls
- Stronger database security policies
- More robust transaction handling
- Production deployment
- Real payment integration if appropriate

---

## ⚠️ Payment Disclaimer

The current payment page is designed for demonstration purposes.

**Matador Marketplace does not currently process real payments.**

Card information entered into the demo interface is not intended to be stored or transmitted.

The primary marketplace transaction model is designed around student-to-student transactions and meetup-based exchanges.

---

## 🎯 Project Goal

The goal of Matador Marketplace is to create a simple and useful marketplace where Texas Tech students can:

**Buy. Sell. Connect.**

By limiting access to TTU students, the platform is designed around a smaller university community rather than a general public marketplace.

---

## 👥 Team

Developed as a hackathon project by Texas Tech University students.

---

## 📌 Repository

GitHub Repository:

`TamjeedEhsan/TTU-Marketplace`

---

## 📄 License

This project was created for educational and hackathon purposes.
