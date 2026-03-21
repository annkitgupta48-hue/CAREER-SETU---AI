import subprocess
import os
import sys
import time

def run():
    backend_dir = r"c:\Users\sachi\OneDrive\Desktop\career-setu\CAREER-SETU---AI\CAREER SETU\backend"
    venv_python = r"c:\Users\sachi\OneDrive\Desktop\career-setu\CAREER-SETU---AI\CAREER SETU\.venv\Scripts\python.exe"
    log_file = r"c:\Users\sachi\OneDrive\Desktop\career-setu\CAREER-SETU---AI\CAREER SETU\backend_startup.log"
    
    with open(log_file, "w") as f:
        f.write(f"Starting backend at {time.ctime()}\n")
        f.flush()
        try:
            # Use -u for unbuffered output
            process = subprocess.Popen(
                [venv_python, "-u", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"],
                cwd=backend_dir,
                stdout=f,
                stderr=f,
                text=True,
                env=os.environ.copy()
            )
            f.write(f"Process started with PID: {process.pid}\n")
            f.flush()
            
            # Wait a few seconds and check if it's still alive
            time.sleep(10)
            if process.poll() is not None:
                f.write(f"Process exited with code: {process.returncode}\n")
            else:
                f.write("Process is still running after 10s\n")
            f.flush()
        except Exception as e:
            f.write(f"Exception during startup: {str(e)}\n")
            import traceback
            f.write(traceback.format_exc())

if __name__ == "__main__":
    run()
