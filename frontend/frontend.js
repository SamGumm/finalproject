/*
Author: Sam Gumm, Braeden Hegarty
ISU Netid : smgumm@iastate.edu
Date :  04/30
*/

/*TODO
  - need to change ID to State
  - editing turns state into null
  - check edit
  - maybe have submit button for forms call fetchAllProducts and hide the view
  - 
*/




//mayb have fetchAllProducts run at load, and the GET button refreshes?
//happens after html elements are loaded
document.addEventListener('DOMContentLoaded', function() {
  //gets the birds after the html loads
  //so you dont have to manually press GET
  fetchAllProducts();
  // Create views and buttons
  function showView(viewId) {
    // Hide all views
    document.querySelectorAll('#views > div').forEach(view => {
      view.style.display = 'none';
    });
    document.getElementById(viewId).style.display = 'block';
  }
  const views = ['get', 'post', 'delete', 'update', 'google_map', 'about_us'];
  const container = document.createElement('div');
  container.id = 'views';

  views.forEach(view => {
    const viewDiv = document.createElement('div');
    viewDiv.id = `view-${view}`;
    viewDiv.style.display = 'none';
    container.appendChild(viewDiv);
  });

  document.body.insertBefore(container, document.body.firstChild); // Insert views container at the top of the body

  const navigation = document.createElement('div');
  navigation.id = 'navigation';


  //GET Button
  const getButton = document.createElement('button');
  getButton.textContent = 'Home';
  getButton.onclick = () => {
    hideGoogleMap();
    removeLocationInput();
    fetchAllProducts();
    showView('view-get');
    selectMapButton.style.display = 'none';
  };
  navigation.appendChild(getButton);

  // Add POST button to navigation
  const postButton = document.createElement('button');
  postButton.textContent = 'Add New Bird';
  postButton.onclick = () => {
    hideGoogleMap();
    removeLocationInput();
    hideAllProducts();
    showPostForm();
    showView('view-post');
    selectMapButton.style.display = 'none';
  };
  navigation.appendChild(postButton);

  // Add event listeners for delete and update buttons
  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Remove Bird';
  deleteButton.onclick = () => {
    hideGoogleMap();
    removeLocationInput();
    hideAllProducts()
    showDeleteForm();
    showView('view-delete');
    selectMapButton.style.display = 'none';
  };
  navigation.appendChild(deleteButton);

  const updateButton = document.createElement('button');
  updateButton.textContent = 'Edit Bird';
  updateButton.onclick = () => {
    hideGoogleMap();
    removeLocationInput();
    hideAllProducts()
    showUpdateForm();
    showView('view-update');
    selectMapButton.style.display = 'none';
  };
  navigation.appendChild(updateButton);

  //bird location button
  const googleMapButton = document.createElement('button');
  googleMapButton.textContent = 'View Bird Sightings';
  googleMapButton.onclick = () => {
    hideAllProducts();
    removeLocationInput();
    showBirdLocationsOnMap();
    showView('view-google_map');
    selectMapButton.style.display = 'block';
  };
  navigation.appendChild(googleMapButton);

  const aboutUsButton = document.createElement('button');
  aboutUsButton.textContent = 'About Us';
  aboutUsButton.onclick = () => {
    hideAllProducts();
    removeLocationInput();
    hideGoogleMap();
    showAboutUsForm();
    showView('view-about_us');
    selectMapButton.style.display = 'none';
  };
  navigation.appendChild(aboutUsButton);

  const selectMapButton = document.createElement('button');
  selectMapButton.textContent = 'Add New Sighting Location';
  selectMapButton.style.display = 'none';
  selectMapButton.onclick = () => {
    hideAllProducts();
    clearMarkersAndEnableSelection();
  };
  navigation.appendChild(selectMapButton);


  document.body.insertBefore(navigation, document.body.firstChild);
});

