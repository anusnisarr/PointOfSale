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
const payButton = $("#placeorder-btn-name");
const currentDate = new Date().toLocaleString("en-US");

// Initialize variables for selected items, payment method, subtotal, and last bill number
let selectedItems = []; // Array to store selected items
let SelectedPaymentMethod = "Cash";
let subtotal = null; // Global variable to store subtotal
let lastBillNo = localStorage.getItem("lastBillNo") || 0;

// Retrieve receipt note and sale history from localStorage
let receiptNote = localStorage.getItem("note");
let SaleHistory = JSON.parse(localStorage.getItem("SaleHistory")) || [];

// Extract all barcodes from items
const allBarcode = items.map((item) => item.Barcode);
const allCategoryCode = categories.map(category => category.CategoryCode);

// Select the receipt container and retrieve address and receipt number from localStorage
const receiptContainer = $("#receiptContainer");
const address = localStorage.getItem("address");
const receiptNumber = localStorage.getItem("receiptNumber");

// Increment the last bill number and update it in localStorage
lastBillNo = Number(lastBillNo) + 1;
localStorage.setItem("lastBillNo", lastBillNo);

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
    `)
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
    
    const itemCountText = $(cat).children().last().text();
    const itemContainer = $("#itemcontainerId");

    if (itemCountText === "0 Items") {
      itemContainer.html("<h3>No Items Available</h3>");
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
      itemContainer.append(`   <div class="items" id="${item.ItemId}" data-categoryId="${item.CategoryCode}">
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
      const ClubItemOnCart = localStorage.getItem("ClubItemOnCart");
      const booleanValue = ClubItemOnCart ? ClubItemOnCart === "true" : false;
      let clubItemOnSale = booleanValue;

      let CartArrayMaker = () => {
        let cart = $(".cart-items");
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
      };
      CartArrayMaker();

      // Check if the item is already added or not
      const clubItemId = selectedItems.find((id) => id.id === itemId);

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
    };
    addItemInCart();

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

    // Handle item removal from cart
    $(".ri-delete-back-2-fill").each((index, item) => {
      $(item).on("click", (e) => {
        const cartItem = $(e.target).closest(".cart-items");
        const itemId = cartItem.attr("id");
        cartItem.remove();
        const clickedItem = $(".items").filter(function () {
          return $(this).attr("id") === itemId;
        });

        // Remove clicked class and color if no item in cart matches the clicked item
        let alreadyInCart = $(".cart-items").filter(function () {
          return $(this).attr("id") === clickedItem.attr("id");
        });

        if (alreadyInCart.length === 0) {
          clickedItem.removeClass("clicked");
          clickedItem.css("color", "white");

        }

        // Remove item from selectedItems array
        selectedItems = selectedItems.filter((item) => item.id !== itemId);

        // Recalculate subtotal
        calulateInvoice();
        updateReturnCash();
      });
    });

    // Calculate invoice subtotal
    const calulateInvoice = () => {
      subtotal = null;
      let ItemAmountArray = [];
      const ItemAmount = $(".cart-items-price");
      ItemAmount.each((index, item) => {
        ItemAmountArray.push($(item).text());
      });

      // Making subtotal value
      for (let index = 0; index < ItemAmountArray.length; index++) {
        subtotal += parseInt(ItemAmountArray[index]);
      }

      $("#subtotal-values").html(`PKR ${subtotal}`);
      $("#total-values").html(`PKR ${subtotal}`);
    };
    calulateInvoice();
    updateReturnCash();
  }
});

// Handle payment method selection
paymentBtn.on("click", function (e) {
  // Reset styles for all buttons
  paymentBtn.removeClass("payment-methods-select")

  // Apply selected styles to the clicked button
  $(this).addClass("payment-methods-select");

  // Get the selected payment method ID
  SelectedPaymentMethod = $(this).attr("id");
  
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
  if (subtotal) {
    
  }

  if (receivedCash > subtotal && receivedCash > 0 && subtotal !== null) {
      const returnCash = receivedCash - subtotal;
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

// When click on Pay Button
payButton.on("click", () => {
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

  // Generate receipt
  receiptContainer.html(`
    <div class="closeBtn"><i class="ri-close-line"></i></div>

      <div id="receiptbody">
        <div class="receipt">
          <div class="header">
            <img src="img/logo.jpg" alt="Logo">
            <div class="contact-details">
              <p style="display: ${address ? 'block':'none'}"><strong>Address:</strong> ${address}</p>
              <p style="display: ${receiptNumber ? 'block':'none'}"><strong>Phone:</strong> ${receiptNumber}</p>
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
          <div class="total">
            <span>Total:</span>
            <span>${subtotal}</span>
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
    const itemQty = $(item).find(".cart-items-qty").text();
    const itemPrice = $(item).find(".cart-items-price").text() / itemQty;
    const itemAmount = $(item).find(".cart-items-price").text();

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

// Add in localStorage SaleHistory
  SaleHistory.push({
    BillNo: lastBillNo,
    BillDate: currentDate,
    PaymentMethod: SelectedPaymentMethod,
    TotalAmount: subtotal,
    ReturnCash: returnCashDisplay.text(),
    ReceivedCash: receivedCashInput.val(),
    Items: items,
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
