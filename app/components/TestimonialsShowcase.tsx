/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Quote, ArrowRight } from "lucide-react";
import axios from "axios";
import Link from "next/link";


interface Testimonial {
  _id: string;
  name: string;
  rating: number;
  message: string;
  category: string;
  createdAt: string;
  adminNotes?: string;
}

const categoryLabels: { [key: string]: string } = {
  wedding: 'Wedding Photography',
  portrait: 'Portrait Photography',
  landscape: 'Landscape Photography',
  food: 'Food Photography',
  events: 'Event Photography',
  commercial: 'Commercial Photography',
  other: 'Other Services'
};

const categoryColors: { [key: string]: string } = {
  wedding: 'bg-pink-100 text-pink-700 border-pink-300 dark:bg-pink-500/20 dark:text-pink-300 dark:border-pink-500/30',
  portrait: 'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/30',
  landscape: 'bg-green-100 text-green-700 border-green-300 dark:bg-green-500/20 dark:text-green-300 dark:border-green-500/30',
  food: 'bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-500/20 dark:text-orange-300 dark:border-orange-500/30',
  events: 'bg-purple-100 text-purple-700 border-purple-300 dark:bg-purple-500/20 dark:text-purple-300 dark:border-purple-500/30',
  commercial: 'bg-indigo-100 text-indigo-700 border-indigo-300 dark:bg-indigo-500/20 dark:text-indigo-300 dark:border-indigo-500/30',
  other: 'bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-500/20 dark:text-gray-300 dark:border-gray-500/30'
};



// Fallback testimonials in case API fails
const fallbackTestimonials: Testimonial[] = [
  {
    _id: 'fallback-1',
    name: 'Sarah & Michael',
    rating: 5,
    message: 'The photography team exceeded all our expectations! They captured every precious moment of our wedding with such artistry and attention to detail.',
    category: 'wedding',
    createdAt: '2023-12-15T10:00:00Z'
  },
  {
    _id: 'fallback-2',
    name: 'Emma Rodriguez',
    rating: 5,
    message: 'Professional and creative portrait session. The photographer made me feel comfortable and confident, and the results were beyond my expectations.',
    category: 'portrait',
    createdAt: '2023-11-20T14:30:00Z'
  },
  {
    _id: 'fallback-3',
    name: 'David Chen',
    rating: 5,
    message: 'Outstanding landscape photography. The team captured the natural beauty of our hiking locations with breathtaking results.',
    category: 'landscape',
    createdAt: '2023-10-08T09:15:00Z'
  }
];

interface TestimonialsShowcaseProps {
  variant?: 'hero' | 'grid' | 'featured' | 'minimal';
  maxItems?: number;
  showViewAll?: boolean;
  className?: string;
}

