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

document.addEventListener('DOMContentLoaded', function() {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    })
});
