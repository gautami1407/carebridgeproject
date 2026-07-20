import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_maps";

const inputSchema = z.object({ institutionId: z.string().uuid() });

/**
 * Geocode an institution by looking up its address via the Google Maps
 * gateway and caching the resulting coordinates on the row.
 *
 * Public on purpose — writes are gated to rows that are missing coordinates,
 * so repeat visitors can't cause extra billed lookups. First visitor to hit
 * a not-yet-geocoded institution populates the coordinates for everyone.
 */
export const ensureInstitutionCoords = createServerFn({ method: "POST" })
  .inputValidator((input) => inputSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: inst, error } = await supabaseAdmin
      .from("institutions")
      .select("id, name, address, city, state, country, latitude, longitude")
      .eq("id", data.institutionId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!inst) throw new Error("Institution not found");

    if (inst.latitude != null && inst.longitude != null) {
      return { latitude: inst.latitude, longitude: inst.longitude, cached: true };
    }

    const lovableKey = process.env.LOVABLE_API_KEY;
    const gmKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!lovableKey || !gmKey) throw new Error("Google Maps connector not configured");

    const addr = [inst.address, inst.city, inst.state, inst.country ?? "India"]
      .filter(Boolean)
      .join(", ");
    if (!addr) throw new Error("Institution has no address to geocode");

    const res = await fetch(
      `${GATEWAY_URL}/maps/api/geocode/json?address=${encodeURIComponent(addr)}`,
      {
        headers: {
          Authorization: `Bearer ${lovableKey}`,
          "X-Connection-Api-Key": gmKey,
        },
      },
    );
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Geocoding failed (${res.status}): ${body}`);
    }
    const json = (await res.json()) as {
      status: string;
      results: Array<{ geometry: { location: { lat: number; lng: number } } }>;
    };
    if (json.status !== "OK" || !json.results?.[0]) {
      return { latitude: null, longitude: null, cached: false, status: json.status };
    }
    const { lat, lng } = json.results[0].geometry.location;
    await supabaseAdmin
      .from("institutions")
      .update({ latitude: lat, longitude: lng, geocoded_at: new Date().toISOString() })
      .eq("id", inst.id);
    return { latitude: lat, longitude: lng, cached: false };
  });
