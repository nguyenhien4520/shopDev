const {model, Schema} = require('mongoose')

const DOCUMENT_NAME = 'Order'
const COLLECTION_NAME = 'Orders'

const orderSchema = new Schema({
    order_userId: {type: Number, required: true},
    order_checkout: {type: Object, default: {}},
    /*
        order_checkout = {
            totalPrice,
            feeShhip,
            totalApplyDiscount
        }
    */
   order_shipping: {type: Object, default:{}},
    /*
        {
            street,
            city,
            country
        }
    */
   order_payment: {type: Object, default:{}},
   order_product: {type: Array, required: true},
   order_trackingNumber: {type: String, default: '#0000112022024'},
   order_status: {type: String, default: 'pending', enum: ['pending', 'comfirmed', 'shipped', 'delivered', 'cancelled']}
},{
    collection: COLLECTION_NAME,
    timestamps: true
})

module.exports = {order: model(DOCUMENT_NAME, orderSchema)}