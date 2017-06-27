// Add Dependencies
var mysql = require("mysql");
var inquirer = require("inquirer");

// Create Variables
var itemId = 0;
var units = 0;
var quantity = 0;
var itemName = "";
var pSales = 0;
var totalPrice = 0;
var itemCount = 0;

// Connect to Localhost
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "bamazon_db" 
});

//Connect to Database
connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  
  populatePage();

});

//Populate the Console with Product Data
function populatePage(){

	process.stdout.write('\033c');
	//Grab All Porducts from the "products" table
	connection.query("SELECT * FROM products", function(err, res){

		for(var i = 0; i < res.length; i++){
			if(res[i].stock_quantity > 0){
				console.log("____________________________________");
				console.log("Item id: " + res[i].item_id);
				console.log("Product Name: "+ res[i].product_name);
				console.log("Price: $" + res[i].price);			
			}	
		}
		console.log("____________________________________");

		//Create Count of Items to Choose From
		itemCount = res.length;
		//Run Function for User to Choose Purchase
		promptUser();
	})

}

//Prompt User to Buy a Product by Specifying Product ID
function promptUser(){

	inquirer.prompt([
	{
	  	name: "ans",
      	message: "SPECIFY THE ID OF THE PRODUCT YOU WOULD LIKE TO BUY...",
      	validate: function(value) {
          	if (isNaN(value) === false && parseInt(value) > 0 && parseInt(value) <= itemCount) {
          		return true;
          	}
          	return false;
        }
	}
	]).then(function(info){
		//set global variable for itemID by the value chosen
		itemId = info.ans;	
		
		getItemName();

	});
}

// Ask User the ID of the Product They'd Like to Buy
function getItemName(){

	connection.query("SELECT * FROM products WHERE item_id =" + itemId +";" ,function(err, res){
		itemName = res[0].product_name;

		getUnits();

	});
}

// Ask User How Many Units They Want of the Product They Selected
function getUnits(){

	inquirer.prompt([
	{
	  	name: "ans",
      	message: "HOW MANY UNITS OF " + itemName + " WOULD YOU LIKE TO BUY?",
      	validate: function(value) {
          	if (isNaN(value) === false && parseInt(value) > 0 && parseInt(value) <= 200) {
          		return true;
          	} 	
          	return false;
        }
	}

	]).then(function(info){
		units = info.ans;		
		transactionCheck();
	});

}

// Check if There is Enough of the Item in Stock to Sell it
function transactionCheck(){

	connection.query("SELECT stock_quantity FROM products WHERE item_id =" + itemId +";" ,function(err, res){
		
		if(!(res[0].stock_quantity - units < 0)){
			quantity = res[0].stock_quantity - units;		
			makeTransaction();
		}	else {
			console.log("PRODUCT OUT OF STOCK");
		}

	});
}

// If There is Enough in Stock Sell it
function makeTransaction(){

	connection.query("UPDATE products SET stock_quantity=" + quantity + " WHERE item_id = " + itemId + ";",
		function(err, res) {
	    	console.log("PRODUCT STOCK QUANTITY UPDATED");

	      processPrice();   
    });
}

// Get The Sum for the Price of the Total Number of Units User Wants
function processPrice(){

	connection.query("SELECT * FROM products WHERE item_id=" + itemId + ";", 
		function(err, res){
			totalPrice = (res[0].price)*units;
			
			console.log("");
			console.log("Number of " + itemName + "(s) remaining: " + res[0].stock_quantity);
			console.log("Total: $" + totalPrice);

		});

}
