import { FormEvent, useState } from "react";

const API_URL = import.meta.env.VITE_NUERAFLOW_API_URL ?? "http://127.0.0.1:8000";

type Message = { role: "user" | "assistant"; content: string };

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "I’m Nueraflow. Ask me to explain a concept, plan a project, or help debug code." },
  ]);
  const [prompt, setPrompt] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function sendMessage(event: FormEvent) {
    event.preventDefault();
    const message = prompt.trim();
    if (!message || busy) return;
    setMessages((items) => [...items, { role: "user", content: message }]);
    setPrompt("");
    setError("");
    setBusy(true);
    try {
      const response = await fetch(`${API_URL}/api/v1/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      if (!response.ok) throw new Error(`Backend returned HTTP ${response.status}`);
      const data: { response: string } = await response.json();
      setMessages((items) => [...items, { role: "assistant", content: data.response }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not reach Nueraflow backend.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">N</span><span>nueraflow</span></div>
        <button className="new-chat" onClick={() => setMessages([{ role: "assistant", content: "New session. What are we building?" }])}>＋ New session</button>
        <div className="nav-label">WORKSPACE</div>
        <div className="nav-item active">◈ &nbsp; AI Workspace</div>
        <div className="nav-item">⌕ &nbsp; Research library</div>
        <div className="nav-item">⌘ &nbsp; Coding projects</div>
        <div className="nav-item">◉ &nbsp; Neuromorphic lab</div>
        <div className="sidebar-footer"><span className="status-dot" /> Local-first foundation</div>
      </aside>
      <section className="workspace">
        <header className="topbar"><div><span className="eyebrow">NUERAQON TECHNOLOGIES</span><h1>AI Workspace</h1></div><span className="model-pill">◉ &nbsp; Ollama · local model</span></header>
        <div className="content">
          <div className="welcome"><div className="orb">N</div><h2>Build something meaningful.</h2><p>Your development partner for research, software and emerging computing.</p></div>
          <div className="chat" aria-live="polite">
            {messages.map((item, index) => <article className={`message ${item.role}`} key={index}><span className="avatar">{item.role === "user" ? "Y" : "N"}</span><div><strong>{item.role === "user" ? "You" : "Nueraflow"}</strong><p>{item.content}</p></div></article>)}
            {busy && <div className="typing">Nueraflow is thinking…</div>}
            {error && <div className="error">{error} — check that the AI core and backend are running.</div>}
          </div>
          <form className="composer" onSubmit={sendMessage}><textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="Ask Nueraflow to research, design, explain or code…" rows={3} /><div className="composer-bottom"><span>AI output can be wrong. Review code before using it.</span><button disabled={busy || !prompt.trim()}>{busy ? "Working…" : "Send ↑"}</button></div></form>
        </div>
      </section>
    </main>
  );
}
