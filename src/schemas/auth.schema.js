import { z } from 'zod/v4'

const passwordSchema = z.string({
  error: (issue) =>
    issue.input === undefined
      ? 'La contraseña es requerida'
      : 'La contraseña debe ser texto'
})
  .trim()
  .min(8, { error: 'La contraseña debe tener al menos 8 caracteres' })
  .max(20, { error: 'La contraseña debe tener como máximo 20 caracteres' })
  .refine((val) => /[0-9]/.test(val), { error: 'La contraseña debe incluir un número' })
  .refine((val) => /[^A-Za-z0-9]/.test(val), { error: 'La contraseña debe incluir un carácter especial' })

const emailSchema = z.string({
  error: (issue) =>
    issue.input === undefined
      ? 'El correo electrónico es requerido'
      : 'Formato de correo electrónico no válido'
}).email({ error: 'Formato de correo electrónico no válido' })

export const registerSchema = z.object({
  username: z.string({
    error: (issue) =>
      issue.input === undefined
        ? 'El nombre de usuario es requerido'
        : 'El nombre de usuario debe ser texto'
  }).trim(),
  email: emailSchema,
  password: passwordSchema
}, {
  error: 'Datos inválidos para el registro'
})

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema
}, {
  error: 'Datos inválidos para el login'
})

export const verifyCodeSchema = z.object({
  code: z.string({
    error: (issue) =>
      issue.input === undefined
        ? 'El código es requerido'
        : 'El código debe ser texto'
  })
    .trim()
    .length(6, { error: 'Código incorrecto' }),
  email: emailSchema
}, {
  error: 'Datos inválidos para la verificación de código'
})

export const verifyEmailSchema = z.object({
  email: emailSchema
}, {
  error: 'Datos inválidos para la verificación de correo'
})

export const changeResetPasswordSchema = z.object({
  token: z.string({
    error: (issue) =>
      issue.input === undefined
        ? 'El token es requerido'
        : 'El token debe ser texto'
  }),
  newPassword: passwordSchema,
  confirmNewPassword: passwordSchema
}, {
  error: 'Datos inválidos para el cambio de contraseña'
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  error: 'Las contraseñas no coinciden'
})
