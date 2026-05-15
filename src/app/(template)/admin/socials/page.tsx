"use client";

import { useState, useEffect, useTransition } from "react";
import { Pencil, Trash2, Loader2, GripVertical } from "lucide-react";
import { toast } from "sonner";
import {
  getSocialLinks,
  createSocialLink,
  updateSocialLink,
  deleteSocialLink,
  getContacts,
  createContact,
  updateContact,
  deleteContact,
} from "@/lib/actions/admin";

export default function SocialsAdminPage() {
  const [socials, setSocials] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  
  // State for Social Links Form
  const [editingSocialId, setEditingSocialId] = useState<string | null>(null);
  const [socialForm, setSocialForm] = useState({
    platform: "",
    url: "",
    iconName: "",
    displayName: "",
  });

  // State for Contacts Form
  const [editingContactId, setEditingContactId] = useState<string | null>(null);
  const [contactForm, setContactForm] = useState({
    platform: "",
    contactValue: "",
    url: "",
    iconName: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [sData, cData] = await Promise.all([getSocialLinks(), getContacts()]);
      setSocials(sData);
      setContacts(cData);
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  // ─── Social Links Handlers ───
  const handleSocialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        if (editingSocialId) {
          await updateSocialLink(editingSocialId, socialForm);
          toast.success("Social link updated");
        } else {
          await createSocialLink(socialForm);
          toast.success("Social link created");
        }
        await fetchData();
        setEditingSocialId(null);
        setSocialForm({ platform: "", url: "", iconName: "", displayName: "" });
      } catch (error) {
        toast.error("Failed to save social link");
      }
    });
  };

  const handleSocialDelete = async (id: string) => {
    if (!confirm("Delete this social link?")) return;
    startTransition(async () => {
      await deleteSocialLink(id);
      toast.success("Deleted");
      await fetchData();
    });
  };

  // ─── Contacts Handlers ───
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        if (editingContactId) {
          await updateContact(editingContactId, contactForm);
          toast.success("Contact updated");
        } else {
          await createContact(contactForm);
          toast.success("Contact created");
        }
        await fetchData();
        setEditingContactId(null);
        setContactForm({ platform: "", contactValue: "", url: "", iconName: "" });
      } catch (error) {
        toast.error("Failed to save contact");
      }
    });
  };

  const handleContactDelete = async (id: string) => {
    if (!confirm("Delete this contact?")) return;
    startTransition(async () => {
      await deleteContact(id);
      toast.success("Deleted");
      await fetchData();
    });
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* ════════ SOCIAL LINKS SECTION ════════ */}
      <div className="space-y-6">
        <div>
          <h1 className="font-semibold text-2xl">Social Links</h1>
          <p className="text-muted-foreground text-sm">
            Appears in the footer navigation
          </p>
        </div>

        <section className="rounded-xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
          <h2 className="mb-4 font-semibold text-lg">
            {editingSocialId ? "Edit Social Link" : "Add Social Link"}
          </h2>
          <form onSubmit={handleSocialSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-muted-foreground text-sm">Platform Name</label>
              <input
                required
                value={socialForm.platform}
                onChange={(e) => setSocialForm((s) => ({ ...s, platform: e.target.value }))}
                placeholder="GitHub, Twitter..."
                className="w-full rounded-lg border border-border/50 bg-muted/20 px-4 py-2.5 text-sm outline-none transition-all focus:border-violet-500/50"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-muted-foreground text-sm">URL</label>
              <input
                required
                value={socialForm.url}
                onChange={(e) => setSocialForm((s) => ({ ...s, url: e.target.value }))}
                placeholder="https://..."
                className="w-full rounded-lg border border-border/50 bg-muted/20 px-4 py-2.5 text-sm outline-none transition-all focus:border-violet-500/50"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-muted-foreground text-sm">Icon Name (Lucide/SimpleIcons)</label>
              <input
                required
                value={socialForm.iconName}
                onChange={(e) => setSocialForm((s) => ({ ...s, iconName: e.target.value }))}
                placeholder="SiGithub, Twitter..."
                className="w-full rounded-lg border border-border/50 bg-muted/20 px-4 py-2.5 text-sm outline-none transition-all focus:border-violet-500/50"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-muted-foreground text-sm">Display Name (Optional)</label>
              <input
                value={socialForm.displayName}
                onChange={(e) => setSocialForm((s) => ({ ...s, displayName: e.target.value }))}
                placeholder="@username"
                className="w-full rounded-lg border border-border/50 bg-muted/20 px-4 py-2.5 text-sm outline-none transition-all focus:border-violet-500/50"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isPending}
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 font-medium text-sm text-white transition-all hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50"
              >
                {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Save Social Link
              </button>
              {editingSocialId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingSocialId(null);
                    setSocialForm({ platform: "", url: "", iconName: "", displayName: "" });
                  }}
                  className="rounded-lg border border-border/50 px-4 py-2 font-medium text-sm transition-all hover:bg-muted"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="space-y-3">
          {socials.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 rounded-xl border border-border/50 bg-card/50 p-4 backdrop-blur-sm"
            >
              <GripVertical className="h-5 w-5 cursor-grab text-muted-foreground" />
              <div className="flex-1">
                <h3 className="font-medium">{item.platform}</h3>
                <p className="line-clamp-1 text-muted-foreground text-sm">{item.url}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingSocialId(item.id);
                    setSocialForm({
                      platform: item.platform,
                      url: item.url,
                      iconName: item.iconName,
                      displayName: item.displayName || "",
                    });
                  }}
                  className="rounded-lg p-2 text-muted-foreground transition-all hover:bg-violet-500/10 hover:text-violet-400"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleSocialDelete(item.id)}
                  className="rounded-lg p-2 text-muted-foreground transition-all hover:bg-red-500/10 hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </section>
      </div>

      {/* ════════ CONTACTS SECTION ════════ */}
      <div className="space-y-6">
        <div>
          <h1 className="font-semibold text-2xl">Contacts</h1>
          <p className="text-muted-foreground text-sm">
            Appears in the About page
          </p>
        </div>

        <section className="rounded-xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
          <h2 className="mb-4 font-semibold text-lg">
            {editingContactId ? "Edit Contact" : "Add Contact"}
          </h2>
          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-muted-foreground text-sm">Platform Name</label>
              <input
                required
                value={contactForm.platform}
                onChange={(e) => setContactForm((s) => ({ ...s, platform: e.target.value }))}
                placeholder="Email, Discord..."
                className="w-full rounded-lg border border-border/50 bg-muted/20 px-4 py-2.5 text-sm outline-none transition-all focus:border-violet-500/50"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-muted-foreground text-sm">Contact Value</label>
              <input
                required
                value={contactForm.contactValue}
                onChange={(e) => setContactForm((s) => ({ ...s, contactValue: e.target.value }))}
                placeholder="hello@example.com"
                className="w-full rounded-lg border border-border/50 bg-muted/20 px-4 py-2.5 text-sm outline-none transition-all focus:border-violet-500/50"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-muted-foreground text-sm">URL</label>
              <input
                required
                value={contactForm.url}
                onChange={(e) => setContactForm((s) => ({ ...s, url: e.target.value }))}
                placeholder="mailto:..."
                className="w-full rounded-lg border border-border/50 bg-muted/20 px-4 py-2.5 text-sm outline-none transition-all focus:border-violet-500/50"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-muted-foreground text-sm">Icon Name (Lucide/SimpleIcons)</label>
              <input
                required
                value={contactForm.iconName}
                onChange={(e) => setContactForm((s) => ({ ...s, iconName: e.target.value }))}
                placeholder="Mail, SiDiscord..."
                className="w-full rounded-lg border border-border/50 bg-muted/20 px-4 py-2.5 text-sm outline-none transition-all focus:border-violet-500/50"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isPending}
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 font-medium text-sm text-white transition-all hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50"
              >
                {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Save Contact
              </button>
              {editingContactId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingContactId(null);
                    setContactForm({ platform: "", contactValue: "", url: "", iconName: "" });
                  }}
                  className="rounded-lg border border-border/50 px-4 py-2 font-medium text-sm transition-all hover:bg-muted"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="space-y-3">
          {contacts.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 rounded-xl border border-border/50 bg-card/50 p-4 backdrop-blur-sm"
            >
              <GripVertical className="h-5 w-5 cursor-grab text-muted-foreground" />
              <div className="flex-1">
                <h3 className="font-medium">{item.platform}</h3>
                <p className="line-clamp-1 text-muted-foreground text-sm">{item.contactValue}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingContactId(item.id);
                    setContactForm({
                      platform: item.platform,
                      contactValue: item.contactValue,
                      url: item.url,
                      iconName: item.iconName,
                    });
                  }}
                  className="rounded-lg p-2 text-muted-foreground transition-all hover:bg-violet-500/10 hover:text-violet-400"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleContactDelete(item.id)}
                  className="rounded-lg p-2 text-muted-foreground transition-all hover:bg-red-500/10 hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
