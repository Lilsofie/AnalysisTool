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
    'VTBlacklist': {'severity': '', 'stats': {'malicious': {'count': 0, 'details': []}, 'suspicious': {'count': 0, 'details': []}, 'undetected': 0, 'harmless':0, 'timeout': 0}}, 
    'Geolocation': {'Hostname': '', 'City': '', 'Region': '', 'Country': '', 'Org': '', 'latitude': '', 'longitude': ''}, 
    'HTBlacklist': {'count': 0, 'sites': ['']}, 
    'ASN': {'ISP': '', 'Range': ''}}

DEFAULT_DOMAIN_DATA = {'IP Addr': '',
                       'VTBlacklist': {'severity': '', 'stats': {'malicious': {'count': 0, 'details': []}, 'suspicious': {'count': 0, 'details': []}, 'undetected': 0, 'harmless':0, 'timeout': 0}}, 
                        'Geolocation': {'Hostname': '', 'City': '', 'Region': '', 'Country': '', 'Org': '', 'latitude': '', 'longitude': ''}, 
                        'ASN': {'ISP': '', 'Range': ''}, 
                        'HTBlacklist': {'count': 0, 'sites': []},
                        'Authentication': {'DMARC': {'Failed': {'count':0, 'details': []}, 'Warnings': {'count':0, 'details': []}, 'Passed': {'count':1, 'details': []}}, 
                                           'DKIM': {'Failed': {'count':0, 'details': []}, 'Warnings': {'count':1, 'details': []}, 'Passed': {'count':0, 'details': []}}, 
                                           'SPF': {'Failed': {'count':1, 'details': []}, 'Warnings': {'count':0, 'details': []}, 'Passed': {'count':0, 'details': []}}}}
DEFAULT_URL_DATA = {'id': '', 'stats': {'malicious': {'count': 0, 'details': []}, 'suspicious': {'count': 0, 'details': []}, 'undetected': 0, 'harmless': 0, 'timeout': 0}}
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
    result["VTBlacklist"] = VirusTotal.getReport('ip',ip_addr,VIRUSTOTAL_APIKEY)
    result["Geolocation"] = IPinfo.getIPgeo(ip_addr,IPINFO_APIKEY)
    result["HTBlacklist"] = HetrixTools.checkIPBlackList(ip_addr,HETRIXTOOLS_APIKEY)
    asn = result["Geolocation"]["Org"].split()
    asn = asn[0]
    result["ASN"] = MxToolBox.asnLookup(asn,MXTOOLBOX_APIKEY)
    print(result)
    return result


@app.route('/domain/', defaults={'domain_name': None})
@app.route("/domain/<domain_name>")
def domain(domain_name):
    result = DEFAULT_DOMAIN_DATA
    if domain_name:
         if(domain_name != "..."):
            result = run_domain_analysis(domain_name)
    return render_template('domain.html',domain_name=domain_name,data=result, apikey=GOOGLEMAP_APIKEY)

def run_domain_analysis(domain_nm):
    selector = ""
    result = {}
    index = domain_nm.find(":")
    if index != -1:
        domain_nm = domain_nm[:index]
        selector = domain_nm[index+1:]
    result["VTBlacklist"] = VirusTotal.getReport('domain',domain_nm,VIRUSTOTAL_APIKEY)
    result["IP Addr"] = MxToolBox.dnsLookup(domain_nm,MXTOOLBOX_APIKEY)
    ip_addr = result["IP Addr"]
    result["Geolocation"] = IPinfo.getIPgeo(ip_addr,IPINFO_APIKEY)
    asn = result["Geolocation"]["Org"][0:7]
    result["ASN"] = MxToolBox.asnLookup(asn,MXTOOLBOX_APIKEY)
    result["HTBlacklist"] = HetrixTools.checkHostBlackList(domain_nm,HETRIXTOOLS_APIKEY)
    result["Authentication"] = MxToolBox.checkDomain(domain_nm,selector,MXTOOLBOX_APIKEY)
    print(result)
    return result


@app.route('/scan_url', methods=['POST'])
def scan_url():
    data = request.json
    input_url = data['url']
    try:
        result = VirusTotal.scanUrl(input_url, VIRUSTOTAL_APIKEY)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/analyze_url', methods=['GET', 'POST'])
def analyze_url():
    data = request.json
    try:
        result = VirusTotal.analyzeUrl(data, VIRUSTOTAL_APIKEY)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/url/', defaults={'id':''})
@app.route("/url/<id>")
def url(id):
    return render_template('url.html')


if __name__ == '__main__':
    app.run(host='172.29.33.84', port=5000, debug=True, threaded=False)