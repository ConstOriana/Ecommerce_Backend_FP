import { createHash, isValidPassword } from '../utils/bcrypt.js';
import { generateToken} from '../utils/jwt.js';
import UserService from '../services/userService.js';
import CartService from '../services/cartService.js';
import CustomError from '../utils/customError.js';
import { errorDictionary } from '../utils/errorDictionary.js';
import { sendEmail } from '../utils/sendEmail.js';

const userService = new UserService();
const cartService = new CartService();

export const mainView = (req, res, next) => {
    try {
        res.redirect('/login');
    } 
    catch(error) {
        next(error);
    }
};

export const loginView = (req, res, next) => {
    try {
        res.render('login');
    } 
    catch(error) {
        next(error);
    }
};

export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
    
        const userFound = await userService.getUserByUsername(email);

        if(!userFound) CustomError.createError({
            name: 'Login error',
            cause: 'Usuer does not exist',
            message: 'Error trying to login',
            code: errorDictionary.INVALID_USER_ERROR
        });
        if(!isValidPassword(userFound, password)) CustomError.createError({
            name: 'Login error',
            cause: 'Wrong password',
            message: 'Error trying to login',
            code: errorDictionary.WRONG_PASSWORD_ERROR
        });
        
        req.session.userId = userFound._id;
        req.session.email = userFound.email;
        req.session.role = userFound.role;
        req.session.cartId = userFound.cartId;

        let lastLogin = Date.now();
    
        userService.updateTimestamp(email, lastLogin)
        const accessToken = generateToken(email);

        res.cookie('sessionToken', accessToken, { maxAge: 3000 * 60 * 60, httpOnly: true, signed: true }).json({ status: 'success', cartId: userFound.cartId });
    } 
    catch(error) {
        next(error);
    }
};

export const registerView = (req, res, next) => {
    try {
        res.render('register');
    } 
    catch(error) {
        next(error);
    }
};

export const createUser = async (req, res, next) => {
    try {
        const {first_name, last_name, password, email} = req.body;
    
        if(!first_name || !last_name || !password || !email){
            CustomError.createError({
                name: 'User creation error',
                cause: 'All fields should be completed',
                message: 'Error trying to create user',
                code: errorDictionary.REQUIRED_FIELDS_ERROR
            });
        }
        
        let userFound = await userService.getUserByUsername(email);
        if(userFound) CustomError.createError({
            name: 'User creation error',
            cause: 'User already exists',
            message: 'Error trying to create user',
            code: errorDictionary.DUPLICATED_USER_ERROR
        });

        const cart = await cartService.create();

        const lastLogin = Date.now();

        const newUser = {
            first_name,
            last_name,
            email,
            password: createHash(password),
            cartId: cart._id,
            lastLogin
        }
        await userService.create(newUser);
        return res.status(201).json({ status: 'success' });
    } 
    catch(error) {
        console.log(error);
        next(error);
    }
};

export const logoutUser = (req, res, next) => {
    try {
        res.clearCookie('sessionToken').redirect('/login');
    } 
    catch(error) {
        next(error);
    }
};

let tokens = [];

const deleteToken = token => {
    tokens = tokens.filter( element => element.token != token);
};

const saveToken = token => {
    tokens.push({
        token,
        time: Date.now()
    });
    setTimeout(() => {
        deleteToken(token);
    }, 30000);
};

export const restoreView = async (req, res, next) => {
    try {
        res.render('send-recovery-password');
    } 
    catch(error) {
        next(error);
    }
};

export const sendPasswordCode = async (req, res, next) => {
    try {
        const { email } = req.body;
        let token = createHash(email);
        saveToken(token);
        const link = `http://localhost:8080/restorePassword?token=${token}`;
        let content = `
        <div>
            <h4>
                Link para cambio de contraseña:
            </h4>
            <p>
                ${link}
            </p>
        </div>`
        await sendEmail(email, 'Recuperar contraseña', content);
        return res.status(200).json({ status: 'success' });
    }
    catch(error) {
        next(error);
    }
}; 

export const validatePasswordUpdate = async(req, res, next) => {
    try {
        let tokenFound = false;
        let { token } = req.query;
        for (let element in tokens){
            if(tokens[element].token == token) tokenFound = true;
        }
        if(tokenFound){
            res.render('restore-password');
        }
        else{
            console.log('invalid token')
        }
    }
    catch(error) {
        next(error);
    }
};

export const restorePassword = async(req, res, next) => {
    try {
        let { email, newPassword } = req.body;
        let userFound = await userService.getUserByUsername(email);
        if(!userFound) CustomError.createError({
            name: 'Login error',
            cause: 'User does not exists',
            message: 'Error trying to login',
            code: errorDictionary.INVALID_USER_ERROR
        });
        let newPasswordHash = createHash(newPassword);
        await userService.updatePassword(email, newPasswordHash);
        return res.status(200).json({ status: 'success' });
    }
    catch(error) {
        next(error);
    }
};
