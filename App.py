from flask import Flask, render_template,url_for,redirect,request,jsonify
from flask_wtf.csrf import CSRFProtect
from dotenv import load_dotenv
import os
import HetrixTools
import VirusTotal
import MxToolBox
import IPinfo

app = Flask(__name__)
csrf = CSRFProtect(app)
app.config['SECRET_KEY'] = 'L22_h02306@' 
load_dotenv()

VIRUSTOTAL_APIKEY = os.getenv('VIRUS_TOTAL')
IPINFO_APIKEY=os.getenv('IP_INFO')
HETRIXTOOLS_APIKEY = os.getenv('HETRIX_TOOLS')
MXTOOLBOX_APIKEY = os.getenv('MX_TOOLBOX')
GOOGLEMAP_APIKEY = os.getenv('GOOGLE_MAP')

DEFAULT_IP_DATA = {
    'VirusTotal': {'malicious': 0, 'suspicious': 0, 'undetected': 0, 'harmless': 0, 'timeout': 0, 'text': ''}, 
    'IP info': {'Hostname': '', 'City': '', 'Region': '', 'Country': '', 'Org': '', 'latitude': '', 'longtitude': ''}, 
    'HetrixTools': {'count': 0, 'sites': ''}, 
    'MxToolBox': {'ISP': '', 'Range': ''}
}

@app.route('/', methods=["GET", "POST"])
def home():
    if request.method == "POST":
        try:
            data = request.json
            if data is None:
                return jsonify({"error": "No JSON data received"}), 400
            
            input_value = data.get('inputValue')
            dropdown_value = data.get('dropdownValue')
            if not input_value or not dropdown_value:
                return jsonify({"error": "Missing input value or type"}), 400
            
            if dropdown_value == "IP":
                return jsonify({"redirect_url": url_for("ip", ip_address=input_value)})
            if dropdown_value == "Domain":
                return jsonify({"redirect_url": url_for("domain", domain_name=input_value)})
            return jsonify(success=True)
   
        
        except Exception as e:
            print(f"Error processing request: {str(e)}")
            return jsonify({"error": "Internal server error"}), 500
    else:
        return render_template('home.html')
    
@app.route('/ip/', defaults={'ip_address': None})
@app.route('/ip/<ip_address>') 
def ip(ip_address):
    result = DEFAULT_IP_DATA
    if ip_address:
         if(ip_address != "..."):
            result = run_ip_analysis(ip_address)
    return render_template('ip.html',ip_addr=ip_address,data=result, apikey=GOOGLEMAP_APIKEY)

def run_ip_analysis(ip_addr):
    result = {}
    result["VirusTotal"] = VirusTotal.getIP(ip_addr,VIRUSTOTAL_APIKEY)
    result["IP info"] = IPinfo.getIPgeo(ip_addr,IPINFO_APIKEY)
    result["HetrixTools"] = HetrixTools.checkIPBlackList(ip_addr,HETRIXTOOLS_APIKEY)
    asn = result["IP info"]["Org"][0:7]
    result["MxToolBox"] = MxToolBox.asnLookup(asn,MXTOOLBOX_APIKEY)
    print(result)
    return result


@app.route('/domain/', defaults={'domain_name': ""})
@app.route("/domain/<domain_name>")
def domain(domain_name):
    return render_template('domain.html', domain_name=domain_name)

@app.route("/url")
def url():
    return render_template('url.html')

if __name__ == '__main__':
    app.run(debug=True)