require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const errorMiddleware = require('./middleware/error-middleware');

const userRouter = require('./router/userRouter');

const app = express();
app.use(cookieParser());
app.use(express.json());

app.use(cors(
  {
    credentials: true,
    origin: process.env.CLIENT_URL
  }
));

app.use('/user', userRouter);
app.use(errorMiddleware);

const start = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, { useNewUrlParser: true }, () => console.log('Подключились к базе данных'))
    app.listen(process.env.PORT, () => { console.log('server is started on', process.env.PORT); });
    // await mongoose.connect(process.env.DB_URL, () => { console.log('database connected') })
  } catch (e) {
    console.log(e);
  }
};

start();
