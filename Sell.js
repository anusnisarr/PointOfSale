// Select the container and button elements
const sellScreenElements = $("#selectedContainers");
const leftSideOption = $(".menu li");
const cartContainer = $(".cart-items-container");
let itemContainer = $(".itemcontainer");
const searchBox = $("#itemsearchbox");
const saleHistorySearchBox = $("#salesearchbox")

// Retrieve items /categories from localStorage or initialize an empty array
let items = JSON.parse(localStorage.getItem("items")) || [];
let categories = JSON.parse(localStorage.getItem("Categories")) || [];

// Select the pay button and get the current date
const paymentBtn = $(".payment-methods-icons");
const payButton = $(".pay-btn");
const directPay = $("#directPay")
const placeOrder = $(".placeOrder-btn")
const currentDate = new Date().toLocaleString("en-US");

// Initialize variables for selected items, payment method, subtotal, and last bill number
let selectedItems = []; // Array to store selected items

let lastBillNo = localStorage.getItem("lastBillNo") || 1;

// Retrieve tax percentage based on selected payment method
let SelectedPaymentMethod = "Cash";
let selectedTaxPercentage;
if (localStorage.getItem("Tax")) {
  selectedTaxPercentage = SelectedPaymentMethod === "Cash" ? JSON.parse(localStorage.getItem("Tax")).CashTax : JSON.parse(localStorage.getItem("Tax")).CardTax;
} else {
  selectedTaxPercentage = SelectedPaymentMethod === "Cash" ? 0 : 0; // Default tax percentage if not available in localStorage
}

let subtotal = 0; // Global variable to store subtotal
let total = 0 // Global variable to store total
let taxvalue = 0; // Global variable to store tax value


// Retrieve receipt note and sale history from localStorage



// Extract all barcodes from items
const allBarcode = items.map((item) => item.Barcode);
const allCategoryCode = categories.map(category => category.CategoryCode);

// Check if the receipt details are available in localStorage, if not initialize them
if (!localStorage.getItem("ReceiptDetails")) {
  let receiptDetails = {
    Address: "",
    Number: "",
    Note: "",
  };
  localStorage.setItem("ReceiptDetails", JSON.stringify(receiptDetails));  
}
// Select the receipt container and retrieve address and receipt number from localStorage
const receiptContainer = $("#receiptContainer");
const address = JSON.parse(localStorage.getItem("ReceiptDetails")).Address;
const receiptNumberValue = JSON.parse(localStorage.getItem("ReceiptDetails")).Number;
let receiptNoteValue = JSON.parse(localStorage.getItem("ReceiptDetails")).Note;

// Select the received amount input and return amount display elements
let receivedCashInput = $("#receiveCash");
let returnCashDisplay = $("#returnCash");
let receiptBalanceTitle = $(".cashOptions");



// Show loader animation
const showLoader = (mainDiv) => {
  const content = $(`.${mainDiv ? mainDiv : "content"}`);
  content.html(`<span class="loader"></span>`);
  $(".loader").show();
};

// Hide loader animation
const hideLoader = () => {
  const content = $(".content");
  content.html(`<span class="loader"></span>`);
  $(".loader").hide();
};


//show categories on sell screen
categories.forEach((category)=>{
  $(".categorycontainer").append(`
    <div class="category" data-categorycode="${category.CategoryCode}" data-categoryname="${category.CategoryName}">
        <h2 class="category-name">${category.CategoryName}</h2>
        <h3 class="items-count">0 Items</h3>
  </div> 
  `);
})

const allCategories = $(".category");

// Iterate over each category and count items
allCategories.each((index , category) => {
  
  let itemCount = $(category).find(".items-count");
  
  const CategoryCode = $(category).data("categorycode"); // Get the category ID from dataset

  // Filter items belonging to this category
  let itemsInCategory = items.filter((item) => item.CategoryCode === CategoryCode);

  itemCount.text(`${itemsInCategory.length} Items`);
});

