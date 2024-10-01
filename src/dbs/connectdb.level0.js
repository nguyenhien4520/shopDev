const mongoose = require('mongoose');

const connectString = 'mongodb://localhost:27017/shopDev';

mongoose.connect(connectString).then(()=>{
    console.log('Connected to MongoDB');
})
.catch(err => {console.log('Error connecting')})

if(1===1){
    mongoose.set('debug', true);
    mongoose.set('debug', {color:true});
}

module.exports = mongoose;