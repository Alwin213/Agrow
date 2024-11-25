var selectedRow = null;

function onFormSubmit(event) {
    event.preventDefault(); // Prevent default form submission
    var formData = readFormData();
    if (selectedRow === null) {
        insertNewRecord(formData);
    } else {
        updateRecord(formData);
    }
    resetForm();
}

function readFormData() {
    var formData = {};
    formData["Typeoffarmingland"] = document.getElementById("Typeoffarmingland").value || "crop";
    formData["Area"] = document.getElementById("Area").value || "area";
    formData["Location"] = document.getElementById("Location").value || "location";
    formData["Contactno"] = document.getElementById("Contactno").value || "contact";
    return formData;
}

function insertNewRecord(data) {
    var table = document.getElementById("storeList").getElementsByTagName('tbody')[0];
    var newRow = table.insertRow(table.rows.length); // Use rows.length to insert at the end

    var cell1 = newRow.insertCell(0);
    cell1.innerHTML = data.Typeoffarmingland;

    var cell2 = newRow.insertCell(1);
    cell2.innerHTML = data.Area;

    var cell3 = newRow.insertCell(2);
    cell3.innerHTML = data.Location;

    var cell4 = newRow.insertCell(3);
    cell4.innerHTML = data.Contactno;

    var cell5 = newRow.insertCell(4);
    cell5.innerHTML = `
        <button onClick="onEdit(this)">Edit</button>
        <button onClick="onDelete(this)">Delete</button>`;
}

function onEdit(td) {
    selectedRow = td.parentElement.parentElement;
    document.getElementById("Typeoffarmingland").value = selectedRow.cells[0].innerHTML;
    document.getElementById("Area").value = selectedRow.cells[1].innerHTML;
    document.getElementById("Location").value = selectedRow.cells[2].innerHTML;
    document.getElementById("Contactno").value = selectedRow.cells[3].innerHTML;
}

function updateRecord(formData) {
    selectedRow.cells[0].innerHTML = formData.Typeoffarmingland;
    selectedRow.cells[1].innerHTML = formData.Area;
    selectedRow.cells[2].innerHTML = formData.Location;
    selectedRow.cells[3].innerHTML = formData.Contactno;
}

function onDelete(td) {
    if (confirm('Do you want to delete this record?')) {
        row = td.parentElement.parentElement;
        document.getElementById("storeList").deleteRow(row.rowIndex);
        resetForm();
    }
}

function resetForm() {
    document.getElementById("Typeoffarmingland").value = '';
    document.getElementById("Area").value = '';
    document.getElementById("Location").value = '';
    document.getElementById("Contactno").value = '';
    selectedRow = null;
}
