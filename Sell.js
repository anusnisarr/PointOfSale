// Select the container and button
const sellScreenElements = document.querySelector("#selectedContainers");
const leftSideOption = document.querySelector("li");
const cartContainer = document.querySelector(".cart-items-container");
let itemContainer = document.querySelector(".itemcontainer");
const categoryContainer = document.querySelectorAll(".category");

leftSideOption.addEventListener("click", (event) => {
    let clickedValue = event.target;
    if (clickedValue.innerText === "Dashboard" ||
        clickedValue.innerText === "Reservation" ||
        clickedValue.innerText === "Reports") {
        sellScreenElements.style.display = "none";

    }
    else if (clickedValue.innerText === "Sell") {
        sellScreenElements.style.display = "flex";
    }
});

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

let items = JSON.parse(localStorage.getItem("items")) || [];
const addItem = ()=>{
    document.querySelector(".btn")
    .addEventListener("click", (e)=>{
        e.preventDefault()

        const itemName = document.querySelector("#itemName").value
        const itemCode = document.querySelector("#itemCode").value
        const itemPrice = document.querySelector("#itemPrice").value
        
      // Push new item to the array
      items.push({
        id: items.length + 1,
        barcode: itemCode,
        categoryId: "cat08",
        name: itemName,
        price: Number(itemPrice),
        IsActive: true
    });
    localStorage.setItem("items", JSON.stringify(items));


    })
    
}
addItem();
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
    }
    else {
        localStorage.setItem("ClubItemOnCart", "false")
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