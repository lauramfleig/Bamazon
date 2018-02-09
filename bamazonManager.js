const inquirer = require('inquirer');
const mysql = require('mysql');
const consoleTble = require('console.table');

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
    beginInquirer();

});

function beginInquirer() {
    console.log('Bamazon Manager Options: ' + '\n')
    inquirer.prompt([{
        name: 'managerChoices',
        message: 'Please Select from the Following Options: ' + '\n',
        type: 'list',
        choices: ['View Products For Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product']
    }]).then(function (answers) {
        switch (answers.managerChoices) {
            case 'View Products For Sale':
                viewProducts();
                break;

            case 'View Low Inventory':
                viewLowInventory();
                break;

            case 'Add to Inventory':
                addInventory();
                break;

            // case 'Add New Product':
            //     addProduct();
        }
    })
}

function viewProducts() {
    connection.query("SELECT item_id, product_name, price, stock_quantity FROM products", function (err, res) {
        console.table('Bamazon items for Sale', res);
    });

}

function viewLowInventory() {
    connection.query("SELECT product_name, stock_quantity FROM products WHERE stock_quantity < 100", function (err, res) {
        console.table('Items with Low Inventory', res);
    })

}

function addInventory() {
    let currentInv;

    connection.query("SELECT item_id, product_name, stock_quantity FROM products", function (err, res) {
        console.table('Bamazon items for Sale', res);
        currentInv = res;
    });

    inquirer.prompt([{
        name: "time2Choose",
        message: "Choose an Item:"
    }, {
        name: "chooseItem",
        message: "Enter the Item ID of the Item You'd Like to Update: "
    }, {
        name: "enterAmount",
        message: "How Many Units Would You Like to Add?"
    }]).then(function (answers) {

        let itemId = parseInt(answers.chooseItem);
        let quant = parseInt(answers.enterAmount);
        let currentStock = currentInv[itemId - 1].stock_quantity;

        connection.query(`UPDATE products SET stock_quantity = ${currentStock + quant} WHERE item_id = ${itemId}`,
            function (err, res) {
                if (err) {
                    throw err;
                }
                console.table('Updated Inventory', res);
                connection.end();
            });
        })
     
}


//PROBLEM TO SOLVE: Need to figure out how to access current inventory so I can add a new number to it 

// function addProduct() {

// }

