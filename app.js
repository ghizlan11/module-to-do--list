const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite',
});

const Todo = sequelize.define('Todo', {
  text: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue:false,
    allowNull: false,
  },
});

sequelize.sync();

app.get('/', async (req, res) => {
  const todos = await Todo.findAll();
  res.render('index', { todos });
});

app.post('/add', async (req, res) => {
  const newTodo = req.body.todo;
  await Todo.create({ text: newTodo,status:0 });
  res.redirect('/');
});

app.post('/update/:id', async (req, res) => {
  const todoId = req.params.id;
  const todotext = req.body.todo;
  const newstatus = req.body.status;
  await Todo.update({text: todotext ,status: newstatus }, { where: { id: todoId } });
  res.redirect('/');
});

app.post('/delete/:id', async (req, res) => {
  const todoId = req.params.id;
  await Todo.destroy({ where: { id: todoId } });
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
