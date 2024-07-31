document.addEventListener('DOMContentLoaded', () => {
    const inputURL = document.getElementById('inputURL');
    const buttonEnter = document.getElementById('submitURL');
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content'); 

    const urlLink = document.getElementById("urlLink")
    const maliciousContent = document.getElementById("maliciousContent")
    const maliciousCount = document.getElementById("maliciousCount")
    const suspiciousContent = document.getElementById("suspiciousContent")
    const suspiciousCount = document.getElementById("suspiciousCount")
    const undetectedCount = document.getElementById("undetectedCount")
    const clearCount = document.getElementById("clearCount")
    const timeoutCount = document.getElementById("timeoutCount")


    function navigateToURLAnalysis() {
        const url = inputURL.value.trim();
        console.log('URL to analyze:', url);
        if (url) {
            const requestBody = JSON.stringify({url: url})
            
            fetch('/scan_url', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken
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
                console.log('Scan data:', data);
                // Assuming the scan response includes an 'id' field
                analyzeData(data)
            })
            .catch(error => {
                console.error('Error:', error);
                alert(`An error occurred: ${error.message}`);
            });
        } else {
            console.log('No URL entered');
        }}
    function analyzeData(data){
        fetch('/analyze_url', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken
        },
        body: JSON.stringify({id: data.id, url: data.url})
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
                displayData(data)
            } 
            })
            .catch(error => {
                console.error('Error:', error);
                alert(`An error occurred: ${error.message}`);
            });
    }
    function displayData(data){
        console.log(data)
        urlLink.textContent = 'URL: ' + data['url']
        maliciousCount.textContent = 'Malicious: ' + data['stats']['malicious']['count']
         
        suspiciousCount.textContent = 'suspicious: ' + data['stats']['suspicious']['count']
        undetectedCount.textContent  = 'Undetected: ' + data['stats']['undetected']
        clearCount.textContent = 'Clear: ' + data['stats']['harmless']
        timeoutCount.textContent = 'Timeout: ' + data['stats']['timeout']
    }
    inputURL.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            navigateToURLAnalysis();
        }
    });

    buttonEnter.addEventListener('click', navigateToURLAnalysis);
});