import jwt from 'jsonwebtoken';
import CustomError from './customError.js';
import { errorDictionary } from './errorDictionary.js';

const RANDOM_PRIVATE_KEY = 'secretRandom';

export const generateToken = (user) => {
    const token = jwt.sign({ user }, RANDOM_PRIVATE_KEY);
    return token;
}

export const authToken = (req, res, next) => {
    const token = req.signedCookies.sessionToken;
    if(!token) CustomError.createError({
        name: 'Autentication Error',
        cause: 'Sesión expirada - Ingrese nuevamente',
        message: 'Error trying to access',
        code: errorDictionary.AUTHENTICATION_ERROR
    });
    

    jwt.verify(token, RANDOM_PRIVATE_KEY, error => {
        if(error) CustomError.createError({
            name: 'Autentication Error',
            cause: 'Sesión expirada - Ingrese nuevamente',
            message: 'Error trying to access',
            code: errorDictionary.AUTHENTICATION_ERROR
        });
        
        next();
    });

}