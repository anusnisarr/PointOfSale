// Select the container and button
const sellScreenElements = $("#selectedContainers");
const leftSideOption = $(".menu li");
const cartContainer = $(".cart-items-container");
let itemContainer = $(".itemcontainer");
const searchBox = $("#itemsearchbox");
const navContainer = $(".nav-container");
const categoryContainer = $(".category");
let CategoryArray = Array.from(categoryContainer);
let items = JSON.parse(localStorage.getItem("items")) || [];
const payButton = $("#placeorder-btn-name");
const currentDate = new Date().toLocaleString("en-US");
let selectedItems = []; // Array to store selected items
let SelectedPaymentMethod = "Cash";
let subtotal = null; // Global variable to store subtotal
let lastBillNo = localStorage.getItem("lastBillNo") || 0;
let receiptNote = localStorage.getItem("note");
let saleHistory = JSON.parse(localStorage.getItem("SaleHistory")) || [];

const allBarcode = items.map((item) => item.barcode); // Extract all barcodes

// Iterate over each category and count items
CategoryArray.forEach((category) => {
  let itemCount = $(category).find(".items-count");
  let categoryId = $(category).data("categoryid"); // Get the category ID from dataset

  // Filter items belonging to this category
  let itemsInCategory = items.filter((item) => item.categoryId === categoryId);

  itemCount.text(`${itemsInCategory.length} Items`);
});

