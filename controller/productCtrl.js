const Product = require('../models/ProductModel');
const asyncHandler =  require("express-async-handler");
const slugify = require("slugify");
const { updateaUser } = require('./userCtrl');


const createProduct = asyncHandler(async(req,res)=>{
    try {
        if(req.body.title){
            req.body.slug = slugify(req.body.title);
        }
        const newProduct = await Product.create(req.body);
        res.json(newProduct, )
    } catch (error) {
        throw new Error(error);
    }
    
});


const updateaProduct = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    console.log(id);
    try {
        if(req.body.title)
        {
            req.body.slug = slugify(req.body.title);
        }
        const updateProduct = await Product.findByIdAndUpdate(
            id,
            req.body,
            {
                new:true,
            }

        );
        //console.log(req.body);
        res.json(updateProduct);
    } catch (error) {
        throw new Error(error);
    }
});


const deleteaproduct = asyncHandler(async(req,res)=>{4
    const {id} = req.params;
    try {
        
        const deleteProduct = await Product.findByIdAndDelete(id);
        res.json(deleteProduct);
    } catch (error) {
        throw new Error(error);
    }
})

const getaProduct  = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    try {
        const getProduct = await Product.findById(id);
        res.json(getProduct);
    } catch (error) {
        throw new Error(error);
    }
});


const getallproducts = asyncHandler(async(req,res)=>{
    // console.log(req.query);
    try {
        // // const getProducts = await Product.find(req.query); //for filtering this can be used too

        //FILTERING
        const queryObj = {...req.query};
        const excludefields = ['page','sort','limit','fields'];
        excludefields.forEach((el)=> delete queryObj[el]);

       
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`); //->g is needed so that it matches for all if g was not there it matched with only one
        console.log(JSON.parse(queryStr));
        let query = Product.find(JSON.parse(queryStr));
        
        // console.log(query);
        

       
        
        //sorting
        if(req.query.sort)
        {
            const sortBy = req.query.sort.split(",").join(" ");
            query = query.sort(sortBy);
        }
        else
        {
            query = query.sort("-createdAt");
        }
        //const getProducts = await Product.find();
        //res.json(getProducts);
        
        //limiting fields
        if(req.query.fields)
        {
            const fields = req.query.fields.split(",").join(" ");
            query = query.select(fields); 
        }
        else{
            query = query.select("__v");
        }

        // //pagination
        // const page = req.query.page;
        // const limit = req.query.limit;
        // const skip = (page-1)*limit;
        // query = query.skip(skip).limit(limit);
        // if(req.query.page){
        //     const productCount = await Product.countDocuments();
        //     if(skip>=productCount)
        //     {
        //         throw new Error("This page does not exist!!");
        //     }
        // }


        const product = await query;
        res.json(product);
        
    } catch (error) {
        throw new Error(error);
    }
});













module.exports = {
                    createProduct,
                    getaProduct,
                    getallproducts,
                    updateaProduct,
                    deleteaproduct
                }