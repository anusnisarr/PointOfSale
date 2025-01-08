// Select the container and button
const sellScreenElements = $("#selectedContainers");
const leftSideOption = $(".menu li");
const cartContainer = $(".cart-items-container");
let itemContainer = $(".itemcontainer");
const categoryContainer = $(".category");
let items = JSON.parse(localStorage.getItem("items")) || [];
const payButton = $("#placeorder-btn-name");
const currentDate = new Date().toLocaleString("en-US");
let SelectedPaymentMethod = null;
let subtotal = null; // Global variable to store subtotal
let receiptNote = localStorage.getItem("note");

let CategoryArray = Array.from(categoryContainer);
const allBarcode = items.map((item) => item.barcode); // Extract all barcodes

// Iterate over each category and count items
CategoryArray.forEach((category) => {
  let itemCount = $(category).find(".items-count");
  let categoryId = $(category).data("categoryid"); // Get the category ID from dataset

  // Filter items belonging to this category
  let itemsInCategory = items.filter((item) => item.categoryId === categoryId);

  itemCount.text(`${itemsInCategory.length} Items`);
});

let selectedItems = []; // Array to store selected items

const navContainer = $(".nav-container");

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
  const itemRow = $(".item-table tbody");
  items.forEach((item, index) => {
    itemRow.append(`
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
  itemListScreen();
  addItemScreen();
  itemDeleteBtn();
}

categoryContainer.each((index, cat) => {
  $(cat).on("click", () => {
    clickedCategory = $(cat).data("categoryid");
    showTheseItems(clickedCategory);
  });
});

const showTheseItems = (categoryCode) => {
  itemContainer.html("");
  items.forEach((item) => {
    if (item.categoryId === categoryCode) {
      itemContainer.append(`   <div class="items" id="${item.id}" data-categoryId="${item.categoryId}">
                        <h2 class="items-name">${item.name}</h2>
                        <h3 class="items-price">${item.price} Pkr</h3>
                        <div class="items-select-color"></div>
                        </div>
                        `);
    }
  });
};

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

          // Remove item from selectedItems array
          selectedItems = selectedItems.filter(
            (selectedItem) => selectedItem.attr("id") !== itemId
          );

          // Update cartItems array
          cartItems = cartItems.filter((cartItem) => cartItem.id !== itemId);

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

  // payment method selection effect
  const paymentBtn = $(".payment-methods-icons");

  paymentBtn.each((index, btn) => {
    $(btn).on("click", (e) => {
      paymentBtn.each((index, remove) => {
        $(remove).css("backgroundColor", "");
        $(remove).css("color", "");
      });
      $(btn).css("backgroundColor", "white");
      $(btn).css("color", "black");
      SelectedPaymentMethod = $(e.target).attr("id");
    });
  });
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
  if (subtotal === null) {
    alert("Please select an item to proceed");
    return;
  } else if (SelectedPaymentMethod === null) {
    alert("Please select a payment method to proceed");
    return;
  }

  const receiptContainer = $("#receiptContainer");
  const address = localStorage.getItem("address");
  const receiptNumber = localStorage.getItem("receiptNumber");

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
          <p><strong>Bill No: </strong> 00123</p>
          <p><strong>Bill Date: </strong>${currentDate}</p>
          <p><strong>Customer Name: </strong></p>
          <p><strong>Payment Method: </strong> ${SelectedPaymentMethod}</p>
        </div>
        <div class="cart-header">
          <span>Item</span>
          <span>Qty</span>
          <span>Rate</span>
          <span>Amount</span>
        </div>
        <div class="cart"></div>
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

  const cart = $(".cart");
  $(".cart-items").each((index, item) => {
    const itemName = $(item).find(".cart-items-name").text();
    const itemQty = $(item).find(".cart-items-qty").text();
    const itemPrice = $(item).find(".cart-items-price").text() / itemQty;
    const itemAmount = $(item).find(".cart-items-price").text();

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
});

let SaleHistory = [
  {
    BillNo: "1",
    BillDate: undefined,
  },
];
