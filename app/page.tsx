/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SiTiktok } from "react-icons/si";
// import { FaFacebook } from 'react-icons/fa';

import { Dialog } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Star,
  Phone,
  Mail,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Menu,
  StarIcon,
  InstagramIcon,
  YoutubeIcon,
  ArrowUp,
  Camera,
  Calendar,
  Settings,
  Zap,
  Clock,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { MobileNav } from "@/components/mobile-nav";
import { FaFacebook, FaLinkedin } from "react-icons/fa";
import { BsSnapchat } from "react-icons/bs";
import TestimonialsShowcase from "@/app/components/TestimonialsShowcase";
import api from "@/lib/utils/axios-config";
// import { MobileNav } from "@/components/mobile-nav"

interface Photo {
  _id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  isPublished: boolean;
}

interface PortfolioProject {
  id: string;
  title: string;
  category: string;
  description: string;
  stats: string;
  coverImage: string;
  images: string[];
  client?: string;
  date?: string;
}

export default function Home() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [theme, setTheme] = useState(
    typeof window !== "undefined" && localStorage.getItem("theme")
      ? localStorage.getItem("theme")
      : "dark"
  );
  // Inside your Home component, add this state
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  
  // Contact form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    serviceType: '',
    eventDate: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Portfolio state
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);
  const [projectImageIndex, setProjectImageIndex] = useState(0);

  // Portfolio projects data
  const portfolioProjects: PortfolioProject[] = [
    {
      id: "wedding-sarah-john",
      title: "Sarah & John's Wedding",
      category: "Wedding Photography",
      description: "A beautiful outdoor wedding celebration filled with love, laughter, and unforgettable moments. Captured every detail from the intimate ceremony to the lively reception.",
      stats: "WEDDING • 8 PHOTOS • COMPLETED",
      coverImage: "/wedding1.jpg",
      images: ["/wedding1.jpg", "/wedding2.jpg", "/wedding3.jpg", "/wedding4.jpg", "/wedding5.jpg", "/wedding6.jpg", "/wedding7.jpg", "/wedding8.jpg"],
      client: "Sarah & John",
      date: "June 2024"
    },
    {
      id: "portrait-emma",
      title: "Emma's Professional Portraits",
      category: "Portrait Photography",
      description: "Professional headshots and personal branding photography for a successful entrepreneur. Clean, modern style that captures personality and professionalism.",
      stats: "PORTRAIT • 8 PHOTOS • COMPLETED",
      coverImage: "/portrait.jpg",
      images: ["/portrait.jpg", "/portrait2.jpg", "/portrait3.jpg", "/portrait4.jpg", "/portrait5.jpg", "/portrait6.jpg", "/portrait7.jpg", "/portrait8.jpg"],
      client: "Emma Rodriguez",
      date: "May 2024"
    },
    {
      id: "commercial-restaurant",
      title: "Nyandungu Restaurant",
      category: "Commercial Photography",
      description: "Complete restaurant photography including interior shots, food styling, and team portraits. Created a comprehensive visual brand package for marketing materials.",
      stats: "COMMERCIAL • 9 PHOTOS • COMPLETED",
      coverImage: "/commercial1.jpg",
      images: ["/commercial1.jpg", "/commercial2.jpg", "/commercial3.jpg", "/commercial4.jpg", "/commercial5.jpg", "/commercial6.jpg", "/commercial7.jpg", "/commercial8.jpg"],
      client: "Bella Vista Restaurant",
      date: "April 2024"
    },
    {
      id: "event-tech-conference",
      title: "Tech Innovation Summit 2024",
      category: "Event Photography",
      description: "Corporate event coverage including keynote speakers, networking sessions, and product demonstrations. Professional documentation of a major industry conference.",
      stats: "EVENT • 11 PHOTOS • COMPLETED",
      coverImage: "/4.jpg",
      images: ["/4.jpg", "/5.jpg", "/6.jpg", "/7.jpg", "/8.jpg"],
      client: "Tech Innovations Inc.",
      date: "March 2024"
    },
    {
      id: "landscape-mountains",
      title: "Rwanda Mountain Landscapes",
      category: "Landscape Photography",
      description: "Breathtaking landscape photography showcasing Rwanda's natural beauty. Captured during golden hour and blue hour for optimal lighting conditions.",
      stats: "LANDSCAPE • 10 PHOTOS • COMPLETED",
      coverImage: "/7.jpg",
      images: ["/7.jpg", "/8.jpg", "/1.jpg", "/2.jpg"],
      client: "Personal Project",
      date: "February 2024"
    },
    {
      id: "food-artisan-cafe",
      title: "Artisan Café Menu Photography",
      category: "Food Photography",
      description: "Styled food photography for a local café's new menu. Each dish carefully arranged and lit to showcase texture, color, and appetizing presentation.",
      stats: "FOOD • 8 PHOTOS • COMPLETED",
      coverImage: "/8.jpg",
      images: ["/8.jpg", "/1.jpg", "/2.jpg", "/3.jpg", "/4.jpg"],
      client: "Artisan Café",
      date: "January 2024"
    }
  ];

  useEffect(() => {
    if (theme) {
      document.documentElement.classList.remove("dark", "light");
      document.documentElement.classList.add(theme);
      localStorage.setItem("theme", theme);
    }
  }, [theme]);
  // Add this useEffect after other useEffects
  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        // First, let's test if the backend is accessible
        try {
          await api.get('/health');
          console.log('✅ Backend health check successful');
        } catch (healthError: unknown) {
          const error = healthError as { message?: string; response?: { status?: number; statusText?: string; data?: unknown }; config?: unknown };
          console.error('❌ Backend health check failed:', healthError);
          console.error('❌ Health check error details:', {
            message: error.message,
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            config: error.config
          });
        }
        
        // Test the gallery endpoint directly
        const response = await api.get('/gallery');
        
        if (response.data.photos && response.data.photos.length > 0) {
          console.log(`✅ Loaded ${response.data.photos.length} photos successfully`);
          setPhotos(response.data.photos);
        } else {
          console.log('⚠️ No photos found in response');
          setPhotos([]);
        }
        
        setLoading(false);
      } catch (error: unknown) {
        const apiError = error as { 
          message?: string; 
          response?: { 
            status?: number; 
            statusText?: string; 
            data?: unknown 
          }; 
          config?: unknown;
          code?: string;
        };
        console.error("❌ Error fetching photos:", error);
        console.error("❌ Error details:", {
          message: apiError.message,
          status: apiError.response?.status,
          statusText: apiError.response?.statusText,
          data: apiError.response?.data,
          config: apiError.config,
          baseURL: api.defaults.baseURL
        });
        
        if (apiError.response?.status === 404) {
          console.error("❌ 404: Gallery endpoint not found");
        } else if (apiError.response?.status === 403) {
          console.error("❌ 403: CORS issue - Access forbidden");
        } else if (apiError.code === 'ECONNREFUSED') {
          console.error("❌ Connection refused - Backend not accessible");
        } else if (apiError.code === 'ENOTFOUND') {
          console.error("❌ Host not found - Check backend URL");
        } else if (apiError.code === 'NETWORK_ERROR') {
          console.error("❌ Network error - Check internet connection");
        }
        
        setPhotos([]);
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const toggleMobileNav = () => {
    setIsMobileNavOpen(!isMobileNavOpen);
  };

  // Scroll to top functionality
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setShowScrollToTop(scrollTop > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create email body
      const emailBody = `
New Photography Booking Inquiry

Client Details:
- Name: ${formData.firstName} ${formData.lastName}
- Email: ${formData.email}
- Phone: ${formData.phone}
- Service Type: ${formData.serviceType}
- Event Date: ${formData.eventDate || 'Not specified'}

Message:
${formData.message}

---
This message was sent from the Teoflys Photography website contact form.
      `;

      // Create mailto link
      const mailtoLink = `mailto:dushimedieudonne9@gmail.com?subject=Photography Booking - ${formData.serviceType}&body=${encodeURIComponent(emailBody)}`;
      
      // Open email client
      window.location.href = mailtoLink;

      // Reset form after a short delay
      setTimeout(() => {
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          serviceType: '',
          eventDate: '',
          message: ''
        });
        setIsSubmitting(false);
        alert('Thank you for your inquiry! Your email client should open shortly. If not, please contact us directly at helloteofly@gmail.com');
      }, 1000);

    } catch (error) {
      console.error('Error submitting form:', error);
      setIsSubmitting(false);
      alert('There was an error submitting your form. Please try again or contact us directly.');
    }
  };

  // Portfolio functions
  const openProjectDialog = (project: PortfolioProject) => {
    setSelectedProject(project);
    setProjectImageIndex(0);
  };

  const closeProjectDialog = () => {
    setSelectedProject(null);
    setProjectImageIndex(0);
  };

  const nextProjectImage = () => {
    if (selectedProject) {
      setProjectImageIndex((prev) => 
        prev === selectedProject.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevProjectImage = () => {
    if (selectedProject) {
      setProjectImageIndex((prev) => 
        prev === 0 ? selectedProject.images.length - 1 : prev - 1
      );
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-white text-black dark:bg-black dark:text-white animate-fade-in">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-black z-50 animate-slide-down">
        <div className="text-3xl font-bold text-yellow-500 dark:text-yellow-400 animate-pulse">
          Teoflys
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-8">
          <Link
            href="#"
            className="text-gray-700 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors duration-300"
          >
            HOME
          </Link>
          <Link
            href="#about"
            className="text-gray-700 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors duration-300"
          >
            ABOUT ME
          </Link>
          <Link
            href="#portfolio"
            className="text-gray-700 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors duration-300"
          >
            PORTFOLIO
          </Link>
          <Link
            href="#gallery"
            className="text-gray-700 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors duration-300"
          >
            GALLERY
          </Link>
          <Link
            href="#services"
            className="text-gray-700 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors duration-300"
          >
            SERVICES
          </Link>
          <Link
            href="/testimonials"
            className="text-gray-700 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors duration-300"
          >
            TESTIMONIALS
          </Link>
          <Link
            href="#contact"
            className="text-gray-700 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors duration-300"
          >
            CONTACT
          </Link>
        </nav>

        {/* Mobile Menu Button & Contact */}
        <div className="flex items-center gap-4">
          {/* <Link href="#contact">
            <Button className="bg-yellow-500 dark:bg-yellow-400 text-black hover:bg-yellow-600 dark:hover:bg-yellow-500 text-xs sm:text-sm px-3 sm:px-4 transition-all duration-300 hover:scale-105">
              CONTACT US
            </Button>
          </Link> */}
          <button
            onClick={toggleTheme}
            className="rounded-full p-2 border border-gray-400 bg-gray-100 dark:bg-gray-800 text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-110"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? "🌙" : "☀️"}
          </button>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800 transition-all duration-300"
            onClick={toggleMobileNav}
          >
            <Menu className="w-6 h-6" />
          </Button>
        </div>
      </header>

      {/* Mobile Navigation */}
      <MobileNav isOpen={isMobileNavOpen} onToggle={toggleMobileNav} />

      {/* Hero Section */}
      <section className="px-4 sm:px-6 py-8 sm:py-16 bg-gray-100 dark:bg-black animate-fade-in">
        <div className="max-w-7xl mx-auto">
          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2 animate-fade-in-up">
            STANDARD PHOTOGRAPHY BY
          </div>
          <div className="flex flex-col xl:flex-row items-start justify-between mb-8 sm:mb-12">
            <h1 className="text-4xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 xl:mb-0 leading-tight text-gray-900 dark:text-white animate-fade-in-up">
              TEOFLYS IMAGE
            </h1>
            <div className="flex flex-row sm:flex-col items-center sm:items-start gap-4 animate-fade-in-up">
              <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                LET&apos;S
              </span>
              <Button className="bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 rounded-full px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base text-white transition-all duration-300 hover:scale-105">
                WORK TOGETHER
              </Button>
            </div>
          </div>

          <div className="animate-fade-in-up">
            <picture>
              <source
                srcSet="/hero.png?height=600&width=1200"
                media="(min-width: 768px)"
                width={1200}
                height={600}
              />
              <Image
                src="/hero.png?height=600&width=1200"
                alt="Hero Image"
                width={480}
                height={600}
                className="w-full h-auto object-cover rounded-lg shadow-lg transition-all duration-300 hover:scale-105"
              />
            </picture>
          </div>

          {/* Category Tags - Enhanced Mobile Layout */}
          <div className="flex flex-wrap gap-2 sm:gap-3 px-6 mt-4">
            {[
              { label: "FOOD PHOTOGRAPHY", show: "" },
              { label: "COMMERCIAL", show: "" },
              { label: "PRODUCT", show: "" },
              { label: "WEDDING", show: "" },
              { label: "LANDSCAPE", show: "hidden sm:inline-flex" },
              { label: "ARCHITECTURAL", show: "hidden md:inline-flex" },
              { label: "PORTRAIT", show: "hidden lg:inline-flex" },
            ].map((item, index) => (
              <div
                key={item.label}
                className={`border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-xs sm:text-sm px-6 py-1.5 rounded-full transition-all duration-300 ease-in-out hover:scale-105 hover:bg-yellow-100 dark:hover:bg-gray-700 shadow-sm ${item.show}`}
                style={{
                  animation: `fadeInUp 0.5s ease ${(index + 1) * 0.1}s both`,
                  opacity: 0,
                  transform: "translateY(10px)",
                }}
              >
                {item.label}
              </div>
            ))}

            {/* Inline style tag for fadeInUp keyframes */}
            <style>
              {`
      @keyframes fadeInUp {
        0% {
          opacity: 0;
          transform: translateY(10px);
        }
        100% {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `}
            </style>
          </div>
        </div>
      </section>

      {/* I Am Teoflys Section */}
      <section
        id="about"
        className="px-4 sm:px-6 py-12 sm:py-16 bg-gray-50 dark:bg-gray-900 animate-fade-in"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-row sm:flex-col items-center sm:items-start justify-between mb-6 sm:mb-8 gap-4 animate-fade-in-up">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              I AM{" "}
              <span className="text-yellow-500 dark:text-yellow-400">
                TEOFLYS
              </span>
            </h2>
            <a href="#contact">
            <Button
              variant="outline"
              className="border-yellow-500 dark:border-yellow-400 text-yellow-500 dark:text-yellow-400 hover:bg-yellow-500 dark:hover:bg-yellow-400 hover:text-white dark:hover:text-black bg-transparent text-sm sm:text-base px-4 sm:px-6 transition-all duration-300 hover:scale-105"
            >
              CONTACT
            </Button></a>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12">
            <div className="h-[500px] bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden animate-fade-in-left">
              <Image
                src="/2.jpg"
                alt="Teoflys portrait"
                width={480}
                height={300}
                className="w-full h-full object-cover transition-all duration-300 hover:scale-105"
              />
            </div>

            <div className="space-y-6 sm:space-y-8 animate-fade-in-right">
              <div>
                <h3 className="text-yellow-500 dark:text-yellow-400 text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex gap-2 items-center">
                  <StarIcon /> Introduction
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
                  I&apos;m a professional photographer with over 3 years of
                  experience in capturing life&apos;s most precious moments. My
                  passion lies in creating timeless images that tell compelling
                  stories. Whether it&apos;s a wedding, corporate event, or
                  personal portrait session, I bring creativity, technical
                  expertise, and a keen eye for detail to every project.
                </p>
              </div>

              <div>
                <h3 className="text-yellow-500 dark:text-yellow-400 text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex gap-2 items-center ">
                  <StarIcon /> Contact Information
                </h3>
                <div className="">
                  <div className="flex flex-row items-center justify-between w-full space-x-2 sm:space-x-4 md:space-x-6">
                    <a 
                      href="mailto:theonyn11@gmail.com"
                      className="flex-1 flex flex-col items-center gap-1 text-center min-w-0 hover:scale-105 transition-transform duration-300"
                    >
                      <div className="flex items-center gap-1 sm:gap-2">
                        <Mail className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-yellow-500 dark:text-yellow-400 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm">
                          Email
                        </span>
                      </div>
                      <span className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm md:text-base truncate hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors">
                        theonyn11@gmail.com
                      </span>
                    </a>
                    <a 
                      href="tel:+212620487204"
                      className="flex-1 flex flex-col items-center gap-1 text-center min-w-0 hover:scale-105 transition-transform duration-300"
                    >
                      <div className="flex items-center gap-1 sm:gap-2">
                        <Phone className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-yellow-500 dark:text-yellow-400 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm">
                          Phone
                        </span>
                      </div>
                      <span className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm md:text-base truncate hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors">
                        +212 620-487204
                      </span>
                    </a>
                    <div className="flex-1 flex flex-col items-center gap-1 text-center min-w-0">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <MapPin className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-yellow-500 dark:text-yellow-400 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm">
                          Address
                        </span>
                      </div>
                      <span className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm md:text-base truncate">
                        Marroco, Rabat
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-center items-center w-full gap-4 mt-6">
                    {/* Social Icons */}
                    <div className="flex gap-3 sm:gap-4 bg-yellow-500 dark:bg-yellow-400 opacity-80 w-full sm:w-auto p-3 sm:p-3 rounded-full justify-center transition-all duration-300 hover:scale-105">
                      <a
                        href="https://www.facebook.com/teoflyphotography"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-black p-2 rounded-full transition-all duration-300 hover:scale-110 hover:bg-blue-600"
                        aria-label="Follow us on Facebook"
                      >
                        <FaFacebook className="text-white w-5 h-5 sm:w-6 sm:h-6" />
                      </a>
                      <a
                        href="https://www.tiktok.com/@teoflyphotography"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-black p-2 rounded-full transition-all duration-300 hover:scale-110 hover:bg-pink-600"
                        aria-label="Follow us on TikTok"
                      >
                        <SiTiktok className="text-white w-5 h-5 sm:w-6 sm:h-6" />
                      </a>
                      <a
                        href="https://www.linkedin.com/company/teoflyphotography"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-black p-2 rounded-full transition-all duration-300 hover:scale-110 hover:bg-blue-700"
                        aria-label="Follow us on LinkedIn"
                      >
                        <FaLinkedin className="text-white w-5 h-5 sm:w-6 sm:h-6" />
                      </a>
                      <a
                        href="https://www.instagram.com/teoflyphotography"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-black p-2 rounded-full transition-all duration-300 hover:scale-110 hover:bg-pink-500"
                        aria-label="Follow us on Instagram"
                      >
                        <InstagramIcon className="text-white w-5 h-5 sm:w-6 sm:h-6" />
                      </a>
                      <a
                        href="https://www.snapchat.com/add/teoflyphotography"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-black p-2 rounded-full transition-all duration-300 hover:scale-110 hover:bg-yellow-400"
                        aria-label="Follow us on Snapchat"
                      >
                        <BsSnapchat className="text-white w-5 h-5 sm:w-6 sm:h-6" />
                      </a>
                      <a
                        href="https://www.youtube.com/@teoflyphotography"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-black p-2 rounded-full transition-all duration-300 hover:scale-110 hover:bg-red-600"
                        aria-label="Follow us on YouTube"
                      >
                        <YoutubeIcon className="text-white w-5 h-5 sm:w-6 sm:h-6" />
                      </a>
                    </div>
                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center w-full sm:w-auto">
                      {/* Button 1 */}
                      <a
                        href="#portfolio"
                        className="p-[2px] bg-gradient-to-r from-yellow-500 via-red-500 to-purple-600 rounded-md w-full sm:w-auto transition-all duration-300 hover:scale-105"
                      >
                        <button className="bg-white dark:bg-black text-yellow-500 dark:text-yellow-400 px-4 sm:px-6 py-2 rounded-md w-full transition-all duration-300 hover:scale-105 hover:brightness-110 text-sm sm:text-base">
                          Our Gallery
                        </button>
                      </a>
                      {/* Button 2 */}
                      {/* <a
                        href="/cv.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-[2px] bg-gradient-to-r from-yellow-500 via-red-500 to-purple-600 rounded-md w-full sm:w-auto transition-all duration-300 hover:scale-105"
                      >
                        <button className="bg-white dark:bg-black text-yellow-500 dark:text-yellow-400 px-4 sm:px-6 py-2 rounded-md w-full transition-all duration-300 hover:scale-105 hover:brightness-110 text-sm sm:text-base">
                          Download CV
                        </button>
                      </a> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Photography Services Section */}
      <section
        id="services"
        className="px-4 sm:px-6 py-12 sm:py-16 bg-white dark:bg-black"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              MY PHOTOGRAPHY SERVICES
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
              Professional photography services tailored to capture your special
              moments with creativity and excellence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Wedding Photography */}
            <div className="bg-gradient-to-br from-pink-50 to-rose-100 dark:from-pink-900/20 dark:to-rose-800/20 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 border border-pink-200 dark:border-pink-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center">
                  <span className="text-2xl">💒</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Wedding Photography
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Capture your special day with timeless elegance. From engagement
                shoots to the big day, I document every precious moment.
              </p>
              <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0"></span>
                  Engagement Sessions
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0"></span>
                  Wedding Day Coverage
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0"></span>
                  Bridal Portraits
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0"></span>
                  Reception Photography
                </li>
              </ul>
            </div>

            {/* Portrait Photography */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-800/20 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
                  <span className="text-2xl">👤</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Portrait Photography
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Professional portraits that capture personality and emotion.
                Perfect for personal branding and family memories.
              </p>
              <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0"></span>
                  Professional Headshots
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0"></span>
                  Family Portraits
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0"></span>
                  Senior Photos
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0"></span>
                  Personal Branding
                </li>
              </ul>
            </div>

            {/* Event Photography */}
            <div className="bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-900/20 dark:to-violet-800/20 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 border border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-violet-500 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🎭</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Event Photography
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Dynamic event coverage for corporate functions, parties, and
                special occasions. Professional lighting and equipment.
              </p>
              <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0"></span>
                  Corporate Events
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0"></span>
                  Birthday Parties
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0"></span>
                  Anniversaries
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0"></span>
                  Special Occasions
                </li>
              </ul>
            </div>

            {/* Commercial Photography */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-800/20 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🏢</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Commercial Photography
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                High-quality product and business photography for marketing,
                advertising, and brand development.
              </p>
              <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0"></span>
                  Product Photography
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0"></span>
                  Real Estate
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0"></span>
                  Restaurant & Food
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0"></span>
                  Business Branding
                </li>
              </ul>
            </div>

            {/* Landscape Photography */}
            <div className="bg-gradient-to-br from-yellow-50 to-amber-100 dark:from-yellow-900/20 dark:to-amber-800/20 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🏔️</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Landscape Photography
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Breathtaking landscape and nature photography. From urban
                cityscapes to serene natural settings.
              </p>
              <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0"></span>
                  Nature Landscapes
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0"></span>
                  Urban Photography
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0"></span>
                  Travel Photography
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0"></span>
                  Aerial Shots
                </li>
              </ul>
            </div>

            {/* Food Photography */}
            <div className="bg-gradient-to-br from-orange-50 to-red-100 dark:from-orange-900/20 dark:to-red-800/20 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 border border-orange-200 dark:border-orange-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🍽️</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Food Photography
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Mouthwatering food photography for restaurants, chefs, and
                culinary businesses. Professional styling and lighting.
              </p>
              <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0"></span>
                  Restaurant Menus
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0"></span>
                  Chef Portraits
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0"></span>
                  Food Styling
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0"></span>
                  Culinary Events
                </li>
              </ul>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">
              Ready to capture your special moments?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#contact">
              <Button className="bg-yellow-500 dark:bg-yellow-400 text-black hover:bg-yellow-600 dark:hover:bg-yellow-500 px-8 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105">
                Book a Session
              </Button>
              </a>
              <a href="#portfolio">
              <Button
                variant="outline"
                className="border-yellow-500 dark:border-yellow-400 text-yellow-500 dark:text-yellow-400 hover:bg-yellow-500 dark:hover:bg-yellow-400 dark:hover:text-black hover:text-black px-8 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105"
              >
                View Portfolio
              </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section
        id="portfolio"
        className="px-4 sm:px-6 py-12 sm:py-16 bg-gray-50 dark:bg-gray-900"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              EXPLORE MY PHOTOGRAPHY WORK
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Discover my latest projects and creative endeavors across different photography styles
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {portfolioProjects.map((project) => (
              <Card 
                key={project.id}
                className="group bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
                onClick={() => openProjectDialog(project)}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-200 dark:bg-gray-700">
                  <Image
                    src={project.coverImage}
                    alt={project.title}
                    width={600}
                    height={600}
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Badge className="bg-yellow-500 text-black mb-2 text-xs">
                      {project.category}
                    </Badge>
                    <p className="text-sm font-medium">Click to view gallery</p>
                  </div>
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/10 backdrop-blur-sm rounded-full p-2">
                      <span className="text-white text-sm font-medium">{project.images.length} photos</span>
                    </div>
                  </div>
                </div>
                <CardContent className="p-4 sm:p-6">
                  <div className="mb-3">
                    <h3 className="font-bold text-lg mb-1 text-gray-900 dark:text-white group-hover:text-yellow-500 transition-colors duration-300">
                      {project.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      {project.stats}
                    </p>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                    {project.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{project.date}</span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-yellow-500 hover:text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 p-2"
                    >
                      View Gallery →
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Project Dialog */}
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 lg:p-6 bg-black/80 backdrop-blur-sm">
            <div className="relative w-full max-w-6xl lg:max-w-5xl xl:max-w-6xl max-h-[95vh] sm:max-h-[90vh] lg:max-h-[95vh] bg-white dark:bg-gray-900 rounded-lg sm:rounded-xl overflow-hidden shadow-2xl mx-2">
              {/* Header */}
              <div className="flex items-center justify-between p-3 sm:p-4 lg:p-5 border-b border-gray-200 dark:border-gray-700">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg sm:text-xl lg:text-xl font-bold text-gray-900 dark:text-white truncate">
                    {selectedProject.title}
                  </h3>
                  <p className="text-xs sm:text-sm lg:text-sm text-gray-500 dark:text-gray-400 truncate">
                    {selectedProject.client} • {selectedProject.date}
                  </p>
                </div>
                <button
                  onClick={closeProjectDialog}
                  className="flex-shrink-0 p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors ml-2"
                >
                  <span className="sr-only">Close</span>
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-5 p-3 sm:p-4 lg:p-5 max-h-[calc(95vh-80px)] sm:max-h-[calc(90vh-140px)] lg:max-h-[calc(85vh-120px)] overflow-y-auto">
                {/* Main Image */}
                <div className="lg:col-span-2 order-1 lg:order-1">
                  <div className="relative aspect-[2/3] sm:aspect-[4/3] lg:aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <Image
                      src={selectedProject.images[projectImageIndex]}
                      alt={`${selectedProject.title} - Image ${projectImageIndex + 1}`}
                      width={400}
                      height={200}
                      className="w-full h-full object-cover"
                      priority
                    />
                    
                    {/* Navigation Arrows */}
                    {selectedProject.images.length > 1 && (
                      <>
                        <button
                          onClick={prevProjectImage}
                          className="absolute left-2 sm:left-4 lg:left-4 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 lg:p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all duration-300"
                        >
                          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                        <button
                          onClick={nextProjectImage}
                          className="absolute right-2 sm:right-4 lg:right-4 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 lg:p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all duration-300"
                        >
                          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </>
                    )}

                    {/* Image Counter */}
                    <div className="absolute bottom-2 sm:bottom-4 lg:bottom-4 right-2 sm:right-4 lg:right-4 bg-black/50 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                      {projectImageIndex + 1} / {selectedProject.images.length}
                    </div>
                  </div>

                  {/* Thumbnail Navigation */}
                  {selectedProject.images.length > 1 && (
                    <div className="flex gap-1.5 sm:gap-2 lg:gap-2 mt-3 sm:mt-4 lg:mt-4 overflow-x-auto pb-2 scrollbar-hide">
                      {selectedProject.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setProjectImageIndex(index)}
                          className={`flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 lg:w-14 lg:h-14 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                            index === projectImageIndex
                              ? 'border-yellow-500 opacity-100'
                              : 'border-gray-300 dark:border-gray-600 opacity-60 hover:opacity-80'
                          }`}
                        >
                          <Image
                            src={image}
                            alt={`Thumbnail ${index + 1}`}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Project Details */}
                <div className="space-y-4 sm:space-y-6 lg:space-y-5 order-2 lg:order-2">
                  <div>
                    <Badge className="bg-yellow-500 text-black mb-2 sm:mb-3 lg:mb-3 text-xs sm:text-sm">
                      {selectedProject.category}
                    </Badge>
                    <h4 className="font-bold text-base sm:text-lg lg:text-lg text-gray-900 dark:text-white mb-2">
                      Project Details
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm lg:text-sm leading-relaxed">
                      {selectedProject.description}
                    </p>
                  </div>

                  <div className="space-y-2.5 sm:space-y-3 lg:space-y-3">
                    <div className="flex items-center gap-2.5 sm:gap-3 lg:gap-3">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-8 lg:h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm lg:text-sm font-medium text-gray-900 dark:text-white">Date</p>
                        <p className="text-xs sm:text-sm lg:text-sm text-gray-500 dark:text-gray-400 truncate">{selectedProject.date}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 sm:gap-3 lg:gap-3">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-8 lg:h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                        <Camera className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm lg:text-sm font-medium text-gray-900 dark:text-white">Photos</p>
                        <p className="text-xs sm:text-sm lg:text-sm text-gray-500 dark:text-gray-400">{selectedProject.images.length} images</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 sm:gap-3 lg:gap-3">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-8 lg:h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-purple-600 dark:text-purple-400 text-xs sm:text-sm font-bold">C</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm lg:text-sm font-medium text-gray-900 dark:text-white">Client</p>
                        <p className="text-xs sm:text-sm lg:text-sm text-gray-500 dark:text-gray-400 truncate">{selectedProject.client}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 sm:pt-4 lg:pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button
                      onClick={closeProjectDialog}
                      className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded-lg transition-all duration-300 text-sm sm:text-base"
                    >
                      Close Gallery
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
      {/* Gallery Section */}
      <section
        id="gallery"
        className="px-4 sm:px-6 py-12 sm:py-16 bg-gray-50 dark:bg-gray-900"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              PHOTO GALLERY
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Explore our latest photography work and creative projects
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-lg" />
              ))}
            </div>
          ) : photos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {photos.map((photo) => (
                <div
                  key={photo._id}
                  className="group relative aspect-square overflow-hidden rounded-lg cursor-pointer bg-gray-200 dark:bg-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  onClick={() => setSelectedPhoto(photo)}
                >
                  <Image
                    src={photo.imageUrl}
                    alt={photo.title}
                    width={400}
                    height={400}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      console.error('❌ Image failed to load:', photo.imageUrl);
                      // Show a fallback or error state
                      e.currentTarget.style.display = 'none';
                      // Add a fallback div
                      const fallbackDiv = document.createElement('div');
                      fallbackDiv.className = 'w-full h-full flex items-center justify-center bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400';
                      fallbackDiv.innerHTML = `
                        <div class="text-center">
                          <div class="text-2xl mb-2">📸</div>
                          <div class="text-sm font-medium">${photo.title}</div>
                          <div class="text-xs opacity-75">Image unavailable</div>
                        </div>
                      `;
                      e.currentTarget.parentNode?.appendChild(fallbackDiv);
                    }}
                    onLoad={() => {
                      // Image loaded successfully
                    }}
                    unoptimized={true}
                  />
                  
                  {/* Enhanced overlay with better typography and design */}
                  <div className="absolute inset-0 flex items-end opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                    <div className="w-full p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                      {/* Category badge */}
                      <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full mb-3 border border-white/30">
                        <span className="text-xs font-medium text-white uppercase tracking-wider">
                          {photo.category}
                        </span>
                      </div>
                      
                      {/* Photo title */}
                      <h3 className="text-xl font-bold text-white mb-2 leading-tight drop-shadow-lg">
                        {photo.title}
                      </h3>
                      
                      {/* Optional description or additional info */}
                      {photo.description && (
                        <p className="text-sm text-white/80 leading-relaxed line-clamp-2">
                          {photo.description}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {/* Subtle overlay that's always visible */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📸</div>
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                No Photos Available
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                We couldn't load the gallery photos at the moment.
              </p>
              <button 
                onClick={() => window.location.reload()} 
                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
        </div>

        {/* Photo Modal */}
        <Dialog
          open={!!selectedPhoto}
          onOpenChange={() => setSelectedPhoto(null)}
        >
          {selectedPhoto && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-90">
              <div className="relative w-full max-w-4xl aspect-auto">
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="absolute -top-10 right-0 text-white hover:text-gray-300"
                >
                  Close
                </button>
                <Image
                  src={selectedPhoto.imageUrl}
                  alt={selectedPhoto.title}
                  width={800}
                  height={600}
                  className="w-full h-full object-contain"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                  <h3 className="text-xl font-semibold text-white mb-1">
                    {selectedPhoto.title}
                  </h3>
                  <p className="text-gray-300">{selectedPhoto.description}</p>
                </div>
              </div>
            </div>
          )}
        </Dialog>
      </section>
      {/* FAQ Section */}
      <section
        id="faq"
        className="px-4 sm:px-6 py-8 sm:py-12 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800"
      >
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              FAQ
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
              Common questions about our services
            </p>
          </div>

          <div className="grid gap-3">
            <Accordion type="single" collapsible className="space-y-3">
              <AccordionItem 
                value="item-1" 
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
              >
                <AccordionTrigger className="text-left hover:no-underline text-sm py-4 px-4 font-medium text-gray-900 dark:text-white">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                      <Camera className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span>What photography services do you offer?</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-300 text-sm px-4 pb-4">
                  <div className="pl-8">
                    Portrait, wedding, event, commercial, food, and landscape photography with professional equipment and editing.
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem 
                value="item-2" 
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
              >
                <AccordionTrigger className="text-left hover:no-underline text-sm py-4 px-4 font-medium text-gray-900 dark:text-white">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                      <Calendar className="w-3 h-3 text-green-600 dark:text-green-400" />
                    </div>
                    <span>How do I book a session?</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-300 text-sm px-4 pb-4">
                  <div className="pl-8">
                    Contact us via phone, email, or contact form. We&apos;ll discuss your needs and provide a customized quote.
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem 
                value="item-3" 
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
              >
                <AccordionTrigger className="text-left hover:no-underline text-sm py-4 px-4 font-medium text-gray-900 dark:text-white">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                      <Settings className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span>What&apos;s your photography process?</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-300 text-sm px-4 pb-4">
                  <div className="pl-8">
                    Consultation, planning, photo session, editing, and delivery. We work closely with you throughout.
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem 
                value="item-4" 
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
              >
                <AccordionTrigger className="text-left hover:no-underline text-sm py-4 px-4 font-medium text-gray-900 dark:text-white">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                      <Zap className="w-3 h-3 text-orange-600 dark:text-orange-400" />
                    </div>
                    <span>What equipment do you use?</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-300 text-sm px-4 pb-4">
                  <div className="pl-8">
                    Professional-grade cameras, lenses, and lighting equipment for highest quality results.
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem 
                value="item-5" 
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
              >
                <AccordionTrigger className="text-left hover:no-underline text-sm py-4 px-4 font-medium text-gray-900 dark:text-white">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                      <MapPin className="w-3 h-3 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <span>Can you shoot at specific locations?</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-300 text-sm px-4 pb-4">
                  <div className="pl-8">
                    Yes, we work at studios, outdoor settings, or your preferred venue with location scouting included.
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Compact Contact CTA */}
          <div className="mt-6 text-center">
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg p-4 text-white">
              <h3 className="text-lg font-bold mb-2">Need more info?</h3>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4">
                <a 
                  href="#contact"
                  className="flex items-center space-x-2 bg-white text-yellow-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
                >
                  <Phone className="w-3 h-3" />
                  <span>Call</span>
                </a>
                <a 
                  href="#contact"
                  className="flex items-center space-x-2 bg-white text-yellow-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
                >
                  <Mail className="w-3 h-3" />
                  <span>Email</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Preview Section */}
      <section className="px-4 sm:px-6 py-12 sm:py-16 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-500/10 rounded-full mb-6">
              <svg className="w-8 h-8 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              What Our Clients Say
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
              Real experiences from our valued clients across different photography services. 
              Discover why they chose us and how we helped capture their special moments.
            </p>
            
            {/* Call to Action */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <Link href="/testimonials">
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
                  Share Your Experience
                </Button>
              </Link>
              <Link href="/testimonials">
                <Button 
                  variant="outline"
                  className="border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black font-semibold px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 9H17a1 1 0 110 2h-5.586l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                  View All Testimonials
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Testimonials Preview */}
          <TestimonialsShowcase variant="featured" maxItems={3} />
          
          {/* View All CTA */}
          <div className="text-center">
            <Link href="/testimonials">
              <Button 
                variant="outline"
                className="border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black font-semibold px-8 py-3 rounded-lg transition-all duration-300 hover:scale-105"
              >
                View All Testimonials & Submit Your Own
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section
        id="contact"
        className="px-4 sm:px-6 py-12 sm:py-16 bg-white dark:bg-black"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Let's Work Together
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Ready to capture your special moments? Send us a message or contact us directly via WhatsApp
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12">
            {/* Contact Form */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-xl p-6 sm:p-8">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Send a Message
              </h3>
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                      placeholder="Dux"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                      placeholder="dudu"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                    placeholder="dudufredu@gmail.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                    placeholder="+250786885185"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Service Type *
                  </label>
                  <select
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                  >
                    <option value="">Select a service</option>
                    <option value="Wedding Photography">Wedding Photography</option>
                    <option value="Portrait Photography">Portrait Photography</option>
                    <option value="Event Photography">Event Photography</option>
                    <option value="Commercial Photography">Commercial Photography</option>
                    <option value="Food Photography">Food Photography</option>
                    <option value="Landscape Photography">Landscape Photography</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Event Date
                  </label>
                  <input
                    type="date"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 resize-none"
                    placeholder="Tell us about your project, event details, preferred style, budget, and any special requirements..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>

            {/* Quick Contact Options */}
            <div className="space-y-6">
              {/* WhatsApp Contact */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-800/20 rounded-xl p-6 sm:p-8 border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-2xl">📱</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      WhatsApp Booking
                    </h3>
                    <p className="text-green-600 dark:text-green-400 text-sm">
                      Instant response guaranteed
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Get instant quotes and quick responses. Perfect for urgent bookings or quick questions.
                </p>
                <a
                  href="https://wa.me/+250786885185?text=Hi%20Teoflys!%20I'm%20interested%20in%20booking%20a%20photography%20session.%20Could%20you%20please%20share%20more%20details%20about%20your%20services%20and%20availability?"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  <span className="text-lg">💬</span>
                  Chat on WhatsApp
                </a>
              </div>

              {/* Email Contact */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-800/20 rounded-xl p-6 sm:p-8 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Email Booking
                    </h3>
                    <p className="text-blue-600 dark:text-blue-400 text-sm">
                      Detailed proposals
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Send detailed project requirements and get comprehensive proposals with pricing and packages.
                </p>
                <a
                  href="mailto:helloteofly@gmail.com?subject=Photography Booking Inquiry&body=Hi Teoflys,%0D%0A%0D%0AI'm interested in booking a photography session. Here are my details:%0D%0A%0D%0AEvent Type: %0D%0ADate: %0D%0ALocation: %0D%0ABudget: %0D%0ASpecial Requirements: %0D%0A%0D%0APlease let me know your availability and pricing.%0D%0A%0D%0AThank you!"
                  className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  <Mail className="w-5 h-5" />
                  Send Email
                </a>
              </div>

              {/* Phone Contact */}
              <div className="bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-900/20 dark:to-violet-800/20 rounded-xl p-6 sm:p-8 border border-purple-200 dark:border-purple-800">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Call Directly
                    </h3>
                    <p className="text-purple-600 dark:text-purple-400 text-sm">
                      Personal consultation
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Speak directly with Teoflys to discuss your vision and requirements.
                </p>
                <div className="space-y-3">
                  <a
                    href="tel:+1234567890"
                    className="inline-flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    <Phone className="w-5 h-5" />
                    +1 (234) 567-890
                  </a>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Available: Mon-Fri 9AM-6PM EST
                  </p>
                </div>
              </div>

              {/* Business Hours */}
              <div className="bg-gradient-to-br from-yellow-50 to-amber-100 dark:from-yellow-900/20 dark:to-amber-800/20 rounded-xl p-6 border border-yellow-200 dark:border-yellow-800">
                <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-yellow-500" />
                  Business Hours
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Monday - Friday</span>
                    <span className="text-gray-900 dark:text-white font-medium">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Saturday</span>
                    <span className="text-gray-900 dark:text-white font-medium">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Sunday</span>
                    <span className="text-gray-900 dark:text-white font-medium">By Appointment</span>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                  <p className="text-xs text-yellow-800 dark:text-yellow-200">
                    💡 <strong>Tip:</strong> For fastest response, use WhatsApp during business hours or email for detailed inquiries.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        id="testimonials"
        className="px-4 sm:px-6 py-12 sm:py-16 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              What My Clients Say
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Real testimonials from satisfied clients across different photography services
            </p>
          </div>

          {/* Carousel Container */}
          <div className="relative overflow-hidden">
            <div className="flex transition-transform duration-500 ease-in-out m-4" id="testimonial-carousel">
              {/* Testimonial 1 */}
              <div className="w-full sm:w-1/2 lg:w-1/3 flex-shrink-0 px-2 sm:px-4">
                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center gap-1 mb-3 sm:mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base italic">
                      &quot;Absolutely amazing photographer! Teoflys captured our wedding day perfectly. The attention to detail and artistic vision was exceptional.&quot;
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-yellow-400 shadow-lg">
                        <Image
                          src="/1.jpg"
                          alt="Emily Johnson"
                          width={56}
                          height={56}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white">
                          ISHIMWE kevin
                        </div>
                        <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                          Wedding Client
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Testimonial 2 */}
              <div className="w-full sm:w-1/2 lg:w-1/3 flex-shrink-0 px-2 sm:px-4">
                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center gap-1 mb-3 sm:mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base italic">
                      &quot;Professional, creative, and reliable. Teoflys delivered exactly what we needed for our corporate event. Highly recommended!&quot;
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-green-400 shadow-lg">
                        <Image
                          src="/2.jpg"
                          alt="Alex Smith"
                          width={56}
                          height={56}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white">
                          TUMUKUNDE JEAN DE DIEU
                        </div>
                        <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                          Corporate Client
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Testimonial 3 */}
              <div className="w-full sm:w-1/2 lg:w-1/3 flex-shrink-0 px-2 sm:px-4">
                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center gap-1 mb-3 sm:mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base italic">
                      &quot;The portrait session exceeded my expectations. Teoflys has an incredible eye for capturing personality and emotion.&quot;
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-purple-400 shadow-lg">
                        <Image
                          src="/3.jpg"
                          alt="Samantha Davis"
                          width={56}
                          height={56}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white">
                          KAGAME DANIEL
                        </div>
                        <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                          Portrait Client
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Testimonial 4 */}
              <div className="w-full sm:w-1/2 lg:w-1/3 flex-shrink-0 px-2 sm:px-4">
                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center gap-1 mb-3 sm:mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base italic">
                      &quot;Outstanding food photography! Teoflys made our dishes look absolutely irresistible. Perfect for our restaurant's marketing.&quot;
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-orange-400 shadow-lg">
                        <Image
                          src="/4.jpg"
                          alt="Michael Chen"
                          width={56}
                          height={56}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white">
                          MUGABE Milk
                        </div>
                        <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                          Restaurant Owner
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Testimonial 5 */}
              <div className="w-full sm:w-1/2 lg:w-1/3 flex-shrink-0 px-2 sm:px-4">
                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center gap-1 mb-3 sm:mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base italic">
                      &quot;Incredible landscape photography! Teoflys captured the beauty of nature in ways I never imagined possible.&quot;
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-teal-400 shadow-lg">
                        <Image
                          src="/5.jpg"
                          alt="Robert Johnson"
                          width={56}
                          height={56}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white">
                          ISHIMWE lionel
                        </div>
                        <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                          Nature Enthusiast
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Testimonial 6 */}
              <div className="w-full sm:w-1/2 lg:w-1/3 flex-shrink-0 px-2 sm:px-4">
                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center gap-1 mb-3 sm:mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base italic">
                      &quot;Perfect event coverage! Teoflys captured every special moment of our celebration with creativity and professionalism.&quot;
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-pink-400 shadow-lg">
                        <Image
                          src="/6.jpg"
                          alt="Lisa Martinez"
                          width={56}
                          height={56}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white">
                          UMUKIZA Lisa
                        </div>
                        <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                          Event Organizer
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Navigation Buttons */}
            <Button
              size="icon"
              variant="outline"
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 w-8 h-8 sm:w-10 sm:h-10 shadow-lg z-10"
              onClick={() => {
                const carousel = document.getElementById('testimonial-carousel');
                if (carousel) {
                  const currentTransform = carousel.style.transform;
                  const currentX = currentTransform === 'none' ? 0 : parseInt(currentTransform.match(/-?\d+/)?.[0] || '0');
                  const slideWidth = window.innerWidth < 640 ? 100 : (window.innerWidth < 1024 ? 50 : 33.33); // 100% on mobile, 50% on tablet, 33.33% on desktop
                  const newX = Math.min(0, currentX + slideWidth);
                  carousel.style.transform = `translateX(${newX}%)`;
                }
              }}
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 w-8 h-8 sm:w-10 sm:h-10 shadow-lg z-10"
              onClick={() => {
                const carousel = document.getElementById('testimonial-carousel');
                if (carousel) {
                  const currentTransform = carousel.style.transform;
                  const currentX = currentTransform === 'none' ? 0 : parseInt(currentTransform.match(/-?\d+/)?.[0] || '0');
                  const slideWidth = window.innerWidth < 640 ? 100 : (window.innerWidth < 1024 ? 50 : 33.33); // 100% on mobile, 50% on tablet, 33.33% on desktop
                  const maxX = window.innerWidth < 640 ? -500 : (window.innerWidth < 1024 ? -200 : -166.67); // Max scroll based on number of slides
                  const newX = Math.max(maxX, currentX - slideWidth);
                  carousel.style.transform = `translateX(${newX}%)`;
                }
              }}
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </div>

          {/* Carousel Indicators */}
          <div className="flex justify-center gap-2 mt-6 sm:mt-8">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <button
                key={index}
                className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-gray-300 dark:bg-gray-600 hover:bg-yellow-400 dark:hover:bg-yellow-400 transition-colors duration-300"
                onClick={() => {
                  const carousel = document.getElementById('testimonial-carousel');
                  if (carousel) {
                    const slideWidth = window.innerWidth < 640 ? 100 : (window.innerWidth < 1024 ? 50 : 33.33);
                    const translateX = -(index * slideWidth);
                    carousel.style.transform = `translateX(${translateX}%)`;
                  }
                }}
              />
            ))}
          </div>
        </div>
      </section>
    
      {/* Footer */}
      <footer className="relative px-4 sm:px-6 py-12 sm:py-16 border-t border-gray-200 dark:border-gray-800 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-black dark:to-gray-900 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-400 rounded-full animate-pulse"></div>
          <div className="absolute top-20 right-20 w-16 h-16 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-8 sm:mb-12">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 bg-clip-text text-transparent animate-pulse">
                  TEOFLYS
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-ping"></div>
                  <span className="text-sm sm:text-base font-medium text-gray-600 dark:text-gray-400">
                    Photography Studio
                  </span>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base mb-6 max-w-md leading-relaxed">
                Capturing life's most precious moments with creativity, passion, and professional excellence. 
                Let's create timeless memories together.
              </p>
              <div className="flex items-center gap-4">
                <a href="#contact">
                <button className="group relative px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-medium text-sm sm:text-base overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  <span className="relative z-10">WORK TOGETHER</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button></a>
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <div className="w-1 h-1 bg-yellow-500 rounded-full animate-pulse"></div>
                  <span className="text-xs sm:text-sm">Available for bookings</span>
                </div>
              </div>
            </div>

            {/* Services Section */}
            <div className="group">
              <h4 className="font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 text-lg sm:text-xl relative">
                SERVICES
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-500 to-orange-500 group-hover:w-full transition-all duration-300"></div>
              </h4>
              <ul className="space-y-3">
                {[
                  { name: 'WEDDING', link: '/services/wedding' },
                  { name: 'PORTRAIT', link: '/services/portrait' },
                  { name: 'EVENTS', link: '/services/events' },
                  { name: 'COMMERCIAL', link: '/services/commercial' },
                  { name: 'FOOD', link: '/services/food' },
                  { name: 'LANDSCAPE', link: '/services/landscape' }
                ].map((service) => (
                  <li key={service.name} className="group/item">
                    <a 
                      href={service.link} 
                      className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-400 transition-all duration-300 text-sm sm:text-base group-hover/item:translate-x-1"
                    >
                      <div className="w-1 h-1 bg-yellow-500 rounded-full opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"></div>
                      {service.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Section */}
            <div className="group">
              <h4 className="font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 text-lg sm:text-xl relative">
                COMPANY
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-500 to-orange-500 group-hover:w-full transition-all duration-300"></div>
              </h4>
              <ul className="space-y-3">
                {['ABOUT', 'PORTFOLIO', 'CONTACT', 'BLOG', 'TESTIMONIALS', 'PRICING'].map((item) => (
                  <li key={item} className="group/item">
                    <a href="#" className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-400 transition-all duration-300 text-sm sm:text-base group-hover/item:translate-x-1">
                      <div className="w-1 h-1 bg-yellow-500 rounded-full opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"></div>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact & Social Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 sm:mb-12">
            {/* Contact Info */}
            <div className="space-y-4">
              <h4 className="font-bold text-gray-900 dark:text-white text-lg sm:text-xl mb-4">GET IN TOUCH</h4>
              <div className="space-y-3">
                <a 
                  href="mailto:theonyn11@gmail.com"
                  className="flex items-center gap-3 group hover:scale-105 transition-transform duration-300"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Mail className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                    <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-medium hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors">theonyn11@gmail.com</p>
                  </div>
                </a>
                <a 
                  href="tel:+212620487204"
                  className="flex items-center gap-3 group hover:scale-105 transition-transform duration-300"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Phone className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Phone</p>
                    <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-medium hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors">+212 620-487204</p>
                  </div>
                </a>
                <div className="flex items-center gap-3 group">
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Location</p>
                    <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-medium">Marroco, Rabat</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="space-y-4">
              <h4 className="font-bold text-gray-900 dark:text-white text-lg sm:text-xl mb-4">FOLLOW US</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-3">
                {[
                  { 
                    icon: FaFacebook, 
                    name: 'Facebook', 
                    color: 'from-blue-600 to-blue-700',
                    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
                    borderColor: 'border-blue-200 dark:border-blue-800',
                    textColor: 'text-blue-600 dark:text-blue-400',
                    url: 'https://www.facebook.com/teoflyphotography'
                  },
                  { 
                    icon: SiTiktok, 
                    name: 'TikTok', 
                    color: 'from-pink-500 to-purple-600',
                    bgColor: 'bg-pink-50 dark:bg-pink-900/20',
                    borderColor: 'border-pink-200 dark:border-pink-800',
                    textColor: 'text-pink-600 dark:text-pink-400',
                    url: 'https://www.tiktok.com/@teoflyphotography'
                  },
                  { 
                    icon: FaLinkedin, 
                    name: 'LinkedIn', 
                    color: 'from-blue-700 to-blue-800',
                    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
                    borderColor: 'border-blue-200 dark:border-blue-800',
                    textColor: 'text-blue-600 dark:text-blue-400',
                    url: 'https://www.linkedin.com/company/teoflyphotography'
                  },
                  { 
                    icon: InstagramIcon, 
                    name: 'Instagram', 
                    color: 'from-pink-500 to-purple-500',
                    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
                    borderColor: 'border-purple-200 dark:border-purple-800',
                    textColor: 'text-purple-600 dark:text-purple-400',
                    url: 'https://www.instagram.com/teoflyphotography'
                  },
                  { 
                    icon: BsSnapchat, 
                    name: 'Snapchat', 
                    color: 'from-yellow-400 to-orange-500',
                    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
                    borderColor: 'border-yellow-200 dark:border-yellow-800',
                    textColor: 'text-yellow-600 dark:text-yellow-400',
                    url: 'https://www.snapchat.com/add/teoflyphotography'
                  },
                  { 
                    icon: YoutubeIcon, 
                    name: 'YouTube', 
                    color: 'from-red-600 to-red-700',
                    bgColor: 'bg-red-50 dark:bg-red-900/20',
                    borderColor: 'border-red-200 dark:border-red-800',
                    textColor: 'text-red-600 dark:text-red-400',
                    url: 'https://www.youtube.com/@teoflyphotography'
                  }
                ].map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group relative overflow-hidden ${social.bgColor} border ${social.borderColor} rounded-lg p-2 sm:p-3 hover:shadow-md transition-all duration-300 hover:scale-105 hover:-translate-y-1`}
                    aria-label={`Follow us on ${social.name}`}
                  >
                    {/* Gradient Overlay on Hover */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${social.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                    
                    {/* Content */}
                    <div className="relative z-10 flex flex-col items-center text-center space-y-2">
                      <div className={`w-8 h-8 sm:w-10 sm:h-10 ${social.bgColor} rounded-full flex items-center justify-center group-hover:bg-gradient-to-r ${social.color} transition-all duration-300`}>
                        <social.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${social.textColor} group-hover:text-white transition-colors duration-300`} />
                      </div>
                      
                      <div className="space-y-0.5">
                        <h5 className="font-medium text-gray-900 dark:text-white group-hover:text-white transition-colors duration-300 text-xs sm:text-sm">
                          {social.name}
                        </h5>
                        <p className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-white/80 transition-colors duration-300">
                          Follow
                        </p>
                      </div>
                    </div>
                    
                    {/* Animated Border */}
                    <div className={`absolute inset-0 rounded-lg border ${social.borderColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="flex flex-col sm:flex-row justify-between items-center pt-6 sm:pt-8 border-t border-gray-200 dark:border-gray-700 gap-4">
            <div className="flex items-center gap-4">
              <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm text-center sm:text-left">
                © 2025 Teoflys Photography. All rights reserved.
              </p>
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 bg-yellow-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-400">Made by Dux</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">Powered by</span>
              <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <a href="https://duxthedream.netlify.app/" target="_blank" rel="noopener noreferrer">
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Dux-dudu</span></a>
              </div>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-4 right-4 z-50 w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 ${
          showScrollToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-6 h-6 mx-auto" />
      </button>

      {/* Admin Dashboard Link (visible only if accessToken exists) */}
      {/* {typeof window !== 'undefined' && localStorage.getItem('accessToken') && ( */}
        <div className="fixed bottom-4 left-4 z-50">
          <Link 
            href="/admin" 
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <span className="hidden sm:inline">Teoflys</span>
            <span className="sm:hidden">T</span>
          </Link>
        </div>
      {/* )} */}
    </div>
  );
}
