'use client'
import { useState, useEffect } from 'react'
import {
  Router, Wifi, Users, AlertTriangle, TrendingUp, TrendingDown,
  RefreshCw, Activity, Signal, Clock, ChevronRight, Zap
} from 'lucide-react'
import {
  AreaChart, Area, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts'

/* ── Mock data ── */
const DEVICES = [
  { name: 'Router Phòng Khách', ip: '192.168.1.1', status: 'online',  clients: 8, signal: -43, model: 'TP-Link AX3000',   location: 'Phòng Khách',  uptime: '11 ngày 0 giờ' },
  { name: 'AP Phòng Ngủ',        ip: '192.168.1.2', status: 'online',  clients: 3, signal: -61, model: 'Ubiquiti UAP-AC', location: 'Phòng Ngủ',   uptime: '5 ngày 0 giờ' },
  { name: 'Router Văn Phòng',    ip: '192.168.2.1', status: 'offline', clients: 0, signal: -99, model: 'ASUS RT-AX88U',   location: 'Văn Phòng',   uptime: 'N/A' },
  { name: 'Mesh Node Nhà Bếp',   ip: '192.168.1.3', status: 'online',  clients: 2, signal: -54, model: 'Nest WiFi',       location: 'Nhà Bếp',     uptime: '3 ngày 0 giờ' },
  { name: 'Repeater Sân Thượng', ip: '192.168.1.4', status: 'warning', clients: 1, signal: -74, model: 'TP-Link RE605X',  location: 'Sân Thượng',  uptime: '1 ngày 0 giờ' },
]

const ALERTS = [
  { msg: 'Router Văn Phòng offline 2 giờ', sev: 'critical', t: '10 phút trước' },
  { msg: 'Phát hiện đăng nhập sai 5 lần từ 192.168.1.99', sev: 'critical', t: '30 phút trước' },
  { msg: 'Tín hiệu Sân Thượng yếu: -74 dBm', sev: 'warning', t: '1 giờ trước' },
  { msg: 'Firmware mới v2.2.0 cho TP-Link AX3000', sev: 'info', t: '6 giờ trước' },
]

function genTraffic() {
  return Array.from({ length: 24 }, (_, i) => ({
    t: `${i}h`,
    dl: +(Math.sin(i / 4) * 25 + 45 + Math.random() * 15).toFixed(1),
    ul: +(Math.sin(i / 4) * 10 + 18 + Math.random() * 8).toFixed(1),
  }))
}
function genClients() {
  return Array.from({ length: 12 }, (_, i) => ({
    t: `${i * 2}h`, c: Math.floor(Math.sin(i / 2) * 5 + 10 + Math.random() * 4)
  }))
}

function SignalBars({ dbm }: { dbm: number }) {
  const level = dbm > -50 ? 4 : dbm > -65 ? 3 : dbm > -75 ? 2 : 1
  const cls = level >= 4 ? 'active-strong' : level >= 3 ? 'active-medium' : 'active-weak'
  return (
    <div className="signal-bars">
      {[4, 8, 12, 16].map((h, i) => (
        <div key={i} className={`signal-bar ${i < level ? cls : ''}`} style={{ height: h }} />
      ))}
    </div>
  )
}

const STATUS_COLOR: Record<string, string> = { online: 'var(--green)', offline: 'var(--red)', warning: 'var(--amber)' }

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: 'var(--bg3)', border: '1px solid var(--border1)', borderRadius: 8, padding: '8px 12px', fontSize: 12 }}>
      <div style={{ color: 'var(--text2)', marginBottom: 4, fontFamily: 'var(--font-mono)' }}>{label}</div>
      {payload.map((p: any) => (
        <div key={p.name} style={{ color: p.color, fontFamily: 'var(--font-mono)' }}>
          {p.name === 'dl' ? '↓' : p.name === 'ul' ? '↑' : ''} {p.value} {p.name === 'c' ? 'clients' : 'Mbps'}
        </div>
      ))}
    </div>
  )
}

