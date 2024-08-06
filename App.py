import subprocess
import sys
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

@app.route('/', methods=["GET", "POST"])
def home():
        return render_template('home.html')
    
@app.route('/analyze_ip' , methods=['POST']) 
def analyze_ip():
    ip_addr = request.json['ip_addr']
    try:
        result = {}
        result["IPAddr"] = ip_addr
        result["VTBlacklist"] = VirusTotal.getReport('ip',ip_addr,VIRUSTOTAL_APIKEY)
        result["Geolocation"] = IPinfo.getIPgeo(ip_addr,IPINFO_APIKEY)
        result["HTBlacklist"] = HetrixTools.checkIPBlackList(ip_addr,HETRIXTOOLS_APIKEY)
        asn = result["Geolocation"]["Org"].split()
        asn = asn[0]
        result["ASN"] = MxToolBox.asnLookup(asn,MXTOOLBOX_APIKEY)
        # print(result)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/ip/', defaults={'ip_address': None})
@app.route('/ip/<ip_address>') 
def ip(ip_address):
    return render_template('ip.html',apikey=GOOGLEMAP_APIKEY)

@app.route('/analyze_domain', methods=['POST'])
def analyze_domain():
    domain_nm = request.json['domain']
    try:
        selector = ""
        result = {}
        index = domain_nm.find(":")
        if index != -1:
            domain_nm = domain_nm[:index]
            selector = domain_nm[index+1:]
        result["VTBlacklist"] = VirusTotal.getReport('domain',domain_nm,VIRUSTOTAL_APIKEY)
        result["IPAddr"] = MxToolBox.dnsLookup(domain_nm,MXTOOLBOX_APIKEY)
        ip_addr = result["IPAddr"]
        result["Geolocation"] = IPinfo.getIPgeo(ip_addr,IPINFO_APIKEY)
        asn = result["Geolocation"]["Org"][0:7]
        result["ASN"] = MxToolBox.asnLookup(asn,MXTOOLBOX_APIKEY)
        result["HTBlacklist"] = HetrixTools.checkHostBlackList(domain_nm,HETRIXTOOLS_APIKEY)
        result["Authentication"] = MxToolBox.checkDomain(domain_nm,selector,MXTOOLBOX_APIKEY)
        result["name"] = domain_nm
        # print(result)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/domain/', defaults={'domain_name': None})
@app.route("/domain/<domain_name>")
def domain(domain_name):
    return render_template('domain.html',apikey=GOOGLEMAP_APIKEY)


@app.route('/scan_url', methods=['POST'])
def scan_url():
    data = request.json
    input_url = data['url']
    try:
        result = VirusTotal.scanUrl(input_url, VIRUSTOTAL_APIKEY)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/analyze_url', methods=['POST'])
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

@app.route('/restart', methods=['POST'])
def restart_server():
    if request.method == 'POST':
        # Terminate the current process
        def restart():
            print("Restarting server...")
            try:
                # Get the path to the restart script
                restart_script = os.path.abspath(os.path.join(os.path.dirname(__file__), 'restart.py'))
                
                # Start the restart script
                subprocess.Popen([sys.executable, restart_script])
                
                # Shut down the current Flask server
                os._exit(0)
            except Exception as e:
                app.logger.error(f"Error during restart: {str(e)}")
                return jsonify({"status": "error", "message": str(e)}), 500

                # This error won't be sent to the client because
                # the server will stop shortly

        # Schedule the restart after a short delay
        from threading import Thread
        Thread(target=restart).start()
        return jsonify({"status": "restarting", "message": "Server will restart shortly"}), 202

    return jsonify({"status": "error", "message": "Method not allowed"}), 405

if __name__ == '__main__':
    app.run(host='172.29.33.84', port=5000, debug=True, use_reloader=False)
    # app.run(debug=True)