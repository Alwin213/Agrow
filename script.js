let selectedRow = null;

// Fetch data and display in the table
window.onload = function () {
  fetchData();
};

// Fetch data from the server
function fetchData() {
  fetch('http://localhost:5500/land') // Updated port if necessary
    .then(response => response.json())
    .then(data => {
      const tableBody = document.querySelector('#land-table tbody');
      tableBody.innerHTML = "";  // Clear existing rows
      data.forEach(item => {
        const row = tableBody.insertRow();
        row.setAttribute('data-id', item.id);
        row.innerHTML = `
          <td>${item.Typeoffarmingland}</td>
          <td>${item.Area}</td>
          <td>${item.Location}</td>
          <td>${item.Contactnumber}</td> <!-- Corrected field -->
          <td>
            <button onclick="onEdit(this)">Edit</button>
            <button onclick="onDelete(this)">Delete</button>
          </td>
        `;
      });
    })
    .catch(error => console.error('Error fetching data:', error));
}

// Handle form submission
function onFormSubmit(event) {
  event.preventDefault();
  const formData = readFormData();
  const recordId = document.getElementById('record-id').value;
  if (recordId) {
    updateRecord(recordId, formData);
  } else {
    insertNewRecord(formData);
  }
  resetForm();
}

document.getElementById('land-form').addEventListener('submit', onFormSubmit);

// Read form data
function readFormData() {
  return {
    Typeoffarmingland: document.getElementById('Typeoffarmingland').value,
    Area: document.getElementById('Area').value,
    Location: document.getElementById('Location').value,
    Contactno: document.getElementById('Contactno').value, // Ensure this maps to backend Contactnumber
  };
}

// Insert a new record
function insertNewRecord(data) {
  fetch('http://localhost:5500/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
    .then(response => response.json())
    .then(result => {
      console.log('Record added:', result);
      fetchData();
    })
    .catch(error => console.error('Error adding record:', error));
}

// Edit record
function onEdit(button) {
  selectedRow = button.parentElement.parentElement;
  document.getElementById('record-id').value = selectedRow.getAttribute('data-id');
  document.getElementById('Typeoffarmingland').value = selectedRow.cells[0].innerHTML;
  document.getElementById('Area').value = selectedRow.cells[1].innerHTML;
  document.getElementById('Location').value = selectedRow.cells[2].innerHTML;
  document.getElementById('Contactno').value = selectedRow.cells[3].innerHTML; // Corrected field
}

// Update record
function updateRecord(id, formData) {
  fetch(`http://localhost:5500/update/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  })
    .then(response => response.json())
    .then(result => {
      console.log('Record updated:', result);
      fetchData();
    })
    .catch(error => console.error('Error updating record:', error));

  selectedRow = null;
}

// Delete record
function onDelete(button) {
  const row = button.parentElement.parentElement;
  const id = row.getAttribute('data-id');
  fetch(`http://localhost:5500/delete/${id}`, {
    method: 'DELETE',
  })
    .then(response => response.json())
    .then(result => {
      console.log('Record deleted:', result);
      fetchData();
    })
    .catch(error => console.error('Error deleting record:', error));
}

// Reset the form
function resetForm() {
  document.getElementById('land-form').reset();
  document.getElementById('record-id').value = "";
  selectedRow = null;
}
