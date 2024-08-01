import { setGeoData } from "./google.js";

const CSRF_TOKEN = document.querySelector('meta[name="csrf-token"]').getAttribute('content'); 
const DEFAULT_DOMAIN_DATA = {'domain': '' ,'IPAddr': '',
                       'VTBlacklist': {'severity': '', 'stats': {'malicious': {'count': 0, 'details': []}, 'suspicious': {'count': 0, 'details': []}, 'undetected': 0, 'harmless':0, 'timeout': 0}}, 
                        'Geolocation': {'Hostname': '', 'City': '', 'Region': '', 'Country': '', 'Org': '', 'latitude': '', 'longitude': ''}, 
                        'ASN': {'ISP': '', 'Range': ''}, 
                        'HTBlacklist': {'count': 0, 'sites': []},
                        'Authentication': {'DMARC': {'Failed': {'count':0, 'details': []}, 'Warnings': {'count':0, 'details': []}, 'Passed': {'count':1, 'details': []}}, 
                                           'DKIM': {'Failed': {'count':0, 'details': []}, 'Warnings': {'count':1, 'details': []}, 'Passed': {'count':0, 'details': []}}, 
                                           'SPF': {'Failed': {'count':1, 'details': []}, 'Warnings': {'count':0, 'details': []}, 'Passed': {'count':0, 'details': []}}}}

ocument.addEventListener('DOMContentLoaded', () => {

    
    const inputDomain= document.getElementById('inputDomain');
    const buttonEnter = document.getElementById('submitDomain');

    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    var domainData = JSON.parse(localStorage.getItem('domainData'));
    displayData(domainData);

    inputDomain.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            navigateToDomainAnalysis(inputDomain.value);
            inputDomain.value= '';
        }
    });

    buttonEnter.addEventListener('click', function() {
        navigateToDomainAnalysis(inputDomain.value);
        inputDomain.value = '';
    });
});

export function navigateToDomainAnalysis(input){
    const domainName = input;
    console.log('Domain to analyze:', domainName);

    const isValidDomain = (domain) => {
        const domainRegex = /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}(?::([a-zA-Z0-9._-]+))?$/;
        return domainRegex.test(domain);
    };

    const showError = (message) => {
        // error display
        alert(message);
    };

    if (domainName) {
        if (isValidDomain(domainName)) {
            fetch('/analyze_domain', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': CSRF_TOKEN
                },
                body: JSON.stringify({domain: domainName})
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
                    localStorage.setItem('domainData', JSON.stringify(data));   
                    window.location.href = `/domain/${data.domain_name}`;
                } 
            })
            .catch(error => {
                console.error('Error:', error);
                alert(`An error occurred: ${error.message}`);
            });
            showError('Please enter a valid domain name');
        }
    } else {
        showError('Please enter a domain name');
    }
};

function displayData(domainData){
    if(domainData == null) domainData = DEFAULT_DOMAIN_DATA;
    else console.log(domainData);

    const domainNm = document.getElementById("domainNm");
    const ipAddr = document.getElementById("ipAddr");
    
    domainNm.textContent = "Domain: " + domainData.domain;
    ipAddr.textContent = "IP: " + domainData.ip_addr;

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

    const suspicious = vt.stats.suspicious;
    if(suspicious.count != 0){
        maliciousTooltip.setAttribute("title", suspicious.details.join(", "));
        maliciousTooltip.textContent = "Suspicious: " + suspicious.count;
        var tooltip = new bootstrap.Tooltip(suspiciousTooltip);
        tooltip.update();
    }
    else{
        suspiciousCount.textContent = "Suspicious: " + suspicious.count;
    }

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
