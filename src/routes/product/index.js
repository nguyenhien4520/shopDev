const express = require('express');
const router = express.Router();
const productControler = require('../../controllers/product.controler')
const {asyncHandler} = require('../../auth/checkAuth');
const { authentication } = require('../../auth/authUtils');


router.get('/search/:keySearch',asyncHandler(productControler.getListSearchProducts))
router.get('/',asyncHandler(productControler.getAllProducts))
router.get('/:product_id',asyncHandler(productControler.getProduct))

router.use(authentication)
router.post('',asyncHandler(productControler.createProduct))
router.patch('/:product_id',asyncHandler(productControler.updateProduct))

router.get('/drafts/all',asyncHandler(productControler.getAllDraftForShop))
router.get('/published/all',asyncHandler(productControler.getAllPublishedForShop))

router.post('/published/:id',asyncHandler(productControler.publishProductByShop))
router.post('/unpublished/:id',asyncHandler(productControler.unpublishProductByShop))

module.exports = router;