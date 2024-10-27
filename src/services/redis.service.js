const redis = require('redis');
const { reservationInventory } = require('../models/repositories/inventory.repo');

// Tạo client và kết nối
const redisClient = redis.createClient();
redisClient.connect().catch(console.error); // Kết nối Redis

const acquireLock = async (productId, quantity, cartId) => {
    const key = `lock_v2023_${productId}`;
    const retryTime = 10;
    const expireTime = 3000;
    
    for (let i = 0; i < retryTime; i++) { 
        const result = await redisClient.setNX(key, expireTime);
        if (result === 1) {
            const isReservation = await reservationInventory({ productId, quantity, cartId });
            if (isReservation.modifiedCount) {
                await redisClient.pExpire(key, expireTime);
                return key;
            }
            return null;
        } else {
            await new Promise((resolve) => { setTimeout(resolve, 50); });
        }
    }
};

const releaseLock = async (keyLock) => {
    return await redisClient.del(keyLock);
};

module.exports = {
    acquireLock,
    releaseLock,
};
