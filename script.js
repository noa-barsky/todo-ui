console.log("houston, we have landed!");

var addPicture = document.getElementById("adder");
var inputField = document.getElementById("enter-bar");
var inputValue = document.getElementById("input-value");
function listAdder(){
    var html = '<div class="added-item">%description%</div>';
    var newHTML = html.replace ("%description%", inputValue.value);
    inputField.insertAdjacentHTML('afterend', newHTML);
    
    
}

function clickEvents () {
    addPicture.addEventListener("click", listAdder);

}

function init(){
    clickEvents ();
    
}

init();