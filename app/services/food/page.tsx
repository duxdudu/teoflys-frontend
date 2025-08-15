"use client";

import { ArrowLeft, Camera, Utensils } from "lucide-react";
import Link from "next/link";

export default function FoodServices() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Home</span>
            </Link>
            <div className="flex items-center space-x-2">
              <Camera className="w-6 h-6 text-orange-500" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Food Photography</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Utensils className="w-8 h-8 text-orange-500" />
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white">
              Food Photography
            </h1>
          </div>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Professional food photography that makes dishes look irresistible. 
            Perfect for restaurants, menus, and culinary content.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center shadow-sm">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Camera className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Restaurant Menus</h3>
            <p className="text-gray-600 dark:text-gray-400">Professional menu photography</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center shadow-sm">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Utensils className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Culinary Content</h3>
            <p className="text-gray-600 dark:text-gray-400">Food blogs and social media</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center shadow-sm">
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <ArrowLeft className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Product Photography</h3>
            <p className="text-gray-600 dark:text-gray-400">Food products and ingredients</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Book Your Food Photography</h2>
          <p className="text-orange-100 mb-6">Let's make your food look absolutely delicious</p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <a 
              href="tel:+212123456789"
              className="flex items-center space-x-2 bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              <span>Call Now</span>
            </a>
            <a 
              href="mailto:teofly@gmail.com"
              className="flex items-center space-x-2 bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              <span>Email Us</span>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
} 