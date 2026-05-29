const tokenExtractor = (req, _res, next) => {
	const authorization = req.get('Authorization')

	if (authorization?.startsWith('Bearer ')) {
		req.token = authorization.replace('Bearer ', '')
	}

	next()
}

export default tokenExtractor
