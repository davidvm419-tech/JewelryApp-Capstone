# Geraldine Jewels

This is a modern **Single Page Application (SPA)** built for CS50W’s *Capstone* and designed for my friend Geraldine’s upcoming jewelry business.

---

## Distinctiveness and Complexity

**Geraldine Jewels** represents a significant leap in technical complexity compared to the previous course projects. While it functions as an e-commerce platform, its architecture is fundamentally different from Project 2 (Commerce) or the older Pizza project.

### Technical Architecture & "Headless" Django
Unlike previous projects that relied on **Django Templates** and server-side rendering, this application utilizes a **decoupled architecture**. I built the backend as a **RESTful API** using "vanilla" Django, which serves as the single source of truth and handles a robust database schema consisting of 10 distinct models. These models manage the complex relationships between users, products, ratings, comments, jewelry categories, persistent shopping carts, wishlists, and order histories. This relational depth allows for features like stock tracking and detailed user-activity. The frontend is a sophisticated **React** application that consumes this API independently. This separation of concerns is a new approach not explored in previous projects. Nevertheless, to ensure strict data integrity during the checkout process, the backend utilizes Django's `transaction.atomic` and `select_for_update`. This prevents race conditions during high-traffic purchases, ensuring accurate and secure stock updates. This level of database control marks a clear advancement over previous assignments.

### Advanced State Management
The complexity of the project is demonstrated through its **asynchronous state management**. Every user interaction—including managing a persistent shopping cart, toggling a wishlist, or updating account security—is handled via the JavaScript **Fetch API**. I implemented custom React logic to ensure the UI updates in real-time without ever reloading the browser, providing a seamless user experience.

### Expanded Functionality & User Security
The feature set goes far beyond the requirements of the "Commerce" assignment:
*  **Administrative Control:** The shop is managed through a customized Django Admin interface, allowing for full CRUD operations and media management for products. I implemented image handling using **Pillow**, with all product media stored and served via Django's media folder.
*  **Dynamic UI Feedback:** Users can move items between a wishlist and a shopping cart with immediate, no-refresh UI updates.
*  **CRUD Feedback Loop:** A full system for product ratings and comments where users can Create, Read, Update, and Delete their own data.
*  **Account Security:** High-security features including real-time password complexity validation on the frontend and session-safe updates using Django’s `update_session_auth_hash` on the backend.
*  **Mobile-First Design:** I moved away from standard Bootstrap grids to implement a fully custom, mobile-responsive design using **Tailwind CSS**, ensuring the shop is accessible on any device.

## Additional Information
This project utilizes **Tailwind CSS** for its utility-first styling approach, allowing for a highly customized and responsive UI. All authentication flows are secured using Django's built-in hashing and session management, bridged to the React frontend via secure Fetch calls.

---

## File Documentation

### Backend

*   **`backend/store/views.py`**: Contains all RESTful API endpoints. These views return `JsonResponse` instead of rendering HTML templates, allowing the React frontend to consume data asynchronously.
*   **`backend/store/models.py`**: Defines the 10 relational models used for the database schema, including Users, Products, Categories, Images, Ratings, Comments, Shopping Carts, Orders, and Order Items.
*   **`backend/store/urls.py`**: Contains the routing for each API endpoint, including the catalog, product details, comments, cart, wishlist, and order history.
*   **`backend/store/admin.py`**: Configures the models within the Django Admin interface, allowing administrators to manage store products, inventory, and user data.
*   **`backend/store/helpers.py`**: Contains a reusable helper function to provide consistent pagination for different parts of the React UI.
*   **`backend/config/settings.py`**: Contains the core project configuration, including the connection settings for the React frontend, CORS permissions, and localized timezone settings.

### Frontend Components (`frontend/src/`)

*   **`App.jsx`**: Contains the primary logic of the application and the router to direct users to specific paths and pass props to the various components.
*   **`App.css`**: Contains the entry point for Tailwind CSS integration and custom CSS styling for the login and register components.


### Frontend Components (`frontend/src/components/`)

#### **General Folder**
*   **`footer.jsx`**: Renders the global site footer containing the brand information.
*   **`landingPage.jsx`**: The main entry point for the application, featuring dynamic images of the first six products from the catalog.
*   **`loading.jsx`**: A reusable spinner component displayed during asynchronous data fetching from the Django API.
*   **`login.jsx`**: Manages user authentication and communicates with the backend to establish a secure session.
*   **`navbar.jsx`**: A navigation hub for categories and user information, including the shopping cart, wishlist, settings, and logout. If the user is not logged in, it displays the login or register buttons.
*   **`register.jsx`**: Contains the form for new user creation, featuring real-time frontend validation for passwords.

#### **ProductDetail Folder**
*   **`productButtons.jsx`**: Contains the interactive logic for adding and deleting products from the shopping cart.
*   **`productComments.jsx`**: Manages the logic for displaying, adding, updating, and deleting user comments.
*   **`productDetails.jsx`**: Displays specific jewelry information, including pricing, descriptions, images, ratings, and comments.
*   **`productImages.jsx`**: Handles the rendering of product media served from the Django `media` directory.
*   **`productRatings.jsx`**: Contains the logic for displaying, adding, and updating user ratings.

