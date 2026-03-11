import { NextRequest, NextResponse } from 'next/server'
import { d1Query, genId } from '@/lib/db'

const isD1 = () => !!(process.env.CLOUDFLARE_ACCOUNT_ID && process.env.CLOUDFLARE_API_TOKEN && process.env.D1_DATABASE_ID)

export async function POST(req: NextRequest) {
  try {
    const { device_id, reason } = await req.json()
    if (!device_id) return NextResponse.json({ success: false, error: 'device_id required' }, { status: 400 })

    if (!isD1()) {
      return NextResponse.json({ success: true, message: 'Lệnh khởi động lại đã được gửi (mock)', _mock: true })
    }

    const [dev] = await d1Query<any>('SELECT id, name, status, ip_address FROM devices WHERE id = ?', [device_id])
    if (!dev) return NextResponse.json({ success: false, error: 'Không tìm thấy thiết bị' }, { status: 404 })
    if (dev.status === 'offline') return NextResponse.json({ success: false, error: 'Thiết bị đang offline' }, { status: 400 })

    // In production: send real command to device via SNMP/SSH/HTTP
    // e.g. await sendRebootCommand(dev.ip_address, dev.credentials)
    const ok = true

    await d1Query(
      'INSERT INTO reboot_logs (id,device_id,reason,success) VALUES (?,?,?,?)',
      [genId('rb'), device_id, reason || 'Manual', ok ? 1 : 0]
    )
    if (ok) {
      await d1Query(`UPDATE devices SET status='offline',uptime_seconds=0,updated_at=datetime('now') WHERE id=?`, [device_id])
    }
    return NextResponse.json({ success: ok, message: ok ? `Đã gửi lệnh khởi động đến ${dev.name}` : 'Lỗi kết nối thiết bị' })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    if (!isD1()) return NextResponse.json({ success: true, data: [], _mock: true })
    const { searchParams } = new URL(req.url)
    const device_id = searchParams.get('device_id')
    let sql = 'SELECT r.*, d.name as device_name FROM reboot_logs r LEFT JOIN devices d ON r.device_id = d.id'
    const params: any[] = []
    if (device_id) { sql += ' WHERE r.device_id = ?'; params.push(device_id) }
    sql += ' ORDER BY r.rebooted_at DESC LIMIT 50'
    const data = await d1Query(sql, params)
    return NextResponse.json({ success: true, data })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 })
  }
}
