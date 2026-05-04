'use client';

import { useState } from 'react';
import { useComplaints } from '@/hooks/useComplaints';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { Loader2, PlusCircle, CheckCircle2, Clock, AlertCircle, FileText } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [filter, setFilter] = useState('All');
  const { data, isLoading, error } = useComplaints(1, filter);

  const complaints = data?.items || [];
  
  // Calculate stats
  const total = data?.total || 0;
  const pending = complaints.filter((c: { status: string }) => c.status === 'pending').length;
  const resolved = complaints.filter((c: { status: string }) => c.status === 'resolved').length;

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Badge variant="outline" className="bg-[#FEF3C7] text-[#92340E] border-[#F59E0B]">Pending</Badge>;
      case 'in_progress':
        return <Badge variant="outline" className="bg-[#DBEAFE] text-[#1E3A8A] border-[#2563EB]">In Progress</Badge>;
      case 'resolved':
        return <Badge variant="outline" className="bg-[#DCFCE7] text-[#14532D] border-[#22C55E]">Resolved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-[#FEE2E2] text-[#991B1B] border-[#EF4444]">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return <Clock className="h-5 w-5 text-[#F59E0B]" />;
      case 'resolved': return <CheckCircle2 className="h-5 w-5 text-[#22C55E]" />;
      case 'rejected': return <AlertCircle className="h-5 w-5 text-[#EF4444]" />;
      default: return <Clock className="h-5 w-5 text-[#2563EB]" />;
    }
  };

  return (
    <div className="space-y-6 bg-[#FDFCF8] min-h-screen p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#0F172A]">Welcome, {user?.full_name?.split(' ')[0]}</h1>
          <p className="text-[#475569] mt-1">Here&apos;s an overview of your submitted complaints.</p>
        </div>
        <Link href="/complaints/new">
          <Button className="bg-[#15803D] hover:bg-[#14532D] text-white shadow-none">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Complaint
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-[#E7E5E4] shadow-none bg-[#F7F5F0]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#475569]">Total Complaints</CardTitle>
            <FileText className="h-4 w-4 text-[#94A3B8]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#0F172A]">{total}</div>
          </CardContent>
        </Card>
        
        <Card className="border-[#E7E5E4] shadow-none bg-[#F7F5F0]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#475569]">Pending</CardTitle>
            <Clock className="h-4 w-4 text-[#94A3B8]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#F59E0B]">{pending}</div>
          </CardContent>
        </Card>

        <Card className="border-[#E7E5E4] shadow-none bg-[#F7F5F0]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#475569]">Resolved</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-[#94A3B8]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#22C55E]">{resolved}</div>
          </CardContent>
        </Card>
      </div>

      {/* Complaints List */}
      <Card className="border-[#E7E5E4] shadow-none bg-[#F7F5F0]">
        <CardHeader>
          <CardTitle className="text-[#0F172A]">Recent Complaints</CardTitle>
          <p className="text-sm text-[#475569] mt-1">View and track status of your complaints.</p>
          <Tabs defaultValue="All" className="w-full mt-4" onValueChange={setFilter}>
            <TabsList className="bg-[#F3F4F6]">
              <TabsTrigger value="All" className="data-[state=active]:bg-[#15803D] data-[state=active]:text-white">All</TabsTrigger>
              <TabsTrigger value="Pending" className="data-[state=active]:bg-[#15803D] data-[state=active]:text-white">Pending</TabsTrigger>
              <TabsTrigger value="Resolved" className="data-[state=active]:bg-[#15803D] data-[state=active]:text-white">Resolved</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-[#15803D]" />
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">Failed to load complaints.</div>
          ) : complaints.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-[#94A3B8] mx-auto mb-4" />
              <p className="text-[#475569] mb-4">You haven&apos;t submitted any complaints yet.</p>
              <Link href="/complaints/new">
                <Button className="bg-[#15803D] hover:bg-[#14532D]">Submit Your First Complaint</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {complaints.map((complaint: { id: string; title: string; description: string; category: string; created_at: string; status: string; admin_response?: string | null; attachment_url?: string | null }) => (
                <div key={complaint.id} className="flex items-start justify-between p-4 rounded-lg border border-[#E7E5E4] hover:border-[#DCFCE7] hover:bg-[#F0FDF4] transition-colors bg-[#FDFCF8]">
                  <div className="flex gap-4">
                    <div className="mt-1">
                      {getStatusIcon(complaint.status)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#0F172A] line-clamp-1">{complaint.title}</h4>
                      <p className="text-sm text-[#475569] line-clamp-2 mt-1">
                        {complaint.description || 'No description provided'}
                      </p>
                      {complaint.admin_response ? (
                        <div className="mt-3 rounded-md border border-[#BBF7D0] bg-[#F0FDF4] px-3 py-2">
                          <div className="text-xs font-semibold text-[#14532D]">Admin response</div>
                          <div className="text-sm text-[#14532D]">{complaint.admin_response}</div>
                        </div>
                      ) : null}
                      {complaint.attachment_url ? (
                        <div className="mt-2">
                          <a
                            href={complaint.attachment_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs font-semibold text-[#1A531A] underline"
                          >
                            View your attachment
                          </a>
                        </div>
                      ) : null}
                      <div className="flex items-center gap-3 mt-2 text-xs text-[#94A3B8]">
                        <span className="font-medium bg-[#F3F4F6] px-2 py-0.5 rounded text-[#475569]">{complaint.category}</span>
                        <span>•</span>
                        <span>{format(new Date(complaint.created_at), 'MMM d, yyyy')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(complaint.status)}
                    <span className="text-xs text-[#94A3B8] font-medium">#{complaint.id.substring(0, 6)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      {/* Icon imports workaround - ensure FileText is visible on top */}
      <div className="hidden"><FileText /></div>
    </div>
  );
}
