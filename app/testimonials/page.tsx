"use client";

import { TestimonialsDisplay } from '../components/TestimonialsDisplay';
import { TestimonialForm } from '../components/TestimonialForm';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function TestimonialsPage() {
  const router = useRouter();
  const [showFloatingButton, setShowFloatingButton] = useState(false);

  // Show floating button when scrolling down
  useEffect(() => {
    const handleScroll = () => {
      setShowFloatingButton(window.scrollY > 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="py-20">
        {/* Back Button - Fixed positioning and styling */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <button
            onClick={() => router.push("/")}
            className="flex items-center space-x-1 sm:space-x-2 text-gray-600 hover:text-blue-600 transition-colors px-3 sm:px-4 py-2 rounded-lg hover:bg-white/50 backdrop-blur-sm border border-gray-200/50 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium text-sm sm:text-base">
              <span className="hidden sm:inline">Back to Home</span>
              <span className="sm:hidden">Back</span>
            </span>
          </button>
        </div>

        {/* Floating Back Button */}
        {showFloatingButton && (
          <button
            onClick={() => router.push("/")}
            className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all duration-300 hover:scale-110"
            aria-label="Back to Home"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center space-y-4 mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Client Testimonials
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Discover what our clients have to say about their experience working with us. 
              Real stories from real projects that showcase our commitment to excellence.
            </p>
          </div>

          {/* Statistics Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-yellow-500 mb-2">4.9</div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-blue-500 mb-2">150+</div>
              <div className="text-sm text-gray-600">Happy Clients</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-green-500 mb-2">6</div>
              <div className="text-sm text-gray-600">Service Types</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-purple-500 mb-2">98%</div>
              <div className="text-sm text-gray-600">Satisfaction Rate</div>
            </div>
          </div>

          {/* Featured Testimonial */}
          <div className="mb-20">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Featured Review</h2>
              <p className="text-gray-600">Our highest-rated testimonial</p>
            </div>
            <div className="max-w-4xl mx-auto">
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-8">
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        className="w-6 h-6 fill-yellow-400 text-yellow-400"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                              <blockquote className="text-lg text-gray-700 italic mb-6 leading-relaxed">
              &ldquo;The photography team exceeded all our expectations! They captured every precious moment of our wedding with such artistry and attention to detail. The photos are absolutely stunning and we couldn&apos;t be happier with the results.&rdquo;
            </blockquote>
                  <div className="flex items-center justify-center gap-4">
                    <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                      <span className="text-yellow-600 font-bold text-lg">S</span>
                    </div>
                    <div className="text-left">
                      <h4 className="font-semibold text-gray-900">Sarah & Michael</h4>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-pink-500/20 text-pink-600 border border-pink-500/30 rounded-full text-xs font-medium">
                          Wedding Photography
                        </span>
                        <span className="text-sm text-gray-500">December 2023</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* All Testimonials */}
          <div className="mb-20">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">All Testimonials</h2>
              <p className="text-gray-600">Browse through all our client reviews</p>
            </div>
            <TestimonialsDisplay maxItems={12} showFilter={true} />
          </div>

          {/* Submit Testimonial Section */}
          <div className="mb-20">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Share Your Experience</h2>
              <p className="text-gray-600">
                Had a great experience with our services? We&apos;d love to hear about it!
              </p>
            </div>
            <div className="max-w-2xl mx-auto">
              <TestimonialForm 
                onSuccess={() => {
                  // Refresh testimonials after successful submission
                  window.location.reload();
                }}
              />
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Ready to Create Amazing Memories?</h3>
              <p className="text-lg mb-6 opacity-90">
                Let&apos;s work together to capture your special moments with professional photography
              </p>
              <button className="bg-white text-yellow-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Get Started Today
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
