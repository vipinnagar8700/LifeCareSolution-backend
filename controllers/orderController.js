const Order = require('../models/orderModel');
const Cart = require('../models/cartModel')

const createOrderFromCart = async (req, res) => {
    try {
        const { cart_id, First_Name, Last_Name, Email, delivery_address, NameOnCard, CardNumber, ExpiryMonth, ExpiryYear, CVV } = req.body;

        // Find the cart with the given cart_id
        const cart = await Cart.findOne({ _id: cart_id }).populate('product_id');
        console.log(cart)
        if (!cart) {
            return res.status(404).json({ message: "Cart not found", success: false });
        }

        // Create an array to hold products and quantities for the order
        const productsForOrder = cart.product_id.map(item => ({
            product_id: item._id,
            quantity: item.Quantity
        }));

        // Create the order
        const newOrder = await Order.create({
            cart_id,
            products: productsForOrder,
            First_Name,
            Last_Name,
            Email,
            delivery_address,
            NameOnCard,
            CardNumber,
            ExpiryMonth,
            ExpiryYear,
            CVV,
            status: 'pending' // Setting the initial status as 'pending'
        });
        // Remove items from the cart if the order is successfully placed
        await Cart.findByIdAndDelete(cart_id);


        res.status(201).json({
            message: "Order created successfully!",
            success: true,
            // data: newOrder
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
            success: false
        });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { order_id, newStatus } = req.body;

        // Find the order and update its status
        const order = await Order.findByIdAndUpdate(order_id, { status: newStatus }, { new: true });

        if (!order) {
            return res.status(404).json({ message: "Order not found", success: false });
        }

        res.status(200).json({
            message: "Order status updated successfully",
            success: true,
            data: order
        });

    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
            success: false
        });
    }
};

const getUserOrders = async (req, res) => {
    try {
        const { user_id } = req.params;

        // Retrieve all orders for the user
        const orders = await Order.find({ user_id });

        res.status(200).json({
            message: "User's orders retrieved successfully!",
            data: orders,
            status: true
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
            status: false
        });
    }
};




module.exports = { createOrderFromCart, updateOrderStatus, getUserOrders };
