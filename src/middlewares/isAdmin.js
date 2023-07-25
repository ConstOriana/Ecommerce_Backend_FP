import CustomError from '../utils/customError.js';
import { errorDictionary } from '../utils/errorDictionary.js';

export const isAdmin = async (req, res, next) => {
  try{
    if (req.session?.role === 'admin') return next();
    CustomError.createError({
      name: 'Authorization Error',
      cause: 'Administrative access is needed',
      message: 'Error trying to access',
      code: errorDictionary.AUTHORIZATION_ERROR
    });
  }catch(error){
    next(error);
  }

}