// Handle category click events
allCategories.each((index, cat) => {
  $(cat).on("click", () => {
    const categoryName = $(cat).find(".category-name").text()
    const itemCountText = $(cat).children().last().text();
    const itemContainer = $("#itemcontainerId");

    if (itemCountText === "0 Items") {
      itemContainer.html(`<h3>No Item in ${categoryName}</h3>`);
      itemContainer.addClass("centerText").removeClass("itemcontainer");
    } else {
      itemContainer.removeClass("centerText").addClass("itemcontainer");
      const CategoryCode = $(cat).data("categorycode");
      
      showTheseItems(CategoryCode);
      keepItemSelected();
    }
  });
});

// Show items based on category
const showTheseItems = (CategoryCode) => {
  itemContainer.html("");
  items.forEach((item) => {
    if (item.CategoryCode === CategoryCode) {
      itemContainer.append(`<div class="items" id="${item.ItemId}" data-categoryId="${item.CategoryCode}">
                        <h2 class="items-name">${item.ItemName}</h2>
                        <h3 class="items-price">${item.SaleRate} Pkr</h3>
                        <div class="items-select-color"></div>
                        </div>
                        `);
    }
  });
};

// Keep selected items highlighted
const keepItemSelected = () => {
  const cartItems = $(".cart-items");
  cartItems.each((index, cartItem) => {
    const itemId = $(cartItem).attr("id");
    const itemElement = $(`.items#${itemId}`);
    if (itemElement.length) {
      itemElement.addClass("clicked");
      itemElement.css("color", "black");
    }
  });
};

// Handle item search
const itemSearchHandler = (searchBox, searchIn, callback ) => {
  searchBox.on("input", function () {
    const searchValue = $(this).val().toLowerCase();    
  const searchResult = searchIn.filter((item) => {
    return item.ItemName.toLowerCase().includes(searchValue) ||
           item.Barcode.toString().includes(searchValue) ||
           item.SaleRate.toString().includes(searchValue)
  });
    callback(searchResult);
  });
};

// Usable item search handler to give search box and take searched result array
itemSearchHandler(searchBox, items , (searchResult) => {
  showItemsOnSearch(searchResult);
  keepItemSelected();
});

// Show items based on search result
const showItemsOnSearch = (searchResult) => {
  if (itemContainer.hasClass("centerText")) {
    itemContainer.removeClass("centerText");
    itemContainer.addClass("itemcontainer");
  }
  
  itemContainer.empty(); // Clear previous search results

  searchResult.forEach((item) => {    
    itemContainer.append(`
      <div class="items" id="${item.ItemId}" data-categoryCode="${item.CategoryCode}">
        <h2 class="items-name">${item.ItemName}</h2>
        <h3 class="items-price">${item.SaleRate} Pkr</h3>
        <div class="items-select-color"></div>
      </div>
    `);
  });
};

// Show Most Ordered items
let SaleHistory = JSON.parse(localStorage.getItem("SaleHistory"));
let soldItemCount = {};
if (SaleHistory) {
  soldItemCount = SaleHistory.flatMap(sale => sale.Items)
    .reduce((acc, item) => {
      acc[item.ItemName] = (acc[item.ItemName] || 0) + item.Qty;
      return acc;
    }, {});
}
  
$(".trending-btn").on("click", (e) => {
  $(e.target).toggleClass("trending-btn-clicked");
  console.log($(e.target).hasClass("trending-btn-clicked"));
  if ($(e.target).hasClass("trending-btn-clicked")) {
    const sortedSoldItems = Object.entries(soldItemCount).sort(
      (a, b) => b[1] - a[1]
    );
    const soldItemNames = sortedSoldItems.map((item) => item[0]);
    const soldItemQty = sortedSoldItems.map((item) => item[1]);
    const totalSoldQty = soldItemQty.reduce((acc, qty) => acc + qty, 0);
    let solditems = items.filter((item) =>
      soldItemNames.includes(item.ItemName)
    );
    let sortedSoldItemsArray = solditems.slice().sort((a, b) => {
      const aQty = soldItemCount[a.ItemName];
      const bQty = soldItemCount[b.ItemName];
      return bQty - aQty;
    });

    showItemsOnSearch(sortedSoldItemsArray);
    keepItemSelected();

    let Items = $(".items");
    Items.each((index, item) => {
      const itemName = $(item).find(".items-name").text();
      const soldItemIndex = soldItemNames.indexOf(itemName);
      if (soldItemIndex !== -1) {
        let soldPercentage = (soldItemQty[soldItemIndex] / totalSoldQty) * 100;
        $(item).append(
          `<span class="TopSold"><i class="ri-arrow-up-double-fill"></i> <h3 class="items-sold">${Math.round(
            soldPercentage
          )}%</h3></span>`
        );
      }
    });
  } else {
    showItemsOnSearch(items);
    keepItemSelected();
  }
});

