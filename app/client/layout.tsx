import { DashboardSidebar } from "@/components/dashboard-sidebar"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex bg-background">
      <DashboardSidebar role="client" userName="Sophie Leroy" />
      <div className="flex-1 flex flex-col min-w-0 lg:ml-0">
        {children}
      </div>
    </div>
  )
}
