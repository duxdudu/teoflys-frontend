"use client";

import { useState, useEffect } from "react";
import { Star, Quote, Filter, ChevronLeft, ChevronRight } from "lucide-react";

interface Testimonial {
  _id: string;
  name: string;
  rating: number;
  message: string;
  category: string;
  createdAt: string;
  adminNotes?: string;
}

interface TestimonialsDisplayProps {
  maxItems?: number;
  showFilter?: boolean;
  className?: string;
}

const categoryLabels: { [key: string]: string } = {
  wedding: 'Wedding',
  portrait: 'Portrait',
  landscape: 'Landscape',
  food: 'Food',
  events: 'Events',
  commercial: 'Commercial',
  other: 'Other'
};

const categoryColors: { [key: string]: string } = {
  wedding: 'bg-pink-500/20 text-pink-600 border-pink-500/30',
  portrait: 'bg-blue-500/20 text-blue-600 border-blue-500/30',
  landscape: 'bg-green-500/20 text-green-600 border-green-500/30',
  food: 'bg-orange-500/20 text-orange-600 border-orange-500/30',
  events: 'bg-purple-500/20 text-purple-600 border-purple-500/30',
  commercial: 'bg-indigo-500/20 text-indigo-600 border-indigo-500/30',
  other: 'bg-gray-500/20 text-gray-600 border-gray-500/30'
};

export function TestimonialsDisplay({
  maxItems = 10,
  showFilter = true,
  className = ""
}: TestimonialsDisplayProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: maxItems.toString()
      });
      
      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory);
      }

      const response = await fetch(`/api/testimonials/published?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch testimonials');
      }

      const data = await response.json();
      const list = Array.isArray(data?.testimonials) ? data.testimonials : [];
      setTestimonials(list);
      setTotalPages(Number(data?.pagination?.totalPages || 1));
      setTotal(Number(data?.pagination?.total || 0));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching testimonials:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, [currentPage, selectedCategory, maxItems]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading && testimonials.length === 0) {
    return (
      <div className={`flex justify-center items-center py-12 ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (error && testimonials.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={fetchTestimonials}
          className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Filter Section */}
      {showFilter && (
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-4 justify-start sm:justify-center">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Filter by:</span>
            </div>
            <div className="flex flex-nowrap sm:flex-wrap gap-2 overflow-x-auto max-w-full px-1">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-yellow-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All ({total})
              </button>
              {Object.entries(categoryLabels).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                    selectedCategory === key
                      ? 'bg-yellow-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Testimonials Grid */}
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {testimonials.map((testimonial) => (
          <div
             key={testimonial._id}
             className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 md:p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
                  <span className="text-yellow-600 font-bold">{testimonial.name.charAt(0).toUpperCase()}</span>
                </div>
                 <span className="font-semibold text-gray-900 text-sm sm:text-base break-words">{testimonial.name}</span>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${categoryColors[testimonial.category]}`}>
                {categoryLabels[testimonial.category]}
              </span>
            </div>
            
            <div className="flex items-center gap-1 mb-3">
              {renderStars(testimonial.rating)}
              <span className="text-xs sm:text-sm text-gray-500 ml-2">{testimonial.rating}/5</span>
            </div>
            
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4 break-words">{testimonial.message}</p>

            {testimonial.adminNotes && (
              <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded">
                <div className="text-xs font-medium text-gray-500 mb-1">Reply from studio</div>
                <p className="text-sm sm:text-base text-gray-700 break-words">{testimonial.adminNotes}</p>
              </div>
            )}
            
            <div className="text-xs sm:text-sm text-gray-400">
              {formatDate(testimonial.createdAt)}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>
          
          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* No Results */}
      {testimonials.length === 0 && !loading && (
        <div className="text-center py-12">
          <Quote className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No testimonials found</h3>
          <p className="text-gray-600">
            {selectedCategory === 'all' 
              ? 'No testimonials have been published yet.'
              : `No testimonials found for ${categoryLabels[selectedCategory]} services.`
            }
          </p>
        </div>
      )}
    </div>
  );
}
