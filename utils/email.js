const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Piyush Joshi <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      // Production transporter
      return nodemailer.createTransport({
        service:'SendGrid',
        auth:{
          user:process.env.SEND_GRID_USER_NAME,
          pass:process.env.SEND_GRID_API_KEY 
        }
      })
    }
    // Development transporter
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  // Send the actual email
  async send(template, subject) {
    // Render HTML based on a pug template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });

    // Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      text: htmlToText.convert(html),
      html,
    };

    // Create a transport and send email
    const transporter = this.newTransport();
    await transporter.sendMail(mailOptions);
  }

  async sendWelcome() {
      await this.send('welcome', 'Welcome to the Natours family');
  }
  async sendPasswordReset() {
    await this.send('passwordReset', 'your passwword reset token (valid for only 10 min)')
  
  }
};

