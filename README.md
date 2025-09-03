# FecLocWebsite - Gamification Application for Events

Welcome to the **FecLocWebsite** repository! This is a comprehensive web application designed to gamify events on university or corporate campuses. The platform allows users to explore different units, participate in quizzes via QR Codes, accumulate points, and compete for prizes in real-time.

The project includes a robust administration panel for managing all content, users, and contest features.

## ✨ Key Features

### For Users

- **Secure Authentication:** Registration system with CPF (Brazilian individual taxpayer registry) validation and login.
- **Campus Exploration:** View "Units" (stands/locations) with detailed information, including their location on Google Maps.
- **Gamification with Quizzes:**
    - **Integrated QR Code scanner** to access quizzes for each course/stand.
    - Scoring system (`ptsTotais`) that updates after each quiz.
    - Earn **badges** (gold or silver) based on performance.
- **Real-Time Ranking:** A podium page displaying the top 5 players, updated instantly using Firestore.
- **User Profile:** A "My Badges" page to view all achievements.
- **Smart Search:** A search bar with auto-suggestions to easily find courses.
- **Responsive Interface:** Fully adaptive design for a seamless experience on mobile devices.

### For Administrators

- **Secure Admin Panel:** Access is restricted to users with "admin" permissions.
- **User Management:**
    - View all registered users.
    - Functionality to **activate and deactivate** user accounts.
- **Content Management (Full CRUD):**
    - **Units:** Create, edit, and remove units, adding a name, photo URL, Google Maps link, and description.
    - **Courses:** Create courses and associate them with a specific unit.
    - **Quizzes:** Create multiple-choice questions for each course.
- **QR Code Generation:** A tool to generate unique QR Codes for each quiz, ready to be printed and distributed.

## 🚀 Tech Stack

- **Frontend:**
    - **React.js** (with Hooks and Context API for state management)
    - **Material-UI (MUI)** for modern and responsive UI components.
    - **React Router DOM** for navigation.
- **Backend & Infrastructure:**
    - **Firebase:**
        - **Authentication:** For login and registration management.
        - **Firestore:** As a NoSQL database to store all information (users, units, courses, quizzes, badges).
        - **Cloud Functions:** For secure backend operations (e.g., listing all users).
    - **Vercel:**
        - **Hosting:** For deploying the React frontend.
        - **Serverless Functions:** For API endpoints (e.g., setting an admin, activating/deactivating a user).
- **Notable Libraries:**
    - `html5-qrcode`: For the QR Code scanning functionality.
    - `qrcode.react`: For generating QR Codes in the admin panel.

## 🔧 Setup and Local Development

To run this project in your development environment, follow the steps below:

1.  **Clone the Repository**
    ```bash
    git clone [https://www.github.com/emanuel-batista/FecLocWebsite.git](https://www.github.com/emanuel-batista/FecLocWebsite.git)
    cd FecLocWebsite
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Configure Firebase**
    - Create a project on the [Firebase Console](https://console.firebase.google.com/).
    - Enable the **Authentication** (with the Email/Password method) and **Firestore Database** services.
    - Go to Project Settings and copy the credentials for your "Web App".
    - Create a `.env.local` file in the project root and add your credentials:
        ```
        REACT_APP_FIREBASE_API_KEY=YOUR_API_KEY
        REACT_APP_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
        REACT_APP_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
        REACT_APP_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
        REACT_APP_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
        REACT_APP_FIREBASE_APP_ID=YOUR_APP_ID
        ```

4.  **Run the Application**
    ```bash
    npm start
    ```
    The application will be available at `http://localhost:3000`.

## 👑 How to Set the First Administrator

To access the admin panel, your first user needs to be promoted to admin.
1.  Register an account normally through the application.
2.  Follow the instructions in the `setAdmin.js` file in the project root to grant admin permissions to that account.

---
Developed with ❤️ by Emanuel Batista.