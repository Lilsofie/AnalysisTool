This is a simple version of analysis tool which helps analyze an IP address, Domain, or an URL.

Run : python app.py
Site: http://172.29.33.84:5000/

What it shows:
1. Geolocation of the IP address/Domain with dynamic google map display
2. ASN data including ISP and IP range
3. Hostname and Organization
4. Blacklist search result from two cybersecurity resources : Hetrix Tools & VirusTotal
    Hetrix Tools : shows the number of hosts marking the target as blacklisted with details displayed/in tooltips
    VirusTotal : provide the number of hosts marking the target to be malicious/ suspicious/ clear with details for malicious and suspicious in tooltips
5. For Domain analysis, DMARC, DKIM and SPF analysis will also be provided.
   Note: Input value for Domain analysis is in the format "Domain:(Selector)" where the selector having google as default if not provided 