export default function DashboardPage() {
  const [traffic] = useState(genTraffic)
  const [clients] = useState(genClients)
  const [loading, setLoading] = useState(false)
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const online  = DEVICES.filter(d => d.status === 'online').length
  const offline = DEVICES.filter(d => d.status === 'offline').length
  const totalClients = DEVICES.reduce((s, d) => s + d.clients, 0)
  const unreadAlerts = ALERTS.filter(a => a.sev !== 'info').length

  const refresh = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 1400)
  }

  return (
    <div style={{ padding: 28 }}>

      {/* Header */}
      <div className="fade-up" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--cyan)', letterSpacing: '.12em', marginBottom: 6 }}>
            NETWORK OPERATIONS CENTER
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text0)', letterSpacing: '-.02em' }}>Dashboard</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
            <Clock size={12} color="var(--text2)" />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text2)' }}>
              {time.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              {' · '}{time.toLocaleTimeString('vi-VN')}
            </span>
          </div>
        </div>
        <button className="btn btn-ghost fade-up" onClick={refresh} style={{ marginTop: 4 }}>
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          Làm Mới
        </button>
      </div>

      {/* KPI cards */}
      <div className="fade-up-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { icon: Router,        label: 'Tổng Thiết Bị',   val: DEVICES.length, sub: `${online} online`, color: 'var(--cyan)',   glow: '0 0 24px rgba(0,229,255,.15)' },
          { icon: Activity,      label: 'Đang Hoạt Động',  val: online,          sub: `${offline} offline`, color: 'var(--green)',  glow: '0 0 24px rgba(0,255,136,.15)' },
          { icon: Users,         label: 'Client Kết Nối',  val: totalClients,    sub: 'thiết bị WiFi',   color: 'var(--blue)',   glow: '0 0 24px rgba(77,159,255,.15)' },
          { icon: AlertTriangle, label: 'Cảnh Báo',        val: unreadAlerts,    sub: 'chưa xử lý',     color: 'var(--red)',    glow: '0 0 24px rgba(255,69,96,.15)' },
        ].map(({ icon: Icon, label, val, sub, color, glow }, i) => (
          <div key={i} className="card card-glow" style={{ boxShadow: glow, borderColor: `${color}22` }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ width: 36, height: 36, borderRadius: 9, background: `${color}14`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={17} color={color} />
              </div>
              <TrendingUp size={13} color="var(--text3)" />
            </div>
            <div className="stat-num" style={{ color }}>{val}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text0)', marginTop: 6 }}>{label}</div>
            <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 2 }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="fade-up-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 340px', gap: 16, marginBottom: 24 }}>

        {/* Download/Upload */}
        <div className="card" style={{ gridColumn: 'span 2' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--text0)', fontSize: 14 }}>Lưu Lượng Mạng</div>
              <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 2, fontFamily: 'var(--font-mono)' }}>24 giờ qua · Mbps</div>
            </div>
            <div style={{ display: 'flex', gap: 16 }}>
              {[['var(--cyan)', '↓ Download'], ['var(--green)', '↑ Upload']].map(([c, l]) => (
                <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--text2)' }}>
                  <span style={{ width: 20, height: 2, background: c, borderRadius: 1, display: 'block' }} />{l}
                </div>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={150}>
            <AreaChart data={traffic} margin={{ left: -20, right: 0 }}>
              <defs>
                {[['dl', '#00e5ff'], ['ul', '#00ff88']].map(([k, c]) => (
                  <linearGradient key={k} id={`g-${k}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={c} stopOpacity={.25} />
                    <stop offset="95%" stopColor={c} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <XAxis dataKey="t" tick={{ fill: 'var(--text3)', fontSize: 10 }} axisLine={false} tickLine={false} interval={3} />
              <YAxis tick={{ fill: 'var(--text3)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="dl" stroke="#00e5ff" strokeWidth={1.5} fill="url(#g-dl)" dot={false} />
              <Area type="monotone" dataKey="ul" stroke="#00ff88" strokeWidth={1.5} fill="url(#g-ul)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Client count */}
        <div className="card">
          <div style={{ fontWeight: 700, color: 'var(--text0)', fontSize: 14, marginBottom: 4 }}>Client Kết Nối</div>
          <div style={{ fontSize: 11, color: 'var(--text2)', marginBottom: 20, fontFamily: 'var(--font-mono)' }}>12 giờ qua</div>
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={clients} margin={{ left: -20, right: 0 }}>
              <XAxis dataKey="t" tick={{ fill: 'var(--text3)', fontSize: 10 }} axisLine={false} tickLine={false} interval={2} />
              <YAxis tick={{ fill: 'var(--text3)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="c" stroke="var(--blue)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom row */}
      <div className="fade-up-4" style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 16 }}>

        {/* Device table */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--border0)' }}>
            <div style={{ fontWeight: 700, color: 'var(--text0)', fontSize: 14 }}>
              <Activity size={14} color="var(--cyan)" style={{ display: 'inline', marginRight: 8, verticalAlign: 'middle' }} />
              Trạng Thái Thiết Bị
            </div>
            <a href="/devices" style={{ fontSize: 11, color: 'var(--cyan)', display: 'flex', alignItems: 'center', gap: 2, textDecoration: 'none' }}>
              Xem tất cả <ChevronRight size={11} />
            </a>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Thiết Bị</th>
                <th>IP</th>
                <th>Tín Hiệu</th>
                <th>Clients</th>
                <th>Trạng Thái</th>
              </tr>
            </thead>
            <tbody>
              {DEVICES.map((d, i) => (
                <tr key={i}>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text0)', fontSize: 12 }}>{d.name}</div>
                    <div style={{ fontSize: 10, color: 'var(--text3)' }}>{d.model}</div>
                  </td>
                  <td><span className="mono" style={{ fontSize: 11, color: 'var(--blue)' }}>{d.ip}</span></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <SignalBars dbm={d.signal} />
                      <span className="mono" style={{ fontSize: 10, color: 'var(--text2)' }}>{d.signal}</span>
                    </div>
                  </td>
                  <td><span style={{ fontSize: 12, color: 'var(--text1)' }}>{d.clients}</span></td>
                  <td>
                    <span className={`badge badge-${d.status}`}>
                      <span className="dot-pulse" style={{ width: 5, height: 5, borderRadius: '50%', background: STATUS_COLOR[d.status], display: 'inline-block' }} />
                      {d.status === 'online' ? 'Online' : d.status === 'offline' ? 'Offline' : 'Cảnh Báo'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Alerts */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontWeight: 700, color: 'var(--text0)', fontSize: 14 }}>
              <AlertTriangle size={14} color="var(--amber)" style={{ display: 'inline', marginRight: 8, verticalAlign: 'middle' }} />
              Cảnh Báo
            </div>
            <a href="/alerts" style={{ fontSize: 11, color: 'var(--cyan)', textDecoration: 'none' }}>Xem tất cả →</a>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {ALERTS.map((a, i) => {
              const c = a.sev === 'critical' ? 'var(--red)' : a.sev === 'warning' ? 'var(--amber)' : 'var(--blue)'
              return (
                <div key={i} style={{ padding: '10px 12px', borderRadius: 8, background: `${c.replace(')', ', .06)')}`.replace('var(--', 'rgba(').replace(')', ',.06)'), border: `1px solid ${c.replace(')', ', .18)')}`.replace('var(--', 'rgba(').replace(')', ',.18)') }}>
                  <div style={{ fontSize: 12, color: 'var(--text0)', fontWeight: 500, lineHeight: 1.4 }}>{a.msg}</div>
                  <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 4, fontFamily: 'var(--font-mono)' }}>{a.t}</div>
                </div>
              )
            })}
          </div>

          {/* Quick stats */}
          <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border0)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { icon: TrendingDown, label: 'Download TB', val: '42 Mbps', color: 'var(--cyan)' },
              { icon: TrendingUp,   label: 'Upload TB',   val: '18 Mbps', color: 'var(--green)' },
              { icon: Zap,          label: 'Uptime TB',   val: '8 ngày',  color: 'var(--amber)' },
              { icon: Wifi,         label: 'Băng Tần',    val: '2x 5GHz', color: 'var(--blue)' },
            ].map(({ icon: Icon, label, val, color }, j) => (
              <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icon size={13} color={color} />
                <div>
                  <div style={{ fontSize: 10, color: 'var(--text2)' }}>{label}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text0)', fontFamily: 'var(--font-mono)' }}>{val}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
