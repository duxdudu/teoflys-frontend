"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Star, 
  MessageCircle, 
  Calendar,
  Download,
  RefreshCw,
  CheckCircle
} from "lucide-react";
import axios from "axios";

interface AnalyticsData {
  total: number;
  pending: number;
  approved: number;
  published: number;
  categoryStats: Array<{ _id: string; count: number }>;
  ratingStats: Array<{ _id: number; count: number }>;
  monthlyTrends: Array<{ month: string; count: number }>;
  recentActivity: Array<{
    _id: string;
    name: string;
    action: string;
    timestamp: string;
    category: string;
  }>;
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
  wedding: 'bg-pink-500',
  portrait: 'bg-blue-500',
  landscape: 'bg-green-500',
  food: 'bg-orange-500',
  events: 'bg-purple-500',
  commercial: 'bg-indigo-500',
  other: 'bg-gray-500'
};

export default function TestimonialsAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeRange, setTimeRange] = useState('30d');

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
      const response = await axios.get(`/api/testimonials/admin/stats?timeRange=${timeRange}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      const data = response.data || {};
      setAnalytics({
        total: data.total ?? 0,
        pending: data.pending ?? 0,
        approved: data.approved ?? 0,
        published: data.published ?? 0,
        categoryStats: data.categoryStats ?? [],
        ratingStats: data.ratingStats ?? [],
        monthlyTrends: data.monthlyTrends ?? [],
        recentActivity: data.recentActivity ?? [],
      });
      
    } catch (error: unknown) {
      setError('Failed to load analytics data');
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const exportData = () => {
    if (!analytics) return;
    
    const data = {
      summary: {
        total: analytics.total,
        pending: analytics.pending,
        approved: analytics.approved,
        published: analytics.published
      },
      categoryBreakdown: analytics.categoryStats,
      ratingDistribution: analytics.ratingStats,
      monthlyTrends: analytics.monthlyTrends,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `testimonials-analytics-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="animate-pulse bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50 dark:border-red-400 dark:bg-red-900/30">
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-300 mb-4">{error}</p>
            <Button onClick={fetchAnalytics} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analytics) return null;

  const approvalRate = analytics.total > 0 ? ((analytics.approved / analytics.total) * 100).toFixed(1) : '0';

  return (
      <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Testimonials Analytics
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Comprehensive insights into your testimonials performance
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
            <option value="all">All time</option>
          </select>
          
          <Button onClick={exportData} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          
          <Button onClick={fetchAnalytics} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500 bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Total Testimonials
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.total}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              All time submissions
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500 bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Pending Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.pending}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Awaiting approval
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Approval Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{approvalRate}%</div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {analytics.approved} of {analytics.total} approved
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Published
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.published}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Live on website
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Service Type Distribution */}
        <Card className="bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Category Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.categoryStats.map((stat) => (
                <div key={stat._id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${categoryColors[stat._id] || 'bg-gray-500'}`}></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {categoryLabels[stat._id] || stat._id}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${(stat.count / Math.max(...analytics.categoryStats.map(s => s.count))) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white w-8 text-right">
                      {stat.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Rating Distribution */}
        <Card className="bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              Rating Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.ratingStats.map((stat) => (
                <div key={stat._id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {stat._id} {stat._id === 1 ? 'Star' : 'Stars'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-yellow-500 h-2 rounded-full"
                        style={{ width: `${(stat.count / Math.max(...analytics.ratingStats.map(s => s.count))) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white w-8 text-right">
                      {stat.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trends */}
      {analytics.monthlyTrends.length > 0 && (
        <Card className="bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Monthly Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between h-32">
              {analytics.monthlyTrends.map((trend, index) => {
                const maxCount = Math.max(...analytics.monthlyTrends.map(t => t.count));
                const height = maxCount > 0 ? (trend.count / maxCount) * 100 : 0;
                
                return (
                  <div key={index} className="flex flex-col items-center gap-2">
                    <div 
                      className="w-8 bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-600"
                      style={{ height: `${height}%` }}
                    ></div>
                    <span className="text-xs text-gray-600 dark:text-gray-400 text-center">
                      {trend.month}
                    </span>
                    <span className="text-xs font-medium text-gray-900 dark:text-white">
                      {trend.count}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      {analytics.recentActivity.length > 0 && (
        <Card className="bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.recentActivity.slice(0, 10).map((activity) => (
                <div key={activity._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                        {activity.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {activity.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {activity.action} • {new Date(activity.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {categoryLabels[activity.category] || activity.category}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
