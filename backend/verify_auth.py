import requests
import json
import time

BASE_URL = "http://localhost:8000" # Testing short paths

def test_full_cycle():
    print("🚀 Starting Career Setu - AI Integration Test...")
    
    # 1. Register a test worker
    test_user = {
        "name": "Test Worker",
        "email": f"test_worker_{int(time.time())}@example.com",
        "phone": f"98765{int(time.time()) % 100000:05d}",
        "password": "Password123!",
        "location": "Mumbai, Maharashtra",
        "role": "worker",
        "skills": ["Plumbing", "Electrical"],
        "otp": "123567" # Testing bypass
    }
    
    print(f"\n📝 1. Registering User: {test_user['email']}...")
    try:
        reg_res = requests.post(f"{BASE_URL}/auth/register", json=test_user)
        reg_res.raise_for_status()
        print("✅ Registration Successful!")
    except Exception as e:
        print(f"❌ Registration Failed: {e}")
        return

    # 2. Login
    print(f"\n🔑 2. Logging in as {test_user['email']}...")
    login_data = {"email": test_user["email"], "password": test_user["password"]}
    try:
        login_res = requests.post(f"{BASE_URL}/auth/login", json=login_data)
        login_res.raise_for_status()
        token = login_res.json()["access_token"]
        print("✅ Login Successful! Received Token.")
    except Exception as e:
        print(f"❌ Login Failed: {e}")
        return

    # 3. Fetch Profile
    print("\n👤 3. Fetching Profile using JWT...")
    headers = {"Authorization": f"Bearer {token}"}
    try:
        profile_res = requests.get(f"{BASE_URL}/api/profile", headers=headers)
        profile_res.raise_for_status()
        print("✅ Profile Fetched Successfully from MongoDB!")
        print(json.dumps(profile_res.json(), indent=2))
    except Exception as e:
        print(f"❌ Profile Fetch Failed: {e}")
        return

    print("\n✨ Integration Test Complete! Data is safely stored in your local MongoDB.")

if __name__ == "__main__":
    test_full_cycle()
