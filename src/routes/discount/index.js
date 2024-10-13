const express = require('express');
const router = express.Router();
const discountControler = require('../../controllers/discount.controler')
const {asyncHandler} = require('../../auth/checkAuth');
const { authentication } = require('../../auth/authUtils');

router.get('/amount', asyncHandler(discountControler.getDiscountAmount))
router.get('/list_product_code', asyncHandler(discountControler.getAllDiscountCodeWithProduct))

router.use(authentication)

router.post('', asyncHandler(discountControler.createDiscount))
router.get('', asyncHandler(discountControler.getAllDiscountCode))

module.exports = router;