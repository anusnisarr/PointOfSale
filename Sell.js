// Select the container and button
const sellScreenElements = document.querySelector("#selectedContainers");
const leftSideOption = document.querySelectorAll(".menu li");
const cartContainer = document.querySelector(".cart-items-container");
let itemContainer = document.querySelector(".itemcontainer");
const categoryContainer = document.querySelectorAll(".category");

leftSideOption.forEach((li) => {    
    li.addEventListener("click", (li) => {
        let clicked = li.target
        // Remove 'active' class from all list items
        leftSideOption.forEach((item) =>item.classList.remove("active"));
        // Add 'active' class to the clicked item
        clicked.classList.add("active");
    });

})



const categories = [
    { id: "cat01", name: "Pizza" },
    { id: "cat02", name: "Burger" },
    { id: "cat03", name: "Pasta" },
    { id: "cat04", name: "Sandwitch" },
    { id: "cat05", name: "Appetizer" },
    { id: "cat06", name: "Drinks" },
    { id: "cat07", name: "Deals" },
    { id: "cat08", name: "Deals" }
];

let items = [
    { id: "item01", barcode: 1001, categoryId: "cat01", name: "Margherita Pizza", price: 800, IsActive: true },
    { id: "item02", barcode: 1002, categoryId: "cat01", name: "Pepperoni Pizza", price: 900, IsActive: true },
    { id: "item03", barcode: 1003, categoryId: "cat02", name: "Cheese burger", price: 500, IsActive: true },
    { id: "item04", barcode: 1004, categoryId: "cat02", name: "Chicken Burger", price: 550, IsActive: true },
    { id: "item05", barcode: 1005, categoryId: "cat03", name: "Spaghetti Bolognese", price: 700, IsActive: true },
    { id: "item06", barcode: 1006, categoryId: "cat03", name: "Penne Alfredo", price: 750, IsActive: true },
    { id: "item07", barcode: 1007, categoryId: "cat04", name: "Grilled Cheese Sandwich", price: 300, IsActive: true },
    { id: "item08", barcode: 1008, categoryId: "cat04", name: "Club Sandwich", price: 400, IsActive: true },
    { id: "item09", barcode: 1009, categoryId: "cat05", name: "French Fries", price: 200, IsActive: true },
    { id: "item10", barcode: 1010, categoryId: "cat05", name: "Mozzarella Sticks", price: 250, IsActive: true },
    { id: "item11", barcode: 1011, categoryId: "cat06", name: "Cola", price: 150, IsActive: true },
    { id: "item12", barcode: 1012, categoryId: "cat06", name: "Orange Juice", price: 200, IsActive: true },
    { id: "item13", barcode: 1013, categoryId: "cat07", name: "Pizza & Drink Combo", price: 1000, IsActive: true },
    { id: "item14", barcode: 1014, categoryId: "cat07", name: "Burger & Fries Combo", price: 800, IsActive: true },
    { id: "item15", barcode: 1015, categoryId: "cat08", name: "Extra Cheese", price: 50, IsActive: true },
    { id: "item16", barcode: 1016, categoryId: "cat08", name: "Dipping Sauce", price: 30, IsActive: true },
    { id: "item17", barcode: 1017, categoryId: "cat08", name: "Mayo Sauce", price: 50, IsActive: true }

];
// items = JSON.parse(localStorage.getItem("items")) || [];

