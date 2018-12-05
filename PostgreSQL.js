
 const {Pool} = require("pg");

 module.exports.postgre = (function(){

 	var PostgreSQL = function(){
		this.config = {
			user: 		"postgres",
			host: 		"localhost",
			database: 	"storetest",
			password: 	"root",
			port: 		"5432"
		};

		this.pool = new Pool(this.config);
 	}

 	PostgreSQL.prototype.connect = async function(){
 		return await this.pool.connect();
 	}

 	PostgreSQL.prototype.query = function(sql, callback){
 		return this.pool.query(sql, callback);
 	}

 	return PostgreSQL;

 })();