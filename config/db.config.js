const Pool = require('pg').Pool;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'books',
    password: 'Vwpassatb5.5',
    port: '5432'
});

// получение списка пользователей
const getCustomers = (req, res) => {
    const query = "SELECT * FROM book";

    pool.query(query, function(err, data) {
        if(err) return console.log(err);
        res.render("index.hbs", {
            books: data
        });
      });
}

// возвращаем форму для добавления данных
const createCustomerForm = (req, res) => {
    res.render("create.hbs");
}

// получаем отправленные данные и добавляем их в БД 
const createCustomer = (req, res) => {
    const query = "INSERT INTO book (book_name, book_lenght) VALUES ($1, $2)";

    if(!req.body) return res.sendStatus(400);
    const book_name = req.body.book_name;
    const book_lenght = req.body.book_lenght;
    pool.query(query, [book_name, book_lenght], function(err, data) {
      if(err) return console.log(err);
      res.redirect("/");
    });
}

// получем id редактируемого пользователя, получаем его из бд и отправлям с формой редактирования
const editCustomerInfoForm = (res, req) => {
    const query = "SELECT * FROM book WHERE book_id = $1";

    const book_id = req.params.book_id;
    pool.query(query, [book_id], function(err, data) {
    if(err) return console.log(err);
    res.render("edit.hbs", {
        book: data[0]
    });
  });
}

// получаем отредактированные данные и отправляем их в БД
const editCustomer = (res, req) => {
    if(!req.body) return res.sendStatus(400);
    const book_name = req.body.book_name;
    const book_lenght = req.body.book_lenght;
    const book_id = req.body.book_id;
    const query = "UPDATE book SET book_name = $1, book_lenght = $2 WHERE book_id = $3";

    pool.query(query, [book_name, book_lenght, book_id], function(err, data) {
    if(err) return console.log(err);
    res.redirect("/");
  });
}

// получаем id удаляемого пользователя и удаляем его из бд
const deleteCustomer = (res, req) => {
    const book_id = req.params.book_id;
    const query = "DELETE FROM book WHERE book_id = $1";

    pool.query(query, [book_id], function(err, data) {
    if(err) return console.log(err);
    res.redirect("/");
  });
}

module.exports = {
    pool,
    getCustomers,
    createCustomerForm,
    createCustomer,
    editCustomerInfoForm,
    editCustomer,
    deleteCustomer
};