const { product, clothing, electronic, furniture } = require('../product.model')
const { Types } = require('mongoose')
const { getSelectData, UnGetSelectData } = require('../../utils/')

const findAllDraftForShop = async ({ query, limit, skip }) => {
    return await queryProduct({ query, limit, skip });
}

const findAllPublishedForShop = async ({ query, limit, skip }) => {
    return await queryProduct({ query, limit, skip });
}

const queryProduct = async ({ query, limit, skip }) => {
    return await product.find(query)
        .populate('product_shop', 'name email -_id')
        .sort({ updateAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec()
}

const publishProductByShop = async ({ product_shop, product_id }) => {
    const foundShop = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    })
    if (!foundShop) return null;

    foundShop.isDraft = false;
    foundShop.isPublished = true;

    const { modifiedCount } = await foundShop.updateOne(foundShop)
    return modifiedCount
}

const unpublishProductByShop = async ({ product_shop, product_id }) => {
    const foundShop = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    })
    if (!foundShop) return null;

    foundShop.isDraft = true;
    foundShop.isPublished = false;

    const { modifiedCount } = await foundShop.updateOne(foundShop)
    return modifiedCount
}

const seachProductsByUser = async ({ keySearch }) => {
    const regexSearch = new RegExp(keySearch);
    const results = await product.find({
        isDraft: false,
        $text: { $search: regexSearch }
    },
        { score: { $meta: 'textScore' } }
    )
        .sort({ score: { $meta: 'textScore' } })
        .lean()

    return results;
}
const findAllProducts = async ({ limit, sort, page, filter, select }) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
    const products = await product.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelectData(select))
        .lean()
    return products
}

const findProduct = async ({ product_id, unSelect }) => {
    return await product.findById(product_id)
        .select(UnGetSelectData(unSelect))
        .lean()
}

const getProductById = async (productId) => {
    return await product.findOne({ _id: productId })
}

const updateProductById = async ({
    product_id,
    bodyUpdate,
    model,
    isNew = true
}) => {
    return await model.findByIdAndUpdate(product_id, bodyUpdate, { new: isNew })
}

const checkProductByServer = async (products) => {
    return await Promise.all(products.map(async product => {
        const foundProduct = await getProductById(product.productId)
        console.log("foundProduct[1]", foundProduct);
        if (foundProduct) {
            return {
                price: foundProduct.product_price,
                quantity: product.quantity,
                productId: product.productId
            }
        }
    }))
}

module.exports = {
    findAllDraftForShop,
    publishProductByShop,
    findAllPublishedForShop,
    unpublishProductByShop,
    seachProductsByUser,
    findAllProducts,
    findProduct,
    updateProductById,
    getProductById,
    checkProductByServer
}