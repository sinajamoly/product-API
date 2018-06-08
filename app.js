const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


// MONGOO CONNECT--------------------------------------------------
// mongoose.connect('mongodb+srv://node-rest' + process.env.MONGO_ATLAS_PW + '@node-rest-shop-yxcjh.mongodb.net/test?retryWrites=true',{
//     // useMongoClient: true
// })
mongoose.connect('mongodb+srv://node-rest:node-rest@node-rest-shop-yxcjh.mongodb.net/test?retryWrites=true',{
    // useMongoClient: true
})

//----------------------------------------------------------------
app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
//
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next)=>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-with, Content-Type, Accept, Authorization');
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
})

//ROUTES----------------------------------------------------------------
const productRoutes = require('./api/routes/products');
app.use('/products', productRoutes);
const orderRoutes = require('./api/routes/orders');
app.use('/orders', orderRoutes);



app.use((req, res, next)=>{
    const error = new Error('Not Found');
    error.status = 400;
    next(error);
})

app.use((error, req, res, next)=>{
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }
    })
});
//--------------------------

module.exports = app;