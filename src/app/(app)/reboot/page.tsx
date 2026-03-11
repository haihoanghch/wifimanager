'use client'
import { useState } from 'react'

import { RotateCcw, AlertTriangle, CheckCircle, Clock, Zap, Router, X, Loader, Check } from 'lucide-react'

const DEVICES = [
  { id: 'dev-001', name: 'Router Phòng Khách', ip: '192.168.1.1', model: 'TP-Link AX3000',   status: 'online',  uptime: '11 ngày 0 giờ 15 phút' },
  { id: 'dev-002', name: 'AP Phòng Ngủ',        ip: '192.168.1.2', model: 'Ubiquiti UAP-AC', status: 'online',  uptime: '5 ngày 2 giờ 30 phút' },
  { id: 'dev-003', name: 'Router Văn Phòng',    ip: '192.168.2.1', model: 'ASUS RT-AX88U',   status: 'offline', uptime: 'Không khả dụng' },
  { id: 'dev-004', name: 'Mesh Node Nhà Bếp',   ip: '192.168.1.3', model: 'Google Nest WiFi', status: 'online',  uptime: '3 ngày 0 giờ 45 phút' },
  { id: 'dev-005', name: 'Repeater Sân Thượng', ip: '192.168.1.4', model: 'TP-Link RE605X',   status: 'warning', uptime: '1 ngày 0 giờ 5 phút' },
]

const LOGS = [
  { device: 'Router Phòng Khách', time: '15/01/2024 14:32', reason: 'Khởi động định kỳ', ok: true },
  { device: 'AP Phòng Ngủ',       time: '14/01/2024 09:15', reason: 'Cập nhật firmware', ok: true },
  { device: 'Router Văn Phòng',   time: '12/01/2024 16:45', reason: 'Sự cố kết nối',     ok: false },
]

type State = 'idle' | 'rebooting' | 'done' | 'failed'

