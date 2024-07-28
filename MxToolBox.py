import requests


base_url = "https://mxtoolbox.com/api/v1/Lookup/"
auth_methods = ["DMARC","DKIM","SPF"]

def checkValidationDetails(type):
    check_names =[]
    if type != []:
        for validation in type:
            check_names.append(validation["Name"])
    return check_names

def checkDomain(domain,selector,apikey):
    result = {}
    for method in auth_methods:       
        if(method == "DKIM"):
            if(selector == ""):
                selector = "google"
            domain_url = base_url + method + "/"+ "?argument=" + domain + ":" + selector
        else:
            domain_url = base_url + method + '/' + domain  
        domain_response = requests.get(domain_url, headers= {'Authorization': apikey})
        if domain_response.status_code == 200:
                domain_response = domain_response.json()
                result[method] = {}
                failed = domain_response["Failed"]
                details =  checkValidationDetails(failed)
                result[method]["Failed"] = {}
                result[method]["Failed"]["count"] = len(details)
                if(details != []):
                    result[method]["Failed"]["details"] = details

                warnings = domain_response["Warnings"]
                details = checkValidationDetails(warnings)
                result[method]["Warnings"] = {}
                result[method]["Warnings"]["count"] = len(details)
                if(details != []):
                    result[method]["Warnings"]["details"] = details

                passed = domain_response["Passed"]
                details = checkValidationDetails(passed)     
                result[method]["Passed"] = {}
                result[method]["Passed"]["count"] = len(details)
                if(details != []):
                    result[method]["Passed"]["details"] = details
        else:
            print(f"API call failed with status code: {domain_response.status_code}")
            result = domain_response.text
    return result

def dnsLookup(domain,apikey):
    result = ""
    dns_url = base_url +  'a/' + domain 
    dns_response = requests.get(dns_url,headers= {'Authorization': apikey}) 
    if dns_response.status_code == 200:
        dns_response = dns_response.json()["Information"][0]
        domain_ip = dns_response["IP Address"]
        result = domain_ip
    else:
        print(f"API call failed with status code: {dns_response.status_code}")
        # print(dns_response.json())
    return result

def calculate_range(cidr):
    data = cidr.split("/")
    start_ip = data[0]
    num_address = pow(2,(32 - int(data[1]))) -2
    individual = start_ip.split(".")
    last = int(individual[3]) + num_address
    individual[3] = str(last)
    last_ip = ".".join(individual) 
    range = "-".join([start_ip,last_ip])
    return range

def asnLookup(asn, apikey):
    result = {}
    asn_url = base_url + 'asn/' + asn
    asn_response = requests.get(asn_url, headers={'Authorization': apikey})
    if asn_response.status_code == 200:
       asn_response = asn_response.json()
       information = asn_response["Information"]
       isp = information[0]["As Name"]
       cidr = information[0]["CIDR Range"]
       range = calculate_range(cidr)
       result["ISP"] = isp
       result["Range"] = range
    else:
        print(f"API call failed with status code: {asn_response.status_code}")
       # print(asn_response.json())
    return result