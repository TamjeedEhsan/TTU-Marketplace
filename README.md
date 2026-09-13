# TTU Marketplace

A full-stack student marketplace built specifically for the Texas Tech University community.

TTU Marketplace allows verified Red Raiders to buy, sell, save, and manage items within a trusted campus-focused platform. From textbooks and electronics to furniture and everyday dorm essentials, the goal is to make student-to-student exchange easier, safer, and more sustainable.

---

## Inspiration

Students often have perfectly good items they no longer need.

A student moving out of a dorm may throw away furniture, appliances, or other useful items simply because they do not know who needs them. Another student may be trying to sell a calculus textbook after finishing the course, while someone else on campus is about to buy that exact book new.

TTU Marketplace was created to connect those students.

Instead of useful items going to waste or students paying full price for something another Red Raider already has, TTU Marketplace creates one convenient place for the Texas Tech community to buy and sell locally.

---

## What It Does

TTU Marketplace provides a campus-focused marketplace where verified TTU students can:

- Create an account using a `@ttu.edu` email address
- Verify their account through email confirmation
- Log in and securely access their account
- Create and publish marketplace listings
- Upload listing photos
- Browse available items
- View individual product information
- Save items for later
- Add and remove items from a shopping cart
- Adjust item quantities
- Complete a demo checkout
- Choose between card-style demo checkout or campus meetup
- View purchase history
- View items they have listed and sold
- Track active and sold listings
- View incoming sales
- Update an order from Pending → Ready for Meetup → Completed
- Log out securely

---

## Full Marketplace Workflow

The completed application supports the following end-to-end workflow:

**TTU Student Signup**

↓

**TTU Email Verification**

↓

**Secure Login**

↓

**Create Listing + Upload Image**

↓

**Listing Appears in Marketplace**

↓

**Another Student Views the Product**

↓

**Save Item or Add to Cart**

↓

**Checkout**

↓

**Order Created**

↓

**Listing Automatically Marked as Sold**

↓

**Buyer Sees Purchase**

↓

**Seller Sees Sale**

↓

**Seller Updates Order Status**

↓

**Order Completed**

This complete workflow has been tested using separate buyer and seller accounts.

---

## Tech Stack

### Frontend

- HTML5
- CSS3
- JavaScript
- Responsive web design
- Dynamic DOM rendering

### Backend

- Supabase
- PostgreSQL
- Supabase Authentication
- Supabase Storage
- Row Level Security (RLS)
- PostgreSQL functions / RPC

### Development & Collaboration

- Git
- GitHub

---

## Backend Architecture

The backend is powered by Supabase and PostgreSQL.

### Authentication

Supabase Authentication manages user accounts and sessions.

The authentication system includes:

- TTU-only account registration
- `@ttu.edu` email validation
- Email confirmation
- Login
- Persistent authentication sessions
- Logout
- Authentication guards for protected pages

Protected pages redirect unauthenticated users back to the login page.

---

## Database

The PostgreSQL database includes the following core tables:

### `profiles`

Stores marketplace user information.

### `listings`

Stores items posted for sale, including:

- Seller
- Title
- Description
- Price
- Category
- Condition
- Location
- Image
- Listing status

### `cart`

Stores items added to each user's shopping cart.

### `saved_items`

Stores listings users have saved for later.

### `orders`

Stores marketplace transactions between buyers and sellers.

Orders include:

- Buyer
- Seller
- Listing
- Quantity
- Amount
- Order status
- Creation date

---

## Secure Checkout

Purchases are processed through a PostgreSQL RPC function rather than allowing the browser to directly create arbitrary orders.

The checkout system:

1. Verifies that the user is authenticated
2. Verifies that the listing exists
3. Verifies that the listing is still active
4. Prevents users from purchasing their own listings
5. Validates quantity
6. Retrieves the price and seller from the database
7. Creates the order
8. Marks the listing as sold
9. Removes the purchased listing from the buyer's cart

This keeps important transaction information controlled by the backend rather than trusting values submitted directly by the browser.

---

## Row Level Security

Row Level Security policies are used throughout the database.

These policies help ensure that users can only perform actions they are authorized to perform.

Examples include:

- Users can manage their own cart
- Users can manage their own saved items
- Sellers can manage their own listings
- Buyers and sellers can view their relevant orders
- Sellers can update the status of their own sales
- Authenticated users can upload listing images

---

## Image Storage

Listing images are stored using Supabase Storage.

When a seller creates a listing:

1. The image is uploaded to the `listing-images` storage bucket
2. The image URL is generated
3. The URL is stored with the listing
4. The marketplace dynamically displays the uploaded image

---

## Order Management

TTU Marketplace supports both sides of a transaction.

### Buyer

Buyers can:

- View purchases
- See the seller
- See purchase information
- Track order status

### Seller

Sellers can:

- View incoming sales
- See the buyer
- Track sold listings
- Mark an order as **Ready for Meetup**
- Mark an order as **Completed**

Order progression:

`Pending → Ready for Meetup → Completed`

---

## Project Structure

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
├── script.js
├── signup.js
├── listings.js
├── product.js
├── sell.js
├── cart.js
├── payment.js
├── profile.js
├── auth.js
├── supabase.js
├── utils.js
│
├── style.css
├── listings.css
├── product.css
├── sell.css
├── cart.css
├── payment.css
├── profile.css
│
└── assets/
    └── images/
```

---

## Final Testing

The completed marketplace was tested across the full user workflow.

Testing included:

- TTU account registration
- Email confirmation
- Login and logout
- Authentication guards
- Creating listings
- Uploading listing images
- Loading listings from the database
- Product pages
- Saving and unsaving items
- Adding items to cart
- Removing items from cart
- Updating quantities
- Checkout
- Self-purchase prevention
- Automatic sold status
- Purchase history
- Seller sales history
- Seller order-status updates
- Buyer order-status visibility
- Protected-page redirects
- Separate buyer and seller accounts

The complete buyer-to-seller transaction workflow was successfully tested end-to-end.

---

## Security

TTU Marketplace includes several backend security measures:

- TTU-only email registration
- Email verification
- Supabase authentication
- Row Level Security
- User-specific database operations
- Protected-page authentication guards
- Secure server-side purchase function
- Prevention of self-purchases
- Restricted order modification
- Controlled storage uploads


## Project Status

### Hackathon Version — Complete ✅

The core full-stack marketplace is functional and has passed end-to-end testing.

Completed systems include:

- Authentication
- TTU email verification
- Profiles
- Listings
- Image storage
- Cart
- Saved items
- Checkout
- Orders
- Purchase history
- Seller sales management
- Order-status tracking
- Row Level Security
- Authentication guards
- End-to-end transaction testing

---

## Future Improvements

Potential future additions include:

- Direct buyer/seller messaging
- Real payment processing
- Advanced marketplace search
- Listing editing
- User profile editing
- Password reset
- Multiple listing images
- Notifications
- Seller ratings and reviews
- Improved mobile responsiveness
- Public deployment
- Additional marketplace moderation tools


---

## Built For

**Texas Tech University students — by Red Raiders, for Red Raiders.

TTU Marketplace was built as a hackathon project to demonstrate how a campus-specific marketplace can make buying, selling, and reusing items easier within the university community.
