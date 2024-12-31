// Select the container and button
const sellScreenElements = document.querySelector("#selectedContainers");
const leftSideOption = document.querySelectorAll(".menu li");
const cartContainer = document.querySelector(".cart-items-container");
let itemContainer = document.querySelector(".itemcontainer");
const categoryContainer = document.querySelectorAll(".category");
let items = JSON.parse(localStorage.getItem("items")) || [];
const payButton = document.querySelector("#placeorder-btn-name");
const currentDate = new Date().toDateString();
let SelectedPaymentMethod = null;
let subtotal = null; // Global variable to store subtotal
let cartItems = []; //  Array to store cart item
console.log(cartItems);

let receiptNote = localStorage.getItem("note");

let CategoryArray = Array.from(categoryContainer);

// Iterate over each category and count items
CategoryArray.forEach((category) => {
  let itemCount = category.querySelector(".items-count");
  let categoryId = category.dataset.categoryid; // Get the category ID from dataset

  // Filter items belonging to this category
  let itemsInCategory = items.filter((item) => item.categoryId === categoryId);

  itemCount.innerText = `${itemsInCategory.length} Items`;
  // console.log(`Category ID: ${categoryId}, Count: ${itemsInCategory.length}`);
});

leftSideOption.forEach((li) => {
  li.addEventListener("click", (li) => {
    let clicked = li.target;
    // Remove 'active' class from all list items
    leftSideOption.forEach((item) => item.classList.remove("active"));
    // Add 'active' class to the clicked item
    clicked.classList.add("active");
  });
});

const navContainer = document.querySelector('.nav-container');

