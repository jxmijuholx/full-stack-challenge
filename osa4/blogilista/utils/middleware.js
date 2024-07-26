const logger = require('./logger');
const jwt = require('jsonwebtoken');

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method);
  logger.info('Path:  ', request.path);
  logger.info('Body:  ', request.body);
  logger.info('---');
  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return response.status(400).json({ error: 'expected `username` to be unique' });
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({
      error: 'invalid token or unauthorized access'
    });
  }

  next(error);
};

const userExtractor = async (req, res, next) => {
  const authorization = req.get('Authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    const token = authorization.substring(7);
    try {
      const decodedToken = jwt.verify(token, process.env.SECRET);
      req.user = await User.findById(decodedToken.id);
    } catch (error) {
      return res.status(401).json({ error: 'Token invalid or expired' });
    }
  } else {
    return res.status(401).json({ error: 'Token missing or invalid' });
  }
  next();
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  userExtractor
};
