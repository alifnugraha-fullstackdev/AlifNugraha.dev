"use client";

import { useState, useEffect, useTransition } from "react";
import { Plus, Pencil, Trash2, Loader2, Upload, GripVertical } from "lucide-react";
import { toast } from "sonner";
import { getProjects, createProject, updateProject, deleteProject } from "@/lib/actions/admin";

export default function ProjectsAdminPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    repoUrl: "",
    liveUrl: "",
    badges: "",
    unmaintained: false,
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (project: any) => {
    setEditingId(project.id);
    setFormData({
      title: project.title,
      description: project.description,
      imageUrl: project.imageUrl || "",
      repoUrl: project.repoUrl || "",
      liveUrl: project.liveUrl || "",
      badges: (project.badges || []).join(", "),
      unmaintained: project.unmaintained || false,
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({
      title: "",
      description: "",
      imageUrl: "",
      repoUrl: "",
      liveUrl: "",
      badges: "",
      unmaintained: false,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        const payload = {
          title: formData.title,
          description: formData.description,
          imageUrl: formData.imageUrl,
          repoUrl: formData.repoUrl,
          liveUrl: formData.liveUrl,
          badges: formData.badges.split(",").map((b) => b.trim()).filter(Boolean),
          unmaintained: formData.unmaintained,
        };

        if (editingId) {
          await updateProject(editingId, payload);
          toast.success("Project updated");
        } else {
          await createProject(payload);
          toast.success("Project created");
        }
        await fetchProjects();
        handleCancel();
      } catch (error) {
        toast.error("Failed to save project");
      }
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    startTransition(async () => {
      try {
        await deleteProject(id);
        toast.success("Project deleted");
        await fetchProjects();
      } catch (error) {
        toast.error("Failed to delete project");
      }
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append("file", file);
    uploadData.append("folder", "projects");

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
        <h1 className="font-semibold text-2xl">Projects</h1>
        <p className="text-muted-foreground text-sm">
          Manage your portfolio projects
        </p>
      </div>

      {/* Form Section */}
      <section className="rounded-xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
        <h2 className="mb-4 font-semibold text-lg">
          {editingId ? "Edit Project" : "Add New Project"}
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
            <label className="mb-1.5 block text-muted-foreground text-sm">Repo URL</label>
            <input
              value={formData.repoUrl}
              onChange={(e) => setFormData((s) => ({ ...s, repoUrl: e.target.value }))}
              className="w-full rounded-lg border border-border/50 bg-muted/20 px-4 py-2.5 text-sm outline-none transition-all focus:border-violet-500/50"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-muted-foreground text-sm">Live URL</label>
            <input
              value={formData.liveUrl}
              onChange={(e) => setFormData((s) => ({ ...s, liveUrl: e.target.value }))}
              className="w-full rounded-lg border border-border/50 bg-muted/20 px-4 py-2.5 text-sm outline-none transition-all focus:border-violet-500/50"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-muted-foreground text-sm">Badges (comma separated)</label>
            <input
              value={formData.badges}
              onChange={(e) => setFormData((s) => ({ ...s, badges: e.target.value }))}
              placeholder="Next.js, Tailwind, etc."
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
          <div className="flex items-center gap-2 sm:col-span-2">
            <input
              type="checkbox"
              id="unmaintained"
              checked={formData.unmaintained}
              onChange={(e) => setFormData((s) => ({ ...s, unmaintained: e.target.checked }))}
              className="h-4 w-4 rounded border-border/50 bg-muted/20"
            />
            <label htmlFor="unmaintained" className="text-sm text-muted-foreground">
              Mark as unmaintained/archived
            </label>
          </div>
          <div className="flex gap-2 sm:col-span-2">
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 font-medium text-sm text-white transition-all hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50"
            >
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {editingId ? "Update Project" : "Add Project"}
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

      {/* List Section */}
      <section className="space-y-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="flex items-center gap-4 rounded-xl border border-border/50 bg-card/50 p-4 backdrop-blur-sm"
          >
            <GripVertical className="h-5 w-5 cursor-grab text-muted-foreground" />
            {project.imageUrl && (
              <img
                src={project.imageUrl}
                alt={project.title}
                className="h-12 w-12 rounded-lg object-cover"
              />
            )}
            <div className="flex-1">
              <h3 className="font-medium">{project.title}</h3>
              <p className="line-clamp-1 text-muted-foreground text-sm">
                {project.description}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(project)}
                className="rounded-lg p-2 text-muted-foreground transition-all hover:bg-violet-500/10 hover:text-violet-400"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(project.id)}
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