export default function TestimonialsShowcase({ 
  variant = 'grid', 
  maxItems = 6, 
  showViewAll = true,
  className = ""
}: TestimonialsShowcaseProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTestimonials = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      // Try to fetch from the published testimonials endpoint
      const response = await axios.get(`/api/testimonials/published?limit=${maxItems * 2}`);
      
      if (response.data && Array.isArray(response.data.testimonials)) {
        setTestimonials(response.data.testimonials);
      } else if (response.data && Array.isArray(response.data)) {
        // If the response is directly an array
        setTestimonials(response.data);
      } else {
        // If no testimonials found, use fallback
        setTestimonials(fallbackTestimonials);
      }
      
    } catch (error: any) {
      console.error('Error fetching testimonials:', error);
      setError('Failed to load testimonials from backend');
      // Use fallback testimonials on error
      setTestimonials(fallbackTestimonials);
    } finally {
      setLoading(false);
    }
  }, [maxItems]);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

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
      month: 'short'
    });
  };

  const displayTestimonials = testimonials.slice(0, maxItems);

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

  // Show fallback if no testimonials and there's an error
  if (testimonials.length === 0 && error) {
    return (
      <div className={`${className}`}>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Featured Testimonials</h2>
          <p className="text-gray-600 dark:text-gray-300">Hear from some of our satisfied clients</p>
          <div className="mb-4 p-3 bg-red-100 border-2 border-red-300 rounded-lg dark:bg-red-500/20 dark:border-red-500/30">
            <p className="text-red-700 text-sm dark:text-red-400">API Error: {error}</p>
            <p className="text-red-600 text-xs dark:text-red-300">Showing sample testimonials below</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {fallbackTestimonials.map((testimonial) => (
            <Card 
              key={testimonial._id}
              className="bg-white border-2 border-gray-200 shadow-lg hover:shadow-xl dark:bg-white/5 dark:backdrop-blur-sm dark:border-white/10 hover:border-yellow-400 dark:hover:border-yellow-500/30 transition-all duration-300 hover:scale-105"
            >
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    {renderStars(testimonial.rating)}
                  </div>
                  
                  <Quote className="w-8 h-8 text-yellow-500 dark:text-yellow-400/60 mx-auto mb-4" />
                  
                  <blockquote className="text-gray-800 dark:text-gray-300 italic mb-6 leading-relaxed">
                    "{testimonial.message}"
                  </blockquote>
                  
                  <div className="w-16 h-16 bg-yellow-100 border-2 border-yellow-300 rounded-full flex items-center justify-center mx-auto mb-3 dark:bg-yellow-500/20 dark:border-yellow-500/30">
                    <span className="text-yellow-700 font-bold text-lg dark:text-yellow-400">
                      {testimonial.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{testimonial.name}</h4>
                  <Badge className={`${categoryColors[testimonial.category]} text-xs border-2`}>
                    {categoryLabels[testimonial.category]}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {showViewAll && (
          <div className="text-center mt-8">
            <Link href="/testimonials">
              <Button variant="outline" className="border-2 border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-white/20 dark:text-white dark:hover:bg-white/10">
                See More Testimonials
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    );
  }

  // Hero variant - large featured testimonial
  if (variant === 'hero') {
    const featured = displayTestimonials[0];
    
    return (
      <div className={`${className}`}>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">What Our Clients Say</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Real experiences from our valued clients across different photography services
          </p>
        </div>
        
        <Card className="bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-300 dark:from-yellow-500/10 dark:to-orange-500/10 dark:backdrop-blur-sm dark:border-yellow-500/20 max-w-4xl mx-auto">
          <CardContent className="p-8">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                {renderStars(featured.rating)}
              </div>
              
              <blockquote className="text-2xl text-gray-800 dark:text-white italic mb-6 leading-relaxed">"{featured.message}"</blockquote>

              {featured.adminNotes && (
                <div className="mb-6 p-4 bg-white border-2 border-gray-200 rounded-lg dark:bg-white/5 dark:border-white/10">
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Reply from studio</div>
                  <p className="text-sm text-gray-700 dark:text-gray-200">{featured.adminNotes}</p>
                </div>
              )}
               
              <div className="flex items-center justify-center gap-4">
                <div className="w-20 h-20 bg-yellow-100 border-2 border-yellow-300 rounded-full flex items-center justify-center dark:bg-yellow-500/20 dark:border-yellow-500/30">
                  <span className="text-yellow-700 font-bold text-3xl dark:text-yellow-400">
                    {featured.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-gray-900 dark:text-white text-xl">{featured.name}</h4>
                  <div className="flex items-center gap-3">
                  <Badge className={`${categoryColors[featured.category]} border-2`}>
                    {categoryLabels[featured.category]}
                    </Badge>
                    <span className="text-gray-600 dark:text-gray-400">
                      {formatDate(featured.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {showViewAll && (
          <div className="text-center mt-8">
            <Link href="/testimonials">
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-2">
                View All Testimonials
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    );
  }

  // Featured variant - 3 highlighted testimonials
  if (variant === 'featured') {
    const featured = displayTestimonials.slice(0, 3);
    
    return (
      <div className={`${className}`}>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Featured Testimonials</h2>
          <p className="text-gray-600 dark:text-gray-300">Hear from some of our satisfied clients</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featured.map((testimonial) => (
            <Card 
              key={testimonial._id}
              className="bg-white border-2 border-gray-200 shadow-lg hover:shadow-xl dark:bg-white/5 dark:backdrop-blur-sm dark:border-white/10 hover:border-yellow-400 dark:hover:border-yellow-500/30 transition-all duration-300 hover:scale-105"
            >
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    {renderStars(testimonial.rating)}
                  </div>
                  
                  <Quote className="w-8 h-8 text-yellow-500 dark:text-yellow-400/60 mx-auto mb-4" />
                  
                  <blockquote className="text-gray-800 dark:text-gray-300 italic mb-4 leading-relaxed">"{testimonial.message}"</blockquote>

                  {testimonial.adminNotes && (
                    <div className="mb-4 p-3 bg-gray-50 border-2 border-gray-200 rounded-lg dark:bg-white/5 dark:border-white/10">
                      <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Reply from studio</div>
                      <p className="text-sm text-gray-700 dark:text-gray-200">{testimonial.adminNotes}</p>
                    </div>
                  )}
                  
                  <div className="w-16 h-16 bg-yellow-100 border-2 border-yellow-300 rounded-full flex items-center justify-center mx-auto mb-3 dark:bg-yellow-500/20 dark:border-yellow-500/30">
                    <span className="text-yellow-700 font-bold text-lg dark:text-yellow-400">
                      {testimonial.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{testimonial.name}</h4>
                  <Badge className={`${categoryColors[testimonial.category]} text-xs border-2`}>
                    {categoryLabels[testimonial.category]}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {showViewAll && (
          <div className="text-center mt-8">
            <Link href="/testimonials">
              <Button variant="outline" className="border-2 border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-white/20 dark:text-white dark:hover:bg-white/10">
                See More Testimonials
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    );
  }

  // Minimal variant - compact list
  if (variant === 'minimal') {
    return (
      <div className={`${className}`}>
        <div className="flex items-center gap-2 mb-4">
          <Star className="w-5 h-5 text-yellow-500 dark:text-yellow-400 fill-current" />
          <span className="text-gray-900 dark:text-white font-medium">Client Testimonials</span>
        </div>
        
        <div className="space-y-3">
          {displayTestimonials.slice(0, 4).map((testimonial) => (
            <div key={testimonial._id} className="flex items-start gap-3">
              <div className="w-8 h-8 bg-yellow-100 border-2 border-yellow-300 rounded-full flex items-center justify-center flex-shrink-0 dark:bg-yellow-500/20 dark:border-yellow-500/30">
                <span className="text-yellow-700 font-bold text-xs dark:text-yellow-400">
                  {testimonial.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                  "{testimonial.message}"
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-900 dark:text-white font-medium">{testimonial.name}</span>
                  <Badge className={`${categoryColors[testimonial.category]} text-xs px-2 py-0 border-2`}>
                    {categoryLabels[testimonial.category]}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>

        {showViewAll && (
          <div className="mt-4">
            <Link href="/testimonials">
              <Button variant="ghost" size="sm" className="text-yellow-600 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-300 p-0 h-auto">
                View all testimonials
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    );
  }

  // Grid variant - default grid layout
  return (
    <div className={`${className}`}>
      <div className="text-center mb-6 sm:mb-8 px-2">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-4">Client Testimonials</h2>
        <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">Discover what our clients have to say</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {displayTestimonials.map((testimonial) => (
          <Card 
            key={testimonial._id}
            className="bg-white border-2 border-gray-200 shadow-lg hover:shadow-xl dark:bg-white/5 dark:backdrop-blur-sm dark:border-white/10 hover:border-yellow-400 dark:hover:border-yellow-500/30 transition-all duration-300 hover:scale-105"
          >
          <CardContent className="p-4 sm:p-6">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  {renderStars(testimonial.rating)}
                </div>
                
                <Quote className="w-6 h-6 text-yellow-500 dark:text-yellow-400/60 mx-auto mb-3" />
                
                <blockquote className="text-gray-800 dark:text-gray-300 italic mb-3 leading-relaxed">"{testimonial.message}"</blockquote>

                {testimonial.adminNotes && (
                  <div className="mb-3 p-3 bg-gray-50 border-2 border-gray-200 rounded-lg dark:bg-white/5 dark:border-white/10">
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Reply from studio</div>
                    <p className="text-sm text-gray-700 dark:text-gray-200">{testimonial.adminNotes}</p>
                  </div>
                )}
                
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-yellow-100 border-2 border-yellow-300 rounded-full flex items-center justify-center mx-auto mb-3 dark:bg-yellow-500/20 dark:border-yellow-500/30">
                  <span className="text-yellow-700 font-bold text-sm sm:text-base dark:text-yellow-400">
                    {testimonial.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                
                <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-sm sm:text-base break-words">{testimonial.name}</h4>
                <div className="flex items-center justify-center gap-2">
                  <Badge className={`${categoryColors[testimonial.category]} text-xs border-2`}>
                    {categoryLabels[testimonial.category]}
                  </Badge>
                  <span className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
                    {formatDate(testimonial.createdAt)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {showViewAll && (
        <div className="text-center mt-8">
          <Link href="/testimonials">
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-2">
              View All Testimonials
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
