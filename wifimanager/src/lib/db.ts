// ============================================================
// Cloudflare D1 REST API Client
// ============================================================

export interface Device {
  id: string
  name: string
  mac_address: string
  ip_address: string
  device_type: 'router' | 'access_point' | 'mesh_node' | 'repeater'
  model: string
  firmware: string
  location: string
  status: 'online' | 'offline' | 'warning'
  wifi_ssid: string
  wifi_password: string
  wifi_band: '2.4GHz' | '5GHz' | '6GHz'
  channel: number
  security: string
  hidden_ssid: number
  signal_strength: number
  connected_clients: number
  uptime_seconds: number
  gateway: string
  subnet_mask: string
  dns_primary: string
  dns_secondary: string
  last_seen: string
  created_at: string
  updated_at: string
}

export interface Alert {
  id: string
  device_id: string | null
  type: string
  message: string
  severity: 'info' | 'warning' | 'critical'
  is_read: number
  created_at: string
}

export interface RebootLog {
  id: string
  device_id: string
  reason: string
  success: number
  rebooted_by: string
  rebooted_at: string
}

const BASE = `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/d1/database/${process.env.D1_DATABASE_ID}`

export async function d1Query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  const res = await fetch(`${BASE}/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sql, params }),
    cache: 'no-store',
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`D1 error ${res.status}: ${err}`)
  }
  const data = await res.json()
  if (!data.success) throw new Error(data.errors?.[0]?.message || 'D1 query failed')
  return (data.result?.[0]?.results ?? []) as T[]
}

export function genId(prefix = 'id'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

export function formatUptime(seconds: number): string {
  if (!seconds) return '0 phút'
  const d = Math.floor(seconds / 86400)
  const h = Math.floor((seconds % 86400) / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (d > 0) return `${d} ngày ${h} giờ`
  if (h > 0) return `${h} giờ ${m} phút`
  return `${m} phút`
}

export function validateIP(ip: string): boolean {
  return /^(\d{1,3}\.){3}\d{1,3}$/.test(ip) && ip.split('.').every(n => +n <= 255)
}

// ============================================================
// Mock data for local dev when D1 not configured
// ============================================================
export const MOCK_DEVICES: Device[] = [
  {
    id: 'dev-001', name: 'Router Phòng Khách', mac_address: 'AA:BB:CC:DD:EE:01',
    ip_address: '192.168.1.1', device_type: 'router', model: 'TP-Link AX3000',
    firmware: 'v2.1.0', location: 'Phòng Khách', status: 'online',
    wifi_ssid: 'HomeNet_5G', wifi_password: 'p@ssw0rd123', wifi_band: '5GHz',
    channel: 36, security: 'WPA3', hidden_ssid: 0,
    signal_strength: -43, connected_clients: 8, uptime_seconds: 950400,
    gateway: '192.168.1.1', subnet_mask: '255.255.255.0', dns_primary: '8.8.8.8', dns_secondary: '8.8.4.4',
    last_seen: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString()
  },
  {
    id: 'dev-002', name: 'Access Point Phòng Ngủ', mac_address: 'AA:BB:CC:DD:EE:02',
    ip_address: '192.168.1.2', device_type: 'access_point', model: 'Ubiquiti UAP-AC',
    firmware: 'v6.2.0', location: 'Phòng Ngủ', status: 'online',
    wifi_ssid: 'HomeNet_2G', wifi_password: 'p@ssw0rd123', wifi_band: '2.4GHz',
    channel: 6, security: 'WPA2', hidden_ssid: 0,
    signal_strength: -61, connected_clients: 3, uptime_seconds: 432000,
    gateway: '192.168.1.1', subnet_mask: '255.255.255.0', dns_primary: '1.1.1.1', dns_secondary: '1.0.0.1',
    last_seen: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString()
  },
  {
    id: 'dev-003', name: 'Router Văn Phòng', mac_address: 'AA:BB:CC:DD:EE:03',
    ip_address: '192.168.2.1', device_type: 'router', model: 'ASUS RT-AX88U',
    firmware: 'v3.0.0.4', location: 'Văn Phòng', status: 'offline',
    wifi_ssid: 'OfficeNet', wifi_password: 'Offi<3_2024', wifi_band: '5GHz',
    channel: 149, security: 'WPA2', hidden_ssid: 0,
    signal_strength: -99, connected_clients: 0, uptime_seconds: 0,
    gateway: '192.168.2.1', subnet_mask: '255.255.255.0', dns_primary: '8.8.8.8', dns_secondary: '8.8.4.4',
    last_seen: new Date(Date.now() - 7200000).toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString()
  },
  {
    id: 'dev-004', name: 'Mesh Node Nhà Bếp', mac_address: 'AA:BB:CC:DD:EE:04',
    ip_address: '192.168.1.3', device_type: 'mesh_node', model: 'Google Nest WiFi',
    firmware: 'v14393', location: 'Nhà Bếp', status: 'online',
    wifi_ssid: 'HomeNet_5G', wifi_password: 'p@ssw0rd123', wifi_band: '5GHz',
    channel: 36, security: 'WPA3', hidden_ssid: 0,
    signal_strength: -54, connected_clients: 2, uptime_seconds: 259200,
    gateway: '192.168.1.1', subnet_mask: '255.255.255.0', dns_primary: '8.8.8.8', dns_secondary: '8.8.4.4',
    last_seen: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString()
  },
  {
    id: 'dev-005', name: 'Repeater Sân Thượng', mac_address: 'AA:BB:CC:DD:EE:05',
    ip_address: '192.168.1.4', device_type: 'repeater', model: 'TP-Link RE605X',
    firmware: 'v1.0.3', location: 'Sân Thượng', status: 'warning',
    wifi_ssid: 'HomeNet_EXT', wifi_password: 'p@ssw0rd123', wifi_band: '5GHz',
    channel: 36, security: 'WPA2', hidden_ssid: 0,
    signal_strength: -74, connected_clients: 1, uptime_seconds: 86400,
    gateway: '192.168.1.1', subnet_mask: '255.255.255.0', dns_primary: '8.8.8.8', dns_secondary: '8.8.4.4',
    last_seen: new Date(Date.now() - 300000).toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString()
  },
]

export const MOCK_ALERTS: Alert[] = [
  { id: 'alr-001', device_id: 'dev-003', type: 'offline', message: 'Router Văn Phòng đã offline hơn 2 giờ. Kiểm tra nguồn điện và kết nối mạng.', severity: 'critical', is_read: 0, created_at: new Date(Date.now() - 600000).toISOString() },
  { id: 'alr-005', device_id: 'dev-001', type: 'security', message: 'Phát hiện 5 lần đăng nhập sai mật khẩu từ IP 192.168.1.99', severity: 'critical', is_read: 0, created_at: new Date(Date.now() - 1800000).toISOString() },
  { id: 'alr-002', device_id: 'dev-005', type: 'signal', message: 'Tín hiệu tại Sân Thượng rất yếu (-74 dBm). Cân nhắc thêm thiết bị khuếch đại.', severity: 'warning', is_read: 0, created_at: new Date(Date.now() - 3600000).toISOString() },
  { id: 'alr-003', device_id: 'dev-002', type: 'signal', message: 'Tín hiệu Phòng Ngủ giảm xuống -61 dBm.', severity: 'warning', is_read: 0, created_at: new Date(Date.now() - 7200000).toISOString() },
  { id: 'alr-004', device_id: 'dev-001', type: 'firmware', message: 'Có bản firmware mới v2.2.0 cho TP-Link AX3000.', severity: 'info', is_read: 1, created_at: new Date(Date.now() - 21600000).toISOString() },
]
