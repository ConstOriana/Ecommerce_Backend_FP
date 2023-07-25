import { Router } from 'express';
import { 
    mainView, 
    loginView, 
    loginUser, 
    registerView, 
    createUser, 
    logoutUser, 
    restoreView,
    sendPasswordCode,
    validatePasswordUpdate,
    restorePassword,
} from '../controllers/userController.js';

const userRoute = Router();

userRoute.get('/', mainView);
userRoute.get('/login', loginView);
userRoute.post('/login', loginUser);
userRoute.get('/register', registerView);
userRoute.post('/register', createUser);
userRoute.get('/logout', logoutUser);
userRoute.get('/sendRecovery', restoreView);
userRoute.post('/sendRecovery', sendPasswordCode);
userRoute.get('/restorePassword', validatePasswordUpdate);
userRoute.post('/restorePassword', restorePassword);

export default userRoute;