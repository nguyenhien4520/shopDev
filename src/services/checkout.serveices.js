const { findCartById } = require("../models/repositories/cart.repo");
const {NotFoundError, BadRequestError} = require('../core/error.response');
const { checkProductByServer } = require("../models/repositories/product.repo");
const { getDiffieHellman } = require("crypto");
const { getDiscountAmount } = require("./discount.services");
const { product } = require("../models/product.model");
const { acquireLock, releaseLock } = require("./redis.service");
const {order} = require('../models/order.model')
/*
payload
{
    cartId
    userId
    shop_order_id: [
        {  
         // order cua shop 1
            shopId:
            shop_discounts: []
            item_products: [
                {
                    price:
                    quantity:
                    productId:
                }
            ]
        },
        { 
         // order cua shop 2
            shopId:
            shop_discounts: [{
                shopId
                discountId
                codeId
            }]
            item_products: [
                {
                    price:
                    quantity:
                    productId:
                }
            ]
        }
    ]
}
 */
class CheckoutService {
    static async checkoutReview({
        cartId, userId, shop_order_ids
    }){
        // check cart co ton tai khong
        const foundCart = await findCartById(cartId)
        if(!foundCart){
            throw new NotFoundError('Cart not found')
        }
        const checkout_order = {
            totalPrice: 0, // tong tien hang
            feeShip: 0, // phi ship
            totalDiscount: 0, // tong giam gia
            totalCheckout: 0 // tong tien phai tra
        }, shop_order_ids_new = [] // giống shop_order_ids nhung lưu tong tiên cua tung san pham price * quantity

        // tinh tong tien bill
        for (let i = 0; i < shop_order_ids.length; i++) {
            const { shopId, shop_discounts=[], item_products=[] } = shop_order_ids[i]
            console.log("[promise", item_products);
            // check product
            const checkProductServer = await checkProductByServer(item_products);
            console.log("checkProductServer:::",checkProductServer);
            if(!checkProductServer[0]){
                throw new BadRequestError('Order wrong')
            }
            // tong tien don hang
            const totalCheckout = (await checkProductServer).reduce((acc, product) => {
                return acc + (product.price * product.quantity)
            },0)

            // tong tien truoc khi xu ly
            checkout_order.totalPrice += totalCheckout
            const itemCheckout = {
                shopId,
                shop_discounts,
                priceRaw: totalCheckout,
                priceApplyDiscount: totalCheckout,
                item_products: checkProductServer
            }

            // neu shop_discounts ton tai > 0  check xem co hop le khong
            if(shop_discounts.length>0){
                // gia su chi co mot discount
                // get amount of discount
                const {totalPrice=0, discount=0} = await getDiscountAmount({
                    code: shop_discounts[0].codeId,
                    userId,
                    shopId,
                    products: checkProductServer
                })
                checkout_order.totalDiscount+=discount
                // neu tien giam gia lon hon 0
                if(discount > 0){
                    itemCheckout.priceApplyDiscount = totalCheckout - discount
                }
            }

            // tong thanh toan cuoi cung
            checkout_order.totalCheckout += itemCheckout.priceApplyDiscount
            shop_order_ids_new.push(itemCheckout)
        }

        return {
            shop_order_ids,
            shop_order_ids_new,
            checkout_order
        }
    }

    // oder
    static async orderByUser({
        shop_order_ids,
        cartId,
        userId,
        user_address = {},
        user_payment = {},
    }){
        const {shop_order_ids_new, checkout_order} = await CheckoutService.checkoutReview({
            cartId,
            userId,
            shop_order_id
        })

        // check lai mot lan nua xem co vuot ton kho hay khong
        // get new array products
        const products = shop_order_ids_new.flatMap(order => order.item_products)
        console.log("[1]:::::", products)
        const acquireProducts = []
        for (let i = 0; i < products.length; i++) {
            const {productId, quantity} = products[i];
            const keyLock = await acquireLock(productId, quantity, cartId)
            acquireProducts.push(keyLock ? true : false)
            if(keyLock){
                await releaseLock(keyLock)
            }
        }

        if(acquireProducts.includes(false)){
            throw new BadRequestError('Mot so san pham da duoc cap nhat, quay lai gio hang')
        }
        const newOrder = await order.create({
            order_userId: userId,
            order_checkout: checkout_order,
            order_shipping: user_address,
            order_payment: user_payment,
            order_products: shop_order_ids_new,
        })
        // neu order thanh cong thi remove san pham trong gio hang
        if(newOrder){

        }
        return newOrder
    }
}
module.exports = CheckoutService;