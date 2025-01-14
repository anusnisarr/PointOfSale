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
  //run
  SaleHistoryList();
  
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
  //run
SaleHistoryDeleteBtn();
  
  