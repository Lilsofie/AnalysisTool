from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def hello_world():
    return render_template('home.html')
@app.route("/ip")
def ip():
    return render_template('ip.html')
@app.route("/domain")
def domain():
    return render_template('domain.html')
@app.route("/url")
def url():
    return render_template('url.html')

# Check if the script is executed directly (not imported) and then run the application.
# The application will start a development server that listens on localhost:5000 by default.
if __name__ == '__main__':
    app.run(debug=True)