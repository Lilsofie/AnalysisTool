const CSRF_TOKEN = document.querySelector('meta[name="csrf-token"]').getAttribute('content'); 
const DEFAULT_URL_DATA = {'id': '', 'url':'.', 'stats': {'malicious': {'count': 0, 'details': []}, 'suspicious': {'count': 0, 'details': []}, 'undetected': 0, 'harmless': 0, 'timeout': 0}}

document.addEventListener('DOMContentLoaded', () => {
    
    const inputURL = document.getElementById("inputURL");
    const buttonEnter = document.getElementById("submitURL");
    var urlData = JSON.parse(localStorage.getItem('urlData'));
    displayData(urlData);
 
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
    if (url) {
        const requestBody = JSON.stringify({url: url})
        fetch('/scan_url', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': CSRF_TOKEN
            },
            body: requestBody,
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Assuming the scan response includes an 'id' field
            analyzeData(data);
          
        })
        .catch(error => {
            console.error('Error:', error);
            alert(`An error occurred: ${error.message}`);
        });
    } else {
        console.log('No URL entered');
    }}


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

function displayData(urlData){
    if (urlData == null) {urlData = DEFAULT_URL_DATA;}
    else console.log(urlData);

    const urlLink = document.getElementById("urlLink");         
    const maliciousContent = document.getElementById("maliciousContent");
    const maliciousCount = document.getElementById("maliciousCount");
    const suspiciousContent = document.getElementById("suspiciousContent");
    const suspiciousCount = document.getElementById("suspiciousCount");
    const undetectedCount = document.getElementById("undetectedCount");
    const clearCount = document.getElementById("clearCount");
    const timeoutCount = document.getElementById("timeoutCount");

    urlLink.textContent = 'URL: ' + urlData.url;
    
    const malicious =  urlData.stats.malicious;
    maliciousCount.textContent = 'Malicious: ' + malicious.count;

    if (malicious.count !== 0) {
        maliciousContent.textContent = malicious.details.join(" ");
    } else {
    maliciousContent.textContent = '';
    }

    const suspicious = urlData.stats.suspicious;
    suspiciousCount.textContent = 'Suspicious: ' + suspicious.count;
    if (suspicious.count !== 0) {
        suspiciousContent.textContent = suspicious.details.join(" ");
    } else {
        suspiciousContent.textContent = '';
    }

    undetectedCount.textContent  = 'Undetected: ' + urlData.stats.undetected;
    clearCount.textContent = 'Clear: ' + urlData.stats.harmless;
    timeoutCount.textContent = 'Timeout: ' + urlData.stats.timeout;
    // Clear the data from localStorage
    localStorage.removeItem('urlData');
}
