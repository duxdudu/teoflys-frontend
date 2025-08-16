"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, CheckCircle, XCircle, Eye, Trash2, BarChart3, MessageCircle, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import api from "@/lib/utils/axios-config";
import TestimonialsAnalytics from "@/app/components/TestimonialsAnalytics";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface Testimonial {
  _id: string;
  name: string;
  email: string;
  rating: number;
  message: string;
  category: string;
  isApproved: boolean;
  isPublished: boolean;
  adminNotes?: string;
  createdAt: string;
}

interface TestimonialsResponse {
  testimonials: Testimonial[];
  pagination: {
    currentPage: number;
    totalPages: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

interface Stats {
  total: number;
  pending: number;
  approved: number;
  published: number;
  categoryStats: Array<{ _id: string; count: number }>;
  ratingStats: Array<{ _id: number; count: number }>;
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
  wedding: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
  portrait: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  landscape: 'bg-green-500/20 text-green-300 border-green-500/30',
  food: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  events: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  commercial: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
  other: 'bg-gray-500/20 text-gray-300 border-gray-500/30'
};

export default function AdminTestimonials() {
  const router = useRouter();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState<Stats | null>(null);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    hasNext: false,
    hasPrev: false
  });
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [successOpen, setSuccessOpen] = useState(false);

