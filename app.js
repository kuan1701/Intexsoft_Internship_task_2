const express = require("express");
const app = express();
const pool = require('./config/db.config');
const port = 3000;

// set up view engine
app.set("view engine", "hbs");

// set up public files
app.use(express.static('public'));

app.use(express.json());
app.use(express.urlencoded({extended: true}))

/**
 * Book
 */
// получение списка книг
app.get("/bookList", pool.getBooks);

//app.get("/", pool.sortLocalizedBook);

// возвращаем форму для добавления данных
app.get("/create", pool.createBookForm);

// получаем отправленные данные и добавляем их в БД 
app.post("/create", pool.createBook);

// получем id редактируемого пользователя, получаем его из бд и отправлям с формой редактирования
app.get("/edit/:id", pool.editCustomerInfoForm);

// получаем отредактированные данные и отправляем их в БД
app.post("/edit", pool.editCustomer);

// получаем id удаляемого пользователя и удаляем его из бд
app.post("/delete/:id", pool.deleteCustomer);

/**
 * Localized book title
 */
// получение списка локализованных названии книг
app.get("/", pool.getLocalizedBookTitles);

// возвращаем форму для добавления данных
app.get("/createLocalizedTitle", pool.createLocalizedBookTitleForm);

// получаем отправленные данные и добавляем их в БД 
app.post("/createLocalizedTitle", pool.createLocalizedBookTitle);

// получем id редактируемого локализованного названия книги, получаем его из бд и отправлям с формой редактирования
app.get("/editLocalizedTitle/:id", pool.editLocalizedTitleInfoForm);

// получаем отредактированные данные и отправляем их в БД
app.post("/editLocalizedTitle", pool.editLocalizedTitle);

// получаем id удаляемого локализованного названия книги и удаляем его из бд
app.post("/deleteLocalizedTitle/:id", pool.deleteLocalizedBookTitle);

app.listen(port, function(){
  console.log(`App running on port ${port}`);
});
