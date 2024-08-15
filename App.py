import asyncio
from flask import Flask, render_template,url_for,redirect,request,jsonify
from flask_wtf.csrf import CSRFProtect
from dotenv import load_dotenv
import os
import subprocess
import sys
import HetrixTools
import VirusTotal
import MxToolBox
import IPinfo

app = Flask(__name__)
csrf = CSRFProtect(app)
app.config['SECRET_KEY'] = 'Lotus_AnalysisTool' 
load_dotenv()

VIRUSTOTAL_APIKEY = os.getenv('VIRUS_TOTAL')
IPINFO_APIKEY=os.getenv('IP_INFO')
HETRIXTOOLS_APIKEY = os.getenv('HETRIX_TOOLS')
MXTOOLBOX_APIKEY = os.getenv('MX_TOOLBOX')
GOOGLEMAP_APIKEY = os.getenv('GOOGLE_MAP')

async def get_vt_report(flag,input):
    return VirusTotal.getReport(flag, input, VIRUSTOTAL_APIKEY)

async def get_geo(ip_addr):
    return IPinfo.getIPgeo(ip_addr,IPINFO_APIKEY)

async def get_ht_result(flag, input):
    if(flag == "ip"):
        return HetrixTools.checkIPBlackList(input,HETRIXTOOLS_APIKEY)
    else:
        return HetrixTools.checkHostBlackList(input, HETRIXTOOLS_APIKEY)
    
async def get_dns(domain):
    return MxToolBox.dnsLookup(domain, MXTOOLBOX_APIKEY)

async def get_asn(asn):
    return MxToolBox.asnLookup(asn, MXTOOLBOX_APIKEY)

async def get_auth(domain,selector):
    return MxToolBox.checkDomain(domain,selector,MXTOOLBOX_APIKEY)

@app.route('/', methods=["GET", "POST"])
def home():
        return render_template('home.html')
    
@app.route('/analyze_ip' , methods=['POST']) 
async def analyze_ip():
    ip_addr = request.json['ip_addr']
    try:
        result = {}
        result["IPAddr"] = ip_addr
        result["Geolocation"] = await get_geo(ip_addr)
        asn = result["Geolocation"]["Org"].split()
        asn = asn[0]
        asn_detail,vt_report,ht_result = await asyncio.gather(
            get_asn(asn),
            get_vt_report("ip",ip_addr),
            get_ht_result("ip",ip_addr)
        )

        result["VTBlacklist"] = vt_report
        result["HTBlacklist"] =ht_result
        result["ASN"] = asn_detail
        # print(result)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/ip/', defaults={'ip_address': None})
@app.route('/ip/<ip_address>') 
def ip(ip_address):
    return render_template('ip.html',apikey=GOOGLEMAP_APIKEY)

@app.route('/analyze_domain', methods=['POST'])
async def analyze_domain():
    domain_nm = request.json['domain']
    try:
        selector = ""
        result = {}
        index = domain_nm.find(":")
        if index != -1:
            domain_nm = domain_nm[:index]
            selector = domain_nm[index+1:]

        result["name"] = domain_nm
        ip_addr = await get_dns(domain_nm)
        result["IPAddr"] = ip_addr
        result["Geolocation"] = get_geo(ip_addr)
        asn = result["Geolocation"]["Org"].split()
        asn = asn[0]
        asn_detail,vt_report,ht_result,auth_details = await asyncio.gather(
            get_asn(asn),
            get_vt_report("domain",domain_nm),
            get_ht_result("domain",domain_nm),
            get_auth(domain_nm,selector)
        )
        result["VTBlacklist"] = vt_report
        result["ASN"] = asn_detail
        result["HTBlacklist"] = ht_result
        result["Authentication"] = auth_details

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
                restart_script = os.path.abspath(os.path.join(os.path.dirname(__file__), 'restart.py'))
                subprocess.Popen([sys.executable, restart_script])
                os._exit(0)
            except Exception as e:
                app.logger.error(f"Error during restart: {str(e)}")
                return jsonify({"status": "error", "message": str(e)}), 500

        # Schedule the restart after a short delay
        from threading import Thread
        Thread(target=restart).start()
        return jsonify({"status": "restarting", "message": "Server will restart shortly"}), 202

    return jsonify({"status": "error", "message": "Method not allowed"}), 405

if __name__ == '__main__':
    app.run(host='172.29.40.43', port=5000, debug=True, use_reloader=False)
    # app.run(debug=True)