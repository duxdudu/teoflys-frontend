/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Upload, Image as ImageIcon, Trash2, Edit3, Eye, EyeOff, Plus, CheckCircle, AlertCircle, LogOut, User, ArrowLeft, MessageCircle } from "lucide-react";
import { useToastContext } from "@/components/ui/toast-provider";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { clearStoredTokens } from "@/lib/utils/auth-storage";

interface GalleryImage {
  _id: string;
  imageUrl: string;
  title: string;
  description?: string;
  category?: string;
  isPublished?: boolean;
}

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: string;
}

const BACKEND_URL = "https://teoflys-backend.onrender.com";

export default function AdminDashboard() {
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("other");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  // Lightweight toast system
  type ToastType = 'success' | 'error' | 'info';
  interface ToastItem { id: number; type: ToastType; text: string }
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const { addToast } = useToastContext();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const pushToast = (toast: { type: ToastType; text: string }) => {
    const id: number = Date.now() + Math.floor(Math.random() * 1000);
    setToasts((prev: ToastItem[]) => [...prev, { id, ...toast }]);
    // Auto-dismiss after 3 seconds
    setTimeout(() => {
      setToasts((prev: ToastItem[]) => prev.filter((t: ToastItem) => t.id !== id));
    }, 3000);
    // Also push to global Toaster
    addToast({ title: toast.text, variant: toast.type === 'error' ? 'destructive' : toast.type === 'success' ? 'success' : 'info' });
  };
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const router = useRouter();

  const categories = [
    { value: "wedding", label: "Wedding" },
    { value: "portrait", label: "Portrait" },
    { value: "event", label: "Event" },
    { value: "commercial", label: "Commercial" },
    { value: "landscape", label: "Landscape" },
    { value: "food", label: "Food" },
    { value: "other", label: "Other" }
  ];

  const fetchGallery = useCallback(async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${BACKEND_URL}/api/admin/photos`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (response.status === 401) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        router.push("/admin/login");
        return;
      }

      const data = await response.json();
      if (data && Array.isArray(data.photos)) {
        setGallery(data.photos);
      } else {
        setGallery([]);
      }
    } catch (error) {
      console.error("Failed to fetch gallery:", error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const userData = localStorage.getItem("user");
    
    if (!token || !userData) {
      router.push("/admin/login");
      return;
    }

    try {
      const user = JSON.parse(userData);
      setAdminUser(user);
    } catch {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      router.push("/admin/login");
      return;
    }

    fetchGallery();
  }, [router, fetchGallery]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    clearStoredTokens();
    router.push("/admin/login");
    window.location.reload();
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) {
      setMessage({ type: 'error', text: 'Please select an image file' });
      return;
    }
    
    setUploading(true);
    setMessage(null);
    
    try {
      const token = localStorage.getItem("accessToken");
      console.log('Uploading with token:', token ? 'Token exists' : 'No token');
      
      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("isPublished", "true");

      console.log('FormData created:', {
        title,
        description,
        category,
        imageFile: imageFile.name,
        imageSize: imageFile.size
      });

      const res = await fetch(`${BACKEND_URL}/api/admin/upload`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
        credentials: "include",
      });
      
      console.log('Response status:', res.status);
      console.log('Response headers:', res.headers);
      
      if (res.status === 401) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        router.push("/admin/login");
        return;
      }
      
      const data = await res.json();
      console.log('Response data:', data);
      
      if (res.ok && data.photo) {
        setGallery([data.photo, ...gallery]);
        setTitle("");
        setDescription("");
        setCategory("other");
        setImageFile(null);
        setMessage({ type: 'success', text: 'Image uploaded successfully!' });
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ type: 'error', text: data.error || data.details || "Upload failed" });
      }
    } catch (err) {
      console.error('Upload error:', err);
      setMessage({ type: 'error', text: "Upload failed. Please try again." });
    } finally {
      setUploading(false);
    }
  };

  const confirmDelete = (id: string) => {
    setPendingDeleteId(id);
    setConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!pendingDeleteId) return;
    const previousGallery = [...gallery];
    setGallery(gallery.filter((img) => img._id !== pendingDeleteId));
    setMessage({ type: 'success', text: 'Deleting image...' });
    pushToast({ type: 'info', text: 'Deleting image…' });
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${BACKEND_URL}/api/admin/photos/${pendingDeleteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.error || 'Failed to delete image');
      }
      setMessage({ type: 'success', text: 'Image deleted successfully!' });
      pushToast({ type: 'success', text: 'Image deleted successfully' });
    } catch (error: any) {
      setGallery(previousGallery);
      setMessage({ type: 'error', text: error?.message || 'Failed to delete image' });
      pushToast({ type: 'error', text: error?.message || 'Failed to delete image' });
    } finally {
      setTimeout(() => setMessage(null), 3000);
      setConfirmOpen(false);
      setPendingDeleteId(null);
    }
  };

  if (!adminUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <button
                onClick={() => router.push("/")}
                className="flex items-center space-x-1 sm:space-x-2 text-gray-600 hover:text-blue-600 transition-colors mr-2 sm:mr-4 px-2 py-1 rounded-md hover:bg-gray-100"
              >
                <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm font-medium hidden sm:inline">Back</span>
              </button>
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <ImageIcon className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900"> Admin</h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={() => router.push("/admin/testimonials")}
                className="flex items-center space-x-1 sm:space-x-2 text-gray-600 hover:text-blue-600 transition-colors px-2 py-1 rounded-md hover:bg-gray-100"
              >
                <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm hidden sm:inline">Testimonials</span>
              </button>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <ThemeToggle />
              <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-600">
                <User className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">{adminUser.name}</span>
                <span className="sm:hidden">Admin</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 sm:space-x-2 text-gray-600 hover:text-red-600 transition-colors px-2 py-1 rounded-md hover:bg-gray-100"
              >
                <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {message && (
          <div className={`mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg flex items-center space-x-2 ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
            ) : (
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
            )}
            <span className="font-medium text-sm sm:text-base">{message.text}</span>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex items-center space-x-2 mb-4 sm:mb-6">
            <Upload className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">Upload New Image</h2>
          </div>
          
          <form onSubmit={handleUpload} className="space-y-3 sm:space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Image Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400 text-sm sm:text-base"
                  placeholder="Enter image title"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 text-sm sm:text-base"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400 text-sm sm:text-base"
                placeholder="Enter image description"
                rows={3}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Select Image *
              </label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="w-full sm:flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 text-sm sm:text-base"
                  required
                />
                {imageFile && (
                  <span className="text-xs sm:text-sm text-green-600 font-medium">
                    ✓ {imageFile.name}
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={uploading}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 sm:px-6 py-2 rounded-lg font-medium transition-colors duration-200 text-sm sm:text-base"
              >
                {uploading ? (
                  <>
                    <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Upload Image</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center space-x-2">
              <ImageIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">Gallery Images</h2>
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                {gallery.length} images
              </span>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-lg h-48 sm:h-64 animate-pulse" />
              ))}
            </div>
          ) : gallery.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <ImageIcon className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1 sm:mb-2">No images yet</h3>
              <p className="text-sm sm:text-base text-gray-500">Upload your first image to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {gallery.map((img) => (
                <div key={img._id} className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow duration-200">
                  <div className="relative aspect-square">
                    <Image 
                      src={img.imageUrl} 
                      alt={img.title} 
                      width={300}
                      height={300}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      {img.isPublished ? (
                        <Eye className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 bg-white rounded-full p-1" />
                      ) : (
                        <EyeOff className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 bg-white rounded-full p-1" />
                      )}
                    </div>
                  </div>
                  
                  <div className="p-3 sm:p-4">
                    <h3 className="font-semibold text-gray-900 mb-1 truncate text-sm sm:text-base">
                      {img.title}
                    </h3>
                    {img.description && (
                      <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">
                        {img.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {img.category || 'other'}
                      </span>
                      <div className="flex space-x-1">
                        <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                          <Edit3 className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                        <button 
                          onClick={() => confirmDelete(img._id)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete image?</DialogTitle>
          </DialogHeader>
          <div className="text-sm text-gray-600">
            This action cannot be undone. The image will be removed from the gallery and storage.
          </div>
          <DialogFooter>
            <button
              onClick={() => setConfirmOpen(false)}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white"
            >
              Delete
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Toasts */}
      {toasts.length > 0 && (
        <div className="fixed bottom-4 right-4 z-50 space-y-2 w-[calc(100%-2rem)] sm:w-80">
          {toasts.map((t: ToastItem) => (
            <div
              key={t.id}
              className={`flex items-start gap-3 rounded-lg shadow-lg border p-3 backdrop-blur-sm
                ${t.type === 'success' ? 'bg-green-50/90 border-green-200 text-green-900' : ''}
                ${t.type === 'error' ? 'bg-red-50/90 border-red-200 text-red-900' : ''}
                ${t.type === 'info' ? 'bg-gray-50/90 border-gray-200 text-gray-900' : ''}
              `}
            >
              <span className={`mt-0.5 inline-block w-2 h-2 rounded-full
                ${t.type === 'success' ? 'bg-green-500' : ''}
                ${t.type === 'error' ? 'bg-red-500' : ''}
                ${t.type === 'info' ? 'bg-gray-500' : ''}
              `}/>
              <div className="text-sm leading-snug break-words">{t.text}</div>
              <button
                onClick={() => setToasts((prev: ToastItem[]) => prev.filter((x: ToastItem) => x.id !== t.id))}
                className="ml-auto text-xs text-gray-500 hover:text-gray-800"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 