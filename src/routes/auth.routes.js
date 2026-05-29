import { Router } from 'express'
import {
	changeResetPassword,
	login,
	register,
	resetPassword,
	secondFactorAuthentication,
	verifyCode,
	verifyToken,
} from '../controllers/auth.controller.js'
import validateSchema from '../middlewares/validator.middleware.js'
import {
	changeResetPasswordSchema,
	loginSchema,
	registerSchema,
	verifyCodeSchema,
	verifyEmailSchema,
} from '../schemas/auth.schema.js'

const router = Router()

router.post('/register', validateSchema(registerSchema), register)

router.post('/login', validateSchema(loginSchema), login)

router.post('/verify', verifyToken)

router.post('/verifyCode', validateSchema(verifyCodeSchema), verifyCode)

router.post(
	'/secondFactorAuthentication',
	validateSchema(verifyCodeSchema),
	secondFactorAuthentication
)

router.post('/resetPassword', validateSchema(verifyEmailSchema), resetPassword)

router.put(
	'/changeResetPassword',
	validateSchema(changeResetPasswordSchema),
	changeResetPassword
)

export default router
