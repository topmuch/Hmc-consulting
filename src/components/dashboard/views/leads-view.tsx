"use client";

import { useState, useMemo, useEffect, FormEvent, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Target,
  Mail,
  Phone,
  Building2,
  Calendar,
  Loader2,
  Inbox,
  UserCheck,
  RefreshCw,
  FileText,
  Phone as PhoneIcon,
  MessageSquare,
  Users,
  X,
  ChevronRight,
  Clock,
  ClipboardList,
  User,
  ArrowRight,
} from "lucide-react";
import { PRODUCTS, getProductById } from "@/lib/products-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import {
  ViewHeader,
  MiniStatCard,
  EmptyState,
  ErrorState,
  TableSkeleton,
  NativeSelect,
  Pill,
  formatDate,
  formatDateTime,
  timeAgo,
  LEAD_STATUS_LABELS,
  LEAD_STATUS_COLORS,
  LEAD_SOURCE_LABELS,
  LEAD_SOURCE_COLORS,
} from "./_shared";

// ─── Types ───────────────────────────────────────────────────────────────────

type LeadUser = { id: string; name: string; email: string; role: string };

type Lead = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  source: string;
  status: string;
  productId?: string | null;
  value?: string | null;
  notes?: string | null;
  nextFollowUp?: string | null;
  createdById?: string | null;
  assignedToId?: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy?: LeadUser | null;
  assignedTo?: LeadUser | null;
};

type LeadActivity = {
  id: string;
  leadId: string;
  userId?: string | null;
  type: string;
  content: string;
  oldValue?: string | null;
  newValue?: string | null;
  createdAt: string;
  user?: LeadUser | null;
};

type DailyReport = {
  id: string;
  userId: string;
  date: string;
  content: string;
  leadsCount: number;
  callsCount: number;
  meetingsCount: number;
  createdAt: string;
  updatedAt: string;
  user?: LeadUser | null;
};

// ─── Constants ───────────────────────────────────────────────────────────────

const STATUS_OPTIONS = ["new", "contacted", "callback", "interested", "ordered", "lost"];
const SOURCE_OPTIONS = ["website", "referral", "campaign", "other"];
const ACTIVITY_TYPE_OPTIONS = ["note", "call", "email", "meeting"];

const ACTIVITY_TYPE_LABELS: Record<string, string> = {
  status_change: "Statut",
  note: "Note",
  call: "Appel",
  email: "Email",
  meeting: "Rendez-vous",
  assignment: "Assignation",
};

const ACTIVITY_TYPE_ICONS: Record<string, string> = {
  status_change: "RefreshCw",
  note: "FileText",
  call: "Phone",
  email: "Mail",
  meeting: "Calendar",
  assignment: "UserCheck",
};

type LeadForm = {
  name: string;
  email: string;
  phone: string;
  company: string;
  source: string;
  status: string;
  productId: string;
  value: string;
  notes: string;
  nextFollowUp: string;
  assignedToId: string;
};

const EMPTY_FORM: LeadForm = {
  name: "",
  email: "",
  phone: "",
  company: "",
  source: "website",
  status: "new",
  productId: "",
  value: "",
  notes: "",
  nextFollowUp: "",
  assignedToId: "",
};

type DailyReportForm = {
  content: string;
  leadsCount: number;
  callsCount: number;
  meetingsCount: number;
};

const EMPTY_REPORT_FORM: DailyReportForm = {
  content: "",
  leadsCount: 0,
  callsCount: 0,
  meetingsCount: 0,
};

// ─── Activity icon helper ────────────────────────────────────────────────────

