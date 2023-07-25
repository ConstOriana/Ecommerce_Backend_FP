import { Router } from 'express';
import { authToken } from '../utils/jwt.js';
import { 
    getProducts,
    getOneProduct,
    createProductView,
    createProduct,
    updateProduct,
    deleteProduct
} from '../controllers/productsController.js';
import { isAdminOrPremium } from '../middlewares/isAdminOrPremium.js';

const productsRoute = Router();

productsRoute.get('/', authToken, getProducts);
productsRoute.get('/:pid', authToken, getOneProduct);
productsRoute.get('/admin/createProduct', authToken, isAdminOrPremium, createProductView);
productsRoute.post('/', authToken, isAdminOrPremium, createProduct);
productsRoute.put('/:pid', authToken, isAdminOrPremium, updateProduct);
productsRoute.delete('/:pid', authToken, isAdminOrPremium, deleteProduct);

export default productsRoute;