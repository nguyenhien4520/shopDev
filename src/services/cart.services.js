const { NotFoundError, BadRequestError } = require('../core/error.response')
const { cart } = require('../models/cart.model')
const { getProductById } = require('../models/repositories/product.repo')

class CartService {
    // start repo
    static async createUserCart({ userId, product }) {
        const foundProduct = await getProductById(product.productId)
        product.name = foundProduct.product_name
        product.price = foundProduct.product_price
        const query = { cart_userId: userId, cart_state: 'active' },
            updateOrInsert = {
                $addToSet: {
                    cart_products: product
                },
                $inc: {
                    cart_count_product: product.quantity
                }
            }, options = {
                upsert: true,
                new: true
            }
        return await cart.findOneAndUpdate(query, updateOrInsert, options)
    }

    static async updateUserCartQuantity({ userId, product }) {
        const {productId, quantity} = product
        const query = {
            cart_userId: userId,
            'cart_products.productId': productId,
            cart_state: 'active'
        },
            updatSet = {
                $inc: {
                    'cart_products.$.quantity': quantity,
                     cart_count_product: quantity
                }
            }, options = {
                upsert: true,
                new: true
            }
        return await cart.findOneAndUpdate(query, updatSet, options)
    }
    // end repo
    static async addToCart({ userId, product = {} }) {
        const userCart = await cart.findOne({ cart_userId: userId, cart_state: 'active' });
    
        if (!userCart) {
            // Nếu chưa có giỏ hàng, tạo mới giỏ hàng với sản phẩm
            return await CartService.createUserCart({ userId, product });
        }
    
        // Nếu giỏ hàng đã tồn tại nhưng chưa có sản phẩm nào
        if (!userCart.cart_products.length) {
            userCart.cart_products.push(product);
            userCart.cart_count_product += product.quantity;
            return await userCart.save();
        }
    
        // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng hay chưa
        const existingProduct = userCart.cart_products.find(p => p.productId === product.productId);
    
        if (existingProduct) {
            // Nếu sản phẩm đã tồn tại, cập nhật số lượng
            return await CartService.updateUserCartQuantity({ userId, product });
        } else {
            // Nếu sản phẩm chưa tồn tại, thêm sản phẩm mới vào giỏ hàng
            const updateSet = {
                $addToSet: { cart_products: product },
                $inc: { cart_count_product: product.quantity }
            };
            const options = { new: true };
            return await cart.findOneAndUpdate(
                { cart_userId: userId, cart_state: 'active' },
                updateSet,
                options
            );
        }
    }


    // update cart
/*
    shop_order_ids[
        shopId:
        item_product: [
            quantity:
            price:
            shopId:
            old_quantity:
            product_id:
        ]
        version:
    ]
*/
    static async addToCartV2({userId, shop_order_ids}){
        console.log({userId, shop_order_ids});
        const {productId, quantity, old_quantity} = shop_order_ids[0]?.item_products[0]
        // chech product
        const foundProduct = await getProductById(productId)
        if(!foundProduct){
            throw new NotFoundError('Product not found')
        }
        if(foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId){
            throw new NotFoundError('Product do not belong to shop')
        }
        if(quantity===0){
            // delete
            return CartService.deleteItemUserCart({userId, productId})
        }
        return CartService.updateUserCartQuantity({
            userId,
            product: {
                productId,
                quantity: quantity - old_quantity
            }
        })
    }

    static async deleteItemUserCart({userId, productId}){
        const userCart = await cart.findOne({ cart_userId: userId, cart_state: 'active' });
        const existingProduct = userCart.cart_products.find(p => p.productId === productId);
        const query = {cart_userId: userId, cart_state: 'active'},
        updateSet = {
            $pull: {
                cart_products: {productId}
            },
            $inc: {
                cart_count_product: -existingProduct.quantity
            }
        }
        const deleteCart = await cart.updateOne(query, updateSet)
        return deleteCart
    }

    static async getUserCart({userId}){
        console.log("id",userId);
        return await cart.findOne({cart_userId: +userId, cart_state: 'active'}).lean();
    }
}

module.exports = CartService