import { Router } from 'express';
import { authToken } from '../utils/jwt.js';
import {
    getUsers,
    updateRole,
    deleteUser,
    deleteInoperantUsers
} from '../controllers/adminUsersController.js';
import { isAdmin } from '../middlewares/isAdmin.js';

const adminUsersRoute = Router();

adminUsersRoute.get('/', authToken, isAdmin, getUsers);
adminUsersRoute.put('/:id', authToken, isAdmin, updateRole);
adminUsersRoute.delete('/:id', authToken, isAdmin, deleteUser);
adminUsersRoute.delete('/admin/:ids', authToken, isAdmin, deleteInoperantUsers);

export default adminUsersRoute;