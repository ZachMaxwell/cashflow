from django.test import TestCase

# tests.py
from django.contrib.auth.models import User
from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse

class LoginViewTestCase(APITestCase):
    def setUp(self):
        # Create a test user
        self.user = User.objects.create_user(
            username='testuser',
            password='testpassword'
        )

    def test_login_successful(self):
        # Define the login URL
        url = reverse('login')  # Adjust this if your login URL has a different name

        # Send a POST request with valid credentials
        data = {'username': 'testuser', 'password': 'testpassword'}
        response = self.client.post(url, data, format='json')

        # Check if the response has a 200 status code
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Check if the response contains the expected message
        self.assertEqual(response.data, {'message': 'Login successful'})

    def test_login_failed(self):
        # Define the login URL
        url = reverse('login')  # Adjust this if your login URL has a different name

        # Send a POST request with invalid credentials
        data = {'username': 'testuser', 'password': 'wrongpassword'}
        response = self.client.post(url, data, format='json')

        # Check if the response has a 401 status code (Unauthorized)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        # Check if the response contains the expected message
        self.assertEqual(response.data, {'message': 'Login failed'})


