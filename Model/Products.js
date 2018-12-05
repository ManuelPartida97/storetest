
 const PostgreSQL  = require("../PostgreSQL.js").postgre;

 module.exports.ProductsModel = (function(){

 	var Products = function(){
 		this.database = new PostgreSQL();
 		this.table 	  = "sale";
 	}

 	Products.prototype.getProductsIndexedBy = async function(indexName){
 		products = {};
 		try{
 			client 	= await this.database.connect();
 			sql = "SELECT id, code, name, price FROM product";
 			result  = await client.query(sql);
 			for(var i = 0; i < result.rowCount; i++){
 				row = result.rows[i];
 				products[row[indexName].toString().trim()] = row;
 			}
 			return products;

 		}catch(error){
 			console.log(error.stack);

 		}finally{
 			client.release(); 			
 		}
 	}

 	Products.prototype.getProductsIndexedByCode = async function(index){
 		return this.getProductsIndexedBy("code");
 	}

 	Products.prototype.getProductsIndexedById = async function(index){
 		return this.getProductsIndexedBy("id");
 	}

 	Products.prototype.getProductById = async function(id){
 		try{
 			client 	= await this.database.connect();
 			sql = "SELECT * FROM product WHERE id = "+id;
 			result  = await client.query(sql);
 			return result.rows[0];

 		}catch(error){
 			console.log(error.stack);

 		}finally{
 			client.release(); 			
 		}
 	}

 	Products.prototype.getProductByCode = async function(code){
 		try{
 			client 	= await this.database.connect();
 			sql = "SELECT * FROM product WHERE code = '"+code+"'";
 			result  = await client.query(sql);
 			return result.rows[0];

 		}catch(error){
 			console.log(error.stack);

 		}finally{
 			client.release(); 			
 		}
 	}


 	Products.prototype.all = async function(code){
 		try{
 			client 	= await this.database.connect();
 			sql 	= "SELECT * FROM product";
 			result  = await client.query(sql);
 			return result.rows;

 		}catch(error){
 			console.log(error.stack);

 		}finally{
 			client.release();		
 		}
 	}

 	return Products;

 })();