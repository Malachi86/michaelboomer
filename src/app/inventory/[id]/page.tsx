import { redirect } from 'next/navigation';

export async function generateStaticParams() {
  return [];
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  // Redirecting to the query param version to support static export
  redirect(`/inventory/?id=${(params as any).id}`);
}