function showAboutUsForm() {
  document.getElementById('view-about_us').style.display='none';
  const container = document.getElementById('view-about_us');
  container.innerHTML = ''; // Clear previous content
  const header = document.createElement('h2');
  header.textContent = 'About Us';
  container.appendChild(header);
  const form = document.createElement('h4');
  form.innerHTML = 
  '5/1/24<br>COM S 319<br>Braeden Hegarty bhegarty@iastate.edu<br><p>I am a senior majoring in computer science and chemistry. I often bird watch at my home in central Iowa and think it is an enjoyabl activity which we wanted to develop a website for so that others could participate as well.</p><br><img src = "https://media.licdn.com/dms/image/C4E03AQHgmggY8XjbwQ/profile-displayphoto-shrink_800_800/0/1602381485057?e=1720051200&v=beta&t=xdez_-QT4YwOMm9GHOZmYwxfdRRr_OrrgC1I7xiDtvI" alt = "Braeden Headshot" style="width: 15%; height: 15%;"><br><br>Sam Gumm smgumm@iastate.edu<br><img src = "https://media.licdn.com/dms/image/C5603AQECBwlYexDziQ/profile-displayphoto-shrink_400_400/0/1621610735165?e=1720051200&v=beta&t=l4A_KrElSAPjKYfE_2pOObLXDNdbXWXtDbrowhYiH2Y" alt = "Sam Headshot" style="width: 15%; height: 15%;"><br><p>My name is Sam, and I am a senior majoring in Computer Science. I enjoy knowing about my local birds, so I wanted a resource such as this website to assist myself and others in that.</p><br>';
  container.appendChild(form);
}


function hideAllProducts() {
  // Hide get all view
  document.getElementById('view-get').style.display = 'none';
  // Clear the product list
  document.getElementById('product-list').innerHTML = '';
}

function hideGoogleMap() {
  // Hide the Google Map view
  const mapDiv = document.getElementById('google-map');
  if (mapDiv) {
    mapDiv.style.display = 'none';
  }
}


//Function to GET from database
async function fetchAllProducts() {
  const url = 'http://localhost:8081/listAllProducts';
  try {
    //making sure that fetch runs
    const response = await fetch(url);
    if (!response.ok) throw new Error('Error fetching products');

    const data = await response.json();
    const birds = data[0].birds;
    console.log(birds);
   
    
    const container = document.getElementById('product-list');
    if (!container) {
      console.error('Container not found');
      return;
    }
    container.innerHTML = ''; // Clear previous results

    //iterating through birds collection for data
    birds.forEach(bird => {
      const productDiv = document.createElement('div');
      productDiv.className = 'product';

      const img = document.createElement('img');
      img.src = bird.image;
      img.alt = 'Product Image';
      productDiv.appendChild(img);

      const details = document.createElement('div');
      details.className = 'product-details';
      details.innerHTML = `<strong>${bird.state}<br></strong><strong>${bird.name}</strong><br><strong>${bird.science_name}</strong><br>${bird.description}`;
      productDiv.appendChild(details);

      container.appendChild(productDiv);
    });
  } catch (error) {
    console.error('Error:', error);
    // Check if container exists before setting textContent
    const container = document.getElementById('product-list');
    if (container) {
      container.textContent = 'Products not found.';
    }
  }
}

function showPostForm() {
  //Hide get all view
  document.getElementById('view-get').style.display = 'none';
  
  // Get the view container
  const container = document.getElementById('view-post');
  container.innerHTML = ''; // Clear previous content

  const header = document.createElement('h2');
  header.textContent = 'Adding new bird...';
  container.appendChild(header);

  // Create form elements
  const form = document.createElement('form');
  form.addEventListener('submit', async function(event) {
    event.preventDefault();

    // Get form data
    const formData = new FormData(form);
    const newProduct = {};
    for (const [key, value] of formData.entries()) {
      if (['time'].includes(key)) {
        newProduct[key] = parseInt(value); 
      } else {
        newProduct[key] = value;
      }
    }

    // Post the new product
    await postNewProduct(newProduct);

    // Clear the form
    form.reset();
  });

  const stateInput = createTextInput('state', 'State:');
  const nameInput = createTextInput('name', 'Name:');
  const science_nameInput = createTextInput('science_name', 'Scientific Nomenclature:');
  const descriptionInput = createTextInput('description', 'Description:');
  const imageInput = createTextInput('image', 'Image:');
  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.textContent = 'Add Bird';

  // Append form elements to the form
  form.appendChild(stateInput);
  form.appendChild(nameInput);
  form.appendChild(science_nameInput);
  form.appendChild(descriptionInput);
  form.appendChild(imageInput);
  form.appendChild(submitButton);

  // Append form to the container
  container.appendChild(form);
}

