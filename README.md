# bamazon
This is a NODE app to take orders from a store's inventory and keep track of the stock. A user can take a look at the store's inventory, where the product name, price, and id number is displayed. The user can choose an item and amount of said item they would like to purchase. The inventory is then adjusted to update the total number of items that is left.

---

- The node app first logs the product's info to the console
---- Item ID
---- Product Name
---- Price

![Product_Info](img/terminal-1.png)

- It then prompts the user to specify what product they would like to purchase via Item ID
- This is followed by a prompt asking the user to specify how man units of the product they would like

---- If the store has enough in stock to fulfill the order we display the total cost of the order to the user and display the total number of units left in stock

![Enough_Stock](img/terminal-2.png)

---- If the store does not have enough in stock to fulfill the order we inform the user that the item is out of stock.

![Not_Enough_Stock](img/terminal-3.png)
