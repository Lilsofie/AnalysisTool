document.addEventListener('DOMContentLoaded', () => {
    const inputIP = document.getElementById('inputIP');
    const buttonEnter = document.getElementById('submitIP');

    function navigateToIPAnalysis() {
        const ipAddress = inputIP.value.trim();
        if (ipAddress) {
            window.location.href = `/ip/${ipAddress}`;
        }
    }

    inputIP.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            navigateToIPAnalysis();
        }
    });

    buttonEnter.addEventListener('click', navigateToIPAnalysis);
});
