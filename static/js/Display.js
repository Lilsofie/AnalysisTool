import { setGeoData } from "./google.js";

const DEFAULT_IP_DATA = {
    'ipAddr':'',
    'VTBlacklist': {'severity': 'None', 'stats': {'malicious': {'count': 0, 'details': []}, 'suspicious': {'count': 0, 'details': []}, 'undetected': 0, 'harmless':0, 'timeout': 0}}, 
    'Geolocation': {'Hostname': '', 'City': '', 'Region': '', 'Country': '', 'Org': '', 'latitude': '25.0245', 'longitude': '121.5697'}, 
    'HTBlacklist': {'count': 0, 'sites': ['']}, 
    'ASN': {'ISP': '', 'Range': ''}};

const DEFAULT_DOMAIN_DATA = {'domain': '' ,'ip_addr': '',
    'VTBlacklist': {'severity': 'None', 'stats': {'malicious': {'count': 0, 'details': []}, 'suspicious': {'count': 0, 'details': []}, 'undetected': 0, 'harmless':0, 'timeout': 0}}, 
    'Geolocation': {'Hostname': '', 'City': '', 'Region': '', 'Country': '', 'Org': '', 'latitude': '25.0245', 'longitude': '121.5697'}, 
    'ASN': {'ISP': '', 'Range': ''}, 
    'HTBlacklist': {'count': 0, 'sites': []},
    'Authentication': {'DMARC': {'Failed': {'count':0, 'details': []}, 'Warnings': {'count':0, 'details': []}, 'Passed': {'count':0, 'details': []}}, 
                    'DKIM': {'Failed': {'count':0, 'details': []}, 'Warnings': {'count':0, 'details': []}, 'Passed': {'count':0, 'details': []}}, 
                    'SPF': {'Failed': {'count':0, 'details': []}, 'Warnings': {'count':0, 'details': []}, 'Passed': {'count':0, 'details': []}}}}

const DEFAULT_URL_DATA = {'id': '', 'url':'.', 'VTBlacklist': {'severity': 'None', 'stats': {'malicious': {'count': 0, 'details': []}, 'suspicious': {'count': 0, 'details': []}, 'undetected': 0, 'harmless':0, 'timeout': 0}}}

export class Display {
    constructor(dataName) {
        this.dataName = dataName;
        this.tooltipList = this.initializeTooltips();
    }
    
    initializeTooltips() {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        return tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }

    displayData(data,flag) {
        if(data == null){
            if(flag == "IP") data = DEFAULT_IP_DATA;
            else if (flag == "Domain") data = DEFAULT_DOMAIN_DATA;
            else if (flag == "URL") data = DEFAULT_URL_DATA;
        }

        console.log(data);
        if(flag != "URL"){
            const ipAddr = document.getElementById("ipAddr");
            ipAddr.textContent = "IP: " + data.IPAddr;

            this.displayGeoData(data.Geolocation);
            this.displayAsnData(data.ASN);
            this.displayHtData(data.HTBlacklist);
            this.fetchGeoData(data.Geolocation);
            if(flag == "Domain"){
                const inputDomain = document.getElementById("inputDomain");
                const domainNm = document.getElementById("domainNm");

                domainNm.textContent = "Domain: " + data.name;
                inputDomain.placeholder  = "Enter a Domain";
                this.diplayAuthData(data.Authentication);
            }
            else{      
                const inputIP = document.getElementById("inputIP");
                inputIP.placeholder = "Enter an IP address";
            }
        }
        else{
            const inputURL = document.getElementById("inputURL");
            const urlLink = document.getElementById("urlLink");

            urlLink.textContent = "URL: " + data.url;
            inputURL.placeholder = "Enter an URL";
        }
        this.displayVtData(data.VTBlacklist);

        // Clear the data from localStorage
        localStorage.removeItem(this.dataName);
    }

    displayGeoData(geo) {
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

    displayAsnData(asn) {
        const isp = document.getElementById("isp");
        const range = document.getElementById("range");
        isp.textContent = asn.ISP;
        range.textContent = asn.Range;
    }

    displayVtData(vt) {
        
        const maliciousCount = document.getElementById("maliciousCount");
        const suspiciousCount = document.getElementById("suspiciousCount");
        const undetectedCount = document.getElementById("undetectedCount");
        const clearCount = document.getElementById("clearCount");
        const timeoutCount = document.getElementById("timeoutCount");

        if(vt.severity != "None"){
            const severity = document.getElementById("severity");
            severity.textContent = "Severity: " + vt.severity;
        }

        const malicious = vt.stats.malicious;
        if(this.checkValidOutput(vt.stats)){
            maliciousCount.textContent = "Malicious: " + malicious.count;
            if(malicious.count != 0){
                maliciousCount.setAttribute("title", malicious.details.join(", "));
                new bootstrap.Tooltip(maliciousCount).update();
            }

            const suspicious = vt.stats.suspicious;
            suspiciousCount.textContent = "Suspicious: " + suspicious.count;
            if(suspicious.count != 0){
                suspiciousCount.setAttribute("title", suspicious.details.join(", "));
                new bootstrap.Tooltip(suspiciousCount).update();
            }

            undetectedCount.textContent = "Undetected: " + vt.stats.undetected;
            clearCount.textContent = "Clear: " + vt.stats.harmless;
            timeoutCount.textContent = "Timeout: " + vt.stats.timeout;
        }else{
            alert("API error: Please restart the project");
        }
        
    }

    displayHtData(ht) {
        const blacklistCount = document.getElementById("blacklistCount");
        const blacklistContent = document.getElementById("blacklistContent");

        blacklistCount.textContent = ht.count + " Blacklisted Counts";
        blacklistContent.textContent = ht.sites.join(", ");
    }

    diplayAuthData(auth){
        const types = ['DMARC', 'DKIM', 'SPF'];
        const statuses = ['Failed', 'Warnings', 'Passed'];
    
        types.forEach(type => {
            const typeData = auth[type];
            
            statuses.forEach(status => {
                const elementId = `${type.toLowerCase()}${status}Count`;
                const element = document.getElementById(elementId);
                
                if (element) {
                    element.textContent = typeData[status].count;
    
                    if (typeData[status].count !== 0) {
                        element.setAttribute("title", typeData[status].details.join(", "));
                        new bootstrap.Tooltip(element).update();
                    }
                }
            });
        });
    }
    
    fetchGeoData(geo){
        const geoData = {
            latitude: geo.latitude,
            longitude: geo.longitude
        };
        setGeoData(geoData);
    }

    checkValidOutput(stats){
        if(!stats.malicious.count && !stats.suspicious.count && !stats.harmless && !stats.timeout && !stats.undetected) {
            alert("Invalid output detected. Resloading the page... Try again later");
            location.reload(true); 
        };
        return 1;
    }
    
}