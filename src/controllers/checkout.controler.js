const CheckoutService = require('../services/checkout.serveices')
const{SuccessResponse} = require('../core/success.response')

class CartController {
    static checkoutReview = async (req, res, next) => {
        new SuccessResponse({
            message: 'OK',
            metadata: await CheckoutService.checkoutReview(req.body)
        }).send(res)
    }

}

module.exports = CartController