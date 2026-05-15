import { FolderKanban, Trophy, Share2, Settings } from "lucide-react";
import Link from "next/link";
import { getProjects, getCompetitions, getSocialLinks, getContacts } from "@/lib/actions/admin";

export default async function AdminDashboardPage() {
  const [projects, competitions, socialLinks, contacts] = await Promise.all([
    getProjects(),
    getCompetitions(),
    getSocialLinks(),
    getContacts(),
  ]);

  const stats = [
    {
      label: "Projects",
      value: projects.length,
      icon: FolderKanban,
      href: "/admin/projects",
      color: "from-blue-500 to-cyan-500",
    },
    {
      label: "Competitions",
      value: competitions.length,
      icon: Trophy,
      href: "/admin/competitions",
      color: "from-amber-500 to-orange-500",
    },
    {
      label: "Social Links",
      value: socialLinks.length,
      icon: Share2,
      href: "/admin/socials",
      color: "from-emerald-500 to-teal-500",
    },
    {
      label: "Contacts",
      value: contacts.length,
      icon: Settings,
      href: "/admin/socials",
      color: "from-violet-500 to-purple-500",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-semibold text-2xl">Dashboard</h1>
        <p className="text-muted-foreground text-sm">
          Manage your portfolio content from here.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group relative overflow-hidden rounded-xl border border-border/50 bg-card/50 p-5 backdrop-blur-sm transition-all hover:border-border hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">{stat.label}</p>
                <p className="mt-1 font-bold text-3xl">{stat.value}</p>
              </div>
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${stat.color} shadow-lg`}
              >
                <stat.icon className="h-5 w-5 text-white" />
              </div>
            </div>
            <div
              className={`absolute -bottom-12 -right-12 h-24 w-24 rounded-full bg-gradient-to-br ${stat.color} opacity-5 transition-all group-hover:opacity-10`}
            />
          </Link>
        ))}
      </div>

      <div className="rounded-xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
        <h2 className="mb-4 font-semibold text-lg">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Link
            href="/admin/site-settings"
            className="flex items-center gap-3 rounded-lg border border-border/30 px-4 py-3 transition-all hover:border-violet-500/30 hover:bg-violet-500/5"
          >
            <Settings className="h-5 w-5 text-violet-400" />
            <div>
              <p className="font-medium text-sm">Site Settings</p>
              <p className="text-muted-foreground text-xs">
                Update hero, about, and meta info
              </p>
            </div>
          </Link>
          <Link
            href="/admin/projects"
            className="flex items-center gap-3 rounded-lg border border-border/30 px-4 py-3 transition-all hover:border-blue-500/30 hover:bg-blue-500/5"
          >
            <FolderKanban className="h-5 w-5 text-blue-400" />
            <div>
              <p className="font-medium text-sm">Add Project</p>
              <p className="text-muted-foreground text-xs">
                Showcase your latest work
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