// Show all items initially
showItemsOnSearch(items.filter((item) => item.ItemName.toLowerCase().includes("")));

// Handle item click events
itemContainer.on("click", (event) => {
  const clickedElement = $(event.target);
  const item = clickedElement.closest(".items");

  

  if (item.length) {

    // Change item color on click
    item.addClass("clicked");
    item.css("color", "black");

    let addItemInCart = () => {
      const itemId = item.attr("id");
      const itemName = item.find(".items-name");
      const itemPrice = item.find(".items-price");
      const itemQty = { innerText: 1 }; // Default quantity to 1
      const ClubItemOnCart = JSON.parse(localStorage.getItem("Parameters")) ? JSON.parse(localStorage.getItem("Parameters")).ClubItemOnCart : "";
      const booleanValue = ClubItemOnCart ? ClubItemOnCart === "true" : false;
      let clubItemOnSale = booleanValue;

      // Check if the item is already added or not
      const clubItemId = $(".cart-items").filter(function() {
        return $(this).attr("id") === itemId;
      }).length > 0;

      // Create the main container div for cart item
      const cartItem = $("<div>").addClass("cart-items").attr("id", itemId);

      if (!clubItemOnSale || !clubItemId) {
        // Create and append the quantity element
        const cartItemsQty = $("<h4>").addClass("cart-items-qty").text(1);
        cartItem.append(cartItemsQty);

        // Create and append the center section of the cart item
        const nameAndPrice = $("<div>").addClass("cart-price-name-container");

        // Create and append the item name element
        const cartItemsName = $("<h3>")
          .addClass("cart-items-name")
          .text(itemName.text());
        nameAndPrice.append(cartItemsName);

        // Create and append the price element
        const cartItemsPrice = $("<h4>")
          .addClass("cart-items-price")
          .text(parseInt(itemPrice.text()) * parseInt(itemQty.innerText));
        nameAndPrice.append(cartItemsPrice);

        // Append the name and price to the cart item
        cartItem.append(nameAndPrice);

        // Create and append the remove element
        const cartItemsRemove = $("<i>").addClass("ri-delete-back-2-fill");
        cartItem.append(cartItemsRemove);

        // Append the entire cart item to the cart container
        cartContainer.append(cartItem);
      } else if (clubItemOnSale === true || clubItemId !== undefined) {
        // Club Quantity
        const CartItems = $(".cart-items");

        const itemsWithId = CartItems.filter(function () {
          return $(this).attr("id") === itemId;
        });

        const qtyDiv = itemsWithId.find(`.cart-items-qty`);

        let qtyToInt = parseInt(qtyDiv.text());

        qtyDiv.text(++qtyToInt);

        // Club Rates
        const cartItemsPrice = itemsWithId.find(".cart-items-price");
        cartItemsPrice.text(parseInt(itemPrice.text()) * qtyToInt);
      }

    // Make item quantity editable
    let cartItemsQty = $(".cart-items-qty");
    cartItemsQty.each((index, qty) => {
      $(qty).on("click", () => {
        $(qty).attr("contentEditable", true).focus();
      });
      const updateQty = () => {
        $(qty).attr("contentEditable", false);
        const editedQty = parseInt($(qty).text());
        const cartItem = $(qty).closest(".cart-items");
        const itemPrice = items.find((item) => item.ItemId === parseInt(cartItem.attr("id"))).SaleRate;
        const cartItemsPrice = cartItem.find(".cart-items-price");
        cartItemsPrice.text(itemPrice * editedQty);
        calulateInvoice();
        updateReturnCash();        
      };

      $(qty).on("keydown", (e) => {
        if (e.key === "Enter") {
          updateQty();
        }
      });
      $(document).on("click", (e) => {
        if (!$(qty).is(e.target)) {
          updateQty();
        }
      });
    });



  };
  addItemInCart();

    let cart = $(".cart-items");
    selectedItems = []

    cart.each((index, item) => {
      let quantity = $(item).children().eq(0).text();
      let name = $(item).children().eq(1).children().eq(0).text();
      let price = $(item).children().eq(1).children().eq(1).text();
      let id = $(item).attr("id");
      
      selectedItems.push({
        id: id,
        name: name,
        price: price,
        qty: quantity,
      });

    });
 
    calulateInvoice();
    updateReturnCash();
  }
});

    // Calculate invoice subtotal
    const calulateInvoice = () => {
      subtotal = 0;
      taxvalue = 0;
      total = 0;
      let ItemAmountArray = [];
      const ItemAmount = $(".cart-items-price");
      ItemAmount.each((index, item) => {
        ItemAmountArray.push($(item).text());
      });

      // Making subtotal value
      for (let index = 0; index < ItemAmountArray.length; index++) {
        subtotal += parseInt(ItemAmountArray[index]);
      }
      $("#subtotal-values").html(`PKR ${subtotal ? subtotal : 0}`);

      taxvalue = (subtotal * selectedTaxPercentage / 100); 
      $("#tax-values").html(`PKR ${taxvalue ? taxvalue : 0}`);
      $("#tax-title").html(`Tax (${selectedTaxPercentage}%)`);

      total = subtotal + (subtotal * selectedTaxPercentage / 100);      
      $("#total-values").html(`PKR ${total ? total : 0}`);

    };

