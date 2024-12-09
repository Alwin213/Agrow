let selectedRow = null;

// Fetch data from backend and display in the table
window.onload = function() {
  fetchData();
};

function fetchData() {
  fetch('http://localhost:5500/land')
    .then(response => response.json())
    .then(data => {
      const tableBody = document.getElementById('storeList').getElementsByTagName('tbody')[0];
      data.forEach(item => {
        const row = tableBody.insertRow();
        row.innerHTML = `
          <td>${item.Typeoffarmingland}</td>
          <td>${item.Area}</td>
          <td>${item.Location}</td>
          <td>${item.Contactnumber}</td>
          <td>
            <button onclick="onEdit(this)">Edit</button> 
            <button onclick="onDelete(this)">Delete</button>
          </td>
        `;
      });
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
}

// Handle form submission to add or update data
function onFormSubmit(event) {
  event.preventDefault();
  var formData = readformData();
  if (selectedRow === null) {
    insertNewRecord(formData);
  } else {
    updateRecord(formData);
  }
}

function readformData() {
  var formData = {};
  formData["Typeoffarmingland"] = document.getElementById("Typeoffarmingland").value;
  formData["Area"] = document.getElementById("Area").value;
  formData["Location"] = document.getElementById("Location").value;
  formData["Contactno"] = document.getElementById("Contactno").value;
  return formData;
}

function insertNewRecord(data) {
  const table = document.getElementById("storeList").getElementsByTagName('tbody')[0];
  const newRow = table.insertRow(table.length);
  newRow.innerHTML = `
    <td>${data.Typeoffarmingland}</td>
    <td>${data.Area}</td>
    <td>${data.Location}</td>
    <td>${data.Contactno}</td>
    <td>
      <button onclick="onEdit(this)">Edit</button>
      <button onclick="onDelete(this)">Delete</button>
    </td>
  `;
  // Optionally, send the data to the backend
  fetch('http://localhost:5500/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(result => {
    console.log('Record added:', result);
  })
  .catch(error => {
    console.error('Error adding record:', error);
  });
}

function onEdit(td) {
  selectedRow = td.parentElement.parentElement;
  document.getElementById('Typeoffarmingland').value = selectedRow.cells[0].innerHTML;
  document.getElementById('Area').value = selectedRow.cells[1].innerHTML;
  document.getElementById('Location').value = selectedRow.cells[2].innerHTML;
  document.getElementById('Contactno').value = selectedRow.cells[3].innerHTML;
}

function updateRecord(formData) {
  selectedRow.cells[0].innerHTML = formData.Typeoffarmingland;
  selectedRow.cells[1].innerHTML = formData.Area;
  selectedRow.cells[2].innerHTML = formData.Location;
  selectedRow.cells[3].innerHTML = formData.Contactno;

  // Optionally, send the updated data to the backend
  const id = selectedRow.getAttribute('data-id');
  fetch(`http://localhost:5500/update/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  })
  .then(response => response.json())
  .then(result => {
    console.log('Record updated:', result);
  })
  .catch(error => {
    console.error('Error updating record:', error);
  });
}

function onDelete(td) {
  const row = td.parentElement.parentElement;
  const id = row.getAttribute('data-id');

  // Delete from the table
  row.remove();

  // Optionally, delete from the backend
  fetch(`http://localhost:5500/delete/${id}`, { method: 'DELETE' })
    .then(response => response.json())
    .then(result => {
      console.log('Record deleted:', result);
    })
    .catch(error => {
      console.error('Error deleting record:', error);
    });
}
