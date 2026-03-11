'use client'
import { useState } from 'react'
import { Wifi, Eye, EyeOff, Save, CheckCircle, AlertTriangle, Shield, Radio, Lock, X, Check } from 'lucide-react'

const DEVICES = [
  { id: 'dev-001', name: 'Router Phòng Khách', ip: '192.168.1.1', status: 'online',  ssid: 'HomeNet_5G',  pw: 'p@ssw0rd123', band: '5GHz',   ch: 36,  sec: 'WPA3', hidden: false },
  { id: 'dev-002', name: 'AP Phòng Ngủ',        ip: '192.168.1.2', status: 'online',  ssid: 'HomeNet_2G',  pw: 'p@ssw0rd123', band: '2.4GHz', ch: 6,   sec: 'WPA2', hidden: false },
  { id: 'dev-003', name: 'Router Văn Phòng',    ip: '192.168.2.1', status: 'offline', ssid: 'OfficeNet',   pw: 'Offi<3_2024', band: '5GHz',   ch: 149, sec: 'WPA2', hidden: false },
  { id: 'dev-004', name: 'Mesh Node Nhà Bếp',   ip: '192.168.1.3', status: 'online',  ssid: 'HomeNet_5G',  pw: 'p@ssw0rd123', band: '5GHz',   ch: 36,  sec: 'WPA3', hidden: false },
  { id: 'dev-005', name: 'Repeater Sân Thượng', ip: '192.168.1.4', status: 'warning', ssid: 'HomeNet_EXT', pw: 'p@ssw0rd123', band: '5GHz',   ch: 36,  sec: 'WPA2', hidden: false },
]

const CH24 = [1,2,3,4,5,6,7,8,9,10,11]
const CH5  = [36,40,44,48,52,56,100,104,108,112,116,120,124,132,136,140,149,153,157,161,165]

function pwStrength(pw: string) {
  if (!pw) return { level: 0, label: '', color: '' }
  const len = pw.length
  const has = (r: RegExp) => r.test(pw)
  let score = 0
  if (len >= 8) score++
  if (len >= 12) score++
  if (has(/[A-Z]/)) score++
  if (has(/[0-9]/)) score++
  if (has(/[^A-Za-z0-9]/)) score++
  const map = [
    { level: 1, label: 'Rất Yếu', color: 'var(--red)' },
    { level: 2, label: 'Yếu', color: 'var(--red)' },
    { level: 3, label: 'Trung Bình', color: 'var(--amber)' },
    { level: 4, label: 'Mạnh', color: 'var(--green)' },
    { level: 5, label: 'Rất Mạnh', color: 'var(--cyan)' },
  ]
  return map[Math.min(score - 1, 4)] || map[0]
}

