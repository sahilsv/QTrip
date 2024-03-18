import config from "../conf/index.js";

//Implementation to extract adventure ID from query params
function getAdventureIdFromURL(search) {
  // TODO: MODULE_ADVENTURE_DETAILS
  // 1. Get the Adventure Id from the URL
  const urlParams = new URLSearchParams(search);
  const advId = urlParams.get("adventure");

  // Place holder for functionality to work in the Stubs
  return advId;
}
//Implementation of fetch call with a paramterized input based on adventure ID
async function fetchAdventureDetails(adventureId) {
  // TODO: MODULE_ADVENTURE_DETAILS
  // 1. Fetch the details of the adventure by making an API call
  try {
    const response = await fetch(
      config.backendEndpoint + `/adventures/detail?adventure=${adventureId}`
    );
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
    return null;
  }
}

//Implementation of DOM manipulation to add adventure details to DOM
function addAdventureDetailsToDOM(adventure) {
  // TODO: MODULE_ADVENTURE_DETAILS
  // 1. Add the details of the adventure to the HTML DOM

  const { name, subtitle, images, content } = adventure;

  document.getElementById("adventure-name").textContent = name;
  document.getElementById("adventure-subtitle").textContent = subtitle;

  images.forEach((image) => {
    let imageDiv = document.createElement("img");
    imageDiv.setAttribute("src", image);
    imageDiv.className = "activity-card-image";
    document.getElementById("photo-gallery").appendChild(imageDiv);
  });

  document.getElementById("adventure-content").textContent = content;
}

//Implementation of bootstrap gallery component
function addBootstrapPhotoGallery(images) {
  // TODO: MODULE_ADVENTURE_DETAILS
  // 1. Add the bootstrap carousel to show the Adventure images
  
  const parentDiv = document.getElementById("photo-gallery");
  parentDiv.innerHTML = `
  <div id="carouselExampleIndicators" class="carousel slide" data-bs-ride="carousel">
  <div class="carousel-inner" id="carousel-item-parent">
  </div>
  <div class="carousel-indicators">
    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
  </div>
  <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Previous</span>
  </button>
  <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Next</span>
  </button>
</div>
  `;

  let carouselItemParent = document.getElementById("carousel-item-parent");
  addCarouselItems(carouselItemParent, images);
  
}

function addCarouselItems(carouselItemParent, images) {
  images.forEach((image, idx) => {
    let item = document.createElement("div");
    if (idx === 0) {
      item.className = "carousel-item active";
    } else {
      item.className = "carousel-item";
    }
    item.innerHTML = `<img src=${image} class="activity-card-image" style="object-fit: cover;" />`;
    carouselItemParent.appendChild(item);
  });
}

//Implementation of conditional rendering of DOM based on availability
function conditionalRenderingOfReservationPanel(adventure) {
  // TODO: MODULE_RESERVATIONS
  // 1. If the adventure is already reserved, display the sold-out message.
  if(adventure.available) {
    document.getElementById("reservation-panel-available").style.display = "block";
    document.getElementById("reservation-panel-sold-out").style.display = "none";

    document.getElementById("reservation-person-cost").innerHTML = adventure.costPerHead;
  }
  else {
    document.getElementById("reservation-panel-sold-out").style.display = "block";
    document.getElementById("reservation-panel-available").style.display = "none";
  }

}

//Implementation of reservation cost calculation based on persons
function calculateReservationCostAndUpdateDOM(adventure, persons) {
  // TODO: MODULE_RESERVATIONS
  // 1. Calculate the cost based on number of persons and update the reservation-cost field
  document.getElementById("reservation-cost").innerHTML = persons * adventure.costPerHead;
}

//Implementation of reservation form submission
function captureFormSubmit(adventure) {
  // TODO: MODULE_RESERVATIONS
  // 1. Capture the query details and make a POST API call using fetch() to make the reservation
  // 2. If the reservation is successful, show an alert with "Success!" and refresh the page. If the reservation fails, just show an alert with "Failed!".
  const form = document.getElementById("myForm");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
     let url = config.backendEndpoint + "/reservations/new";
     let formElements = form.elements;

     // converting the JSON into string, body is basically the payload
     let bodyStr = JSON.stringify({
      name: formElements["name"].value,
      date: formElements["date"].value,
      person: formElements["person"].value,
      adventure: adventure.id,
     });

     try {
      let response = await fetch(url, {
        method: "POST",
        body: bodyStr,
        headers:{
          "Content-Type": "application/json",
        },
      });
      
       
      if(response.ok) {
        //alert("Success!");
        window.location.reload();
      } 
      else {
        let data = await response.json();
        alert(`Failed! - ${data.message}`);
      }
     }
     catch(err) {
      console.log(err);
      alert("Failure in fetch call");
     }
  });
}

//Implementation of success banner after reservation
function showBannerIfAlreadyReserved(adventure) {
  // TODO: MODULE_RESERVATIONS
  // 1. If user has already reserved this adventure, show the reserved-banner, else don't
  if(adventure.reserved) {
    document.getElementById("reserved-banner").style.display = "block";
  }
  else {
    document.getElementById("reserved-banner").style.display = "none";
  }
}

export {
  getAdventureIdFromURL,
  fetchAdventureDetails,
  addAdventureDetailsToDOM,
  addBootstrapPhotoGallery,
  conditionalRenderingOfReservationPanel,
  captureFormSubmit,
  calculateReservationCostAndUpdateDOM,
  showBannerIfAlreadyReserved,
};
