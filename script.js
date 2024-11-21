document.getElementById('addCrop').addEventListener('click', addCrop);

function addCrop() {
    const cropName = document.getElementById('cropName').value;
    const quantity = document.getElementById('quantity').value;

    if (cropName && quantity) {
        const table = document.getElementById('cropTable').getElementsByTagName('tbody')[0];
        const newRow = table.insertRow();

        // Insert cells for Crop Name and Quantity
        const cropNameCell = newRow.insertCell(0);
        cropNameCell.textContent = cropName;

        const quantityCell = newRow.insertCell(1);
        quantityCell.textContent = quantity;

        // Create Actions cell with Edit and Delete buttons
        const actionsCell = newRow.insertCell(2);
        actionsCell.innerHTML = `
            <button onclick="editCrop(this)">Edit</button>
            <button onclick="deleteCrop(this)">Delete</button>
        `;

        // Clear input fields
        document.getElementById('cropName').value = '';
        document.getElementById('quantity').value = '';
    } else {
        alert('Please enter both crop name and quantity.');
    }
}

function deleteCrop(button) {
    const row = button.parentElement.parentElement;
    row.remove();
}

function editCrop(button) {
    const row = button.parentElement.parentElement;
    const cropName = row.cells[0].textContent;
    const quantity = row.cells[1].textContent;

    document.getElementById('cropName').value = cropName;
    document.getElementById('quantity').value = quantity;

    // Remove the current row to update with new data
    row.remove();
}
