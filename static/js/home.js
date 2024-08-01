import { navigateToURLAnalysis, analyzeData, displayData } from './url.js';
document.addEventListener('DOMContentLoaded', function() {
    var dropdownElementList = [].slice.call(document.querySelectorAll('.dropdown-toggle'))
    var dropdownList = dropdownElementList.map(function (dropdownToggleEl) {
        return new bootstrap.Dropdown(dropdownToggleEl)
    })

    var dropdownButton = document.getElementById('dropdownButton');
    var inputValue = document.getElementById('inputField');
    var dropdownItems = document.querySelectorAll('.dropdown-item');

    // Handle dropdown item selection
    dropdownItems.forEach(function(item) {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            dropdownButton.textContent = this.textContent;
        });
    });

    inputValue.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            var inputValue = this.value.trim();
            var dropdownValue = dropdownButton.textContent;

            sendData(inputValue, dropdownValue);
        }
    });

    //set initial value
    var initialDropdownItem = "Choose";
    dropdownButton.textContent = initialDropdownItem;
});


function sendData(inputValue, dropdownValue) {
    console.log(inputValue)
   if(dropdownValue == "IP"){
        console.log("ip");
   }
   else if(dropdownValue == "Domain"){
        console.log("domain");
   }
   else if(dropdownValue == "URL"){
        navigateToURLAnalysis(inputValue);
   }
}

