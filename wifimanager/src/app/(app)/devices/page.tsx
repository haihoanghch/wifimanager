'use client'
import { useState } from 'react'
import {
  Router, Plus, Search, MoreVertical, Wifi, Users,
  Signal, Trash2, Edit3, RotateCcw, Eye, MapPin,
  Cpu, Network, X, ChevronDown
} from 'lucide-react'

const INITIAL = [
  { id: 'dev-001', name: 'Router Phòng Khách', mac: 'AA:BB:CC:DD:EE:01', ip: '192.168.1.1', type: 'router', model: 'TP-Link AX3000', firmware: 'v2.1.0', location: 'Phòng Khách', status: 'online', ssid: 'HomeNet_5G', band: '5GHz', ch: 36, signal: -43, clients: 8, uptime: '11 ngày 0 giờ' },
  { id: 'dev-002', name: 'Access Point Phòng Ngủ', mac: 'AA:BB:CC:DD:EE:02', ip: '192.168.1.2', type: 'access_point', model: 'Ubiquiti UAP-AC', firmware: 'v6.2.0', location: 'Phòng Ngủ', status: 'online', ssid: 'HomeNet_2G', band: '2.4GHz', ch: 6, signal: -61, clients: 3, uptime: '5 ngày 0 giờ' },
  { id: 'dev-003', name: 'Router Văn Phòng', mac: 'AA:BB:CC:DD:EE:03', ip: '192.168.2.1', type: 'router', model: 'ASUS RT-AX88U', firmware: 'v3.0.0.4', location: 'Văn Phòng', status: 'offline', ssid: 'OfficeNet', band: '5GHz', ch: 149, signal: -99, clients: 0, uptime: 'N/A' },
  { id: 'dev-004', name: 'Mesh Node Nhà Bếp', mac: 'AA:BB:CC:DD:EE:04', ip: '192.168.1.3', type: 'mesh_node', model: 'Google Nest WiFi', firmware: 'v14393', location: 'Nhà Bếp', status: 'online', ssid: 'HomeNet_5G', band: '5GHz', ch: 36, signal: -54, clients: 2, uptime: '3 ngày 0 giờ' },
  { id: 'dev-005', name: 'Repeater Sân Thượng', mac: 'AA:BB:CC:DD:EE:05', ip: '192.168.1.4', type: 'repeater', model: 'TP-Link RE605X', firmware: 'v1.0.3', location: 'Sân Thượng', status: 'warning', ssid: 'HomeNet_EXT', band: '5GHz', ch: 36, signal: -74, clients: 1, uptime: '1 ngày 0 giờ' },
]

const TYPE_LABEL: Record<string, string> = {
  router: 'Router', access_point: 'Access Point', mesh_node: 'Mesh Node', repeater: 'Repeater'
}
const STATUS_COLOR: Record<string, string> = { online: 'var(--green)', offline: 'var(--red)', warning: 'var(--amber)' }

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

