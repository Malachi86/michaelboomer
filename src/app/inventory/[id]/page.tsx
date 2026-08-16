import { redirect } from 'next/navigation';

/**
 * This page is kept to prevent build errors with Next.js dynamic routes 
 * when using output: export. It redirects to the search-param version.
 */
export async function generateStaticParams() {
  // We return a placeholder to satisfy the requirement for output: export
  return [{ id: 'unit' }];
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  // We don't use params.id directly in the server component for export 
  // to avoid issues. The client-side inventory page handles the actual ID.
  redirect('/inventory/');
}
