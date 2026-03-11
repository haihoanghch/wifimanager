'use client'
import { useState } from 'react'
import { Settings, Save, CheckCircle, Bell, Shield, Database, Globe, Clock, Key } from 'lucide-react'

export default function SettingsPage() {
  const [saved, setSaved] = useState(false)
  const [cfg, setCfg] = useState({
    appName: 'WiFi Manager', refresh: '30', tz: 'Asia/Ho_Chi_Minh',
    notif: true, nOffline: true, nSignal: true, nSecurity: true,
    signalThr: '-70', offlineTo: '5',
    accountId: '', apiToken: '', dbId: '',
    adminPw: '', sessionTo: '24', twofa: false,
  })
  const set = (k: string, v: any) => setCfg(c => ({ ...c, [k]: v }))
  const save = async () => { await new Promise(r => setTimeout(r, 700)); setSaved(true); setTimeout(() => setSaved(false), 3000) }

  const Section = ({ icon: Icon, title, color, children }: any) => (
    <div className="card fade-up" style={{ marginBottom: 16 }}>
      <div className="section-header">
        <div className="section-icon" style={{ background: `${color}14` }}>
          <Icon size={15} color={color} />
        </div>
        <h2 style={{ fontWeight: 700, color: 'var(--text0)', fontSize: 14 }}>{title}</h2>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>{children}</div>
    </div>
  )

  const Row = ({ label, desc, children }: any) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text0)' }}>{label}</div>
        {desc && <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 2 }}>{desc}</div>}
      </div>
      <div style={{ flexShrink: 0 }}>{children}</div>
    </div>
  )

  const Toggle = ({ val, onChange }: any) => (
    <div className={`toggle ${val ? 'on' : ''}`} onClick={() => onChange(!val)} />
  )

  return (
    <div style={{ padding: 28, maxWidth: 720 }}>
      <div className="fade-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--cyan)', letterSpacing: '.12em', marginBottom: 6 }}>SYSTEM SETTINGS</div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text0)', letterSpacing: '-.02em' }}>Cài Đặt</h1>
          <p style={{ fontSize: 12, color: 'var(--text2)', marginTop: 4 }}>Cấu hình hệ thống, thông báo và bảo mật</p>
        </div>
        <button onClick={save} className="btn btn-cyan">
          {saved ? <><CheckCircle size={13} />Đã Lưu!</> : <><Save size={13} />Lưu Cài Đặt</>}
        </button>
      </div>

      <Section icon={Settings} title="Chung" color="var(--cyan)">
        <Row label="Tên Ứng Dụng">
          <input className="input" style={{ width: 220 }} value={cfg.appName} onChange={e => set('appName', e.target.value)} />
        </Row>
        <Row label="Múi Giờ">
          <select className="input select" style={{ width: 220 }} value={cfg.tz} onChange={e => set('tz', e.target.value)}>
            <option value="Asia/Ho_Chi_Minh">Hồ Chí Minh (UTC+7)</option>
            <option value="Asia/Bangkok">Bangkok (UTC+7)</option>
            <option value="Asia/Singapore">Singapore (UTC+8)</option>
            <option value="UTC">UTC</option>
          </select>
        </Row>
        <Row label="Tần Suất Làm Mới" desc="Giây giữa mỗi lần cập nhật dữ liệu">
          <select className="input select" style={{ width: 220 }} value={cfg.refresh} onChange={e => set('refresh', e.target.value)}>
            {['10','30','60','120','300'].map(v => <option key={v} value={v}>{v} giây</option>)}
          </select>
        </Row>
      </Section>

      <Section icon={Bell} title="Thông Báo" color="var(--blue)">
        <Row label="Bật Thông Báo" desc="Nhận cảnh báo khi có sự cố"><Toggle val={cfg.notif} onChange={(v: boolean) => set('notif', v)} /></Row>
        <Row label="Thiết Bị Offline" desc="Cảnh báo khi mất kết nối"><Toggle val={cfg.nOffline} onChange={(v: boolean) => set('nOffline', v)} /></Row>
        <Row label="Tín Hiệu Yếu" desc="Cảnh báo khi dBm vượt ngưỡng"><Toggle val={cfg.nSignal} onChange={(v: boolean) => set('nSignal', v)} /></Row>
        <Row label="Bảo Mật" desc="Đăng nhập sai, tấn công bất thường"><Toggle val={cfg.nSecurity} onChange={(v: boolean) => set('nSecurity', v)} /></Row>
        <Row label="Ngưỡng Tín Hiệu">
          <select className="input select" style={{ width: 180 }} value={cfg.signalThr} onChange={e => set('signalThr', e.target.value)}>
            {['-60','-65','-70','-75','-80'].map(v => <option key={v} value={v}>{v} dBm</option>)}
          </select>
        </Row>
        <Row label="Timeout Offline" desc="Sau bao lâu xem là offline">
          <select className="input select" style={{ width: 180 }} value={cfg.offlineTo} onChange={e => set('offlineTo', e.target.value)}>
            {['2','5','10','15','30'].map(v => <option key={v} value={v}>{v} phút</option>)}
          </select>
        </Row>
      </Section>

      <Section icon={Database} title="Cloudflare D1 Database" color="var(--purple)">
        <div style={{ padding: '10px 14px', borderRadius: 8, background: 'rgba(168,85,247,.06)', border: '1px solid rgba(168,85,247,.2)', fontSize: 12, color: 'rgba(168,85,247,.9)', lineHeight: 1.6 }}>
          Cấu hình kết nối Cloudflare D1. Các giá trị này nên được set qua biến môi trường <code className="mono" style={{ fontSize: 11 }}>.env</code> thay vì nhập trực tiếp.
        </div>
        <Row label="Account ID">
          <input className="input input-mono" style={{ width: 280 }} placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
            value={cfg.accountId} onChange={e => set('accountId', e.target.value)} />
        </Row>
        <Row label="API Token">
          <input className="input input-mono" style={{ width: 280 }} type="password" placeholder="••••••••••••••••••••"
            value={cfg.apiToken} onChange={e => set('apiToken', e.target.value)} />
        </Row>
        <Row label="Database ID">
          <input className="input input-mono" style={{ width: 280 }} placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
            value={cfg.dbId} onChange={e => set('dbId', e.target.value)} />
        </Row>
      </Section>

      <Section icon={Shield} title="Bảo Mật" color="var(--red)">
        <Row label="Đổi Mật Khẩu Admin">
          <input className="input" style={{ width: 220 }} type="password" placeholder="Mật khẩu mới..."
            value={cfg.adminPw} onChange={e => set('adminPw', e.target.value)} />
        </Row>
        <Row label="Thời Gian Session" desc="Tự động đăng xuất">
          <select className="input select" style={{ width: 180 }} value={cfg.sessionTo} onChange={e => set('sessionTo', e.target.value)}>
            {['1','8','24','48','168'].map(v => <option key={v} value={v}>{v} giờ</option>)}
          </select>
        </Row>
        <Row label="Xác Thực 2 Yếu Tố" desc="Yêu cầu OTP khi đăng nhập">
          <Toggle val={cfg.twofa} onChange={(v: boolean) => set('twofa', v)} />
        </Row>
      </Section>

      {/* About */}
      <div className="card fade-up" style={{ textAlign: 'center', borderStyle: 'dashed', borderColor: 'var(--border1)' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--cyan)', marginBottom: 4 }}>WIFI MANAGER v2.0.0</div>
        <div style={{ fontSize: 12, color: 'var(--text2)' }}>Next.js 14 · Cloudflare D1 · Vercel · Tiếng Việt</div>
        <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 6 }}>Made with ❤️ — Network Operations Center Dashboard</div>
      </div>
    </div>
  )
}
