document.addEventListener('DOMContentLoaded', () => {
    const inputIP = document.getElementById('inputURL');
    const buttonEnter = document.getElementById('submitIP');

    function navigateToURLAnalysis() {
        const urlLink = inputURL.value.trim();
        if (urlLink) {
            window.location.href = `/url/${urlLink}`;
        }
    }

    inputIP.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            navigateToURLAnalysis();
        }
    });

    buttonEnter.addEventListener('click', navigateToURLAnalysis);
});