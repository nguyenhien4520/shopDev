const mongoose = require('mongoose');

const os = require('os');
const process = require('process');

const countConnections = ()=>{
    const numConnections = mongoose.connections.length;
    console.log('numConnections::::', numConnections);
}

const checkOverload = ()=>{
    const numCors = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;

    // giả sử mỗi core chịu được 5 connect

    const maxConnections = numCors * 5;
    const numConnections = mongoose.connections.length;

    console.log(`memoryUsage:: ${memoryUsage/1024/1024}MB`);
    console.log(`maxConnections:: ${maxConnections}`);
    if(numConnections > maxConnections){
        console.log('Server quá tải');
    }

}

module.exports = {countConnections, checkOverload}