Bookstore API

A simple RESTful API to manage a bookstore with user authentication and book management.

Features

- User registration and login (JWT).
- CRUD operations for books:
  ~ View all books.
  ~ View a book by ID.
  ~ Add, update, and delete books.
  ~ Technologies Used

- Technologies used
  ~ Node.js
  ~ Express
  ~ MongoDB
  ~ JWT
  ~ Swagger

API runs at: http://localhost:4000/api.
Swagger API: http://localhost:4000/api-docs

API Endpoints

- POST /auth/signup
  Register a user. Returns 201 on success, 400 if user exists.

- POST /auth/signin
  Login and get a JWT token. Returns 200 with token, 400 for invalid credentials.

- GET /books
  Get all books (requires token). Returns 200 on success, 401 for invalid token.

- GET /books/:id
  Get a book by ID. Returns 200 with book details, 404 if not found.

- POST /books
  Create a new book (requires token). Returns 201 on success.

- PUT /books/:id
  Update a book (requires token). Returns 200 on success, 404 if not found.

- DELETE /books/:id
  Delete a book (requires token). Returns 200 on success, 404 if not found