function DeviceCard({ d, onDelete, onEdit }: any) {
  const [menu, setMenu] = useState(false)
  const sc = STATUS_COLOR[d.status]

  return (
    <div className="card card-glow fade-up" style={{
      borderColor: d.status === 'online' ? 'var(--border0)' : d.status === 'offline' ? 'rgba(255,69,96,.15)' : 'rgba(255,184,0,.15)',
      transition: 'all 200ms',
    }}>
      {/* Card header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: `${sc}14`, border: `1px solid ${sc}30`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Router size={18} color={sc} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text0)', lineHeight: 1.3 }}>{d.name}</div>
            <div style={{ fontSize: 10, color: 'var(--text2)', marginTop: 2, fontFamily: 'var(--font-mono)' }}>{TYPE_LABEL[d.type]}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className={`badge badge-${d.status}`}>
            <span className="dot-pulse" style={{ width: 5, height: 5, borderRadius: '50%', background: sc, display: 'inline-block' }} />
            {d.status === 'online' ? 'Online' : d.status === 'offline' ? 'Offline' : 'Cảnh Báo'}
          </span>
          <div style={{ position: 'relative' }}>
            <button onClick={() => setMenu(!menu)} style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, background: 'var(--bg3)', border: '1px solid var(--border0)', cursor: 'pointer' }}>
              <MoreVertical size={13} color="var(--text2)" />
            </button>
            {menu && (
              <div style={{ position: 'absolute', right: 0, top: 32, zIndex: 20, width: 180, background: 'var(--bg2)', border: '1px solid var(--border1)', borderRadius: 10, overflow: 'hidden', boxShadow: '0 16px 40px rgba(0,0,0,.5)' }}>
                {[
                  { icon: Eye, label: 'Xem Chi Tiết', href: `/devices/${d.id}` },
                  { icon: Wifi, label: 'Đổi WiFi/Mật Khẩu', href: `/wifi?id=${d.id}` },
                  { icon: RotateCcw, label: 'Khởi Động Lại', href: `/reboot?id=${d.id}` },
                  { icon: Network, label: 'Đổi IP', href: `/ip?id=${d.id}` },
                ].map(({ icon: Icon, label, href }) => (
                  <a key={label} href={href} onClick={() => setMenu(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '10px 14px', color: 'var(--text1)', fontSize: 12, textDecoration: 'none', transition: 'background 120ms' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg3)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <Icon size={13} /> {label}
                  </a>
                ))}
                <div style={{ height: 1, background: 'var(--border0)', margin: '4px 0' }} />
                <button onClick={() => { onDelete(d.id); setMenu(false) }}
                  style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '10px 14px', color: 'var(--red)', fontSize: 12, background: 'none', border: 'none', cursor: 'pointer', width: '100%', transition: 'background 120ms' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,69,96,.06)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <Trash2 size={13} /> Xóa Thiết Bị
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Info grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
        {[
          { icon: Cpu,    label: 'Model',   val: d.model },
          { icon: MapPin, label: 'Vị Trí',  val: d.location },
          { icon: Wifi,   label: 'SSID',    val: d.ssid },
          { icon: Signal, label: 'Kênh',    val: `${d.band} · CH${d.ch}` },
        ].map(({ icon: Icon, label, val }) => (
          <div key={label} style={{ background: 'var(--bg1)', borderRadius: 7, padding: '8px 10px', border: '1px solid var(--border0)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 3 }}>
              <Icon size={9} color="var(--text3)" />
              <span style={{ fontSize: 9, color: 'var(--text3)', fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase' }}>{label}</span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text1)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{val}</div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid var(--border0)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--text2)' }}>
            <Users size={11} /> {d.clients}
          </span>
          <span className="mono" style={{ fontSize: 11, color: 'var(--blue)' }}>{d.ip}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <SignalBars dbm={d.signal} />
          <span className="mono" style={{ fontSize: 10, color: 'var(--text3)' }}>{d.signal} dBm</span>
        </div>
      </div>
    </div>
  )
}

export default function DevicesPage() {
  const [devices, setDevices] = useState(INITIAL)
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState('all')
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ name: '', mac: '', ip: '', type: 'router', model: '', location: '' })

  const filtered = devices.filter(d => {
    const s = q.toLowerCase()
    const match = !s || d.name.toLowerCase().includes(s) || d.ip.includes(s) || d.mac.toLowerCase().includes(s)
    const f = filter === 'all' || d.status === filter || d.type === filter
    return match && f
  })

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    setDevices(prev => [...prev, {
      ...form, id: `dev-${Date.now()}`, firmware: 'Unknown',
      status: 'offline', ssid: '', band: '2.4GHz', ch: 6,
      signal: -80, clients: 0, uptime: 'Vừa thêm'
    } as any])
    setForm({ name: '', mac: '', ip: '', type: 'router', model: '', location: '' })
    setShowAdd(false)
  }

  return (
    <div style={{ padding: 28 }}>
      {/* Header */}
      <div className="fade-up" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--cyan)', letterSpacing: '.12em', marginBottom: 6 }}>DEVICE MANAGEMENT</div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text0)', letterSpacing: '-.02em' }}>Thiết Bị</h1>
          <p style={{ fontSize: 12, color: 'var(--text2)', marginTop: 4 }}>{filtered.length} / {devices.length} thiết bị</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn btn-cyan fade-up">
          <Plus size={14} /> Thêm Thiết Bị
        </button>
      </div>

      {/* Search & Filter */}
      <div className="fade-up-2" style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
          <Search size={13} color="var(--text3)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
          <input className="input" style={{ paddingLeft: 36 }} placeholder="Tìm tên, IP, MAC..." value={q} onChange={e => setQ(e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {[
            { k: 'all', l: 'Tất Cả' },
            { k: 'online', l: 'Online' },
            { k: 'offline', l: 'Offline' },
            { k: 'warning', l: 'Cảnh Báo' },
            { k: 'router', l: 'Router' },
            { k: 'access_point', l: 'AP' },
          ].map(({ k, l }) => (
            <button key={k} onClick={() => setFilter(k)}
              className={`btn ${filter === k ? 'btn-cyan' : 'btn-ghost'}`}
              style={{ fontSize: 12 }}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="fade-up-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {filtered.map(d => (
            <DeviceCard key={d.id} d={d} onDelete={(id: string) => setDevices(p => p.filter(x => x.id !== id))} />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <Router size={40} color="var(--text3)" style={{ marginBottom: 16 }} />
          <div style={{ color: 'var(--text1)', fontWeight: 600 }}>Không tìm thấy thiết bị</div>
          <div style={{ color: 'var(--text2)', fontSize: 12, marginTop: 6 }}>Thử thay đổi bộ lọc hoặc thêm thiết bị mới</div>
        </div>
      )}

      {/* Add Modal */}
      {showAdd && (
        <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && setShowAdd(false)}>
          <div className="modal">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--cyan)', marginBottom: 4 }}>DEVICE MANAGEMENT</div>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text0)' }}>Thêm Thiết Bị Mới</h2>
              </div>
              <button onClick={() => setShowAdd(false)} style={{ background: 'var(--bg3)', border: '1px solid var(--border1)', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <X size={14} color="var(--text2)" />
              </button>
            </div>
            <form onSubmit={handleAdd}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label className="label">Tên Thiết Bị *</label>
                  <input className="input" required placeholder="VD: Router Phòng Khách"
                    value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label className="label">Địa Chỉ MAC *</label>
                    <input className="input input-mono" required placeholder="AA:BB:CC:DD:EE:FF"
                      value={form.mac} onChange={e => setForm({ ...form, mac: e.target.value })} />
                  </div>
                  <div>
                    <label className="label">Địa Chỉ IP</label>
                    <input className="input input-mono" placeholder="192.168.1.x"
                      value={form.ip} onChange={e => setForm({ ...form, ip: e.target.value })} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label className="label">Loại Thiết Bị</label>
                    <select className="input select" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                      <option value="router">Router</option>
                      <option value="access_point">Access Point</option>
                      <option value="mesh_node">Mesh Node</option>
                      <option value="repeater">Repeater</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">Vị Trí</label>
                    <input className="input" placeholder="VD: Phòng Khách"
                      value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="label">Model</label>
                  <input className="input" placeholder="VD: TP-Link AX3000"
                    value={form.model} onChange={e => setForm({ ...form, model: e.target.value })} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
                <button type="button" onClick={() => setShowAdd(false)} className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }}>Hủy</button>
                <button type="submit" className="btn btn-cyan" style={{ flex: 1, justifyContent: 'center' }}>
                  <Plus size={14} /> Thêm Thiết Bị
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
