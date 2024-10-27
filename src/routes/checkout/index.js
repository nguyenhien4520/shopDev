const express = require('express');
const router = express.Router();
const checkoutControler = require('../../controllers/checkout.controler')
const {asyncHandler} = require('../../auth/checkAuth');
const { authentication } = require('../../auth/authUtils');

router.post('/review', asyncHandler(checkoutControler.checkoutReview))

module.exports = router;