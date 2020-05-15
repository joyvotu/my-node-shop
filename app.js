const express = require('express');
const app = express();
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/users');
const bodyparser = require('body-parser');
const mongoose  = require('mongoose');

mongoose.connect('mongodb+srv://joy:joy@nodeshop-qsj8o.mongodb.net/test?retryWrites=true&w=majority',
  
     { 
      useNewUrlParser : true,
      useUnifiedTopology: true
      
    }
  );
  

app.use(bodyparser.urlencoded({extended : false}));
app.use(bodyparser.json());


app.use((req,res,next)=> {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Access, Authorization");
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELET, GET');
        return res.status(200).json({});
    }
    next();
});

app.use('/products',productRoutes);
app.use('/orders',orderRoutes);
app.use('/users',userRoutes);


app.use((req,res,next) => {
    const err = new Error('Not found');
    err.status = 404;
    next(err);
});
app.use((error,req,res,next)=>{
    res.status(error.status || 500);
    res.json({
        error: {
            message : error.message
        }
    })
});

module.exports = app;