const removeFromCart = () => {
  // Handle item removal from cart
  cartContainer.on("click", ".ri-delete-back-2-fill", (e) => {
    const cartItem = $(e.target).closest(".cart-items");
    const itemId = cartItem.attr("id");
    const clickedItem = $(`.items#${itemId}`);

    cartItem.remove();

    // Remove clicked class and color if no item in cart matches the clicked item
    if ($(`.cart-items#${itemId}`).length === 0) {
      clickedItem.removeClass("clicked").css("color", "white");
    }
    if (!selectedItems.length) {
      receivedCashInput.val("");
    }
    // Remove item from selectedItems array
    selectedItems = selectedItems.filter((item) => item.id !== itemId);

    // Recalculate subtotal
    calulateInvoice();
    updateReturnCash();
  });

  $(".discard-order-btn").on("click", () => {    
    if ($(".cart-items").length === 0) return
    let clearItemConfirm = confirm("Are you sure you want to discard the order?");    
      if (!clearItemConfirm) return; // Stop if user cancels
      $(".cart-items").remove();
      $(".items").removeClass("clicked").css("color", "white");
      selectedItems = [];
      calulateInvoice();
      updateReturnCash();
    });
}
removeFromCart()




// handle place order button
placeOrder.on("click", (e) => {

  $(".overlay").css("display" , "flex").html(`
        <div class="popup">
        <div class="closeBtn"><i class="ri-close-line"></i></div>
            <h2>Select Waiter</h2>
            <div class="buttons-container">
                <button class="waiterButton" id="w1">Waiter 1</button>
                <button class="waiterButton" id="w2">Waiter 2</button>
                <button class="waiterButton" id="w3">Waiter 3</button>
                <button class="waiterButton" id="w4">Waiter 4</button>
            </div>
            <h2>Select Table</h2>
            <div class="buttons-container">
                <button class="tableButton" id="T1">Table 1</button>
                <button class="tableButton" id="T2">Table 2</button>
                <button class="tableButton" id="T3">Table 3</button>
                <button class="tableButton" id="T4">Table 4</button>
                <button class="tableButton" id="T5">Table 5</button>
                <button class="tableButton" id="T6">Table 6</button>
                <button class="tableButton" id="T7">Table 7</button>
                <button class="tableButton" id="T8">Table 8</button>
                <button class="tableButton" id="T9">Table 9</button>
                <button class="tableButton" id="T10">Table 10</button>
                <button class="tableButton" id="T11">Table 11</button>
                <button class="tableButton" id="T12">Table 12</button>
            </div>
            <button class="submit-button" id="T12">Submit</button>
        </div>`
  );

  let order =  JSON.parse(localStorage.getItem("OrderDetails"))
  if (order) {    
    $(".tableButton").filter((index, table) => order.some(o => o.Table === table.id)).addClass("disabled");
    
  }
  


let selectedTable;
let selectedWaiter;

  $(".tableButton").on("click", (e)=>{
    $(".tableButton").removeClass("selected");
    $(e.target).addClass("selected");
    selectedTable = e.target.id;
  })
  
  $(".waiterButton").on("click", (e)=>{
    $(".waiterButton").css("backgroundColor", "transparent");
    $(".waiterButton").css("color", "#6BFFD8");
    $(e.target).css("backgroundColor", "#6BFFD8");
    $(e.target).css("color", "black");  
    selectedWaiter = $(e.target).text();
})

let currentDate = new Date().toISOString().split('T')[0].replace(/-/g, '');
let sequentialNumber = localStorage.getItem("sequentialNumber") || 1;
let orderNo = `${currentDate}-${sequentialNumber}`;

let OrderDetails = JSON.parse(localStorage.getItem("OrderDetails")) || [];

$(".submit-button").on("click", (e)=>{
  if (!selectedTable || !selectedWaiter) {
      alert("You missed selecting table or waiter!")
    
  }
  if (selectedItems.length === 0) {
    alert("You haven't selected any item!")
  }
  else{
sequentialNumber = parseInt(sequentialNumber) + 1;
localStorage.setItem("sequentialNumber", sequentialNumber);
  OrderDetails.push({
    OrderNo: orderNo,
    Table: selectedTable,
    Waiter: selectedWaiter,
    Items: selectedItems,
    TaxPercentage: selectedTaxPercentage,
    Tax: taxvalue,
    SubTotal: subtotal,
    Total: total,
    PaymentMethod: SelectedPaymentMethod,
    Date: currentDate
  });
  
  localStorage.setItem("OrderDetails", JSON.stringify(OrderDetails));
  
$("#pendingOrdersContainer").prepend(`
  <div class="pendingOrders" id="${orderNo}">
  <div class="tableName">
    <h2>${selectedTable}</h2>
  </div>
  <div class="leftSideInfoContainer">
    <div class="waiterNamAndStatus">
      <div class="waiterName">
        <h3>${selectedWaiter}</h3>
      </div>
      <div class="status">
        <h4>Pending</h4>
      </div>
    </div>
    <div class="itemCount">
      <h4>${selectedItems.length} Items</h4>
    </div>
  </div>
</div>
`);

cartContainer.html("");
$(".items").removeClass("clicked").css("color", "white");
selectedItems = [];
calulateInvoice();
updateReturnCash();
$(".overlay").css("display", "none");

}
});

    $(".closeBtn").on("click", (e)=>{
    $(".overlay").css("display", "none");
      })

})




