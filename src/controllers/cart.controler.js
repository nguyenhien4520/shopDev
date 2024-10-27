const CartService = require('../services/cart.services')
const{SuccessResponse} = require('../core/success.response')

class CartController {
    static addToCart = async (req, res, next) => {
        new SuccessResponse({
            message: 'Create new cart successfully',
            metadata: await CartService.addToCart(req.body)
        }).send(res)
    }

    static update = async (req, res, next) => {
        new SuccessResponse({
            message: 'Update cart successfully',
            metadata: await CartService.addToCartV2(req.body)
        }).send(res)
    }

    static deleteItemUserCart = async (req, res, next) => {
        new SuccessResponse({
            message: 'Delete item successfully',
            metadata: await CartService.deleteItemUserCart(req.body)
        }).send(res)
    }

    static listItemUserCart = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list user cart successfully',
            metadata: await CartService.getUserCart(req.query)
        }).send(res)
    }

}

module.exports = CartController