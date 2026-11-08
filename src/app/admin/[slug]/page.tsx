import { redirect } from "next/navigation";

interface AdminStorePageProps {
  params: Promise<{ slug: string }>;
}

export default async function AdminStorePage({ params }: AdminStorePageProps) {
  const { slug } = await params;
  redirect(`/dashboard/${slug}`);
}
