const express = require('express');
const router = express.Router();

router.get('/', (req, res, next)=>{
    res.status(200).json({
       message: 'Handling GET request to /products'
    });
})

router.post('/', (req, res, next)=>{
    const product = {
        name: req.body.name,
        price: req.body.price
    }
    res.status(201).json({
        message: 'Handling POST request to /products',
        createdProduct: product
    });
})

router.get('/:productId', (req, res, next)=>{
    res.status(200).json({
        message: 'getting back the procduct',
        productIdl: req.params.productId
    })
})

router.patch('/:productId', (req, res, next)=>{
    res.status(200).json({
        message: 'updated product',
        productIdl: req.params.productId
    })
})

router.delete('/:productId', (req, res, next)=>{
    res.status(200).json({
        message: 'deleted product',
        productIdl: req.params.productId
    })
})


module.exports = router;