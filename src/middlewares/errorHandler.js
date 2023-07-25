import { errorDictionary } from '../utils/errorDictionary.js';

const errorHandler = (err, req, res, next) => {

  switch(err.code) {
    case errorDictionary.REQUIRED_FIELDS_ERROR:
      req.logger.error({ status: 'error', error: err.name, message: err.message, cause: err.cause, code: err.code });
      res.json({ status: 'error', error: err.name, message: err.message, cause: err.cause, code: err.code });
      break;
    case errorDictionary.DUPLICATED_USER_ERROR:
      req.logger.error({ status: 'error', error: err.name, message: err.message, cause: err.cause, code: err.code });
      res.json({ status: 'error', error: err.name, message: err.message, cause: err.cause, code: err.code });
      break;
    case errorDictionary.AUTHENTICATION_ERROR:
      req.logger.error({ status: 'error', error: err.name, message: err.message, cause: err.cause, code: err.code });
      res.json({ status: 'error', error: err.name, message: err.message, cause: err.cause, code: err.code });
      break;
    case errorDictionary.AUTHORIZATION_ERROR:
      req.logger.error({ status: 'error', error: err.name, message: err.message, cause: err.cause, code: err.code });
      res.json({ status: 'error', error: err.name, message: err.message, cause: err.cause, code: err.code });
      break;
    case errorDictionary.INVALID_USER_ERROR:
      req.logger.error({ status: 'error', error: err.name, message: err.message, cause: err.cause, code: err.code });
      res.json({ status: 'error', error: err.name, message: err.message, cause: err.cause, code: err.code });
      break;
    case errorDictionary.WRONG_PASSWORD_ERROR:
      req.logger.error({ status: 'error', error: err.name, message: err.message, cause: err.cause, code: err.code });
      res.json({ status: 'error', error: err.name, message: err.message, cause: err.cause, code: err.code });
      break;
    default:
      res.status(500).json({ status: 'error', error: 'Internal Server Error', code: err.code });
  }

};

export default errorHandler;
