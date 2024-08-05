import { Display } from "./display.js";

const CSRF_TOKEN = document.querySelector('meta[name="csrf-token"]').getAttribute('content'); 

document.addEventListener('DOMContentLoaded', () => {

    const inputDomain= document.getElementById('inputDomain');
    const buttonEnter = document.getElementById('submitDomain');

    var domainData = JSON.parse(localStorage.getItem('domainData'));
    localStorage.removeItem('domainData');
    
    if(domainData != null){
        const display = new Display('domainData');
        display.displayData(domainData,"Domain");
    }

    if(inputDomain){
        inputDomain.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                inputDomain.placeholder  = "Loading...";
                navigateToDomainAnalysis(inputDomain.value);
                inputDomain.value = '';
            }
        });
    }

    if(buttonEnter){
        buttonEnter.addEventListener('click', function() {
            inputDomain.placeholder  = "Loading...";
            navigateToDomainAnalysis(inputDomain.value);
            inputDomain.value = '';
        });   
    }
});

export function navigateToDomainAnalysis(input){
    const inputDomain= document.getElementById('inputDomain') || document.getElementById('homeInput');
    const domainName = input;
    console.log('Domain to analyze:', domainName);

    const isValidDomain = (domain) => {
        const domainRegex = /^([a-zA-Z0-9.-]+)(?::([a-zA-Z0-9.-]+))?$/;
        return domainRegex.test(domain);
    };

    const showError = (message) => {
        // error display
        alert(message);
    };

    if (domainName) {
        if (isValidDomain(domainName)) {
            fetch('/analyze_domain', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': CSRF_TOKEN
                },
                body: JSON.stringify({domain: domainName})
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Scan data:', data);
                if (data.name) {
                    localStorage.setItem('domainData', JSON.stringify(data));   
                    window.location.href = `/domain/${data.name}`;
                } 
            })
            .catch(error => {
                console.error('Error:', error);
                alert(`An error occurred: ${error.message}`);
            });
            
        }else{
            inputDomain.placeholder = "Enter a Domain";
            showError('Please enter a valid domain name');
        }
    } else {
        inputDomain.placeholder = "Enter a Domain";
    }
};
