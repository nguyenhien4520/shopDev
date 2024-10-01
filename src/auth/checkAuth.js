const {findById} = require('../services/apikey.services')


const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization',
}

const apiKey = async (req, res, next) => {
    try {
        const key = req.headers[HEADER.API_KEY]?.toString();
        if(!key){
            return res.status(403).json({
                message: 'Forbidden error'
            })
        }
        const objKey = await findById(key);
        if(!objKey){
            return res.status(403).json({
                message: 'Forbidden error'
            })
        }
        req.objKey = objKey;
        return next();

    } catch (error) {
        console.log(error);
    }
}

const permission =  (permission) => {
    try {
        return (req, res, next) => {
            if(!req.objKey.permissions){
                return res.status(403).json({
                    message: 'Permission denied'
                })
            }
            const validPermissions = req.objKey.permissions.includes(permission);
            if(!validPermissions){
                return res.status(403).json({
                    message: 'Permission denied'
                })
            }
            return next();
        }
    } catch (error) {
        console.error(error)
    }
}
// cách 1
const asyncHandler = fn =>{
    return (req, res, next) => {
        fn(req, res, next).catch(next)
    }
}

// cách 2 cũng giống cách 1 nhưng dễ hiểu hơn xíu
const asyncHandler2 = (asyncFunction) => {
    return (req, res, next) => {
        asyncFunction(req, res, next).catch(next);
    };
};

module.exports = {
    apiKey,
    permission,
    asyncHandler
}