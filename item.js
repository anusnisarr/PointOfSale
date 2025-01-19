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
        categoryDropDown.append(`<option value="${cat.CategoryCode}">${cat.CategoryName}</option>`);
      });
  
      const categorySelection = $("#itemCategory");
      categorySelection.on("change", () => {
        CategoryCode = parseInt(categorySelection.val());
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
            items.length > 0 ? Math.max(...items.map((item) => item.ItemId)) + 1 : 1;
          items.push({
            ItemId: newItemId,
            Barcode: itemCode,
            CategoryCode: CategoryCode,
            ItemName: itemName,
            SaleRate: Number(itemPrice),
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
  
  const itemListScreen = (itemData) => {
    const itemRow = $(".item-table tbody");
    itemData.forEach((item, index) => {
      itemRow.append(`
              <tr>
                  <td>${index + 1}</td>
                  <td>${item.ItemName}</td>
                  <td>${item.Barcode}</td>
                  <td>${
                    categories.find((cat) => cat.CategoryCode === item.CategoryCode).CategoryName
                  }</td>
                  <td>${item.SaleRate}</td>
                  <td>${item.IsActive ? "Active" : "Inactive"}</td>
                  <td>
                      <button class="edit-btn">Edit</button>
                      <button class="delete-btn" id="${
                        item.Barcode
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
    itemImport()
      .then((output) => {
        let DuplicateExist;
  
        output.forEach((item) => {
          barocdeCheck = allBarcode.find((barcode) => barcode === item.barcode);
          console.log(`${barocdeCheck} this barcode already exist`);
          if (barocdeCheck) {
            DuplicateExist = true;
            alert(`Barcode ${item.barcode} Already Exist`);
          } else {
            DuplicateExist = false;
            const newItemId =
              items.length > 0
                ? Math.max(...items.map((item) => item.id)) + 1
                : 1;
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
  
    itemListScreen(items);
    addItemScreen();
    itemDeleteBtn();
  }