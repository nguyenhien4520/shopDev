
const{model, Schema} = require('mongoose');

const DOCUMENT_NAME = 'Discount';
const COLLECTION_NAME = 'Discounts';

const discountSchema = new Schema({
    discount_name: {type: String, require: true},
    discount_decription: {type: String, require: true},
    discount_type: {type: String, enum:['fixed_amount', 'percentage'], default: 'fixed_amount'},
    discount_value: {type: Number, require: true}, // 100.000, 10%
    discount_code: {type: String, require: true},
    discount_start_date: {type: Date, require: true},
    discount_end_date: {type: Date, require: true},
    discount_max_uses: {type: Number, require: true}, // so lương discount
    discoutn_uses_count: {type: Number, require: true}, // so discount da dung
    discount_users_used: {type: Number, require: true}, //cac user da dung discount
    discount_max_uses_per_user: {type: Number, require},// so lương discount tôi da cho 1 user
    discount_min_order_values: {type: Number, require: true}, // 
    discont_shopId: {type: Schema.Types.ObjectId, ref: 'Shop'},
    discount_is_active: {type: Boolean, require: true},
    discount_applies_to: {type: String, require: true, enum: ['all', 'specific']},
    discount_product_ids: {type: Array, default: []} // id các san pham duoc ap dung discount
},{
    timestamps: true,
    collection: COLLECTION_NAME
})

module.exports = model(DOCUMENT_NAME, discountSchema);


