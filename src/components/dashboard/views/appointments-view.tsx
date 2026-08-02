"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Calendar,
  CalendarClock,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  User,
  Search,
  RefreshCw,
  Loader2,
  ChevronRight,
  Eye,
  Trash2,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
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
  EmptyState,
  ErrorState,
  TableSkeleton,
  NativeSelect,
  Pill,
  formatDate,
  formatDateTime,
  MiniStatCard,
} from "./_shared";

// ─── Appointment types ───────────────────────────────────────────────────────

type AppointmentEmployee = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type AppointmentLead = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
};

type Appointment = {
  id: string;
  leadId: string;
  date: string;
  time: string | null;
  location: string | null;
  contactName: string | null;
  company: string | null;
  notes: string | null;
  employeeId: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  lead: AppointmentLead;
  employee: AppointmentEmployee | null;
};

// ─── Status labels & colors ─────────────────────────────────────────────────

const APPOINTMENT_STATUS_LABELS: Record<string, string> = {
  scheduled: "Planifié",
  confirmed: "Confirmé",
  completed: "Terminé",
  cancelled: "Annulé",
};

const APPOINTMENT_STATUS_COLORS: Record<string, string> = {
  scheduled: "bg-blue-500/10 text-blue-600 border-blue-500/30",
  confirmed: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
  completed: "bg-violet-500/10 text-violet-600 border-violet-500/30",
  cancelled: "bg-gray-500/10 text-gray-500 border-gray-500/30",
};

const APPOINTMENT_STATUS_ICONS: Record<string, typeof CalendarClock> = {
  scheduled: CalendarClock,
  confirmed: CheckCircle2,
  completed: CheckCircle2,
  cancelled: XCircle,
};

const VALID_STATUSES = ["scheduled", "confirmed", "completed", "cancelled"];

// ─── Component ───────────────────────────────────────────────────────────────

