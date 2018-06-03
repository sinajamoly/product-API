const express = require('express');
const app = express();
const morgan = require('morgan');

app.use(morgan('dev'));


//ROUTES----------------------------------------------------------------
const productRoutes = require('./api/routes/products');
app.use('/products', productRoutes);
const orderRoutes = require('./api/routes/orders');
app.use('/orders', orderRoutes);



app.use((req, res, next)=>{
    const error = new Error('Not Found');
    error.status(404);
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