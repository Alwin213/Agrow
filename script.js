var selectedRow = NULL;
function  onFormSubmit(){
    event.preventDefault();
    var formData = readFormData();
    if(selectedRow ===null){
      insertNewRecord(formData);
    }
    else{

    }

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
cell5.innerHTML='<button>Edit</button> <button>Delete </button>'
}


