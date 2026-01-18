#!/usr/bin/env python3
"""
Complete system test script for Smart Blood & Organ Donation Management System
Tests all components, APIs, and workflows
"""
import requests
import json
import time
from typing import Dict, Any

BASE_URL = "http://127.0.0.1:8000"
API_PREFIX = f"{BASE_URL}/api"

# Test data
test_user_donor = {
    "email": "donor_test@example.com",
    "password": "TestPassword123!",
    "role": "donor"
}

test_user_hospital = {
    "email": "hospital_test@example.com",
    "password": "TestPassword123!",
    "role": "hospital"
}

test_donor = {
    "name": "John Doe",
    "age": 35,
    "blood_group": "O+",
    "organ": "Kidney",
    "phone": "+911234567890",
    "location": "Bengaluru"
}

test_hospital = {
    "hospital_name": "City Medical Center",
    "city": "Bengaluru",
    "contact_number": "+919876543210"
}

test_request = {
    "blood_group": "O+",
    "organ": "Kidney",
    "urgency": "high"
}

class SystemTester:
    def __init__(self):
        self.donor_token = None
        self.hospital_token = None
        self.donor_id = None
        self.hospital_id = None
        self.request_id = None
        self.results = []
    
    def print_header(self, text: str):
        print(f"\n{'='*60}")
        print(f"  {text}")
        print(f"{'='*60}\n")
    
    def test_health_check(self):
        """Test API health"""
        self.print_header("1. HEALTH CHECK")
        try:
            resp = requests.get(f"{API_PREFIX}/health", timeout=5)
            if resp.status_code == 404:
                # Try without /api prefix
                resp = requests.get(f"{BASE_URL}/health", timeout=5)
            
            print(f"Status: {resp.status_code}")
            print(f"Response: {resp.text}")
            
            if resp.status_code == 200:
                print("✅ Health check PASSED")
                self.results.append(("Health Check", "PASSED"))
            else:
                print(f"⚠️  Unexpected status code: {resp.status_code}")
                self.results.append(("Health Check", "PARTIAL"))
        except Exception as e:
            print(f"❌ Health check FAILED: {e}")
            self.results.append(("Health Check", "FAILED"))
    
    def test_register_donor(self):
        """Register a donor user"""
        self.print_header("2. REGISTER DONOR USER")
        try:
            resp = requests.post(
                f"{API_PREFIX}/auth/register",
                json=test_user_donor,
                timeout=5
            )
            print(f"Status: {resp.status_code}")
            print(f"Response: {resp.json()}")
            
            if resp.status_code == 201:
                print("✅ Donor registration PASSED")
                self.results.append(("Register Donor", "PASSED"))
                return True
            else:
                print(f"❌ Registration failed: {resp.text}")
                self.results.append(("Register Donor", "FAILED"))
                return False
        except Exception as e:
            print(f"❌ Registration FAILED: {e}")
            self.results.append(("Register Donor", "FAILED"))
            return False
    
    def test_register_hospital(self):
        """Register a hospital user"""
        self.print_header("3. REGISTER HOSPITAL USER")
        try:
            resp = requests.post(
                f"{API_PREFIX}/auth/register",
                json=test_user_hospital,
                timeout=5
            )
            print(f"Status: {resp.status_code}")
            print(f"Response: {resp.json()}")
            
            if resp.status_code == 201:
                print("✅ Hospital registration PASSED")
                self.results.append(("Register Hospital", "PASSED"))
                return True
            else:
                print(f"❌ Registration failed: {resp.text}")
                self.results.append(("Register Hospital", "FAILED"))
                return False
        except Exception as e:
            print(f"❌ Registration FAILED: {e}")
            self.results.append(("Register Hospital", "FAILED"))
            return False
    
    def test_login_donor(self):
        """Login donor and get token"""
        self.print_header("4. LOGIN DONOR & GET TOKEN")
        try:
            data = {
                "username": test_user_donor["email"],
                "password": test_user_donor["password"]
            }
            resp = requests.post(
                f"{API_PREFIX}/auth/token",
                data=data,
                timeout=5
            )
            print(f"Status: {resp.status_code}")
            print(f"Response: {resp.json()}")
            
            if resp.status_code == 200:
                self.donor_token = resp.json()["access_token"]
                print(f"✅ Donor login PASSED")
                print(f"   Token: {self.donor_token[:50]}...")
                self.results.append(("Login Donor", "PASSED"))
                return True
            else:
                print(f"❌ Login failed: {resp.text}")
                self.results.append(("Login Donor", "FAILED"))
                return False
        except Exception as e:
            print(f"❌ Login FAILED: {e}")
            self.results.append(("Login Donor", "FAILED"))
            return False
    
    def test_login_hospital(self):
        """Login hospital and get token"""
        self.print_header("5. LOGIN HOSPITAL & GET TOKEN")
        try:
            data = {
                "username": test_user_hospital["email"],
                "password": test_user_hospital["password"]
            }
            resp = requests.post(
                f"{API_PREFIX}/auth/token",
                data=data,
                timeout=5
            )
            print(f"Status: {resp.status_code}")
            print(f"Response: {resp.json()}")
            
            if resp.status_code == 200:
                self.hospital_token = resp.json()["access_token"]
                print(f"✅ Hospital login PASSED")
                print(f"   Token: {self.hospital_token[:50]}...")
                self.results.append(("Login Hospital", "PASSED"))
                return True
            else:
                print(f"❌ Login failed: {resp.text}")
                self.results.append(("Login Hospital", "FAILED"))
                return False
        except Exception as e:
            print(f"❌ Login FAILED: {e}")
            self.results.append(("Login Hospital", "FAILED"))
            return False
    
    def test_create_donor_profile(self):
        """Create donor profile"""
        self.print_header("6. CREATE DONOR PROFILE")
        if not self.donor_token:
            print("❌ No donor token available")
            self.results.append(("Create Donor Profile", "FAILED"))
            return False
        
        try:
            headers = {"Authorization": f"Bearer {self.donor_token}"}
            resp = requests.post(
                f"{API_PREFIX}/donors/",
                json=test_donor,
                headers=headers,
                timeout=5
            )
            print(f"Status: {resp.status_code}")
            print(f"Response: {resp.json()}")
            
            if resp.status_code == 201:
                self.donor_id = resp.json()["id"]
                print(f"✅ Donor profile creation PASSED (ID: {self.donor_id})")
                self.results.append(("Create Donor Profile", "PASSED"))
                return True
            else:
                print(f"❌ Creation failed: {resp.text}")
                self.results.append(("Create Donor Profile", "FAILED"))
                return False
        except Exception as e:
            print(f"❌ Creation FAILED: {e}")
            self.results.append(("Create Donor Profile", "FAILED"))
            return False
    
    def test_list_donors(self):
        """List all donors"""
        self.print_header("7. LIST ALL DONORS")
        try:
            resp = requests.get(
                f"{API_PREFIX}/donors/",
                timeout=5
            )
            print(f"Status: {resp.status_code}")
            data = resp.json()
            print(f"Response (first 2 items): {json.dumps(data[:2], indent=2) if isinstance(data, list) else data}")
            
            if resp.status_code == 200:
                print(f"✅ List donors PASSED (Found {len(data) if isinstance(data, list) else 'N/A'} donors)")
                self.results.append(("List Donors", "PASSED"))
                return True
            else:
                print(f"❌ List failed: {resp.text}")
                self.results.append(("List Donors", "FAILED"))
                return False
        except Exception as e:
            print(f"❌ List FAILED: {e}")
            self.results.append(("List Donors", "FAILED"))
            return False
    
    def test_create_donation_request(self):
        """Create donation request"""
        self.print_header("8. CREATE DONATION REQUEST")
        if not self.hospital_token:
            print("❌ No hospital token available")
            self.results.append(("Create Donation Request", "FAILED"))
            return False
        
        try:
            headers = {"Authorization": f"Bearer {self.hospital_token}"}
            resp = requests.post(
                f"{API_PREFIX}/requests/",
                json=test_request,
                headers=headers,
                timeout=5
            )
            print(f"Status: {resp.status_code}")
            print(f"Response: {resp.json()}")
            
            if resp.status_code == 201:
                self.request_id = resp.json()["id"]
                print(f"✅ Donation request creation PASSED (ID: {self.request_id})")
                self.results.append(("Create Donation Request", "PASSED"))
                return True
            else:
                print(f"❌ Creation failed: {resp.text}")
                self.results.append(("Create Donation Request", "FAILED"))
                return False
        except Exception as e:
            print(f"❌ Creation FAILED: {e}")
            self.results.append(("Create Donation Request", "FAILED"))
            return False
    
    def test_match_donors(self):
        """Test AI matching algorithm"""
        self.print_header("9. TEST AI MATCHING ALGORITHM")
        try:
            payload = {
                "blood_group": "O+",
                "organ": "Kidney",
                "urgency": "high"
            }
            resp = requests.post(
                f"{API_PREFIX}/requests/match",
                json=payload,
                timeout=5
            )
            print(f"Status: {resp.status_code}")
            data = resp.json()
            print(f"Response: {json.dumps(data[:2] if isinstance(data, list) else data, indent=2)}")
            
            if resp.status_code == 200:
                matches = data if isinstance(data, list) else []
                print(f"✅ Matching PASSED (Found {len(matches)} matches)")
                self.results.append(("AI Matching", "PASSED"))
                return True
            else:
                print(f"⚠️  Matching returned: {resp.status_code}")
                self.results.append(("AI Matching", "PARTIAL"))
                return False
        except Exception as e:
            print(f"⚠️  Matching test: {e}")
            self.results.append(("AI Matching", "FAILED"))
            return False
    
    def print_summary(self):
        """Print test results summary"""
        self.print_header("TEST RESULTS SUMMARY")
        
        passed = sum(1 for _, status in self.results if status == "PASSED")
        partial = sum(1 for _, status in self.results if status == "PARTIAL")
        failed = sum(1 for _, status in self.results if status == "FAILED")
        
        print(f"{'Test Name':<30} {'Status':<15}")
        print("-" * 45)
        for test_name, status in self.results:
            symbol = "✅" if status == "PASSED" else "⚠️ " if status == "PARTIAL" else "❌"
            print(f"{test_name:<30} {symbol} {status:<12}")
        
        print("-" * 45)
        print(f"{'TOTAL':<30} Passed: {passed}, Partial: {partial}, Failed: {failed}")
        print(f"{'Success Rate':<30} {(passed / len(self.results) * 100):.1f}%")
    
    def run_all_tests(self):
        """Run all tests"""
        print("\n\n")
        print("█" * 60)
        print("█  SMART BLOOD & ORGAN DONATION SYSTEM - COMPLETE TEST SUITE")
        print("█" * 60)
        
        self.test_health_check()
        time.sleep(0.5)
        
        if self.test_register_donor():
            time.sleep(0.5)
            self.test_login_donor()
            time.sleep(0.5)
            self.test_create_donor_profile()
            time.sleep(0.5)
        
        if self.test_register_hospital():
            time.sleep(0.5)
            self.test_login_hospital()
            time.sleep(0.5)
            self.test_create_donation_request()
            time.sleep(0.5)
        
        self.test_list_donors()
        time.sleep(0.5)
        self.test_match_donors()
        
        self.print_summary()


if __name__ == "__main__":
    tester = SystemTester()
    tester.run_all_tests()
