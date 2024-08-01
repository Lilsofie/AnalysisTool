const CSRF_TOKEN = document.querySelector('meta[name="csrf-token"]').getAttribute('content'); 

document.addEventListener('DOMContentLoaded', () => {
    const inputIP = document.getElementById('inputIP');
    const buttonEnter = document.getElementById('submitIP');
    const ipData = JSON.parse(localStorage.getItem('ipData'));
    console.log(ipData);
    if(ipData){   
        const ipAddr = document.getElementById("ipAddr");
       
        ipAddr.textContent = "IP: " + ipData.ip_addr;

        const geo = ipData.Geolocation;
        displayGeo(geo);
        loadMap(geo);

        const asn = ipData.ASN;
        displayAsn(asn);

        const vt = ipData.VTBlacklist;
        displayVt(vt);
        
        const ht = ipData.HTBlacklist;
        displayHt(ht);

    }
    
    function displayGeo(geo){
        const country = document.getElementById("country");
        const region = document.getElementById("region");
        const city = document.getElementById("city");
        const org = document.getElementById("org");
        const host = document.getElementById("host");

        country.textContent = "Country: " + geo.Country;
        region.textContent = "Region: " + geo.Region;
        city.textContent = "City: " + geo.City;
        org.textContent = geo.Org;
        host.textContent = geo.Hostname;
      

    }

    function displayAsn(asn){
        const isp = document.getElementById("isp");
        const range = document.getElementById("range");

        isp.textContent = asn.ISP;
        range.textContent = asn.Range;
    }

    function displayVt(vt){
        const severity = document.getElementById("severity");
        const maliciousCount = document.getElementById("maliciousCount");
        const maliciousTooltip = document.getElementById("maliciousTooltip");
        const suspiciousCount = document.getElementById("suspiciousCount");
        const suspiciousTooltip = document.getElementById("suspiciousTooltip");
        const undetectedCount = document.getElementById("undetectedCount");
        const clearCount = document.getElementById("clearCount");
        const timeoutCount = document.getElementById("timeoutCount");

        if(vt.severity != 'None'){
            severity.textContent = "Severity: " + vt.severity;
        }

        maliciousCount.textContent = "Malicious: " + vt.stats.malicious.count;
        suspiciousCount.textContent = "Suspicious: " + vt.stats.suspicious.count;
        undetectedCount.textContent = "Undetected: " + vt.stats.undetected.count;
        clearCount.textContent = "Harmless: " + vt.stats.harmless.count;
        timeoutCount.textContent = "Timeout: " + vt.stats.timeout.count;
    }

    function displayHt(ht){
        const blacklistCount = document.getElementById("blacklistCount");
        const blacklistContent = document.getElementById("blacklistContent");

        blacklistCount.textContent = ht.count + "blacklisted counts";
        blacklistContent.textContent = ht.sites.join(" ");

    }

    function loadMap(geo){
        const mapDiv = document.getElementById("map");

        var mapOptions = {
            center: { lat: geo.latitude, lng: geo.longtitude },
            zoom: 12
        };
        
        var map = new google.maps.Map(mapDiv, mapOptions);
    }

    inputIP.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            navigateToIPAnalysis(inputIP.value);
            inputIP.value = '';
        }
    });

    buttonEnter.addEventListener('click', function() {
        navigateToIPAnalysis(inputIP.value);
        inputIP.value = '';
    });
});

export function navigateToIPAnalysis(input) {
    const ipAddress = input;
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
                    'X-CSRFToken': CSRF_TOKEN
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
                    localStorage.setItem('ipData', JSON.stringify(data));   
                    window.location.href = `/ip/${data.ip_addr}`;
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
