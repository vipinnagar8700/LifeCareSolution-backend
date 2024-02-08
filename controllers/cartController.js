const Cart = require('../models/cartModel'); // Import your 'Cart' model
const Product = require('../models/productModel'); // Import your 'Product' model

const addToCart = async (req, res) => {
    try {
        const { product_id, user_id, quantity, SKU } = req.body;

        // Check if the product exists
        const product = await Product.findById(product_id);
        if (!product) {
            return res.status(404).json({ message: "Product not found", success: false });
        }

        // Create a new item in the cart
        const newItem = new Cart({
            product_id,
            user_id,
            quantity,
            SKU,
            total: (parseFloat(product.Price) * parseInt(quantity)).toString() // Calculate total price
        });

        await newItem.save();

        res.status(201).json({
            message: "Item added to the cart successfully!",
            success: true,
            data: newItem
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
            success: false
        });
    }
};

const AllCarts = async (req, res) => {
    try {
        const patients = await Cart.find().sort({ createdAt: -1 }); // Exclude the 'password' field;
        const length = patients.length;
        res.status(200).json([{
            message: "All Carts data retrieved successfully!",
            data: patients,
            status: true,
            length
        }]);
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
            status: false
        });
    }
};


const AllUserCarts = async (req, res) => {
    try {
        const { id } = req.params;

        // Retrieve all carts for the user
        const carts = await Cart.find({ user_id: id }).sort({ createdAt: -1 });

        let grandTotal = 0; // Initialize the grand total

        // Calculate the grand total of all items in the cart
        carts.forEach(cart => {
            if (cart.total) {
                grandTotal += parseFloat(cart.total);
            }
        });

        res.status(200).json({
            message: "All Carts data retrieved successfully!",
            data: carts,
            grandTotal, // Include the grand total in the response
            status: true,
            length: carts.length
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
            status: false
        });
    }
};


const deleteCart = async (req, res) => {
    const { id } = req.params;
    try {
        const editCart = await Cart.findByIdAndDelete(id); // Exclude the 'password' field
        if (!editCart) {
            res.status(200).json({
                message: "Cart was not found!",
            });
        } else {
            res.status(201).json({
                message: "Data successfully Deleted!",
                success: true,

            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Failed to Deleted Data!",
            status: false
        });
    }
}


module.exports = { addToCart,AllCarts,AllUserCarts,deleteCart };
