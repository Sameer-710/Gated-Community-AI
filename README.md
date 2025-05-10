# Gated Community AI Application

## Project Structure

```
gated_community_ai/
├── backend/
│   ├── controllers/       # Business logic
│   ├── middleware/ 
│   │   ├── authMiddleware.js      # Custom middleware functions
│   ├── models/           # Database models
│   │   ├── Application.js
│   │   ├── Message.js
│   │   ├── Skill.js
│   │   └── User.js
│   ├── routes/           # API route definitions
│   │   ├── authRoutes.js
│   │   ├── messageRoutes.js
│   │   ├── skillRoutes.js
│   │   └── userRoutes.js
│   ├── .env              # Environment variables
│   ├── listModels.js     # AI model utilities
│   └── server.js         # Main server file
│
├── frontend/
│   ├── public/           # Static files
│   │   ├── index.html
│   │   └── assets/       # Images, fonts, etc.
│   ├── src/
│   │   ├── components/   
│   │   ├── pages/
|   |   |   ├── chat/
|   |   |   |   ├── Chat.css
|   |   |   |   └── Chat.js
|   |   |   ├── dashboard/
|   |   |   |   ├── Dashboard.css
|   |   |   |   └── Dashboard.js
|   |   |   ├── login/
|   |   |   |   ├── Login.css
|   |   |   |   └── Login.js
|   |   |   ├── register/
|   |   |   |   ├── Register.css
|   |   |   |   └── Register.js
|   |   |   ├── SkillDetection/
|   |   |   |   ├── SkillDetection.css
|   |   |   |   └── SkillDetection.js
|   |   |   ├── SkillMatching/
|   |   |   |   ├── SkillMatching.css
|   |   |   |   └── SkillMatching.js
|   |   |   └── SkillValidation/
|   |   |       ├── SkillValidation.css
|   |   |       └── SkillValidation.js
|   |   |   
│   │   ├── services/     
│   │   ├── utils/        
│   │   ├── App.js        
│   │   └── index.js     
│   └── package.json     
│
├── .gitignore           
├── package.json         
└── README.md          
```

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install root dependencies
   npm install
   
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. Configure environment variables:
   - Copy `.env.example` to `.env` in the backend directory
   - Update the variables with your configuration

4. Start the development servers:
   ```bash
   # Start backend server
   cd backend
   npm start
   
   # Start frontend development server
   cd ../frontend
   npm start
   ```

## Features

- User Authentication
- Skill Detection
- Skill Matching
- Skill Validation
- Real-time Chat
- Application Management

## Technology Stack

- Frontend: React.js
- Backend: Node.js, Express.js
- Database: MongoDB
- Real-time Communication: Socket.IO
- AI Integration: Google Gemini