// Handle payment method selection
paymentBtn.on("click", function (e) {
  // Reset styles for all buttons
  paymentBtn.removeClass("payment-methods-select")

  // Apply selected styles to the clicked button
  $(this).addClass("payment-methods-select");

  // Get the selected payment method ID
  SelectedPaymentMethod = $(this).attr("id");

  if (SelectedPaymentMethod === "Cash") {
    selectedTaxPercentage = JSON.parse(localStorage.getItem("Tax")) ? JSON.parse(localStorage.getItem("Tax")).CashTax : 0;
  }
  else if (SelectedPaymentMethod === "Card"){
    selectedTaxPercentage = JSON.parse(localStorage.getItem("Tax")) ? JSON.parse(localStorage.getItem("Tax")).CardTax : 0;
  }
  else if (SelectedPaymentMethod === "Party"){
    selectedTaxPercentage = 0;
  }
  
  if (this.id !== "Cash") {
    $("#receiveCashDiv").css("display", "none");
    $("#returnCashDiv").css("display", "none");
  }

  else{
    $("#receiveCashDiv").css("display", "flex");
    $("#returnCashDiv").css("display", "flex");
  }

});

//Updates the display of the return cash amount based on the received cash and subtotal.
const updateReturnCash = ()=>{
  const receivedCash = parseFloat(receivedCashInput.val());
  if (receivedCash > total && receivedCash > 0 && total !== null) {
      const returnCash = receivedCash - total;
      returnCashDisplay.text(returnCash);

    } else {
      returnCashDisplay.text("");
      receiptBalanceTitle.addClass("nodisplay");
    } 
  }