document.addEventListener('mousemove', (e) => {
  if (e.clientY < 10) {
    // Mouse is near the top of the viewport
    navContainer.style.top = '10px';
  } else if (e.clientY > 63) {
    // Mouse is away from the top
    navContainer.style.top = '-50px';
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
];

// let items = [
//     { id: "item01", barcode: 1001, categoryId: "cat01", name: "Margherita Pizza", price: 800, IsActive: true },
//     { id: "item02", barcode: 1002, categoryId: "cat01", name: "Pepperoni Pizza", price: 900, IsActive: true },
//     { id: "item03", barcode: 1003, categoryId: "cat02", name: "Cheese burger", price: 500, IsActive: true },
//     { id: "item04", barcode: 1004, categoryId: "cat02", name: "Chicken Burger", price: 550, IsActive: true },
//     { id: "item05", barcode: 1005, categoryId: "cat03", name: "Spaghetti Bolognese", price: 700, IsActive: true },
//     { id: "item06", barcode: 1006, categoryId: "cat03", name: "Penne Alfredo", price: 750, IsActive: true },
//     { id: "item07", barcode: 1007, categoryId: "cat04", name: "Grilled Cheese Sandwich", price: 300, IsActive: true },
//     { id: "item08", barcode: 1008, categoryId: "cat04", name: "Club Sandwich", price: 400, IsActive: true },
//     { id: "item09", barcode: 1009, categoryId: "cat05", name: "French Fries", price: 200, IsActive: true },
//     { id: "item10", barcode: 1010, categoryId: "cat05", name: "Mozzarella Sticks", price: 250, IsActive: true },
//     { id: "item11", barcode: 1011, categoryId: "cat06", name: "Cola", price: 150, IsActive: true },
//     { id: "item12", barcode: 1012, categoryId: "cat06", name: "Orange Juice", price: 200, IsActive: true },
//     { id: "item13", barcode: 1013, categoryId: "cat07", name: "Pizza & Drink Combo", price: 1000, IsActive: true },
//     { id: "item14", barcode: 1014, categoryId: "cat07", name: "Burger & Fries Combo", price: 800, IsActive: true },
//     { id: "item15", barcode: 1015, categoryId: "cat08", name: "Extra Cheese", price: 50, IsActive: true },
//     { id: "item16", barcode: 1016, categoryId: "cat08", name: "Dipping Sauce", price: 30, IsActive: true },
//     { id: "item17", barcode: 1017, categoryId: "cat08", name: "Mayo Sauce", price: 50, IsActive: true }

// ];

const allBarcode = items.map((item) => item.barcode); // Extract all barcodes

const showLoader = () => {
  const content = document.querySelector(".content");
  content.innerHTML = `<span class="loader"></span>`;
  document.querySelector(".loader").style.display = "block";
};

const hideLoader = () => {
  const content = document.querySelector(".content");
  content.innerHTML = `<span class="loader"></span>`;
  document.querySelector(".loader").style.display = "none";
};

const addItemScreen = () => {
  let CategoryCode = null;

  const addItemButton = document.querySelector(".add-item-btn");
  addItemButton.addEventListener("click", () => {
    document.querySelector(".content").innerHTML = `
            <div class="content">
                <h2>Create New Item</h2>
                <form class="item-form">
                    <div class="form-group">
                        <label for="itemName">Item Name</label>
                        <input type="text" id="itemName" placeholder="Enter item name">
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
                        </select>
                    </div>

                    <button type="submit" class="btn">Save Item</button>
                </form>
            </div>
        `;

    const categoryDropDown = document.querySelector("#itemCategory");
    categories.forEach((cat) => {
      categoryDropDown.innerHTML += `<option value="${cat.id}">${cat.name}</option>`;
    });

    const categorySelection = document.querySelector("#itemCategory");
    categorySelection.addEventListener("change", () => {
      CategoryCode = categorySelection.value;
      console.log(CategoryCode);
    });

    setupAddItemHandler();
  });

  const setupAddItemHandler = () => {
    const saveButton = document.querySelector(".btn");
    saveButton.addEventListener("click", (e) => {
      e.preventDefault();

      const itemName = document.querySelector("#itemName").value;
      const itemCode = Number(document.querySelector("#itemCode").value);
      const itemPrice = Number(document.querySelector("#itemPrice").value);

      let barocdeCheck = allBarcode.find((barcode) => barcode === itemCode);

      if (!itemName || !itemCode || !itemPrice || CategoryCode === null) {
        alert("Please fill out all fields correctly.");
        return;
      } else if (barocdeCheck) {
        alert("Barcode Already Exist");
      } else {
        items.push({
          id: items.length + 1,
          barcode: itemCode,
          categoryId: CategoryCode,
          name: itemName,
          price: Number(itemPrice),
          IsActive: true,
        });

        showLoader();
        setTimeout(() => {
          hideLoader();
          location.reload();
        }, 1000);

        localStorage.setItem("items", JSON.stringify(items));
      }
    });
  };
};

const itemListScreen = () => {
  const itemRow = document.querySelector(".item-table tbody");
  items.forEach((item, index) => {
    itemRow.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${item.name}</td>
                <td>${item.barcode}</td>
                <td>${
                  categories.find((cat) => cat.id === item.categoryId).name
                }</td>
                <td>${item.price}</td>
                <td>${item.IsActive ? "Active" : "Inactive"}</td>
                <td>
                    <button class="edit-btn">Edit</button>
                    <button class="delete-btn" id="${
                      item.barcode
                    }">Delete</button>
                </td>
            </tr>
        `;
  });
};

const itemDeleteBtn = () => {
  let deleteBtn = document.querySelectorAll(".delete-btn");
  deleteBtn.forEach((btn, index) => {
    btn.addEventListener("click", (e) => {
      items = items.filter((item) => e.target.id != item.barcode);
      localStorage.setItem("items", JSON.stringify(items));
      showLoader();
      setTimeout(() => {
        hideLoader();
        location.reload();
      }, 1000);
    });
  });
};
if (document.title === "Items") {
  itemListScreen();
  addItemScreen();
  itemDeleteBtn();
}

categoryContainer.forEach((cat) => {
  cat.addEventListener("click", () => {
    clickedCategory = cat.dataset.categoryid;
    showTheseItems(clickedCategory);
  });
});

const showTheseItems = (categoryCode) => {
  itemContainer.innerHTML = "";
  items.forEach((item) => {
    if (item.categoryId === categoryCode) {
      itemContainer.innerHTML += `   <div class="items" id="${item.id}" data-categoryId="${item.categoryId}">
                        <h2 class="items-name">${item.name}</h2>
                        <h3 class="items-price">${item.price} Pkr</h3>
                        <div class="items-select-color"></div>
                        </div>
                        `;
      // <div id="qtycontainer">
      // <div id="minusbutton"><i class="ri-subtract-line"></i></div>
      // <div class="items-qty">0</div>
      // <div id="plusbutton"><i class="ri-add-line"></i></div>
      // </div>
      // addItemInCart(item.name , item.price)
    }
  });
};

let selectedItems = []; // GLOBAL

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
        const ClubItemOnCart = localStorage.getItem("ClubItemOnCart");
        const booleanValue = ClubItemOnCart ? ClubItemOnCart === "true" : false;
        let clubItemOnSale = booleanValue;

        // Create the main container div for cart item
        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-items");
        cartItem.id = itemId;

        // Check if the item is already added or not
        const clubItemId = selectedItems.find((id) => id.id === itemId);

        if (clubItemOnSale === false || clubItemId === undefined) {
          // Create the left section of the cart item
          let cartItemsLeft = document.createElement("div");
          cartItemsLeft.classList.add("cart-items-left");

          // Create and append the quantity element
          const cartItemsQty = document.createElement("h4");
          cartItemsQty.classList.add("cart-items-qty");
          cartItemsQty.textContent = 1; // Set text content
          qtyToInt = parseInt(cartItemsQty.textContent);
          cartItemsLeft.appendChild(cartItemsQty);

          // Create and append the item name element
          const cartItemsName = document.createElement("h3");
          cartItemsName.classList.add("cart-items-name");
          cartItemsName.textContent = itemName.innerText; // Use text from itemName
          cartItemsLeft.appendChild(cartItemsName);

          // Append the left section to the main cart item container
          cartItem.appendChild(cartItemsLeft);

          // Create and append the price element
          const cartItemsPrice = document.createElement("h4");
          cartItemsPrice.classList.add("cart-items-price");
          cartItemsPrice.textContent = parseInt(itemPrice.innerText); // Use text from itemPrice
          cartItem.appendChild(cartItemsPrice);

          // Append the entire cart item to the cart container
          cartContainer.appendChild(cartItem);
        } else if (clubItemOnSale === true || clubItemId === !undefined) {
          // Club Quantity
          const CartItems = document.querySelectorAll(".cart-items");
          const itemsWithId = Array.from(CartItems).find(
            (el) => el.id === itemId
          );
          const qtyDiv = itemsWithId.querySelector(`.cart-items-qty`);
          qtyToInt = parseInt(qtyDiv.innerText++);

          // Club Rates
          const cartItemsPrice = itemsWithId.querySelector(".cart-items-price");
          cartItemsPrice.textContent =
            parseInt(itemPrice.innerText) * parseInt(qtyDiv.innerText);
        }
      };

      addItemInCart();
      selectedItems.push(item); // make an array of selected item id's

      // Cart array making
      let cart = document.querySelectorAll(".cart-items");

      cartItems = []; // Clear the cartItems array before populating it
      cart.forEach((item) => {
        let quantity = item.children[0].children[0].innerText;
        let name = item.children[0].children[1].innerText;
        let price = item.children[1].innerText;

        cartItems.push({ name: name, price: price, qty: quantity });
      });

      const calulateInvoice = () => {
        subtotal = 0;
        let ItemAmountArray = [];
        const ItemAmount = document.querySelectorAll(".cart-items-price");
        ItemAmount.forEach((item) => {
          ItemAmountArray.push(item.innerText);
        });
        for (let index = 0; index < ItemAmountArray.length; index++) {
          subtotal += parseInt(ItemAmountArray[index]);
        }

        document.querySelector(
          "#subtotal-values"
        ).innerHTML = `PKR ${subtotal}`;
        document.querySelector("#total-values").innerHTML = `PKR ${subtotal}`;
      };
      calulateInvoice();
    }
  });

  // payment method selection effect
  const paymentBtn = document.querySelectorAll(".payment-methods-icons");

  paymentBtn.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      paymentBtn.forEach((remove) => {
        remove.style.backgroundColor = "";
        remove.style.color = "";
      });
      btn.style.backgroundColor = "white";
      btn.style.color = "black";
      SelectedPaymentMethod = e.target.id;
    });
  });
}

// Update and save parameter in Setup
const setupChange = () => {
  const ClubItemOnCart = document.getElementById("ClubItemOnCart");
  localStorage.setItem("ClubItemOnCart", ClubItemOnCart.checked ? "true" : "false");

  const receiptAddress = document.getElementById("address");
  localStorage.setItem("address", receiptAddress.value);

  const receiptNumber = document.getElementById("receipt-number");
  localStorage.setItem("receiptNumber", receiptNumber.value);

  const receiptNote = document.getElementById("note");
  localStorage.setItem("note", receiptNote.value);

};

if (document.title === "Setup") {
  const updateButton = document.querySelector(".update-btn");
  const ClubItemOnCart = document.getElementById("ClubItemOnCart");
  const receiptAddress = document.getElementById("address");
  const receiptNumber = document.getElementById("receipt-number");
  const receiptNote = document.getElementById("note");

  // Set the value of the checkbox based on the local storage
  localStorage.getItem("ClubItemOnCart") === "true" ? (ClubItemOnCart.checked = true) : (ClubItemOnCart.checked = false);
  localStorage.getItem("address") ? (receiptAddress.value = localStorage.getItem("address")) : (receiptAddress.value = "");
  localStorage.getItem("receiptNumber") ? (receiptNumber.value = localStorage.getItem("receiptNumber")) : (receiptNumber.value = "");
  localStorage.getItem("note") ? (receiptNote.value = localStorage.getItem("note")) : (receiptNote.value = "");
  updateButton.addEventListener("click", () => {
    setupChange();
  });
}

//When click on Pay Button
payButton.addEventListener("click", () => {
  let receiptContainer = document.getElementById("receiptContainer");

  // If subtotal is null, show an alert and return
  if (subtotal === null) {
    alert("Please select an item to proceed");
    return;
  }
  else if (SelectedPaymentMethod === null) {
    alert("Please select a payment method to proceed");
    return;
  }
  // If esc key is pressed, close the receipt
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      receiptContainer.innerHTML = "";
    }
  });
  receiptContainer.innerHTML = `
<div id="receiptbody">
    <div class="receipt">
        <div class="header">
            <img src="./img/logo.jpg" alt="Logo">
            <div class="contact-details">
                <p><strong>Address:</strong> ${localStorage.getItem("address")}</p>
                <p><strong>Phone:</strong> ${localStorage.getItem("receiptNumber")}</p>
            </div>
        </div>

        <!-- Bill Details Section -->
        <div class="bill-details">
            <p><strong>Bill No:</strong> 00123</p>
            <p><strong>Bill Date:</strong> 25 April 2016</p>
            <p><strong>Customer Name:</strong> Vladyslav</p>
            <p><strong>Payment Method:</strong> ${SelectedPaymentMethod}</p>
        </div>


        <!-- Cart Header -->
        <div class="cart-header">
            <span>Item</span>
            <span>Qty</span>
            <span>Rate</span>
            <span>Amount</span>
        </div>

        <!-- Cart Items -->
        <div class="cart">
  
        </div>

        <!-- Total Section -->
        <div class="total">
            <span>TOTAL</span>
            <span>${subtotal}</span>
        </div>

        <!-- Barcode -->
        <div class="barcode">
            <img src="./img/invoice barcode.png" alt="Barcode">
        </div>

        <!-- Print Button -->
        <a href="#" class="print-button" onclick="window.print(); return false;">Print Receipt</a>
    </div>
</div>

        `;
  const cart = document.querySelector(".cart");
  cartItems.forEach((item) => {
    cart.innerHTML += `

          <div class="cart-item">
          <span>${item.name}</span>
          <span>${item.qty}</span>
          <span>${item.price / item.qty}</span>
          <span>${item.price}</span>

          </div>
          `;
  });
});