export default function RebootPage() {
  const [states, setStates] = useState<Record<string, State>>({})
  const [progress, setProgress] = useState<Record<string, number>>({})
  const [selected, setSelected] = useState<string[]>([])
  const [reason, setReason] = useState('')
  const [bulkModal, setBulkModal] = useState(false)
  const [schedule, setSchedule] = useState(false)

  const getState = (id: string): State => states[id] || 'idle'

  const doReboot = async (id: string) => {
    setStates(s => ({ ...s, [id]: 'rebooting' }))
    setProgress(p => ({ ...p, [id]: 0 }))
    // Animate progress
    for (let i = 0; i <= 100; i += 2) {
      await new Promise(r => setTimeout(r, 55))
      setProgress(p => ({ ...p, [id]: i }))
    }
    setStates(s => ({ ...s, [id]: 'done' }))
    setTimeout(() => setStates(s => ({ ...s, [id]: 'idle' })), 5000)
  }

  const bulkReboot = async () => {
    setBulkModal(false)
    const online = selected.filter(id => DEVICES.find(d => d.id === id)?.status !== 'offline')
    for (const id of online) {
      doReboot(id)
      await new Promise(r => setTimeout(r, 600))
    }
    setSelected([])
  }

  const toggle = (id: string) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])

  return (
    <div style={{ padding: 28 }}>
      {/* Header */}
      <div className="fade-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--cyan)', letterSpacing: '.12em', marginBottom: 6 }}>REMOTE MANAGEMENT</div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text0)', letterSpacing: '-.02em' }}>Khởi Động Từ Xa</h1>
          <p style={{ fontSize: 12, color: 'var(--text2)', marginTop: 4 }}>Reboot thiết bị an toàn, ghi log đầy đủ</p>
        </div>
        {selected.length > 0 && (
          <button onClick={() => setBulkModal(true)} className="btn btn-amber fade-up">
            <RotateCcw size={13} /> Reboot {selected.length} Thiết Bị
          </button>
        )}
      </div>

      {/* Warning banner */}
      <div className="fade-up-2" style={{ display: 'flex', gap: 12, padding: '12px 16px', borderRadius: 10, background: 'rgba(255,184,0,.06)', border: '1px solid rgba(255,184,0,.2)', marginBottom: 20 }}>
        <AlertTriangle size={15} color="var(--amber)" style={{ flexShrink: 0, marginTop: 1 }} />
        <div style={{ fontSize: 12, color: 'var(--text1)' }}>
          <strong style={{ color: 'var(--amber)' }}>Lưu ý:</strong> Thiết bị sẽ mất kết nối 1–3 phút sau khi khởi động lại. Tất cả client WiFi sẽ bị ngắt tạm thời.
        </div>
      </div>

      <div className="fade-up-3" style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20 }}>
        {/* Device list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {DEVICES.map(d => {
            const st = getState(d.id)
            const sel = selected.includes(d.id)
            const sc = d.status === 'online' ? 'var(--green)' : d.status === 'offline' ? 'var(--red)' : 'var(--amber)'
            const prog = progress[d.id] || 0

            return (
              <div key={d.id} className="card" style={{ borderColor: sel ? 'rgba(0,229,255,.2)' : 'var(--border0)', transition: 'all 200ms' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  {/* Checkbox */}
                  <div onClick={() => toggle(d.id)} style={{
                    width: 20, height: 20, borderRadius: 5, flexShrink: 0, cursor: 'pointer',
                    background: sel ? 'var(--cyan)' : 'var(--bg4)', border: `1px solid ${sel ? 'var(--cyan)' : 'var(--border1)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 150ms',
                  }}>
                    {sel && <Check size={11} color="var(--bg0)" />}
                  </div>

                  {/* Icon */}
                  <div style={{ width: 42, height: 42, borderRadius: 10, background: `${sc}12`, border: `1px solid ${sc}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Router size={18} color={sc} />
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--text0)' }}>{d.name}</span>
                      <span className={`badge badge-${d.status}`}>
                        <span className="dot-pulse" style={{ width: 5, height: 5, borderRadius: '50%', background: sc, display: 'inline-block' }} />
                        {d.status === 'online' ? 'Online' : d.status === 'offline' ? 'Offline' : 'Cảnh Báo'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
                      <span className="mono" style={{ fontSize: 11, color: 'var(--blue)' }}>{d.ip}</span>
                      <span style={{ fontSize: 11, color: 'var(--text2)' }}>
                        <Clock size={10} style={{ display: 'inline', marginRight: 3 }} />{d.uptime}
                      </span>
                    </div>
                    {/* Progress */}
                    {st === 'rebooting' && (
                      <div style={{ marginTop: 10 }}>
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: `${prog}%`, background: 'linear-gradient(90deg, var(--cyan), var(--green))' }} />
                        </div>
                        <div className="mono" style={{ fontSize: 10, color: 'var(--cyan)', marginTop: 4 }}>
                          Đang khởi động... {prog}%
                        </div>
                      </div>
                    )}
                    {st === 'done' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 8 }}>
                        <CheckCircle size={12} color="var(--green)" />
                        <span style={{ fontSize: 11, color: 'var(--green)' }}>Khởi động thành công</span>
                      </div>
                    )}
                  </div>

                  {/* Action button */}
                  <div style={{ flexShrink: 0 }}>
                    {st === 'idle' && (
                      <button onClick={() => doReboot(d.id)} disabled={d.status === 'offline'}
                        className={`btn ${d.status === 'offline' ? 'btn-ghost' : 'btn-amber'}`}
                        style={{ opacity: d.status === 'offline' ? .4 : 1, cursor: d.status === 'offline' ? 'not-allowed' : 'pointer', fontSize: 12 }}>
                        <RotateCcw size={12} /> Khởi Động
                      </button>
                    )}
                    {st === 'rebooting' && (
                      <div className="btn btn-ghost" style={{ cursor: 'default', fontSize: 12 }}>
                        <Loader size={12} style={{ animation: 'spin 1s linear infinite' }} /> Chờ...
                      </div>
                    )}
                    {st === 'done' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 8, background: 'rgba(0,255,136,.08)', border: '1px solid rgba(0,255,136,.2)', fontSize: 12, color: 'var(--green)' }}>
                        <CheckCircle size={12} /> Xong
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Reason */}
          <div className="card">
            <div className="section-header">
              <div className="section-icon" style={{ background: 'rgba(255,184,0,.1)' }}>
                <Zap size={14} color="var(--amber)" />
              </div>
              <span style={{ fontWeight: 700, color: 'var(--text0)', fontSize: 13 }}>Lý Do Khởi Động</span>
            </div>
            <textarea className="input" rows={3} placeholder="VD: Cập nhật cấu hình, sự cố kết nối..."
              style={{ resize: 'none', fontSize: 12 }} value={reason} onChange={e => setReason(e.target.value)} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
              <div className={`toggle ${schedule ? 'on' : ''}`} onClick={() => setSchedule(!schedule)} />
              <span style={{ fontSize: 12, color: 'var(--text1)' }}>Lên lịch khởi động</span>
            </div>
          </div>

          {/* Reboot log */}
          <div className="card">
            <div className="section-header">
              <div className="section-icon" style={{ background: 'rgba(0,229,255,.1)' }}>
                <Clock size={14} color="var(--cyan)" />
              </div>
              <span style={{ fontWeight: 700, color: 'var(--text0)', fontSize: 13 }}>Lịch Sử</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {LOGS.map((l, i) => (
                <div key={i} style={{ padding: '10px 12px', borderRadius: 8, background: 'var(--bg1)', border: '1px solid var(--border0)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text0)' }}>{l.device}</span>
                    {l.ok ? <CheckCircle size={12} color="var(--green)" /> : <X size={12} color="var(--red)" />}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text2)' }}>{l.reason}</div>
                  <div className="mono" style={{ fontSize: 10, color: 'var(--text3)', marginTop: 3 }}>{l.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bulk confirm modal */}
      {bulkModal && (
        <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && setBulkModal(false)}>
          <div className="modal">
            <div style={{ display: 'flex', gap: 14, marginBottom: 18 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(255,69,96,.1)', border: '1px solid rgba(255,69,96,.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <AlertTriangle size={20} color="var(--red)" />
              </div>
              <div>
                <h3 style={{ fontWeight: 800, fontSize: 17, color: 'var(--text0)' }}>Xác Nhận Khởi Động</h3>
                <p style={{ fontSize: 12, color: 'var(--text2)', marginTop: 3 }}>Hành động không thể hoàn tác</p>
              </div>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text1)', marginBottom: 22, lineHeight: 1.6 }}>
              Bạn sắp khởi động lại <strong style={{ color: 'var(--text0)' }}>{selected.length} thiết bị</strong>. Tất cả kết nối WiFi sẽ bị gián đoạn trong 1–3 phút.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setBulkModal(false)} className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }}>Hủy</button>
              <button onClick={bulkReboot} className="btn btn-danger" style={{ flex: 1, justifyContent: 'center' }}>
                <RotateCcw size={13} /> Xác Nhận Reboot
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
