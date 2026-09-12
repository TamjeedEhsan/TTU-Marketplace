const products = [
  {
    id: 1,
    title: "TI-84 Plus Calculator",
    detailTitle: "TI-84 Plus Graphing Calculator",
    price: 45,
    retailNote: "Typically $100+ new",
    location: "Lubbock, TX",
    time: "2 hours ago",
    hoursAgo: 2,
    category: "Electronics",
    condition: "Like New",
    image: "assets/calculator-front.png",
    images: [
      { src: "assets/calculator-front.png", alt: "TI-84 Plus graphing calculator, front view" },
      { src: "assets/calculator-angle.png", alt: "TI-84 Plus graphing calculator shown at an angle" },
      { src: "assets/calculator-case.png", alt: "TI-84 Plus calculator with protective case" }
    ],
    aboutHtml: `
      <p>TI-84 Plus graphing calculator in excellent working condition. It was used for two semesters and has been cleaned and tested. All buttons and graphing functions work properly.</p>
      <p>Includes the original protective cover and four new AAA batteries. Perfect for calculus, statistics, engineering, and science courses.</p>
      <ul>
        <li>No cracks or screen damage</li>
        <li>Minor signs of normal use</li>
        <li>Available for pickup on the TTU campus</li>
      </ul>
    `,
    seller: { initials: "AM", name: "Alex Morgan", meta: "TTU student · 4.9 ★ · 8 listings" }
  },
  { id: 2, title: "Study Desk", price: 30, location: "TTU", time: "3 hours ago", hoursAgo: 3, category: "Furniture", condition: "Good", image: "assets/images/desk.jpg" },
  { id: 3, title: "iPad Air (5th Gen)", price: 220, location: "TTU", time: "5 hours ago", hoursAgo: 5, category: "Electronics", condition: "Like New", image: "assets/images/ipad.jpg" },
  { id: 4, title: "Bedside Lamp", price: 12, location: "TTU", time: "6 hours ago", hoursAgo: 6, category: "Furniture", condition: "Good", image: "assets/images/lamp.jpg" },
  {
    id: 5,
    title: "Calculus (8th Ed.)",
    detailTitle: "Calculus: Early Transcendentals",
    price: 60,
    location: "TTU",
    time: "8 hours ago",
    hoursAgo: 8,
    category: "Textbooks",
    condition: "Good",
    image: "assets/textbook.png",
    seller: { initials: "JL", name: "Jordan Lee", meta: "TTU student · 4.8 ★ · 5 listings" }
  },
  { id: 6, title: "TTU Hoodie (M)", price: 25, location: "Lubbock, TX", time: "10 hours ago", hoursAgo: 10, category: "Clothing", condition: "Good", image: "assets/images/ttu-hoodie.jpg" },
  { id: 7, title: "Nike Air Force 1 (Size 10)", price: 70, location: "Lubbock, TX", time: "12 hours ago", hoursAgo: 12, category: "Clothing", condition: "Like New", image: "assets/images/shoes.jpg" },
  { id: 8, title: "Trek Hybrid Bike", price: 150, location: "TTU", time: "1 day ago", hoursAgo: 24, category: "Bikes", condition: "Good", image: "assets/images/bike.jpg" },
  { id: 9, title: "Mini Fridge", price: 80, location: "TTU", time: "1 day ago", hoursAgo: 26, category: "Furniture", condition: "Good", image: "assets/images/mini-fridge.jpg" },
  { id: 10, title: "Office Chair", price: 40, location: "Lubbock, TX", time: "1 day ago", hoursAgo: 28, category: "Furniture", condition: "Fair", image: "assets/images/chair.jpg" },
  { id: 11, title: "AirPods Pro (2nd Gen)", price: 100, location: "TTU", time: "2 days ago", hoursAgo: 48, category: "Electronics", condition: "Like New", image: "assets/images/airpods.jpg" },
  { id: 12, title: "TTU T-Shirt (L)", price: 15, location: "TTU", time: "2 days ago", hoursAgo: 50, category: "Clothing", condition: "Good", image: "assets/images/ttu-shirt.jpg" },
  { id: 13, title: "MacBook Charger", price: 20, location: "TTU", time: "2 days ago", hoursAgo: 52, category: "Electronics", condition: "Good", image: "assets/images/charger.jpg" },
  { id: 14, title: "Wooden Dresser", price: 65, location: "Lubbock, TX", time: "3 days ago", hoursAgo: 72, category: "Furniture", condition: "Good", image: "assets/images/dresser.jpg" },
  { id: 15, title: "Biology Textbook", price: 35, location: "TTU", time: "3 days ago", hoursAgo: 74, category: "Textbooks", condition: "Fair", image: "assets/images/textbook.jpg" },
  { id: 16, title: "24\" Monitor", price: 90, location: "Lubbock, TX", time: "4 days ago", hoursAgo: 96, category: "Electronics", condition: "Like New", image: "assets/images/monitor.jpg" },
  { id: 17, title: "Campus Backpack", price: 18, location: "TTU", time: "4 days ago", hoursAgo: 98, category: "Other", condition: "Good", image: "assets/images/backpack.jpg" },
  { id: 18, title: "Microwave", price: 40, location: "TTU", time: "5 days ago", hoursAgo: 120, category: "Other", condition: "Good", image: "assets/images/microwave.jpg" },
  { id: 19, title: "Coffee Maker", price: 22, location: "TTU", time: "5 days ago", hoursAgo: 122, category: "Other", condition: "Good", image: "assets/images/coffee-maker.jpg" },
  { id: 20, title: "Winter Jacket (M)", price: 45, location: "Lubbock, TX", time: "6 days ago", hoursAgo: 144, category: "Clothing", condition: "Like New", image: "assets/images/jacket.jpg" },
  { id: 21, title: "Xbox Controller", price: 35, location: "TTU", time: "1 week ago", hoursAgo: 168, category: "Electronics", condition: "Good", image: "assets/images/controller.jpg" },
  { id: 22, title: "Full Length Mirror", price: 25, location: "Lubbock, TX", time: "1 week ago", hoursAgo: 170, category: "Furniture", condition: "Fair", image: "assets/images/mirror.jpg" },
  { id: 23, title: "Desk Fan", price: 10, location: "TTU", time: "1 week ago", hoursAgo: 172, category: "Other", condition: "New", image: "assets/images/fan.jpg" },
  { id: 24, title: "Game Console", price: 180, location: "TTU", time: "2 weeks ago", hoursAgo: 336, category: "Electronics", condition: "For Parts", image: "assets/images/console.jpg" }
];
