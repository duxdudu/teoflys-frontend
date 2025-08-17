"use client";

import { ArrowLeft, Camera, User, Phone, Mail, Star, CheckCircle, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function PortraitServices() {
  const services = [
    {
      icon: Camera,
      title: "Studio Portraits",
      description: "Professional studio setup with perfect lighting",
      features: ["Professional lighting", "Multiple backdrops", "Hair & makeup guidance", "Digital retouching"]
    },
    {
      icon: User,
      title: "Outdoor Portraits",
      description: "Natural light and beautiful outdoor settings",
      features: ["Golden hour sessions", "Urban locations", "Nature settings", "Lifestyle photography"]
    },
    {
      icon: Sparkles,
      title: "Creative Portraits",
      description: "Unique and artistic portrait concepts",
      features: ["Conceptual themes", "Artistic editing", "Fashion photography", "Creative direction"]
    }
  ];

  const portfolioImages = [
    "/Portrait.jpg",
    "/Portrait2.jpg", 
    "/Portrait3.jpg",
    "/Portrait4.jpg",
    "/Portrait5.jpg",
    "/Portrait6.jpg"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Home</span>
            </Link>
            <div className="flex items-center space-x-2">
              <Camera className="w-6 h-6 text-indigo-500" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Portrait Photography</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/Portrait.jpg"
            alt="Portrait Photography"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white max-w-4xl mx-auto px-4">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <User className="w-12 h-12 text-indigo-400" />
              <h1 className="text-5xl sm:text-7xl font-bold">
                Portrait Photography
              </h1>
            </div>
            <p className="text-xl sm:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto">
              Professional portrait photography that captures your personality and beauty. 
              From headshots to creative portraits, we bring out your best features.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <a 
                href="tel:+212123456789"
                className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
              >
                <Phone className="w-5 h-5" />
                <span>Call Now</span>
              </a>
              <a 
                href="mailto:teofly@gmail.com"
                className="flex items-center space-x-2 bg-white text-indigo-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
              >
                <Mail className="w-5 h-5" />
                <span>Email Us</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Our Portrait Photography Services
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Professional portrait photography services that showcase your unique personality and beauty
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <service.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
                  {service.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
                  {service.description}
                </p>
                <ul className="space-y-3">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Gallery */}
      <section className="py-20 bg-indigo-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Portrait Photography Portfolio
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Explore our stunning portrait photography collection
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolioImages.map((image, index) => (
              <div key={index} className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
                <div className="aspect-[4/3] relative">
                  <Image
                    src={image}
                    alt={`Portrait Photography ${index + 1}`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/90 dark:bg-gray-900/90 rounded-lg p-4 text-center">
                      <User className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        View Details
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Why Choose Our Portrait Photography?
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <Star className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      Portrait Expertise
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Specialized in capturing authentic expressions and personality.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <Camera className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      Professional Equipment
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      High-end cameras and lighting for stunning portrait results.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-pink-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      Creative Direction
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Expert guidance to help you feel confident and natural.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/Portrait2.jpg"
                  alt="Professional Portrait Photography"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-500 to-purple-500">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Capture Your Best Self?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Let&apos;s create stunning portraits that showcase your unique personality and beauty
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <a 
              href="tel:+212123456789"
              className="flex items-center space-x-2 bg-white text-indigo-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <Phone className="w-5 h-5" />
              <span>Call Now</span>
            </a>
            <a 
              href="mailto:teofly@gmail.com"
              className="flex items-center space-x-2 bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition-all duration-300 transform hover:scale-105"
            >
              <Mail className="w-5 h-5" />
              <span>Email Us</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
} 