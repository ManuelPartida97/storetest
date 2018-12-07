 
 var filesystem     = require("fs");
 var SalesModel     = require("./Model/Sales.js").SalesModel;
 var ProductsModel  = require("./Model/Products.js").ProductsModel;

 module.exports.controllers = {

    add_sale: async function(request, response){
        Sales = new SalesModel();

        var productList = request.body.list_product;
        try{
            await Sales.getIdLastSale(async (idLastSale) =>{
                resultado = await Sales.insertSale(idLastSale + 1, productList);
                response.write(JSON.stringify(resultado));
                response.end();
            });
        }catch(error){
            console.log(error.stack);
        }
    },

    get_sale: async function(request, response){
        Sales = new SalesModel();

        var idSale = request.params.id;
        try{
            saleDetails = await Sales.getSaleDetails(idSale);
            console.log(saleDetails);
            response.write(JSON.stringify(saleDetails));
        }catch(error){
            console.log(error.stack);
            response.write("Error...");
        }finally{
            response.end();
        }
    },

    get_product: async function(request, response){
        Products = new ProductsModel();

        var idProduct = request.params.id;
        try{
            product = await Products.getProductById(idProduct);
            console.log(product);
            response.write(JSON.stringify(product));
        }catch(error){
            console.log(error.stack);
            response.write("Error...");
        }finally{
            response.end();
        }
    },

    get_all_product: async function(request, response){
        Products = new ProductsModel();

        var idProduct = request.params.id;
        try{
            products = await Products.all();
            response.write(JSON.stringify(products));
        }catch(error){
            console.log(error.stack);
            response.write("Error...");
        }finally{
            response.end();
        }
    }

};