export default function WifiPage() {
  const [selId, setSelId] = useState(DEVICES[0].id)
  const [cfgs, setCfgs] = useState(Object.fromEntries(DEVICES.map(d => [d.id, { ssid: d.ssid, pw: d.pw, band: d.band, ch: d.ch, sec: d.sec, hidden: d.hidden }])))
  const [showPw, setShowPw] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState<string | null>(null)
  const [applyAll, setApplyAll] = useState(false)

  const dev = DEVICES.find(d => d.id === selId)!
  const cfg = cfgs[selId]
  const set = (k: string, v: any) => setCfgs(c => ({ ...c, [selId]: { ...c[selId], [k]: v } }))
  const st = pwStrength(cfg.pw)
  const channels = cfg.band === '2.4GHz' ? CH24 : CH5

  const save = async () => {
    if (dev.status === 'offline') return
    setSaving(true)
    await new Promise(r => setTimeout(r, 1800))
    setSaving(false); setSaved(selId)
    if (applyAll) {
      const updated = { ...cfgs }
      DEVICES.forEach(d => { if (d.id !== selId) updated[d.id] = { ...updated[d.id], ssid: cfg.ssid, pw: cfg.pw, sec: cfg.sec } })
      setCfgs(updated)
    }
    setTimeout(() => setSaved(null), 4000)
  }

  return (
    <div style={{ padding: 28 }}>
      <div className="fade-up" style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--cyan)', letterSpacing: '.12em', marginBottom: 6 }}>WIFI CONFIGURATION</div>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text0)', letterSpacing: '-.02em' }}>Cấu Hình WiFi</h1>
        <p style={{ fontSize: 12, color: 'var(--text2)', marginTop: 4 }}>Thay đổi SSID, mật khẩu, băng tần và bảo mật</p>
      </div>

      <div className="fade-up-2" style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 20 }}>

        {/* Device list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 4 }}>Chọn Thiết Bị</div>
          {DEVICES.map(d => {
            const active = selId === d.id
            const sc = d.status === 'online' ? 'var(--green)' : d.status === 'offline' ? 'var(--red)' : 'var(--amber)'
            return (
              <button key={d.id} onClick={() => setSelId(d.id)}
                style={{
                  padding: '12px 14px', borderRadius: 10, border: `1px solid ${active ? 'rgba(0,229,255,.25)' : 'var(--border0)'}`,
                  background: active ? 'rgba(0,229,255,.05)' : 'var(--bg2)',
                  cursor: 'pointer', textAlign: 'left', transition: 'all 150ms',
                }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="dot-pulse" style={{ width: 7, height: 7, borderRadius: '50%', background: sc, display: 'block', flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: active ? 'var(--cyan)' : 'var(--text0)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.name}</div>
                    <div className="mono" style={{ fontSize: 10, color: 'var(--text3)', marginTop: 2 }}>{cfgs[d.id].ssid}</div>
                  </div>
                  {saved === d.id && <CheckCircle size={13} color="var(--green)" />}
                </div>
              </button>
            )
          })}
        </div>

        {/* Config panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* SSID & Password */}
          <div className="card">
            <div className="section-header">
              <div className="section-icon" style={{ background: 'rgba(0,229,255,.1)' }}>
                <Wifi size={15} color="var(--cyan)" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: 'var(--text0)' }}>{dev.name}</div>
                <div className="mono" style={{ fontSize: 10, color: 'var(--text2)' }}>{dev.ip}</div>
              </div>
              {dev.status === 'offline' && (
                <span className="badge badge-offline"><AlertTriangle size={10} /> Offline</span>
              )}
              {dev.status === 'warning' && (
                <span className="badge badge-warning">Cảnh Báo</span>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* SSID */}
              <div>
                <label className="label">Tên WiFi (SSID)</label>
                <input className="input" placeholder="Tên mạng WiFi..." value={cfg.ssid} onChange={e => set('ssid', e.target.value)} disabled={dev.status === 'offline'} />
              </div>

              {/* Password */}
              <div>
                <label className="label">Mật Khẩu WiFi</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={13} color="var(--text3)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                  <input className="input input-mono" type={showPw ? 'text' : 'password'} placeholder="Mật khẩu..."
                    style={{ paddingLeft: 34, paddingRight: 40 }}
                    value={cfg.pw} onChange={e => set('pw', e.target.value)} disabled={dev.status === 'offline'} />
                  <button onClick={() => setShowPw(!showPw)}
                    style={{ position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
                    {showPw ? <EyeOff size={14} color="var(--text2)" /> : <Eye size={14} color="var(--text2)" />}
                  </button>
                </div>
                {cfg.pw && (
                  <div style={{ marginTop: 8 }}>
                    <div style={{ display: 'flex', gap: 4, marginBottom: 5 }}>
                      {[1,2,3,4,5].map(i => (
                        <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= st.level ? st.color : 'var(--border0)', transition: 'background 300ms' }} />
                      ))}
                    </div>
                    <span style={{ fontSize: 10, color: st.color, fontWeight: 600 }}>{st.label}</span>
                  </div>
                )}
              </div>

              {/* Band + Channel */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label className="label"><Radio size={10} style={{ display: 'inline', marginRight: 4 }} />Băng Tần</label>
                  <select className="input select" value={cfg.band} disabled={dev.status === 'offline'}
                    onChange={e => { set('band', e.target.value); set('ch', e.target.value === '2.4GHz' ? 6 : 36) }}>
                    <option value="2.4GHz">2.4 GHz</option>
                    <option value="5GHz">5 GHz</option>
                    <option value="6GHz">6 GHz (WiFi 6E)</option>
                  </select>
                </div>
                <div>
                  <label className="label">Kênh</label>
                  <select className="input select" value={cfg.ch} disabled={dev.status === 'offline'}
                    onChange={e => set('ch', +e.target.value)}>
                    {channels.map(c => <option key={c} value={c}>Kênh {c}</option>)}
                  </select>
                </div>
              </div>

              {/* Security */}
              <div>
                <label className="label"><Shield size={10} style={{ display: 'inline', marginRight: 4 }} />Bảo Mật</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {['WPA2', 'WPA3', 'WPA2/WPA3'].map(s => (
                    <button key={s} onClick={() => set('sec', s)} disabled={dev.status === 'offline'}
                      style={{
                        flex: 1, padding: '8px 0', borderRadius: 8, border: `1px solid ${cfg.sec === s ? 'rgba(0,229,255,.3)' : 'var(--border1)'}`,
                        background: cfg.sec === s ? 'rgba(0,229,255,.08)' : 'var(--bg1)',
                        color: cfg.sec === s ? 'var(--cyan)' : 'var(--text2)',
                        fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 150ms',
                      }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Options */}
              <div style={{ display: 'flex', gap: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div className={`toggle ${cfg.hidden ? 'on' : ''}`} onClick={() => set('hidden', !cfg.hidden)} />
                  <span style={{ fontSize: 12, color: 'var(--text1)' }}>Ẩn WiFi (SSID)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div className={`toggle ${applyAll ? 'on' : ''}`} onClick={() => setApplyAll(!applyAll)} />
                  <span style={{ fontSize: 12, color: 'var(--text1)' }}>Áp dụng cho tất cả</span>
                </div>
              </div>
            </div>

            {/* Save */}
            <button onClick={save} disabled={saving || dev.status === 'offline'}
              className="btn btn-cyan"
              style={{ marginTop: 20, width: '100%', justifyContent: 'center', padding: '11px 0', fontSize: 13, opacity: (saving || dev.status === 'offline') ? .5 : 1, cursor: (saving || dev.status === 'offline') ? 'not-allowed' : 'pointer' }}>
              {saving ? (
                <><div style={{ width: 14, height: 14, border: '2px solid #05080f', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />Đang Lưu...</>
              ) : saved === selId ? (
                <><CheckCircle size={14} />Đã Lưu Thành Công!</>
              ) : (
                <><Save size={14} />Lưu Cấu Hình WiFi</>
              )}
            </button>
          </div>

          {/* Preview */}
          <div className="card" style={{ borderStyle: 'dashed', borderColor: 'var(--border1)' }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 12 }}>Xem Trước Cấu Hình</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
              {[
                { label: 'SSID', val: cfg.ssid || '—' },
                { label: 'Băng Tần', val: cfg.band },
                { label: 'Kênh', val: `CH${cfg.ch}` },
                { label: 'Bảo Mật', val: cfg.sec },
                { label: 'Ẩn SSID', val: cfg.hidden ? 'Có' : 'Không' },
                { label: 'Mật Khẩu', val: cfg.pw ? '●'.repeat(Math.min(cfg.pw.length, 10)) : '—' },
              ].map(({ label, val }) => (
                <div key={label} style={{ background: 'var(--bg1)', padding: '8px 12px', borderRadius: 7 }}>
                  <div style={{ fontSize: 9, color: 'var(--text3)', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase' }}>{label}</div>
                  <div className="mono" style={{ fontSize: 12, color: 'var(--text0)', marginTop: 3 }}>{val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