const addItemScreen = () => {
    const additembutton = document.querySelector(".add-item-btn")
    additembutton.addEventListener("click", (screen) => {
        document.querySelector(".content").
            innerHTML =
            `
        <div class="content">
            <h2>Create New Item</h2>
            <form class="item-form">
                <div class="form-group">
                    <label for="itemName">Item Name</label>
                    <input type="text" id="itemName" value="Burger" placeholder="Enter item name">
                </div>
    
                <div class="form-group">
                    <label for="itemCode">Item Code</label>
                    <input type="text" id="itemCode" placeholder="Enter item code">
                </div>
    
                <div class="form-group">
                    <label for="itemPrice">Price</label>
                    <input type="number" id="itemPrice" placeholder="Enter price">
                </div>
    
                <div class="form-group">
                    <label for="itemCategory">Category</label>
                    <select id="itemCategory">
                        <option value="default">Select Category</option>
                        <option value="electronics">Electronics</option>
                        <option value="clothing">Clothing</option>
                        <option value="groceries">Groceries</option>
                    </select>
                </div>
    
                <button type="submit" class="btn">Save Item</button>
            </form>
        </div>
        `


        const addItem = () => {
            document.querySelector(".btn")
                .addEventListener("click", (e) => {
                    e.preventDefault()
                    const itemName = document.querySelector("#itemName").value
                    const itemCode = document.querySelector("#itemCode").value
                    const itemPrice = document.querySelector("#itemPrice").value
    
                    // Push new item to the array
                    items.push(
                        {
                            id: items.length + 1,
                            barcode: itemCode,
                            categoryId: "cat08",
                            name: itemName,
                            price: Number(itemPrice),
                            IsActive: true
                        }
                    );
                    console.log(items);
    
                    localStorage.setItem("items", JSON.stringify(items));
    
                })
            }
            addItem()
    })
}

const itemListScreen = () => {
    const itemrow = document.querySelector(".item-table tbody")
    items.forEach((item, index) => {
        itemrow.innerHTML +=
            `                    <tr>
                                    <td>${index + 1}</td>
                                    <td>${items[index].name}</td>
                                    <td>${items[index].barcode}</td>
                                    <td>${categories.find((cat) => cat.id === items[index].categoryId).name}</td>
                                    <td>${items[index].price}</td>
                                    <td>${(items[index].IsActive ? "Active" : "Inactive")}</td>
                                    <td>
                                        <button class="edit-btn">Edit</button>
                                        <button class="delete-btn">Delete</button>
                                    </td>
                                </tr>
            `
    }
    )

}

if (document.title === "Items") {
    itemListScreen();
    addItemScreen();

}



if (document.title === "Items") {


}
// let items =JSON.parse(localStorage.getItem("items")) || []
console.log(items);


categoryContainer.forEach((cat) => {
    cat.addEventListener("click", () => {
        clickedCategory = cat.dataset.categoryid
        showTheseItems(clickedCategory);
    });

});

const showTheseItems = (categoryCode) => {
    itemContainer.innerHTML = "";
    items.forEach((item) => {
        if (item.categoryId === categoryCode) {
            itemContainer.innerHTML +=
                `   <div class="items" id="${item.id}" data-categoryId="${item.categoryId}">
                        <h2 class="items-name">${item.name}</h2>
                        <h3 class="items-price">${item.price} Pkr</h3>
                        <div class="items-select-color"></div>
                        </div>
                        `
            // <div id="qtycontainer">
            // <div id="minusbutton"><i class="ri-subtract-line"></i></div>
            // <div class="items-qty">0</div>
            // <div id="plusbutton"><i class="ri-add-line"></i></div>
            // </div>
            // addItemInCart(item.name , item.price)            
        }

    })
};

let selectedItems = [] // GLOBAL

