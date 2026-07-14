import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useStore } from "@/lib/store";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/explore", label: "Explore Needs" },
  { to: "/institutions", label: "Institutions" },
  { to: "/impact", label: "Our Impact" },
  { to: "/volunteer", label: "Volunteer" },
  { to: "/stories", label: "Stories" },
  { to: "/about", label: "About" },
] as const;

function BrandMark() {
  return (
    <Link to="/" className="flex shrink-0 items-center gap-2.5">
      <span className="grid size-9 place-items-center rounded-lg bg-[color:var(--brand-ink)] text-[color:var(--brand-mint)]">
        <span className="block size-4 rotate-45 border-2 border-current" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-2xl tracking-tight text-foreground">CareBridge</span>
        <span className="hidden text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground sm:block">
          Care · Community
        </span>
      </span>
    </Link>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const session = useStore((s) => s.session);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <BrandMark />

        <nav className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {session ? (
            <>
              <Link
                to="/profile"
                className="rounded-full px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted"
              >
                Profile
              </Link>
              <Link
                to="/app"
                className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft transition hover:brightness-110"
              >
                Open app
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-full border border-transparent px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft transition hover:brightness-110"
              >
                Register
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="grid size-10 place-items-center rounded-full border border-border lg:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3 sm:px-6">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                activeProps={{ className: "bg-muted text-foreground" }}
                activeOptions={{ exact: item.to === "/" }}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="rounded-full border border-border px-3 py-2 text-center text-sm font-semibold"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setOpen(false)}
                className="rounded-full bg-primary px-3 py-2 text-center text-sm font-semibold text-primary-foreground"
              >
                Register
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
