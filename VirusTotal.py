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

# get report
def getReport(flag,input,apikey):
    headers = {
        "accept": "application/json",
        "x-apikey": apikey
    }
    result = {}
    if flag == 'ip':
        url = base_url+'ip_addresses/'+ input
    elif flag == 'domain':
        url = base_url + 'domains/' + input
    response = requests.get(url, headers=headers )
    if response.status_code == 200:
        response = response.json()
        # print(response)
        attributes = response['data']['attributes']
        stats = attributes['last_analysis_stats']
        results = attributes['last_analysis_results']
        stats['malicious'] = getInfoDetails('malicious', results,stats)
        stats['suspicious'] = getInfoDetails('suspicious', results,stats)
        if attributes.get('crowdsourced_context') != None:
            result['severity'] = attributes['crowdsourced_context'][0]['severity']
        else:
            result['severity'] = 'None'
        result['stats'] = stats
    else:
        print(f"API call failed with status code: {response.status_code}\n")
        result = response.text
    return result


# analyze URL
def analyzeUrl(data,apikey):
    headers = {
        "accept": "application/json",
        "x-apikey": apikey,
    }   
    analysis_url = base_url + 'analyses/' + data['id']
    analysis_response = requests.get(analysis_url, headers=headers)
    if analysis_response.status_code == 200:
        attribues = analysis_response.json()['data']['attributes']
        analysis_stats = attribues['stats']
        analysis_results = attribues['results']
        analysis_stats['malicious'] = getInfoDetails('malicious',analysis_results,analysis_stats)
        analysis_stats['suspicious'] = getInfoDetails('suspicious',analysis_results,analysis_stats)
        data['stats'] = analysis_stats 
    else:
        print(f"API call failed with status code: {analysis_response.status_code}")
        print(analysis_response.text)
    return data


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
        # print(analysis_id)
        return {"id": analysis_id, "url": input_url}
    else:
        print(f"API call failed with status code: {url_response.status_code}")
        print(url_response.text )
        return {}
