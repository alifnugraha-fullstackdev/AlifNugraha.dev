"use client";

import { useState, useEffect, useTransition } from "react";
import { Save, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";

type Settings = Record<string, string>;

export default function SiteSettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    hero_name: "",
    hero_subtitle: "",
    hero_quote: "",
    about_bio: "",
    about_birth_date: "",
    site_title: "",
    site_description: "",
    favicon_url: "",
    about_hello_image: "",
  });
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.settings) {
          setSettings((prev) => ({ ...prev, ...data.settings }));
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = () => {
    startTransition(async () => {
      try {
        const res = await fetch("/api/admin/settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(settings),
        });
        if (res.ok) {
          toast.success("Settings saved successfully!");
        } else {
          toast.error("Failed to save settings");
        }
      } catch {
        toast.error("Failed to save settings");
      }
    });
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "site");

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setSettings((prev) => ({ ...prev, [field]: data.url }));
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-semibold text-2xl">Site Settings</h1>
          <p className="text-muted-foreground text-sm">
            Update your portfolio's core content
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isPending}
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 font-medium text-sm text-white transition-all hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save Changes
        </button>
      </div>

      {/* Hero Section */}
      <section className="rounded-xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
        <h2 className="mb-4 font-semibold text-lg">Hero Section</h2>
        <div className="grid gap-4">
          <div>
            <label className="mb-1.5 block text-muted-foreground text-sm">
              Name / Greeting
            </label>
            <input
              value={settings.hero_name}
              onChange={(e) =>
                setSettings((s) => ({ ...s, hero_name: e.target.value }))
              }
              placeholder="hey, i'm Alif Nugraha 👋"
              className="w-full rounded-lg border border-border/50 bg-muted/20 px-4 py-2.5 text-sm outline-none transition-all focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-muted-foreground text-sm">
              Subtitle
            </label>
            <textarea
              value={settings.hero_subtitle}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  hero_subtitle: e.target.value,
                }))
              }
              placeholder="a self-taught software engineer..."
              rows={2}
              className="w-full rounded-lg border border-border/50 bg-muted/20 px-4 py-2.5 text-sm outline-none transition-all focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-muted-foreground text-sm">
              Quote
            </label>
            <input
              value={settings.hero_quote}
              onChange={(e) =>
                setSettings((s) => ({ ...s, hero_quote: e.target.value }))
              }
              placeholder="building things that matter..."
              className="w-full rounded-lg border border-border/50 bg-muted/20 px-4 py-2.5 text-sm outline-none transition-all focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20"
            />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="rounded-xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
        <h2 className="mb-4 font-semibold text-lg">About Section</h2>
        <div className="grid gap-4">
          <div>
            <label className="mb-1.5 block text-muted-foreground text-sm">
              Bio Text
            </label>
            <textarea
              value={settings.about_bio}
              onChange={(e) =>
                setSettings((s) => ({ ...s, about_bio: e.target.value }))
              }
              placeholder="Your bio description..."
              rows={8}
              className="w-full rounded-lg border border-border/50 bg-muted/20 px-4 py-2.5 text-sm outline-none transition-all focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20"
            />
            <p className="mt-2 text-xs text-muted-foreground">
              Tip: You can use <code>{'{age}'}</code> and <code>{'{wakatime}'}</code> anywhere in the text to automatically display your live age and coding hours.
            </p>
          </div>
          <div>
            <label className="mb-1.5 block text-muted-foreground text-sm">
              Birth Date
            </label>
            <input
              type="date"
              value={settings.about_birth_date}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  about_birth_date: e.target.value,
                }))
              }
              className="w-full rounded-lg border border-border/50 bg-muted/20 px-4 py-2.5 text-sm outline-none transition-all focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-muted-foreground text-sm">
              "Hello" Image URL
            </label>
            <div className="flex gap-2">
              <input
                value={settings.about_hello_image}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    about_hello_image: e.target.value,
                  }))
                }
                placeholder="/hello_typography.png"
                className="flex-1 rounded-lg border border-border/50 bg-muted/20 px-4 py-2.5 text-sm outline-none transition-all focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20"
              />
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-border/50 bg-muted/20 px-3 py-2.5 text-sm transition-all hover:bg-muted/40">
                <Upload className="h-4 w-4" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e, "about_hello_image")}
                />
              </label>
            </div>
          </div>
        </div>
      </section>

      {/* SEO & Meta */}
      <section className="rounded-xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
        <h2 className="mb-4 font-semibold text-lg">SEO & Meta</h2>
        <div className="grid gap-4">
          <div>
            <label className="mb-1.5 block text-muted-foreground text-sm">
              Site Title
            </label>
            <input
              value={settings.site_title}
              onChange={(e) =>
                setSettings((s) => ({ ...s, site_title: e.target.value }))
              }
              placeholder="Alif Nugraha"
              className="w-full rounded-lg border border-border/50 bg-muted/20 px-4 py-2.5 text-sm outline-none transition-all focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-muted-foreground text-sm">
              Site Description
            </label>
            <textarea
              value={settings.site_description}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  site_description: e.target.value,
                }))
              }
              placeholder="A portfolio website..."
              rows={2}
              className="w-full rounded-lg border border-border/50 bg-muted/20 px-4 py-2.5 text-sm outline-none transition-all focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-muted-foreground text-sm">
              Favicon URL
            </label>
            <div className="flex gap-2">
              <input
                value={settings.favicon_url}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    favicon_url: e.target.value,
                  }))
                }
                placeholder="https://..."
                className="flex-1 rounded-lg border border-border/50 bg-muted/20 px-4 py-2.5 text-sm outline-none transition-all focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20"
              />
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-border/50 bg-muted/20 px-3 py-2.5 text-sm transition-all hover:bg-muted/40">
                <Upload className="h-4 w-4" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e, "favicon_url")}
                />
              </label>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
