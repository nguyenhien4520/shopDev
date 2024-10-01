const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.services.level_1");
const { createTokenPair, verifyJWT } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const { BadRequestError, ConflicRequestError, AuthFailureError, ForbiddenError } = require('../core/error.response');
const { findByEmail } = require("./shop.services");

const roleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

class AccessService {
    // handle refresh token v2 toi uu hon
    static handleRefreshTokenV2 = async ({ keyStore, user, refreshToken }) => {
        const { userId, email } = user
        if (keyStore.refreshTokensUsed.includes(refreshToken)) {
            await KeyTokenService.deleteKeyById(userId)
            throw new ForbiddenError('something wrong happened, please login again!!!!')
        }
        if (keyStore.refreshToken != refreshToken) {
            throw new AuthFailureError('shop not registered')
        }
        const foundShop = await findByEmail({ email })
        if (!foundShop) { throw new AuthFailureError('shop not registered') }

        // tạo 1 cap token moi
        const tokens = await createTokenPair({ userId, email }, keyStore.publicKey, keyStore.privateKey)
        
        // update token
        await keyStore.updateOne({
            $set: {
                refreshToken: tokens.refreshToken
            },
            $addToSet: {
                refreshTokenUsed: refreshToken
            }
        })
        return {
            user,
            tokens
        }
    }


    // handle refresh token v1
    static handleRefreshTokenV1 = async (refreshToken) => {
        console.log('kiem tra refresh token: ', refreshToken);
        // check xem refresh token nay da duoc su dung chua
        const foundToken = await KeyTokenService.findByRefreshtokenUsed(refreshToken)
        console.log('foundToken :::::::', foundToken)
        if (foundToken) {
            // decode xem la user nao
            const { userId, email } = await verifyJWT(refreshToken, foundToken.privateKey)
            console.log('[1]', { userId, email });
            await KeyTokenService.deleteKeyById(userId)
            throw new ForbiddenError('something wrong happened, please login again!!!!')
        }
        // neu refresh token do chưa duoc su dung
        const holderToken = await KeyTokenService.findByRefreshtoken(refreshToken)
        console.log('holder token chua update: ', holderToken)
        if (!holderToken) { throw new AuthFailureError('shop not registered') }

        // verify refresh token
        const { userId, email } = await verifyJWT(refreshToken, holderToken.privateKey)
        console.log('[2]', { userId, email });

        // check userId
        const foundShop = await findByEmail({ email })
        if (!foundShop) { throw new AuthFailureError('shop not registered') }

        // tạo 1 cap token moi
        const tokens = await createTokenPair({ userId, email }, holderToken.publicKey, holderToken.privateKey)

        // update token
        await holderToken.updateOne({
            $set: {
                refreshToken: tokens.refreshToken
            },
            $addToSet: {
                refreshTokenUsed: refreshToken
            }
        })
        console.log('holder token da duoc update: ', holderToken)
        return {
            user: { userId, email },
            tokens
        }
    }

    // logout
    static logout = async (keyStore) => {
        const delKey = await KeyTokenService.removeById(keyStore._id)
        console.log('delKey ::::', delKey)
        return delKey
    }

    /* Login
    1- kiem tra email trong db
    2- match password
    3- tao publicKey va privateKey
    4- tao tokenPair (acessToken và refreshToken)
    5- lay data tra ve login
    */

    static login = async ({ email, password, refreshToken = null }) => {
        // 1.
        const foundShop = await findByEmail({ email })
        if (!foundShop) {
            throw new AuthFailureError('shop chua dang ky')
        }

        // 2.
        const match = await bcrypt.compare(password, foundShop.password)
        if (!match) {
            throw new AuthFailureError('thong tin chua dung')
        }

        // 3.
        const privateKey = crypto.randomBytes(64).toString('hex')
        const publicKey = crypto.randomBytes(64).toString('hex')

        // 4.
        const { _id: userId } = foundShop
        const tokens = await createTokenPair({ userId, email }, publicKey, privateKey)
        await KeyTokenService.createKeyToken({ userId, publicKey, privateKey, refreshToken: tokens.refreshToken })

        // 5.

        return {
            shop: getInfoData({ fields: ['_id', 'name', 'email'], object: foundShop }),
            tokens
        }

    }

    static signup = async ({ name, email, password }) => {
        // try {

        // kiểm tra tồn tại email
        const holderShop = await shopModel.findOne({ email }).lean();
        if (holderShop) {
            throw new BadRequestError('email đã tồn tại')
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const newShop = await shopModel.create({
            name, email, password: passwordHash, roles: [roleShop.SHOP]
        })
        if (newShop) {
            // level *
            /* const {privateKey, publicKey} = crypto.generateKeyPairSync('rsa',{
                 modulusLength: 4096,
                 publicKeyEncoding: {type: 'pkcs1', format: 'pem' },
                 privateKeyEncoding: { type: 'pkcs1', format: 'pem' }
             })*/

            const privateKey = crypto.randomBytes(64).toString('hex')
            const publicKey = crypto.randomBytes(64).toString('hex')

            console.log({ privateKey, publicKey });
            const keyStore = await KeyTokenService.createKeyToken({
                userId: newShop._id,
                publicKey,
                privateKey
            })
            if (!keyStore) {
                return {
                    code: 'xxx',
                    message: 'keyStore error'
                }
            }

            // console.log('publicKeyString::: ', publicKeyString);
            // const publicKeyObject = crypto.createPublicKey(publicKeyString);
            // console.log('publicKeyObject::: ', publicKeyObject);

            // tạo token pair
            const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey)
            console.log('created tokens::: ', tokens);

            return {
                code: 201,
                metadata: {
                    shop: getInfoData({ fields: ['_id', 'name', 'email'], object: newShop }),
                    tokens
                }
            }
        }
        return {
            code: 200,
            metadata: null,
        }
        // } catch (error) {
        //     return {
        //         code: 'xxx' ,
        //         message: error.message,
        //         status: 'error'
        //     }
        // }
    }
}

module.exports = AccessService;