#### **Products Folder**
*   **`catalog.jsx`**: Fetches and displays the full collection of jewelry available in the store.
*   **`categories.jsx`**: Provides a filtering interface to allow users to browse products by specific jewelry categories.
*   **`pagination.jsx`**: A functional component that navigates through product pages by passing page parameters from its parent component.
*   **`wishlistHeart.jsx`**: Contains the logic to add or delete products from the user's wishlist.

#### **User Folder**
*   **`profileBox.jsx`**: Contains the logic for the profile box displayed within the navigation bar.
*   **`shoppingCart.jsx`**: A real-time interface for managing items intended for purchase, calculating prices, and managing quantities.
*   **`userOrders.jsx`**: Displays a history of the user's past purchases, fetched asynchronously from the backend.
*   **`userSettings.jsx`**: Acts as the hub for account management, containing forms for updating personal details, email, and password.
*   **`wishlist.jsx`**: A dedicated page for users to view, manage, delete, and move saved jewelry items into their shopping cart.

---

### Requirements.txt
*   **`requirements.txt`**: Lists all Python dependencies, including Django, Pillow, and any additional libraries used.

---

## How to Run the Application

To successfully run **Geraldine Jewels**, you will need to set up both the Django REST API (Backend) and the React SPA (Frontend).

### 1. Prerequisites
Ensure you have the following installed on your system:
* **Python 3.x** (with `pip`)
* **Node.js** (v16 or higher) and **npm**

---

### 2. Backend Setup (Django API)

1.  **Navigate to the backend directory**:
    ```bash
    cd backend
    ```
2.  **Install Python dependencies**:
    This includes Django for the API and Pillow for jewelry image processing.
    ```bash
    pip install -r requirements.txt
    ```
3.  **Database Migrations**:
    Apply the migrations to create the 10 relational models in your local SQLite database.
    ```bash
    python manage.py makemigrations
    python manage.py migrate
    ```
4.  **Create an Admin User**:
    To manage the jewelry inventory, categories, and orders from the dashboard.
    ```bash
    python manage.py createsuperuser
    ```
5.  **Start the Django Server**:
    ```bash
    python manage.py runserver
    ```
    
---

### 3. Frontend Setup (React SPA)

1.  **Open a new terminal and navigate to the frontend directory**:
    ```bash
    cd frontend
    ```
2.  **Install Node dependencies**:
    This will install the core React library along with **React Router** for navigation, **Tailwind CSS** for styling, and **Heroicons** for the UI.
    ```bash
    npm install
    ```
3.  **Start the Development Server**:
    App was created via Vite:
    ```bash
    npm run dev
    ```
4.  **Access the Application**:
    Open your browser to the address provided in your terminal.

---

## Features

### 🎨 User Interface & Experience
*   **Dynamic Landing Page:** A polished welcome screen with custom branding and a "call-to-action" that transitions users into the product catalog.
*   **Interactive Jewelry Catalog:** A responsive grid of products featuring real-time data for prices and names.
*   **Mobile-First Design:** Developed with **Tailwind CSS**, ensuring a seamless shopping experience across all device sizes (Mobile, Tablet, and Desktop).

### 💎 Product Discovery & Social Feedback
*   **Category Filtering:** Real-time navigation allowing users to browse specific jewelry types (Rings, Necklaces, etc.) without page reloads.
*   **Rich Product Details:** Deep-dive views for every item, showcasing galleries (via **Pillow**), materials, and descriptions.
*   **Community Ratings & Reviews:** A complete **CRUD system** for feedback. Authenticated users can leave 1–5 star ratings and write comments. Users also have the ability to edit or delete their own previous comments and update their ratings.

### 🛒 Advanced Commerce & Inventory
*   **Persistent Wishlist:** Users can save items to a personalized wishlist. The state is synchronized with the Django backend, allowing users to move items directly from their wishlist to their cart.
*   **Live Shopping Cart:** Full-featured cart management where users can adjust quantities and view real-time price calculations before checkout.
*   **Order History:** A dedicated dashboard for authenticated users to track their past purchases, organized by date with order ID and product details.
*   **Inventory Integrity:** Implements `transaction.atomic` and `select_for_update` during the purchase flow to ensure stock levels are updated accurately and race conditions are prevented.

### 🔐 Account Security & Management
*   **SPA Settings Hub:** A secure, unified dashboard for updating personal information, email, and password.
*   **Real-time Validation:** Instant frontend feedback for password complexity (minimum 8 characters + 1 digit) and confirmation matching.
*   **Session Persistence:** Utilizes `update_session_auth_hash` to ensure users remain securely logged in after updating sensitive credentials.

### 🛠️ Administrative Control
*   **Custom Django Admin Suite:** A robust backend dashboard for the store owner to manage the entire lifecycle of the shop, including:
    *   Full CRUD for products, categories, and pricing.
    *   Inventory and stock quantity tracking.
    *   Management of user-generated content (comments and ratings).
    *   Direct media management for product image uploads.

---

Feel free to explore the code or test the application and thank you to Geraldine and CS50 for making this project possible

