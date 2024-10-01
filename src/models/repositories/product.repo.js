const {product, clothing, electronic, furniture} = require('../product.model')
const {Types} = require('mongoose')

const findAllDraftForShop = async ({query, limit, skip}) => {
    return await product.find(query)
    .populate('product_shop', 'name email -_id')
    .sort({updateAt: -1})
    .skip(skip)
    .limit(limit)
    .lean()
    .exec()
}

const findAllPublishedForShop = async ({query, limit, skip}) => {
    return await product.find(query)
    .populate('product_shop', 'name email -_id')
    .sort({updateAt: -1})
    .skip(skip)
    .limit(limit)
    .lean()
    .exec()
}

const publishProductByShop = async ({product_shop, product_id}) => {
    const foundShop = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    })
    if(!foundShop) return null;

    foundShop.isDraft = false;
    foundShop.isPublished = true;

    const {modifiedCount} = await foundShop.updateOne(foundShop)
    return modifiedCount
}

const unpublishProductByShop = async ({product_shop, product_id}) => {
    const foundShop = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    })
    if(!foundShop) return null;

    foundShop.isDraft = true;
    foundShop.isPublished = false;

    const {modifiedCount} = await foundShop.updateOne(foundShop)
    return modifiedCount
}

const seachProductsByUser = async ({keySearch})=>{
    const regexSearch = new RegExp(keySearch);
    const results = await product.find({
        isDraft: false,
        $text: {$search: regexSearch}
    },
    {score: {$meta: 'textScore'}}
)
    .sort({score: {$meta: 'textScore'}})
    .lean()

    return results;
}

module.exports = {
    findAllDraftForShop,
    publishProductByShop,
    findAllPublishedForShop,
    unpublishProductByShop,
    seachProductsByUser
}