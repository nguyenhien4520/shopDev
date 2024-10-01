const JWT = require('jsonwebtoken');
const asyncHandler = require('../helpers/asyncHandler');
const { AuthFailureError, NotFoundError } = require('../core/error.response');
const { findByUserId } = require('../services/keyToken.services.level_1');
const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization',
    REFRESHTOKEN: 'x-token-id',
}
const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        const accessToken = await JWT.sign(payload, publicKey, {
            expiresIn: '2 days',
        })

        const refreshToken = await JWT.sign(payload, privateKey, {
            expiresIn: '7 days',
        })

        JWT.verify(accessToken, publicKey, (err, decode) => {
            if (err) {
                console.error('error verify:: ', err);
            } else {
                console.log('decode verify:: ', decode);
            }
        })

        return { accessToken, refreshToken }
    } catch (error) {
        return error
    }

}

const authentication = asyncHandler(async (req, res, next) => {
    /*
    1 - check userId missing
    2 - get acesssToken
    3 - verify token
    4 - check user in dbs
    5 - check keyStore with userId
    6 - return next()
    */
    const userId = req.headers[HEADER.CLIENT_ID];
    if (!userId) { throw new AuthFailureError('Invalid request') }

    const keyStore = await findByUserId(userId)
    if (!keyStore) { throw new NotFoundError('Not found keyStore') }

    const refreshToken = req.headers[HEADER.REFRESHTOKEN]
    if (refreshToken && req.url == '/shop/handleRefreshToken') {
        try {
            const decodeUser = JWT.decode(refreshToken, keyStore.privateKey)
            if (userId != decodeUser.userId){throw new AuthFailureError('Invalid userId')} 
            req.keyStore = keyStore;
            req.user = decodeUser
            req.refreshToken = refreshToken
            return next()
        } catch (error) {
            throw error
        }
    }


    const accessToken = req.headers[HEADER.AUTHORIZATION];
    if (!accessToken) { throw new AuthFailureError('Invalid request access token') }

    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
        if (decodeUser.userId != userId) { throw new AuthFailureError('Invalid user') }
        req.keyStore = keyStore;
        req.user = decodeUser
        return next()
    } catch (error) {
        throw error
    }

})

const verifyJWT = async (token, keySecret) => {
    return await JWT.verify(token, keySecret)
}

module.exports = { createTokenPair, authentication, verifyJWT };