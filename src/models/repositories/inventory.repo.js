const{Types} = require('mongoose');
const inventory = require('../inventory.model');
const { assign } = require('lodash');
const { convertToObjectIdMongoose } = require('../../utils');

const insertInventory = async({productId, shopId, stock, location = 'unknown'}) => {
    return await inventory.create({
        inven_productId: new Types.ObjectId(productId),
        inven_shopId: new Types.ObjectId(shopId),
        inven_stock: stock,
        inven_location: location
    })
}

const reservationInventory = async ({productId, quantity, cartId})=>{
    const query = {
        iven_productId: convertToObjectIdMongoose(productId),
        inven_stock: {$gte: quantity}
    }, upsert= {
        $inc: {
            inven_stock: -quantity
        },
        $push: {
            inven_reservation: {cartId, quantity, createdOn: new Date()}
        }
    }, options = {
        upsert: true,
        new: true
    }
    return await inventory.findOne(query, upsert, options)
}

module.exports = {
    insertInventory,
    reservationInventory
}