"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X, Phone, Mail, MapPin, Facebook, InstagramIcon } from "lucide-react"
import Link from "next/link"
import { FaTiktok } from "react-icons/fa6"

interface MobileNavProps {
  isOpen: boolean
  onToggle: () => void
}

export function MobileNav({ isOpen, onToggle }: MobileNavProps) {
  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onToggle}
      />

             {/* Mobile Navigation Menu */}
       <div
         className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 z-50 transform transition-transform duration-300 ease-in-out lg:hidden flex flex-col ${
           isOpen ? "translate-x-0" : "translate-x-full"
         }`}
       >
                 {/* Header */}
         <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
          <div className="text-xl font-bold text-yellow-500 dark:text-yellow-400">Teoflys</div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

                 {/* Navigation Links */}
         <nav className="px-6 py-8 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-yellow-500 scrollbar-track-gray-100 dark:scrollbar-track-gray-800">
           <ul className="space-y-6">
            <li>
              <Link
                href="#"
                onClick={onToggle}
                className="block text-lg font-medium text-gray-900 dark:text-white hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors duration-200 py-2"
              >
                HOME
              </Link>
            </li>
            <li>
              <Link
                href="#about"
                onClick={onToggle}
                className="block text-lg font-medium text-gray-900 dark:text-white hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors duration-200 py-2"
              >
                ABOUT ME
              </Link>
            </li>
            <li>
              <Link
                href="#portfolio"
                onClick={onToggle}
                className="block text-lg font-medium text-gray-900 dark:text-white hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors duration-200 py-2"
              >
                PORTFOLIO
              </Link>
            </li>
            <li>
              <Link
                href="#gallery"
                onClick={onToggle}
                className="block text-lg font-medium text-gray-900 dark:text-white hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors duration-200 py-2"
              >
                GALLERY
              </Link>
            </li>
            <li>
              <Link
                href="#services"
                onClick={onToggle}
                className="block text-lg font-medium text-gray-900 dark:text-white hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors duration-200 py-2"
              >
                SERVICES
              </Link>
            </li>
            <li>
              <Link
                href="#faq"
                onClick={onToggle}
                className="block text-lg font-medium text-gray-900 dark:text-white hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors duration-200 py-2"
              >
                FAQ
              </Link>
            </li>
            <li>
              <Link
                href="#contact"
                onClick={onToggle}
                className="block text-lg font-medium text-gray-900 dark:text-white hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors duration-200 py-2"
              >
                CONTACT
              </Link>
            </li>
            <li>
              <Link
                href="/testimonials"
                onClick={onToggle}
                className="block text-lg font-medium text-gray-900 dark:text-white hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors duration-200 py-2"
              >
                TESTIMONIALS
              </Link>
            </li>
          </ul>
        </nav>

                 {/* Contact Information */}
         <div className="px-6 py-6 border-t border-gray-200 dark:border-gray-800 flex-shrink-0">
          <h3 className="text-yellow-500 dark:text-yellow-400 font-semibold mb-4">Contact Info</h3>
          <div className="space-y-3">
            <a 
              href="tel:+212620487204"
              className="flex items-center gap-3 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors"
            >
              <Phone className="w-4 h-4 text-yellow-500 dark:text-yellow-400 flex-shrink-0" />
              <span className="text-gray-600 dark:text-gray-300 text-sm hover:underline">+212 620-487204</span>
            </a>
            <a 
              href="mailto:theonyn11@gmail.com"
              className="flex items-center gap-3 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors"
            >
              <Mail className="w-4 h-4 text-yellow-500 dark:text-yellow-400 flex-shrink-0" />
              <span className="text-gray-600 dark:text-gray-300 text-sm hover:underline">theonyn11@gmail.com</span>
            </a>
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-yellow-500 dark:text-yellow-400 flex-shrink-0" />
              <span className="text-gray-600 dark:text-gray-300 text-sm">Marroco, Rabat</span>
            </div>
          </div>
        </div>

                 {/* Social Links */}
         <div className="px-6 py-4 flex-shrink-0">
          <div className="flex gap-3">
            <a 
              href="https://www.facebook.com/teoflyphotography" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 bg-yellow-500 dark:bg-yellow-400 rounded-full flex items-center justify-center hover:bg-yellow-600 dark:hover:bg-yellow-500 transition-colors cursor-pointer"
              aria-label="Follow us on Facebook"
            >
              <span className="text-black font-bold"><Facebook className="w-6 h-6" /></span>
            </a>
            <a 
              href="https://www.instagram.com/teofls/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 bg-yellow-500 dark:bg-yellow-400 rounded-full flex items-center justify-center hover:bg-yellow-600 dark:hover:bg-yellow-500 transition-colors cursor-pointer"
              aria-label="Follow us on Instagram"
            >
              <span className="text-black font-bold"><InstagramIcon className="w-6 h-6" /></span>
            </a>
            <a 
              href="https://www.tiktok.com/@teoflyphotography" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 bg-yellow-500 dark:bg-yellow-400 rounded-full flex items-center justify-center hover:bg-yellow-600 dark:hover:bg-yellow-500 transition-colors cursor-pointer"
              aria-label="Follow us on TikTok"
            >
              <span className="text-black font-bold"><FaTiktok className="w-6 h-6" /></span>
            </a>
          </div>
        </div>

                 {/* CTA Button */}
         <div className="px-6 py-4 flex-shrink-0">
          <a href="#contact">
          <Button className="w-full bg-yellow-500 dark:bg-yellow-400 text-black hover:bg-yellow-600 dark:hover:bg-yellow-500 font-semibold py-3" onClick={onToggle}>
            GET IN TOUCH
          </Button>
          </a>
        </div>
      </div>
    </>
  )
}
