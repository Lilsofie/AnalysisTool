import requests

base_url = "https://www.virustotal.com/api/v3/" 

def getInfoDetails(category,data,stats):
    result = {}
    details = []
    if stats[category] != 0:
         for name,detail in data.items():
            if detail['category'] == category:
               details.append(detail['engine_name'])
    result['count'] = stats[category]
    result['details'] = details
    return result

# get ip address report
def getIP(input_ip,apikey):
    result = {}
    ip_url = base_url+'ip_addresses/'+ input_ip
    ip_response = requests.get(ip_url, headers={
        "accept": "application/json",
        "x-apikey": apikey
    } )
    if ip_response.status_code == 200:
        ip_response = ip_response.json()
        attributes = ip_response['data']['attributes']
        ip_stats = attributes['last_analysis_stats']
        ip_results = attributes['last_analysis_results']
        ip_stats['malicious'] = getInfoDetails('malicious', ip_results,ip_stats)
        ip_stats['suspicious'] = getInfoDetails('suspicious', ip_results,ip_stats)
        result['severity'] = attributes['crowdsourced_context'][0]['severity']
        result['stats'] = ip_stats
        print(result)
    else:
        print(f"API call failed with status code: {ip_response.status_code}\n")
        result = ip_response.text
    return result


# analyze URL
def analyzeUrl(analysis_id,headers):
    result = {}
    result['id'] = analysis_id
    analysis_url = base_url + 'analyses/' + analysis_id
    analysis_response = requests.get(analysis_url, headers=headers)
    if analysis_response.status_code == 200:
        attribues = analysis_response.json()['data']['attributes']
        analysis_stats = attribues['stats']
        analysis_results = attribues['results']
        analysis_stats['malicious'] = getInfoDetails('malicious',analysis_results,analysis_stats)
        analysis_stats['suspicious'] = getInfoDetails('suspicious',analysis_results,analysis_stats)
        result['stats'] = analysis_stats 
        print(result)
    else:
        print(f"API call failed with status code: {analysis_response.status_code}")
        print(analysis_response.text)
    return result


#scan URL
def scanUrl(input_url,apikey):
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
        return analyzeUrl(analysis_id,headers)
    else:
        print(f"API call failed with status code: {url_response.status_code}")
        print(url_response.text )
        return {}
