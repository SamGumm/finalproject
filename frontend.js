/*
Author: Sam Gumm, Braeden Hegarty
ISU Netid : smgumm@iastate.edu
Date :  04/30
*/

/*TODO
  - HTML (in progress)
  - CSS (need to separate from html, in progress)
  - JavaScript with DOM (in progress)
  - REACT (done)
  - NodeJS (done)
  - Express (done)
  - Mongo (done)
  - CRUD (kinda, need to change things)
*/






document.addEventListener('DOMContentLoaded', function() {
  // Create views and buttons
  function showView(viewId) {
    // Hide all views
    document.querySelectorAll('#views > div').forEach(view => {
      view.style.display = 'none';
    });
    document.getElementById(viewId).style.display = 'block';
  }
  const views = ['get', 'post', 'delete', 'update'];
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
  document.body.insertBefore(container, document.body.firstChild); // Insert views container at the top of the body

  const navigation = document.createElement('div');
  navigation.id = 'navigation';


  //GET Button
  const getButton = document.createElement('button');
  getButton.textContent = 'GET';
  getButton.onclick = () => {
    showView('view-get');
  fetchAllProducts();
};
  navigation.appendChild(getButton);

  // Add POST button to navigation
  const postButton = document.createElement('button');
  postButton.textContent = 'POST';
  postButton.onclick = () => {
    showPostForm();
    showView('view-post');
  };
  navigation.appendChild(postButton);

  // Add event listeners for delete and update buttons
  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'DELETE';
  deleteButton.onclick = () => {
    showDeleteForm();
    showView('view-delete');
  };
  navigation.appendChild(deleteButton);

  const updateButton = document.createElement('button');
  updateButton.textContent = 'UPDATE';
  updateButton.onclick = () => {
    showUpdateForm();
    showView('view-update');
  };
  navigation.appendChild(updateButton);

  document.body.insertBefore(navigation, document.body.firstChild);
});


//needs to change to be in line with birds
//fetchAllBirds maybe
async function fetchAllProducts() {
  const url = 'http://localhost:8081/listAllProducts';
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Error fetching products');

    const data = await response.json();
    const birds = data[0].birds;
   
    
    const container = document.getElementById('product-list');
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
    document.getElementById('product-list').textContent = 'Products not found.';
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
    const id = parseInt(formData.get('id'));
    const name = formData.get('name');
    const price = parseInt(formData.get('price'));
    const description = formData.get('description');
    const category = formData.get('category');
    const image = formData.get('image');
    const rating = parseInt(formData.get('rating'));

    // Update the product
    await updateProduct(id, name, price, description, category, image, rating);

    // Clear the form
    form.reset();
  });


  //change values
  const idInput = createTextInput('id', 'ID:');
  const nameInput = createTextInput('name', 'Name:');
  const priceInput = createTextInput('price', 'Price:');
  const descriptionInput = createTextInput('description', 'Description:');
  const categoryInput = createTextInput('category', 'Category:');
  const imageInput = createTextInput('image', 'Image:');
  const ratingInput = createTextInput('rating', 'Rating:');
  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.textContent = 'Update Product';

  // Append form elements to the form
  //change values
  form.appendChild(idInput);
  form.appendChild(nameInput);
  form.appendChild(priceInput);
  form.appendChild(descriptionInput);
  form.appendChild(categoryInput);
  form.appendChild(imageInput);
  form.appendChild(ratingInput);
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
async function updateProduct(id, name, price, description, category, image, rating) {
  const url = `http://localhost:8081/updateProduct/${id}`;
  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id,
        name,
        price,
        description,
        category,
        image,
        rating
      })
    });
    if (!response.ok) throw new Error('Error updating product');
    console.log('Product updated successfully');
  } catch (error) {
    console.error('Error:', error);
  }
}


