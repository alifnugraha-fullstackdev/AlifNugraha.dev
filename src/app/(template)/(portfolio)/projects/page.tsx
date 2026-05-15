import { PathUtils } from "fumadocs-core/source";

import { HeaderBanner } from "./banner.client";
import { projectsData } from "@/constants/portfolio/projects";
import { ProjectCard } from "@/components/portfolio/project-card";

import { Badge } from "@/components/ui/badge";
import { getCachedProjects } from "@/lib/data";

export default async function ProjectsPage() {
  const dbProjects = await getCachedProjects();
  
  const mappedProjects = dbProjects.map((p) => ({
    title: p.title,
    description: p.description,
    imageId: p.imageUrl || p.imageId,
    badge: (p.badges || []).map((b: string) => <Badge key={b}>{b}</Badge>),
    link: p.liveUrl || p.link,
    repo: p.repoUrl || p.repo,
    unmaintained: p.unmaintained,
  }));

  return (
    <main>
      <section className="w-full border-separator/10 border-b">
        <div className="inner relative flex h-16 gap-2 border-separator/10 border-x p-2"></div>
      </section>
      <HeaderBanner />
      <section className="w-full border-separator/10">
        <div className="inner relative grid grid-cols-1 gap-2 border-separator/10 border-x p-2 md:grid-cols-2">
          {mappedProjects.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
      </section>
    </main>
  );
}

function _getName(path: string) {
  return PathUtils.basename(path, PathUtils.extname(path));
}
