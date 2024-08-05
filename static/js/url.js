import { Display } from "./Display.js";
const CSRF_TOKEN = document.querySelector('meta[name="csrf-token"]').getAttribute('content'); 

document.addEventListener('DOMContentLoaded', () => {
 
    const inputURL = document.getElementById("inputURL");
    const buttonEnter = document.getElementById("submitURL");
    var urlData = JSON.parse(localStorage.getItem('urlData'));

    localStorage.removeItem('urlData');

    if(urlData != null){
        const display = new Display('urlData');
        display.displayData(urlData,"URL");
    }

    if(inputURL){
        inputURL.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                inputURL.placeholder = "Loading...";
                navigateToURLAnalysis(inputURL.value);
                inputURL.value = '';
            }
        });
    }

    if(buttonEnter){
        buttonEnter.addEventListener('click', function() {
            inputURL.placeholder = "Loading...";
            navigateToURLAnalysis(inputURL.value);
            inputURL.value = '';
        });   
    }
    
});

export function navigateToURLAnalysis(input) {   
    const inputURL = document.getElementById("inputURL") || document.getElementById('inputField');
    const url = input;
    console.log('URL to analyze:', url);

    const isValidURL = (url) => {
        const domainRegex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/;
        return domainRegex.test(url);
    };

    const showError = (message) => {
        // error display
        alert(message);
    };

    if (url) {
      if(isValidURL(url)){
        fetch('/scan_url', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': CSRF_TOKEN
            },
            body: JSON.stringify({url: url})
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            analyzeData(data);
          
        })
        .catch(error => {
            console.error('Error:', error);
            alert(`An error occurred: ${error.message}`);
        });
        } else {
            inputURL.placeholder = "Enter an URL";
            showError('Please enter a valid URL address');
        }
    } else {
        inputURL.placeholder = "Enter an URL";
    }
}

export function analyzeData(data){
    fetch('/analyze_url', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': CSRF_TOKEN
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Scan data:', data);
        if (data.id) { 

            localStorage.setItem('urlData', JSON.stringify(data));   
            window.location.href = `/url/${data.id}`;
        } 
        })
        .catch(error => {
            console.error('Error:', error);
            alert(`An error occurred: ${error.message}`);
        });
}

