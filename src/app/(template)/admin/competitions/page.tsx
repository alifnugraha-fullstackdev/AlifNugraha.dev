"use client";

import { useState, useEffect, useTransition } from "react";
import { Pencil, Trash2, Loader2, Upload, GripVertical } from "lucide-react";
import { toast } from "sonner";
import { getCompetitions, createCompetition, updateCompetition, deleteCompetition } from "@/lib/actions/admin";

export default function CompetitionsAdminPage() {
  const [competitions, setCompetitions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    dates: "",
    location: "",
    description: "",
    imageUrl: "",
    flags: "",
  });

  useEffect(() => {
    fetchCompetitions();
  }, []);

  const fetchCompetitions = async () => {
    try {
      const data = await getCompetitions();
      setCompetitions(data);
    } catch (error) {
      toast.error("Failed to load competitions");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (comp: any) => {
    setEditingId(comp.id);
    setFormData({
      title: comp.title,
      dates: comp.dates,
      location: comp.location,
      description: comp.description,
      imageUrl: comp.imageUrl || "",
      flags: (comp.flags || []).join(", "),
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({
      title: "",
      dates: "",
      location: "",
      description: "",
      imageUrl: "",
      flags: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        const payload = {
          title: formData.title,
          dates: formData.dates,
          location: formData.location,
          description: formData.description,
          imageUrl: formData.imageUrl,
          flags: formData.flags.split(",").map((f) => f.trim()).filter(Boolean),
        };

        if (editingId) {
          await updateCompetition(editingId, payload);
          toast.success("Competition updated");
        } else {
          await createCompetition(payload);
          toast.success("Competition created");
        }
        await fetchCompetitions();
        handleCancel();
      } catch (error) {
        toast.error("Failed to save competition");
      }
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this competition?")) return;
    startTransition(async () => {
      try {
        await deleteCompetition(id);
        toast.success("Competition deleted");
        await fetchCompetitions();
      } catch (error) {
        toast.error("Failed to delete competition");
      }
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append("file", file);
    uploadData.append("folder", "competitions");

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: uploadData,
      });
      const data = await res.json();
      if (data.url) {
        setFormData((prev) => ({ ...prev, imageUrl: data.url }));
        toast.success("Image uploaded!");
      } else {
        toast.error(data.error || "Upload failed");
      }
    } catch {
      toast.error("Upload failed");
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-semibold text-2xl">Competitions & Events</h1>
        <p className="text-muted-foreground text-sm">
          Manage your hackathons and competitions
        </p>
      </div>

      <section className="rounded-xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
        <h2 className="mb-4 font-semibold text-lg">
          {editingId ? "Edit Competition" : "Add New Competition"}
        </h2>
        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-muted-foreground text-sm">Title</label>
            <input
              required
              value={formData.title}
              onChange={(e) => setFormData((s) => ({ ...s, title: e.target.value }))}
              className="w-full rounded-lg border border-border/50 bg-muted/20 px-4 py-2.5 text-sm outline-none transition-all focus:border-violet-500/50"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-muted-foreground text-sm">Dates</label>
            <input
              required
              value={formData.dates}
              onChange={(e) => setFormData((s) => ({ ...s, dates: e.target.value }))}
              placeholder="March, 2026"
              className="w-full rounded-lg border border-border/50 bg-muted/20 px-4 py-2.5 text-sm outline-none transition-all focus:border-violet-500/50"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-muted-foreground text-sm">Location</label>
            <input
              required
              value={formData.location}
              onChange={(e) => setFormData((s) => ({ ...s, location: e.target.value }))}
              placeholder="Jakarta, Indonesia"
              className="w-full rounded-lg border border-border/50 bg-muted/20 px-4 py-2.5 text-sm outline-none transition-all focus:border-violet-500/50"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-muted-foreground text-sm">Description</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData((s) => ({ ...s, description: e.target.value }))}
              rows={3}
              className="w-full rounded-lg border border-border/50 bg-muted/20 px-4 py-2.5 text-sm outline-none transition-all focus:border-violet-500/50"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-muted-foreground text-sm">Flags (comma separated)</label>
            <input
              value={formData.flags}
              onChange={(e) => setFormData((s) => ({ ...s, flags: e.target.value }))}
              placeholder="committee, winner:1st place"
              className="w-full rounded-lg border border-border/50 bg-muted/20 px-4 py-2.5 text-sm outline-none transition-all focus:border-violet-500/50"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-muted-foreground text-sm">Image URL</label>
            <div className="flex gap-2">
              <input
                value={formData.imageUrl}
                onChange={(e) => setFormData((s) => ({ ...s, imageUrl: e.target.value }))}
                className="flex-1 rounded-lg border border-border/50 bg-muted/20 px-4 py-2.5 text-sm outline-none transition-all focus:border-violet-500/50"
              />
              <label className="flex cursor-pointer items-center justify-center rounded-lg border border-border/50 bg-muted/20 px-3 py-2.5 transition-all hover:bg-muted/40">
                <Upload className="h-4 w-4" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            </div>
          </div>
          <div className="flex gap-2 sm:col-span-2">
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 font-medium text-sm text-white transition-all hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50"
            >
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {editingId ? "Update Competition" : "Add Competition"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-lg border border-border/50 px-4 py-2 font-medium text-sm transition-all hover:bg-muted"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="space-y-4">
        {competitions.map((comp) => (
          <div
            key={comp.id}
            className="flex items-center gap-4 rounded-xl border border-border/50 bg-card/50 p-4 backdrop-blur-sm"
          >
            <GripVertical className="h-5 w-5 cursor-grab text-muted-foreground" />
            {comp.imageUrl && (
              <img
                src={comp.imageUrl}
                alt={comp.title}
                className="h-12 w-12 rounded-lg object-cover"
              />
            )}
            <div className="flex-1">
              <h3 className="font-medium">{comp.title}</h3>
              <p className="line-clamp-1 text-muted-foreground text-sm">
                {comp.dates} • {comp.location}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(comp)}
                className="rounded-lg p-2 text-muted-foreground transition-all hover:bg-violet-500/10 hover:text-violet-400"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(comp.id)}
                className="rounded-lg p-2 text-muted-foreground transition-all hover:bg-red-500/10 hover:text-red-400"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
