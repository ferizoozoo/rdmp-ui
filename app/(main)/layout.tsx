import PrivateRoute from "@/components/privateRoute";
import Sidebar from "@/components/sidebar";

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
  return (
    <PrivateRoute>
      <Sidebar />
      <main className="min-h-screen bg-neutral-950 text-neutral-100 lg:ml-12">
        {children}
      </main>
    </PrivateRoute>
  )
}
