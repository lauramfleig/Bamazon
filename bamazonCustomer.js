const inquirer = require('inquirer');
const mysql = require('mysql');

//establishing a connection to the products database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "Bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log('\n' + 'Welcome to Bamazon! See items for sale Below!' + '\n')
    //calling the funciton that displays all the items
    displayAllItems();
    //calling the function that launches inquirer 
    beginInquirer();


});

//function to display all item ID's, item Names, and Prices
function displayAllItems() {
    connection.query("SELECT * FROM products", function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log('Item ID: ' + res[i].item_id + " | " + 'Item Name: ' + res[i].product_name + " | " + 'Item Price: ' + '$' + res[i].price);
        }
        console.log("-----------------------------------");
    });
}

//Function that subtracts the chosenUnits from the productInventory
function validOrder(inventory, units) {
    inventory = inventory - units;
    //update the stock quantity based on the quantity the user entered
    connection.query("UPDATE products SET stock_quantity =" + inventory + " WHERE item_id =" + units, function (err, res) {
        if (err) throw err;
    })
}

//function to display the price of the item selected by the user
function displayPrice(chosenID) {
    connection.query("SELECT price FROM products where item_id=" + chosenID, function(err, res){
        console.log('That items costs: ' + '$' + res[0].price)
        let totalOrderPrice = res[0].price 
    })

}

//function that begins Inquirer prompts
function beginInquirer() {

    inquirer.prompt([{
        name: "pushEnter",
        message: 'Items for Sale: ' + '\n\n'
    }, {
        name: "enterID",
        message: "Enter the ID of the Item You'd like to Purchase: "
    }, {
        name: "enterUnits",
        message: "How many Units of this Item would you like to Purchase?: "
    }]).then(function (answers) {
        checkInventoy(answers.enterID, answers.enterUnits);
    });

}

//funtion to check the inventory of the product selected by the user
function checkInventoy(chosenID, chosenUnits) {
    connection.query("SELECT stock_quantity FROM products where item_id =" + chosenID, function (err, res) {
        for (var i = 0; i < res.length; i++) {

            let productInventory = res[i].stock_quantity

            //if the user enters more units than are available
            if (productInventory < chosenUnits) {
                console.log('Insufficient Quantity!! There are only ' + productInventory + ' of that product available')
            //if the user enters less or = units than are available
            } else if (productInventory >= chosenUnits) {
                //update the inventory on the database
                validOrder(productInventory, chosenUnits);
                //tell the user how much their order costs
                displayPrice(chosenID);
            }
        }
    });

}

//NEXT TO DO:
//---prompt user to re-enter how many units they'd like to purchase
//--if the user wants to order more items, re-prompt and add that price to display price 