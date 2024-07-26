import requests

base_url = "https://ipinfo.io/"


def getIPgeo(IP,apitoken):
    result = {}
    geo_url = base_url + IP + "?token=" + apitoken
    geo_response = requests.get(geo_url)
    if geo_response.status_code == 200:
       geo_response = geo_response.json()
       if "hostname" in geo_response:
            hostname = geo_response["hostname"]
            result["Hostname"] = hostname
       else:
           result["Hostname"] = ""
       result["City"] = geo_response["city"]
       result["Region"] = geo_response["region"]
       result["Country"] = geo_response["country"]
       result["Org"] =  geo_response["org"]
       result["location"] = geo_response["loc"]

    else:
        print(f"API call failed with status code: {geo_response.status_code}")
        result = geo_response.text
    return result

