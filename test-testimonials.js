// Test script for testimonials API endpoints
// Run with: node test-testimonials.js

const axios = require('axios');

const BASE_URL = 'http://localhost:3000';
const BACKEND_URL = 'http://localhost:5000';

async function testTestimonialsAPI() {
  console.log('🧪 Testing Testimonials API Endpoints...\n');

  try {
    // Test 1: Submit a testimonial
    console.log('1. Testing testimonial submission...');
    const testimonialData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      rating: 5,
      category: 'wedding',
      message: 'Amazing photography service! The team was professional and captured our special day perfectly. Highly recommended!'
    };

    try {
      const submitResponse = await axios.post(`${BASE_URL}/api/testimonials/submit`, testimonialData);
      console.log('✅ Testimonial submitted successfully:', submitResponse.data.message);
    } catch (error) {
      console.log('❌ Testimonial submission failed:', error.response?.data?.error || error.message);
    }

    // Test 2: Get published testimonials
    console.log('\n2. Testing published testimonials retrieval...');
    try {
      const publishedResponse = await axios.get(`${BASE_URL}/api/testimonials/published`);
      console.log('✅ Published testimonials retrieved:', publishedResponse.data.testimonials.length, 'testimonials');
      console.log('   Pagination info:', publishedResponse.data.pagination);
    } catch (error) {
      console.log('❌ Published testimonials retrieval failed:', error.response?.data?.error || error.message);
    }

    // Test 3: Test category filtering
    console.log('\n3. Testing category filtering...');
    try {
      const filteredResponse = await axios.get(`${BASE_URL}/api/testimonials/published?category=wedding`);
      console.log('✅ Wedding testimonials filtered:', filteredResponse.data.testimonials.length, 'testimonials');
    } catch (error) {
      console.log('❌ Category filtering failed:', error.response?.data?.error || error.message);
    }

    // Test 4: Test pagination
    console.log('\n4. Testing pagination...');
    try {
      const paginatedResponse = await axios.get(`${BASE_URL}/api/testimonials/published?page=1&limit=3`);
      console.log('✅ Pagination test successful:', paginatedResponse.data.testimonials.length, 'testimonials on page 1');
    } catch (error) {
      console.log('❌ Pagination test failed:', error.response?.data?.error || error.message);
    }

    // Test 5: Test backend connection
    console.log('\n5. Testing backend connection...');
    try {
      const backendResponse = await axios.get(`${BACKEND_URL}/api/testimonials/published?limit=1`);
      console.log('✅ Backend connection successful:', backendResponse.data.testimonials.length, 'testimonials');
    } catch (error) {
      console.log('❌ Backend connection failed:', error.message);
      console.log('   Make sure the backend server is running on port 5000');
    }

  } catch (error) {
    console.error('❌ Test suite failed:', error.message);
  }

  console.log('\n🏁 Test suite completed!');
}

// Run the tests
testTestimonialsAPI();
