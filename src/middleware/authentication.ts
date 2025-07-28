import jsonwebtoken from 'jsonwebtoken'
import { RequestHandler } from "express";
import { throwError } from "../helper/helpers";
import User from '../models/User';
import { generateJWTAndSendCookie, shouldRefreshToken } from '../helper/jwt';

export const aunthenticateJWT : RequestHandler = async (req, res, next) => {
  const { jwt: token } = req.cookies;

  if (!token) {
    return throwError(next, 'Unauthorized: Session expired', 401);
  }

  try {
    const decoded = jsonwebtoken.verify(token, String(process.env.JWT_SECRET));
    
    if (typeof decoded === 'object' && decoded.userId){
      const user = await User.findById(decoded.userId).select('_id name email')

      if (user){
        shouldRefreshToken(decoded.exp) && generateJWTAndSendCookie(res, user.id)
        req.user = user
        return next();
      } else{
        return throwError(next, 'Unauthorized: You cannot perform this action', 401)
      }
    }

  } catch (err) {
    return throwError(next, 'Unauthorized: Session expired', 401);
  }
}