// Event listener to handle input for cash received amount and return
receivedCashInput.on('input', () => {
  updateReturnCash()
});



// Append options container to the body
payButton.on("click", ()=>{
  toggleDropdown()
})


function toggleDropdown() {
  let menu = $("#dropdownMenu");
  if (menu.css("display") === "none") {
    menu.show();
  } else {
    menu.hide();
  }
}

$(document).on("click", function(event) {
  let menu = $("#dropdownMenu");
  let button = $(".pay-btn");
  if (!button.is(event.target) && !menu.is(event.target) && menu.has(event.target).length === 0) {
    menu.hide();
  }
});

// When click on Pay Button
directPay.on("click", (e) => {
  actionMenu = $("#dropdownMenu");
  actionMenu.css("display", "none")

  if (!subtotal) {
    alert("Please select an item to proceed");
    return;
  } else if (!SelectedPaymentMethod) {
    alert("Please select a payment method to proceed");
    return;
  } else if (
    $(".cart-items-qty").filter((index, item) => $(item).text() === "0")
      .length > 0
  ) {
    alert("Please add quantity to the item to proceed");
    return;
  }

  // Increment the last bill number and update it in localStorage
  localStorage.setItem("lastBillNo", Number(lastBillNo) + 1);

  // Generate receipt
  receiptContainer.html(`
    <div class="closeBtn"><i class="ri-close-line"></i></div>
      <div id="receiptbody">
        <div class="receipt">
          <div class="header">
            <img src="img/logo.jpg" alt="Logo">
            <div class="contact-details">
              <p style="display: ${address ? 'block':'none'}"><strong>Address:</strong> ${address}</p>
              <p style="display: ${receiptNumberValue ? 'block':'none'}"><strong>Phone:</strong> ${receiptNumberValue}</p>
            </div>
          </div>
          <div class="bill-details">
            <p><strong>Bill No: </strong> ${lastBillNo}</p>
            <p><strong>Bill Date: </strong>${currentDate}</p>
            <p><strong>Customer Name: </strong></p>
            <p><strong>Payment Method: </strong> ${SelectedPaymentMethod}</p>
          </div>
          <div class="item-header">
            <span>Item</span>
            <span>Qty</span>
            <span>Rate</span>
            <span>Amount</span>
          </div>
          <div class="cart-item-container"></div>
          <div class="subTotalOnReceipt">
            <span>Sub Total:</span>
            <span>${subtotal}</span>
          </div>
          <div class="taxOnReceipt" style="display: ${taxvalue === 0 ? 'none':'flex'}">
            <span>Tax (${selectedTaxPercentage}%):</span>
            <span>${taxvalue}</span>
          </div>
          <div class="totalOnReceipt">
            <span>Total:</span>
            <span>${total}</span>
          </div>
          <div class="cashOptions" style="display: ${(receivedCashInput.val() && receivedCashInput.val() >= subtotal) ? 'flex' : 'none'};">
            <span>Cash Received:</span>
            <span>${receivedCashInput.val()}</span>
          </div>
          <div class="cashOptions" style="display: ${returnCashDisplay.text() ? 'flex' : 'none'};">
            <span>Cash Return:</span>
            <span>${returnCashDisplay.text()}</span>
          </div>
          <div class="barcode">
            <img src="img/invoicebarcode.png" alt="Barcode">
          </div>
        </div>
      </div>
        <a href="#" class="print-button">Print Receipt</a>
  `);

  // Add items to receipt and in localStorage
  let items = [];
  $(".cart-items").each((index, item) => {
    const itemName = $(item).find(".cart-items-name").text();
    const itemQty = Number($(item).find(".cart-items-qty").text());
    const itemPrice = $(item).find(".cart-items-price").text() / itemQty;
    const itemAmount = Number($(item).find(".cart-items-price").text());
    const cart = $(".cart-item-container");

    cart.append(`
      <div class="cart-item">
        <span>${itemName}</span>
        <span>${itemQty}</span>
        <span>${itemPrice}</span>
        <span>${itemAmount}</span>
      </div>
    `);

    items.push({
      ItemName: itemName,
      Qty: itemQty,
      Rate: itemPrice,
      Amount: itemAmount,
    });

  });
  let SaleHistory = JSON.parse(localStorage.getItem("SaleHistory")) || [];

// Add in localStorage SaleHistory
  SaleHistory.push({
    BillNo: lastBillNo,
    BillDate: currentDate,
    PaymentMethod: SelectedPaymentMethod,
    SubTotal: subtotal,
    Tax: taxvalue,
    Total: total,
    ReturnCash: returnCashDisplay.text(),
    ReceivedCash: receivedCashInput.val(),
    Items: items,
    TaxPercentage: selectedTaxPercentage,
  });

  localStorage.setItem("SaleHistory", JSON.stringify(SaleHistory));

  // Handle print button click
  $(".print-button").on("click", function () {
    let originalBody = $("body").html();
    let receiptBody = $("#receiptbody").clone();
    $("body").empty().append(receiptBody);
    window.print();
    receiptContainer.html("");
    location.reload();
    $("body").empty().append(originalBody);
  });
  
  
  // Handle receipt close
  const closeReceipt = (event) => {
    if (event.type === "click") {
      receiptContainer.html("");
      location.reload();
    }
    else if (event.key === "Escape") {
      receiptContainer.html("");
      location.reload();
    }
    $(window).off("keyup", closeReceipt);
  };


  $(".closeBtn").on("click", closeReceipt);
  $(window).on("keyup", closeReceipt);

});



