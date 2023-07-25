import { Router } from 'express';
import { authToken } from '../utils/jwt.js';
import { 
    getCart,
    addProduct,
    deleteProduct,
    cleanCart,
} from '../controllers/cartController.js';
import { buyProducts } from '../controllers/ticketController.js'

const cartRoute = Router();

cartRoute.get('/:cid', authToken, getCart);
cartRoute.post('/:cid/product/:pid', authToken, addProduct);
cartRoute.delete('/:cid/product/:pid', authToken, deleteProduct);
cartRoute.delete('/:cid', authToken, cleanCart);
cartRoute.get('/:cid/purchase', buyProducts);

export default cartRoute;