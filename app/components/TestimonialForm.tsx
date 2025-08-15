"use client";

import { useState } from "react";
import { Star, Send, CheckCircle, AlertCircle } from "lucide-react";

interface TestimonialFormData {
  name: string;
  email: string;
  rating: number;
  message: string;
  category: string;
}

interface TestimonialFormProps {
  className?: string;
  onSuccess?: () => void;
}

const categories = [
  { value: 'wedding', label: 'Wedding Photography' },
  { value: 'portrait', label: 'Portrait Photography' },
  { value: 'landscape', label: 'Landscape Photography' },
  { value: 'food', label: 'Food Photography' },
  { value: 'events', label: 'Event Photography' },
  { value: 'commercial', label: 'Commercial Photography' },
  { value: 'other', label: 'Other Services' }
];

export function TestimonialForm({ className = "", onSuccess }: TestimonialFormProps) {
  const [formData, setFormData] = useState<TestimonialFormData>({
    name: '',
    email: '',
    rating: 0,
    message: '',
    category: 'wedding'
  });

  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (field: keyof TestimonialFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (submitStatus !== 'idle') {
      setSubmitStatus('idle');
      setErrorMessage('');
    }
  };

  const handleRatingChange = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
    if (submitStatus !== 'idle') {
      setSubmitStatus('idle');
      setErrorMessage('');
    }
  };

  const validateForm = (): string | null => {
    if (!formData.name.trim()) return 'Name is required';
    if (!formData.email.trim()) return 'Email is required';
    if (!formData.email.includes('@')) return 'Please enter a valid email';
    if (formData.rating === 0) return 'Please select a rating';
    if (!formData.message.trim()) return 'Message is required';
    if (formData.message.length < 10) return 'Message must be at least 10 characters long';
    if (formData.message.length > 500) return 'Message must be less than 500 characters';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/testimonials/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit testimonial');
      }

      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        rating: 0,
        message: '',
        category: 'wedding'
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'An error occurred');
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => {
      const starNumber = i + 1;
      const isFilled = starNumber <= (hoveredRating || formData.rating);
      
      return (
        <button
          key={starNumber}
          type="button"
          onClick={() => handleRatingChange(starNumber)}
          onMouseEnter={() => setHoveredRating(starNumber)}
          onMouseLeave={() => setHoveredRating(0)}
          className="transition-transform hover:scale-110 focus:outline-none focus:scale-110"
        >
          <Star
            className={`w-8 h-8 ${
              isFilled ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        </button>
      );
    });
  };

  const getCharacterCountColor = () => {
    const count = formData.message.length;
    if (count < 100) return 'text-gray-500';
    if (count < 400) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Share Your Experience</h3>
        <p className="text-gray-600">
          Help others discover our photography services through your feedback
        </p>
      </div>

      {/* Success Message */}
      {submitStatus === 'success' && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <h4 className="font-medium text-green-800">Thank you!</h4>
              <p className="text-sm text-green-700">
                Your testimonial has been submitted successfully. It will be reviewed and published soon.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {submitStatus === 'error' && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <div>
              <h4 className="font-medium text-red-800">Submission Failed</h4>
              <p className="text-sm text-red-700">{errorMessage}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name and Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-400"
              placeholder="Your full name"
              required
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-400"
              placeholder="your.email@example.com"
              required
            />
          </div>
        </div>

        {/* Service Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Service Category *
          </label>
          <select
            id="category"
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white text-gray-900"
            required
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating *
          </label>
          <div className="flex items-center gap-2">
            {renderStars()}
            <span className="ml-3 text-sm text-gray-600">
              {formData.rating > 0 ? `${formData.rating}/5 stars` : 'Select rating'}
            </span>
          </div>
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            Your Experience *
          </label>
          <textarea
            id="message"
            value={formData.message}
            onChange={(e) => handleInputChange('message', e.target.value)}
            rows={5}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none bg-white text-gray-900 placeholder-gray-400"
            placeholder="Tell us about your experience with our photography services..."
            required
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-gray-500">
              Share your thoughts, feedback, or any specific details about your experience
            </span>
            <span className={`text-xs font-medium ${getCharacterCountColor()}`}>
              {formData.message.length}/500
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-yellow-500 text-white font-medium rounded-lg hover:bg-yellow-600 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Submitting...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Submit Testimonial
            </>
          )}
        </button>

        {/* Note */}
        <p className="text-xs text-gray-500 text-center">
          Your testimonial will be reviewed by our team before being published. 
          We typically review submissions within 24-48 hours.
        </p>
      </form>
    </div>
  );
}
