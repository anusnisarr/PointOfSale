const updateButton = $(".update-btn");
const ClubItemOnCart = $("#ClubItemOnCart");
const receiptAddress = $("#address");
const receiptNumber = $("#receipt-number");
const receiptNote = $("#note");
const smallCategorySize = $("#smallCategorySize");
let   logoFile ;
const getlogo = $("#logo").on("input", (e)=>{
    logoFile = e.target.files[0].name
    
})
const taxSetup = $("#taxSetup");
const cashTax = $("#cashTax");
const cardTax = $("#cardTax");


// Update and save parameter in Setup
const setupChange = () => {

  let paramters = {
    ClubItemOnCart : ClubItemOnCart.is(":checked") ? "true" : "false" ,
    smallCategorySize : smallCategorySize.is(":checked") ? "true" : "false" ,
    TaxSetup : taxSetup.is(":checked") ? "true" : "false"
  }  
    let receiptDetails = {
      Address : receiptAddress.val(),
      Number : receiptNumber.val(),
      Note: receiptNote.val(),
      Logo: logoFile
      
    }    

    let tax = {
      CashTax : Number(cashTax.val()),
      CardTax : Number(cardTax.val())
    }


    localStorage.setItem("Parameters" , JSON.stringify(paramters))
    localStorage.setItem("ReceiptDetails", JSON.stringify(receiptDetails));

    if (paramters.TaxSetup === "false") {
      tax.CashTax = 0;
      tax.CardTax = 0;
      localStorage.setItem("Tax", JSON.stringify(tax)); 
    }
    else{
      localStorage.setItem("Tax", JSON.stringify(tax));    

    }
  };
  

  // Set the value of the checkbox based on the local storage
  const getParameters = JSON.parse(localStorage.getItem("Parameters") || "{}")

    getParameters.ClubItemOnCart === "true"
      ? ClubItemOnCart.prop("checked" , true)
      : ClubItemOnCart.prop("checked" , false)

    getParameters.smallCategorySize === "true"
        ? smallCategorySize.prop("checked" , true)
        : smallCategorySize.prop("checked" , false);

    getParameters.TaxSetup === "true"
        ? taxSetup.prop("checked" , true)
        : taxSetup.prop("checked" , false)
      
  //Saving the values of receipt details in the input feilds based on the local storage
  const getReceiptDetails = JSON.parse(localStorage.getItem("ReceiptDetails"));      
    localStorage.getItem("getReceiptDetails")
      ? receiptAddress.val(getReceiptDetails.Address)
      : receiptAddress.val("");

    localStorage.getItem("ReceiptDetails")
      ? receiptNumber.val(getReceiptDetails.Number)
      : receiptNumber.val("");

    localStorage.getItem("ReceiptDetails")
      ? receiptNote.val(getReceiptDetails.Note)
      : receiptNote.val("");

  const getTax = JSON.parse(localStorage.getItem("Tax")); 
    localStorage.getItem("Tax")
      ? cashTax.val(getTax.CashTax)
      : cashTax.val("");

      localStorage.getItem("Tax")
      ? cardTax.val(getTax.CardTax)
      : cardTax.val("");


      
    updateButton.on("click", () => {    
      setupChange();
      showLoader("setup-container");
      setTimeout(() => {
        hideLoader();
        location.reload();
      }, 1000);
    });
  