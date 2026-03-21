import sys
import os

def check():
    log_file = "backend_debug.log"
    with open(log_file, "w") as f:
        f.write("Starting backend check...\n")
        try:
            import fastapi
            f.write("fastapi imported\n")
            import uvicorn
            f.write("uvicorn imported\n")
            import pydantic
            f.write("pydantic imported\n")
            import motor
            f.write("motor imported\n")
            import jose
            f.write("jose imported\n")
            import passlib
            f.write("passlib imported\n")
            import bcrypt
            f.write("bcrypt imported\n")
            import spacy
            f.write("spacy imported\n")
            try:
                nlp = spacy.load("en_core_web_sm")
                f.write("spacy model en_core_web_sm loaded\n")
            except Exception as e:
                f.write(f"spacy model load failed: {str(e)}\n")
            
            # Try importing the app
            sys.path.append(os.path.join(os.getcwd(), "backend"))
            try:
                from app.main import app
                f.write("app.main:app imported successfully\n")
            except Exception as e:
                f.write(f"app.main:app import failed: {str(e)}\n")
                import traceback
                f.write(traceback.format_exc())
                
        except ImportError as e:
            f.write(f"ImportError: {str(e)}\n")
        except Exception as e:
            f.write(f"General Error: {str(e)}\n")

if __name__ == "__main__":
    check()
