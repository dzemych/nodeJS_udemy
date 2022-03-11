const express = require('express');
const morgan = require('morgan');
const cookieparser = require('cookie-parser')
const rateLimiter = require('express-rate-limit')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xssClean = require('xss-clean')

const AppError = require('./src/utils/appError');
const globalErrorHandler = require('./src/controllers/errorController');
const tourRouter = require('./src/routes/tourRoutes');
const userRouter = require('./src/routes/userRoutes');


const app = express();

// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limits rates from one IP
const limiter = rateLimiter({
  max: 10,
  windowMs: 60 * 1000,
  message: 'To many requests from this IP'
})
app.use(limiter)

// Set HTTP headers
app.use(helmet())

// Sanitize requests from malicious code
app.use(mongoSanitize())
app.use(xssClean())

// Parsing cookies, body into req.body, static files
app.use(cookieparser())
app.use(express.json({ limit: '10kb' }));
app.use(express.static(`${__dirname}/public`));

// Set initial request time
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Handling all errors that has occurred
app.use(globalErrorHandler);

module.exports = app;
