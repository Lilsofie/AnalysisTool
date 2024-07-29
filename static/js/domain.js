document.addEventListener('DOMContentLoaded', () => {
    const inputDomain= document.getElementById('inputDomain');
    const buttonEnter = document.getElementById('submitDomain');

    const navigateToDomainAnalysis = () => {
        const domainName = inputDomain.value.trim();
        if (domainName) {
            if (isValidDomain(domainName)) {
                window.location.href = `/domain/${encodeURIComponent(domainName)}`;
            } else {
                showError('Please enter a valid domain name');
            }
        } else {
            showError('Please enter a domain name');
        }
    };

    const isValidDomain = (domain) => {
        const domainRegex = /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}(?::([a-zA-Z0-9._-]+))?$/;
        return domainRegex.test(domain);
    };

    const showError = (message) => {
        // error display
        alert(message);
    };
    inputDomain.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            navigateToDomainAnalysis();
        }
    });

    buttonEnter.addEventListener('click', navigateToDomainAnalysis);
    const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
});

