const mongoose = require('mongoose');
const Order = require('../models/Order');

const sendEmail = require('../utils/sendEmail');

//Create a new order
const createOrder = async(req,res) => {
    try{
            console.log('createOrder request', { userId: req.user?._id, body: req.body });
            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }
            const { items, totalAmount, address, paymentId} = req.body;
            if(!items || items.length ===0 || !totalAmount || !address || !paymentId){
                return res.status(400).json({message: 'Invalid order data'});
            }

            // Validate address object has required nested fields
            const requiredAddressFields = ['fullName','street','city','postalCode','country'];
            const missingAddress = requiredAddressFields.filter((f) => !address || !address[f]);
            if (missingAddress.length) {
                return res.status(400).json({ message: 'Incomplete address', missing: missingAddress });
            }

         const normalizedItems = [];
         for (const item of items) {
            const productId = item.id || item.productId ||
              (typeof item.product === 'string' ? item.product : item.product?._id || item.product?.id) ||
              (typeof item.productId === 'string' ? item.productId : item.productId?._id || item.productId?.id);
            if (!productId || typeof productId !== 'string' || !mongoose.Types.ObjectId.isValid(productId)) {
              return res.status(400).json({ message: 'Each order item must include a valid MongoDB product ID.' });
            }
            const qty = Number(item.qty ?? item.quantity ?? 1);
            const price = Number(item.price ?? 0);
            if (!Number.isFinite(qty) || qty <= 0) {
              return res.status(400).json({ message: `Each order item must include a valid positive qty for product ${productId}.` });
            }
            if (!Number.isFinite(price) || price < 0) {
              return res.status(400).json({ message: `Each order item must include a valid price for product ${productId}.` });
            }
            normalizedItems.push({
              product: productId,
              productId,
              qty,
              price
            });
         }

         const order = new Order({
                user: req.user?._id,
                userId: req.user?._id,
                items: normalizedItems,
                totalAmount,
                address,
                paymentId
               });
         await order.save();

         const message = `Dear ${req.user.name},\n\nThank you for your order! Your order has been successfully created with the following details:\n\nOrder Id: ${order._id}\nTotal Amount: $${totalAmount}\n Shipping Address: ${address}\n\nwe will notify you once your order is shipping.\n\nBEst regards,\nShopNest Team`;

         try {
             await sendEmail(req.user.email, 'Order Created', message);
         } catch (emailError) {
             // An email configuration problem must not prevent a valid order from being created.
             console.error('Order confirmation email failed:', emailError.message);
         }

         res.status(201).json({message: 'Order created successfully', order});
    } catch (error) {
        console.error('Error creating order:', {
            message: error.message,
            stack: error.stack,
            userId: req.user?._id,
            body: req.body
        });
        res.status(500).json({message: 'Error creating order', error: error.message});
    }
};




const myOrders = async (req, res) => {
    try {
                const orders = await Order.find({
                        $or: [
                            { user: req.user._id },
                            { userId: req.user._id }
                        ]
                })
                        .populate('items.product', 'name price');

        res.json(orders);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'error fetching orders',
            error: error.message
        });
    }
};



const getOrders = async (req, res) => {
    try{
        const orders = await Order.find({}).populate('user', 'id name');
        res.json(orders);
    }catch (error) {
        res.status(500).json({message: 'Error fetching orders',error});
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: false }
        );

        if (!updatedOrder) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        res.json({
            message: "Order status updated",
            order: updatedOrder
        });

    } catch (error) {
        res.status(500).json({
            message: "Error updating order status",
            error: error.message
        });
    }
};
module.exports ={
    createOrder,
    myOrders,
    getOrders,
    updateOrderStatus,
};


