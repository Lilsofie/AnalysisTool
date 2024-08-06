import subprocess
import time
import signal

def run_flask_app():
    print("Starting Flask app...")
    process = subprocess.Popen(["python", "App.py"])
    # Wait for a restart signal
    try:
        process.wait()
    except KeyboardInterrupt:
        print("Restarting Flask app...")
        process.send_signal(signal.SIGTERM)
        process.wait()
        time.sleep(1)  # Wait a bit before restarting

if __name__ == "__main__":
    run_flask_app()