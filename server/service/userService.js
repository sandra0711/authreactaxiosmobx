require('dotenv').config();

const bcrypt = require('bcrypt');
const uuid = require('uuid');
const User = require('../model/UserModel');
const mailService = require('./mailService');
const tokenService = require('./tokenService');
const MyError = require('../exceptions/api-error');

class UserService {
  async registration(email, password) {
    const candidate = await User.findOne({ email });
    if (candidate) {
      throw MyError.BadRequest('Пользователь с таким email уже зарегистрирован');
    };
    const hashPassword = await bcrypt.hash(password, 7);
    const activationLink = uuid.v4();
    const user = await User.create({
      email,
      password: hashPassword,
      isActivated: false,
      activationLink,
    });

    await mailService.sendActivationMail(email, `${process.env.API_URL}/user/activate/${activationLink}`);
    const userDto = {
      userId: user._id,
      userEmail: user.email,
      userIsActivated: user.isActivated,
      userActivationLink: user.activationLink
    };
    const userId = user._id;
    const tokens = tokenService.generateToken({ userId, email: user.email, activatedLink: user.activatedLink });
    await tokenService.saveToken(userDto.userId, tokens.refreshToken);

    return {
      ...tokens,
      user,
    }
  };

  async activate(activationLink) {
    const user = await User.findOne({ activationLink });
    if (!user) {
      throw MyError.BadRequest('Некорректная ссылка для авторизации')
    }
    user.isActivated = true;
    return await user.save();
  };

  async login(email, password) {
    const user = await User.findOne({ email });
    if (!user) throw MyError.BadRequest('Пользователь с таким email не зарегистрирован');
    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) throw MyError.BadRequest('Неверный пароль');
    const userId = user._id;
    const tokens = tokenService.generateToken({ userId, email: user.email, activatedLink: user.activatedLink });
    await tokenService.saveToken(userId, tokens.refreshToken);
    return { ...tokens, user }
  };

  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  };

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw MyError.UnauthorizedError();
    };
    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);
    if (!userData || !tokenFromDb) {
      throw MyError.UnauthorizedError();
    };
    const user = User.findById(userData.userId);
    const userDto = {
      userId: user._id,
      userEmail: user.email,
      userIsActivated: user.isActivated,
      userActivationLink: user.activationLink
    }
    const tokens = tokenService.generateToken(userDto);
    await tokenService.saveToken(userDto.userId, tokens.refreshToken);

    return {
      ...tokens,
      user,
    }
  };

  async getAllUsers() {
    const users = User.find();
    return users;
  }
};

module.exports = new UserService();
