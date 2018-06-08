const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');
router.get('/',(req, res, next)=>{
    Order.find()
        .select('_id product quantity')
        .populate('product','name')
        .exec()
        .then(order=>{
            res.status(200).json({
                count: order.length,
                orders: order.map(o=>{
                    return{
                        _id: o._id,
                        product: o.product,
                        quantity: o.quantity,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/orders/'+ o._id
                        }
                    }
                }),
            });
        }).catch(err=>{
            error: err
    })
})

router.post('/', (req, res, next)=>{
    Product.findById(req.body.productId).
    then(product=>{
        if(!product){
            return res.status(404).json({
                message: 'product not found'
            })
        }
        const order = new Order({
            _id: mongoose.Types.ObjectId(),
            quantity: req.body.quantity,
            product: req.body.productId
        });
        return order.save();
    }).then(result=>{
        res.status(201).json({
            message: 'Order Stored',
            createOrder: {
                _id: result._id,
                product: result.product,
                quantity: result.quantity
            },
            request: {
                type: 'GET',
                url: 'http://localhost:3000/orders' + result._id
            }
        })
    }).catch(err=>{
        res.status(500).json({
            error: err
        })
    }).
    catch(err=>{
        res.status(500).json({
            message: 'product has not been found',
            error: err
        });
    });
})

router.get('/:orderId', (req, res, next)=>{
    const orderId = req.params.orderId;
    Order.find({_id: orderId})
        .populate('product')
        .exec()
        .then(result=>{
            if(!result){
                return res.status(404).json({
                    message: "Order not Found"
                });
            }
            res.status(200).json({
                order: result,
                request: {
                    type: 'GET',
                    url: 'http"//localhost:3000/orders'
                }
            });
        })
        .catch(err=>{
            res.status(500).json({
                error: err
            });
        });
})

router.patch('/:orderId', (req, res, next)=>{
    const orderId = req.params.orderId;
    const updateOps = [];
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value
    }
    Order.update({_id: orderId}, {$set: updateOps})
        .then(result=>{
            res.status(200).json(result);
        })
        .catch(err=>{
            res.status(500).json({error: err})
        })
})

router.delete('/:orderId', (req, res, next)=>{
    const orderId = req.params.orderId;
    Order.findOneAndRemove({_id: orderId})
        .then(result=>{
            res.status(200).json({
                order: result,
                message: 'Order Deleted',
                request: {
                    type: 'POST',
                    url: 'http"//localhost:3000/orders',
                    body: {
                        productId: 'ID' , quantity: "Number"
                    }
                }
            })
        })
        .catch(err=>{
            res.status(500).json({error})
        })
})



module.exports = router;