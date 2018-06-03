const express = require('express');
const router = express.Router();

router.get('/',(req, res, next)=>{
    res.status(200).json({
        message: 'orders were fetched'
    });
})

router.post('/', (req, res, next)=>{
    const order = {
        productId: req.body.productId,
        quantity: req.body.quantity
    }
    res.status(201).json({
        message: 'orders was created',
        order
    });
})

router.get('/:orderId', (req, res, next)=>{
    res.status(200).json({
        message: 'get the product detail',
        orderId: req.params.orderId
    })
})

router.patch('/:orderId', (req, res, next)=>{
    res.status(200).json({
        message: 'update the product detail',
        orderId: req.params.orderId
    })
})

router.delete('/:orderId', (req, res, next)=>{
    res.status(200).json({
        message: 'delete the product detail',
        orderId: req.params.orderId
    })
})



module.exports = router;