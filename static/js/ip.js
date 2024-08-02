import { Display } from "./display.js";

const CSRF_TOKEN = document.querySelector('meta[name="csrf-token"]').getAttribute('content'); 

document.addEventListener('DOMContentLoaded', () => {

    const inputIP = document.getElementById('inputIP');
    const buttonEnter = document.getElementById('submitIP');
    
    var ipData = JSON.parse(localStorage.getItem('ipData'));
    console.log()
    localStorage.removeItem('ipData');
    if(ipData != null){
        const display = new Display('ipData');
        display.displayData(ipData,"IP");
    }
    
    if(inputIP){
        inputIP.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                navigateToIPAnalysis(inputIP.value);
                inputIP.placeholder = "Loading...";
                inputIP.value = '';
            }
        });
    }

    if(buttonEnter){
        buttonEnter.addEventListener('click', function() {
            navigateToIPAnalysis(inputIP.value);
            inputIP.placeholder = "Loading...";
            inputIP.value = '';
        });   
    }
});

export function navigateToIPAnalysis(input) {
    const inputIP = document.getElementById('inputIP') || document.getElementById('inputField')
    const ipAddress = input;
    console.log('IP to analyze:', ipAddress);

    const isValidIP = (ip) => {
        const domainRegex = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        return domainRegex.test(ip);
    };

    const showError = (message) => {
        // error display
        alert(message);
    };

    if (ipAddress) {
        if(isValidIP(ipAddress)){
            fetch('/analyze_ip', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': CSRF_TOKEN
                },
                body: JSON.stringify({ip_addr: ipAddress})
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Scan data:', data);
                if (data.IPAddr) {
                    localStorage.setItem('ipData', JSON.stringify(data));   
                    window.location.href = `/ip/${data.IPAddr}`;
                } 
            })
            .catch(error => {
                console.error('Error:', error);
                alert(`An error occurred: ${error.message}`);
            });
        } else {
            inputIP.placeholder = "Enter an IP address";
            showError('Please enter a valid IP address');
        }
    } else {
        inputIP.placeholder = "Enter an IP address";
    }
}
