const{model, Schema} = require('mongoose')

const DOCUMENT_NAME = 'Cart'
const COLLECTION_NAME = 'Carts'

const cartSchema = new Schema({
    cart_state: {
        type: String,
        enum: ['active', 'completed', 'failed', 'pending'],
        default: 'active'
    },
    cart_products: {type: Array, required: true, default: []},
    /*
    [{
        productId:
        shopId:
        quantity:
        name:
        price:
    }]
    */
   cart_count_product: {type: Number, required: true, default:0},
   cart_userId: {type: Number, required: true}
},{
    collection: COLLECTION_NAME,
    timestamps: true
})

module.exports = {cart: model(DOCUMENT_NAME, cartSchema)}