$(document).on("mousemove", (e) => {
  if (e.clientY < 10) {
    // Mouse is near the top of the viewport
    navContainer.css("top", "10px");
  } else if (e.clientY > 63) {
    // Mouse is away from the top
    navContainer.css("top", "-50px");
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

const showLoader = (mainDiv) => {
  const content = $(`.${mainDiv ? mainDiv : "content"}`);
  content.html(`<span class="loader"></span>`);
  $(".loader").show();
};

const hideLoader = () => {
  const content = $(".content");
  content.html(`<span class="loader"></span>`);
  $(".loader").hide();
};

const addItemScreen = () => {
  let CategoryCode = null;
  const addItemButton = $(".add-item-btn");

  addItemButton.on("click", () => {
    $(".content").html(`
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
        `);

    const categoryDropDown = $("#itemCategory");
    categories.forEach((cat) => {
      categoryDropDown.append(`<option value="${cat.id}">${cat.name}</option>`);
    });

    const categorySelection = $("#itemCategory");
    categorySelection.on("change", () => {
      CategoryCode = categorySelection.val();
    });

    setupAddItemHandler();
  });

  const setupAddItemHandler = () => {
    const saveButton = $(".btn");
    saveButton.on("click", (e) => {
      e.preventDefault();

      const itemName = $("#itemName").val();
      const itemCode = Number($("#itemCode").val());
      const itemPrice = Number($("#itemPrice").val());

      let barocdeCheck = allBarcode.find((barcode) => barcode === itemCode);

      if (!itemName || !itemCode || !itemPrice || CategoryCode === null) {
        alert("Please fill out all fields correctly.");
        return;
      } else if (barocdeCheck) {
        alert("Barcode Already Exist");
      } else {
        const newItemId =
          items.length > 0 ? Math.max(...items.map((item) => item.id)) + 1 : 1;
        items.push({
          id: newItemId,
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

const itemImport = () => {
  return new Promise((resolve, reject) => {
    const fileInput = document.getElementById("fileimport");

    fileInput.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();

      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        // Get the first sheet name
        const sheetName = workbook.SheetNames[0];

        // Get the sheet data
        const worksheet = workbook.Sheets[sheetName];

        // Convert the sheet to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        resolve(jsonData);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsArrayBuffer(file);
    });
  });
};

itemImport().then((output) => {
  console.log(output);
  let DuplicateExist;
  console.log(DuplicateExist);
  
  output.forEach((item) => {
    barocdeCheck = allBarcode.find((barcode) => barcode === item.barcode);
    console.log(`${barocdeCheck} this barcode already exist`);
    if (barocdeCheck) {
      DuplicateExist = true
      alert(`Barcode ${item.barcode} Already Exist`);
    } else {
      DuplicateExist = false
      const newItemId =
        items.length > 0 ? Math.max(...items.map((item) => item.id)) + 1 : 1;
      items.push({
        id: newItemId,
        barcode: item.barcode,
        categoryId: item.categoryId,
        name: item.name,
        price: Number(item.price),
        IsActive: true,
      });
      showLoader();
      setTimeout(() => {
        hideLoader();
        location.reload();
      }, 1000);
    }
    
  });
  if (!DuplicateExist) {
    itemListScreen(output);
    localStorage.setItem("items", JSON.stringify(items));
  } 

})
.catch((error) => {
  console.error(error);
});


const itemListScreen = (itemData) => {
  const itemRow = $(".item-table tbody");
  itemData.forEach((item, index) => {
    itemRow.append(`
            <tr>
                <td>${index + 1}</td>
                <td>${item.name}</td>
                <td>${item.barcode}</td>
                <td>${categories.find((cat) => cat.id === item.categoryId).name}</td>
                <td>${item.price}</td>
                <td>${item.IsActive ? "Active" : "Inactive"}</td>
                <td>
                    <button class="edit-btn">Edit</button>
                    <button class="delete-btn" id="${item.barcode}">Delete</button>
                </td>
            </tr>
        `);
  });
};



const itemDeleteBtn = () => {
  let deleteBtn = $(".delete-btn");
  deleteBtn.each((index, btn) => {
    $(btn).on("click", (e) => {
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
  itemListScreen(items);
  addItemScreen();
  itemDeleteBtn();
}

categoryContainer.each((index, cat) => {
  $(cat).on("click", () => {
    const itemCountText = $(cat).children().last().text();
    const itemContainer = $("#itemcontainerId");

    if (itemCountText === "0 Items") {
      itemContainer.html("<h3>No Items Available</h3>");
      itemContainer.addClass("centerText").removeClass("itemcontainer");
    } else {
      itemContainer.removeClass("centerText").addClass("itemcontainer");
      const categoryCode = $(cat).data("categoryid");
      showTheseItems(categoryCode);
    }
  });
});

const showTheseItems = (categoryCode) => {
  itemContainer.html("");
  items.forEach((item) => {
    console.log(item);
    if (item.categoryId === categoryCode) {
      itemContainer.append(`   <div class="items" id="${item.id}" data-categoryId="${item.categoryId}">
                        <h2 class="items-name">${item.name}</h2>
                        <h3 class="items-price">${item.price} Pkr</h3>
                        <div class="items-select-color"></div>
                        </div>
                        `);
    }
  });

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

const itemSearchHandler = (searchBox, callback) => {
  searchBox.on("input", function () {
    const searchValue = $(this).val().toLowerCase();
    const searchResult = items.filter((item) =>
      item.name.toLowerCase().includes(searchValue)
    );

    console.log(searchResult); // Log results
    callback(searchResult); // Pass results to callback
  });
};

// Usable item search handler to give searbox and take searched result array
itemSearchHandler(searchBox, (results) => {
  showItemsOnSearch(results);
});

const showItemsOnSearch = (searchItems) => {
  itemContainer.empty(); // Clear previous search results
  searchItems.forEach((item) => {
    itemContainer.append(`
      <div class="items" id="${item.id}" data-categoryid="${item.categoryId}">
        <h2 class="items-name">${item.name}</h2>
        <h3 class="items-price">${item.price} Pkr</h3>
        <div class="items-select-color"></div>
      </div>
    `);
  });
};

//this line to keep showing all items at first when no category clicked
showItemsOnSearch(items.filter((item) => item.name.toLowerCase().includes("")))

if (document.title === "POS") {
  itemContainer.on("click", (event) => {
    const clickedElement = $(event.target);
    const item = clickedElement.closest(".items");

    if (item.length) {
      //change item Color on click
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
          const itemPrice = items.find(
            (item) => item.id === parseInt(cartItem.attr("id"))
          ).price;
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

      $(".ri-delete-back-2-fill").each((index, item) => {
        $(item).on("click", (e) => {
          const cartItem = $(e.target).closest(".cart-items");
          const itemId = cartItem.attr("id");
          cartItem.remove();
          const clickedItem = $(".items").filter(function () {
            return $(this).attr("id") === itemId;
          });

          // Remove clicked class and color
          clickedItem.removeClass("clicked");
          clickedItem.css("color", "white");

          // Remove item from selectedItems array
          selectedItems = selectedItems.filter((item) => item.id !== itemId);

          // Recalculate subtotal
          calulateInvoice();
        });
      });

      const calulateInvoice = () => {
        subtotal = 0;
        let ItemAmountArray = [];
        const ItemAmount = $(".cart-items-price");
        ItemAmount.each((index, item) => {
          ItemAmountArray.push($(item).text());
        });

        //making subtotal value
        for (let index = 0; index < ItemAmountArray.length; index++) {
          subtotal += parseInt(ItemAmountArray[index]);
        }

        $("#subtotal-values").html(`PKR ${subtotal}`);
        $("#total-values").html(`PKR ${subtotal}`);
      };
      calulateInvoice();
    }
  });

  // Payment method selection effect
  const paymentBtn = $(".payment-methods-icons");

  paymentBtn.on("click", function (e) {
    // Reset styles for all buttons
    paymentBtn.css({
      backgroundColor: "initial", // Use "initial" to reset to the default or inherited value
      color: "white",
    });

    // Apply selected styles to the clicked button
    $(this).css({
      backgroundColor: "white",
      color: "black",
    });

    // Get the selected payment method ID
    SelectedPaymentMethod = $(this).attr("id");
  });
}

const SaleHistoryList = () => {
  const salehistoryRow = $(".history-table tbody");
  saleHistory.forEach((sale, index) => {
    salehistoryRow.append(`
            <tr>
                <td>${sale.BillNo}</td>
                <td>${sale.BillDate}</td>
                <td>${sale.TotalAmount}</td>
                <td>${sale.PaymentMethod}</td>
                  <td>
                    <button class="receipt-btn" id="${sale.BillNo}">Show</button>
                </td>
                <td>
                    <button class="delete-btn" id="${sale.BillNo}">Delete</button>
                </td>
            </tr>
        `);
  });
};

const SaleHistoryDeleteBtn = () => {
  let deleteBtn = $(".delete-btn");
  deleteBtn.each((index, btn) => {
    $(btn).on("click", (e) => {
      saleHistory = saleHistory.filter((sale) => e.target.id != sale.BillNo);
      localStorage.setItem("SaleHistory", JSON.stringify(saleHistory));
      showLoader();
      setTimeout(() => {
        hideLoader();
        location.reload();
      }, 1000);
    });
  });
};

if (document.title === "sale History") {
  SaleHistoryList();
  SaleHistoryDeleteBtn();
}

// Update and save parameter in Setup
const setupChange = () => {
  const ClubItemOnCart = $("#ClubItemOnCart");
  localStorage.setItem(
    "ClubItemOnCart",
    ClubItemOnCart.is(":checked") ? "true" : "false"
  );

  const receiptAddress = $("#address");
  localStorage.setItem("address", receiptAddress.val());

  const receiptNumber = $("#receipt-number");
  localStorage.setItem("receiptNumber", receiptNumber.val());

  const receiptNote = $("#note");
  localStorage.setItem("note", receiptNote.val());
};

if (document.title === "Setup") {
  const updateButton = $(".update-btn");
  const ClubItemOnCart = $("#ClubItemOnCart");
  const receiptAddress = $("#address");
  const receiptNumber = $("#receipt-number");
  const receiptNote = $("#note");

  // Set the value of the checkbox based on the local storage
  localStorage.getItem("ClubItemOnCart") === "true"
    ? ClubItemOnCart.prop("checked", true)
    : ClubItemOnCart.prop("checked", false);
  localStorage.getItem("address")
    ? receiptAddress.val(localStorage.getItem("address"))
    : receiptAddress.val("");
  localStorage.getItem("receiptNumber")
    ? receiptNumber.val(localStorage.getItem("receiptNumber"))
    : receiptNumber.val("");
  localStorage.getItem("note")
    ? receiptNote.val(localStorage.getItem("note"))
    : receiptNote.val("");
  updateButton.on("click", () => {
    setupChange();
    showLoader("setup-container");
    setTimeout(() => {
      hideLoader();
      location.reload();
    }, 1000);
  });
}

//When click on Pay Button
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

  const receiptContainer = $("#receiptContainer");
  const address = localStorage.getItem("address");
  const receiptNumber = localStorage.getItem("receiptNumber");
  lastBillNo = Number(lastBillNo) + 1;
  localStorage.setItem("lastBillNo", lastBillNo);
  console.log(localStorage.getItem("lastBillNo"));

  receiptContainer.html(`
    <div id="receiptbody">
      <div class="receipt">
        <div class="closeBtn"><i class="ri-close-line"></i></div>
        <div class="header">
          <img src="./img/logo.jpg" alt="Logo">
          <div class="contact-details">
            <p><strong>Address:</strong> ${address}</p>
            <p><strong>Phone:</strong> ${receiptNumber}</p>
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
          <span>TOTAL</span>
          <span>${subtotal}</span>
        </div>
        <div class="barcode">
          <img src="./img/invoicebarcode.png" alt="Barcode">
        </div>
        <a href="#" class="print-button" onclick="window.print(); return false;">Print Receipt</a>
      </div>
    </div>
  `);

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
  });

  const closeReceipt = () => {
    receiptContainer.html("");
    location.reload();
    $(window).off("keyup", handleEscKey);
  };

  const handleEscKey = (event) => {
    if (event.key === "Escape") {
      closeReceipt();
    }
  };

  $(".closeBtn").on("click", closeReceipt);
  $(window).on("keyup", handleEscKey);

  addSaleHistory(); // Add this line to run the function on pay
});

const addSaleHistory = () => {
  let SaleHistory = JSON.parse(localStorage.getItem("SaleHistory")) || [];

  let items = [];

  $(".cart-items").each((index, item) => {
    let itemName = $(item).find(".cart-items-name").text();
    let itemQty = $(item).find(".cart-items-qty").text();
    let itemPrice = $(item).find(".cart-items-price").text() / itemQty;
    let itemAmount = $(item).find(".cart-items-price").text();

    items.push({
      ItemName: itemName,
      Qty: itemQty,
      Rate: itemPrice,
      Amount: itemAmount,
    });
  });

  SaleHistory.push({
    BillNo: lastBillNo,
    BillDate: currentDate,
    PaymentMethod: SelectedPaymentMethod,
    TotalAmount: subtotal,
    Items: items,
  });

  localStorage.setItem("SaleHistory", JSON.stringify(SaleHistory));
};
