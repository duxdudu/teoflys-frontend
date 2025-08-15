"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MessageCircle, Plus, Send, CheckCircle, AlertCircle, X } from "lucide-react";
import axios from "axios";

interface Testimonial {
  _id: string;
  name: string;
  rating: number;
  message: string;
  serviceType: string;
  createdAt: string;
}

interface TestimonialsResponse {
  testimonials: Testimonial[];
  pagination: {
    currentPage: number;
    totalPages: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

const serviceTypeLabels: { [key: string]: string } = {
  wedding: 'Wedding',
  portrait: 'Portrait',
  landscape: 'Landscape',
  food: 'Food',
  events: 'Events',
  commercial: 'Commercial',
  other: 'Other'
};

const serviceTypeColors: { [key: string]: string } = {
  wedding: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
  portrait: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  landscape: 'bg-green-500/20 text-green-300 border-green-500/30',
  food: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  events: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  commercial: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
  other: 'bg-gray-500/20 text-gray-300 border-gray-500/30'
};

export default function TestimonialsPreview() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 0,
    serviceType: 'other',
    message: ''
  });
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const serviceTypes = [
    { value: 'wedding', label: 'Wedding Photography' },
    { value: 'portrait', label: 'Portrait Photography' },
    { value: 'landscape', label: 'Landscape Photography' },
    { value: 'food', label: 'Food Photography' },
    { value: 'events', label: 'Event Photography' },
    { value: 'commercial', label: 'Commercial Photography' },
    { value: 'other', label: 'Other' }
  ];

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const response = await axios.get<TestimonialsResponse>('/api/testimonials/published?limit=3');
      setTestimonials(response.data.testimonials);
    } catch (error: unknown) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingChange = (rating: number) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.rating === 0) {
      setErrorMessage('Please select a rating');
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      await axios.post('/api/testimonials/submit', formData);
      
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        rating: 0,
        serviceType: 'other',
        message: ''
      });
      
      // Refresh testimonials
      fetchTestimonials();
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus('idle');
        setShowForm(false);
      }, 5000);
      
    } catch (error: unknown) {
      setSubmitStatus('error');
      const errorMessage = axios.isAxiosError(error) ? error.response?.data?.error : 'Failed to submit testimonial. Please try again.';
      setErrorMessage(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => {
      const starNumber = index + 1;
      const isFilled = starNumber <= rating;
      
      return (
        <Star
          key={starNumber}
          className={`w-4 h-4 ${
            isFilled ? 'text-yellow-400 fill-current' : 'text-gray-400'
          }`}
        />
      );
    });
  };

  const renderFormStars = () => {
    return Array.from({ length: 5 }, (_, index) => {
      const starNumber = index + 1;
      const isFilled = starNumber <= (hoveredRating || formData.rating);
      
      return (
        <button
          key={starNumber}
          type="button"
          className={`text-xl transition-all duration-200 ${
            isFilled 
              ? 'text-yellow-400 hover:text-yellow-500' 
              : 'text-gray-300 hover:text-gray-400'
          }`}
          onMouseEnter={() => setHoveredRating(starNumber)}
          onMouseLeave={() => setHoveredRating(0)}
          onClick={() => handleRatingChange(starNumber)}
        >
          <Star className="w-6 h-6" fill={isFilled ? 'currentColor' : 'none'} />
        </button>
      );
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="w-full">
      {/* Testimonials Preview */}
      <div className="mb-8">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-white mb-4">What Our Clients Say</h2>
          <p className="text-gray-300">Real experiences from our valued clients</p>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="bg-white/5 backdrop-blur-sm border-white/10 animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-white/10 rounded w-3/4 mb-4"></div>
                  <div className="h-20 bg-white/10 rounded mb-4"></div>
                  <div className="h-4 bg-white/10 rounded w-1/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : testimonials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <Card key={testimonial._id} className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-white">{testimonial.name}</h3>
                    <Badge className={`${serviceTypeColors[testimonial.serviceType]} border`}>
                      {serviceTypeLabels[testimonial.serviceType]}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 mb-3">
                    {renderStars(testimonial.rating)}
                    <span className="text-sm text-gray-400 ml-2">
                      {testimonial.rating}/5
                    </span>
                  </div>
                                  <p className="text-gray-300 text-sm leading-relaxed mb-3">
                  &ldquo;{testimonial.message}&rdquo;
                </p>
                  <p className="text-xs text-gray-400">
                    {formatDate(testimonial.createdAt)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Testimonials Yet</h3>
            <p className="text-gray-300">Be the first to share your experience!</p>
          </div>
        )}
      </div>

      {/* Quick Testimonial Form */}
      <div className="text-center">
        {!showForm ? (
          <Button
            onClick={() => setShowForm(true)}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105"
          >
            <Plus className="w-5 h-5 mr-2" />
            Share Your Experience
          </Button>
        ) : (
          <Card className="w-full max-w-2xl mx-auto bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Quick Testimonial</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {submitStatus === 'success' && (
                <div className="mb-4 p-4 bg-green-500/20 border border-green-500/30 rounded-lg text-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mx-auto mb-2" />
                  <p className="text-green-300 text-sm">Thank you! Your testimonial has been submitted.</p>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="mb-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <span className="text-red-300 text-sm">{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Your Name"
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="Email Address"
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>

                <select
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  {serviceTypes.map((service) => (
                    <option key={service.value} value={service.value} className="bg-gray-800 text-white">
                      {service.label}
                    </option>
                  ))}
                </select>

                <div>
                  <div className="flex justify-center gap-1 mb-2">
                    {renderFormStars()}
                  </div>
                  <p className="text-center text-sm text-gray-400">
                    {formData.rating > 0 ? `${formData.rating} star${formData.rating > 1 ? 's' : ''}` : 'Click to rate'}
                  </p>
                </div>

                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  maxLength={300}
                  placeholder="Tell us about your experience..."
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none"
                />

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                      Submitting...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Send className="w-4 h-4" />
                      Submit Testimonial
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
