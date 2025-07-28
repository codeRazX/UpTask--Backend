import nodemailer from 'nodemailer'
import 'dotenv/config'

const config = () => {
  return {
    host: process.env.SMTP_HOST,
    port: Number(process.env.PORT),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  }
}

export const transport = nodemailer.createTransport(config())