// level 0
require('dotenv').config();
const level_0 = {
    app: {
        port: 3000
    },
    db: {
        host: 'localhost',
        port: 27017,
        name: 'level 0',
    }
}


// level 1
const dev = {
    app: {
        port: process.env.DEV_APP_PORT || 3000
    },
    db: {
        host: process.env.DEV_DB_HOST || 'localhost',
        port: process.env.DEV_DB_PORT || 27017,
        name: process.env.DEV_DB_NAME || 'shopDev'
    }
}

const pro = {
    app: {
        port: process.env.PRO_APP_PORT || 3051,
    },
    db: {
        host: process.env.PRO_DB_HOST || 'localhost',
        port: process.env.PRO_DB_PORT || 27017,
        name: process.env.PRO_DB_NAME || 'shopPro'
    }
}

const config = {dev,pro,level_0};
const env = process.env.NODE_ENV || 'dev'
console.log(config[env], env);

module.exports = config[env];