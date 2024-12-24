const express = require("express");
const jwt = require("jsonwebtoken");
const { hashPassword, verifyPassword } = require("../auth/hashPaassword");
const authenticate = require("../auth/authenticate");
const Book = require("../models/book");
const User = require("../models/user");

const router = express.Router();

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     description: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: User already exists
 *       500:
 *         description: Internal server error
 */
//user signup
router.post("/auth/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "user already exists" });
    const hashedPassword = await hashPassword(password);
    const newUser = new User({ email, password: hashedPassword });
    newUser.save();
    res.status(201).json({ message: "User registered succesfully!" });
  } catch (e) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: e.message });
  }
});

/**
 * @swagger
 * /auth/signin:
 *   post:
 *     description: User sign-in and token generation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully signed in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       400:
 *         description: Invalid credentials or user not found
 *       500:
 *         description: Internal server error
 */
//user signin and token generation
router.post("/auth/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found!" });

    const validPassword = await verifyPassword(password, user.password);
    if (!validPassword)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.SEC_KEY, {
      expiresIn: "10h",
    });
    console.log(token);
    res.status(200).json({ token });
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/**
 * @swagger
 * /books:
 *   get:
 *     description: Get all books
 *     security:
 *       - bearerAuth: []   # This is where the token requirement is defined
 *     responses:
 *       200:
 *         description: List of books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   title:
 *                     type: string
 *                   author:
 *                     type: string
 *                   price:
 *                     type: number
 *                   description:
 *                     type: string
 *       401:
 *         description: Unauthorized, invalid token
 *       500:
 *         description: Internal server error
 */
//get all books
router.get("/books/", authenticate, async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (e) {
    res.status(500).json({ message: "Internal server Error" });
  }
});

/**
 * @swagger
 * /books/{id}:
 *   get:
 *     description: Get a single book by its ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The book ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: Book not found
 *       401:
 *         description: Unauthorized, invalid token
 *       500:
 *         description: Internal Server Error
 */

//get book by id
router.get("/books/:id", authenticate, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not Found" });
    res.status(200).json(book);
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/**
 * @swagger
 * /books:
 *   post:
 *     description: Add a new book
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Book successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized, invalid token
 *       500:
 *         description: Internal Server Error
 */

//add new book
router.post("/books", authenticate, async (req, res) => {
  try {
    const { title, author, price, description } = req.body;
    const newBook = new Book({ title, author, price, description });
    console.log(`new bokk=${newBook}`);
    await newBook.save();
    res.status(201).json(newBook);
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/**
 * @swagger
 * /books/{id}:
 *   put:
 *     description: Update a book by its ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The book ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Book successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized, invalid token
 *       404:
 *         description: Book not found
 *       500:
 *         description: Internal Server Error
 */

//update book by ID
router.put("/books/:id", authenticate, async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedBook)
      return res.status(404).json({ message: "Book not found!" });
    res.status(200).json(updatedBook);
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error" }, e.error);
  }
});

/**
 * @swagger
 * /books/{id}:
 *   delete:
 *     description: Delete a book by its ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The book ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book successfully deleted
 *       401:
 *         description: Unauthorized, invalid token
 *       404:
 *         description: Book not found
 *       500:
 *         description: Internal Server Error
 */
//delete book
router.delete("/books/:id", authenticate, async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) return res.status(404).json("Book not found!");
    res.status(200).json("Book deleted succesfully!");
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
