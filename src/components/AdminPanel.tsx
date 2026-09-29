"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useContent, UserProject, TimelineEntry } from "@/context/ContentContext";
import Toast from "@/components/Toast";
import ConfirmModal from "@/components/ConfirmModal";

function Section({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
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
  const { content, userProjects, adminOpen, closeAdmin, updateContent, addProject, removeProject, lock, saveToServer, saving, discardChanges } = useContent();
  const [aboutText, setAboutText] = useState(content.about.paragraphs.join("\n\n"));
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [dirty, setDirty] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", tags: "", github: "", demo: "", favicon: "" });
  const [timelineForm, setTimelineForm] = useState({ role: "", company: "", period: "", description: "" });
  const [confirmClose, setConfirmClose] = useState(false);
  const snapshotRef = useRef({ content: null as unknown as typeof content, userProjects: null as unknown as typeof userProjects });

  const captureSnapshot = useCallback(() => {
    snapshotRef.current = { content: JSON.parse(JSON.stringify(content)), userProjects: JSON.parse(JSON.stringify(userProjects)) };
  }, [content, userProjects]);

  const markDirty = useCallback(() => setDirty(true), []);

  const handleSave = () => {
    updateContent("about.paragraphs", aboutText.split("\n\n").filter(Boolean));
    markDirty();
  };

  const handleSaveAndLock = async () => {
    handleSave();
    const ok = await saveToServer();
    if (ok) {
      setToast({ message: "Saved successfully", type: "success" });
      setDirty(false);
      lock();
      closeAdmin();
    } else {
      setToast({ message: "Failed to save to server", type: "error" });
    }
  };

  const handleClose = () => {
    if (dirty) {
      setConfirmClose(true);
    } else {
      closeAdmin();
    }
  };

  const handleConfirmClose = () => {
    const s = snapshotRef.current;
    discardChanges({ content: s.content, userProjects: s.userProjects });
    setDirty(false);
    setConfirmClose(false);
    closeAdmin();
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
      favicon: form.favicon.trim() || undefined,
    };
    addProject(project);
    markDirty();
    setForm({ title: "", description: "", tags: "", github: "", demo: "", favicon: "" });
  };

  const handleAddTimeline = () => {
    if (!timelineForm.role.trim() || !timelineForm.period.trim()) return;
    const updated = [...content.timeline.entries, timelineForm];
    updateContent("timeline.entries", updated);
    markDirty();
    setTimelineForm({ role: "", company: "", period: "", description: "" });
  };

  const handleRemoveTimeline = (index: number) => {
    const updated = content.timeline.entries.filter((_, i) => i !== index);
    updateContent("timeline.entries", updated);
    markDirty();
  };

  const handleReorderSkill = (ci: number, dir: -1 | 1) => {
    const updated = [...content.skills];
    const target = ci + dir;
    if (target < 0 || target >= updated.length) return;
    [updated[ci], updated[target]] = [updated[target], updated[ci]];
    updateContent("skills", updated);
    markDirty();
  };

  const handleResetSection = (path: string, defaultValue: unknown) => {
    updateContent(path, defaultValue);
    if (path === "about.paragraphs") {
      setAboutText((defaultValue as string[]).join("\n\n"));
    }
    markDirty();
    setToast({ message: "Section reset to default", type: "success" });
  };

  useEffect(() => {
    if (adminOpen) captureSnapshot();
  }, [adminOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!adminOpen) return;
      if (e.key === "Escape") {
        handleClose();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        handleSaveAndLock();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [adminOpen, dirty]);

  return (
    <>
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
                <div className={`w-2 h-2 rounded-full ${dirty ? "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)] animate-pulse" : "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"}`} />
                <span className="text-sm font-semibold text-white">Admin Panel</span>
                {dirty && <span className="text-[10px] text-amber-400 font-mono">unsaved</span>}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-zinc-600 font-mono hidden sm:block">⌘S</span>
                <button
                  onClick={handleSaveAndLock}
                  disabled={saving}
                  className="px-3 py-1.5 rounded-lg text-xs bg-zinc-800 text-zinc-400 hover:text-green-400 transition-colors disabled:opacity-50"
                >
                  {saving ? (
                    <span className="flex items-center gap-1">
                      <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Saving
                    </span>
                  ) : "Save & Lock"}
                </button>
                <button
                  onClick={handleClose}
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
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-zinc-500">Edit hero content</span>
                  <button
                    onClick={() => handleResetSection("hero", { line1: "Building Digital", line2: "Experiences", subtitle: "Software & Web Developer crafting modern, performant applications with cutting-edge technologies." })}
                    className="text-[10px] text-zinc-600 hover:text-blue-400 transition-colors"
                  >
                    Reset
                  </button>
                </div>
                <div>
                  <label className="text-xs text-zinc-500 mb-1 block">Line 1</label>
                  <input
                    value={content.hero.line1}
                    onChange={(e) => { updateContent("hero.line1", e.target.value); markDirty(); }}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-white outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-500 mb-1 block">Line 2</label>
                  <input
                    value={content.hero.line2}
                    onChange={(e) => { updateContent("hero.line2", e.target.value); markDirty(); }}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-white outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-500 mb-1 block">Subtitle</label>
                  <textarea
                    value={content.hero.subtitle}
                    onChange={(e) => { updateContent("hero.subtitle", e.target.value); markDirty(); }}
                    rows={3}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-white outline-none focus:border-blue-500 transition-colors resize-none"
                  />
                </div>
              </Section>

              <Section title="About">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-zinc-500">Edit about content</span>
                  <button
                    onClick={() => {
                      const defaults = ["I'm Jiro Luis Fandiño Manalo — also known as Semadotdev — a software and web developer passionate about building intelligent, performant applications. From AI-powered chat interfaces to full-stack platforms, I bring ideas to life through clean code and thoughtful design.", "Based in Alaminos, Laguna, I specialize in full-stack development, constantly exploring new technologies and crafting digital experiences that make a difference."];
                      handleResetSection("about.paragraphs", defaults);
                    }}
                    className="text-[10px] text-zinc-600 hover:text-blue-400 transition-colors"
                  >
                    Reset
                  </button>
                </div>
                <div>
                  <label className="text-xs text-zinc-500 mb-1 block">Heading</label>
                  <input
                    value={content.about.heading}
                    onChange={(e) => { updateContent("about.heading", e.target.value); markDirty(); }}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-white outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-500 mb-1 block">Bio (blank line = paragraph break)</label>
                  <textarea
                    value={aboutText}
                    onChange={(e) => { setAboutText(e.target.value); markDirty(); }}
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
                      <div className="flex items-center gap-1">
                        <input
                          value={cat.title}
                          onChange={(e) => {
                            const updated = [...content.skills];
                            updated[ci] = { ...updated[ci], title: e.target.value };
                            updateContent("skills", updated);
                            markDirty();
                          }}
                          className="flex-1 rounded border border-zinc-700 bg-zinc-800/50 px-2 py-1 text-xs text-white outline-none focus:border-blue-500 transition-colors"
                        />
                        <button
                          onClick={() => handleReorderSkill(ci, -1)}
                          disabled={ci === 0}
                          className="p-1 text-zinc-600 hover:text-white disabled:opacity-20 transition-colors"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 15l-6-6-6 6"/></svg>
                        </button>
                        <button
                          onClick={() => handleReorderSkill(ci, 1)}
                          disabled={ci === content.skills.length - 1}
                          className="p-1 text-zinc-600 hover:text-white disabled:opacity-20 transition-colors"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
                        </button>
                      </div>
                      <textarea
                        value={cat.skills.join("\n")}
                        onChange={(e) => {
                          const updated = [...content.skills];
                          updated[ci] = { ...updated[ci], skills: e.target.value.split("\n").filter(Boolean) };
                          updateContent("skills", updated);
                          markDirty();
                        }}
                        rows={3}
                        placeholder="One skill per line"
                        className="w-full rounded border border-zinc-700 bg-zinc-800/50 px-2 py-1 text-xs text-white placeholder-zinc-500 outline-none focus:border-blue-500 transition-colors resize-none"
                      />
                    </div>
                  ))}
                </div>
              </Section>

              <Section title="Timeline" defaultOpen={false}>
                <div className="space-y-3">
                  {content.timeline.entries.map((entry, i) => (
                    <div key={i} className="rounded-lg border border-zinc-800 bg-zinc-800/20 p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-zinc-300 truncate">{entry.role || "Untitled"}</span>
                        <button
                          onClick={() => handleRemoveTimeline(i)}
                          className="text-xs text-zinc-500 hover:text-red-400 transition-colors shrink-0 ml-2"
                        >
                          Remove
                        </button>
                      </div>
                      <input
                        value={entry.role}
                        onChange={(e) => {
                          const updated = [...content.timeline.entries];
                          updated[i] = { ...updated[i], role: e.target.value };
                          updateContent("timeline.entries", updated);
                          markDirty();
                        }}
                        placeholder="Role / Degree"
                        className="w-full rounded border border-zinc-700 bg-zinc-800/50 px-2 py-1 text-xs text-white placeholder-zinc-500 outline-none focus:border-blue-500 transition-colors"
                      />
                      <input
                        value={entry.company}
                        onChange={(e) => {
                          const updated = [...content.timeline.entries];
                          updated[i] = { ...updated[i], company: e.target.value };
                          updateContent("timeline.entries", updated);
                          markDirty();
                        }}
                        placeholder="School / Company"
                        className="w-full rounded border border-zinc-700 bg-zinc-800/50 px-2 py-1 text-xs text-white placeholder-zinc-500 outline-none focus:border-blue-500 transition-colors"
                      />
                      <input
                        value={entry.period}
                        onChange={(e) => {
                          const updated = [...content.timeline.entries];
                          updated[i] = { ...updated[i], period: e.target.value };
                          updateContent("timeline.entries", updated);
                          markDirty();
                        }}
                        placeholder="Period (e.g. 2022 - Present)"
                        className="w-full rounded border border-zinc-700 bg-zinc-800/50 px-2 py-1 text-xs text-white placeholder-zinc-500 outline-none focus:border-blue-500 transition-colors"
                      />
                      <textarea
                        value={entry.description}
                        onChange={(e) => {
                          const updated = [...content.timeline.entries];
                          updated[i] = { ...updated[i], description: e.target.value };
                          updateContent("timeline.entries", updated);
                          markDirty();
                        }}
                        rows={2}
                        placeholder="Description"
                        className="w-full rounded border border-zinc-700 bg-zinc-800/50 px-2 py-1 text-xs text-white placeholder-zinc-500 outline-none focus:border-blue-500 transition-colors resize-none"
                      />
                    </div>
                  ))}
                  <div className="border-t border-zinc-800 pt-3 space-y-2">
                    <p className="text-xs font-semibold text-zinc-400">Add Entry</p>
                    <input
                      value={timelineForm.role}
                      onChange={(e) => setTimelineForm({ ...timelineForm, role: e.target.value })}
                      placeholder="Role / Degree"
                      className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-blue-500 transition-colors"
                    />
                    <input
                      value={timelineForm.company}
                      onChange={(e) => setTimelineForm({ ...timelineForm, company: e.target.value })}
                      placeholder="School / Company"
                      className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-blue-500 transition-colors"
                    />
                    <input
                      value={timelineForm.period}
                      onChange={(e) => setTimelineForm({ ...timelineForm, period: e.target.value })}
                      placeholder="Period (e.g. 2022 - Present)"
                      className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-blue-500 transition-colors"
                    />
                    <textarea
                      value={timelineForm.description}
                      onChange={(e) => setTimelineForm({ ...timelineForm, description: e.target.value })}
                      rows={2}
                      placeholder="Description"
                      className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-blue-500 transition-colors resize-none"
                    />
                    <button
                      onClick={handleAddTimeline}
                      disabled={!timelineForm.role.trim() || !timelineForm.period.trim()}
                      className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 py-2 text-sm font-medium text-white hover:shadow-lg hover:shadow-blue-500/25 transition-shadow disabled:opacity-40"
                    >
                      Add Entry
                    </button>
                  </div>
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
                        onClick={() => { removeProject(p.id); markDirty(); }}
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
                      value={form.favicon}
                      onChange={(e) => setForm({ ...form, favicon: e.target.value })}
                      placeholder="Favicon URL (optional)"
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
                onClick={handleSaveAndLock}
                disabled={saving}
                className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 py-3 text-sm font-medium text-white hover:shadow-lg hover:shadow-blue-500/25 transition-shadow disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Saving...
                  </>
                ) : "Save & Lock"}
              </button>
              <p className="text-[10px] text-zinc-600 text-center mt-2">⌘S to save · Esc to close</p>
            </div>
          </motion.div>

        </>
      )}
    </AnimatePresence>
      <Toast
        message={toast?.message ?? ""}
        type={toast?.type ?? "success"}
        visible={toast !== null}
        onClose={() => setToast(null)}
      />
      <ConfirmModal
        open={confirmClose}
        title="Unsaved Changes"
        message="You have unsaved changes that will be lost if you close. Are you sure you want to close?"
        confirmLabel="Close Anyway"
        cancelLabel="Cancel"
        confirmDanger
        onConfirm={handleConfirmClose}
        onCancel={() => setConfirmClose(false)}
      />
    </>
  );
}
