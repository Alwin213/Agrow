var selectedRow = null;
function  onFormSubmit(e){
    event.preventDefault();
    var formData = readFormData();
    if(selectedRow === null){
      insertNewRecord(formData);
    }
    else{
          updateRecord(formData);
    }
  resetForm();
}
function readFormData(){
    var formData = {};
    formData["Type of farming land"] = document.getElementById("Type of farming land").value;
    formData["Area"] = document.getElementById("Area").value;
    formData["Location"] = document.getElementById("Location").value;
    formData["Contactno"] = document.getElementById("Contactno").value;
    return formData;
}

function insertNewRecord(data){
var table = document.getElementById("storeList").getElementsByTagName('tbody')[0];
var newRow = table.insertRow(table.length);
var cell1= newRow.insertCell(0);
    cell1.innerHTML=data.Typeoffarmingland;;
var cell2= newRow.insertCell(1);
    cell2.innerHTML=data.Area;
var cell3= newRow.insertCell(2);
    cell3.innerHTML=data.Location;
var cell4= newRow.insertCell(3);
cell4.innerHTML=data.Contactno;
var cell5= newRow.insertCell(4);
cell5.innerHTML= '<button onClick='onEdit(this)'>Edit</button> <button> onClick ='onDelete(this)'>Delete</button>'
}

function OnEdit(td){
 selectedRow =td.parentElement.parentElement;
 document.getElementById('Typeoffarmingland').value=selectedRow.cells[0].innerHTML;
 document.getElementById('Area').value=selectedRow.cells[0].innerHTML;
 document.getElementById('Location').value=selectedRow.cells[0].innerHTML;
 document.getElementById('Contactno').value=selectedRow.cells[0].innerHTML;
}

function updateRecord(formData){
    selectedRow.cells[0].innerHTML=formData.Typeoffarmingland;
    selectedRow.cells[0].innerHTML=formData.Area;
    selectedRow.cells[0].innerHTML=formData.Location;
    selectedRow.cells[0].innerHTML=formData.Contactno;

}

function onDelete(td){
    if(confirm('Do you want to delete this record')){
     row =td.parentElement.parentElement;
    document.getElementById('storelist').deleteRow(row.rowIndex);
}
resetForm();
}

function resetForm(){
     document.getElementById('Typeoffarmingland').value='';
     document.getElementById('Area').value='';
     document.getElementById('Location').value='';
     document.getElementById('Contactno').value='';
}
