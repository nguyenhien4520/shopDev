const keytokenModel = require('../models/keytoken.model.level_1');
const { Types } = require('mongoose')
class KeyTokenService {

    static createKeyToken = async ({userId, publicKey, privateKey, refreshToken})=>{
        try {
            // level 0
            // const tokens = await keytokenModel.create({
            //     user: userId,
            //     publicKey,
            //     privateKey
            // })
            // return tokens ? tokens.publicKey : null

            // level xxx 
            console.log('refresh token :::::: ', refreshToken);
            const filter = {user: userId}, update = {publicKey, privateKey, refreshTokensUsed: [], refreshToken},
            options = {new: true, upsert: true}
            const tokens = await keytokenModel.findOneAndUpdate(filter, update, options)
            return tokens? tokens.publicKey : null
        } catch (error) {
            return error
        }
    }

    static findByUserId = async (userId) => {
        return await keytokenModel.findOne({user: new Types.ObjectId(userId)})
    }

    static removeById =  async (id) => {
        return await keytokenModel.deleteOne(id)
    }
    static findByRefreshtokenUsed = async (refreshToken) => {
        return await keytokenModel.findOne({refreshTokensUsed: refreshToken})
    }
    static deleteKeyById = async (userId) => {
        return await keytokenModel.deleteOne({user: userId})
    }
    static findByRefreshtoken = async (refreshToken) => {
        return await keytokenModel.findOne({refreshToken})
    }
}


module.exports = KeyTokenService;