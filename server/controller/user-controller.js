require('dotenv').config();
const { validationResult } = require('express-validator');
const userService = require('../service/userService');
const MyError = require('../exceptions/api-error');

class UserController {
  async registration(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(MyError.BadRequest('Ошибка при валидации', errors.array()));
      }
      const { email, password } = req.body;
      const userData = await userService.registration(email, password);
      res.cookie('refreshToken', userData.refreshToken, { maxAge: 10000, httpOnly: true });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  };

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const userData = await userService.login(email, password);
      res.cookie('refreshToken', userData.refreshToken, { maxAge: 10000000, httpOnly: true });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  };

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const token = await userService.logout(refreshToken);
      res.clearCookie('refreshToken');
      return res.json(token);
    } catch (e) {
      next(e);
    }
  };

  async activate(req, res, next) {
    try {
      const link = req.params.link;
      userService.activate(link);
      res.redirect(process.env.CLIENT_URL);
    } catch (e) {
      next(e);
    }
  };

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const userData = await userService.refresh(refreshToken);
      res.cookie('refreshToken', userData.refreshToken, { maxAge: 10000000, httpOnly: true });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  };

  async getUsers(req, res, next) {
    try {
      const users = await userService.getAllUsers();
      res.json(users);
    } catch (e) {
      next(e);
    }
  };



};

module.exports = new UserController();
