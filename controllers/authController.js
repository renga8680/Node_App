const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.addProduct = async (req, res) => {
  const { name,description, price,stock } = req.body;
  try {
    const result = db.query(
      'INSERT INTO products (name,description, price,stock) VALUES (?,?,?,?)', [name,description, price,stock]
    );
    return res.status(200).json({ message: "Product added successfully", productId: result.insertId })
  } catch (err) {
    res.status(500).json({ message: "Error in adding product", error: err.message })
  }

}

exports.addItemToCart = async (req, res) => {
  const { userId, productId, quantity } = req.body;
  try {
    const [product] = await db.query('SELECT * FROM products WHERE id=?', [productId]);
    if (product.length === 0) {
      return res.status(401).json({ message: "Product Not Found" });
    }
    const [cartItem] = db.query(
      'INSERT INTO cart_items (user_id,product_id,quantity) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE quantity = quantity + ?', [userId, productId, quantity, quantity]
    );
    res.status(201).json({ message: "Item added to the cart", cartItem });
  }
  catch (err) {
    res.status(500).json({ message: 'Error adding item to cart', error: err.message })
  }
}

exports.getCartItems = async (req, res) => {
  const userId = req.params.userId;
  try {
    const [cartItems] = await db.query(
      'SELECT cart_items.id,products.name,products.price,cart_items.quantity FROM cart_items JOIN products ON cart_items.product.id = product.id WHERE cart_items.user_id=?', [userId]
    );
    res.status(200).json(cartItems);
  } catch (err) {
    res.status(500).json({ message: "Error fetching cart items", error: err.message })
  }
}

exports.updateCartItem = async (req, res) => {
  const cartItemId = req.params.cartItemId;
  const { quantity } = req.body;
  try {
    const [cartItem] = await db.query(
      'SELECT * FROM cart_items WHERE id = ?', [cartItemId]
    );
    if (cartItem.length === 0) {
      return res.status(404).json({ message: "Cart item not found" })
    }
    await db.query('UPDATE cart_items SET quantity = ? WHERE id = ?', [quantity, cartItemId]);
    res.status(200).json({ message: 'Cart item updated' });
  } catch (err) {
    res.status(500).json({ message: "Error in cart item update", error: err.message })
  }
}

exports.deleteCartItem = async (req, res) => {
  const cartItemId = req.params.cartItemId;
  try {
    const [cartItem] = await query('SELECT * FROM cart_items WHERE id=?', [cartItemId]);
    if (cartItem.length === 0) {
      return res.status(404).json({ message: "cart item not found" })
    }
    await db.query('DELETE FROM cart_items WHERE id = ?', [cartItemId]);
    res.status(200).json({ message: "cart item deleted successfully" })
  }
  catch (err) {
    res.status(500).json({ message: "error deleting cart item", err: err.message })
  }
}

exports.clearcart = async (req, res) => {
  const userId = req.params.userId;
  try {
    await db.query('DELETE FROM cart_items WHERE user_id=?', [userId]);
    return res.status(200).json({ message: "cart cleared" })
  }
  catch (err) {
    res.status(500).json({ message: 'error in clearing cart', error: err.message })
  }
}