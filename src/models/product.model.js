const { size } = require('lodash');
const { model, Schema, Types } = require('mongoose');
const slugify = require('slugify');
const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'Products';

const productSchema = new Schema({
    product_name: { type: String, required: true },
    product_slug: {type: String},
    product_thumb: { type: String, required: true },
    product_description: { type: String, },
    product_price: { type: Number, required: true },
    product_quantity: { type: Number, required: true },
    product_type: { type: String, required: true, enum: ['Electronic', 'Clothing', 'Furniture'] },
    product_shop:  {type: Schema.Types.ObjectId, ref: 'Shop'},
    product_attributes: { type: Schema.Types.Mixed, required: true, },
    product_ratingAverage: { 
        type: Number,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0'],
        default: 4.5,
        set: (val) => Math.round(val*10)/10
    },
    product_variation: {type: Array, default: []},
    isDraft: {type: Boolean, default: true, index: true, select:false},
    isPublished: {type: Boolean, default: false, index: true, select:false},

}, {
    collection: COLLECTION_NAME,
    timestamps: true
})
// create index
productSchema.index({product_name:'text',product_description:'text'})
productSchema.pre('save', function(next){
    this.product_slug = slugify(this.product_name, { lower: true });
    next();
})

const clothingSchema = new Schema({
    brand: { type: String, required: true},
    size: String,
    material: String,
},{
    collection: 'Cloths',
    timestamps: true
})

const electronicSchema = new Schema({
    manufactuer: { type: String, required: true},
    model: String,
    color: String,
},{
    collection: 'Electronics',
    timestamps: true
})

const furnitureSchema = new Schema({
    brand: { type: String, required: true},
    size: String,
    material: String,
},{
    collection: 'Furnitures',
    timestamps: true
})

module.exports = {
    product: model(DOCUMENT_NAME, productSchema),
    clothing: model('Cloth', clothingSchema),
    electronic: model('Electronic', electronicSchema),
    furniture: model('Furniture', furnitureSchema)
}
