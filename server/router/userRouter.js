const { Router } = require('express');
const userController = require('../controller/user-controller');
const router = new Router();
const { body } = require('express-validator');
const authMiddleware = require('../middleware/auth-middleware');

router.post('/register',
  body('email').isEmail(),
  // password must be at least 5 chars long
  body('password').isLength({ min: 5 }),
  userController.registration);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/activate/:link', userController.activate);
router.get('/refresh', userController.refresh);
router.get('/users', authMiddleware, userController.getUsers)

module.exports = router;
