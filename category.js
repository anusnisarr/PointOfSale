const addCategoryButton = $(".add-category-btn");
const editCategoryButton = $(".edit-btn");
const categoryContainer = $(".categorycontainer")
let selectedImage = null;
    addCategoryButton.on("click", () => {
        $(".content").html(`
              <div class="content">
              <h2>Create New Category</h2>
              <form class="category-form">

                  <div class="form-group">
                  <label for="CategoryName">Category Name</label>
                  <input type="text" id="categoryName" placeholder="Enter Category Name">
                  </div>
      
                  <div class="form-group">
                  <label for="categoryCode">Category Code</label>
                  <input type="text" id="categoryCode" placeholder="Enter Category Code">
                  </div>

                <div class="form-group">
                  <label for="searchImage">Search Image</label>
                  <input type="text" id="searchImage" placeholder="Search Image for category">
                  </div>

        
                  <button type="submit" class="btn">Save</button>
              </form>
                <div id="imgcontainer" style = "display:none">
                <div class="images"><img src="" alt=""></div>
                <div class="images"><img src="" alt=""></div>
                <div class="images"><img src="" alt=""></div>
                <div class="images"><img src="" alt=""></div>
                <div class="images"><img src="" alt=""></div>
                <div class="images"><img src="" alt=""></div>
                <div class="images"><img src="" alt=""></div>
                <div class="images"><img src="" alt=""></div>
                <div class="images"><img src="" alt=""></div>
                <div class="images"><img src="" alt=""></div>
                <div class="images"><img src="" alt=""></div>
                <div class="images"><img src="" alt=""></div>
                <div class="images"><img src="" alt=""></div>
                <div class="images"><img src="" alt=""></div>
                <div class="images"><img src="" alt=""></div>
                <div class="images"><img src="" alt=""></div>
                </div>
              </div>
          `);

            let imagesdiv = $(".images img");
            let debounceTimer;

            const myHeaders = new Headers();
            myHeaders.append("x-freepik-api-key", "FPSXd0f65f3bfb484cb68a8d1aad15e0fcf3");
              
            const requestOptions = {
              method: "GET",
              headers: myHeaders,
              redirect: "follow"
              };

            $("#searchImage").on("input", (e) => {
            clearTimeout(debounceTimer);

            if (!e.target.value) {
              $("#imgcontainer").slideUp(300);
              return;
             };

            const query = e.target.value.trim();
            if (!query) return;


            debounceTimer = setTimeout(() => {
              const url = `https://api.freepik.com/v1/icons?term=${query}&filters%5Bcolor%5D=black&per_page=16&filters%5Bshape%5D=outline`;
              getImages(url);
            }, 500);

          });
        
          const getImages = async (url) => {
            try {
              const response = await fetch(url , requestOptions);
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              $("#imgcontainer").slideDown(300);
              const data = await response.json();
              imagesdiv.each((index, img) => {
                console.log(data.data[index].thumbnails[0].url);
                
                img.src = data.data[index].thumbnails[0].url || ''; // Set the image source if available
                // img.style.filter = "invert(100%)";
              });
            } catch (error) {
              console.error('Error fetching data:', error);
            }
          };

          //listen on image click and save in variable.
          imagesdiv.on("click" , (e)=>{ 
            selectedImage = e.target.src
            //removeSelectImageStyle
            imagesdiv.each((index , img)=>{
              $(img).css("border", "");
              $(img).css("box-shadow", "");
            })
            
            $(e.target).css("border", "2px solid #6c63ff");
            $(e.target).css("box-shadow", "0 0 30px rgba(255, 255, 255, 0.486)");
            
          });

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
                        Image:selectedImage,
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

  $(document).on("click", ".edit-btn", (e) => {
    
    let thisCategroyData = categories.find((cat)=>cat.CategoryCode === Number(e.target.id))
  
      $(".content").html(`
            <div class="content">
            <h2>Create New Category</h2>
            <form class="category-form">
                <div class="form-group">
                <label for="CategoryName">Category Name</label>
                <input type="text" id="categoryName" placeholder="Enter Category Name" value="${thisCategroyData.CategoryName}">
                </div>
    
                <div class="form-group">
                <label for="categoryCode">Category Code</label>
                <input type="text" id="categoryCode" placeholder="Enter Category Code" value="${thisCategroyData.CategoryCode}">
                </div>

              <div class="form-group">
                <label for="searchImage">Search Image</label>
                <input type="text" id="searchImage" placeholder="Search Image for category">
                </div>
                <button type="submit" class="btn">Save</button>
            </form>
              <div id="imgcontainer" style = "display:none">
              <div class="images"><img src="" alt=""></div>
              <div class="images"><img src="" alt=""></div>
              <div class="images"><img src="" alt=""></div>
              <div class="images"><img src="" alt=""></div>
              <div class="images"><img src="" alt=""></div>
              <div class="images"><img src="" alt=""></div>
              <div class="images"><img src="" alt=""></div>
              <div class="images"><img src="" alt=""></div>
              <div class="images"><img src="" alt=""></div>
              <div class="images"><img src="" alt=""></div>
              <div class="images"><img src="" alt=""></div>
              <div class="images"><img src="" alt=""></div>
              <div class="images"><img src="" alt=""></div>
              <div class="images"><img src="" alt=""></div>
              <div class="images"><img src="" alt=""></div>
              <div class="images"><img src="" alt=""></div>
              </div>
            </div>
        `);

          let imagesdiv = $(".images img");
          let debounceTimer;
          const myHeaders = new Headers();
          myHeaders.append("x-freepik-api-key", "FPSXd0f65f3bfb484cb68a8d1aad15e0fcf3");

          const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
          };

          $("#searchImage").on("input", (e) => {
          clearTimeout(debounceTimer);

          if (!e.target.value) {
            $("#imgcontainer").slideUp(300);
            return;
           };

          const query = e.target.value.trim();
          if (!query) return;

          debounceTimer = setTimeout(() => {
            const url = `https://api.freepik.com/v1/icons?term=${query}&filters%5Bcolor%5D=black&per_page=16&filters%5Bshape%5D=outline`;
            getImages(url);
          }, 500);
        });

        const getImages = async (url) => {
          try {
            const response = await fetch(url , requestOptions);
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            $("#imgcontainer").slideDown(300);
            const data = await response.json();
            imagesdiv.each((index, img) => {
              console.log(data.data[index].thumbnails[0].url);
              
              img.src = data.data[index].thumbnails[0].url || ''; // Set the image source if available
              img.style.filter = "invert(100%)";
            });
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };

        //listen on image click and save in variable.
        imagesdiv.on("click" , (e)=>{ 
          selectedImage = e.target.src
          //removeSelectImageStyle
          imagesdiv.each((index , img)=>{
            $(img).css("border", "");
            $(img).css("box-shadow", "");
          })
          
          $(e.target).css("border", "2px solid #6c63ff");
          $(e.target).css("box-shadow", "0 0 30px rgba(255, 255, 255, 0.486)");

          
        });
        


      const setupeditCategoryHandler = (thisCategroyData) => {
          const saveButton = $(".btn");

          saveButton.on("click", (e) => {
              e.preventDefault();

              const categoryName = $("#categoryName").val();
              const categoryCode = Number($("#categoryCode").val());

              let CategoryCodeCheck = allCategoryCode.includes(categoryCode);
              let foundCategroyCode = allCategoryCode.find((CategoryCode) => CategoryCode === thisCategroyData.CategoryCode);

              if (!categoryName || !categoryCode) {
                  alert("Please fill out all fields correctly.");
                  return;
              }
              else if (CategoryCodeCheck && foundCategroyCode != categoryCode) {
                alert("Barcode Already Exist");
                return;
              } 
              else {
                const CategoryIndex = categories.findIndex(category => category.CategoryCode === thisCategroyData.CategoryCode);
                if (CategoryIndex !== -1) {
                  categories[CategoryIndex] = {
                      CategoryId: thisCategroyData.CategoryId,
                      CategoryName: categoryName,
                      CategoryCode: categoryCode,
                      Image:selectedImage,
                      ItemCount: null,
                      IsActive: true,
                    };
                  }
                  showLoader();
                  setTimeout(() => {
                      hideLoader();
                      location.reload();
                  }, 1000);

                  localStorage.setItem("Categories", JSON.stringify(categories));
              }
          });
      };
      setupeditCategoryHandler(thisCategroyData)
  });

const categoryListScreen = (categories) => {
    const categoryRow = $(".category-table tbody");
    categories.forEach((category, index) => {
        categoryRow.append(`
              <tr>
                  <td>${index + 1}</td>
                  <td>${category.CategoryName}</td>
                  <td>${category.CategoryCode}</td>
                  <td>${category.IsActive ? "Active" : "Inactive"}</td>
                  <td>
                      <button class="edit-btn" id="${category.CategoryCode}">Edit</button>
                      <button class="delete-btn" id="${category.CategoryCode}">Delete</button>
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
            let DependencieCheck = items.find((item)=> item.CategoryCode === Number(e.target.id))
            if (DependencieCheck) {
              alert("Item already added to this category. Cannot delete it.");
              return
              
            }

            else {
            categories = categories.filter((category) => e.target.id != category.CategoryCode);
            localStorage.setItem("Categories", JSON.stringify(categories));
            showLoader();
            setTimeout(() => {
                hideLoader();
                location.reload();
            }, 1000);
          };
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




  