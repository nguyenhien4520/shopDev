const ProductService = require("../services/product.services");
const ProductServiceV2 = require("../services/product.services.lxxx");
const {OK, CREATED, SuccessResponse} = require('../core/success.response');
const {Types} = require('mongoose')

class ProductController {

    // createProduct = async (req, res, next) => {
    //     new SuccessResponse({
    //         message: 'create new product successfully',
    //         metadata: await ProductService.createProduct(req.body.product_type, {
    //             ...req.body,
    //             product_shop: req.user.userId
    //         })
    //     }).send(res)
    // }

    createProduct = async (req, res, next) => {
        console.log('debug::::::::::::::::::::::::::::::::',req.user);
        new SuccessResponse({
            message: 'create new product successfully',
            metadata: await ProductServiceV2.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.user.userId
            })
        }).send(res)
    }

    updateProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'update product successfully',
            metadata: await ProductServiceV2.updateProduct(req.body.product_type,{
                ...req.body,
                product_shop: req.user.userId
            }, req.params.product_id)
        }).send(res)
    }

    getAllDraftForShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'get list draft success',
            metadata: await ProductServiceV2.findAllDraftsForShop({
                product_shop: req.user.userId
            })
        }).send(res)
    }
   
    getAllPublishedForShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'get list draft success',
            metadata: await ProductServiceV2.findAllPublishedForShop({
                product_shop: req.user.userId
            })
        }).send(res)
    }

     publishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'published product success',
            metadata: await ProductServiceV2.publishProductByShop({
                product_shop: req.user.userId,
                product_id: req.params.id,
            })
        }).send(res)
    }

    unpublishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'unpublished product success',
            metadata: await ProductServiceV2.unpublishProductByShop({
                product_shop: req.user.userId,
                product_id: req.params.id,
            })
        }).send(res)
    }
    
    getListSearchProducts = async (req, res, next) => {
        new SuccessResponse({
            message: 'get list search products success',
            metadata: await ProductServiceV2.seachProducts(req.params)
        }).send(res)
    }

    getAllProducts = async (req, res, next) => {
        new SuccessResponse({
            message: 'get all products success',
            metadata: await ProductServiceV2.findAllProducts(req.query)
        }).send(res)
    }

    getProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'get detail product success',
            metadata: await ProductServiceV2.findProduct({
                product_id: req.params.product_id,

            })
        }).send(res)
    }


}

module.exports = new ProductController();