export function AppointmentsView({ refreshSignal }: { refreshSignal?: number }) {
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [changingStatus, setChangingStatus] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set("status", statusFilter);
      const res = await fetch(`/api/appointments?${params.toString()}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setAppointments(data.appointments || []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments, refreshSignal]);

  // Filter by search client-side
  const filtered = useMemo(() => {
    if (!search.trim()) return appointments;
    const q = search.toLowerCase();
    return appointments.filter(
      (a) =>
        (a.contactName || "").toLowerCase().includes(q) ||
        (a.lead?.name || "").toLowerCase().includes(q) ||
        (a.lead?.email || "").toLowerCase().includes(q) ||
        (a.lead?.company || "").toLowerCase().includes(q) ||
        (a.location || "").toLowerCase().includes(q)
    );
  }, [appointments, search]);

  // Stats
  const stats = useMemo(() => {
    const total = appointments.length;
    const scheduled = appointments.filter((a) => a.status === "scheduled").length;
    const confirmed = appointments.filter((a) => a.status === "confirmed").length;
    const completed = appointments.filter((a) => a.status === "completed").length;
    const cancelled = appointments.filter((a) => a.status === "cancelled").length;
    return { total, scheduled, confirmed, completed, cancelled };
  }, [appointments]);

  const selectedAppointment = useMemo(
    () => appointments.find((a) => a.id === selectedId) || null,
    [appointments, selectedId]
  );

  // ─── Change status ──────────────────────────────────────────────────────────

  const handleChangeStatus = async (id: string, newStatus: string) => {
    setChangingStatus(true);
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data?.error || "Échec de la mise à jour");
      }
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? data.appointment : a))
      );
      toast({
        title: "Statut mis à jour",
        description: `Rendez-vous ${APPOINTMENT_STATUS_LABELS[newStatus] || newStatus}`,
      });
    } catch (err) {
      toast({
        title: "Erreur",
        description:
          err instanceof Error ? err.message : "Impossible de modifier le statut.",
        variant: "destructive",
      });
    } finally {
      setChangingStatus(false);
    }
  };

  // ─── Delete ─────────────────────────────────────────────────────────────────

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/appointments/${deleteId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data?.error || "Échec de la suppression");
      }
      setAppointments((prev) => prev.filter((a) => a.id !== deleteId));
      setDeleteId(null);
      toast({
        title: "Rendez-vous supprimé",
        description: "Le rendez-vous a été supprimé avec succès.",
      });
    } catch (err) {
      toast({
        title: "Erreur",
        description:
          err instanceof Error ? err.message : "Impossible de supprimer.",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      <ViewHeader
        title="Rendez-vous"
        subtitle="Gérez les rendez-vous et planifications"
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchAppointments()}
            disabled={loading}
            className="text-muted-foreground"
          >
            <RefreshCw className={`h-4 w-4 mr-1.5 ${loading ? "animate-spin" : ""}`} />
            Actualiser
          </Button>
        }
      />

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MiniStatCard
          icon={Calendar}
          label="Total"
          value={stats.total}
          color="bg-sky-500/10 text-sky-600"
        />
        <MiniStatCard
          icon={CalendarClock}
          label="Planifiés"
          value={stats.scheduled}
          color="bg-blue-500/10 text-blue-600"
        />
        <MiniStatCard
          icon={CheckCircle2}
          label="Confirmés"
          value={stats.confirmed}
          color="bg-emerald-500/10 text-emerald-600"
        />
        <MiniStatCard
          icon={XCircle}
          label="Annulés"
          value={stats.cancelled}
          color="bg-gray-500/10 text-gray-500"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par nom, email, entreprise…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <NativeSelect
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-44"
        >
          <option value="">Tous les statuts</option>
          {VALID_STATUSES.map((s) => (
            <option key={s} value={s}>
              {APPOINTMENT_STATUS_LABELS[s]}
            </option>
          ))}
        </NativeSelect>
      </div>

      {/* Content */}
      {loading ? (
        <TableSkeleton rows={5} />
      ) : error ? (
        <ErrorState onRetry={() => fetchAppointments()} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="Aucun rendez-vous"
          description="Aucun rendez-vous ne correspond à vos critères."
        />
      ) : (
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          {/* Table header */}
          <div className="p-5 border-b border-border flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4.5 w-4.5 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">
                {filtered.length} rendez-vous
              </span>
            </div>
            <Badge variant="secondary" className="text-xs">
              {statusFilter
                ? APPOINTMENT_STATUS_LABELS[statusFilter] || statusFilter
                : "Tous"}
            </Badge>
          </div>

          {/* Appointment rows */}
          <div className="divide-y divide-border">
            {filtered.map((appointment) => {
              const StatusIcon = APPOINTMENT_STATUS_ICONS[appointment.status] || Clock;
              return (
                <div
                  key={appointment.id}
                  className="p-4 flex items-center gap-4 hover:bg-muted/30 transition-colors cursor-pointer group"
                  onClick={() => {
                    setSelectedId(appointment.id);
                    setDetailOpen(true);
                  }}
                >
                  {/* Status icon */}
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg shrink-0 ${
                      APPOINTMENT_STATUS_COLORS[appointment.status]
                        ? "bg-blue-500/10"
                        : "bg-muted"
                    }`}
                  >
                    <StatusIcon className="h-5 w-5 text-muted-foreground" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground truncate">
                        {appointment.contactName || appointment.lead?.name || "—"}
                      </span>
                      {appointment.lead?.company && (
                        <span className="text-xs text-muted-foreground truncate">
                          · {appointment.lead.company}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(appointment.date)}
                      </span>
                      {appointment.time && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {appointment.time}
                        </span>
                      )}
                      {appointment.location && (
                        <span className="flex items-center gap-1 truncate">
                          <MapPin className="h-3 w-3 shrink-0" />
                          {appointment.location}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Status badge */}
                  <Pill
                    label={APPOINTMENT_STATUS_LABELS[appointment.status] || appointment.status}
                    colorClass={APPOINTMENT_STATUS_COLORS[appointment.status] || "bg-muted text-muted-foreground border-muted"}
                  />

                  {/* Chevron */}
                  <ChevronRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors shrink-0" />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── Detail Dialog ──────────────────────────────────────────────────── */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">
              Détails du rendez-vous
            </DialogTitle>
          </DialogHeader>

          {selectedAppointment && (
            <div className="space-y-4">
              {/* Contact info */}
              <div className="grid grid-cols-2 gap-3">
                <InfoField
                  icon={<User className="h-4 w-4" />}
                  label="Contact"
                  value={selectedAppointment.contactName || selectedAppointment.lead?.name || "—"}
                />
                <InfoField
                  icon={<Building2 className="h-4 w-4" />}
                  label="Société"
                  value={selectedAppointment.lead?.company || "—"}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <InfoField
                  icon={<Calendar className="h-4 w-4" />}
                  label="Date"
                  value={formatDate(selectedAppointment.date)}
                />
                <InfoField
                  icon={<Clock className="h-4 w-4" />}
                  label="Heure"
                  value={selectedAppointment.time || "—"}
                />
              </div>

              <InfoField
                icon={<MapPin className="h-4 w-4" />}
                label="Lieu"
                value={selectedAppointment.location || "—"}
              />

              {selectedAppointment.employee && (
                <InfoField
                  icon={<User className="h-4 w-4" />}
                  label="Employé"
                  value={selectedAppointment.employee.name}
                />
              )}

              {/* Current status */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Statut :</span>
                <Pill
                  label={
                    APPOINTMENT_STATUS_LABELS[selectedAppointment.status] ||
                    selectedAppointment.status
                  }
                  colorClass={
                    APPOINTMENT_STATUS_COLORS[selectedAppointment.status] ||
                    "bg-muted text-muted-foreground border-muted"
                  }
                />
              </div>

              {/* Status change */}
              <div className="pt-3 border-t border-border">
                <p className="text-sm font-medium text-foreground mb-2">
                  Changer le statut
                </p>
                <div className="flex flex-wrap gap-2">
                  {VALID_STATUSES.map((s) => (
                    <Button
                      key={s}
                      variant={selectedAppointment.status === s ? "default" : "outline"}
                      size="sm"
                      disabled={changingStatus || selectedAppointment.status === s}
                      onClick={() => handleChangeStatus(selectedAppointment.id, s)}
                      className="text-xs"
                    >
                      {APPOINTMENT_STATUS_LABELS[s]}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Delete button */}
              <div className="pt-3 border-t border-border">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => {
                    setDetailOpen(false);
                    setDeleteId(selectedAppointment.id);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-1.5" />
                  Supprimer ce rendez-vous
                </Button>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailOpen(false)}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Delete confirmation ────────────────────────────────────────────── */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer le rendez-vous ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le rendez-vous sera définitivement
              supprimé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// ─── Helper components ────────────────────────────────────────────────────────

function InfoField({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="mt-0.5 text-muted-foreground">{icon}</div>
      <div className="min-w-0">
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
          {label}
        </div>
        <div className="text-sm text-foreground truncate">{value}</div>
      </div>
    </div>
  );
}
