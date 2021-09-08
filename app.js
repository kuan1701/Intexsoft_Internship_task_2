const express = require("express");
const app = express();
const hbs = require('express-handlebars');
const pool = require('./config/db.config');
const port = 3000;

// set up public files
app.use(express.static('/Intexsoft_Internship_task_2/public'));

// set up templates engine
app.engine('hbs', hbs({
  helpers: {
    isEmpty: function (locale_book_name) {
      if (locale_book_name == "") {
        return true
      }
    },
  },
  layoutsDir: __dirname + '/views',
  defaultLayout: 'main',
  extname: '.hbs'
}));

// set up view engine
app.set("view engine", "hbs");

// для обработки данных в формате json
app.use(express.json());

// для обработки данных в URL-адресах
app.use(express.urlencoded({
  extended: true
}))

/**
 * Book routes
 */
// получение списка книг
app.get("/bookList", pool.getBooks);

// возвращаем форму для добавления данных
app.get("/create", pool.createBookForm);

// получаем отправленные данные и добавляем их в БД 
app.post("/create", pool.createBook);

// получем id редактируемого пользователя, получаем его из бд и отправлям с формой редактирования
app.get("/edit/:book_id", pool.editCustomerInfoForm);

// получаем отредактированные данные и отправляем их в БД
app.post("/edit/:book_id", pool.editCustomer);

// получаем id удаляемого пользователя и удаляем его из бд
app.post("/delete/:book_id", pool.deleteCustomer);

/**
 * Localized book title routes
 */
// получение списка локализованных названии книг
app.get("/", pool.getLocalizedBookTitles);

// возвращаем форму для добавления данных
app.get("/createLocalizedTitle", pool.createLocalizedBookTitleForm);

// получаем отправленные данные и добавляем их в БД 
app.post("/createLocalizedTitle", pool.createLocalizedBookTitle);

// получем id редактируемого локализованного названия книги, получаем его из бд и отправлям с формой редактирования
app.get("/editLocalizedTitle/:locale_id", pool.editLocalizedTitleInfoForm);

// получаем отредактированные данные и отправляем их в БД
app.post("/editLocalizedTitle/:locale_id", pool.editLocalizedTitle);

// получаем id удаляемого локализованного названия книги и удаляем его из бд
app.post("/deleteLocalizedTitle/:locale_id", pool.deleteLocalizedBookTitle);

//сортируем локализованные названия книг по языку
app.get("/sortLocalizedTitles", pool.sortLocalizedBook);

// set up port
app.listen(port, function () {
  console.log(`App running on port ${port}`);
});