import { Router } from "express";
import AuthController from "../controller/AuthController";
import { validationRequestBody } from "../middleware/validation";
import { tokenAuthExists, tokenPasswordExists } from "../middleware/validateAuth";
import { validationNewAccount, validationToken, validationLogin, validateAnEmail, validationNewPassword, validationUpdateProfile, validationNewPasswordProfile, validationCheckPassword } from "../config/validation";
import { aunthenticateJWT } from "../middleware/authentication";
import ProfileController from "../controller/ProfileController";

const router = Router()

router.post('/account', 
  validationNewAccount,
  validationRequestBody,
  AuthController.createAccount
)

router.post('/confirm-account', 
  validationToken,
  validationRequestBody,
  tokenAuthExists,
  AuthController.confirmAccount
)

router.post('/login', 
  validationLogin,
  validationRequestBody,
  AuthController.login
)

router.post('/request-token', 
  validateAnEmail,
  validationRequestBody,
  AuthController.requestNewToken
)

router.post('/forgot-password',
  validateAnEmail,
  validationRequestBody,
  AuthController.forgotPassword
)

router.post('/new-password',
  validationNewPassword,
  validationRequestBody,
  tokenPasswordExists,
  AuthController.resetNewPassword
)

router.post('/logout',
  aunthenticateJWT,
  AuthController.logout
)

router.get('/user',
  aunthenticateJWT,
  AuthController.user
)

router.post('/user/check-password', 
  aunthenticateJWT,
  validationCheckPassword,
  validationRequestBody,
  AuthController.checkPasword
)

/*Profile Routes*/
router.put('/profile',
  aunthenticateJWT,
  validationUpdateProfile,
  validationRequestBody,
  ProfileController.updateProfile
)

router.put('/profile/password',
  aunthenticateJWT,
  validationNewPasswordProfile,
  validationRequestBody,
  ProfileController.updatePassword
)



export default router