import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Search, X, Loader2 } from "lucide-react";
import { globalSearch, type SearchHit } from "@/lib/queries";

const RECENT_KEY = "carebridge:recent-searches";

function readRecent(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
  } catch {
    return [];
  }
}

function pushRecent(q: string) {
  if (typeof window === "undefined") return;
  const cur = readRecent().filter((x) => x !== q);
  const next = [q, ...cur].slice(0, 5);
  localStorage.setItem(RECENT_KEY, JSON.stringify(next));
}

export function GlobalSearch({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [busy, setBusy] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      setRecent(readRecent());
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQ("");
      setHits([]);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    if (q.trim().length < 2) {
      setHits([]);
      return;
    }
    let cancelled = false;
    setBusy(true);
    const t = setTimeout(async () => {
      try {
        const out = await globalSearch(q);
        if (!cancelled) setHits(out);
      } finally {
        if (!cancelled) setBusy(false);
      }
    }, 200);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [q, open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && open) onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  function go(href: string) {
    if (q.trim()) pushRecent(q.trim());
    onClose();
    navigate({ to: href });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 pt-[10vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Search"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-card shadow-lift"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-border px-4">
          <Search className="size-4 text-muted-foreground" aria-hidden />
          <input
            ref={inputRef}
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search needs, institutions, events…"
            className="flex-1 bg-transparent py-3 text-sm outline-none"
            aria-label="Search"
          />
          {busy && <Loader2 className="size-4 animate-spin text-muted-foreground" />}
          <button onClick={onClose} aria-label="Close search" className="grid size-7 place-items-center rounded hover:bg-muted">
            <X className="size-4" />
          </button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto">
          {q.trim().length < 2 && recent.length > 0 && (
            <div className="p-2">
              <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Recent</p>
              {recent.map((r) => (
                <button key={r} onClick={() => setQ(r)} className="flex w-full items-center gap-2 rounded px-3 py-2 text-left text-sm hover:bg-muted">
                  <Search className="size-3.5 text-muted-foreground" />
                  {r}
                </button>
              ))}
            </div>
          )}
          {q.trim().length >= 2 && hits.length === 0 && !busy && (
            <p className="p-6 text-center text-sm text-muted-foreground">No results for "{q}".</p>
          )}
          {hits.length > 0 && (
            <ul className="divide-y divide-border">
              {hits.map((h) => (
                <li key={`${h.kind}-${h.id}`}>
                  <Link
                    to={h.href}
                    onClick={() => go(h.href)}
                    className="flex flex-col gap-0.5 px-4 py-3 hover:bg-muted"
                  >
                    <span className="text-sm font-semibold">{h.title}</span>
                    <span className="text-xs text-muted-foreground">{h.subtitle}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <div className="border-t border-border bg-surface px-4 py-2 text-[10px] text-muted-foreground">
            <kbd className="rounded border border-border bg-background px-1.5 py-0.5 font-mono">Esc</kbd> to close
          </div>
        </div>
      </div>
    </div>
  );
}
