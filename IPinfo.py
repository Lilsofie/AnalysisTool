import requests

base_url = "https://ipinfo.io/"


def getIPgeo(IP,apitoken):
    result = {}
    geo_url = base_url + IP + "?token=" + apitoken
    geo_response = requests.get(geo_url)
    if geo_response.status_code == 200:
        geo_response = geo_response.json()
        # print(geo_response)
        if geo_response.get("hostname") != None:
            hostname = geo_response["hostname"]
            result["Hostname"] = hostname
        else:
            result["Hostname"] = 'None'
        if geo_response.get("org") != None:
            result["Org"] = geo_response["org"]
        else:
            result["Org"] = 'None'
        result["City"] = geo_response["city"]
        result["Region"] = geo_response["region"]
        result["Country"] = geo_response["country"]
        location = geo_response["loc"].split(",")
        result["latitude"] = location[0]
        result["longitude"] = location[1]       
            
    else:
        print(f"API call failed with status code: {geo_response.status_code}")
        result = geo_response.text
    return result

