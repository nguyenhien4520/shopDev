const mongoose = require('mongoose');
const {db: {host, port, name}} = require('../configs/config.mongodb')
const connectString = `mongodb://${host}:${port}/${name}`;
const { countConnections } = require('../helpers/countConnect');

class Database {
    constructor() {
        this.connect();
    }

    connect(type = 'mongodb') {
        if (1 === 1) {
            mongoose.set('debug', true);
            mongoose.set('debug', { color: true });
        }

        mongoose.connect(connectString,{maxPoolSize:50}).then(() => {
            console.log(connectString);
            console.log('Connected to MongoDB');
            countConnections();
        })
            .catch(err => {
                console.error('Error connecting to MongoDB::::', err);
            })


    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
}

const instanceMongodb = Database.getInstance();

module.exports = instanceMongodb;