"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useContent, UserProject } from "@/context/ContentContext";

function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-zinc-800">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-4 py-3 text-sm font-semibold text-zinc-300 hover:text-white transition-colors"
      >
        {title}
        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AdminPanel() {
  const { content, userProjects, adminOpen, closeAdmin, updateContent, addProject, removeProject, lock, saveToServer, saving } = useContent();
  const [aboutText, setAboutText] = useState(content.about.paragraphs.join("\n\n"));
  const [form, setForm] = useState({ title: "", description: "", tags: "", github: "", demo: "" });

  const handleSave = () => {
    updateContent("about.paragraphs", aboutText.split("\n\n").filter(Boolean));
  };

  const handleAddProject = () => {
    if (!form.title.trim()) return;
    const project: UserProject = {
      id: Date.now().toString(),
      title: form.title.trim(),
      description: form.description.trim(),
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      github: form.github.trim() || undefined,
      demo: form.demo.trim() || undefined,
    };
    addProject(project);
    setForm({ title: "", description: "", tags: "", github: "", demo: "" });
  };

  return (
    <AnimatePresence>
      {adminOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/40"
            onClick={closeAdmin}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 z-[70] h-full w-full max-w-md bg-zinc-900/98 border-l border-zinc-800 shadow-2xl overflow-y-auto"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-zinc-900/95 backdrop-blur border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)] animate-pulse" />
                <span className="text-sm font-semibold text-white">Admin Panel</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { handleSave(); saveToServer(); lock(); closeAdmin(); }}
                  className="px-3 py-1.5 rounded-lg text-xs bg-zinc-800 text-zinc-400 hover:text-red-400 transition-colors"
                >
                  {saving ? "Saving..." : "Lock & Exit"}
                </button>
                <button
                  onClick={closeAdmin}
                  className="p-1.5 text-zinc-500 hover:text-white transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="divide-y divide-zinc-800">
              <Section title="Hero">
                <div>
                  <label className="text-xs text-zinc-500 mb-1 block">Line 1</label>
                  <input
                    value={content.hero.line1}
                    onChange={(e) => updateContent("hero.line1", e.target.value)}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-white outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-500 mb-1 block">Line 2</label>
                  <input
                    value={content.hero.line2}
                    onChange={(e) => updateContent("hero.line2", e.target.value)}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-white outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-500 mb-1 block">Subtitle</label>
                  <textarea
                    value={content.hero.subtitle}
                    onChange={(e) => updateContent("hero.subtitle", e.target.value)}
                    rows={3}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-white outline-none focus:border-blue-500 transition-colors resize-none"
                  />
                </div>
              </Section>

              <Section title="About">
                <div>
                  <label className="text-xs text-zinc-500 mb-1 block">Heading</label>
                  <input
                    value={content.about.heading}
                    onChange={(e) => updateContent("about.heading", e.target.value)}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-white outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-500 mb-1 block">Bio (blank line = paragraph break)</label>
                  <textarea
                    value={aboutText}
                    onChange={(e) => setAboutText(e.target.value)}
                    onBlur={handleSave}
                    rows={5}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-white outline-none focus:border-blue-500 transition-colors resize-none"
                  />
                </div>
              </Section>

              <Section title="Skills">
                <div className="space-y-4">
                  {content.skills.map((cat, ci) => (
                    <div key={ci} className="rounded-lg border border-zinc-800 bg-zinc-800/20 p-3 space-y-2">
                      <input
                        value={cat.title}
                        onChange={(e) => {
                          const updated = [...content.skills];
                          updated[ci] = { ...updated[ci], title: e.target.value };
                          updateContent("skills", updated);
                        }}
                        className="w-full rounded border border-zinc-700 bg-zinc-800/50 px-2 py-1 text-xs text-white outline-none focus:border-blue-500 transition-colors"
                      />
                      <textarea
                        value={cat.skills.join("\n")}
                        onChange={(e) => {
                          const updated = [...content.skills];
                          updated[ci] = { ...updated[ci], skills: e.target.value.split("\n").filter(Boolean) };
                          updateContent("skills", updated);
                        }}
                        rows={3}
                        placeholder="One skill per line"
                        className="w-full rounded border border-zinc-700 bg-zinc-800/50 px-2 py-1 text-xs text-white placeholder-zinc-500 outline-none focus:border-blue-500 transition-colors resize-none"
                      />
                    </div>
                  ))}
                </div>
              </Section>

              <Section title="Contact">
                <div>
                  <label className="text-xs text-zinc-500 mb-1 block">Tagline</label>
                  <input
                    value={content.contact.tagline}
                    onChange={(e) => updateContent("contact.tagline", e.target.value)}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-white outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </Section>

              <Section title="Projects" defaultOpen={false}>
                <div className="space-y-3">
                  {userProjects.length === 0 && (
                    <p className="text-xs text-zinc-500">No custom projects added yet.</p>
                  )}
                  {userProjects.map((p) => (
                    <div key={p.id} className="flex items-center justify-between rounded-lg bg-zinc-800/30 px-3 py-2">
                      <span className="text-sm text-zinc-300 truncate">{p.title}</span>
                      <button
                        onClick={() => removeProject(p.id)}
                        className="text-xs text-zinc-500 hover:text-red-400 transition-colors shrink-0 ml-2"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <div className="border-t border-zinc-800 pt-3 space-y-2">
                    <p className="text-xs font-semibold text-zinc-400">Add Project</p>
                    <input
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      placeholder="Project title"
                      className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-blue-500 transition-colors"
                    />
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      placeholder="Short description"
                      rows={2}
                      className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-blue-500 transition-colors resize-none"
                    />
                    <input
                      value={form.tags}
                      onChange={(e) => setForm({ ...form, tags: e.target.value })}
                      placeholder="Tags (comma separated)"
                      className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-blue-500 transition-colors"
                    />
                    <input
                      value={form.github}
                      onChange={(e) => setForm({ ...form, github: e.target.value })}
                      placeholder="GitHub URL (optional)"
                      className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-blue-500 transition-colors"
                    />
                    <input
                      value={form.demo}
                      onChange={(e) => setForm({ ...form, demo: e.target.value })}
                      placeholder="Demo URL (optional)"
                      className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-blue-500 transition-colors"
                    />
                    <button
                      onClick={handleAddProject}
                      disabled={!form.title.trim()}
                      className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 py-2 text-sm font-medium text-white hover:shadow-lg hover:shadow-blue-500/25 transition-shadow disabled:opacity-40"
                    >
                      Add Project
                    </button>
                  </div>
                </div>
              </Section>
            </div>

            <div className="p-4">
              <button
                onClick={() => { handleSave(); saveToServer(); lock(); closeAdmin(); }}
                disabled={saving}
                className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 py-3 text-sm font-medium text-white hover:shadow-lg hover:shadow-blue-500/25 transition-shadow disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save & Lock"}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
