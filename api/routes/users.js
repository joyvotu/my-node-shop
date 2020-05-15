const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const order = require('../models/order');
const product = require('../models/product');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt  = require('jsonwebtoken');


router.post('/signup',(req,res,next) => {
    User.find({email:req.body.email})
    .exec()
    .then(user => {
        if(user.length >= 1){
            return res.status(409).json({
                message : 'Mail Exists'
            })
        }else{
            bcrypt.hash(req.body.password,10, (err,hash) => {
                if(err){
                    return res.status(500).json({
                        error :err
                    });
                }else{
                    const user = new User({
                        _id : mongoose.Types.ObjectId(),
                        email : req.body.email,
                        password: hash
                    });
                    user.save()
                    .then(result => {
                        console.log(result);
                        res.status(201).json({
                            message : 'User Created'
                        });
                    })
                    .catch(err => {
                        res.status(500).json({
                            error : err
                        })
                    })
                    
                }
            });

        }

    })
    
});
router.post('/login',(req,res,next) => {
    User.find({email: req.body.email})
    .exec()
    .then(user => {
        if(user.length < 1){
            return res.status(401).json({
                message : 'AUTH FAILED'
            });
        }
        bcrypt.compare(req.body.password, user[0].password , (err,result) => {
            if(err){
                return res.status(401).json({
                    message : 'AUTH FAILED'
                });
            }
            if(result){
              const token =  jwt.sign({
                    email : user[0].email,
                    userId : user[0]._id
                }, "thisisthekey" , {
                    expiresIn : "1h"
                });
                return res.status(200).json({
                    message : 'Login Successfull',
                    token : token
                });
            }
            return res.status(401).json({
                message : 'AUTH FAILED'
            });
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error : err
        })
    })
})
router.delete('/:email',(req,res,next)=>{
    User.remove({email : req.params.email })
    .exec()
    .then(result => {
        console.log(result);
        res.status(200).json({
            message : 'User Deleted'
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error : err
        })
    })
})

module.exports = router;