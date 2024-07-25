import requests

base_url = "https://ipinfo.io/"


def getIPgeo(IP,apitoken):
    result = ""
    geo_url = base_url + IP + "?token=" + apitoken
    geo_response = requests.get(geo_url)
    if geo_response.status_code == 200:
       geo_response = geo_response.json()
       if "hostname" in geo_response:
            hostname = geo_response["hostname"]
            result +=(f"Hostname: {hostname}\n")
       city = geo_response["city"]
       region = geo_response["region"]
       country = geo_response["country"]
       organization = geo_response["org"]
    
       result +=(f"City: {city}\n")
       result +=(f"Region: {region}\n")
       result +=(f"Country: {country}\n")
       result +=(f"Organization: {organization}\n")

    else:
        print(f"API call failed with status code: {geo_response.status_code}")
        result = geo_response.text
    return result

