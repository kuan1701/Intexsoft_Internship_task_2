const Pool = require('pg').Pool;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'books',
  password: 'Vwpassatb5.5',
  port: '5432'
});

//сортируем локализованные названия книг по языку
const sortLocalizedBook = (req, res) => {
  const query = "SELECT * FROM book" 
  + " LEFT JOIN locale ON book_id = l_book_id" 
  + " LEFT JOIN language ON language_id = l_language_id" 
  + " WHERE l_language_id = $1";
  
  const l_language_id = req.body.l_language_id;
  // console.log(l_language_id);
  pool.query(query, [l_language_id], function(err, data) {
    console.log(data);
    if(err) return console.log(err);
    res.render("index_localized.hbs", {
      localeBookList: data.rows
    })
  })
}

/**
 * Book methods
 */
// получение списка книг
const getBooks = (req, res) => {
  const query = "SELECT * FROM book";

  pool.query(query, function (err, data) {
    console.log(data)
    if (err) return console.log(err);
    res.render("listOfBooks.hbs", {
      bookList: data.rows
    });
  });
}

// возвращаем форму для добавления данных
const createBookForm = (req, res) => {
  res.render("create.hbs");
}

// получаем отправленные данные и добавляем их в БД 
const createBook = (req, res) => {
  const query = "INSERT INTO book (book_name, book_length) VALUES ($1, $2)";

  if (!req.body) return res.sendStatus(400);
  const book_name = req.body.book_name;
  const book_length = req.body.book_length;
  pool.query(query, [book_name, book_length], function (err, data) {
    if (err) return console.log(err);
    res.redirect("/bookList");
  });
}

// получаем id редактируемой книги, получаем его из бд и отправлям с формой редактирования
const editCustomerInfoForm = (req, res) => {
  const query = "SELECT * FROM book WHERE book_id = $1";
  const book_id = req.params.book_id;
  pool.query(query, [book_id], function (err, data) {
    if (err) return console.log(err);
    res.render("edit.hbs", {
      bookList: data.rows[0]
    });
  });
}

// получаем отредактированные данные и отправляем их в БД
const editCustomer = (req, res) => {
  if (!req.body) return res.sendStatus(400);
  const book_name = req.body.book_name;
  const book_length = req.body.book_length;
  const book_id = req.params.book_id;
  const query = "UPDATE book SET book_name = $1, book_length = $2 WHERE book_id = $3";

  console.log(book_id)

  pool.query(query, [book_name, book_length, book_id], function (err, data) {
    if (err) return console.log(err);
    res.redirect("/bookList");
  });
}

// получаем id удаляемой книги и удаляем его из бд
const deleteCustomer = (req, res) => {
  const book_id = req.params.book_id;
  const query = "DELETE FROM book WHERE book_id = $1";

  pool.query(query, [book_id], function (err, data) {
    if (err) return console.log(err);
    res.redirect("/bookList");
  });
}

/**
 * Localized book title methods
 */
// получение списка локализованных названий книг
const getLocalizedBookTitles = (req, res) => {
  const query = "SELECT * FROM book"
  + " LEFT JOIN locale ON book_id = l_book_id"
  + " LEFT JOIN language ON language_id = l_language_id"
  + " WHERE l_language_id = l_language_id ORDER BY locale_id;";

  pool.query(query, function (err, result) {
    console.log(result)
    if (err) return console.log(err);
    res.render("index.hbs", {
      localeBookList: result.rows
    });
  });
}

// возвращаем форму для добавления данных
const createLocalizedBookTitleForm = (req, res) => {
  const query = "SELECT * FROM book";

  pool.query(query, function (err, data) {
    console.log(data)
    if (err) return console.log(err);
    res.render("createLocalizedTitle.hbs", {
      bookList: data.rows
    });
  });
}

// получаем отправленные данные и добавляем их в БД 
const createLocalizedBookTitle = (req, res) => {
  const query = "INSERT INTO locale (locale_book_name, l_language_id, l_book_id) VALUES ($1, $2, $3)";

  if (!req.body) return res.sendStatus(400);
  const locale_book_name = req.body.locale_book_name;
  const language_id = req.body.l_language_id;
  const book_id = req.body.l_book_id;
  pool.query(query, [locale_book_name, language_id, book_id], function (err, data) {
    if (err) return console.log(err);
    res.redirect("/");
  });
}

// получаем id редактируемой книги, получаем его из бд и отправлям с формой редактирования
const editLocalizedTitleInfoForm = (req, res) => {
  const query = "SELECT * FROM locale WHERE locale_id = $1";
  const locale_id = req.params.locale_id;
  pool.query(query, [locale_id], function (err, data) {
    if (err) return console.log(err);
    res.render("editLocalizedTitle.hbs", {
      bookList: data.rows
    });
  });
}

// const editLocalizedTitleInfoForm2 = (req, res) => {
//   const query = "SELECT * FROM book";

//   pool.query(query, function (err, data) {
//     console.log(data)
//     if (err) return console.log(err);
//     res.render("editLocalizedTitle.hbs", {
//       bookList: data.rows
//     });
//   });
// }

// получаем отредактированные данные и отправляем их в БД
const editLocalizedTitle = (req, res) => {
  if (!req.body) return res.sendStatus(400);
  const locale_book_name = req.body.locale_book_name;
  const language_id = req.body.language_id;
  const book_id = req.body.book_id;
  const locale_id = req.params.locale_id;
  const query = "UPDATE locale SET locale_book_name = $1, language_id = $2, book_id = $3 WHERE locale_id = $4";

  pool.query(query, [locale_book_name, language_id, book_id, locale_id], function (err, data) {
    if (err) return console.log(err);
    res.redirect("/");
  });
}

// получаем id удаляемого локализованного названия книги и удаляем его из бд
const deleteLocalizedBookTitle = (req, res) => {
  const locale_id = req.params.locale_id;
  const query = "DELETE FROM locale WHERE locale_id = $1";

  pool.query(query, [locale_id], function (err, data) {
    if (err) return console.log(err);
    res.redirect("/");
  });
}

module.exports = {
  pool,
  getBooks,
  getLocalizedBookTitles,
  createBookForm,
  createBook,
  editCustomerInfoForm,
  editCustomer,
  deleteCustomer,
  createLocalizedBookTitleForm,
  createLocalizedBookTitle,
  editLocalizedTitleInfoForm,
  editLocalizedTitle,
  deleteLocalizedBookTitle,
  sortLocalizedBook
};