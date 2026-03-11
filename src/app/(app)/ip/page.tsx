'use client'
import { useState } from 'react'
import { Network, Save, CheckCircle, AlertTriangle, History, ArrowRight } from 'lucide-react'

const DEVICES = [
  { id: 'dev-001', name: 'Router Phòng Khách', ip: '192.168.1.1', gw: '192.168.1.1', mask: '255.255.255.0', dns1: '8.8.8.8',        dns2: '8.8.4.4',   dhcp: false, status: 'online'  },
  { id: 'dev-002', name: 'AP Phòng Ngủ',        ip: '192.168.1.2', gw: '192.168.1.1', mask: '255.255.255.0', dns1: '1.1.1.1',         dns2: '1.0.0.1',   dhcp: false, status: 'online'  },
  { id: 'dev-003', name: 'Router Văn Phòng',    ip: '192.168.2.1', gw: '192.168.2.1', mask: '255.255.255.0', dns1: '8.8.8.8',        dns2: '8.8.4.4',   dhcp: true,  status: 'offline' },
  { id: 'dev-004', name: 'Mesh Node Nhà Bếp',   ip: '192.168.1.3', gw: '192.168.1.1', mask: '255.255.255.0', dns1: '8.8.8.8',        dns2: '8.8.4.4',   dhcp: false, status: 'online'  },
  { id: 'dev-005', name: 'Repeater Sân Thượng', ip: '192.168.1.4', gw: '192.168.1.1', mask: '255.255.255.0', dns1: '1.1.1.1',        dns2: '1.0.0.1',   dhcp: false, status: 'warning' },
]

const IP_LOGS = [
  { device: 'Router Phòng Khách', old: '192.168.1.100', nw: '192.168.1.1', by: 'Admin', t: '10/01/2024 10:00' },
  { device: 'AP Phòng Ngủ',       old: '192.168.1.50',  nw: '192.168.1.2', by: 'Admin', t: '08/01/2024 14:30' },
]

const DNS_PRESETS = [
  { name: 'Google',    d1: '8.8.8.8',          d2: '8.8.4.4' },
  { name: 'Cloudflare', d1: '1.1.1.1',          d2: '1.0.0.1' },
  { name: 'OpenDNS',   d1: '208.67.222.222',    d2: '208.67.220.220' },
  { name: 'VNPT',      d1: '203.113.131.1',     d2: '203.113.131.2' },
]

function validateIP(ip: string) {
  return /^(\d{1,3}\.){3}\d{1,3}$/.test(ip) && ip.split('.').every(n => +n <= 255)
}

