import { setGeoData } from "./google.js";
const CSRF_TOKEN = document.querySelector('meta[name="csrf-token"]').getAttribute('content'); 
const DEFAULT_IP_DATA = {
    'VTBlacklist': {'severity': '', 'stats': {'malicious': {'count': 0, 'details': []}, 'suspicious': {'count': 0, 'details': []}, 'undetected': 0, 'harmless':0, 'timeout': 0}}, 
    'Geolocation': {'Hostname': '', 'City': '', 'Region': '', 'Country': '', 'Org': '', 'latitude': '25.033130', 'longitude': '121.567720'}, 
    'HTBlacklist': {'count': 0, 'sites': ['']}, 
    'ASN': {'ISP': '', 'Range': ''}};

document.addEventListener('DOMContentLoaded', () => {
    const inputIP = document.getElementById('inputIP');
    const buttonEnter = document.getElementById('submitIP');
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    var ipData = JSON.parse(localStorage.getItem('ipData'));
    displayData(ipData);

    
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

function displayData(ipData){
    if (ipData == null) ipData = DEFAULT_IP_DATA;
    else console.log(ipData);

    const ipAddr = document.getElementById("ipAddr");
    
    ipAddr.textContent = "IP: " + ipData.ip_addr;

    const geo = ipData.Geolocation;
    displayGeoData(geo);
    fetchGeoData(geo);

    const asn = ipData.ASN;
    displayAsnData(asn);

    const vt = ipData.VTBlacklist;
    displayVtData(vt);
    
    const ht = ipData.HTBlacklist;
    displayHtData(ht);

    // Clear the data from localStorage
    localStorage.removeItem('ipData');
}
  
function displayGeoData(geo){
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

function displayAsnData(asn){
    const isp = document.getElementById("isp");
    const range = document.getElementById("range");

    isp.textContent = asn.ISP;
    range.textContent = asn.Range;
}

function displayVtData(vt){
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

    const malicious = vt.stats.malicious
    
    if(malicious.count != 0){
        maliciousTooltip.setAttribute("title", malicious.details.join(", "));
        maliciousTooltip.textContent = "Malicious: " + malicious.count;
        var tooltip = new bootstrap.Tooltip(maliciousTooltip);
        tooltip.update();
    }
    else{
        maliciousCount.textContent = "Malicious: " + malicious.count;
    }

    suspiciousCount.textContent = "Suspicious: " + vt.stats.suspicious.count;
    undetectedCount.textContent = "Undetected: " + vt.stats.undetected;
    clearCount.textContent = "Clear: " + vt.stats.harmless;
    timeoutCount.textContent = "Timeout: " + vt.stats.timeout;
}

function displayHtData(ht){
    const blacklistCount = document.getElementById("blacklistCount");
    const blacklistContent = document.getElementById("blacklistContent");

    blacklistCount.textContent = ht.count + "blacklisted counts";
    blacklistContent.textContent = ht.sites.join(", ");

}

function fetchGeoData(geo){
    const geoData = {
        latitude: geo.latitude,
        longitude: geo.longitude
    };
    setGeoData(geoData);
}