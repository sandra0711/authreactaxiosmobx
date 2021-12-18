require('dotenv').config()

const nodemailer = require("nodemailer");

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER, // generated ethereal user
        pass: process.env.SMTP_PASSWORD, // generated ethereal password
      },
    });
  };

  async sendActivationMail(to, link) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER, // sender address
      to, // list of receivers
      subject: "Активация аккаунта на " + process.env.API_URL, // Subject line
      text: "", // plain text body
      html:
        `
        <div>
          <h1>
            Для активации перейдите по ссылке:
          </h1>
          <a href="${link}">${link}</a>
        </div>
        `
      , // html body
    });
  }
}

module.exports = new MailService();