export default function IPPage() {
  const [selId, setSelId] = useState(DEVICES[0].id)
  const [cfgs, setCfgs] = useState(Object.fromEntries(DEVICES.map(d => [d.id, { ip: d.ip, gw: d.gw, mask: d.mask, dns1: d.dns1, dns2: d.dns2, dhcp: d.dhcp }])))
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState<string | null>(null)

  const dev = DEVICES.find(d => d.id === selId)!
  const cfg = cfgs[selId]
  const set = (k: string, v: any) => setCfgs(c => ({ ...c, [selId]: { ...c[selId], [k]: v } }))

  const ipInvalid = cfg.ip && !validateIP(cfg.ip)
  const gwInvalid = cfg.gw && !validateIP(cfg.gw)

  const save = async () => {
    if (dev.status === 'offline' || ipInvalid) return
    setSaving(true)
    await new Promise(r => setTimeout(r, 1400))
    setSaving(false); setSaved(selId)
    setTimeout(() => setSaved(null), 4000)
  }

  return (
    <div style={{ padding: 28 }}>
      <div className="fade-up" style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--cyan)', letterSpacing: '.12em', marginBottom: 6 }}>IP MANAGEMENT</div>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text0)', letterSpacing: '-.02em' }}>Quản Lý IP</h1>
        <p style={{ fontSize: 12, color: 'var(--text2)', marginTop: 4 }}>Cấu hình địa chỉ IP, Gateway, Subnet và DNS</p>
      </div>

      <div className="fade-up-2" style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 20 }}>
        {/* Device selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 4 }}>Chọn Thiết Bị</div>
          {DEVICES.map(d => {
            const active = selId === d.id
            const sc = d.status === 'online' ? 'var(--green)' : d.status === 'offline' ? 'var(--red)' : 'var(--amber)'
            return (
              <button key={d.id} onClick={() => setSelId(d.id)}
                style={{ padding: '12px 14px', borderRadius: 10, border: `1px solid ${active ? 'rgba(0,229,255,.25)' : 'var(--border0)'}`, background: active ? 'rgba(0,229,255,.05)' : 'var(--bg2)', cursor: 'pointer', textAlign: 'left', transition: 'all 150ms' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="dot-pulse" style={{ width: 7, height: 7, borderRadius: '50%', background: sc, display: 'block', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: active ? 'var(--cyan)' : 'var(--text0)' }}>{d.name}</div>
                    <div className="mono" style={{ fontSize: 10, color: 'var(--blue)', marginTop: 2 }}>{cfgs[d.id].ip}</div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Config */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <div className="section-header">
              <div className="section-icon" style={{ background: 'rgba(77,159,255,.1)' }}>
                <Network size={15} color="var(--blue)" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: 'var(--text0)' }}>{dev.name}</div>
                <div className="mono" style={{ fontSize: 10, color: 'var(--text2)' }}>{dev.ip}</div>
              </div>
              {dev.status === 'offline' && <span className="badge badge-offline"><AlertTriangle size={10} />Offline</span>}
            </div>

            {/* DHCP Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderRadius: 9, background: 'var(--bg1)', border: '1px solid var(--border0)', marginBottom: 18 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text0)' }}>Chế Độ DHCP</div>
                <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 2 }}>
                  {cfg.dhcp ? 'Tự động nhận IP từ DHCP server' : 'Cấu hình địa chỉ IP tĩnh'}
                </div>
              </div>
              <div className={`toggle ${cfg.dhcp ? 'on' : ''}`} onClick={() => dev.status !== 'offline' && set('dhcp', !cfg.dhcp)} />
            </div>

            <div style={{ opacity: cfg.dhcp ? .35 : 1, pointerEvents: cfg.dhcp ? 'none' : 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label className="label">Địa Chỉ IP</label>
                  <input className={`input input-mono`} placeholder="192.168.1.x"
                    style={{ borderColor: ipInvalid ? 'var(--red)' : undefined }}
                    value={cfg.ip} onChange={e => set('ip', e.target.value)} disabled={dev.status === 'offline'} />
                  {ipInvalid && <div style={{ fontSize: 10, color: 'var(--red)', marginTop: 4 }}>Địa chỉ IP không hợp lệ</div>}
                </div>
                <div>
                  <label className="label">Default Gateway</label>
                  <input className="input input-mono" placeholder="192.168.1.1"
                    style={{ borderColor: gwInvalid ? 'var(--red)' : undefined }}
                    value={cfg.gw} onChange={e => set('gw', e.target.value)} disabled={dev.status === 'offline'} />
                </div>
              </div>

              <div>
                <label className="label">Subnet Mask</label>
                <select className="input select input-mono" value={cfg.mask} onChange={e => set('mask', e.target.value)} disabled={dev.status === 'offline'}>
                  <option value="255.255.255.0">/24 — 255.255.255.0</option>
                  <option value="255.255.0.0">/16 — 255.255.0.0</option>
                  <option value="255.0.0.0">/8 — 255.0.0.0</option>
                  <option value="255.255.255.128">/25 — 255.255.255.128</option>
                  <option value="255.255.255.192">/26 — 255.255.255.192</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label className="label">DNS Chính</label>
                  <input className="input input-mono" placeholder="8.8.8.8"
                    value={cfg.dns1} onChange={e => set('dns1', e.target.value)} disabled={dev.status === 'offline'} />
                </div>
                <div>
                  <label className="label">DNS Phụ</label>
                  <input className="input input-mono" placeholder="8.8.4.4"
                    value={cfg.dns2} onChange={e => set('dns2', e.target.value)} disabled={dev.status === 'offline'} />
                </div>
              </div>

              {/* DNS presets */}
              <div>
                <div style={{ fontSize: 10, color: 'var(--text3)', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 8 }}>DNS Nhanh</div>
                <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
                  {DNS_PRESETS.map(p => (
                    <button key={p.name} onClick={() => { set('dns1', p.d1); set('dns2', p.d2) }}
                      disabled={dev.status === 'offline'}
                      style={{ padding: '5px 11px', borderRadius: 7, background: 'var(--bg1)', border: '1px solid var(--border1)', color: 'var(--text2)', fontSize: 11, cursor: 'pointer', transition: 'all 120ms', fontFamily: 'var(--font-display)' }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border2)')}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border1)')}>
                      {p.name} <span className="mono" style={{ fontSize: 10, color: 'var(--text3)' }}>({p.d1})</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button onClick={save} disabled={saving || dev.status === 'offline' || !!ipInvalid}
              className="btn btn-cyan"
              style={{ marginTop: 20, width: '100%', justifyContent: 'center', padding: '11px', opacity: (saving || dev.status === 'offline') ? .5 : 1, cursor: (saving || dev.status === 'offline') ? 'not-allowed' : 'pointer' }}>
              {saving ? (
                <><div style={{ width: 14, height: 14, border: '2px solid #05080f', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />Đang Lưu...</>
              ) : saved === selId ? (
                <><CheckCircle size={14} />Đã Lưu!</>
              ) : (
                <><Save size={14} />Lưu Cấu Hình IP</>
              )}
            </button>
          </div>

          {/* IP Change Log */}
          <div className="card">
            <div className="section-header">
              <div className="section-icon" style={{ background: 'rgba(0,229,255,.1)' }}>
                <History size={14} color="var(--cyan)" />
              </div>
              <span style={{ fontWeight: 700, color: 'var(--text0)', fontSize: 13 }}>Lịch Sử Thay Đổi IP</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {IP_LOGS.map((l, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 8, background: 'var(--bg1)', border: '1px solid var(--border0)' }}>
                  <Network size={13} color="var(--text3)" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text0)' }}>{l.device}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 3 }}>
                      <span className="mono" style={{ fontSize: 11, color: 'var(--red)' }}>{l.old}</span>
                      <ArrowRight size={11} color="var(--text3)" />
                      <span className="mono" style={{ fontSize: 11, color: 'var(--green)' }}>{l.nw}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 10, color: 'var(--text2)' }}>{l.by}</div>
                    <div className="mono" style={{ fontSize: 10, color: 'var(--text3)' }}>{l.t}</div>
                  </div>
                </div>
              ))}
              {IP_LOGS.length === 0 && (
                <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text3)', padding: '16px 0' }}>Chưa có lịch sử thay đổi</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
