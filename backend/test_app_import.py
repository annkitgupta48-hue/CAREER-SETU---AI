import traceback

try:
    from app.main import app
    with open("import_test_result.txt", "w") as f:
        f.write("Successfully imported app.main:app\n")
except Exception as e:
    with open("import_test_result.txt", "w") as f:
        f.write(f"Error importing app.main:app:\n{traceback.format_exc()}\n")
