const DiscountService = require('../services/discount.services')
const {SuccessResponse} = require('../core/success.response')

class DiscountControler {
    static createDiscount = async (req, res, next) => {
        new SuccessResponse({
            message: 'Successfully created discount',
            metadata: await DiscountService.createDiscountCode({
                ...req.body,
                 shopId: req.user.userId
            })
        }).send(res)
    }

    static getAllDiscountCode = async (req, res, next) => {
        new SuccessResponse({
            message: 'Successfully get all discount',
            metadata: await DiscountService.getAllDiscountCodeByShop({
                ...req.query,
                 shopId: req.user.userId
            })
        }).send(res)
    }

    static getDiscountAmount = async (req, res, next) => {
        new SuccessResponse({
            message: 'Successfully get discount amount',
            metadata: await DiscountService.getDiscountAmount({
                ...req.body,
            })
        }).send(res)
    }

    static getAllDiscountCodeWithProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Successfully get all products with discount code',
            metadata: await DiscountService.getAllDiscountCodeWithProduct({
                ...req.query,
            })
        }).send(res)
    }
}

module.exports = DiscountControler

