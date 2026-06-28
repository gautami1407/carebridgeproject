// Uploads to private Supabase storage and returns a signed URL.
import { useRef, useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Bucket = "institution-docs" | "public-media";

export function FileUpload({
  bucket,
  prefix = "",
  accept = "image/*",
  maxSizeMB = 10,
  onUploaded,
  label = "Upload file",
}: {
  bucket: Bucket;
  prefix?: string;
  accept?: string;
  maxSizeMB?: number;
  onUploaded: (out: { path: string; url: string }) => void;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    const file = files[0];
    setErr(null);
    if (file.size > maxSizeMB * 1024 * 1024) {
      setErr(`File too large (max ${maxSizeMB}MB).`);
      return;
    }
    setBusy(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Sign in to upload.");
      const ext = file.name.split(".").pop() ?? "bin";
      const path = `${user.id}/${prefix ? prefix + "/" : ""}${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from(bucket).upload(path, file, { upsert: false, contentType: file.type });
      if (upErr) throw upErr;
      const { data: signed, error: signErr } = await supabase.storage.from(bucket).createSignedUrl(path, 60 * 60 * 24 * 7);
      if (signErr) throw signErr;
      setPreview(signed.signedUrl);
      onUploaded({ path, url: signed.signedUrl });
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        className="flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-border bg-card px-4 py-6 text-sm font-semibold text-muted-foreground hover:bg-muted disabled:opacity-50"
      >
        {busy ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
        {busy ? "Uploading…" : label}
      </button>
      <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={(e) => handleFiles(e.target.files)} />
      {preview && (
        <div className="relative mt-3 inline-block">
          {accept.startsWith("image") ? (
            <img src={preview} alt="Preview" className="h-24 w-24 rounded-md object-cover" />
          ) : (
            <a href={preview} target="_blank" rel="noreferrer" className="text-xs text-primary underline">View uploaded file</a>
          )}
          <button
            type="button"
            onClick={() => setPreview(null)}
            className="absolute -right-2 -top-2 grid size-5 place-items-center rounded-full bg-background border border-border"
            aria-label="Remove preview"
          >
            <X className="size-3" />
          </button>
        </div>
      )}
      {err && <p className="mt-2 text-xs text-urgent">{err}</p>}
    </div>
  );
}
