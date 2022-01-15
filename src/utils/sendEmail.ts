const nodemailer = require('nodemailer');

const SendAlertEmail = (title, emailContent) => {
  async function main() {
    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      service: 'gmail',
      port: 587,
      secure: true,
      auth: {
        user: process.env.MAIL_ALERT_SENDER_ACC,
        pass: process.env.MAIL_ALERT_SENDER_PWD,
      },
      tls: {
        ciphers: 'SSLv3',
      },
    });

    await transporter.sendMail({
      from: '"Monitoramento Quimtia" <foo@example.com>',
      to: process.env.MAIL_ALERT_RECEIVER_ACC,
      subject: title,
      text: `${emailContent}`,
      html: `<b>${emailContent}</b>`,
    });

    console.log(
      'Message de alerta enviada',
      new Date().toLocaleString('pt-br'),
    );
  }

  main().catch(console.error);
};

export default SendAlertEmail;
