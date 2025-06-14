# Social Media Platform API
This project aims to build a secure API for a social media platform, focusing on authentication and core social media functionalities. It implements secure APIs with authentication features for a social media platform.

# Features
- User authentication (signup, login, logout) using JWT and Argon2.
- User profile management (view, update, delete).
- Post management (create, update, delete, view all, view by user, view single).
- Comment management (create, view by post, delete).
- Like functionality for posts (add, remove).
- Middleware for user authentication and ID extraction from tokens.
- Structured API responses.

# Models
- User 
{
  id,
  username,
  email,
  password,
  createdAt,
  updatedAt
}

- Post 
{
  id,
  title,
  content,
  authorId,    Reference to User who made the post
  likes,
  comments,    Reference to the comments model
  createdAt,
  updatedAt
}

- Comment  
{
  id,
  content,
  authorId,    Reference to User who wrote the comment
  postId,      Reference to Post which has the comment
  createdAt,
  updatedAt
}

## API Endpoints
# Authentication 
Method	    URL (Route)	         Action
POST	  /api/auth/signup	   Create Account
POST	  /api/auth/login	   User Login
POST	  /api/auth/logout	   User Logout

# User Management 
Method	    URL (Route)	         Action
GET	       /api/users/me	  View User Information
PUT	       /api/users/me	  Update User Data
DELETE	   /api/users/me	  Delete User Account (Deleting a user account should also delete all associated posts and comments)
PUT	       /api/reset	      Delete all user's posts and comments while keeping the user account

# Post & Comment Management 
Method	    URL (Route)	               Action
POST	    /api/posts	              Create Post
PUT     	/api/posts/:id	          Update Post
DELETE  	/api/posts/:id	          Delete Post (Deleting a post should also delete all associated comments).
GET	        /api/posts/me	          View User's Posts
GET     	/api/posts	              View All Posts (with pagination)
GET	        /api/posts/:id	          View Post Information
POST    	/api/comments	          Create Comment on a Specific Post
GET	        /api/comments/:postid	  View Post Comments
DELETE  	/api/comments/:id	      Delete Comment
POST	    /api/likes/:postId	      Add Like to a Post
DELETE	    /api/likes/:postId	      Remove Like from a Post
DELETE	    /api/posts	              Delete All Posts by the User

## Note: When deleting or modifying a post or comment, it's crucial to verify that the user performing the action is the author of the post or comment, by comparing the authorId with the user's ID obtained from the token.

# Setup 
- Install dependencies:  npm install
- Create a .env file in the root directory and add your JWT_SECRET_KEY and any other necessary environment variables (database connection string).
PORT=5000
MONGOURL="mongodb://localhost:27017/social-media-platform"
JWT_SECRET_KEY="87663c56ebf553ef0293f079323ce85edf5af1ace5436e508e93e7a47d0fc009"

- Start the development server: npm run watch