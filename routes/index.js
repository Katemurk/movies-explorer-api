const router = require('express').Router();
const auth = require('../middlewares/auth');

const signupRoute = require('./signup');
const signinRoute = require('./signin');
const userRoutes = require('./users');
const cardRoutes = require('./movies');
const NotFoundErr = require('../errors/not-found-err');

router.use('/', signupRoute);
router.use('/', signinRoute);
router.use('/users', auth, userRoutes);
router.use('/movies', auth, cardRoutes);

router.use((req, res, next) => next(new NotFoundErr('Page not found')));

module.exports = router;
