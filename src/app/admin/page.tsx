import { AdminDashboard } from "@/components/admin/admin-dashboard";

export default function AdminPage() {
  const hasSupabase = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  return <AdminDashboard hasSupabase={hasSupabase} />;
}
