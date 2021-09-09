const Pool = require('pg').Pool;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'books',
  password: 'Vwpassatb5.5',
  port: '5432'
});

//сортируем локализованные названия книг по языку
const LANG_PLACEHOLDER = "{l_language_id}";

const sortQuery2 = "SELECT" + 
" COALESCE(locale.locale_book_name, book.book_name) AS title" 
+ " FROM book" 
+ " JOIN language ON language.language_id IS NOT NULL"
+ " LEFT JOIN locale ON locale.l_book_id = book.book_id"
+ " AND locale.l_language_id = language.language_id"
+ " WHERE language.language_id = "+ LANG_PLACEHOLDER
+ " ORDER BY book.book_id";

const sortQuery = "SELECT * FROM book" 
  + " LEFT JOIN locale ON book_id = l_book_id" 
  + " LEFT JOIN language ON language_id = l_language_id" 
  + " WHERE l_language_id = " + LANG_PLACEHOLDER;
const sortLocalizedBook = (req, res) => {

  const l_language_id = req.query.l_language_id;
  // console.log(l_language_id);
  pool.query(sortQuery2.replace(LANG_PLACEHOLDER, l_language_id),
     function(err, data) {
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
const getBooksQuery = "SELECT * FROM book";
const getBooks = (req, res) => {
  pool.query(getBooksQuery, function (err, data) {
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
const insertBookQuery = "INSERT INTO book (book_name, book_length) VALUES ($1, $2)";
const createBook = (req, res) => {
  if (!req.body) return res.sendStatus(400);
  const book_name = req.body.book_name;
  const book_length = req.body.book_length;
  pool.query(insertBookQuery, [book_name, book_length], function (err, data) {
    if (err) return console.log(err);
    res.redirect("/bookList");
  });
}

// получаем id редактируемой книги, получаем его из бд и отправлям с формой редактирования
const getEditqBookQuery = "SELECT * FROM book WHERE book_id = $1";
const editCustomerInfoForm = (req, res) => {
  const book_id = req.params.book_id;
  pool.query(getEditqBookQuery, [book_id], function (err, data) {
    if (err) return console.log(err);
    res.render("edit.hbs", {
      bookList: data.rows[0]
    });
  });
}

// получаем отредактированные данные и отправляем их в БД
const postEditBookQuery = "UPDATE book SET book_name = $1, book_length = $2 WHERE book_id = $3";
const editCustomer = (req, res) => {
  if (!req.body) return res.sendStatus(400);
  const book_name = req.body.book_name;
  const book_length = req.body.book_length;
  const book_id = req.query.book_id;

  console.log(book_id)

  pool.query(postEditBookQuery, [book_name, book_length, book_id], function (err, data) {
    if (err) return console.log(err);
    res.redirect("/bookList");
  });
}

// получаем id удаляемой книги и удаляем его из бд
const deleteBookQuery = "DELETE FROM book WHERE book_id = $1";
const deleteCustomer = (req, res) => {
  const book_id = req.params.book_id;
  pool.query(deleteBookQuery, [book_id], function (err, data) {
    if (err) return console.log(err);
    res.redirect("/bookList");
  });
}

/**
 * Localized book title methods
 */
// получение списка локализованных названий книг
const getLocalizedBookTitle = "SELECT * FROM book"
  + " LEFT JOIN locale ON book_id = l_book_id"
  + " LEFT JOIN language ON language_id = l_language_id"
  + " WHERE l_language_id = l_language_id ORDER BY locale_id;";
const getLocalizedBookTitles = (req, res) => {
  pool.query(getLocalizedBookTitle, function (err, result) {
    console.log(result)
    if (err) return console.log(err);
    res.render("index.hbs", {
      localeBookList: result.rows
    });
  });
}

// возвращаем форму для добавления данных
const getBooksQueryLocale = "SELECT * FROM book";
const createLocalizedBookTitleForm = (req, res) => {
  pool.query(getBooksQueryLocale, function (err, data) {
    console.log(data)
    if (err) return console.log(err);
    res.render("createLocalizedTitle.hbs", {
      bookList: data.rows
    });
  });
}

// получаем отправленные данные и добавляем их в БД 
const insertLocaleBookQuery = "INSERT INTO locale (locale_book_name, l_language_id, l_book_id) VALUES ($1, $2, $3)";
const createLocalizedBookTitle = (req, res) => {
  if (!req.body) return res.sendStatus(400);
  const locale_book_name = req.body.locale_book_name;
  const language_id = req.body.l_language_id;
  const book_id = req.body.l_book_id;
  pool.query(insertLocaleBookQuery, [locale_book_name, language_id, book_id], function (err, data) {
    if (err) return console.log(err);
    res.redirect("/");
  });
}

// получаем id редактируемой книги, получаем его из бд и отправлям с формой редактирования
const editLocalizedBookTitleQuery = "SELECT * FROM locale WHERE locale_id = $1";
const editLocalizedTitleInfoForm = (req, res) => {
  const locale_id = req.params.locale_id;
  pool.query(editLocalizedBookTitleQuery, [locale_id], function (err, data) {
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
const updateLocalizedBookTitleQuery = "UPDATE locale SET locale_book_name = $1, language_id = $2, book_id = $3 WHERE locale_id = $4";
const editLocalizedTitle = (req, res) => {
  if (!req.body) return res.sendStatus(400);
  const locale_book_name = req.body.locale_book_name;
  const language_id = req.body.language_id;
  const book_id = req.body.book_id;
  const locale_id = req.params.locale_id;
  pool.query(updateLocalizedBookTitleQuery, [locale_book_name, language_id, book_id, locale_id], function (err, data) {
    if (err) return console.log(err);
    res.redirect("/");
  });
}

// получаем id удаляемого локализованного названия книги и удаляем его из бд
const deleteLocalizedBookTitleQuery = "DELETE FROM locale WHERE locale_id = $1";
const deleteLocalizedBookTitle = (req, res) => {
  const locale_id = req.params.locale_id;
  pool.query(deleteLocalizedBookTitleQuery, [locale_id], function (err, data) {
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