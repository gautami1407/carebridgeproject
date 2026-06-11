import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-1">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
              <Heart className="size-4" strokeWidth={2.5} />
            </span>
            <span className="text-base font-bold tracking-tight">CareBridge</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Connecting verified care institutions with donors, volunteers, and mentors who make
            real impact.
          </p>
        </div>

        <div>
          <h5 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Platform
          </h5>
          <ul className="mt-5 space-y-3 text-sm">
            <li><Link to="/explore" className="text-foreground/80 hover:text-primary">Explore Needs</Link></li>
            <li><Link to="/institutions" className="text-foreground/80 hover:text-primary">Institutions</Link></li>
            <li><Link to="/volunteer" className="text-foreground/80 hover:text-primary">Volunteer</Link></li>
            <li><Link to="/stories" className="text-foreground/80 hover:text-primary">Success Stories</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Organization
          </h5>
          <ul className="mt-5 space-y-3 text-sm">
            <li><Link to="/about" className="text-foreground/80 hover:text-primary">About</Link></li>
            <li><Link to="/contact" className="text-foreground/80 hover:text-primary">Contact</Link></li>
            <li><a href="#" className="text-foreground/80 hover:text-primary">Verification</a></li>
            <li><a href="#" className="text-foreground/80 hover:text-primary">Press</a></li>
          </ul>
        </div>

        <div>
          <h5 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Get updates
          </h5>
          <p className="mt-5 text-sm text-muted-foreground">Monthly impact reports. No spam.</p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="mt-3 flex gap-2"
          >
            <input
              type="email"
              required
              placeholder="you@email.com"
              className="min-w-0 flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
            <button
              type="submit"
              className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:brightness-110"
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