function createTextInput(name, label) {
  const labelElement = document.createElement('label');
  labelElement.textContent = label;
  const inputElement = document.createElement('input');
  inputElement.type = 'text';
  inputElement.name = name;
  labelElement.appendChild(inputElement);
  return labelElement;
}

async function postNewProduct(newProduct) {
  const url = 'http://localhost:8081/addProduct';
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newProduct)
    });
    if (!response.ok) throw new Error('Error adding product');
    console.log('Bird added successfully');
  } catch (error) {
    console.error('Error:', error);
  }
}

function showDeleteForm() {
  // Hide get all view
  document.getElementById('view-get').style.display = 'none';
  // Get the view container
  const container = document.getElementById('view-delete');
  container.innerHTML = ''; // Clear previous content

  //creating header
  const header = document.createElement('h2');
  header.textContent = 'Removing a bird...';
  container.appendChild(header);
  // Create form elements
  const form = document.createElement('form');

  form.addEventListener('submit', async function(event) {
    event.preventDefault();
    // Get form data
    const formData = new FormData(form);
    const id = formData.get('id');
    // Delete the product
    await deleteProduct(id);
    // Clear the form
    form.reset();
  });

  //creating submit button
  const idInput = createTextInput('id', 'ID:');
  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.textContent = 'Delete Product';

  // Append form elements to the form
  form.appendChild(idInput);
  form.appendChild(submitButton);

  // Append form to the container
  container.appendChild(form);
}

function showUpdateForm() {
  // Hide get all view
  document.getElementById('view-get').style.display = 'none';
  // Get the view container
  const container = document.getElementById('view-update');
  container.innerHTML = ''; // Clear previous content
  //creating header
  const header = document.createElement('h2');
  header.textContent = 'Editing a bird...';
  container.appendChild(header);
  // Create form elements
  const form = document.createElement('form');
  form.addEventListener('submit', async function(event) {
    event.preventDefault();
    // Get form data
    //change values
    const formData = new FormData(form);
    const state = formData.get('state');
    const name = formData.get('name');
    const science_name = formData.get('science_name');
    const description = formData.get('description');
    const image = formData.get('image');
    // Update the product
    await updateProduct(state, name, science_name, description, image);
    // Clear the form
    form.reset();
  });

  //getting data for json object
  const stateInput = createTextInput('state', 'State:');
  const nameInput = createTextInput('name', 'Name:');
  const science_nameInput = createTextInput('science_name', 'Scientific Nomenclature');
  const descriptionInput = createTextInput('description', 'Description:');
  const imageInput = createTextInput('image', 'Image:');
  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.textContent = 'Update Product';

  // Append form elements to the form
  //change values
  form.appendChild(stateInput);
  form.appendChild(nameInput);
  form.appendChild(science_nameInput);
  form.appendChild(descriptionInput);
  form.appendChild(imageInput);
  form.appendChild(submitButton);

  // Append form to the container
  container.appendChild(form);
}

async function deleteProduct(bird_name) {
  const url = `http://localhost:8081/deleteProduct/${bird_name}`;
  try {
    const response = await fetch(url, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Error deleting product');
    console.log('Product deleted successfully');
  } catch (error) {
    console.error('Error:', error);
  }
}

async function updateProduct(state, name, science_name, description, image) {
  const url = `http://localhost:8081/updateProduct/${name}`;
  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        state,
        name,
        science_name,
        description,
        image,
      })
    });
    if (!response.ok) {
      throw new Error('Failed to update product');
    }
    console.log('Product updated successfully');
  } catch (error) {
    console.error('Error updating product:', error.message);
  }
}

let map = null;
let markers = [];
let selectableMap = false;
let googleMapsScriptLoaded = false;

