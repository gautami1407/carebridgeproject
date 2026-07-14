import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-1">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-lg bg-[color:var(--brand-ink)] text-[color:var(--brand-mint)]">
              <span className="block size-4 rotate-45 border-2 border-current" />
            </span>
            <span className="font-display text-2xl tracking-tight">CareBridge</span>
          </Link>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Connecting verified care institutions with donors, volunteers, and mentors who
            make real, measurable impact.
          </p>
        </div>

        <div>
          <h5 className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
            Platform
          </h5>
          <ul className="mt-5 space-y-3 text-sm">
            <li><Link to="/explore" className="text-foreground/80 hover:text-[color:var(--brand-teal)]">Explore Needs</Link></li>
            <li><Link to="/institutions" className="text-foreground/80 hover:text-[color:var(--brand-teal)]">Institutions</Link></li>
            <li><Link to="/volunteer" className="text-foreground/80 hover:text-[color:var(--brand-teal)]">Volunteer</Link></li>
            <li><Link to="/stories" className="text-foreground/80 hover:text-[color:var(--brand-teal)]">Success Stories</Link></li>
            <li><Link to="/impact" className="text-foreground/80 hover:text-[color:var(--brand-teal)]">Our Impact</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
            Organization
          </h5>
          <ul className="mt-5 space-y-3 text-sm">
            <li><Link to="/about" className="text-foreground/80 hover:text-[color:var(--brand-teal)]">About</Link></li>
            <li><Link to="/contact" className="text-foreground/80 hover:text-[color:var(--brand-teal)]">Contact</Link></li>
            <li><Link to="/csr" className="text-foreground/80 hover:text-[color:var(--brand-teal)]">CSR Partnerships</Link></li>
            <li><a href="#" className="text-foreground/80 hover:text-[color:var(--brand-teal)]">Verification</a></li>
          </ul>
        </div>

        <div>
          <h5 className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
            Monthly impact letter
          </h5>
          <p className="mt-5 text-sm text-muted-foreground">
            One email a month with real stories and transparent numbers. No spam.
          </p>
          <form onSubmit={(e) => e.preventDefault()} className="mt-3 flex gap-2">
            <input
              type="email"
              required
              placeholder="you@email.com"
              className="min-w-0 flex-1 rounded-full border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-[color:var(--brand-teal)]"
            />
            <button
              type="submit"
              className="rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:brightness-110"
            >
              Join
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:px-6">
          <p>© {new Date().getFullYear()} CareBridge. Built with care for communities.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="#" className="hover:text-foreground">Terms</a>
            <a href="#" className="hover:text-foreground">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
