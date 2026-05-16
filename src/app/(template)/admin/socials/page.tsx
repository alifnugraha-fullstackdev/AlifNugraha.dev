"use client";

import { useState, useEffect, useTransition, useRef } from "react";
import { Pencil, Trash2, Loader2, GripVertical, Upload, X, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import {
  getSocialLinks,
  createSocialLink,
  updateSocialLink,
  deleteSocialLink,
  getContacts,
  createContact,
  updateContact,
  deleteContact,
  uploadIcon,
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
    iconUrl: "",
    displayName: "",
  });
  const [socialIconFile, setSocialIconFile] = useState<File | null>(null);
  const [socialIconPreview, setSocialIconPreview] = useState<string | null>(null);
  const socialFileRef = useRef<HTMLInputElement>(null);

  // State for Contacts Form
  const [editingContactId, setEditingContactId] = useState<string | null>(null);
  const [contactForm, setContactForm] = useState({
    platform: "",
    contactValue: "",
    url: "",
    iconName: "",
    iconUrl: "",
  });
  const [contactIconFile, setContactIconFile] = useState<File | null>(null);
  const [contactIconPreview, setContactIconPreview] = useState<string | null>(null);
  const contactFileRef = useRef<HTMLInputElement>(null);

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

  // ─── Icon File Handlers ───
  const handleSocialFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 500 * 1024) {
      toast.error("File terlalu besar. Maksimum 500KB");
      return;
    }
    setSocialIconFile(file);
    setSocialIconPreview(URL.createObjectURL(file));
  };

  const handleContactFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 500 * 1024) {
      toast.error("File terlalu besar. Maksimum 500KB");
      return;
    }
    setContactIconFile(file);
    setContactIconPreview(URL.createObjectURL(file));
  };

  const clearSocialIcon = () => {
    setSocialIconFile(null);
    setSocialIconPreview(null);
    setSocialForm((s) => ({ ...s, iconUrl: "" }));
    if (socialFileRef.current) socialFileRef.current.value = "";
  };

  const clearContactIcon = () => {
    setContactIconFile(null);
    setContactIconPreview(null);
    setContactForm((s) => ({ ...s, iconUrl: "" }));
    if (contactFileRef.current) contactFileRef.current.value = "";
  };

  // ─── Social Links Handlers ───
  const handleSocialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        let iconUrl = socialForm.iconUrl;

        // Upload icon file if provided
        if (socialIconFile) {
          const fd = new FormData();
          fd.append("file", socialIconFile);
          iconUrl = await uploadIcon(fd);
        }

        const payload = {
          platform: socialForm.platform,
          url: socialForm.url,
          iconName: socialForm.iconName || "Link",
          iconUrl: iconUrl || undefined,
          displayName: socialForm.displayName || undefined,
        };

        if (editingSocialId) {
          await updateSocialLink(editingSocialId, {
            ...payload,
            iconUrl: iconUrl || null,
          });
          toast.success("Social link updated");
        } else {
          await createSocialLink(payload);
          toast.success("Social link created");
        }
        await fetchData();
        setEditingSocialId(null);
        setSocialForm({ platform: "", url: "", iconName: "", iconUrl: "", displayName: "" });
        clearSocialIcon();
      } catch (error: any) {
        toast.error(error?.message || "Failed to save social link");
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
        let iconUrl = contactForm.iconUrl;

        // Upload icon file if provided
        if (contactIconFile) {
          const fd = new FormData();
          fd.append("file", contactIconFile);
          iconUrl = await uploadIcon(fd);
        }

        const payload = {
          platform: contactForm.platform,
          contactValue: contactForm.contactValue,
          url: contactForm.url,
          iconName: contactForm.iconName || "Link",
          iconUrl: iconUrl || undefined,
        };

        if (editingContactId) {
          await updateContact(editingContactId, {
            ...payload,
            iconUrl: iconUrl || null,
          });
          toast.success("Contact updated");
        } else {
          await createContact(payload);
          toast.success("Contact created");
        }
        await fetchData();
        setEditingContactId(null);
        setContactForm({ platform: "", contactValue: "", url: "", iconName: "", iconUrl: "" });
        clearContactIcon();
      } catch (error: any) {
        toast.error(error?.message || "Failed to save contact");
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

            {/* Icon Upload Section */}
            <div className="space-y-3">
              <label className="mb-1.5 block text-muted-foreground text-sm">
                Icon <span className="text-xs opacity-60">(Upload gambar atau ketik nama icon)</span>
              </label>

              {/* Upload Area */}
              <div className="relative">
                <input
                  ref={socialFileRef}
                  type="file"
                  accept=".svg,.png,.webp,.jpg,.jpeg,.ico"
                  onChange={handleSocialFileChange}
                  className="hidden"
                  id="social-icon-upload"
                />
                {socialIconPreview || socialForm.iconUrl ? (
                  <div className="flex items-center gap-3 rounded-lg border border-violet-500/30 bg-violet-500/5 p-3">
                    <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg border border-border/50 bg-background">
                      <img
                        src={socialIconPreview || socialForm.iconUrl}
                        alt="Icon preview"
                        className="h-6 w-6 object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {socialIconFile?.name || "Custom icon"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {socialIconFile
                          ? `${(socialIconFile.size / 1024).toFixed(1)} KB`
                          : "Uploaded"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={clearSocialIcon}
                      className="rounded-md p-1.5 text-muted-foreground hover:bg-red-500/10 hover:text-red-400 transition-all"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label
                    htmlFor="social-icon-upload"
                    className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-border/50 p-3 transition-all hover:border-violet-500/50 hover:bg-violet-500/5"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted/30">
                      <Upload className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Upload Icon</p>
                      <p className="text-xs text-muted-foreground">
                        SVG, PNG, WEBP, ICO (max 500KB)
                      </p>
                    </div>
                  </label>
                )}
              </div>

              {/* Divider */}
              <div className="flex items-center gap-2">
                <div className="h-px flex-1 bg-border/50" />
                <span className="text-xs text-muted-foreground">atau</span>
                <div className="h-px flex-1 bg-border/50" />
              </div>

              {/* Icon Name Input */}
              <input
                value={socialForm.iconName}
                onChange={(e) => setSocialForm((s) => ({ ...s, iconName: e.target.value }))}
                placeholder="SiGithub, SiWhatsapp, Mail..."
                className="w-full rounded-lg border border-border/50 bg-muted/20 px-4 py-2.5 text-sm outline-none transition-all focus:border-violet-500/50"
              />
              <p className="text-xs text-muted-foreground opacity-60">
                Nama icon dari Lucide/SimpleIcons. Diabaikan jika upload icon.
              </p>
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
                    setSocialForm({ platform: "", url: "", iconName: "", iconUrl: "", displayName: "" });
                    clearSocialIcon();
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
              {/* Show icon preview */}
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-muted/30">
                {item.iconUrl ? (
                  <img src={item.iconUrl} alt={item.platform} className="h-5 w-5 object-contain" />
                ) : (
                  <ImageIcon className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
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
                      iconUrl: item.iconUrl || "",
                      displayName: item.displayName || "",
                    });
                    if (item.iconUrl) {
                      setSocialIconPreview(item.iconUrl);
                    }
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

            {/* Icon Upload Section */}
            <div className="space-y-3">
              <label className="mb-1.5 block text-muted-foreground text-sm">
                Icon <span className="text-xs opacity-60">(Upload gambar atau ketik nama icon)</span>
              </label>

              {/* Upload Area */}
              <div className="relative">
                <input
                  ref={contactFileRef}
                  type="file"
                  accept=".svg,.png,.webp,.jpg,.jpeg,.ico"
                  onChange={handleContactFileChange}
                  className="hidden"
                  id="contact-icon-upload"
                />
                {contactIconPreview || contactForm.iconUrl ? (
                  <div className="flex items-center gap-3 rounded-lg border border-violet-500/30 bg-violet-500/5 p-3">
                    <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg border border-border/50 bg-background">
                      <img
                        src={contactIconPreview || contactForm.iconUrl}
                        alt="Icon preview"
                        className="h-6 w-6 object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {contactIconFile?.name || "Custom icon"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {contactIconFile
                          ? `${(contactIconFile.size / 1024).toFixed(1)} KB`
                          : "Uploaded"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={clearContactIcon}
                      className="rounded-md p-1.5 text-muted-foreground hover:bg-red-500/10 hover:text-red-400 transition-all"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label
                    htmlFor="contact-icon-upload"
                    className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-border/50 p-3 transition-all hover:border-violet-500/50 hover:bg-violet-500/5"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted/30">
                      <Upload className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Upload Icon</p>
                      <p className="text-xs text-muted-foreground">
                        SVG, PNG, WEBP, ICO (max 500KB)
                      </p>
                    </div>
                  </label>
                )}
              </div>

              {/* Divider */}
              <div className="flex items-center gap-2">
                <div className="h-px flex-1 bg-border/50" />
                <span className="text-xs text-muted-foreground">atau</span>
                <div className="h-px flex-1 bg-border/50" />
              </div>

              {/* Icon Name Input */}
              <input
                value={contactForm.iconName}
                onChange={(e) => setContactForm((s) => ({ ...s, iconName: e.target.value }))}
                placeholder="Mail, SiDiscord..."
                className="w-full rounded-lg border border-border/50 bg-muted/20 px-4 py-2.5 text-sm outline-none transition-all focus:border-violet-500/50"
              />
              <p className="text-xs text-muted-foreground opacity-60">
                Nama icon dari Lucide/SimpleIcons. Diabaikan jika upload icon.
              </p>
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
                    setContactForm({ platform: "", contactValue: "", url: "", iconName: "", iconUrl: "" });
                    clearContactIcon();
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
              {/* Show icon preview */}
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-muted/30">
                {item.iconUrl ? (
                  <img src={item.iconUrl} alt={item.platform} className="h-5 w-5 object-contain" />
                ) : (
                  <ImageIcon className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
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
                      iconUrl: item.iconUrl || "",
                    });
                    if (item.iconUrl) {
                      setContactIconPreview(item.iconUrl);
                    }
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