function loadGoogleMapsScript() {
  return new Promise((resolve, reject) => {
    if (googleMapsScriptLoaded) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyA-gFypqQtfRCQIEgCuWEEQeOCRq8XRiXs&callback=initMap&libraries=&v=weekly`;
    script.async = true; // Load the script asynchronously
    script.defer = true;
    script.onload = () => {
      googleMapsScriptLoaded = true;
      resolve();
    };
    script.onerror = reject;

    document.head.appendChild(script);
  });
}

// Preload the Google Maps API script
loadGoogleMapsScript().then(() => {
  // Script is fully loaded, you can now use Google Maps API
  console.log('Google Maps API script loaded');
}).catch((error) => {
  console.error('Error loading Google Maps API script:', error);
});

async function initMap() {
  const container = document.getElementById('view-google_map');
  container.innerHTML = '';

  const mapDiv = document.createElement('div');
  mapDiv.id = 'google-map';
  mapDiv.classList.add('google-map');

  const header = document.querySelector('h1');
  header.parentNode.insertBefore(mapDiv, header.nextSibling);

  map = new google.maps.Map(mapDiv, {
    center: { lat: 40, lng: -100 },
    zoom: 4
  });
  mapDiv.style.display = 'none'; // Hide the map by default
}

async function showBirdLocationsOnMap() {
  const url = 'http://localhost:8081/listAllProducts';
  selectableMap = false;

  if (!map) {
    await initMap();
  }

  const mapDiv = document.getElementById('google-map');
  if (mapDiv) {
    mapDiv.style.display = 'block';
  }

  fetch(url)
    .then(response => {
      if (!response.ok) throw new Error('Error fetching bird locations');
      return response.json();
    })
    .then(data => {
      const locations = data[0].google_maps_locations;
      // Clear existing markers
      markers.forEach(marker => {
        marker.setMap(null);
      });
      markers = [];
      locations.forEach(location => {
        console.log(location.lat, location.long, location.name);
        const marker = new google.maps.Marker({
          position: { lat: parseFloat(location.lat), lng: parseFloat(location.long) },
          map: map,
          title: location.name
        });

        const infoWindow = new google.maps.InfoWindow({
          content: `<h3>${location.name}</h3>`
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });

        markers.push(marker);
      });
    })
    .catch(error => {
      console.error('Error fetching bird locations:', error);
    });
}

async function clearMarkersAndEnableSelection() {
  addLocationInput();
  markers.forEach(marker =>{
    marker.setMap(null);
  });
  markers = [];
  selectableMap = true;

  if (!map) {
    await initMap();
  }

  google.maps.event.addListener(map, 'click', function(event) {
    if (selectableMap) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();

      // Save the latitude and longitude
      console.log('Latitude:', lat);
      console.log('Longitude:', lng);

      // Remove existing markers
      markers.forEach(marker => {
        marker.setMap(null);
      });
      markers = [];

      // Add a new marker
      const marker = new google.maps.Marker({
        position: event.latLng,
        map: map
      });
      markers.push(marker);
    }
  });
}

function addLocationInput() {
  const mapContainer = document.getElementById('google-map');
  const inputContainer = document.createElement('div');
  inputContainer.classList.add('input-container');
  inputContainer.style.textAlign = 'center';

  const nameLabel = document.createElement('label');
  nameLabel.textContent = 'Enter Bird Name: ';
  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.id = 'bird-name';
  inputContainer.appendChild(nameLabel);
  inputContainer.appendChild(nameInput);

  const submitButton = document.createElement('button');
  submitButton.textContent = 'Add Location';
  submitButton.addEventListener('click', async () => {
    const name = document.getElementById('bird-name').value;
    if (!name) {
      alert('Please enter a bird name');
      return;
    }

    const lat = markers[0].getPosition().lat();
    const lng = markers[0].getPosition().lng();

    // Post the location data
    await postNewLocation({ name, lat, lng });

    // Clear the input field and map marker
    document.getElementById('bird-name').value = '';
    markers[0].setMap(null);
    markers = [];
  });

  inputContainer.appendChild(submitButton);
  mapContainer.parentElement.insertBefore(inputContainer, mapContainer.nextSibling);
}

async function postNewLocation(locationData) {
  const url = 'http://localhost:8081/addLocation';
  try {
    // Convert latitude and longitude to strings
    locationData.lat = String(locationData.lat);
    locationData.long = String(locationData.lng);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(locationData)
    });
    if (!response.ok) throw new Error('Error adding location');
    console.log('Location added successfully');
  } catch (error) {
    console.error('Error:', error);
  }
}

function removeLocationInput() {
  const inputContainer = document.querySelector('.input-container');
  if (inputContainer) {
    inputContainer.remove();
  }
}