if (document.title === "POS") {
    itemContainer.addEventListener("click", (event) => {
        const clickedElement = event.target;
        const item = clickedElement.closest(".items");

        if (item) {
            //change item Color on click
            item.classList.add("clicked");
            item.style.color = "black";

            let addItemInCart = () => {
                const itemId = item.id;
                const itemName = item.querySelector(".items-name");
                const itemPrice = item.querySelector(".items-price");
                const clubItemOnSaleval = localStorage.getItem("ClubItemOnCart")
                const booleanValue = clubItemOnSaleval ? clubItemOnSaleval === 'true' : false;
                let clubItemOnSale = booleanValue

                // Create the main container div for cart item
                const cartItem = document.createElement('div');
                cartItem.classList.add('cart-items');
                cartItem.id = itemId;

                // Check if the item is already added or not
                const clubItemId = selectedItems.find((id) => id.id === itemId);

                if (clubItemOnSale === false || clubItemId === undefined) {

                    // Create the left section of the cart item
                    let cartItemsLeft = document.createElement('div');
                    cartItemsLeft.classList.add('cart-items-left');

                    // Create and append the quantity element
                    const cartItemsQty = document.createElement('h4');
                    cartItemsQty.classList.add('cart-items-qty');
                    cartItemsQty.textContent = 1; // Set text content
                    qtyToInt = parseInt(cartItemsQty.textContent)
                    cartItemsLeft.appendChild(cartItemsQty);

                    // Create and append the item name element
                    const cartItemsName = document.createElement('h3');
                    cartItemsName.classList.add('cart-items-name');
                    cartItemsName.textContent = itemName.innerText; // Use text from itemName
                    cartItemsLeft.appendChild(cartItemsName);

                    // Append the left section to the main cart item container
                    cartItem.appendChild(cartItemsLeft);

                    // Create and append the price element
                    const cartItemsPrice = document.createElement('h4');
                    cartItemsPrice.classList.add('cart-items-price');
                    cartItemsPrice.textContent = parseInt(itemPrice.innerText); // Use text from itemPrice                     
                    cartItem.appendChild(cartItemsPrice);

                    // Append the entire cart item to the cart container
                    cartContainer.appendChild(cartItem);
                }
                else if (clubItemOnSale === true || clubItemId === !undefined) {
                    // Club Quantity
                    const CartItems = document.querySelectorAll(".cart-items")
                    const itemsWithId = Array.from(CartItems).find(el => el.matches(`#${itemId}`));
                    const qtyDiv = itemsWithId.querySelector(`.cart-items-qty`)
                    qtyToInt = parseInt(qtyDiv.innerText++)

                    // Club Rates
                    const cartItemsPrice = itemsWithId.querySelector('.cart-items-price');
                    cartItemsPrice.textContent = parseInt(itemPrice.innerText) * parseInt(qtyDiv.innerText)
                }
            };

            addItemInCart();

            selectedItems.push(item) // make an array of selected item id's

            const calulateInvoice = () => {
                let subtotal = null;

                let ItemAmountArray = [];
                const ItemAmount = document.querySelectorAll(".cart-items-price");
                ItemAmount.forEach((item) => {
                    ItemAmountArray.push(item.innerText)

                })
                for (let index = 0; index < ItemAmountArray.length; index++) {
                    subtotal += parseInt(ItemAmountArray[index]);
                }

                console.log(ItemAmountArray);
                console.log(subtotal);
                document.querySelector("#subtotal-values").innerHTML = `PKR ${subtotal}`
                document.querySelector("#total-values").innerHTML = `PKR ${subtotal}`
            }
            calulateInvoice()

        }


    });
}

// Update and save parameter in Setup
const setupChange = () => {
    let ClubItemOnCart = document.getElementById("ClubItemOnCart")

    if (ClubItemOnCart.checked === true) {
        localStorage.setItem("ClubItemOnCart", "true")
        console.log("Saved: ClubItemOnCart -> true");
    }
    else {
        localStorage.setItem("ClubItemOnCart", "false")
        console.log("Saved: ClubItemOnCart -> false");
    }
};

if (document.title === "Setup") {
    const updateButton = document.querySelector(".update-btn")
    let ClubItemOnCart = document.getElementById("ClubItemOnCart")

    if (localStorage.getItem("ClubItemOnCart") === "true") {
        ClubItemOnCart.checked = true
    }
    else if (localStorage.getItem("ClubItemOnCart") === "false") {
        ClubItemOnCart.checked = false

    }
    updateButton.addEventListener("click", (e) => {
        setupChange()
    })
}