
const PostgreSQL  = require("../PostgreSQL.js").postgre;
var ProductsModel = require("./Products.js").ProductsModel;

module.exports.SalesModel = (function(){

    var Sales = function(){
        this.database = new PostgreSQL();
        this.table    = "sale";
    }

    Sales.prototype.getSaleInfo = async function(productList){
        Products = new ProductsModel();
        try{
            productsInfo = await Products.getProductsIndexedByCode();
            for(p in productList){
                productInfo = productsInfo[productList[p].code];
                productList[p].id    = productInfo.id;
                productList[p].price = productInfo.price;
                productList[p].name  = productInfo.name;
            }

            return productList;
        }catch(error){
            console.log(error.stack);
        }
    }

    Sales.prototype.getIdLastSale = async function(callback){
        try{
            client 	= await this.database.connect();
            sql = "SELECT id FROM Sale ORDER BY id DESC LIMIT 1";
            result  = await client.query(sql);
            callback((result.rowCount == 0)?0:result.rows[0].id );

        }catch(error){
            console.log(error.stack);

        }finally{
            client.release(); 			
        }
    }

    Sales.prototype.toInsertSQLFormat = function(idSale, productList){
        var values = "(id_sale, id_product, quantity) VALUES ";
        list_length = productList.length;
        for(var p = 0; p < list_length; p++){
            product = productList[p];
            if(list_length > 1) values += "(";
            values += idSale+", "+product.id+", "+product.quantity;
            if(list_length > 1) values += "), ";
        }
        if(list_length > 1)
            return values.slice(0, -2);

        return values;
    }

    Sales.prototype.getTotal = function(saleInfo){
        sale_length = saleInfo.length;
        total = 0;
        for(var s = 0; s < sale_length; s++){
            product = saleInfo[s];
 			
            if(product.code.trim() == "PANTS"){
                quantity = Number.parseInt(product.quantity);
                product.quantity = quantity - Number.parseInt(quantity/3);
                console.log("Discount in PANTS...");
            }

            if(product.code.trim() == "TSHIRT" && Number.parseInt(product.quantity) >= 3){
                product.price = Number.parseFloat(product.price) - 1;
                console.log("Discount in TSHIRTs...");
            }

            total += Number.parseFloat(product.price) * Number.parseInt(product.quantity);
        }
        console.log("Sale's TOTAL:"+total);
        return total;
    }

    Sales.prototype.insertSale = async function(idSale, productList){
        resultado = { id: null, total: null, list_product: null };

        saleInfo          = await this.getSaleInfo(productList);
        saleTotal         = this.getTotal(saleInfo);
        productsToInsert  = this.toInsertSQLFormat(idSale, saleInfo);

        try{
            client  = await this.database.connect();
            sql     = "INSERT INTO Sale (id, total) VALUES ("+idSale+","+saleTotal+"); \
                       INSERT INTO Sale_Product "+productsToInsert+";";
            await client.query(sql);
            console.log("Sale inserted...");

            resultado.id     = idSale;
            resultado.total  = saleTotal;
            resultado.list_product = saleInfo;

        }catch(error){
        console.log(error.stack);

        }finally{
            client.release(); 			
            return resultado;
        }
    }

    Sales.prototype.getSaleDetails = async function(idSale){
        result = { list_product: [], total: null };
        try{
            client      = await this.database.connect();
            sql         = "SELECT * FROM Sale WHERE id = "+idSale;
            sale        = await client.query(sql);
            sql         = "SELECT * FROM Sale_Product WHERE id_sale = "+idSale;
            productList = await client.query(sql);

            result.list_product = productList.rows;
            result.total        = sale.rows[0].total;

        }catch(error){
            console.log(error.stack);

        }finally{
            client.release();
            return result;
        }
 		
    }

    return Sales;

})();