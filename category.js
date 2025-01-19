const addCategoryButton = $(".add-category-btn");
const categoryContainer = $(".categorycontainer")

const addCategoryScreen = () => {
    addCategoryButton.on("click", () => {
        $(".content").html(`
              <div class="content">
                  <h2>Create New category</h2>
                  <form class="category-form">
                      <div class="form-group">
                          <label for="CategoryName">Category Name</label>
                          <input type="text" id="categoryName" placeholder="Enter Category Name">
                      </div>
  
                      <div class="form-group">
                          <label for="categoryCode">Category Code</label>
                          <input type="text" id="categoryCode" placeholder="Enter Category Code">
                      </div>
    
                      <button type="submit" class="btn">Save category</button>
                  </form>
              </div>
          `);




        const setupAddCategoryHandler = () => {
            const saveButton = $(".btn");
            saveButton.on("click", (e) => {
                e.preventDefault();

                const categoryName = $("#categoryName").val();
                const categoryCode = Number($("#categoryCode").val());

                
                let categoryCodeCheck = allCategoryCode.find((CategoryCode) => CategoryCode === categoryCode);

                if (!categoryName || !categoryCode) {
                    alert("Please fill out all fields correctly.");
                    return;
                }
                else if (categoryCodeCheck) {
                  alert("Barcode Already Exist");
                }
                else {
                    const newCategoryId =
                        categories.length > 0 ? Math.max(...categories.map((category) => category.CategoryId)) + 1 : 1;
                    categories.push({
                        CategoryId: newCategoryId,
                        CategoryName: categoryName,
                        CategoryCode: categoryCode,
                        ItemCount: null,
                        IsActive: true,
                    });

                    showLoader();
                    setTimeout(() => {
                        hideLoader();
                        location.reload();
                    }, 1000);

                    localStorage.setItem("Categories", JSON.stringify(categories));
                }
            });
        };
        setupAddCategoryHandler();
    });
};
addCategoryScreen()

const categoryListScreen = (categoriesData) => {
    const categoryRow = $(".category-table tbody");
    categoriesData.forEach((category, index) => {
        categoryRow.append(`
              <tr>
                  <td>${index + 1}</td>
                  <td>${category.CategoryName}</td>
                  <td>${category.CategoryCode}</td>
                  <td>${category.IsActive ? "Active" : "Inactive"}</td>
                  <td>
                      <button class="edit-btn">Edit</button>
                      <button class="delete-btn" id="${category.Categoryid
            }">Delete</button>
                  </td>
              </tr>
          `);
    });
};
categoryListScreen(categories);

const categoryDeleteFunction = () => {
    let deleteBtn = $(".delete-btn");
    deleteBtn.each((index, btn) => {
        $(btn).on("click", (e) => {
            categories = categories.filter((category) => e.target.id != category.Categoryid);
            localStorage.setItem("Categories", JSON.stringify(categories));
            showLoader();
            setTimeout(() => {
                hideLoader();
                location.reload();
            }, 1000);
        });
    });
};
categoryDeleteFunction();

// const itemImport = () => {
//     return new Promise((resolve, reject) => {
//         const fileInput = document.getElementById("fileimport");

//         fileInput.addEventListener("change", (event) => {
//             const file = event.target.files[0];
//             if (!file) return;

//             const reader = new FileReader();

//             reader.onload = (e) => {
//                 const data = new Uint8Array(e.target.result);
//                 const workbook = XLSX.read(data, { type: "array" });

//                 // Get the first sheet name
//                 const sheetName = workbook.SheetNames[0];

//                 // Get the sheet data
//                 const worksheet = workbook.Sheets[sheetName];

//                 // Convert the sheet to JSON
//                 const jsonData = XLSX.utils.sheet_to_json(worksheet);
//                 resolve(jsonData);
//             };

//             reader.onerror = (error) => {
//                 reject(error);
//             };

//             reader.readAsArrayBuffer(file);
//         });
//     });
// };
// itemImport()

//     .then((output) => {
//         let DuplicateExist;

//         output.forEach((category) => {
//             barocdeCheck = allBarcode.find((barcode) => barcode === category.barcode);
//             console.log(`${barocdeCheck} this barcode already exist`);
//             if (barocdeCheck) {
//                 DuplicateExist = true;
//                 alert(`Barcode ${category.barcode} Already Exist`);
//             } else {
//                 DuplicateExist = false;
//                 const newItemId =
//                     items.length > 0
//                         ? Math.max(...items.map((category) => category.id)) + 1
//                         : 1;
//                 items.push({
//                     id: newItemId,
//                     barcode: category.barcode,
//                     categoryId: category.categoryId,
//                     name: category.name,
//                     price: Number(category.price),
//                     IsActive: true,
//                 });
//                 showLoader();
//                 setTimeout(() => {
//                     hideLoader();
//                     location.reload();
//                 }, 1000);
//             }
//         });

//         if (!DuplicateExist) {
//             categoryListScreen(output);
//             localStorage.setItem("items", JSON.stringify(items));
//         }
//     })
//     .catch((error) => {
//         console.error(error);
//     });




  