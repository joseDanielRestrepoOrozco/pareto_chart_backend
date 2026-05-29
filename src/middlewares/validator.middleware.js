const validateSchema = (schema) => (req, _res, next) => {
	try {
		schema.parse(req.body)
		next()
	} catch (error) {
		next(error)
	}
}

export default validateSchema
