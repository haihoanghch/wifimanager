'use client'
import { useState } from 'react'
import { Bell, AlertTriangle, Info, CheckCircle, Trash2, Check, Shield, Wifi, Router } from 'lucide-react'

const INIT_ALERTS = [
  { id: '1', dev: 'Router Văn Phòng', type: 'offline',   msg: 'Thiết bị đã offline hơn 2 giờ. Kiểm tra kết nối nguồn điện và dây mạng WAN.', sev: 'critical', read: false, t: '10 phút trước' },
  { id: '5', dev: 'Router Phòng Khách', type: 'security', msg: 'Phát hiện 5 lần đăng nhập sai từ địa chỉ IP 192.168.1.99. Cân nhắc chặn IP này.', sev: 'critical', read: false, t: '30 phút trước' },
  { id: '2', dev: 'Repeater Sân Thượng', type: 'signal',  msg: 'Tín hiệu yếu -74 dBm. Cân nhắc điều chỉnh vị trí hoặc thêm thiết bị khuếch đại.', sev: 'warning', read: false, t: '1 giờ trước' },
  { id: '3', dev: 'AP Phòng Ngủ',       type: 'signal',   msg: 'Tín hiệu giảm xuống -61 dBm. Kiểm tra vật cản xung quanh thiết bị.', sev: 'warning', read: false, t: '2 giờ trước' },
  { id: '6', dev: 'Mesh Node Nhà Bếp',  type: 'clients',  msg: 'Số client tăng đột biến lên 18 thiết bị trong 10 phút. Kiểm tra băng thông.', sev: 'warning', read: true, t: '3 giờ trước' },
  { id: '4', dev: 'Router Phòng Khách', type: 'firmware', msg: 'Firmware mới v2.2.0 cho TP-Link AX3000. Cập nhật để vá lỗ hổng bảo mật CVE-2024-xxx.', sev: 'info', read: true, t: '6 giờ trước' },
]

const SEV_CFG = {
  critical: { color: 'var(--red)',   bg: 'rgba(255,69,96,.07)',  border: 'rgba(255,69,96,.2)',  icon: AlertTriangle, label: 'Nghiêm Trọng' },
  warning:  { color: 'var(--amber)', bg: 'rgba(255,184,0,.07)', border: 'rgba(255,184,0,.2)', icon: AlertTriangle, label: 'Cảnh Báo' },
  info:     { color: 'var(--blue)',  bg: 'rgba(77,159,255,.07)', border: 'rgba(77,159,255,.2)', icon: Info, label: 'Thông Tin' },
}

const TYPE_ICON: Record<string, any> = { offline: Router, signal: Wifi, security: Shield, firmware: Info, clients: Bell }

export default function AlertsPage() {
  const [alerts, setAlerts] = useState(INIT_ALERTS)
  const [filter, setFilter] = useState('all')

  const filtered = alerts.filter(a =>
    filter === 'all' || a.sev === filter || (filter === 'unread' && !a.read)
  )
  const unread = alerts.filter(a => !a.read).length

  return (
    <div style={{ padding: 28 }}>
      <div className="fade-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--cyan)', letterSpacing: '.12em', marginBottom: 6 }}>ALERT CENTER</div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text0)', letterSpacing: '-.02em', display: 'flex', alignItems: 'center', gap: 10 }}>
            Cảnh Báo
            {unread > 0 && (
              <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--red)', color: 'white', fontSize: 11, fontWeight: 800, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{unread}</span>
            )}
          </h1>
          <p style={{ fontSize: 12, color: 'var(--text2)', marginTop: 4 }}>{alerts.length} tổng · {unread} chưa đọc</p>
        </div>
        {unread > 0 && (
          <button onClick={() => setAlerts(a => a.map(x => ({ ...x, read: true })))} className="btn btn-ghost fade-up" style={{ fontSize: 12 }}>
            <Check size={13} /> Đánh Dấu Tất Cả Đã Đọc
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="fade-up-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 20 }}>
        {(['critical', 'warning', 'info'] as const).map(sev => {
          const cfg = SEV_CFG[sev]
          const count = alerts.filter(a => a.sev === sev).length
          return (
            <div key={sev} className="card" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: cfg.bg, border: `1px solid ${cfg.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <cfg.icon size={17} color={cfg.color} />
              </div>
              <div>
                <div style={{ fontSize: 26, fontWeight: 800, color: cfg.color, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{count}</div>
                <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 2 }}>{cfg.label}</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Filters */}
      <div className="fade-up-3" style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {[
          { k: 'all', l: 'Tất Cả' },
          { k: 'unread', l: 'Chưa Đọc' },
          { k: 'critical', l: 'Nghiêm Trọng' },
          { k: 'warning', l: 'Cảnh Báo' },
          { k: 'info', l: 'Thông Tin' },
        ].map(({ k, l }) => (
          <button key={k} onClick={() => setFilter(k)}
            className={`btn ${filter === k ? 'btn-cyan' : 'btn-ghost'}`} style={{ fontSize: 12 }}>
            {l}
          </button>
        ))}
      </div>

      {/* Alert list */}
      <div className="fade-up-4" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <Bell size={36} color="var(--text3)" style={{ marginBottom: 12 }} />
            <div style={{ color: 'var(--text1)', fontWeight: 600 }}>Không có cảnh báo</div>
          </div>
        ) : filtered.map(a => {
          const cfg = SEV_CFG[a.sev as keyof typeof SEV_CFG]
          const TypeIcon = TYPE_ICON[a.type] || Bell
          return (
            <div key={a.id} style={{
              padding: '14px 16px', borderRadius: 12,
              background: a.read ? 'var(--bg2)' : cfg.bg,
              border: `1px solid ${a.read ? 'var(--border0)' : cfg.border}`,
              borderLeft: !a.read ? `3px solid ${cfg.color}` : undefined,
              transition: 'all 200ms',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: cfg.bg, border: `1px solid ${cfg.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                  <TypeIcon size={15} color={cfg.color} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap', marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text0)' }}>{a.dev}</span>
                    <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 99, background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color, fontWeight: 700 }}>
                      {cfg.label}
                    </span>
                    {!a.read && <span style={{ width: 7, height: 7, borderRadius: '50%', background: cfg.color, display: 'inline-block' }} />}
                  </div>
                  <p style={{ fontSize: 12, color: a.read ? 'var(--text2)' : 'var(--text1)', lineHeight: 1.6 }}>{a.msg}</p>
                  <div className="mono" style={{ fontSize: 10, color: 'var(--text3)', marginTop: 6 }}>{a.t}</div>
                </div>
                <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                  {!a.read && (
                    <button onClick={() => setAlerts(p => p.map(x => x.id === a.id ? { ...x, read: true } : x))}
                      title="Đánh dấu đã đọc"
                      style={{ width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 7, background: 'rgba(0,255,136,.06)', border: '1px solid rgba(0,255,136,.2)', cursor: 'pointer' }}>
                      <CheckCircle size={13} color="var(--green)" />
                    </button>
                  )}
                  <button onClick={() => setAlerts(p => p.filter(x => x.id !== a.id))}
                    title="Xóa"
                    style={{ width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 7, background: 'rgba(255,69,96,.06)', border: '1px solid rgba(255,69,96,.2)', cursor: 'pointer' }}>
                    <Trash2 size={13} color="var(--red)" />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
