const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/product');

router.get('/', (req, res, next)=>{
    Product.find()
        .select('name price _id')
        .exec()
        .then(docs=>{
            const response = {
                count : docs.length,
                products : docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        _id: doc.id,
                        url: {
                            request: {
                                type: 'GET',
                                url: 'http://localhost:3000/product/'+ doc._id
                            }
                        }
                    }
                })
            }
            // if(docs.length >= 0){
                res.status(200).json(response);
            // }else{
            //     res.status(404).json({
            //         message: 'no entries found'
            //     })
            // }
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
})

router.post('/', (req, res, next)=>{
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });
    product.save().then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Handling POST request to /products',
            createdProduct: result
        });
    }).catch(err=>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    })

})

router.get('/:productId', (req, res, next)=>{
    const id = req.params.productId;
    Product.findById(id)
        .exec()
        .then(doc=>{
            if(doc){
                res.status(200).json({
                    type: 'GET',
                    url: 'http://localhost/products',
                    product: doc
                });
            }else{
                res.status(404).json({message: 'no valid entry found for provided ID'});
            }
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({error: err})
        });
});

router.patch('/:productId', (req, res, next)=>{
    const id = req.params.productId;
    const updateOps = {};
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Product.update({_id: id}, {$set: updateOps})
        .exec()
        .then(result=>{
            res.status(200).json({
                message: 'product updated',
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products/' + id
                }
            });
        })
        .catch(err=>{
            error: err
        });
})

router.delete('/:productId', (req, res, next)=>{
    const id = req.params.productId;
    Product.findOneAndRemove({_id: id})
        .exec()
        .then(result =>{
            res.status(200).json({
                type: 'POST',
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/products',
                    body: {name: 'String', price: 'Number'}
                }
            })
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
})


module.exports = router;