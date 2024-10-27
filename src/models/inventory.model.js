
const{model, Schema} = require('mongoose');

const DOCUMENT_NAME = 'Iventory';
const COLLECTION_NAME = 'Inventories';

const inventorySchema = new Schema({
   inven_productId: {type: Schema.Types.ObjectId, ref: 'Product'},
   inven_location: {type: String, default: 'unknown'},
   inven_stock: {type: Number, require: true},
   inven_shopId: {type: Schema.Types.ObjectId, ref: 'Shop'},
   inven_reservation: {type: Array, default: []} /* [{cartId: , quantity: 1, createdOn: }, .... ]*/

},{
    timestamps: true,
    collection: COLLECTION_NAME
})

module.exports ={inventory: model(DOCUMENT_NAME, inventorySchema)} 


