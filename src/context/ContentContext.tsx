"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from "react";

export interface UserProject {
  id: string;
  title: string;
  description: string;
  tags: string[];
  github?: string;
  demo?: string;
  favicon?: string;
}

export interface SkillCategory {
  title: string;
  skills: string[];
}

export interface EditableContent {
  hero: {
    line1: string;
    line2: string;
    subtitle: string;
  };
  about: {
    heading: string;
    paragraphs: string[];
  };
  skills: SkillCategory[];
  contact: {
    tagline: string;
  };
}

interface ContentContextType {
  content: EditableContent;
  userProjects: UserProject[];
  isAdmin: boolean;
  adminOpen: boolean;
  passwordPromptOpen: boolean;
  setPasswordPromptOpen: (v: boolean) => void;
  unlock: (password: string) => Promise<boolean>;
  toggleAdmin: () => void;
  closeAdmin: () => void;
  updateContent: (path: string, value: unknown) => void;
  addProject: (project: UserProject) => void;
  removeProject: (id: string) => void;
  lock: () => void;
  saving: boolean;
  saveToServer: () => Promise<void>;
}

const STORAGE_KEY = "sema-folio-content";
const PROJECTS_KEY = "sema-folio-projects";
const CONTENT_VERSION = 2;
const VERSION_KEY = "sema-folio-content-version";

const defaultContent: EditableContent = {
  hero: {
    line1: "Building Digital",
    line2: "Experiences",
    subtitle:
      "Software & Web Developer crafting modern, performant applications with cutting-edge technologies.",
  },
  about: {
    heading: "Turning ideas into digital reality",
    paragraphs: [
      "I'm Jiro Luis Fandiño Manalo — also known as Semadotdev — a software and web developer passionate about building intelligent, performant applications. From AI-powered chat interfaces to full-stack platforms, I bring ideas to life through clean code and thoughtful design.",
      "Based in Alaminos, Laguna, I specialize in full-stack development, constantly exploring new technologies and crafting digital experiences that make a difference.",
    ],
  },
  skills: [
    { title: "Programming", skills: ["Web Development", "Software Development", "Algorithms", "Python", "JavaScript", "TypeScript"] },
    { title: "Technical", skills: ["Full-Stack Development", "System Design", "IT Support", "DevOps Basics"] },
    { title: "Soft Skills", skills: ["Adaptability", "Communication", "Goal-Oriented", "Time Management"] },
    { title: "Certifications", skills: ["Cisco: Intro to Data Science", "Cisco: Data Science Essentials", "Cisco: Python for Data Science"] },
  ],
  contact: {
    tagline:
      "Have a project in mind? Let's work together to bring your ideas to life.",
  },
};

const ContentContext = createContext<ContentContextType | null>(null);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<EditableContent>(defaultContent);
  const [userProjects, setUserProjects] = useState<UserProject[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [passwordPromptOpen, setPasswordPromptOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [serverLoaded, setServerLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const adminPasswordRef = useRef("");

  useEffect(() => {
    let cancelled = false;

    async function loadFromServer() {
      try {
        const res = await fetch("/api/admin/content");
        if (res.ok) {
          const data = await res.json();
          if (data.content && !cancelled) {
            setContent({ ...defaultContent, ...data.content });
          }
          if (data.userProjects && !cancelled) {
            setUserProjects(data.userProjects);
          }
        }
      } catch {
        // API unreachable (e.g. local dev without KV)
      }
      if (!cancelled) setServerLoaded(true);
    }

    loadFromServer();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (serverLoaded) {
      try {
        const version = localStorage.getItem(VERSION_KEY);
        if (version !== String(CONTENT_VERSION)) {
          localStorage.removeItem(STORAGE_KEY);
          localStorage.removeItem(PROJECTS_KEY);
          localStorage.setItem(VERSION_KEY, String(CONTENT_VERSION));
        } else {
          const saved = localStorage.getItem(STORAGE_KEY);
          if (saved) {
            const parsed = JSON.parse(saved);
            setContent((prev) => ({ ...prev, ...parsed }));
          }
          const projects = localStorage.getItem(PROJECTS_KEY);
          if (projects) setUserProjects((prev) => [...prev, ...JSON.parse(projects)]);
        }
      } catch {
        // corrupted local data
      }
      setLoaded(true);
    }
  }, [serverLoaded]);

  useEffect(() => {
    if (loaded) localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
  }, [content, loaded]);

  useEffect(() => {
    if (loaded) localStorage.setItem(PROJECTS_KEY, JSON.stringify(userProjects));
  }, [userProjects, loaded]);

  const saveToServer = useCallback(async () => {
    if (!adminPasswordRef.current) return;
    setSaving(true);
    try {
      await fetch("/api/admin/content", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": adminPasswordRef.current,
        },
        body: JSON.stringify({ content, userProjects }),
      });
    } catch {
      // silently fail
    } finally {
      setSaving(false);
    }
  }, [content, userProjects]);

  const unlock = useCallback(async (password: string) => {
    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const { valid } = await res.json();
      if (valid) {
        adminPasswordRef.current = password;
        setIsAdmin(true);
        setPasswordPromptOpen(false);
        setAdminOpen(true);
        return true;
      }
    } catch {
      // verification failed
    }
    return false;
  }, []);

  const lock = useCallback(() => {
    adminPasswordRef.current = "";
    setIsAdmin(false);
    setAdminOpen(false);
  }, []);

  const toggleAdmin = useCallback(() => {
    setAdminOpen((v) => !v);
  }, []);

  const closeAdmin = useCallback(() => {
    setAdminOpen(false);
  }, []);

  const updateContent = useCallback((path: string, value: unknown) => {
    setContent((prev) => {
      const parts = path.split(".");
      const newContent = { ...prev };
      let obj: Record<string, unknown> = newContent as unknown as Record<string, unknown>;
      for (let i = 0; i < parts.length - 1; i++) {
        const next = obj[parts[i]];
        if (next && typeof next === "object" && !Array.isArray(next)) {
          obj[parts[i]] = { ...(next as Record<string, unknown>) };
        } else if (Array.isArray(next)) {
          obj[parts[i]] = [...next];
        }
        obj = obj[parts[i]] as Record<string, unknown>;
      }
      obj[parts[parts.length - 1]] = value;
      return newContent;
    });
  }, []);

  const addProject = useCallback((project: UserProject) => {
    setUserProjects((prev) => [...prev, project]);
  }, []);

  const removeProject = useCallback((id: string) => {
    setUserProjects((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return (
    <ContentContext.Provider
      value={{
        content,
        userProjects,
        isAdmin,
        adminOpen,
        passwordPromptOpen,
        setPasswordPromptOpen,
        unlock,
        toggleAdmin,
        closeAdmin,
        updateContent,
        addProject,
        removeProject,
        lock,
        saving,
        saveToServer,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent must be used within ContentProvider");
  return ctx;
}
