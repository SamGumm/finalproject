/*
Author: Sam Gumm, Braeden Hegarty
ISU Netid : smgumm@iastate.edu
Date :  04/30
*/

/*TODO
  - HTML (done for the most part)
    - Load states as cards on main page
    - have button to show bird information for each state
      - this will add the info to the state card
          like how the CRUD buttons append to the top of the page
      - needs secondary button to close this view
    - have view for student info
    - have a filter function?
  - CSS (need to separate from html, in progress)
  - JavaScript with DOM (in progress)
  - REACT (done)
  - NodeJS (done)
  - Express (done)
  - Mongo (done)
  - CRUD (done?)
*/




//mayb have fetchAllProducts run at load, and the GET button refreshes?
//happens after html elements are loaded
document.addEventListener('DOMContentLoaded', function() {
  // Create views and buttons
  function showView(viewId) {
    // Hide all views
    document.querySelectorAll('#views > div').forEach(view => {
      view.style.display = 'none';
    });
    document.getElementById(viewId).style.display = 'block';
  }
  const views = ['get', 'post', 'delete', 'update', 'google_map','user-selections-map'];
  const container = document.createElement('div');
  container.id = 'views';

  views.forEach(view => {
    const viewDiv = document.createElement('div');
    viewDiv.id = `view-${view}`;
    viewDiv.style.display = 'none';
    viewDiv.innerHTML = `<h2>${view.toUpperCase()} Products</h2>`;
    container.appendChild(viewDiv);
  });

  //do we still need this?
  //maybe change to bottom of page
  document.body.insertBefore(container, document.body.firstChild); // Insert views container at the top of the body

  const navigation = document.createElement('div');
  navigation.id = 'navigation';


  //GET Button
  const getButton = document.createElement('button');
  getButton.textContent = 'GET';
  getButton.onclick = () => {
    hideGoogleMap();
    fetchAllProducts();
    showView('view-get');
};
  navigation.appendChild(getButton);

  // Add POST button to navigation
  const postButton = document.createElement('button');
  postButton.textContent = 'POST';
  postButton.onclick = () => {
    hideAllProducts();
    hideGoogleMap();
    showPostForm();
    showView('view-post');
  };
  navigation.appendChild(postButton);

  // Add event listeners for delete and update buttons
  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'DELETE';
  deleteButton.onclick = () => {
    hideAllProducts();
    hideGoogleMap();
    showDeleteForm();
    showView('view-delete');
  };
  navigation.appendChild(deleteButton);

  const updateButton = document.createElement('button');
  updateButton.textContent = 'UPDATE';
  updateButton.onclick = () => {
    hideAllProducts();
    hideGoogleMap();
    showUpdateForm();
    showView('view-update');
  };
  navigation.appendChild(updateButton);

  //bird location button
  const googleMapButton = document.createElement('button');
  googleMapButton.textContent = 'Google Maps';
  googleMapButton.onclick = () => {
    hideAllProducts();
    showBirdLocationsOnMap();
    showView('view-google_map');
  };
  navigation.appendChild(googleMapButton);

  // user location selection button
  // const userMapSelectButton = document.createElement('button');
  // userMapSelectButton.textContent = 'User Select';
  // userMapSelectButton.onclick = () => {
  //   hideAllProducts();
  //   hideGoogleMap();
  //   showUserSelectionsMap();
  //   showView('view-user-selections-map');
  // };
  // navigation.appendChild(userMapSelectButton);

  document.body.insertBefore(navigation, document.body.firstChild);
});

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

function hideSelectionMap() {
  // Hide the Google Map view
  const mapDiv = document.getElementById('user-selections-map');
  if (mapDiv) {
    mapDiv.style.display = 'none';
  }
}

//needs to change to be in line with birds
//fetchAllBirds maybe
async function fetchAllProducts() {
  const url = 'http://localhost:8081/listAllProducts';
  try {
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

    //change to be bird-centric
    birds.forEach(bird => {
      const productDiv = document.createElement('div');
      productDiv.className = 'product';

      const img = document.createElement('img');
      img.src = bird.image || 'path/to/default-image.jpg'; // Default image if none provided
      img.alt = 'Product Image';
      productDiv.appendChild(img);

      const details = document.createElement('div');
      details.className = 'product-details';
      details.innerHTML = `<strong>${bird.state}<br></strong><strong>${bird.name}</strong><br>${bird.description}`;
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
  header.textContent = 'POST Product';
  container.appendChild(header);

  // Create form elements
  const form = document.createElement('form');
  form.addEventListener('submit', async function(event) {
    event.preventDefault();

    // Get form data
    // change, not sure to what tho
    /* maybe have forms for:
          -time
          -location
          -bird description
          -other notes
    */
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

  //change to be in line with birds
  const stateInput = createTextInput('state', 'State:');
  const nameInput = createTextInput('name', 'Name:');
  const science_nameInput = createTextInput('science_name', 'Scientific Nomenclature:');
  const descriptionInput = createTextInput('description', 'Description:');
  const imageInput = createTextInput('image', 'Image:');
 

  //change
  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.textContent = 'Add Bird';

  // Append form elements to the form
  //change
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

//change
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
    console.log('Product added successfully');
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


  //do we need to change id as a value?
  //maybe we add a id value to the json
  //alternatively can we just use the index a given bird is at?
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


  //change values
  const stateInput = createTextInput('id', 'ID:');
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
  //change url
  //we would have to change less if we add the id to the bird data
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

//need to change
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

async function showBirdLocationsOnMap() {
  const url = 'http://localhost:8081/listAllProducts';
  const mapDiv = document.getElementById('google-map');
  if (mapDiv) {
    mapDiv.style.display = 'block';
  }
  try {
    if (!map) {
      const container = document.getElementById('view-google_map');
      container.innerHTML = '';
      const mapDiv = document.createElement('div');
      mapDiv.id = 'google-map';
      mapDiv.classList.add('google-map');

      const header = document.querySelector('h1');
      header.parentNode.insertBefore(mapDiv, header.nextSibling);

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyA-gFypqQtfRCQIEgCuWEEQeOCRq8XRiXs&callback=initMap&libraries=&v=weekly`;
      script.async = true;
      script.defer = true;

      // Use a callback function to defer execution until the script is fully loaded
      script.onload = () => {
        map = new google.maps.Map(mapDiv, {
          center: { lat: 40, lng: -100 },
          zoom: 4
        });
      };

      if (!document.querySelector('script[src^="https://maps.googleapis.com"]')) {
        document.head.appendChild(script);
      }
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

  } catch (error) {
    console.error('Error:', error);
  }
}