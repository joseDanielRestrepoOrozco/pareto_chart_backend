import { z } from 'zod/v4'

export const projectSchema = z.object({
  name: z.string({
    error: (issue) =>
      issue.input === undefined
        ? 'El nombre del proyecto es obligatorio'
        : 'El nombre del proyecto debe ser texto'
  })
    .min(2, { error: 'El nombre del proyecto debe tener al menos 2 caracteres' })
    .max(100, { error: 'El nombre del proyecto debe tener como máximo 100 caracteres' })
}, {
  error: 'Debe enviarse un objeto válido'
})
