"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Quote, ChevronLeft, ChevronRight, Heart, Camera, Users, Award } from "lucide-react";
import axios from "axios";

interface Testimonial {
  _id: string;
  name: string;
  rating: number;
  message: string;
  serviceType: string;
  createdAt: string;
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

  const serviceTypeIcons: { [key: string]: React.ComponentType<{ className?: string }> } = {
  wedding: Heart,
  portrait: Users,
  landscape: Camera,
  food: Camera,
  events: Camera,
  commercial: Award,
  other: Camera
};

interface TestimonialsWidgetProps {
  variant?: 'compact' | 'detailed' | 'carousel';
  maxItems?: number;
  showServiceFilter?: boolean;
  className?: string;
}

export default function TestimonialsWidget({ 
  variant = 'detailed', 
  maxItems = 6, 
  showServiceFilter = false,
  className = ""
}: TestimonialsWidgetProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedService, setSelectedService] = useState<string>('all');
  const [currentIndex, setCurrentIndex] = useState(0);

  const fetchTestimonials = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await axios.get(`/api/testimonials/published?limit=${maxItems * 2}`);
      setTestimonials(response.data.testimonials);
      
    } catch (error: unknown) {
      setError('Failed to load testimonials');
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  }, [maxItems]);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  useEffect(() => {
    if (variant === 'carousel' && testimonials.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
        );
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [variant, testimonials.length]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => {
      const starNumber = index + 1;
      const isFilled = starNumber <= rating;
      
      return (
        <Star
          key={starNumber}
          className={`w-3 h-3 ${
            isFilled ? 'text-yellow-400 fill-current' : 'text-gray-300'
          }`}
        />
      );
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
  };

  const filteredTestimonials = selectedService === 'all' 
    ? testimonials.slice(0, maxItems)
    : testimonials.filter(t => t.serviceType === selectedService).slice(0, maxItems);

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  if (loading) {
    return (
      <div className={`${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto"></div>
          <p className="text-gray-400 mt-2 text-sm">Loading testimonials...</p>
        </div>
      </div>
    );
  }

  if (error || testimonials.length === 0) {
    return (
      <div className={`${className}`}>
        <div className="text-center text-gray-400">
          <p className="text-sm">No testimonials available</p>
        </div>
      </div>
    );
  }

  // Compact variant - minimal display
  if (variant === 'compact') {
    return (
      <div className={`${className}`}>
        <div className="flex items-center gap-2 mb-3">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          <span className="text-sm font-medium text-white">
            {testimonials.length} Happy Clients
          </span>
        </div>
        <div className="space-y-2">
          {filteredTestimonials.slice(0, 3).map((testimonial) => (
            <div key={testimonial._id} className="flex items-start gap-3">
              <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-yellow-400 font-bold text-xs">
                  {testimonial.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                                  <p className="text-sm text-gray-300 line-clamp-2">
                    &ldquo;{testimonial.message}&rdquo;
                  </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-white font-medium">{testimonial.name}</span>
                  <Badge className={`${serviceTypeColors[testimonial.serviceType]} text-xs px-2 py-0`}>
                    {serviceTypeLabels[testimonial.serviceType]}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Carousel variant - rotating display
  if (variant === 'carousel') {
    const currentTestimonial = testimonials[currentIndex];
    
    return (
      <div className={`${className}`}>
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-white mb-2">What Our Clients Say</h3>
          <div className="flex justify-center mb-3">
            {renderStars(currentTestimonial.rating)}
          </div>
        </div>
        
        <Card className="bg-white/5 backdrop-blur-sm border-white/10 relative">
          <CardContent className="p-6">
            <Quote className="w-6 h-6 text-yellow-400/60 mb-3 mx-auto" />
                            <blockquote className="text-gray-300 text-center mb-4 italic">
                  &ldquo;{currentTestimonial.message}&rdquo;
                </blockquote>
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-yellow-400 font-bold text-sm">
                  {currentTestimonial.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <h4 className="font-medium text-white text-sm">{currentTestimonial.name}</h4>
              <Badge className={`${serviceTypeColors[currentTestimonial.serviceType]} text-xs mt-1`}>
                {serviceTypeLabels[currentTestimonial.serviceType]}
              </Badge>
            </div>
          </CardContent>
          
          {/* Navigation */}
          <Button
            onClick={goToPrevious}
            variant="outline"
            size="sm"
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 p-0 bg-white/10 hover:bg-white/20 text-white border-white/20 rounded-full"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          <Button
            onClick={goToNext}
            variant="outline"
            size="sm"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 p-0 bg-white/10 hover:bg-white/20 text-white border-white/20 rounded-full"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
          
          {/* Progress dots */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
            <div className="flex items-center gap-1">
              {testimonials.slice(0, 5).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'bg-yellow-400 w-4' 
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Detailed variant - full display with service filter
  return (
    <div className={`${className}`}>
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-white mb-2">Client Testimonials</h3>
        <p className="text-gray-400 text-sm">Real experiences from our valued clients</p>
      </div>

      {showServiceFilter && (
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          <Button
            onClick={() => setSelectedService('all')}
            variant={selectedService === 'all' ? 'default' : 'outline'}
            size="sm"
            className={selectedService === 'all' 
              ? 'bg-yellow-500 hover:bg-yellow-600 text-xs' 
              : 'border-white/20 text-white hover:bg-white/10 text-xs'
            }
          >
            All
          </Button>
          {Object.keys(serviceTypeLabels).map((serviceType) => {
            const Icon = serviceTypeIcons[serviceType];
            return (
              <Button
                key={serviceType}
                onClick={() => setSelectedService(serviceType)}
                variant={selectedService === serviceType ? 'default' : 'outline'}
                size="sm"
                className={selectedService === serviceType 
                  ? 'bg-yellow-500 hover:bg-yellow-600 text-xs' 
                  : 'border-white/20 text-white hover:bg-white/10 text-xs'
                }
              >
                <Icon className="w-3 h-3 mr-1" />
                {serviceTypeLabels[serviceType]}
              </Button>
            );
          })}
        </div>
      )}

      <div className="space-y-4">
        {filteredTestimonials.map((testimonial) => (
          <Card 
            key={testimonial._id}
            className="bg-white/5 backdrop-blur-sm border-white/10 hover:border-yellow-500/30 transition-all duration-300"
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-yellow-400 font-bold text-sm">
                    {testimonial.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {renderStars(testimonial.rating)}
                    </div>
                    <Badge className={`${serviceTypeColors[testimonial.serviceType]} text-xs`}>
                      {serviceTypeLabels[testimonial.serviceType]}
                    </Badge>
                  </div>
                  <blockquote className="text-gray-300 text-sm italic mb-2">
                    &ldquo;{testimonial.message}&rdquo;
                  </blockquote>
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium text-sm">{testimonial.name}</span>
                    <span className="text-gray-400 text-xs">{formatDate(testimonial.createdAt)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTestimonials.length === 0 && (
        <div className="text-center text-gray-400 py-8">
          <p className="text-sm">No testimonials found for this service.</p>
        </div>
      )}
    </div>
  );
}
