# Staysphere

## **Project Overview**

Staysphere is a comprehensive web application designed to facilitate the booking and management of rental properties. The project includes both user and host functionalities, mimicking real-world scenarios such as booking, managing listings, and more. The frontend is built using React.js, while the backend is powered by Node.js and Express, with MongoDB as the database.

---

## **Key Features**

### **User Web App**

- **Authentication:**
  - Register/Login using a secure backend.
- **Browse Listings:**
  - Search and filter by price, location, and type.
  - Detailed listing pages with image galleries and reviews.
- **Favorites:**
  - Add/remove listings from favorites.
- **Booking:**
  - Select dates, calculate prices, and confirm bookings.
- **Manage Bookings:**
  - Interface to view and manage bookings .
  - **Reviews:**
  - Leave and view reviews for listings.
  - **Profile:**
  - User profile management, including profile picture upload and edit profile information.
  - **Notifications:**
  - Receive notifications for new bookings, reviews, and messages.
  - **Payment Gateway Integration:**
  - Secure payment processing for bookings.

### **Host Management Web App**

- **Authentication:**
  - Host-specific register/login.
- **Listings Management:**
  - Add, edit, and delete listings with images, location, price, and description.
- **Booking Requests:**
  - Interface to view incoming booking requests.
- **Profile Management:**
  - Update profile information.

---

## **Tech Stack**

### **Frontend:**

- React.js
- Redux and Context API (for state management)
- React Router (for navigation)
- Material-UI and Antd (for UI components)

### **Backend:**

- Node.js
- Express.js
- MongoDB (with Mongoose for ORM)
- JWT (for authentication)
- Nodemailer (for email notifications)
- Twilio (for verifying)

### **UI/UX:**

- CSS Animations
- Responsive Design Frameworks

---

## **Project Timeline**

### 1: Setup & Authentication\*\*

- Set up the React environment and project repository.
- Create UI wireframes for core pages (Home, Listings, Login, Signup).
- Implement user/host registration and login.
- Set up basic routing with React Router.

### 2: Listings & Search\*\*

- Develop search and filter functionalities for listings.
- Create responsive UI grids for listing cards.
- Design forms for adding and managing listings.
- Implement image upload functionality with persistence.

### 3: Booking & Favorites\*\*

- Build detailed listing pages with image galleries and reviews.
- Implement the booking process and favorites management.
- Provide host functionalities for managing bookings and listings.

### 4: Final Features & Testing\*\*

- Add animations and transitions for a smooth user experience.
- Implement profile management.
- Ensure responsive design and cross-browser compatibility.
- Conduct testing, finalize documentation, and prepare for demo.

---

## **Demo Preparation**

1. **Demo Flow:**
   - Login as user/host.
   - Explore features like search, favorites, bookings, and listings management.
2. **Testing & Feedback:**
   - Conduct comprehensive testing and resolve identified issues.
3. **Documentation:**
   - Include code structure, component descriptions, and deployment steps.

---

## **Installation and Setup**

### **Frontend Setup**

1. Clone the repository:
   ```bash
   git clone https://github.com/SuyashSingh01/Staysphere.git
   ```
2. Navigate to the frontend project directory:
   ```bash
   cd Staysphere/client
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm start
   ```
5. Access the application at [http://localhost:5173/](http://localhost:5173/).

### **Backend Setup**

1. Navigate to the backend project directory:
   ```bash
   cd Staysphere/server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables (e.g., MongoDB URI, JWT secret, etc.).
4. Start the backend server:
   ```bash
   npm run dev
   ```
5. The backend will be running at [http://localhost:4000/](http://localhost:4000/).

---

## **Contributing**

Contributions are welcome! If you'd like to improve this project, please follow these steps:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-branch
   ```
3. Commit your changes:
   ```bash
   git commit -m "Describe changes"
   ```
4. Push to the branch:
   ```bash
   git push origin feature-branch
   ```
5. Submit a pull request.

---

## **License**

This project is licensed under the MIT License. See the LICENSE file for more details.

---

## **Contact**

For any queries or feedback, please contact the project maintainer:

**Name:** Suyash Singh  
**Email:** [singhsuyash045@gmail.com](mailto:singhsuyash045@gmail.com)
