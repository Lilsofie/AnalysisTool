import requests

base_url = "https://www.virustotal.com/api/v3/" 


# get ip address report
def getIP(input_ip,apikey):
    result = {}
    ip_url = base_url+'ip_addresses/'+ input_ip
    ip_response = requests.get(ip_url, headers={
        "accept": "application/json",
        "x-apikey": apikey
}   )
    if ip_response.status_code == 200:
        ip_response = ip_response.json()
        ip_response = ip_response['data']['attributes']['last_analysis_stats']
        for type in ip_response:
            result[type] = ip_response[type]
        if ip_response['malicious'] > 0 or ip_response['suspicious'] > 0:
            result["text"] = f"Be careful with IP address: {input_ip}\n"
        
        else:
            result["text"] = f"IP address: {input_ip} is clean!\n"        
        return result
    else:
        print(f"API call failed with status code: {ip_response.status_code}\n")
        result = ip_response.text
    return result

# analyze URL
def analyzeUrl(analysis_id,headers):
    analysis_url = base_url + 'analyses/' + analysis_id
    analysis_response = requests.get(analysis_url, headers=headers  )
    
    if analysis_response.status_code == 200:
        print(analysis_response.json())
        analysis_response = analysis_response.json()['data']['attributes']['stats']
        return analysis_response
    else:
        print(f"API call failed with status code: {analysis_response.status_code}")
        return analysis_response.text
 


#scan URL
def scanUrl(input_url,apikey):
    result = ""
    payload = { "url": input_url }
    headers = {
        "accept": "application/json",
        "x-apikey": apikey,
        "conent-type":"application/x-www-form-urlencoded"
    }   

    scan_url = base_url+'urls'
    url_response = requests.post(scan_url, data=payload, headers=headers)

    if url_response.status_code == 200:
        analysis_id = url_response.json()['data']['id']
        del headers["conent-type"]
        result =  analyzeUrl(analysis_id,apikey,headers)
    else:
        print(f"API call failed with status code: {url_response.status_code}")
        result = url_response.text 
    return result
