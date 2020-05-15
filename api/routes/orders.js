const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const order = require('../models/order');
const product = require('../models/product');
const checkAuth = require('../middleware/user-auth');

router.get('/',checkAuth,(req,res,next) => {
    order.find()
    .select('_id product quantity')
    .exec()
    .then(result => {
        const response = {
          count:result.length,
          orders:result.map(doc => {
              return{
                  orderId: doc._id,
                  quantity: doc.qunatity,
                  
                  request : {
                        type :'GET',
                        url  : 'http://localhost:3000/orders/'+doc._id
                  }
              }
          })
        }
        res.status(201).json(response);

    })
    .catch(err=>{
        res.status(500).json({
            error : err
        })
        console.log(err);
    })

   
});

router.post('/',checkAuth,(req,res,next) =>{
    product.findById(req.body.productId)
    .then(result => {
        if(!result){
            return res.status(404).json({
                 message: 'Product Not Found'
             })
            }
        const Order = new order({
            _id : mongoose.Types.ObjectId(),
            quantity: req.body.quantity,
            product: req.body.productId
        });
        return Order.save();
    })
    .then(result => {
       
        
        console.log(result);
        res.status(201).json({
            message : 'Order placed',
            request : {
                type : 'GET',
                url: 'http://localhost:3000/orders/'+result._id
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error : err
        });
    });
        
});

router.get('/:orderId',checkAuth,(req,res,next) => {
    const id = req.params.orderId;
    let a;
    order.findById(id)
    .select('_id product quantity')
    .exec()
    .then(result => {
        console.log(result);
        product.findById(result.product)
        .then(doc => {
            res.status(201).json({
                id: result._id,
                qunatity: result.quantity,
                productId: result.product,
                name : doc.name,
                price: doc.price,
                
                request : {
                    type : 'GET',
                    url : 'http://localhost:3000/orders'
                }
            })

        })
        
        
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error : err
        })
    })
});
router.delete('/:orderId',checkAuth,(req,res,next) => {
    order.remove({_id : req.params.orderId})
    .exec()
    .then(result => {
       console.log(result);
       res.status(201).json({
           message : 'Item deleted Successfully'
       }) 
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error : err
        })
    })
});




module.exports = router;