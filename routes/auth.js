const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/add',authController.addProduct);
router.post('/', authController.addItemToCart);
router.get('/:userId', authController.getCartItems);
router.put('/:cartItemId',authController.updateCartItem);
router.delete('./:cartItemId',authController.deleteCartItem);
router.delete('/user/:userId',authController.clearcart)

module.exports = router;
