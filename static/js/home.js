import { navigateToURLAnalysis, analyzeData} from './url.js';
import {navigateToIPAnalysis} from './ip.js';
import { navigateToDomainAnalysis } from './domain.js';

document.addEventListener('DOMContentLoaded', function() {
    var dropdownElementList = [].slice.call(document.querySelectorAll('.dropdown-toggle'))
    var dropdownList = dropdownElementList.map(function (dropdownToggleEl) {
        return new bootstrap.Dropdown(dropdownToggleEl)
    })

    var dropdownButton = document.getElementById('dropdownButton');
    var homeInput = document.getElementById('homeInput');
    var dropdownItems = document.querySelectorAll('.dropdown-item');

    // Handle dropdown item selection
    dropdownItems.forEach(function(item) {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            dropdownButton.textContent = this.textContent;
        });
    });
    homeInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            var inputValue = this.value.trim();
            var dropdownValue = dropdownButton.textContent;
            if(dropdownValue != "Choose") homeInput.placeholder = "Loading...";
            homeInput.value = "";
            sendData(inputValue, dropdownValue);
        }
    });

    //set initial value
    var initialDropdownItem = "Choose";
    dropdownButton.textContent = initialDropdownItem;
});


function sendData(inputValue, dropdownValue) {
   if(dropdownValue == "IP"){
        navigateToIPAnalysis(inputValue);
   }
   else if(dropdownValue == "Domain"){
        navigateToDomainAnalysis(inputValue);
   }
   else if(dropdownValue == "URL"){
        navigateToURLAnalysis(inputValue);
   }
   else{
    alert("Please choose a category to analyze");
    }
}

