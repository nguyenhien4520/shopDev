const express = require('express');
const router = express.Router();
const cartControler = require('../../controllers/cart.controler')
const {asyncHandler} = require('../../auth/checkAuth');
const { authentication } = require('../../auth/authUtils');

router.post('/', asyncHandler(cartControler.addToCart))
router.post('/update', asyncHandler(cartControler.update))
router.delete('', asyncHandler(cartControler.deleteItemUserCart))
router.get('', asyncHandler(cartControler.listItemUserCart))

module.exports = router;