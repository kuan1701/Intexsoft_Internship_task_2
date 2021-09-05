const Pool = require('pg').Pool;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'customers',
    password: 'Vwpassatb5.5',
    port: '5432'
});

// получение списка пользователей
const getCustomers = (req, res) => {
    const query = "SELECT * FROM customer";

    pool.query(query, function(err, data) {
        if(err) return console.log(err);
        res.render("index.hbs", {
            users: data
        });
      });
}

// возвращаем форму для добавления данных
const createCustomerForm = (req, res) => {
    res.render("create.hbs");
}

// получаем отправленные данные и добавляем их в БД 
const createCustomer = (req, res) => {
    const query = "INSERT INTO customer (name, age) VALUES ($1, $2)";

    if(!req.body) return res.sendStatus(400);
    const name = req.body.name;
    const age = req.body.age;
    pool.query(query, [name, age], function(err, data) {
      if(err) return console.log(err);
      res.redirect("/");
    });
}

// получем id редактируемого пользователя, получаем его из бд и отправлям с формой редактирования
const editCustomerInfoForm = (res, req) => {
    const query = "SELECT * FROM customer WHERE id = $1";

    const id = req.params.id;
    pool.query(query, [id], function(err, data) {
    if(err) return console.log(err);
    res.render("edit.hbs", {
        user: data[0]
    });
  });
}

// получаем отредактированные данные и отправляем их в БД
const editCustomer = (res, req) => {
    if(!req.body) return res.sendStatus(400);
    const name = req.body.name;
    const age = req.body.age;
    const id = req.body.id;
    const query = "UPDATE customer SET name = $1, age = $2 WHERE id = $3";

    pool.query(query, [name, age, id], function(err, data) {
    if(err) return console.log(err);
    res.redirect("/");
  });
}

// получаем id удаляемого пользователя и удаляем его из бд
const deleteCustomer = (res, req) => {
    const id = req.params.id;
    const query = "DELETE FROM customer WHERE id = $1";

    pool.query(query, [id], function(err, data) {
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