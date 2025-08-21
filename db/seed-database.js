const Author = require("../models/Author");
const Book = require("../models/Book");
const { authors, books } = require("./mock");

async function seedDatabase() {
  try {
    const authorCount = await Author.countDocuments();
    const bookCount = await Book.countDocuments();

    if (authorCount === 0 && bookCount === 0) {
      console.log('Начинаем заполнение базы данных...');

      const savedAuthors = await Author.insertMany(authors);
      console.log(`Добавлено ${savedAuthors.length} авторов`);
      const booksConnected = books.map((book) => {
        try {
          return { ...book, author: savedAuthors.find(author => author.name === book.author)._id };
        } catch (err) {
          console.error(`Не удалось найти автора "${book.author}"`);
          return null;
        }
      })
      const savedBooks = await Book.insertMany(booksConnected);
      console.log(`Добавлено ${savedBooks.length} книг`);
    } else {
      console.log('Все данные уже загружены в базу данных');
    }
  } catch (err) {
    console.error('Не удалось добавить данные', err);
  }
}
module.exports = {
    seedDatabase
}
