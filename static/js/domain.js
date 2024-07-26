document.addEventListener('DOMContentLoaded', () => {
    const inputDomain= document.getElementById('inputDomain');
    const buttonEnter = document.getElementById('submitDomain');

    function navigateToDomainAnalysis() {
        const domainName = inputDomain.value.trim();
        if (domainName) {
            window.location.href = `/domain/${domainName}`;
        }
    }

    inputDomain.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            navigateToDomainAnalysis();
        }
    });

    buttonEnter.addEventListener('click', navigateToDomainAnalysis);
});
