const express = require('express');
const router = express.Router();
const productControler = require('../../controllers/product.controler')
const {asyncHandler} = require('../../auth/checkAuth');
const { authentication } = require('../../auth/authUtils');


router.get('/search/:keySearch',asyncHandler(productControler.getListSearchProducts))


router.use(authentication)
router.post('',asyncHandler(productControler.createProduct))
router.post('/published/:id',asyncHandler(productControler.publishProductByShop))
router.post('/unpublished/:id',asyncHandler(productControler.unpublishProductByShop))



router.get('/drafts/all',asyncHandler(productControler.getAllDraftForShop))
router.get('/published/all',asyncHandler(productControler.getAllPublishedForShop))


module.exports = router;