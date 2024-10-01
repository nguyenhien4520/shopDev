const { addListener } = require("../app");
const { apiKey } = require("../auth/checkAuth");
const apiKeyModel = require("../models/apiKey.model")


const findById = async (key) => {
    const objKey = await apiKeyModel.findOne({key, status: true})
    return objKey;
}

module.exports = { findById } 