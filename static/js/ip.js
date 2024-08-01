document.addEventListener('DOMContentLoaded', () => {
    const inputIP = document.getElementById('inputIP');
    const buttonEnter = document.getElementById('submitIP');
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content'); 

    const ipAddr = document.getElementById("ipAddr");
    const country = document.getElementById("country");
    const region = document.getElementById("region");
    const city = document.getElementById("city");
    
    const isp = document.getElementById("isp");
    const org = document.getElementById("org");
    const range = document.getElementById("range")
    const host = document.getElementById("host");
    
    const blacklistCount = document.getElementById("blacklistCount");
    const blacklistContent = document.getElementById("blacklistContent")
    
    const severity = document.getElementById("severity");
    const maliciousCount = document.getElementById("maliciousCount");
    const maliciousTooltip = document.getElementById("maliciousTooltip");
    const suspiciousCount = document.getElementById("suspiciousCount");
    const suspiciousTooltip = document.getElementById("suspiciousTooltip")
    const undetectedCount = document.getElementById("undetectedCount");
    const clearCount = document.getElementById("clearCount");
    const timeoutCount = document.getElementById("timeoutCount")

    function navigateToIPAnalysis() {
        const ipAddress = inputIP.value.trim();
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
                        'X-CSRFToken': csrfToken
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
                    if (data.ip_addr) {
                        displayData(data)
                    } 
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        alert(`An error occurred: ${error.message}`);
                    });
            } else {
                showError('Please enter a valid IP address');
            }
        } else {
            showError('Please enter a IP iddress');
        }
    }
    function displayData(data){
        ipAddr.textContent = "IP: " + data.ip_addr;
    }
    inputIP.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            navigateToIPAnalysis();
        }
    });

    buttonEnter.addEventListener('click', navigateToIPAnalysis);
});
