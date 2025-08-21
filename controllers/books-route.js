const express = require('express');
const Book = require('../models/Book');
const router = express.Router();
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5; 
    const skip = (page - 1) * limit;

    const totalBooks = await Book.countDocuments();

    const books = await Book.find()
      .populate('author', 'name')
      .skip(skip)
      .limit(limit);

    const booksFormat = books.map(book => ({
      id: book._id,
      title: book.title,
      author: book.author?.name || null,
    }));

    const totalPages = Math.ceil(totalBooks / limit);

    res.json({
      books: booksFormat,
      pagesCount: totalPages,
      totalCount: totalBooks,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;