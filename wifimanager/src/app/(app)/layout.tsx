import Sidebar from '@/components/Sidebar'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main className="grid-bg" style={{ flex: 1, marginLeft: 224, minHeight: '100vh' }}>
        {children}
      </main>
    </div>
  )
}
