document.addEventListener('DOMContentLoaded', () => {
    const inputURL = document.getElementById('inputURL');
    const buttonEnter = document.getElementById('submitURL');

    function navigateToURLAnalysis() {
        const url = inputURL.value.trim();
        console.log('URL to analyze:', url); // Log the URL being sent

        if (url) {
            const requestBody = JSON.stringify({url: url})
            const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content'); 
            console.log('Request body:', requestBody); // Log the request body
            fetch('/scan_url', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken
                },
                body: requestBody,
            })
            .then(response => {
                console.log('Response status:', response.status); // Log the response status
                console.log('Response headers:', response.headers); // Log the response headers
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const contentType = response.headers.get("content-type");
                if (!contentType || !contentType.includes("application/json")) {
                    throw new TypeError("Oops, we haven't got JSON!");
                }
                return response.json();
            })
            .then(data => {
                console.log('Response data:', data); // Log the response data
                window.location.href = `/url/${data.id}?url=${encodeURIComponent(data.url)}`;
                
            })
            .catch(error => {
                console.error('Error:', error);
                alert(`An error occurred: ${error.message}`);
            });
        } else {
            console.log('No URL entered'); // Log if no URL was entered
        }
    }

    inputURL.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            navigateToURLAnalysis();
        }
    });

    buttonEnter.addEventListener('click', navigateToURLAnalysis);
});