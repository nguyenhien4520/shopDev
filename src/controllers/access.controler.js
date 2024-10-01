const AccessService = require("../services/access.services");
const {OK, CREATED, SuccessResponse} = require('../core/success.response');

class AccessController {

    handleRefreshToken = async (req, res) => {
        new SuccessResponse({
            message: 'handleRefreshToken ok',
            metadata: await AccessService.handleRefreshTokenV2({
                refreshToken: req.refreshToken,
                user: req.user,
                keyStore: req.keyStore
            })
        }).send(res)
    }

    logout = async (req, res) => {
        new SuccessResponse({
            message: 'Log out ok',
            metadata: await AccessService.logout(req.keyStore)
        }).send(res)
    }

    login = async (req, res) => {
        new SuccessResponse({
            message: 'Logged in ok',
            metadata: await AccessService.login(req.body)
        }).send(res)
    }

    signUp = async (req, res, next) => {
        try {
            console.log(`[P]::signUp::`, req.body);
            // return res.status(200).json(await AccessService.signup(req.body))
            new CREATED({
                message: 'Registed ok',
                metadata: await AccessService.signup(req.body)
            }).send(res)
        } catch (error) {
            next(error);
        }
    }

}

module.exports = new AccessController();