import { redirect } from "next/navigation";

interface AdminPrintQRPageProps {
  params: Promise<{ slug: string }>;
}

export default async function AdminPrintQRPage({ params }: AdminPrintQRPageProps) {
  const { slug } = await params;
  redirect(`/dashboard/${slug}/print-qr`);
}
