// Select the container and button
const sellScreenElements = document.querySelector("#selectedContainers");
const leftSideOption = document.querySelector(".leftSidePanel");
const cartContainer = document.querySelector(".cart-items-container");
let itemContainer = document.querySelector(".itemcontainer");
const categoryContainer = document.querySelectorAll(".category");

leftSideOption.addEventListener("click", (event) => {
    let clickedValue = event.target;
    if (clickedValue.innerText === "Dashboard" ||
        clickedValue.innerText === "Reservation" ||
        clickedValue.innerText === "Items" ||
        clickedValue.innerText === "Pending Orders" ||
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

const items = [
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


categoryContainer.forEach((cat) => {
    cat.addEventListener("click", () => {
        clickedCategory = cat.attributes.value.nodeValue
        showTheseItems(clickedCategory);
    });

});

const showTheseItems = (categoryCode) => {
    itemContainer.innerHTML = "";
    items.forEach((item) => {
        if (item.categoryId === categoryCode) {
            itemContainer.innerHTML +=
                `   <div class="items" id="${item.id}">
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

itemContainer.addEventListener("click", (event) => {
    const clickedElement = event.target;
    const item = clickedElement.closest(".items");
    if (item) {
        item.classList.add("clicked");
        item.style.color = "black";
    }
    selectedItems.push(item) // make an array of selected item id's
    addItemInCart(selectedItems);
});


addItemInCart = (items) => {
    console.log(items);

    console.log(items.length);

    items.forEach((i)=>{
        console.log(i.target);
        
        const itemId = i.id;
        const itemName = i.querySelector(".items-name");
        const itemPrice = i.querySelector(".items-price");

        i.addEventListener("click", (i)=>{
            console.log(i);
            

            if (i) {
                // Create the main container div for cart item
                const cartItem = document.createElement('div');
                cartItem.classList.add('cart-items');
                cartItem.id = itemId;
            
                // Create the left section of the cart item
                const cartItemsLeft = document.createElement('div');
                cartItemsLeft.classList.add('cart-items-left');
            
                // Create and append the quantity element
                const cartItemsQty = document.createElement('h4');
                cartItemsQty.classList.add('cart-items-qty');
                cartItemsQty.textContent = '1'; // Set text content
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
                cartItemsPrice.textContent = itemPrice.innerText; // Use text from itemPrice
                cartItem.appendChild(cartItemsPrice);
            
                // Append the entire cart item to the cart container
                cartContainer.appendChild(cartItem);
            }

        })

        

    })
    

}

// Animate an element with a smooth ease-in effect
// gsap.to(".items", {
//     opacity: 1, // Fade in to full opacity
//     y: 0, // Move to the original position
//     duration: 0.7, // Duration of animation
//     stagger: 0.2 // Stagger the start of the animation for each item
// });

// gsap.to(".category", {
//     opacity: 1, // Fade in to full opacity
//     y: 0, // Move to the original position
//     duration: 0.6, // Duration of animation
//     stagger: 0.06 // Stagger the start of the animation for each item
// });
