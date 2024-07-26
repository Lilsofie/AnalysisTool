import requests

base_url = "https://api.hetrixtools.com/v2/"


def blacklistedOn(count,response):
    site_list = []
    if(count != 0):
       for site in response.json()["blacklisted_on"]:
           site_list.append(site["rbl"])
       return site_list
    return


def checkIPBlackList(ip,apikey):
    result = {}
    ip_url = f"{base_url}{apikey}/blacklist-check/ipv4/{ip}/"
    ip_response = requests.get(ip_url)
    if ip_response.status_code == 200:
        ip_blacklisted_count = ip_response.json()["blacklisted_count"]
        site_names = blacklistedOn(ip_blacklisted_count,ip_response)
        result["count"] = ip_blacklisted_count
        if(ip_blacklisted_count > 0):
            result["sites"] = site_names
        else:
            result["sites"] = "This IP address is not blacklisted"
    else:
        print(f"API call failed with status code: {ip_response.status_code}")
        result = ip_response.text
    return result

def checkHostBlackList(domain,apikey):
    result = {}
    domain_url = f"{base_url}{apikey}/blacklist-check/domain/{domain}/"
    domain_response = requests.get(domain_url)
    if domain_response.status_code == 200:
        domain_blacklisted_count = domain_response.json()["blacklisted_count"]
        site_names = blacklistedOn(domain_blacklisted_count,domain_response)
        result["count"] = domain_blacklisted_count
        if(domain_blacklisted_count > 0):    
            result["sites"] =  site_names
        else:
            result["sites"] = "This host is not blacklisted"
    else:
        print(f"API call failed with status code: {domain_response.status_code}")
        result["error"] = domain_response.text
    return result