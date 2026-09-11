import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-auth";
import { getAdminSupabaseClient } from "@/lib/admin-supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PROOF_BUCKET = "payout-proofs";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
  "application/pdf",
]);

export async function POST(request: Request) {
  const auth = await requireAdminSession();
  if (!auth.authorized) return auth.response;

  try {
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { success: false, error: "Requisição inválida: envie multipart/form-data." },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const fileEntry = formData.get("file");
    if (!fileEntry || !(fileEntry instanceof File)) {
      return NextResponse.json(
        { success: false, error: "Campo 'file' ausente ou inválido." },
        { status: 400 }
      );
    }

    const file = fileEntry;
    if (!file.name || file.name.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Arquivo sem nome." },
        { status: 400 }
      );
    }

    const mimeType = (file.type || "").toLowerCase();
    if (!ALLOWED_MIME_TYPES.has(mimeType)) {
      return NextResponse.json(
        {
          success: false,
          error: "Formato de arquivo não permitido. Envie imagem (JPEG, PNG, WEBP) ou PDF.",
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: `Arquivo muito grande. Tamanho máximo permitido: 5 MB. Recebido: ${(file.size / 1024 / 1024).toFixed(2)} MB.`,
        },
        { status: 413 }
      );
    }

    if (file.size === 0) {
      return NextResponse.json(
        { success: false, error: "Arquivo vazio." },
        { status: 400 }
      );
    }

    const safeOriginalName = file.name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9._-]/g, "_");

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const adminLogin = typeof auth.session?.login === "string"
      ? auth.session.login
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-zA-Z0-9._-]/g, "_")
      : "admin";
    const randomSuffix = Math.random().toString(36).slice(2, 10);
    const storagePath = `${adminLogin}/${timestamp}_${randomSuffix}_${safeOriginalName}`;

    const adminSupabase = getAdminSupabaseClient();
    const proofUploadedAt = new Date();
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    const { data: uploadData, error: uploadError } = await adminSupabase
      .storage
      .from(PROOF_BUCKET)
      .upload(storagePath, fileBuffer, {
        contentType: mimeType,
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError || !uploadData) {
      const bucketDoesNotExist = (uploadError as unknown as { message?: string })?.message?.toLowerCase?.()?.includes("bucket") || false;
      const hint = bucketDoesNotExist
        ? " Bucket 'payout-proofs' não existe no Supabase Storage. Crie o bucket antes de enviar arquivos."
        : "";
      return NextResponse.json(
        {
          success: false,
          error: `Falha no armazenamento do comprovante: ${(uploadError as unknown as { message?: string })?.message || "erro desconhecido"}.${hint}`,
        },
        { status: 500 }
      );
    }

    const { data: urlData } = await adminSupabase
      .storage
      .from(PROOF_BUCKET)
      .createSignedUrl(uploadData.path, 365 * 24 * 60 * 60); // 1 ano

    const proofUrl = urlData?.signedUrl || "";
    if (!proofUrl) {
      return NextResponse.json(
        { success: false, error: "Falha ao gerar URL do comprovante." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      proof_url: proofUrl,
      proof_filename: file.name,
      proof_uploaded_at: proofUploadedAt.toISOString(),
      storage_path: uploadData.path,
      mime_type: mimeType,
      size_bytes: file.size,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "erro interno";
    return NextResponse.json(
      { success: false, error: `Erro interno: ${msg}` },
      { status: 500 }
    );
  }
}
