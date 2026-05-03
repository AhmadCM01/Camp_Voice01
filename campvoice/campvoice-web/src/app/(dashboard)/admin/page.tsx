'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { Loader2, AlertCircle, CheckCircle2, Users, FileText, Search, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [draftAdminResponse, setDraftAdminResponse] = useState('');
  const [draftInternalNotes, setDraftInternalNotes] = useState('');

  type ComplaintPatch = {
    status?: string;
    admin_response?: string | null;
    internal_notes?: string | null;
  };

  type AdminComplaint = {
    id: string;
    status: string;
    category: string;
    created_at: string;
    title: string;
    description: string;
    student_name: string;
    tracking_no: string;
    location?: string | null;
    admin_response?: string | null;
    internal_notes?: string | null;
  };
  
  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-complaints', { status: filter, search, page, perPage }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filter !== 'All') params.append('status', filter.toLowerCase());
      if (search.trim()) params.append('search', search.trim());
      params.append('page', String(page));
      params.append('per_page', String(perPage));
      const res = await api.get(`/admin/complaints?${params.toString()}`);
      return res.data;
    }
  });

  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const res = await api.get('/admin/stats');
      return res.data;
    }
  });

  const updateComplaint = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: ComplaintPatch }) => {
      const res = await api.patch(`/admin/complaints/${id}/status`, patch);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Saved');
      queryClient.invalidateQueries({ queryKey: ['admin-complaints'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
    onError: () => {
      toast.error('Update failed');
    }
  });

  const complaints = data?.items || [];
  const total = data?.total || 0;
  const pages = data?.pages || 1;
  
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">Pending</Badge>;
      case 'in_progress': return <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20">In Progress</Badge>;
      case 'resolved': return <Badge variant="outline" className="bg-success/10 text-success border-success/20">Resolved</Badge>;
      case 'rejected': return <Badge variant="outline" className="bg-danger/10 text-danger border-danger/20">Rejected</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Manage and resolve student complaints across the university.</p>
      </div>

      {/* Admin Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Active</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats?.total ?? 0}</div></CardContent>
        </Card>
        <Card className="border border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats?.pending ?? 0}</div></CardContent>
        </Card>
        <Card className="border border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats?.in_progress ?? 0}</div></CardContent>
        </Card>
        <Card className="border border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Resolved</CardTitle>
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats?.resolved ?? 0}</div></CardContent>
        </Card>
      </div>

      <Card className="border border-border shadow-sm">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <CardTitle>Complaint Queue</CardTitle>
              <CardDescription className="mt-1">Search, filter, and update statuses.</CardDescription>
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search by title, tracking no, student..."
                  className="pl-9"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => queryClient.invalidateQueries({ queryKey: ['admin-complaints'] })}
                className="shrink-0"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Select
                value={String(perPage)}
                onValueChange={(v) => {
                  setPerPage(Number(v));
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-[110px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 / page</SelectItem>
                  <SelectItem value="20">20 / page</SelectItem>
                  <SelectItem value="50">50 / page</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Tabs
            defaultValue="All"
            className="w-full mt-4"
            onValueChange={(v) => {
              setFilter(v);
              setPage(1);
            }}
          >
            <TabsList>
              <TabsTrigger value="All">All</TabsTrigger>
              <TabsTrigger value="Pending">Pending</TabsTrigger>
              <TabsTrigger value="In_Progress">In Progress</TabsTrigger>
              <TabsTrigger value="Resolved">Resolved</TabsTrigger>
              <TabsTrigger value="Rejected">Rejected</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : isError ? (
            <div className="text-center py-12 flex flex-col items-center">
              <AlertCircle className="h-12 w-12 text-danger mb-4" />
              <h3 className="text-lg font-semibold text-foreground">Admin access required</h3>
              <p className="text-muted-foreground mt-1 max-w-lg">
                Your account is authenticated but does not have admin privileges. Promote this user to admin in the database to access the admin queue.
              </p>
            </div>
          ) : complaints.length === 0 ? (
            <div className="text-center py-12 flex flex-col items-center">
              <CheckCircle2 className="h-12 w-12 text-success mb-4" />
              <h3 className="text-lg font-semibold text-foreground">All clear!</h3>
              <p className="text-muted-foreground mt-1">No complaints require your attention right now.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {complaints.map((complaint: AdminComplaint) => (
                <div key={complaint.id} className="rounded-xl border border-border bg-card">
                  <div className="flex flex-col md:flex-row md:items-start justify-between p-5 gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      {getStatusBadge(complaint.status)}
                      <span className="text-sm font-medium bg-muted px-2 py-0.5 rounded text-muted-foreground">
                        {complaint.category}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(complaint.created_at), 'MMM d, yyyy h:mm a')}
                      </span>
                    </div>
                    <h4 className="font-semibold text-foreground">{complaint.title}</h4>
                    <p className="text-sm text-muted-foreground mt-2">{complaint.description}</p>
                    
                    <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <Users className="mr-2 h-4 w-4" />
                        <span>{complaint.student_name}</span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <span className="font-medium mr-1">Tracking:</span> {complaint.tracking_no}
                      </div>
                      {complaint.location && (
                        <div className="flex items-center text-muted-foreground">
                          <span className="font-medium mr-1">Location:</span> {complaint.location}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="w-full md:w-56 shrink-0 flex flex-col gap-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase">Update Status</label>
                    <Select 
                      defaultValue={complaint.status} 
                      onValueChange={(val) => {
                        if (!val) return;
                        updateComplaint.mutate({ id: complaint.id, patch: { status: val } });
                      }}
                      disabled={updateComplaint.isPending}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      onClick={() => {
                        if (expandedId === complaint.id) {
                          setExpandedId(null);
                          return;
                        }
                        setExpandedId(complaint.id);
                        setDraftAdminResponse(complaint.admin_response || '');
                        setDraftInternalNotes(complaint.internal_notes || '');
                      }}
                    >
                      {expandedId === complaint.id ? (
                        <>
                          Hide details <ChevronUp className="ml-2 h-4 w-4" />
                        </>
                      ) : (
                        <>
                          View details <ChevronDown className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                  </div>

                  {expandedId === complaint.id ? (
                    <div className="border-t border-border p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="text-xs font-semibold text-muted-foreground uppercase">Admin Response (Visible to Student)</div>
                        <Textarea
                          value={draftAdminResponse}
                          onChange={(e) => setDraftAdminResponse(e.target.value)}
                          placeholder="Write a clear resolution note for the student…"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="text-xs font-semibold text-muted-foreground uppercase">Internal Notes (Admin Only)</div>
                        <Textarea
                          value={draftInternalNotes}
                          onChange={(e) => setDraftInternalNotes(e.target.value)}
                          placeholder="Internal notes for follow-up, assignment, audit…"
                        />
                      </div>
                      <div className="md:col-span-2 flex flex-col sm:flex-row gap-3 justify-end">
                        <Button
                          onClick={() =>
                            updateComplaint.mutate({
                              id: complaint.id,
                              patch: {
                                admin_response: draftAdminResponse.trim() || null,
                                internal_notes: draftInternalNotes.trim() || null,
                              },
                            })
                          }
                          disabled={updateComplaint.isPending}
                        >
                          Save notes
                        </Button>
                      </div>
                    </div>
                  ) : null}
                </div>
              ))}

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <div className="text-sm text-muted-foreground">
                  Page {page} of {pages} · {total} total
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setPage((p) => Math.min(pages, p + 1))}
                    disabled={page >= pages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
