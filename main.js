const express = require('express');
const mongoose = require('mongoose');
const { seedDatabase } = require('./db/seed-database');
const booksController = require('./controllers/books-route');
const app = express();
const PORT = 3000;

mongoose.connect('mongodb://root:root@mongo:27017/testdb?authSource=admin', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', () =>{
    console.log("Проблема с подключением к MongoDB")

});
db.once('open', () => {
  console.log('Подключение к MongoDB установлено!');
  seedDatabase();
});

app.use("/books", booksController)

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});