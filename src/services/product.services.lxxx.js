const { product, clothing, electronic, furniture } = require('../models/product.model')
const { BadRequestError } = require('../core/error.response')
const { findAllDraftForShop, publishProductByShop,
    findAllPublishedForShop, unpublishProductByShop,
    seachProductsByUser } = require('../models/repositories/product.repo')
class ProductFactory {
    /*
    type: clothing, electronic
    payload: {}
    */
    static productRegistry = {}; //key-class
    static registerProductType(type, classRef) {
        ProductFactory.productRegistry[type] = classRef
    }
    static async createProduct(type, payload) {
        const productClass = ProductFactory.productRegistry[type];
        if (!productClass) throw new BadRequestError(`Invalid product type ${type}`)
        return new productClass(payload).createProduct()

        // switch (type) {
        //     case 'Electronic':
        //         return new Electronics(payload).createProduct()
        //     case 'Clothing':
        //         return new Clothing(payload).createProduct()
        //     default:
        //         throw new BadRequestError(`Invalid product type ${type}`)
        // }
    }

    static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isDraft: true }
        return await findAllDraftForShop({ query, limit, skip })
    }

    static async findAllPublishedForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isPublished: true }
        return await findAllPublishedForShop({ query, limit, skip })
    }

    static async publishProductByShop({ product_shop, product_id }) {
        return await publishProductByShop({ product_shop, product_id })
    }

    static async unpublishProductByShop({ product_shop, product_id }) {
        return await unpublishProductByShop({ product_shop, product_id })
    }

    static async seachProducts({keySearch}) {
        return await seachProductsByUser({keySearch})
    }
}

class Product {
    constructor({
        product_name, product_thumb, product_description, product_price,
        product_quantity, product_type, product_shop, product_attributes
    }) {
        this.product_name = product_name
        this.product_thumb = product_thumb
        this.product_description = product_description
        this.product_price = product_price
        this.product_quantity = product_quantity
        this.product_type = product_type
        this.product_shop = product_shop
        this.product_attributes = product_attributes
    }

    async createProduct(product_id) {
        return await product.create({ ...this, _id: product_id })
    }
}

class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothing.create({
            ...this.product_attributes,
            product_shop: this.product_shop,
        })
        if (!newClothing) throw new BadRequestError('create new clothing error')
        const newProduct = super.createProduct()
        if (!newProduct) throw new BadRequestError('create new product error')
        return newProduct
    }
}

class Electronics extends Product {
    async createProduct() {
        const newElectronic = await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop,
        })
        if (!newElectronic) throw new BadRequestError('create new clothing error')
        const newProduct = super.createProduct(newElectronic._id)
        if (!newProduct) throw new BadRequestError('create new product error')
        return newProduct
    }
}

class Furniture extends Product {
    async createProduct() {
        const newFurniture = await furniture.create({
            ...this.product_attributes,
            product_shop: this.product_shop,
        })
        if (!newFurniture) throw new BadRequestError('create new clothing error')
        const newProduct = super.createProduct(newFurniture._id)
        if (!newProduct) throw new BadRequestError('create new product error')
        return newProduct
    }
}

ProductFactory.registerProductType('Clothing', Clothing)
ProductFactory.registerProductType('Electronic', Electronics)
ProductFactory.registerProductType('Furniture', Furniture)

module.exports = ProductFactory;