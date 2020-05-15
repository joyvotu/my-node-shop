const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const mongoose = require('mongoose');
const checkAuth = require('../middleware/user-auth');
router.get('/',(req,res,next) => {
    Product.find()
    .select('name price _id')
    .exec()
    .then(result => {
        const response ={
            count : result.length,
            products: result.map(doc => {
               return{
                   name : doc.name,
                   price : doc.price,
                   id : doc._id,
                   request : {
                        type : 'GET',
                        //url : 'http://localhost:3000/products/'+doc._id
                        url : 'https://joy-node-shop.herokuapp.com/products'+doc._id
                   }
               }
            })
        }
        res.status(200).json(response);
    })
    .catch(err => {
        res.status(500).json({error: err});
        console.log(err);
    })

});

router.post('/',checkAuth,(req,res,next) =>{
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });
    product
    .save()
    .then(result => {
        const response = {
            name :result.name,
            id : result._id,
            request : {
                type : 'GET',
                //url : 'http://localhost:3000/products/'+result._id
                url : 'https://joy-node-shop.herokuapp.com/products'+result._id
            }

        }

        console.log(result);
        res.status(200).json(response);
    }).catch(err => {
        res.status(500).json({error: err});
        console.log(err);
    });

    
})

router.get('/:productId',(req,res,next) => {
    Product.findById(req.params.productId)
    .select('name price _id')
    .exec()
    .then(doc => {
        const result = {
            name : doc.name,
            price : doc.price,
            id : doc._id,
            request :{
                type : 'GET',
                //url : 'http://localhost:3000/products/'
                url : 'https://joy-node-shop.herokuapp.com/products'
            }
        }
        console.log(doc);
        if(doc){
        res.status(200).json(result);
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error:err});
    })
});
router.patch('/:productId',checkAuth,(req,res,next) => {
    const updateops = {};
    for(const ops of req.body){
        updateops[ops.propName] = ops.value;
    }
    Product.update({_id : req.params.productId},{$set : updateops })
    .exec()
    .then(doc => {
        console.log(doc);
        res.status(200).json({
            message : 'Updated Successfully',
            request :{
                type : 'GET',
                //url : 'http://localhost:3000/products/'+req.params.productId
                url : 'https://joy-node-shop.herokuapp.com/products/'+req.params.productId

            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    })
});
router.delete('/:productId',checkAuth,(req,res,next) => {
   Product.remove({_id: req.params.productId})
    .exec()
    .then(doc => {
        console.log(doc);
        res.status(200).json({
            message : 'Item Deleted Successfully'
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    })

});

module.exports = router;