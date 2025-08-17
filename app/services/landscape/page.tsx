"use client";

import { ArrowLeft, Camera, Mountain, Phone, Mail, Star, CheckCircle, Trees, Waves, Building2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function LandscapeServices() {
  const services = [
    {
      icon: Trees,
      title: "Nature Photography",
      description: "Mountains, forests, and natural landscapes",
      features: ["Golden hour shots", "HDR processing", "Wide-angle lenses", "Nature preservation"]
    },
    {
      icon: Waves,
      title: "Seascapes",
      description: "Ocean views and coastal photography",
      features: ["Sunrise/sunset shots", "Long exposure", "Coastal locations", "Weather optimization"]
    },
    {
      icon: Building2,
      title: "Cityscapes",
      description: "Urban landscapes and city views",
      features: ["Night photography", "Architectural focus", "Urban exploration", "Light trails"]
    }
  ];

  const portfolioImages = [
    "/1.jpg",
    "/2.jpg", 
    "/3.jpg",
    "/4.jpg",
    "/5.jpg",
    "/6.jpg"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Home</span>
            </Link>
            <div className="flex items-center space-x-2">
              <Camera className="w-6 h-6 text-green-500" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Landscape Photography</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/1.jpg"
            alt="Landscape Photography"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white max-w-4xl mx-auto px-4">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <Mountain className="w-12 h-12 text-green-400" />
              <h1 className="text-5xl sm:text-7xl font-bold">
                Landscape Photography
              </h1>
            </div>
            <p className="text-xl sm:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto">
              Capture the beauty of nature with our landscape photography services. 
              From mountains to beaches, we bring the outdoors to life.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <a 
                href="tel:+212123456789"
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
              >
                <Phone className="w-5 h-5" />
                <span>Call Now</span>
              </a>
              <a 
                href="mailto:teofly@gmail.com"
                className="flex items-center space-x-2 bg-white text-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
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
              Our Landscape Photography Services
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Professional landscape photography services that capture the breathtaking beauty of nature
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
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
      <section className="py-20 bg-green-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Landscape Photography Portfolio
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Explore our stunning landscape photography collection
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolioImages.map((image, index) => (
              <div key={index} className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
                <div className="aspect-[4/3] relative">
                  <Image
                    src={image}
                    alt={`Landscape Photography ${index + 1}`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/90 dark:bg-gray-900/90 rounded-lg p-4 text-center">
                      <Mountain className="w-8 h-8 text-green-600 mx-auto mb-2" />
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
                Why Choose Our Landscape Photography?
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <Star className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      Nature Expertise
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Deep understanding of natural lighting and landscape composition.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <Camera className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      Professional Equipment
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      High-quality cameras and lenses for stunning landscape photography.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      Perfect Timing
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Expert knowledge of golden hours and optimal shooting conditions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/2.jpg"
                  alt="Professional Landscape Photography"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-500 to-blue-500">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Capture Nature&apos;s Beauty?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Let&apos;s create stunning landscape photography that showcases the world&apos;s natural wonders
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <a 
              href="tel:+212123456789"
              className="flex items-center space-x-2 bg-white text-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <Phone className="w-5 h-5" />
              <span>Call Now</span>
            </a>
            <a 
              href="mailto:teofly@gmail.com"
              className="flex items-center space-x-2 bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-all duration-300 transform hover:scale-105"
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