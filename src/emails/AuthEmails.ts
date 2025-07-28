import { transport } from "../config/nodemailer";
import { TokenType } from "../models/Token";
import { UserType } from "../models/User";

type EmailType = {
  email: UserType["email"];
  name: UserType["name"];
  token: TokenType["token"];
};

export default class AuthEmail {
  static sendConfirmationEmail = async (user: EmailType) => {
    await transport.sendMail({
      from: "UpTask <admin@uptask.com>",
      to: user.email,
      subject: "UpTask - Confirm account",
      text: "UpTask - Confirm account",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Confirm Your Account</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: whitesmoke;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" bgcolor="whitesmoke">
                <tr>
                    <td align="center" style="padding: 20px 10px;">
                     
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);">
                            <tr>
                                <td align="center" bgcolor="#c084fc" style="padding: 20px;">
                                    <h1 style="margin: 0; color: #ffffff; font-size: 24px;">Welcome to UpTask</h1>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 30px 20px; text-align: center;">
                                    <p style="font-size: 16px; color: #333333; margin: 0;">
                                        Hello <strong>${
                                          user.name
                                        }</strong>,<br><br>
                                        Thank you for creating an account on UpTask. You're almost ready to go. Just confirm your account at the following link.
                                    </p>
                                    <p style="margin: 30px 0;">
                                        <a href="${process.env.FRONTEND_URL}/confirm-account/${user.token}" 
                                        style="display: inline-block; background-color: #c084fc; color: #fff; text-decoration: none; font-size: 16px; padding: 12px 24px; border-radius: 5px; font-weight: bold; box-shadow: 0 0 5px rgb(0 0 0 /.2);">
                                        Confirm Account
                                        </a>
                                    </p>
                                    <p style="font-size: 14px; color: #555555;">
                                       This link expires in 10 minutes
                                    </p>
                                    <p style="font-size: 12px; color: #555555;">
                                        If you did not create an account, please ignore this email.
                                    </p>
                                </td>
                            </tr>
                            <tr>
                                <td align="center" bgcolor="#E1E1E1" style="padding: 20px; font-size: 12px; color: #777777;">
                                    <p style="margin: 0;">&copy; ${new Date().getFullYear()} UpTask. All rights reserved.</p>
                                    <p style="margin: 5px 0;">
                                        Need help? <a href="#" style="color: #007bff; text-decoration: none;">Contact Support</a>
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
      `,
    });
  };

   static sendResetPassword = async (user: EmailType) => {
    await transport.sendMail({
      from: "UpTask <admin@uptask.com>",
      to: user.email,
      subject: "UpTask - Reset Password",
      text: "UpTask - Reset Password",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reset Password</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: whitesmoke;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" bgcolor="whitesmoke">
                <tr>
                    <td align="center" style="padding: 20px 10px;">
                     
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);">
                            <tr>
                                <td align="center" bgcolor="#c084fc" style="padding: 20px;">
                                    <h1 style="margin: 0; color: #ffffff; font-size: 24px;">UpTask</h1>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 30px 20px; text-align: center;">
                                    <p style="font-size: 16px; color: #333333; margin: 0;">
                                        Hello <strong>${
                                          user.name
                                        }</strong>,<br><br>
                                        We received a request to reset your password. To complete the process, please use the link below.
                                    </p>
                                    <p style="margin: 30px 0;">
                                        <a href="${process.env.FRONTEND_URL}/new-password/${user.token}" 
                                        style="display: inline-block; background-color: #c084fc; color: #fff; text-decoration: none; font-size: 16px; padding: 12px 24px; border-radius: 5px; font-weight: bold; box-shadow: 0 0 5px rgb(0 0 0 /.2);">
                                        Reset Password
                                        </a>
                                    </p>
                                    <p style="font-size: 14px; color: #555555;">
                                       This link expires in 10 minutes
                                    </p>
                                    <p style="font-size: 12px; color: #555555;">
                                       If you did not request a password reset, please ignore this message.
                                    </p>
                                </td>
                            </tr>
                            <tr>
                                <td align="center" bgcolor="#E1E1E1" style="padding: 20px; font-size: 12px; color: #777777;">
                                    <p style="margin: 0;">&copy; ${new Date().getFullYear()} UpTask. All rights reserved.</p>
                                    <p style="margin: 5px 0;">
                                        Need help? <a href="#" style="color: #007bff; text-decoration: none;">Contact Support</a>
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
      `,
    });
  };
}
