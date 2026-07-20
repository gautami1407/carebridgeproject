/// <reference types="google.maps" />
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useInstitutions, useNeeds } from "@/lib/queries";
import { LoadingState, EmptyState } from "@/components/app/states";
import { ensureInstitutionCoords } from "@/lib/geocode.functions";
import { MapPin, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Discovery Map — CareBridge" },
      {
        name: "description",
        content:
          "Explore verified orphanages and old-age homes on a live map. See where support is needed near you.",
      },
      { property: "og:title", content: "Discovery Map — CareBridge" },
      {
        property: "og:description",
        content: "See verified institutions and their active needs on an interactive map.",
      },
    ],
  }),
  component: MapPage,
});

type Loc = {
  id: string;
  name: string;
  slug: string;
  type: string;
  verification: string;
  city: string | null;
  state: string | null;
  latitude: number | null;
  longitude: number | null;
  activeNeeds: number;
};

declare global {
  interface Window {
    __cbInitMap?: () => void;
    google?: typeof google;
  }
}

function MapPage() {
  const { data: institutions = [], isLoading } = useInstitutions();
  const { data: needs = [] } = useNeeds({ onlyActive: true });
  const geocode = useServerFn(ensureInstitutionCoords);

  const [locs, setLocs] = useState<Loc[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapObj = useRef<google.maps.Map | null>(null);
  const markers = useRef<Map<string, google.maps.Marker>>(new Map());
  const info = useRef<google.maps.InfoWindow | null>(null);

  // Build locations + trigger geocoding for missing coords
  useEffect(() => {
    if (!institutions.length) return;
    const activeByInst = new Map<string, number>();
    for (const n of needs) activeByInst.set(n.institution_id, (activeByInst.get(n.institution_id) ?? 0) + 1);

    const base: Loc[] = institutions.map((i) => ({
      id: i.id,
      name: i.name,
      slug: i.slug,
      type: i.type,
      verification: i.verification,
      city: i.city,
      state: i.state,
      latitude: i.latitude,
      longitude: i.longitude,
      activeNeeds: activeByInst.get(i.id) ?? 0,
    }));
    setLocs(base);

    // Geocode any missing (sequentially, to be nice to the gateway)
    let cancelled = false;
    (async () => {
      for (const inst of base) {
        if (cancelled) return;
        if (inst.latitude != null && inst.longitude != null) continue;
        try {
          const res = await geocode({ data: { institutionId: inst.id } });
          if (cancelled) return;
          if (res.latitude != null && res.longitude != null) {
            setLocs((prev) =>
              prev.map((l) =>
                l.id === inst.id ? { ...l, latitude: res.latitude, longitude: res.longitude } : l,
              ),
            );
          }
        } catch {
          /* ignore per-row geocoding failures */
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [institutions, needs, geocode]);

  // Load Google Maps JS once
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.google?.maps) {
      setMapReady(true);
      return;
    }
    const key = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY;
    const channel = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_TRACKING_ID;
    if (!key) return;
    window.__cbInitMap = () => setMapReady(true);
    const s = document.createElement("script");
    s.src = `https://maps.googleapis.com/maps/api/js?key=${key}&loading=async&callback=__cbInitMap${channel ? `&channel=${channel}` : ""}`;
    s.async = true;
    s.defer = true;
    document.head.appendChild(s);
  }, []);

  // Instantiate map
  useEffect(() => {
    if (!mapReady || !mapRef.current || mapObj.current) return;
    mapObj.current = new window.google!.maps.Map(mapRef.current, {
      center: { lat: 22.5937, lng: 78.9629 }, // India centroid
      zoom: 5,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    });
    info.current = new window.google!.maps.InfoWindow();
  }, [mapReady]);

  // Sync markers with locs
  useEffect(() => {
    if (!mapReady || !mapObj.current) return;
    const g = window.google!;
    const bounds = new g.maps.LatLngBounds();
    let any = false;
    for (const loc of locs) {
      if (loc.latitude == null || loc.longitude == null) continue;
      any = true;
      const pos = { lat: loc.latitude, lng: loc.longitude };
      bounds.extend(pos);
      let marker = markers.current.get(loc.id);
      if (!marker) {
        marker = new g.maps.Marker({
          position: pos,
          map: mapObj.current!,
          title: loc.name,
        });
        marker.addListener("click", () => {
          setSelected(loc.id);
          info.current?.setContent(infoHtml(loc));
          info.current?.open({ anchor: marker!, map: mapObj.current! });
        });
        markers.current.set(loc.id, marker);
      } else {
        marker.setPosition(pos);
      }
    }
    // remove stale
    for (const [id, m] of markers.current) {
      if (!locs.find((l) => l.id === id && l.latitude != null)) {
        m.setMap(null);
        markers.current.delete(id);
      }
    }
    if (any && !selected) mapObj.current.fitBounds(bounds, 60);
  }, [locs, mapReady, selected]);

  const plotted = locs.filter((l) => l.latitude != null && l.longitude != null);
  const pending = locs.length - plotted.length;

  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary">Discovery map</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Verified institutions near you
            </h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Every dot on the map is a real, verified institution on CareBridge. Click any marker to see
              their active needs and open their profile.
            </p>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            <p><span className="font-bold text-foreground">{plotted.length}</span> on map</p>
            {pending > 0 && <p className="text-xs">Locating {pending} more…</p>}
          </div>
        </div>

        {isLoading ? (
          <div className="mt-8"><LoadingState /></div>
        ) : institutions.length === 0 ? (
          <div className="mt-8"><EmptyState title="No institutions yet" body="Verified institutions will appear here as they join CareBridge." /></div>
        ) : (
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
            <div
              ref={mapRef}
              className="h-[70vh] min-h-[480px] w-full overflow-hidden rounded-2xl border border-border bg-surface shadow-soft"
              aria-label="Interactive map of verified institutions"
            >
              {!mapReady && (
                <div className="grid size-full place-items-center text-sm text-muted-foreground">
                  Loading map…
                </div>
              )}
            </div>

            <aside className="max-h-[70vh] space-y-2 overflow-y-auto rounded-2xl border border-border bg-card p-3">
              <p className="px-2 pb-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {plotted.length} institutions
              </p>
              {plotted.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => {
                    setSelected(l.id);
                    if (mapObj.current && l.latitude != null && l.longitude != null) {
                      mapObj.current.panTo({ lat: l.latitude, lng: l.longitude });
                      mapObj.current.setZoom(12);
                      const marker = markers.current.get(l.id);
                      if (marker && info.current) {
                        info.current.setContent(infoHtml(l));
                        info.current.open({ anchor: marker, map: mapObj.current });
                      }
                    }
                  }}
                  className={`w-full rounded-xl border p-3 text-left transition-colors ${selected === l.id ? "border-primary bg-primary/5" : "border-border hover:bg-muted"}`}
                >
                  <p className="flex items-center gap-1.5 text-sm font-semibold">
                    {l.name}
                    {l.verification === "verified" && (
                      <ShieldCheck className="size-3.5 text-support" aria-label="Verified" />
                    )}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="size-3" />
                    {[l.city, l.state].filter(Boolean).join(", ") || "Location pending"}
                  </p>
                  <p className="mt-1 text-xs">
                    <span className="rounded bg-urgent/10 px-1.5 py-0.5 font-semibold text-urgent">
                      {l.activeNeeds} active need{l.activeNeeds === 1 ? "" : "s"}
                    </span>
                  </p>
                </button>
              ))}
              {plotted.length === 0 && (
                <p className="p-4 text-center text-sm text-muted-foreground">
                  Locating institutions on the map…
                </p>
              )}
            </aside>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link to="/institutions" className="text-sm font-semibold text-primary hover:underline">
            View full institution directory →
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}

function infoHtml(l: Loc) {
  const loc = [l.city, l.state].filter(Boolean).join(", ");
  return `<div style="font-family:inherit;min-width:180px">
    <p style="margin:0;font-weight:700;font-size:14px">${escapeHtml(l.name)}</p>
    <p style="margin:2px 0 0;font-size:12px;color:#64748b">${escapeHtml(loc)}</p>
    <p style="margin:6px 0 0;font-size:12px"><strong>${l.activeNeeds}</strong> active need${l.activeNeeds === 1 ? "" : "s"}</p>
    <a href="/institutions/${encodeURIComponent(l.slug)}" style="display:inline-block;margin-top:8px;font-size:12px;font-weight:600;color:#0B1F3A">View profile →</a>
  </div>`;
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}
