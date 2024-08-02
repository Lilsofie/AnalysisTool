import { Display } from "./display.js";
const CSRF_TOKEN = document.querySelector('meta[name="csrf-token"]').getAttribute('content'); 

document.addEventListener('DOMContentLoaded', () => {

    const display = new Display('urlData');
    const inputURL = document.getElementById("inputURL");
    const buttonEnter = document.getElementById("submitURL");

    var urlData = JSON.parse(localStorage.getItem('urlData'));
    localStorage.removeItem('urlData');
    display.displayData(urlData,"URL");
 
    inputURL.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            navigateToURLAnalysis(inputURL.value);
            inputURL.value = '';
        }
    });
     
    buttonEnter.addEventListener('click', function() {
        navigateToURLAnalysis(inputURL.value);
        inputURL.value = '';
    });
    
});

export function navigateToURLAnalysis(input) {   
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
            showError('Please enter a valid URL address');
        }
    } else {
        showError('Please enter a URL iddress');
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

