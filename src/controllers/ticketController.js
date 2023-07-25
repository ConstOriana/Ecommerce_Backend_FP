import CartService from '../services/cartService.js';
import ProductService from '../services/productService.js';
import TicketService from '../services/ticketService.js';
import { v4 as uuidv4 } from 'uuid';
import { sendEmail } from '../utils/sendEmail.js'

const cartService = new CartService();
const productService = new ProductService();
const ticketService = new TicketService()

export const buyProducts = async (req, res, next) => {
    try {
        const cid = req.params;

        const cart = await cartService.getCart(cid);
        
        if(cart.products.length){

            let ticket;
            let purchaseDetail = '';
            let totalPrice = 0;

            for (let index = 0; index < cart.products.length; index++) {
                if (cart.products[index].quantity > cart.products[index].product.stock) return res.status(404).send({ status: "Error", message: 'No hay suficiente stock' });
            }

            for (let index = 0; index < cart.products.length; index++) {
                totalPrice += cart.products[index].product.price * cart.products[index].quantity;
                const product = await productService.getOne(
                    cart.products[index].product._id
                );
                product.stock = product.stock - cart.products[index].quantity;
                await product.save();
                purchaseDetail += `Product: ${cart.products[index].product.title}, Quantity: ${cart.products[index].quantity}`;
            }

            ticket = await ticketService.create({
                code: uuidv4(),
                purchase_datetime: new Date(),
                amount: totalPrice,
                purchaser: req.session.email,
                products: cart.products
            });

            const email = req.session.email;
            let contentEmail = `
                <div>
                    <h4>
                        purchase detail:
                    </h4>
                    <p>
                        ${purchaseDetail}
                    </p>
                    <br>
                    <p>
                        Total price: ${totalPrice}
                    </p>
                </div>`
            await sendEmail( email, 'Ticket de compra', contentEmail );

            await cartService.cleanCart(cid);

            res.status(200).render('purchase');

        }
        else{
            res.status(404).send({ status: "Error", message: 'Clear cart' });
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
};

