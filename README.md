# Find My Food

A platform to share excess food with those in need. This application helps reduce food waste by connecting food donors with people who need food in their local area.

## Features

- Location-based food donation and request system
- Real-time chat between donors and recipients
- Community blog section
- Review and rating system
- User authentication and profile management
- Mobile responsive design
- Real-time notifications

## Tech Stack

### Frontend
- Next.js
- TailwindCSS
- Socket.io Client
- Leaflet Maps
- Framer Motion for animations
- React Hot Toast for notifications

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- Socket.io for real-time communication
- JWT for authentication
- Multer for file uploads

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/find-my-food.git
cd find-my-food
```

2. Install dependencies for all packages:
```bash
npm run install:all
```

3. Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/find-my-food
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRE=7d
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

4. Create a `.env.local` file in the frontend directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

## Development

Run both frontend and backend in development mode:
```bash
npm run dev
```

Or run them separately:
```bash
# Run frontend only
npm run frontend

# Run backend only
npm run backend
```

The frontend will be available at http://localhost:3000
The backend API will be available at http://localhost:5000

## API Documentation

### Authentication
- POST `/api/v1/auth/register` - Register a new user
- POST `/api/v1/auth/login` - Login user
- GET `/api/v1/auth/me` - Get current user
- PUT `/api/v1/auth/updatedetails` - Update user details
- PUT `/api/v1/auth/updatepassword` - Update password

### Food Posts
- GET `/api/v1/food-posts` - Get all food posts (with location filtering)
- GET `/api/v1/food-posts/:id` - Get single food post
- POST `/api/v1/food-posts` - Create food post
- PUT `/api/v1/food-posts/:id` - Update food post
- DELETE `/api/v1/food-posts/:id` - Delete food post
- PUT `/api/v1/food-posts/:id/assign` - Assign food post to user

### Blog Posts
- GET `/api/v1/blogs` - Get all blog posts
- GET `/api/v1/blogs/:id` - Get single blog post
- POST `/api/v1/blogs` - Create blog post
- PUT `/api/v1/blogs/:id` - Update blog post
- DELETE `/api/v1/blogs/:id` - Delete blog post
- POST `/api/v1/blogs/:id/comments` - Add comment to blog
- PUT `/api/v1/blogs/:id/like` - Like/unlike blog post

### Reviews
- GET `/api/v1/reviews` - Get all reviews
- GET `/api/v1/reviews/:id` - Get single review
- POST `/api/v1/food-posts/:foodPostId/reviews` - Create review
- PUT `/api/v1/reviews/:id` - Update review
- DELETE `/api/v1/reviews/:id` - Delete review

### Chat
- GET `/api/v1/chats` - Get all chats for user
- GET `/api/v1/chats/:id` - Get single chat
- POST `/api/v1/chats` - Create new chat
- POST `/api/v1/chats/:id/messages` - Send message in chat
- PUT `/api/v1/chats/:id/read` - Mark messages as read

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License. 