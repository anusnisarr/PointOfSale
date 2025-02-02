// const myHeaders = new Headers();
// myHeaders.append("x-freepik-api-key", "FPSXd0f65f3bfb484cb68a8d1aad15e0fcf3");

// const requestOptions = {
// method: "GET",
// headers: myHeaders,
// redirect: "follow"
// };

// fetch("https://api.freepik.com/v1/icons?term=burger&per_page=5&filters%5Bshape%5D=outline", requestOptions)
// .then((response) => response.text())
// .then((result) => {
//     console.log(result);
//     document.getElementById("result").innerHTML = result;
// })
// .catch((error) => console.error(error));

  $("body").html(`
//       <div class="form-group">
//         <label for="searchImage">Search Image</label>
//         <input type="text" id="searchImage" placeholder="Search Image for category">
//         </div>

//     <div id="imgcontainer" style = "display:none">
//       <div class="images"><img src="" alt=""></div>
//       <div class="images"><img src="" alt=""></div>
//       <div class="images"><img src="" alt=""></div>
//       <div class="images"><img src="" alt=""></div>
//       <div class="images"><img src="" alt=""></div>
//       <div class="images"><img src="" alt=""></div>
//       <div class="images"><img src="" alt=""></div>
//       <div class="images"><img src="" alt=""></div>
//       <div class="images"><img src="" alt=""></div>
//       <div class="images"><img src="" alt=""></div>
//       <div class="images"><img src="" alt=""></div>
//       <div class="images"><img src="" alt=""></div>
//       <div class="images"><img src="" alt=""></div>
//       <div class="images"><img src="" alt=""></div>
//       <div class="images"><img src="" alt=""></div>
//       <div class="images"><img src="" alt=""></div>
//       </div>
//     </div>
// `);

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


