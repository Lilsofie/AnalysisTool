from flask import Flask, render_template,url_for,redirect,request,jsonify
from flask_wtf.csrf import CSRFProtect

app = Flask(__name__)
csrf = CSRFProtect(app)
app.config['SECRET_KEY'] = 'L22_h02306@' 


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
                return jsonify({"redirect_url": url_for("ip", ip_addr=input_value)})
    
            return jsonify(success=True)
   
        
        except Exception as e:
            print(f"Error processing request: {str(e)}")
            return jsonify({"error": "Internal server error"}), 500
    else:
        return render_template('home.html')

@app.route('/ip/<ip_addr>')
def ip(ip_addr):
    return render_template('ip.html', ip_addr=ip_addr)


@app.route("/domain")
def domain():
    return render_template('domain.html')

@app.route("/url")
def url():
    return render_template('url.html')

if __name__ == '__main__':
    app.run(debug=True)