  const statusOptions = [
    { value: 'all', label: 'All Testimonials' },
    { value: 'pending', label: 'Pending Approval' },
    { value: 'approved', label: 'Approved' },
    { value: 'published', label: 'Published' }
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'wedding', label: 'Wedding' },
    { value: 'portrait', label: 'Portrait' },
    { value: 'landscape', label: 'Landscape' },
    { value: 'food', label: 'Food' },
    { value: 'events', label: 'Events' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'other', label: 'Other' }
  ];

  const fetchTestimonials = async (page: number = 1, status: string = 'all', category: string = 'all') => {
    try {
      setLoading(true);
      setError('');
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10'
      });
      
      if (status !== 'all') {
        params.append('status', status);
      }
      
      if (category !== 'all') {
        params.append('category', category);
      }

      const token = localStorage.getItem('accessToken');
      const response = await api.get<TestimonialsResponse>(`/testimonials/admin/all?${params}` , {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      
      setTestimonials(response.data.testimonials);
      setPagination(response.data.pagination);
      setCurrentPage(page);
      
    } catch (error: unknown) {
      setError('Failed to load testimonials. Please try again.');
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await api.get('/testimonials/admin/stats', {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchTestimonials(1, selectedStatus, selectedCategory);
    fetchStats();
  }, [selectedStatus, selectedCategory]);

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    fetchTestimonials(page, selectedStatus, selectedCategory);
  };

  const openModal = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial);
    setAdminNotes(testimonial.adminNotes || '');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTestimonial(null);
    setAdminNotes('');
  };

  const handleAction = async (action: 'approve' | 'publish' | 'reject' | 'delete') => {
    if (!selectedTestimonial) return;

    setActionLoading(action);
    
    try {
      if (action === 'delete') {
        setPendingDeleteId(selectedTestimonial._id);
        return setConfirmOpen(true);
      } else {
        const updateData: Record<string, unknown> = {};
        
        if (action === 'approve') {
          updateData.isApproved = true;
          updateData.isPublished = false;
        } else if (action === 'publish') {
          updateData.isApproved = true;
          updateData.isPublished = true;
        } else if (action === 'reject') {
          updateData.isApproved = false;
          updateData.isPublished = false;
        }
        
        if (adminNotes) {
          updateData.adminNotes = adminNotes;
        }

        const token = localStorage.getItem('accessToken');
        
        // Use the correct endpoint based on action
        if (action === 'reject') {
          await api.put(`/testimonials/admin/reject/${selectedTestimonial._id}`, updateData, {
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          });
        } else {
          // For approve and publish, use the approve endpoint
          await api.put(`/testimonials/admin/approve/${selectedTestimonial._id}`, updateData, {
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          });
        }
        
        // Update local state
        setTestimonials(prev => prev.map(t => 
          t._id === selectedTestimonial._id 
            ? { ...t, ...updateData }
            : t
        ));
        
        closeModal();
      }
      
      // Refresh stats
      fetchStats();
      
    } catch (error: unknown) {
      console.error(`Error ${action}ing testimonial:`, error);
      const errorMessage = error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'error' in error.response.data ? error.response.data.error : 'Unknown error';
      alert(`Failed to ${action} testimonial: ${errorMessage}`);
    } finally {
      setActionLoading(null);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => {
      const starNumber = index + 1;
      const isFilled = starNumber <= rating;
      
      return (
        <Star
          key={starNumber}
          className={`w-4 h-4 ${
            isFilled ? 'text-yellow-400 fill-current' : 'text-gray-400'
          }`}
        />
      );
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (testimonial: Testimonial) => {
    if (!testimonial.isApproved) {
      return <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">Pending</Badge>;
    } else if (!testimonial.isPublished) {
      return <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">Approved</Badge>;
    } else {
      return <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Published</Badge>;
    }
  };

  const performDelete = async () => {
    if (!pendingDeleteId) return;
    setActionLoading('delete');
    try {
              const token = localStorage.getItem('accessToken');
        await api.delete(`/testimonials/admin/${pendingDeleteId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
      setTestimonials(prev => prev.filter(t => t._id !== pendingDeleteId));
      setConfirmOpen(false);
      setSuccessOpen(true);
      closeModal();
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      const errorMessage = error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'error' in error.response.data ? error.response.data.error : 'Unknown error';
      alert(`Failed to delete testimonial: ${errorMessage}`);
    } finally {
      setActionLoading(null);
      setPendingDeleteId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-white p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Testimonials Management</h1>
            <p className="text-gray-600 dark:text-gray-400">Review and manage client testimonials</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/admin")}
              className="flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
              aria-label="Back to Admin"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Admin</span>
            </Button>
            <ThemeToggle />
          </div>
        </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete testimonial?</DialogTitle>
          </DialogHeader>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            This action cannot be undone. The testimonial will be removed permanently.
          </div>
          <DialogFooter>
            <button
              onClick={() => setConfirmOpen(false)}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              onClick={performDelete}
              className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white"
              disabled={actionLoading === 'delete'}
            >
              {actionLoading === 'delete' ? 'Deleting...' : 'Delete'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
              <CheckCircle className="w-5 h-5" />
              Testimonial deleted
            </DialogTitle>
          </DialogHeader>
          <div className="text-sm text-gray-700 dark:text-gray-300">
            The testimonial has been removed successfully.
          </div>
          <DialogFooter>
            <button
              onClick={() => setSuccessOpen(false)}
              className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white"
            >
              Close
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-400">Total</p>
                    <p className="text-lg sm:text-2xl font-bold">{stats.total}</p>
                  </div>
                  <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-400">Pending</p>
                    <p className="text-lg sm:text-2xl font-bold text-yellow-400">{stats.pending}</p>
                  </div>
                  <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-400">Approved</p>
                    <p className="text-lg sm:text-2xl font-bold text-blue-400">{stats.approved}</p>
                  </div>
                  <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-400">Published</p>
                    <p className="text-lg sm:text-2xl font-bold text-green-400">{stats.published}</p>
                  </div>
                  <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Enhanced Analytics Dashboard */}
        <div className="mb-6 sm:mb-8">
          <TestimonialsAnalytics />
        </div>

        {/* Filters */}
        <Card className="bg-white border border-gray-200 dark:bg-white/5 dark:border-white/10 mb-4 sm:mb-6">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white text-gray-900 border border-gray-300 dark:bg-white/10 dark:text-white dark:border-white/20"
                >
                  {statusOptions.map((status) => (
                    <option key={status.value} value={status.value} className="bg-white text-gray-900 dark:bg-gray-800 dark:text-white">
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white text-gray-900 border border-gray-300 dark:bg-white/10 dark:text-white dark:border-white/20"
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value} className="bg-white text-gray-900 dark:bg-gray-800 dark:text-white">
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Testimonials List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading testimonials...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-400 mb-4">{error}</p>
            <Button onClick={() => fetchTestimonials(1, selectedStatus, selectedCategory)}>
              Try Again
            </Button>
          </div>
        ) : testimonials.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Testimonials Found</h3>
            <p className="text-gray-400">No testimonials match the current filters.</p>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {testimonials.map((testimonial) => (
                <Card key={testimonial._id} className="bg-white border border-gray-200 dark:bg-white/5 dark:border-white/10">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                          <h3 className="font-semibold text-lg text-gray-900 dark:text-white truncate">{testimonial.name}</h3>
                          <div className="flex flex-wrap gap-2">
                            {getStatusBadge(testimonial)}
                            <Badge className={`${categoryColors[testimonial.category]} border text-xs`}>
                              {categoryLabels[testimonial.category]}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-2">
                          {renderStars(testimonial.rating)}
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {testimonial.rating}/5
                          </span>
                        </div>
                        
                        <p className="text-gray-700 dark:text-gray-300 mb-2 text-sm sm:text-base line-clamp-3">&ldquo;{testimonial.message}&rdquo;</p>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <span className="truncate">{testimonial.email}</span>
                          <span className="whitespace-nowrap">{formatDate(testimonial.createdAt)}</span>
                        </div>
                        
                        {testimonial.adminNotes && (
                          <div className="mt-3 p-3 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10">
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              <strong>Admin Notes:</strong> {testimonial.adminNotes}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-row sm:flex-col gap-2 sm:ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openModal(testimonial)}
                          className="border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-white/10 dark:hover:bg-white/20 dark:text-white dark:border-white/20 flex-1 sm:flex-none"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          <span className="hidden sm:inline">Review</span>
                          <span className="sm:hidden">View</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedTestimonial(testimonial);
                            setPendingDeleteId(testimonial._id);
                            setConfirmOpen(true);
                          }}
                          className="border-red-300 text-red-700 hover:bg-red-50 dark:bg-white/10 dark:hover:bg-white/20 dark:text-white dark:border-white/20 flex-1 sm:flex-none"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          <span className="hidden sm:inline">Delete</span>
                          <span className="sm:hidden">Del</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!pagination.hasPrev}
                  className="bg-white/10 hover:bg-white/20 text-white border-white/20 px-3 sm:px-4 py-2 text-sm"
                >
                  <span className="hidden sm:inline">Previous</span>
                  <span className="sm:hidden">Prev</span>
                </Button>
                
                <span className="text-gray-400 text-sm px-2 sm:px-4">
                  <span className="hidden sm:inline">Page {currentPage} of {pagination.totalPages}</span>
                  <span className="sm:hidden">{currentPage}/{pagination.totalPages}</span>
                </span>
                
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!pagination.hasNext}
                  className="bg-white/10 hover:bg-white/20 text-white border-white/20 px-3 sm:px-4 py-2 text-sm"
                >
                  <span className="hidden sm:inline">Next</span>
                  <span className="sm:hidden">Next</span>
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Review Modal */}
      {showModal && selectedTestimonial && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-2 sm:p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-white/20">
            <CardHeader className="sticky top-0 bg-white dark:bg-gray-800 z-10 border-b border-gray-200 dark:border-white/10">
              <CardTitle className="flex items-center justify-between text-lg sm:text-xl">
                <span className="text-gray-900 dark:text-white">Review Testimonial</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closeModal}
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white p-2"
                >
                  ✕
                </Button>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4 p-4 sm:p-6">
              <div>
                <h3 className="font-semibold mb-2 text-gray-900 dark:text-white text-base sm:text-lg">{selectedTestimonial.name}</h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm mb-2 break-all">{selectedTestimonial.email}</p>
                <div className="flex items-center gap-2 mb-2">
                  {renderStars(selectedTestimonial.rating)}
                  <span className="text-sm text-gray-400">
                    {selectedTestimonial.rating}/5
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed">&ldquo;{selectedTestimonial.message}&rdquo;</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Admin Notes (Optional)
                </label>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add any notes about this testimonial..."
                  className="bg-white border border-gray-300 text-gray-900 placeholder-gray-400 dark:bg-white/10 dark:border-white/20 dark:text-white resize-none"
                  rows={3}
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                {!selectedTestimonial.isApproved && (
                  <Button
                    onClick={() => handleAction('approve')}
                    disabled={actionLoading !== null}
                    className="bg-green-600 hover:bg-green-700 text-white flex-1 sm:flex-none"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Approve</span>
                    <span className="sm:hidden">Approve</span>
                  </Button>
                )}
                
                {selectedTestimonial.isApproved && !selectedTestimonial.isPublished && (
                  <Button
                    onClick={() => handleAction('publish')}
                    disabled={actionLoading !== null}
                    className="bg-blue-600 hover:bg-blue-700 text-white flex-1 sm:flex-none"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Publish</span>
                    <span className="sm:hidden">Publish</span>
                  </Button>
                )}
                
                {selectedTestimonial.isApproved && (
                  <Button
                    onClick={() => handleAction('reject')}
                    disabled={actionLoading !== null}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white flex-1 sm:flex-none"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Reject</span>
                    <span className="sm:hidden">Reject</span>
                  </Button>
                )}
                
                <Button
                  onClick={() => handleAction('delete')}
                  disabled={actionLoading !== null}
                  className="bg-red-600 hover:bg-red-700 text-white flex-1 sm:flex-none"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Delete</span>
                  <span className="sm:hidden">Delete</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
 