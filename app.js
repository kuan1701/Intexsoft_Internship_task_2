const express = require("express");
const app = express();
const pool = require('./config/db.config');
const port = 3000;

app.set("view engine", "hbs");

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true
  })
);

// получение списка пользователей
app.get("/", pool.getCustomers);

// возвращаем форму для добавления данных
app.get("/create", pool.createCustomerForm);

// получаем отправленные данные и добавляем их в БД 
app.post("/create", pool.createCustomer);

// получем id редактируемого пользователя, получаем его из бд и отправлям с формой редактирования
app.get("/edit/:id", pool.editCustomerInfoForm);

// получаем отредактированные данные и отправляем их в БД
app.post("/edit", pool.editCustomer);

// получаем id удаляемого пользователя и удаляем его из бд
app.post("/delete/:id", pool.deleteCustomer);

app.listen(3000, function(){
  console.log(`App running on port ${port}`);
});