import Sidebar from '../../components/sidebar'

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Sidebar />
      <main className="min-h-screen p-6 pt-16 lg:ml-64">
        {children}
      </main>
    </>
  )
}
