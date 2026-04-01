🎬 Entertainment App

A full-stack entertainment platform that allows users to explore, search, and bookmark their favorite movies and TV series. The app provides a seamless and visually engaging experience powered by modern web technologies and real-time API data.

🚀 Features
🔐 User Authentication
Secure Sign Up & Login system
Persistent user sessions
Optional profile image upload
🏠 Home Page
Displays trending and latest movies & TV series
Clean grid-based responsive layout
🔍 Search Functionality
Search for movies and TV series in real-time
🎥 Movies Page
Browse a wide range of movies
View detailed movie information
📺 TV Series Page
Explore popular and trending TV shows
Dedicated detailed pages for each series
🔖 Bookmarks
Save favorite movies and TV series
Easily add/remove bookmarks
Personalized content library
📱 Responsive Design
Fully optimized for mobile, tablet, and desktop
🛠 Tech Stack

Frontend:

React
Redux Toolkit
Tailwind CSS

Backend:

Node.js
Express.js

Database:

MongoDB

API:

TMDB API (for movies & TV series data)
📂 Project Structure
/client    → Frontend (React)
/server    → Backend (Node.js + Express)
/models    → Database schemas
/routes    → API routes
/controllers → Business logic
⚙️ Getting Started
Prerequisites
Node.js installed
MongoDB Atlas account
TMDB API Key
Installation
1. Clone the repository
git clone <your-repo-url>
cd entertainment-app
2. Setup Backend
cd server
npm install

Create a .env file:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
TMDB_API_KEY=your_tmdb_api_key

Run backend:

npm run dev
3. Setup Frontend
cd ../client
npm install
npm run dev
🌐 Application URL

👉 http://localhost:5173

📊 Core Functionalities
Discover trending and latest entertainment content
Search movies and TV shows instantly
View detailed information for each item
Bookmark and manage favorite content
Secure authentication and personalized experience
📌 Best Practices Implemented
Clean and modular folder structure
RESTful API design
Environment variable configuration
Secure authentication using JWT
Efficient state management with Redux Toolkit
Reusable UI components
Error handling and validation
Responsive UI design
Separation of concerns (MVC pattern)
API integration with proper loading states
📈 Future Enhancements
🎞 Watch trailers inside the app
⭐ Ratings and reviews system
🔔 Notifications for new releases
🌍 Multi-language support
📜 License

This project is licensed under the MIT License.


📜 License

This project is licensed under the MIT License.
