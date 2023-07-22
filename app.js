require('dotenv').config();

const express = require('express');

const mongoose = require('mongoose');

const helmet = require('helmet');

const { errors } = require('celebrate');

const cors = require('cors');

const limiter = require('./middlewares/limiter');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const routes = require('./routes/index');

const { PORT = 3000 } = process.env;

const { CONNECT = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const errorsHandler = require('./middlewares/errorsHandler');

mongoose
  .connect(CONNECT, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('connect to DB');
  });

const app = express();

app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(requestLogger);
app.use(limiter);

app.use(routes);
app.use(errorLogger);
app.use(errors());

app.use(errorsHandler);

app.listen(PORT, () => {
  console.log(`server run on port ${PORT}`);
});
