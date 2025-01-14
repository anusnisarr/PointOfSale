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