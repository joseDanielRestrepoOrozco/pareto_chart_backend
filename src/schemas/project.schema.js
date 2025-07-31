import { z } from 'zod/v4'

export const problemSchema = z.object({
  name: z.string({
    error: (issue) =>
      issue.input === undefined
        ? 'El nombre del problema es obligatorio'
        : 'El nombre del problema debe ser texto'
  }).min(2, { error: 'El nombre del problema debe tener al menos 2 caracteres' })
    .max(100, { error: 'El nombre del problema debe tener como máximo 100 caracteres' }),
  frequency: z.number({
    error: (issue) =>
      issue.input === undefined
        ? 'La frecuencia es obligatoria'
        : 'La frecuencia debe ser un número'
  }).min(1, { error: 'La frecuencia debe ser al menos 1' })
}, {
  error: 'Debe enviarse un objeto válido'
})
