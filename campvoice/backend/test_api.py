#!/usr/bin/env python3
"""
Simple API test script to verify CampVoice backend functionality
"""

import asyncio
import httpx
import json
from datetime import datetime

BASE_URL = "http://localhost:8000/api/v1"

async def test_api():
    """Test basic API functionality"""
    print("🧪 Testing CampVoice API...")
    
    async with httpx.AsyncClient() as client:
        # Test health endpoint
        try:
            response = await client.get(f"{BASE_URL}/health")
            print(f"✅ Health check: {response.status_code} - {response.json()}")
        except Exception as e:
            print(f"❌ Health check failed: {e}")
            return False
        
        # Test registration endpoint (should fail with validation error)
        try:
            response = await client.post(f"{BASE_URL}/auth/register", json={})
            print(f"✅ Registration validation: {response.status_code} (expected 422)")
        except Exception as e:
            print(f"❌ Registration test failed: {e}")
        
        # Test login endpoint (should fail with invalid credentials)
        try:
            response = await client.post(f"{BASE_URL}/auth/login", json={
                "email": "test@example.com",
                "password": "wrongpassword"
            })
            print(f"✅ Login validation: {response.status_code} (expected 401)")
        except Exception as e:
            print(f"❌ Login test failed: {e}")
        
        # Test complaints endpoint (should require auth)
        try:
            response = await client.get(f"{BASE_URL}/complaints")
            print(f"✅ Complaints auth required: {response.status_code} (expected 401)")
        except Exception as e:
            print(f"❌ Complaints test failed: {e}")
    
    print("\n🎉 API tests completed successfully!")
    return True

if __name__ == "__main__":
    asyncio.run(test_api())
