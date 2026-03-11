'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Router, Wifi, RotateCcw,
  Network, Bell, Settings, Zap, Activity
} from 'lucide-react'
import { useEffect, useState } from 'react'

const NAV = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/devices',   icon: Router,          label: 'Thiết Bị' },
  { href: '/wifi',      icon: Wifi,            label: 'Cấu Hình WiFi' },
  { href: '/reboot',    icon: RotateCcw,       label: 'Khởi Động Lại' },
  { href: '/ip',        icon: Network,         label: 'Quản Lý IP' },
  { href: '/alerts',    icon: Bell,            label: 'Cảnh Báo' },
  { href: '/settings',  icon: Settings,        label: 'Cài Đặt' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [tick, setTick] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setTick(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <aside style={{
      position: 'fixed', left: 0, top: 0, bottom: 0, width: 224,
      background: 'var(--bg1)',
      borderRight: '1px solid var(--border0)',
      display: 'flex', flexDirection: 'column',
      zIndex: 50,
    }}>
      {/* Logo */}
      <div style={{ padding: '20px 16px', borderBottom: '1px solid var(--border0)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="glow-pulse-anim" style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, var(--cyan), var(--blue))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Zap size={18} color="#05080f" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--text0)', letterSpacing: '-.01em' }}>WiFi Manager</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--cyan)', opacity: .7 }}>v2.0 · NOC</div>
          </div>
        </div>
      </div>

      {/* System status */}
      <div style={{ margin: '12px 12px 4px', padding: '8px 12px', borderRadius: 8, background: 'rgba(0,255,136,.04)', border: '1px solid rgba(0,255,136,.12)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span className="dot-pulse" style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', display: 'inline-block', flexShrink: 0 }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--green)' }}>HỆ THỐNG HOẠT ĐỘNG</span>
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text2)', marginTop: 3 }}>
          {tick.toLocaleTimeString('vi-VN')}
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '8px 12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link key={href} href={href} className={`nav-link ${active ? 'active' : ''}`}>
              <Icon size={15} style={{ flexShrink: 0 }} />
              <span style={{ flex: 1 }}>{label}</span>
              {active && (
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--cyan)', opacity: .6 }}>●</span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border0)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8,
            background: 'var(--bg4)', border: '1px solid var(--border1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: 13, color: 'var(--cyan)',
          }}>A</div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text0)' }}>Admin</div>
            <div style={{ fontSize: 10, color: 'var(--text2)', fontFamily: 'var(--font-mono)' }}>Quản Trị Viên</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
