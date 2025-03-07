const SaleHistoryList = () => {
  const salehistoryRow = $(".history-table tbody");
  SaleHistory.forEach((sale, index) => {
    salehistoryRow.append(`
              <tr>
                  <td>${sale.BillNo}</td>
                  <td>${sale.BillDate}</td>
                  <td>${sale.Total}</td>
                  <td>${sale.PaymentMethod}</td>
                    <td>
                      <button class="receipt-btn" id="${sale.BillNo}">View</button>
                  </td>
                  <td>
                      <button class="delete-btn" id="${sale.BillNo}">Delete</button>
                  </td>
              </tr>
          `);
  });
};
//run
SaleHistoryList();

const SaleHistoryDeleteBtn = () => {
  let deleteBtn = $(".delete-btn");
  deleteBtn.each((index, btn) => {
    $(btn).on("click", (e) => {
      SaleHistory = SaleHistory.filter((sale) => e.target.id != sale.BillNo);
      localStorage.setItem("SaleHistory", JSON.stringify(SaleHistory));
      showLoader();
      setTimeout(() => {
        hideLoader();
        location.reload();
      }, 1000);
    });
  });
};
//run
SaleHistoryDeleteBtn();

const SaleHistoryViewBtn = () => {

  let viewBtn = $(".receipt-btn");
  viewBtn.each((index, btn) => {

    $(btn).on("click", (e) => {
      let bill = SaleHistory.find((bill) => e.target.id == bill.BillNo);
      console.log(bill);
      
      let receiptContainer = $("#receiptcontainer");
      const billNo = bill.BillNo;
      const billDate = bill.BillDate;
      const billPaymentMethod = bill.PaymentMethod;
      const SubTotal = bill.SubTotal;
      const ReceivedCash = bill.ReceivedCash;
      const ReturnCash = bill.ReturnCash;
      const total = bill.Total;
      const tax = bill.Tax;


      receiptContainer.html(`
        <div class="closeBtn"><i class="ri-close-line"></i></div>
      
          <div id="receiptbody">
            <div class="receipt">
              <div class="header">
                <img src="./img/logo.jpg" alt="Logo">
                <div class="contact-details">
                  <p><strong>Address:</strong> ${address}</p>
                  <p><strong>Phone:</strong> ${receiptNumberValue}</p>
                </div>
              </div>
              <div class="bill-details">
                <p><strong>bill No: </strong> ${billNo}</p>
                <p><strong>bill Date: </strong>${billDate}</p>
                <p><strong>Customer Name: </strong></p>
                <p><strong>Payment Method: </strong> ${billPaymentMethod}</p>
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
                  <span>${SubTotal}</span>
                </div>
                <div class="taxOnReceipt">
                  <span>Tax (${selectedTaxPercentage}%):</span>
                  <span>${tax}</span>
                </div>
                <div class="totalOnReceipt">
                  <span>Total:</span>
                  <span>${total}</span>
                </div>
              
          <div class="cashOptions" style="display: ${ReceivedCash > 0 ? 'flex' : 'none'};">
            <span>Cash Received:</span>
            <span>${ReceivedCash}</span>
          </div>
          <div class="cashOptions" style="display: ${ReturnCash > 0 ? 'flex' : 'none'};">
            <span>Cash Return:</span>
            <span>${ReturnCash}</span>
          </div>
              <div class="barcode">
                <img src="./img/invoicebarcode.png" alt="Barcode">
              </div>
            </div>
          </div>
            <a href="#" class="print-button">Print Receipt</a>
      `);
      // Add items to receipt
      bill.Items.forEach((item) => {
        const itemName = item.ItemName;
        const itemQty = item.Qty;
        const itemPrice = item.Rate;
        const itemAmount = item.Amount;

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
    });
  });

  $("#receiptcontainer").append(receiptContainer);
};
//run
SaleHistoryViewBtn();

// Handle receipt close
const closeReceipt = (event) => {  
  console.log(event.key);
  
  if (event.type === "click" || event.key === "Escape") {
    $("#receiptcontainer").html("");
  }
};
$("#receiptcontainer").on("click", ".closeBtn", closeReceipt);
$(window).on("keyup", closeReceipt);