const checkParameters = (parameter) => {

const smallCategorySize = parameter.smallCategorySize;

if (smallCategorySize === "true") {

  $("[data-categoryname='Pizza']").css({
    backgroundPosition: "80px",
    backgroundSize: "90px"
  });
  
  $("[data-categoryname='Burger']").css({
    backgroundPosition: "80px",
    backgroundSize: "90px"
  });
  
  $("[data-categoryname='Pasta']").css({
    backgroundPosition: "80px",
    backgroundSize: "90px"
  });

  $(".categorycontainer").css({
    gridTemplateColumns: "repeat(auto-fill, minmax(10vw, 1fr))",
    gridAutoRows: "08vh",
  });

  $(".category").css({
    padding: "5px 0px 10px 10px",
    overflow: "hidden"
  });

  $(".category-name").css({
    fontSize: "1em",
    paddingBottom: "5px"
  });
  $(".items-count").css({
    fontSize: "0.7em"
  });
}

else{

  $("[data-categoryname='Pizza']").css({
    backgroundPosition: "108px",
    backgroundSize: "145px"
  });
  
  $("[data-categoryname='Burger']").css({
    backgroundPosition: "108px",
    backgroundSize: "145px"
  });
  
  $("[data-categoryname='Pasta']").css({
    backgroundPosition: "108px",
    backgroundSize: "145px"
  });

  $(".categorycontainer").css({
    gridTemplateColumns: "repeat(auto-fill, minmax(14vw, 1fr))",
    gridAutoRows: "12vh",
  });

  $(".category").css({
    padding: "10px 0px 10px 10px",
  });

  $(".category-name").css({
    fontSize: "1.6vmax",
    paddingBottom: "0px"
  });
  $(".items-count").css({
    fontSize: "1vmax"
  });
}
}


checkParameters(JSON.parse(localStorage.getItem("Parameters")) || {});