function ActivityIcon({ type }: { type: string }) {
  const iconMap: Record<string, React.ReactNode> = {
    RefreshCw: <RefreshCw className="h-3.5 w-3.5" />,
    FileText: <FileText className="h-3.5 w-3.5" />,
    Phone: <PhoneIcon className="h-3.5 w-3.5" />,
    Mail: <Mail className="h-3.5 w-3.5" />,
    Calendar: <Calendar className="h-3.5 w-3.5" />,
    UserCheck: <UserCheck className="h-3.5 w-3.5" />,
  };
  const iconName = ACTIVITY_TYPE_ICONS[type] || "FileText";
  return <>{iconMap[iconName] || <FileText className="h-3.5 w-3.5" />}</>;
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function LeadsView({ refreshSignal = 0 }: { refreshSignal?: number } = {}) {
  const { toast } = useToast();

  // ── Tab state ──
  const [activeTab, setActiveTab] = useState<"leads" | "reports">("leads");

  // ── Leads state ──
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // ── Lead dialog ──
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Lead | null>(null);
  const [form, setForm] = useState<LeadForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  // ── Delete confirmation ──
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // ── Detail panel ──
  const [detailLead, setDetailLead] = useState<Lead | null>(null);
  const [detailActivities, setDetailActivities] = useState<LeadActivity[]>([]);
  const [detailLoading, setDetailLoading] = useState(false);
  const [newActivityType, setNewActivityType] = useState("note");
  const [newActivityContent, setNewActivityContent] = useState("");
  const [addingActivity, setAddingActivity] = useState(false);

  // ── Users for assignment ──
  const [users, setUsers] = useState<LeadUser[]>([]);
  const [assigning, setAssigning] = useState(false);

  // ── Status change loading ──
  const [changingStatus, setChangingStatus] = useState(false);

  // ── Daily reports ──
  const [reports, setReports] = useState<DailyReport[]>([]);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [reportForm, setReportForm] = useState<DailyReportForm>(EMPTY_REPORT_FORM);
  const [savingReport, setSavingReport] = useState(false);
  const [existingReportId, setExistingReportId] = useState<string | null>(null);

  // ── Fetch leads ──
  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/leads", { cache: "no-store" });
      if (!res.ok) throw new Error("fetch failed");
      const data = await res.json();
      setLeads(data.leads || []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [refreshSignal, fetchLeads]);

  // ── Fetch users for assignment ──
  useEffect(() => {
    fetch("/api/users", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.users) setUsers(data.users);
      })
      .catch(() => {});
  }, []);

  // ── Fetch daily reports ──
  const fetchReports = useCallback(async () => {
    setReportsLoading(true);
    try {
      const res = await fetch("/api/leads/daily-reports", { cache: "no-store" });
      if (!res.ok) throw new Error("fetch failed");
      const data = await res.json();
      setReports(data.reports || []);

      // Check if there's a report for today to pre-fill the form
      const today = new Date().toISOString().split("T")[0];
      const todayReport = (data.reports || []).find(
        (r: DailyReport) => r.date && r.date.startsWith(today)
      );
      if (todayReport) {
        setExistingReportId(todayReport.id);
        setReportForm({
          content: todayReport.content,
          leadsCount: todayReport.leadsCount,
          callsCount: todayReport.callsCount,
          meetingsCount: todayReport.meetingsCount,
        });
      } else {
        setExistingReportId(null);
        setReportForm(EMPTY_REPORT_FORM);
      }
    } catch {
      // silently fail
    } finally {
      setReportsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "reports") {
      fetchReports();
    }
  }, [activeTab, fetchReports]);

  // ── Filtered leads ──
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return leads.filter((l) => {
      if (statusFilter !== "all" && l.status !== statusFilter) return false;
      if (!q) return true;
      return [l.name, l.email, l.company, l.phone]
        .filter(Boolean)
        .some((v) => v!.toLowerCase().includes(q));
    });
  }, [leads, search, statusFilter]);

  // ── Stats ──
  const stats = useMemo(() => {
    const byStatus = (s: string) => leads.filter((l) => l.status === s).length;
    return {
      total: leads.length,
      new: byStatus("new"),
      callback: byStatus("callback"),
      ordered: byStatus("ordered"),
    };
  }, [leads]);

  // ── Open add dialog ──
  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  };

  // ── Open edit dialog ──
  const openEdit = (lead: Lead) => {
    setEditing(lead);
    setForm({
      name: lead.name,
      email: lead.email,
      phone: lead.phone || "",
      company: lead.company || "",
      source: lead.source,
      status: lead.status,
      productId: lead.productId || "",
      value: lead.value || "",
      notes: lead.notes || "",
      nextFollowUp: lead.nextFollowUp ? lead.nextFollowUp.slice(0, 10) : "",
      assignedToId: lead.assignedToId || "",
    });
    setDialogOpen(true);
  };

  // ── Submit lead form ──
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (saving) return;
    if (!form.name.trim() || !form.email.trim()) {
      toast({
        title: "Champs manquants",
        description: "Le nom et l'email sont obligatoires.",
        variant: "destructive",
      });
      return;
    }
    setSaving(true);
    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || null,
      company: form.company.trim() || null,
      source: form.source,
      status: form.status,
      productId: form.productId || null,
      value: form.value.trim() || null,
      notes: form.notes.trim() || null,
      nextFollowUp: form.nextFollowUp || null,
      assignedToId: form.assignedToId || null,
    };
    try {
      if (editing) {
        const res = await fetch(`/api/leads/${editing.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok || !data?.ok) throw new Error(data?.error || "Échec");
        setLeads((prev) =>
          prev.map((l) => (l.id === editing.id ? data.lead : l))
        );
        toast({ title: "Lead mis à jour", description: form.name });
      } else {
        const res = await fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok || !data?.ok) throw new Error(data?.error || "Échec");
        setLeads((prev) => [data.lead, ...prev]);
        toast({ title: "Lead créé", description: form.name });
      }
      setDialogOpen(false);
    } catch (err) {
      toast({
        title: "Erreur",
        description: err instanceof Error ? err.message : "Échec de l'enregistrement",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // ── Delete lead ──
  const handleDelete = async () => {
    if (!deleteId || deleting) return;
    setDeleting(true);
    const prev = leads;
    setLeads((cur) => cur.filter((l) => l.id !== deleteId));
    try {
      const res = await fetch(`/api/leads/${deleteId}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Échec de la suppression");
      }
      toast({ title: "Lead supprimé" });
      setDeleteId(null);
    } catch (err) {
      setLeads(prev);
      toast({
        title: "Erreur",
        description: err instanceof Error ? err.message : "Échec de la suppression",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  // ── Open detail panel ──
  const openDetail = async (lead: Lead) => {
    setDetailLead(lead);
    setDetailActivities([]);
    setNewActivityContent("");
    setNewActivityType("note");
    setDetailLoading(true);
    try {
      const res = await fetch(`/api/leads/${lead.id}`, { cache: "no-store" });
      const data = await res.json();
      if (data.ok && data.lead) {
        setDetailLead(data.lead);
        setDetailActivities(data.lead.activities || []);
      }
    } catch {
      // use the lead data we already have
    } finally {
      setDetailLoading(false);
    }
  };

  // ── Close detail panel ──
  const closeDetail = () => {
    setDetailLead(null);
    setDetailActivities([]);
  };

  // ── Change lead status (from detail panel) ──
  const handleStatusChange = async (leadId: string, newStatus: string) => {
    if (changingStatus) return;
    setChangingStatus(true);
    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) throw new Error(data?.error || "Échec");
      setLeads((prev) => prev.map((l) => (l.id === leadId ? data.lead : l)));
      setDetailLead(data.lead);
      // Refresh activities
      const actRes = await fetch(`/api/leads/activities?leadId=${leadId}`);
      const actData = await actRes.json();
      if (actData.ok) setDetailActivities(actData.activities || []);
      toast({ title: "Statut mis à jour", description: LEAD_STATUS_LABELS[newStatus] });
    } catch (err) {
      toast({
        title: "Erreur",
        description: err instanceof Error ? err.message : "Échec du changement de statut",
        variant: "destructive",
      });
    } finally {
      setChangingStatus(false);
    }
  };

  // ── Assign lead ──
  const handleAssign = async (leadId: string, assignedToId: string) => {
    if (assigning) return;
    setAssigning(true);
    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignedToId: assignedToId || null }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) throw new Error(data?.error || "Échec");
      setLeads((prev) => prev.map((l) => (l.id === leadId ? data.lead : l)));
      setDetailLead(data.lead);
      // Refresh activities
      const actRes = await fetch(`/api/leads/activities?leadId=${leadId}`);
      const actData = await actRes.json();
      if (actData.ok) setDetailActivities(actData.activities || []);
      toast({
        title: "Lead assigné",
        description: assignedToId
          ? users.find((u) => u.id === assignedToId)?.name || "Assigné"
          : "Non assigné",
      });
    } catch (err) {
      toast({
        title: "Erreur",
        description: err instanceof Error ? err.message : "Échec de l'assignation",
        variant: "destructive",
      });
    } finally {
      setAssigning(false);
    }
  };

  // ── Add activity ──
  const handleAddActivity = async (e: FormEvent) => {
    e.preventDefault();
    if (!detailLead || addingActivity) return;
    if (!newActivityContent.trim()) {
      toast({
        title: "Contenu requis",
        description: "Veuillez saisir le contenu de l'activité.",
        variant: "destructive",
      });
      return;
    }
    setAddingActivity(true);
    try {
      const res = await fetch("/api/leads/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId: detailLead.id,
          type: newActivityType,
          content: newActivityContent.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) throw new Error(data?.error || "Échec");
      setDetailActivities((prev) => [data.activity, ...prev]);
      setNewActivityContent("");
      toast({ title: "Activité ajoutée" });
    } catch (err) {
      toast({
        title: "Erreur",
        description: err instanceof Error ? err.message : "Échec de l'ajout d'activité",
        variant: "destructive",
      });
    } finally {
      setAddingActivity(false);
    }
  };

  // ── Save daily report ──
  const handleSaveReport = async (e: FormEvent) => {
    e.preventDefault();
    if (savingReport) return;
    if (!reportForm.content.trim()) {
      toast({
        title: "Contenu requis",
        description: "Veuillez saisir le contenu de votre rapport.",
        variant: "destructive",
      });
      return;
    }
    setSavingReport(true);
    try {
      const res = await fetch("/api/leads/daily-reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: reportForm.content.trim(),
          leadsCount: reportForm.leadsCount,
          callsCount: reportForm.callsCount,
          meetingsCount: reportForm.meetingsCount,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) throw new Error(data?.error || "Échec");
      toast({
        title: existingReportId ? "Rapport mis à jour" : "Rapport créé",
      });
      fetchReports();
    } catch (err) {
      toast({
        title: "Erreur",
        description: err instanceof Error ? err.message : "Échec de l'enregistrement",
        variant: "destructive",
      });
    } finally {
      setSavingReport(false);
    }
  };

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <>
      <ViewHeader
        title="Leads"
        subtitle="Gérez vos prospects et rapports quotidiens"
        actions={
          <Button
            onClick={openAdd}
            size="sm"
            className="bg-accent text-accent-foreground hover:bg-accent/90"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            <span className="hidden sm:inline">Ajouter un lead</span>
            <span className="sm:hidden">Ajouter</span>
          </Button>
        }
      />

      {/* Tab switcher */}
      <div className="bg-card rounded-2xl border border-border p-1 flex gap-1">
        <button
          onClick={() => setActiveTab("leads")}
          className={`flex-1 sm:flex-none rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "leads"
              ? "bg-accent text-accent-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
          }`}
        >
          <Target className="h-4 w-4 inline mr-1.5 -mt-0.5" />
          Leads
        </button>
        <button
          onClick={() => setActiveTab("reports")}
          className={`flex-1 sm:flex-none rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "reports"
              ? "bg-accent text-accent-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
          }`}
        >
          <ClipboardList className="h-4 w-4 inline mr-1.5 -mt-0.5" />
          Rapports
        </button>
      </div>

      {/* ────────────────────────────── LEADS TAB ────────────────────────── */}
      {activeTab === "leads" && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <MiniStatCard icon={Target} label="Total" value={stats.total} delay={0} />
            <MiniStatCard
              icon={Inbox}
              label="Nouveaux"
              value={stats.new}
              color="bg-blue-500/10 text-blue-600"
              delay={0.05}
            />
            <MiniStatCard
              icon={PhoneIcon}
              label="À rappeler"
              value={stats.callback}
              color="bg-orange-500/10 text-orange-600"
              delay={0.1}
            />
            <MiniStatCard
              icon={UserCheck}
              label="Commandés"
              value={stats.ordered}
              color="bg-emerald-500/10 text-emerald-600"
              delay={0.15}
            />
          </div>

          {/* Filters */}
          <div className="bg-card rounded-2xl border border-border p-3 flex flex-col sm:flex-row gap-2 sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher par nom, email, société…"
                className="pl-9"
              />
            </div>
            <NativeSelect
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-48"
            >
              <option value="all">Tous les statuts</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {LEAD_STATUS_LABELS[s]}
                </option>
              ))}
            </NativeSelect>
          </div>

          {/* Table */}
          {loading ? (
            <TableSkeleton />
          ) : error ? (
            <ErrorState onRetry={fetchLeads} />
          ) : filtered.length === 0 ? (
            <div className="bg-card rounded-2xl border border-border">
              <EmptyState
                icon={Target}
                title={leads.length === 0 ? "Aucun lead pour le moment" : "Aucun lead trouvé"}
                description={
                  leads.length === 0
                    ? "Ajoutez votre premier prospect pour commencer."
                    : "Essayez une autre recherche ou filtre."
                }
                action={
                  leads.length === 0 ? (
                    <Button
                      onClick={openAdd}
                      size="sm"
                      className="bg-accent text-accent-foreground hover:bg-accent/90"
                    >
                      <Plus className="h-4 w-4 mr-1.5" />
                      Ajouter un lead
                    </Button>
                  ) : undefined
                }
              />
            </div>
          ) : (
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              <div className="max-h-[600px] overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-card z-10">
                    <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                      <th className="px-5 py-3 font-medium">Nom</th>
                      <th className="px-5 py-3 font-medium hidden md:table-cell">Société</th>
                      <th className="px-5 py-3 font-medium hidden lg:table-cell">Source</th>
                      <th className="px-5 py-3 font-medium">Statut</th>
                      <th className="px-5 py-3 font-medium hidden xl:table-cell">Assigné à</th>
                      <th className="px-5 py-3 font-medium hidden xl:table-cell">Produit</th>
                      <th className="px-5 py-3 font-medium whitespace-nowrap">Date</th>
                      <th className="px-5 py-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((lead, i) => {
                      const product = lead.productId
                        ? getProductById(lead.productId)
                        : undefined;
                      return (
                        <motion.tr
                          key={lead.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.25, delay: Math.min(i * 0.02, 0.3) }}
                          className="border-b border-border last:border-0 hover:bg-secondary/40 transition-colors cursor-pointer"
                          onClick={() => openDetail(lead)}
                        >
                          <td className="px-5 py-3.5">
                            <div className="font-medium text-foreground truncate">{lead.name}</div>
                            <div className="text-xs text-muted-foreground truncate flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {lead.email}
                            </div>
                            {lead.phone && (
                              <div className="text-xs text-muted-foreground truncate flex items-center gap-1 mt-0.5">
                                <Phone className="h-3 w-3" />
                                {lead.phone}
                              </div>
                            )}
                          </td>
                          <td className="px-5 py-3.5 hidden md:table-cell">
                            {lead.company ? (
                              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                                <Building2 className="h-3.5 w-3.5" />
                                {lead.company}
                              </span>
                            ) : (
                              <span className="text-xs text-muted-foreground/50">—</span>
                            )}
                          </td>
                          <td className="px-5 py-3.5 hidden lg:table-cell">
                            <Pill
                              label={LEAD_SOURCE_LABELS[lead.source] || lead.source}
                              colorClass={LEAD_SOURCE_COLORS[lead.source] || LEAD_SOURCE_COLORS.other}
                            />
                          </td>
                          <td className="px-5 py-3.5">
                            <Pill
                              label={LEAD_STATUS_LABELS[lead.status] || lead.status}
                              colorClass={LEAD_STATUS_COLORS[lead.status] || LEAD_STATUS_COLORS.new}
                            />
                          </td>
                          <td className="px-5 py-3.5 hidden xl:table-cell">
                            {lead.assignedTo ? (
                              <span className="text-xs text-foreground/80 flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {lead.assignedTo.name}
                              </span>
                            ) : (
                              <span className="text-xs text-muted-foreground/50">Non assigné</span>
                            )}
                          </td>
                          <td className="px-5 py-3.5 hidden xl:table-cell">
                            {product ? (
                              <span className="inline-flex items-center gap-1.5 text-xs text-foreground/80">
                                <product.icon className="h-3.5 w-3.5" style={{ color: product.accentHex }} />
                                {product.name}
                              </span>
                            ) : (
                              <span className="text-xs text-muted-foreground/50">—</span>
                            )}
                          </td>
                          <td className="px-5 py-3.5 whitespace-nowrap">
                            <div className="text-xs text-foreground/80 flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(lead.createdAt)}
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <div
                              className="inline-flex items-center gap-1"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0"
                                onClick={() => openEdit(lead)}
                                aria-label="Modifier"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 text-muted-foreground hover:text-red-600"
                                onClick={() => setDeleteId(lead.id)}
                                aria-label="Supprimer"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* ────────────────────────────── REPORTS TAB ─────────────────────── */}
      {activeTab === "reports" && (
        <>
          {/* Report form */}
          <div className="bg-card rounded-2xl border border-border p-5">
            <h3 className="font-serif text-lg font-semibold text-foreground mb-4">
              {existingReportId ? "Modifier le rapport du jour" : "Rapport du jour"}
            </h3>
            <form onSubmit={handleSaveReport} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="report-content">Contenu</Label>
                <Textarea
                  id="report-content"
                  value={reportForm.content}
                  onChange={(e) => setReportForm({ ...reportForm, content: e.target.value })}
                  placeholder="Décrivez votre journée, les actions menées, les résultats obtenus…"
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="report-leads">Leads</Label>
                  <Input
                    id="report-leads"
                    type="number"
                    min={0}
                    value={reportForm.leadsCount}
                    onChange={(e) =>
                      setReportForm({ ...reportForm, leadsCount: parseInt(e.target.value) || 0 })
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="report-calls">Appels</Label>
                  <Input
                    id="report-calls"
                    type="number"
                    min={0}
                    value={reportForm.callsCount}
                    onChange={(e) =>
                      setReportForm({ ...reportForm, callsCount: parseInt(e.target.value) || 0 })
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="report-meetings">Rendez-vous</Label>
                  <Input
                    id="report-meetings"
                    type="number"
                    min={0}
                    value={reportForm.meetingsCount}
                    onChange={(e) =>
                      setReportForm({ ...reportForm, meetingsCount: parseInt(e.target.value) || 0 })
                    }
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={savingReport} className="bg-accent text-accent-foreground hover:bg-accent/90">
                  {savingReport && <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />}
                  {existingReportId ? "Mettre à jour" : "Enregistrer le rapport"}
                </Button>
              </div>
            </form>
          </div>

          {/* Reports list */}
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="p-5 border-b border-border">
              <h3 className="font-serif text-lg font-semibold text-foreground">
                Rapports quotidiens
              </h3>
            </div>
            {reportsLoading ? (
              <div className="p-5 space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                ))}
              </div>
            ) : reports.length === 0 ? (
              <EmptyState
                icon={ClipboardList}
                title="Aucun rapport"
                description="Les rapports quotidiens de l'équipe apparaîtront ici."
              />
            ) : (
              <div className="divide-y divide-border max-h-[500px] overflow-y-auto">
                {reports.map((report, i) => (
                  <motion.div
                    key={report.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: Math.min(i * 0.03, 0.3) }}
                    className="p-4 hover:bg-secondary/30 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/10 text-accent text-xs font-medium shrink-0">
                            {report.user?.name
                              ?.split(" ")
                              .map((w) => w[0])
                              .slice(0, 2)
                              .join("")
                              .toUpperCase() || "?"}
                          </div>
                          <span className="text-sm font-medium text-foreground">
                            {report.user?.name || "Inconnu"}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(report.date)}
                          </span>
                        </div>
                        <p className="text-sm text-foreground/80 whitespace-pre-wrap line-clamp-3">
                          {report.content}
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Target className="h-3 w-3" />
                            {report.leadsCount} leads
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <PhoneIcon className="h-3 w-3" />
                            {report.callsCount} appels
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {report.meetingsCount} RDV
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* ──────────────────────────── ADD / EDIT DIALOG ─────────────────── */}
      <Dialog open={dialogOpen} onOpenChange={(o) => !saving && setDialogOpen(o)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Modifier le lead" : "Ajouter un lead"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="lead-name">Nom *</Label>
                <Input
                  id="lead-name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  autoFocus
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lead-email">Email *</Label>
                <Input
                  id="lead-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lead-phone">Téléphone</Label>
                <Input
                  id="lead-phone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lead-company">Société</Label>
                <Input
                  id="lead-company"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lead-source">Source</Label>
                <NativeSelect
                  id="lead-source"
                  value={form.source}
                  onChange={(e) => setForm({ ...form, source: e.target.value })}
                  className="w-full"
                >
                  {SOURCE_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {LEAD_SOURCE_LABELS[s]}
                    </option>
                  ))}
                </NativeSelect>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lead-status">Statut</Label>
                <NativeSelect
                  id="lead-status"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {LEAD_STATUS_LABELS[s]}
                    </option>
                  ))}
                </NativeSelect>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lead-product">Produit</Label>
                <NativeSelect
                  id="lead-product"
                  value={form.productId}
                  onChange={(e) => setForm({ ...form, productId: e.target.value })}
                  className="w-full"
                >
                  <option value="">— Aucun —</option>
                  {PRODUCTS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </NativeSelect>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lead-value">Valeur</Label>
                <Input
                  id="lead-value"
                  value={form.value}
                  onChange={(e) => setForm({ ...form, value: e.target.value })}
                  placeholder="ex. 1500 €"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lead-assigned">Assigné à</Label>
                <NativeSelect
                  id="lead-assigned"
                  value={form.assignedToId}
                  onChange={(e) => setForm({ ...form, assignedToId: e.target.value })}
                  className="w-full"
                >
                  <option value="">— Non assigné —</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </NativeSelect>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lead-followup">Prochain suivi</Label>
                <Input
                  id="lead-followup"
                  type="date"
                  value={form.nextFollowUp}
                  onChange={(e) => setForm({ ...form, nextFollowUp: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lead-notes">Notes</Label>
              <Textarea
                id="lead-notes"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={3}
              />
            </div>
            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => !saving && setDialogOpen(false)}
                disabled={saving}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />}
                {editing ? "Enregistrer" : "Créer le lead"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ──────────────────────────── DELETE CONFIRMATION ───────────────── */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(o) => !deleting && !o && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce lead ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le lead sera définitivement supprimé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                void handleDelete();
              }}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deleting && <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />}
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ──────────────────────────── DETAIL SLIDE-OVER ─────────────────── */}
      <AnimatePresence>
        {detailLead && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/40 z-40"
              onClick={closeDetail}
            />

            {/* Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-lg bg-background border-l border-border shadow-2xl overflow-y-auto"
            >
              {/* Header */}
              <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border px-5 py-4 flex items-center justify-between gap-3 z-10">
                <div className="min-w-0">
                  <h2 className="font-serif text-lg font-semibold text-foreground truncate">
                    {detailLead.name}
                  </h2>
                  <p className="text-xs text-muted-foreground truncate">{detailLead.email}</p>
                </div>
                <button
                  onClick={closeDetail}
                  className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-secondary transition-colors shrink-0"
                  aria-label="Fermer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {detailLoading ? (
                <div className="p-5 space-y-4">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ) : (
                <div className="p-5 space-y-6">
                  {/* Contact info */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Informations
                    </h3>
                    <div className="bg-card rounded-xl border border-border p-4 space-y-2">
                      {detailLead.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                          <span className="text-foreground">{detailLead.phone}</span>
                        </div>
                      )}
                      {detailLead.company && (
                        <div className="flex items-center gap-2 text-sm">
                          <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
                          <span className="text-foreground">{detailLead.company}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm">
                        <Target className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="text-foreground">
                          Source :{" "}
                          <Pill
                            label={LEAD_SOURCE_LABELS[detailLead.source] || detailLead.source}
                            colorClass={LEAD_SOURCE_COLORS[detailLead.source] || LEAD_SOURCE_COLORS.other}
                          />
                        </span>
                      </div>
                      {detailLead.value && (
                        <div className="flex items-center gap-2 text-sm">
                          <span className="h-4 w-4 text-muted-foreground shrink-0 flex items-center justify-center text-xs font-bold">
                            €
                          </span>
                          <span className="text-foreground font-medium">{detailLead.value}</span>
                        </div>
                      )}
                      {detailLead.productId && (() => {
                        const product = getProductById(detailLead.productId);
                        return product ? (
                          <div className="flex items-center gap-2 text-sm">
                            <product.icon className="h-4 w-4 shrink-0" style={{ color: product.accentHex }} />
                            <span className="text-foreground">{product.name}</span>
                          </div>
                        ) : null;
                      })()}
                      {detailLead.nextFollowUp && (
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                          <span className="text-foreground">
                            Prochain suivi : {formatDate(detailLead.nextFollowUp)}
                          </span>
                        </div>
                      )}
                      {detailLead.notes && (
                        <div className="pt-2 border-t border-border mt-2">
                          <p className="text-xs text-muted-foreground mb-1">Notes</p>
                          <p className="text-sm text-foreground/80 whitespace-pre-wrap">
                            {detailLead.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Created by / Assigned to */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Équipe
                    </h3>
                    <div className="bg-card rounded-xl border border-border p-4 space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="text-muted-foreground">Créé par :</span>
                        <span className="text-foreground font-medium">
                          {detailLead.createdBy?.name || "Inconnu"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <UserCheck className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="text-muted-foreground">Assigné à :</span>
                        <span className="text-foreground font-medium">
                          {detailLead.assignedTo?.name || "Non assigné"}
                        </span>
                      </div>
                      {/* Assignment dropdown */}
                      <div className="pt-2 border-t border-border">
                        <Label className="text-xs text-muted-foreground mb-1.5 block">
                          Réassigner le lead
                        </Label>
                        <NativeSelect
                          value={detailLead.assignedToId || ""}
                          onChange={(e) => handleAssign(detailLead.id, e.target.value)}
                          disabled={assigning}
                          className="w-full"
                        >
                          <option value="">— Non assigné —</option>
                          {users.map((u) => (
                            <option key={u.id} value={u.id}>
                              {u.name}
                            </option>
                          ))}
                        </NativeSelect>
                        {assigning && (
                          <div className="flex items-center gap-1.5 mt-1.5 text-xs text-muted-foreground">
                            <Loader2 className="h-3 w-3 animate-spin" />
                            Assignation…
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Status change pills */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Statut
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {STATUS_OPTIONS.map((s) => {
                        const isActive = detailLead.status === s;
                        return (
                          <button
                            key={s}
                            onClick={() => !isActive && handleStatusChange(detailLead.id, s)}
                            disabled={changingStatus || isActive}
                            className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                              isActive
                                ? LEAD_STATUS_COLORS[s] + " ring-2 ring-offset-1 ring-current/20"
                                : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                            } ${changingStatus ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                          >
                            {LEAD_STATUS_LABELS[s]}
                          </button>
                        );
                      })}
                    </div>
                    {changingStatus && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Mise à jour…
                      </div>
                    )}
                  </div>

                  {/* Activity timeline */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Activités
                    </h3>
                    {detailActivities.length === 0 ? (
                      <div className="text-sm text-muted-foreground py-4 text-center">
                        Aucune activité enregistrée
                      </div>
                    ) : (
                      <div className="relative pl-6">
                        {/* Vertical line */}
                        <div className="absolute left-[9px] top-2 bottom-2 w-px bg-border" />
                        <div className="space-y-4">
                          {detailActivities.map((act) => (
                            <div key={act.id} className="relative">
                              {/* Dot */}
                              <div className="absolute -left-6 top-1 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-card border border-border">
                                <div className="h-2 w-2 rounded-full bg-accent" />
                              </div>
                              <div className="bg-card rounded-lg border border-border p-3">
                                <div className="flex items-center gap-2 mb-1">
                                  <ActivityIcon type={act.type} />
                                  <span className="text-xs font-medium text-foreground">
                                    {ACTIVITY_TYPE_LABELS[act.type] || act.type}
                                  </span>
                                  {act.user && (
                                    <span className="text-xs text-muted-foreground">
                                      par {act.user.name}
                                    </span>
                                  )}
                                  <span className="text-xs text-muted-foreground ml-auto">
                                    {timeAgo(act.createdAt)}
                                  </span>
                                </div>
                                <p className="text-sm text-foreground/80">{act.content}</p>
                                {act.type === "status_change" && act.oldValue && act.newValue && (
                                  <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                                    <Pill
                                      label={LEAD_STATUS_LABELS[act.oldValue] || act.oldValue}
                                      colorClass={LEAD_STATUS_COLORS[act.oldValue] || LEAD_STATUS_COLORS.new}
                                    />
                                    <ArrowRight className="h-3 w-3" />
                                    <Pill
                                      label={LEAD_STATUS_LABELS[act.newValue] || act.newValue}
                                      colorClass={LEAD_STATUS_COLORS[act.newValue] || LEAD_STATUS_COLORS.new}
                                    />
                                  </div>
                                )}
                                {act.type === "assignment" && act.newValue && (
                                  <div className="mt-1 text-xs text-muted-foreground">
                                    Assigné à : {users.find((u) => u.id === act.newValue)?.name || act.newValue}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Add activity form */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Ajouter une activité
                    </h3>
                    <form onSubmit={handleAddActivity} className="bg-card rounded-xl border border-border p-4 space-y-3">
                      <div className="flex gap-2">
                        <NativeSelect
                          value={newActivityType}
                          onChange={(e) => setNewActivityType(e.target.value)}
                          className="w-36 shrink-0"
                        >
                          {ACTIVITY_TYPE_OPTIONS.map((t) => (
                            <option key={t} value={t}>
                              {ACTIVITY_TYPE_LABELS[t]}
                            </option>
                          ))}
                        </NativeSelect>
                        <Input
                          value={newActivityContent}
                          onChange={(e) => setNewActivityContent(e.target.value)}
                          placeholder="Contenu de l'activité…"
                          className="flex-1"
                        />
                      </div>
                      <div className="flex justify-end">
                        <Button
                          type="submit"
                          size="sm"
                          disabled={addingActivity || !newActivityContent.trim()}
                          className="bg-accent text-accent-foreground hover:bg-accent/90"
                        >
                          {addingActivity && <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />}
                          Ajouter
                        </Button>
                      </div>
                    </form>
                  </div>

                  {/* Quick actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        closeDetail();
                        openEdit(detailLead);
                      }}
                    >
                      <Pencil className="h-3.5 w-3.5 mr-1.5" />
                      Modifier
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                      onClick={() => {
                        closeDetail();
                        setDeleteId(detailLead.id);
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                      Supprimer
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
