document.addEventListener('DOMContentLoaded', () => {
    const inputIP = document.getElementById('inputIP');
    const buttonEnter = document.getElementById('submitIP');

    function navigateToIPAnalysis() {
        const ipAddress = inputIP.value.trim();
        if (ipAddress) {
            if(isValidIP(ipAddress)){
                window.location.href = `/ip/${ipAddress}`;
            } else {
                showError('Please enter a valid domain name');
            }
        } else {
            showError('Please enter a domain name');
        }
    }
    const isValidIP = (ip) => {
        const domainRegex = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        return domainRegex.test(ip);
    };

    const showError = (message) => {
        // error display
        alert(message);
    };
    inputIP.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            navigateToIPAnalysis();
        }
    });

    buttonEnter.addEventListener('click', navigateToIPAnalysis);
});
