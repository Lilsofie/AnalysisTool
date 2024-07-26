document.addEventListener('DOMContentLoaded', function() {
    var dropdownElementList = [].slice.call(document.querySelectorAll('.dropdown-toggle'))
    var dropdownList = dropdownElementList.map(function (dropdownToggleEl) {
        return new bootstrap.Dropdown(dropdownToggleEl)
    })

    var dropdownButton = document.getElementById('dropdownButton');
    var inputField = document.getElementById('inputField');
    var dropdownItems = document.querySelectorAll('.dropdown-item');

    // Handle dropdown item selection
    dropdownItems.forEach(function(item) {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            dropdownButton.textContent = this.textContent;
        });
    });

    inputField.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            var inputValue = this.value;
            var dropdownValue = dropdownButton.textContent;
            sendDataToBackend(inputValue, dropdownValue);
        }
    });

    //set initial value
    var initialDropdownItem = "Choose";
    dropdownButton.textContent = initialDropdownItem;
});

function sendDataToBackend(inputValue, dropdownValue) {
    const data = {
        "inputValue": inputValue,
       "dropdownValue": dropdownValue
    };
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content'); 
    console.log('Sending data:', data);

    fetch('/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        console.log('Response status:', response.status);
        if (!response.ok) {
            return response.text().then(text => {
                throw new Error(`${response.status} ${response.statusText}: ${text}`);
            });
        }
        return response.json();
    })
    .then(data => {
        if (data.redirect_url) {
            console.log('Redirecting to:', data.redirect_url);
            window.location.href = data.redirect_url;
        } else {
            console.log('Success:', data);
        }

    })
    .catch((error) => {
        console.error('Error:', error);
        alert('An error occurred. Please check the console for details.');
    });
    
}

