/*
Discount service
1. Generate discount code [Shop | Admin]
2. Get discount amount [User]
3. Get all discount codes [Shop | User]
4. Verify discount code [User]
5. Delete discount code [Shop | Admin]
6. Cancel discount code [User]
*/
const { BadRequestError, NotFoundError } = require('../core/error.response');
const { Types, model } = require('mongoose')
const discount = require('../models/discount.model');
const { convertToObjectIdMongoose } = require('../utils');
const { findAllDiscountCodeUnSelect, checkDiscountExists } = require('../models/repositories/discount.repo');
const { findAllProducts } = require('../models/repositories/product.repo');
const { filter } = require('compression');

class DiscountService {

    static async createDiscountCode(payload) {
        const {
            code, startDate, endDate, isActive, shopId, minOrderValue, productIds, appliesTo,
            name, description, type, value, maxValue, usersUsed, maxUses, usesCount, maxUsesPerUser
        } = payload;

        if (new Date() > new Date(endDate)) {
            throw new BadRequestError('Discount code has expired');
        }

        if (new Date(startDate) >= new Date(endDate)) {
            throw new BadRequestError('Start date must be before end date');
        }
        const foundDiscount = await discount.findOne({
            discount_code: code,
            discount_shopId: new Types.ObjectId(shopId),
        }).lean();
        if (foundDiscount) {
            throw new BadRequestError('Discount code has already been created');
        }
        const newDiscount = await discount.create({
            discount_name: name,
            discount_description: description,
            discount_type: type,
            discount_value: value,
            discount_code: code,
            discount_min_order_values: minOrderValue || 0,
            discount_max_value: maxValue,
            discount_start_date: new Date(startDate),
            discount_end_date: new Date(endDate),
            discount_max_uses: maxUses,
            discount_uses_count: usesCount,
            discount_users_used: usersUsed,
            discount_shopId: shopId,
            discount_max_uses_per_user: maxUsesPerUser,
            discount_is_active: isActive,
            discount_applies_to: appliesTo,
            discount_product_ids: appliesTo === 'all' ? [] : productIds
        })
        return newDiscount;
    }

    static async getAllDiscountCodeWithProduct({
        code, shopId, userId, page, limit,
    }) {
        const foundDiscount = await discount.findOne({
            discount_code: code,
            discount_shopId: convertToObjectIdMongoose(shopId),
        }).lean()
        if (!foundDiscount || !foundDiscount.discount_is_active) {
            throw new NotFoundError('Discount not found or not active');
        }
        const { discount_product_ids, discount_applies_to } = foundDiscount
        let products

        if (discount_applies_to === 'all') {
            products = await findAllProducts({
                limit: +limit,
                page: +page,
                sort: 'ctime',
                filter: {
                    isPublished: true,
                    product_shop: convertToObjectIdMongoose(shopId)
                },
                select: ['product_name']
            })
        }
        if (discount_applies_to === 'specific') {
            products = await findAllProducts({
                limit: +limit,
                page: +page,
                sort: 'ctime',
                filter: {
                    _id: {$in: discount_product_ids},
                    isPublished: true,
                    product_shop: convertToObjectIdMongoose(shopId)
                },
                select: ['product_name']
            })
        }

        console.log("products", products);
        return products;

    }

    static async getAllDiscountCodeByShop({ limit, page, shopId }) {
        const discounts = await findAllDiscountCodeUnSelect({
            limit: +limit,
            page: +page,
            filter: {
                discount_shopId: convertToObjectIdMongoose(shopId),
                discount_is_active: true
            },
            unselect: ['__v', 'discount_shopId'],
            model: discount
        })
        console.log("discounts", discounts);
        return discounts
    }

    /*
    Apply discount code
    products = [
        {
            productId,
            shopId,
            quantity,
            name,
            price
        }
    ]
    */

    static async getDiscountAmount({ code, userId, shopId, products }) {
        const foundDiscount = await discount.findOne({
            discount_code: code,
            discount_shopId: convertToObjectIdMongoose(shopId),
        }).lean()

        if (!foundDiscount) {
            throw new NotFoundError('Discount not found');
        }

        const {
            discount_is_active,
            discount_max_uses,
            discount_end_date,
            discount_min_order_values,
            discount_max_uses_per_user,
            discount_users_used,
            discount_type,
            discount_value,
            discount_uses_count,

        } = foundDiscount
        if (!discount_is_active) {
            console.log('active:::', discount_is_active);
            throw new NotFoundError('[1]Discount expired');
        }
        if (!discount_max_uses) { throw new NotFoundError('Discount is out'); }
        if (new Date() > new Date(discount_end_date)) { throw new NotFoundError('[2]Discount had expired') }
        let totalOrder = 0
        if (discount_min_order_values > 0) {
            totalOrder = products.reduce((acc, product) => {
                return acc + (product.quantity * product.price)
            }, 0)
            if (totalOrder < discount_min_order_values) { throw new NotFoundError(`Discount require a minium order value of ${discount_min_order_values}`) }
        }
        if (discount_max_uses_per_user > 0) {
            const userUsedDiscount = discount_users_used.find(user => user.userId === userId)
            if (userUsedDiscount) {
                throw new NotFoundError(`You had used discount code ${code}`)
            }
        }

        const amount = discount_type === 'fixed_amount' ? discount_value : totalOrder * (discount_value / 100);
        const result = await discount.updateOne({_id: foundDiscount._id},{
            $inc: {
                discount_max_uses: -1,
                discount_uses_count: 1
            },
            $push: {
                discount_users_used: userId
            }
        })

        return {
            totalOrder,
            discount: amount,
            totalPrice: totalOrder - amount,
        }

    }

    static async deleteDiscountCode({ shopId, code }) {
        const deleted = await discount.findOneAndDelete({
            discount_code: code,
            discont_shopId: convertToObjectIdMongoose(shopId)
        })
        return deleted
    }

    // Cancel discount code
    static async cancelDiscountCode({ shopId, code, userId }) {
        const foundDiscount = checkDiscountExists({
            model: discount,
            filter: {
                discount_code: code,
                discont_shopId: convertToObjectIdMongooseObjectId(shopId),
            }
        })
        if (!foundDiscount) throw new NotFoundError('Discount code not found')
        const result = await discount.findByIdAndUpdate(foundDiscount._id, {
            $pull: {
                discount_users_used: userId
            },
            $inc: {
                discount_max_uses_per_user: 1,
                discount_uses_count: -1
            }
        })

        return result;
    }

}

module.exports = DiscountService;