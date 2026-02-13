#!/usr/bin/env python3

import requests
import json
import sys
from datetime import datetime

class DatalynAPITester:
    def __init__(self, base_url="https://smart-metrics-hub-3.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.user_id = None
        self.session = requests.Session()
        
        # Test user credentials
        self.test_email = "test@datalyn.com"
        self.test_password = "TestPass123"
        self.test_name = "Test User"

    def log_result(self, test_name, success, details=""):
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {test_name}: PASSED")
        else:
            print(f"❌ {test_name}: FAILED - {details}")

    def make_request(self, method, endpoint, data=None, expect_status=200):
        """Make HTTP request with proper headers"""
        url = f"{self.base_url}{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        if self.token:
            headers['Authorization'] = f'Bearer {self.token}'

        try:
            if method == 'GET':
                response = self.session.get(url, headers=headers, timeout=30)
            elif method == 'POST':
                response = self.session.post(url, json=data, headers=headers, timeout=30)
            elif method == 'PUT':
                response = self.session.put(url, json=data, headers=headers, timeout=30)
            
            success = response.status_code == expect_status
            
            if not success:
                print(f"Response Status: {response.status_code}")
                print(f"Response Content: {response.text[:500]}")
            
            return success, response.json() if response.status_code < 400 else response.text
            
        except requests.exceptions.Timeout:
            print(f"Request timed out for {endpoint}")
            return False, "Request timeout"
        except requests.exceptions.ConnectionError:
            print(f"Connection error for {endpoint}")
            return False, "Connection error"
        except Exception as e:
            print(f"Error making request: {str(e)}")
            return False, str(e)

    def test_signup(self):
        """Test user registration"""
        success, response = self.make_request(
            'POST', 
            '/auth/signup', 
            {
                'email': self.test_email,
                'password': self.test_password,
                'name': self.test_name
            },
            201
        )
        
        if success and isinstance(response, dict) and 'token' in response:
            self.token = response['token']
            self.user_id = response.get('user', {}).get('id')
            self.log_result("User Signup", True)
            return True
        else:
            self.log_result("User Signup", False, str(response))
            return False

    def test_login(self):
        """Test user login"""
        success, response = self.make_request(
            'POST', 
            '/auth/login', 
            {
                'email': self.test_email,
                'password': self.test_password
            }
        )
        
        if success and isinstance(response, dict) and 'token' in response:
            self.token = response['token']
            self.user_id = response.get('user', {}).get('id')
            self.log_result("User Login", True)
            return True
        else:
            self.log_result("User Login", False, str(response))
            return False

    def test_get_user_info(self):
        """Test get current user info"""
        success, response = self.make_request('GET', '/auth/me')
        
        if success and isinstance(response, dict) and 'email' in response:
            self.log_result("Get User Info", True)
            return True
        else:
            self.log_result("Get User Info", False, str(response))
            return False

    def test_dashboard_metrics(self):
        """Test dashboard metrics endpoint"""
        success, response = self.make_request('GET', '/dashboard/metrics')
        
        if success and isinstance(response, dict):
            required_fields = ['mrr', 'active_users', 'conversions', 'churn_rate', 'chart_data', 'anomalies']
            has_required_fields = all(field in response for field in required_fields)
            
            if has_required_fields:
                self.log_result("Dashboard Metrics", True)
                return True
            else:
                self.log_result("Dashboard Metrics", False, "Missing required fields")
                return False
        else:
            self.log_result("Dashboard Metrics", False, str(response))
            return False

    def test_chat_message(self):
        """Test AI chat functionality"""
        success, response = self.make_request(
            'POST', 
            '/chat/message', 
            {
                'message': 'Why did MRR drop last week?',
                'session_id': None
            }
        )
        
        if success and isinstance(response, dict) and 'session_id' in response and 'message' in response:
            message = response['message']
            if 'content' in message and 'reasoning_steps' in message:
                self.log_result("AI Chat Message", True)
                return True, response['session_id']
            else:
                self.log_result("AI Chat Message", False, "Missing content or reasoning_steps")
                return False, None
        else:
            self.log_result("AI Chat Message", False, str(response))
            return False, None

    def test_chat_history(self, session_id):
        """Test chat history retrieval"""
        if not session_id:
            self.log_result("Chat History", False, "No session_id provided")
            return False
            
        success, response = self.make_request('GET', f'/chat/history/{session_id}')
        
        if success and isinstance(response, dict) and 'messages' in response:
            self.log_result("Chat History", True)
            return True
        else:
            self.log_result("Chat History", False, str(response))
            return False

    def test_chat_sessions(self):
        """Test chat sessions endpoint"""
        success, response = self.make_request('GET', '/chat/sessions')
        
        if success and isinstance(response, dict) and 'sessions' in response:
            self.log_result("Chat Sessions", True)
            return True
        else:
            self.log_result("Chat Sessions", False, str(response))
            return False

    def test_integrations(self):
        """Test integrations list"""
        success, response = self.make_request('GET', '/integrations')
        
        if success and isinstance(response, list) and len(response) > 0:
            # Check if first integration has required fields
            first_integration = response[0]
            required_fields = ['id', 'name', 'description', 'icon', 'connected']
            has_required_fields = all(field in first_integration for field in required_fields)
            
            if has_required_fields:
                self.log_result("Integrations List", True)
                return True, first_integration['id']
            else:
                self.log_result("Integrations List", False, "Missing required fields")
                return False, None
        else:
            self.log_result("Integrations List", False, str(response))
            return False, None

    def test_integration_toggle(self, integration_id):
        """Test integration toggle"""
        if not integration_id:
            self.log_result("Integration Toggle", False, "No integration_id provided")
            return False
            
        success, response = self.make_request('POST', f'/integrations/{integration_id}/toggle')
        
        if success and isinstance(response, dict) and 'message' in response:
            self.log_result("Integration Toggle", True)
            return True
        else:
            self.log_result("Integration Toggle", False, str(response))
            return False

    def test_settings_get(self):
        """Test get user settings"""
        success, response = self.make_request('GET', '/settings')
        
        if success and isinstance(response, dict):
            required_fields = ['name', 'email', 'email_notifications', 'report_schedule']
            has_required_fields = all(field in response for field in required_fields)
            
            if has_required_fields:
                self.log_result("Get Settings", True)
                return True
            else:
                self.log_result("Get Settings", False, "Missing required fields")
                return False
        else:
            self.log_result("Get Settings", False, str(response))
            return False

    def test_settings_update(self):
        """Test update user settings"""
        success, response = self.make_request(
            'PUT', 
            '/settings', 
            {
                'name': 'Updated Test User',
                'email_notifications': False,
                'report_schedule': 'daily'
            }
        )
        
        if success and isinstance(response, dict) and 'message' in response:
            self.log_result("Update Settings", True)
            return True
        else:
            self.log_result("Update Settings", False, str(response))
            return False

    def run_all_tests(self):
        """Run all API tests"""
        print("🧪 Starting Datalyn API Testing...")
        print(f"🎯 Testing against: {self.base_url}")
        print("-" * 60)

        # Authentication tests
        print("\n📝 Authentication Tests:")
        if not self.test_signup():
            # If signup fails (user exists), try login
            if not self.test_login():
                print("❌ Cannot proceed without authentication")
                return False

        self.test_get_user_info()

        # Dashboard tests
        print("\n📊 Dashboard Tests:")
        self.test_dashboard_metrics()

        # Chat tests  
        print("\n💬 AI Chat Tests:")
        chat_success, session_id = self.test_chat_message()
        if chat_success:
            self.test_chat_history(session_id)
        self.test_chat_sessions()

        # Integration tests
        print("\n🔌 Integration Tests:")
        integrations_success, integration_id = self.test_integrations()
        if integrations_success:
            self.test_integration_toggle(integration_id)

        # Settings tests
        print("\n⚙️ Settings Tests:")
        self.test_settings_get()
        self.test_settings_update()

        # Summary
        print("\n" + "="*60)
        print("📋 TEST SUMMARY")
        print("="*60)
        print(f"Total Tests: {self.tests_run}")
        print(f"Passed: {self.tests_passed}")
        print(f"Failed: {self.tests_run - self.tests_passed}")
        success_rate = (self.tests_passed / self.tests_run * 100) if self.tests_run > 0 else 0
        print(f"Success Rate: {success_rate:.1f}%")
        
        if success_rate >= 80:
            print("🎉 Backend APIs are working well!")
            return True
        else:
            print("⚠️ Some backend issues need attention")
            return False

if __name__ == "__main__":
    tester = DatalynAPITester()
    success = tester.run_all_tests()
    sys.exit(0 if success else 1)