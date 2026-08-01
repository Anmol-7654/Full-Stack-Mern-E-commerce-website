const Order = require('../models/Order');
const order = require('../models/Order');

const sendEmail = require('../utils/sendEmail');

//Create a new order
const createOrder = async(req,res) => {
    try{
         const { items, totalAmount, address, paymentId} = req.body;
         if(!items || items.length ===0|| !totalAmount || !address||!paymentId){
            return res.status(400).json({message: 'Invalid order data'});
         }
         else{
               const order = new Order({
                user: req.user._id,
                items,
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
    }
}catch (error){
    res.status(500).json({message: 'Error creating order', error});
 }
};




const myOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
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


