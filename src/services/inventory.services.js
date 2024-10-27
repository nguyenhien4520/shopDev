const {inventory} = require('../models/inventory.model')
const {BadRequestError, NotFoundError} = require('../core/error.response')
const { getProductById } = require('../models/repositories/product.repo')

class InventoryService {
    static async addStockToIventory({
        stock,
        productId,
        shopId,
        location = 'Hai Phong'
    }){
        const product = await getProductById(productId);
        if(!product){
            throw new NotFoundError('Product not found')
        }
        const query = {
            inventory_productId: productId,
            inventory_shopId: shopId,
        }, upsert = {
            $inc: {
                inventory_stock: stock,
            },
            $set: {
                inventory_location: location,
            }
        }, options = {upsert: true, new: true}
        return await inventory.findOneAndUpdate(query, upsert, options)
    }
}

module.exports = InventoryService;