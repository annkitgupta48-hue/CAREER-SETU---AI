import os
import sys

log_path = r"c:\Users\sachi\OneDrive\Desktop\career-setu\CAREER-SETU---AI\CAREER SETU\exec_test.log"

with open(log_path, "w") as f:
    f.write("Script started\n")
    f.write(f"Python: {sys.executable}\n")
    f.write(f"CWD: {os.getcwd()}\n")
    f.write("Script finished\n")
