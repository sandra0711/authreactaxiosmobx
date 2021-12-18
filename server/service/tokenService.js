require('dotenv').config();
const jwt = require('jsonwebtoken');
const Token = require('../model/TokenModel')

class TokenService {
  generateToken = (payload) => {
    const accessToken = jwt.sign(payload, process.env.ACCESS_SECRET, { expiresIn: '5m' });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET, { expiresIn: '20m' });
    return { accessToken, refreshToken }
  };

  saveToken = async (userId, refreshToken) => {
    const tokenData = await Token.findOne({ user: userId });
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return await tokenData.save();
    }
    const token = await Token.create({
      user: userId,
      refreshToken,
    });
    return token;
  };

  removeToken = async (refreshToken) => {
    const tokenData = await Token.deleteOne({ refreshToken });
    return tokenData;
  };

  findToken = async (refreshToken) => {
    const tokenData = await Token.findOne({ refreshToken });
    return tokenData;
  };

  validateAccessToken = (token) => {
    try {
      const userData = jwt.verify(token, process.env.ACCESS_SECRET);
      return userData;
    } catch (e) {
      return null;
    };
  };

  validateRefreshToken = () => {
    try {
      const userData = jwt.verify(token, process.env.REFRESH_SECRET);
      return userData;
    } catch (e) {
      return null;
    };
  };


};

module.exports = new TokenService();
