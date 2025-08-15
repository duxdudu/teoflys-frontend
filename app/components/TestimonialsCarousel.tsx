"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import axios from "axios";

interface Testimonial {
  _id: string;
  name: string;
  rating: number;
  message: string;
  serviceType: string;
  createdAt: string;
  adminNotes?: string;
}

const serviceTypeLabels: { [key: string]: string } = {
  wedding: 'Wedding Photography',
  portrait: 'Portrait Photography',
  landscape: 'Landscape Photography',
  food: 'Food Photography',
  events: 'Event Photography',
  commercial: 'Commercial Photography',
  other: 'Other Services'
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

export default function TestimonialsCarousel() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await axios.get('/api/testimonials/published?limit=10');
      setTestimonials(response.data.testimonials);
      
    } catch (error: any) {
      setError('Failed to load testimonials');
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  useEffect(() => {
    if (!isPlaying || testimonials.length === 0 || isHovered) return;

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, testimonials.length, isHovered]);

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

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => {
      const starNumber = index + 1;
      const isFilled = starNumber <= rating;
      
      return (
        <Star
          key={starNumber}
          className={`w-4 h-4 ${
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
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto px-3 sm:px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">Client Testimonials</h2>
          <p className="text-gray-300">Loading testimonials...</p>
        </div>
        <div className="relative">
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 animate-pulse">
            <CardContent className="p-8">
              <div className="h-32 bg-white/10 rounded mb-4"></div>
              <div className="h-4 bg-white/10 rounded w-3/4 mx-auto"></div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || testimonials.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">Client Testimonials</h2>
          <p className="text-gray-300">
            {error || 'No testimonials available at the moment.'}
          </p>
        </div>
      </div>
    );
  }

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">What Our Clients Say</h2>
        <p className="text-gray-300">
          Real experiences from our valued clients across different photography services
        </p>
      </div>

      {/* Carousel Container */}
      <div 
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Main Testimonial Card */}
        <Card className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 backdrop-blur-sm border-yellow-500/20 hover:border-yellow-500/30 transition-all duration-500 hover:scale-[1.02]">
          <CardContent className="p-5 sm:p-8">
            <div className="text-center">
              {/* Rating */}
              <div className="flex justify-center mb-6">
                {renderStars(currentTestimonial.rating)}
              </div>
              
              {/* Quote */}
              <blockquote className="text-base sm:text-xl text-white italic mb-6 leading-relaxed max-w-3xl mx-auto">"{currentTestimonial.message}"</blockquote>

              {currentTestimonial.adminNotes && (
                <div className="mb-6 max-w-2xl mx-auto p-4 bg-white/5 border border-white/10 rounded-lg">
                  <div className="text-xs text-gray-300 mb-1">Reply from studio</div>
                  <p className="text-sm text-gray-200">{currentTestimonial.adminNotes}</p>
                </div>
              )}
              
              {/* Author Info */}
              <div className="flex items-center justify-center gap-4">
                <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center">
                  <span className="text-yellow-400 font-bold text-2xl">
                    {currentTestimonial.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-white text-lg">{currentTestimonial.name}</h4>
                  <div className="flex items-center gap-3">
                    <Badge className={`${serviceTypeColors[currentTestimonial.serviceType]} border`}>
                      {serviceTypeLabels[currentTestimonial.serviceType]}
                    </Badge>
                    <span className="text-sm text-gray-400">
                      {formatDate(currentTestimonial.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Controls */}
        <div className="absolute top-1/2 -translate-y-1/2 left-2 sm:left-4">
          <Button
            onClick={goToPrevious}
            variant="outline"
            size="sm"
            className="w-10 h-10 p-0 bg-white/10 hover:bg-white/20 text-white border-white/20 rounded-full"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </div>

        <div className="absolute top-1/2 -translate-y-1/2 right-2 sm:right-4">
          <Button
            onClick={goToNext}
            variant="outline"
            size="sm"
            className="w-10 h-10 p-0 bg-white/10 hover:bg-white/20 text-white border-white/20 rounded-full"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Play/Pause Control */}
        <div className="absolute top-4 right-4">
          <Button
            onClick={togglePlayPause}
            variant="outline"
            size="sm"
            className="w-8 h-8 p-0 bg-white/10 hover:bg-white/20 text-white border-white/20 rounded-full"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
        </div>

        {/* Progress Indicator */}
        <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2">
          <div className="flex items-center gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-yellow-400 w-6' 
                    : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Testimonial Counter */}
        <div className="absolute bottom-4 right-4">
          <span className="text-sm text-white/60">
            {currentIndex + 1} / {testimonials.length}
          </span>
        </div>
      </div>

      {/* Thumbnail Navigation */}
      {testimonials.length > 1 && (
        <div className="mt-8">
          <div className="flex justify-center gap-3 overflow-x-auto pb-2">
            {testimonials.map((testimonial, index) => (
              <button
                key={testimonial._id}
                onClick={() => goToSlide(index)}
                className={`flex-shrink-0 p-3 rounded-lg border-2 transition-all duration-300 ${
                  index === currentIndex
                    ? 'border-yellow-400 bg-yellow-500/20'
                    : 'border-white/20 bg-white/5 hover:border-white/40'
                }`}
              >
                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    {renderStars(testimonial.rating)}
                  </div>
                  <p className="text-xs text-white font-medium mb-1">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {serviceTypeLabels[testimonial.serviceType]}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
