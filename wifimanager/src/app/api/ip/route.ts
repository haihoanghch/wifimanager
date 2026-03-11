import { NextRequest, NextResponse } from 'next/server'
import { d1Query, genId, validateIP } from '@/lib/db'

const isD1 = () => !!(process.env.CLOUDFLARE_ACCOUNT_ID && process.env.CLOUDFLARE_API_TOKEN && process.env.D1_DATABASE_ID)

export async function PUT(req: NextRequest) {
  try {
    const { device_id, ip_address, gateway, subnet_mask, dns_primary, dns_secondary } = await req.json()
    if (!device_id || !ip_address) return NextResponse.json({ success: false, error: 'device_id và ip_address bắt buộc' }, { status: 400 })
    if (!validateIP(ip_address)) return NextResponse.json({ success: false, error: 'Địa chỉ IP không hợp lệ' }, { status: 400 })
    if (!isD1()) return NextResponse.json({ success: true, _mock: true })

    const [dev] = await d1Query<any>('SELECT ip_address FROM devices WHERE id = ?', [device_id])
    if (!dev) return NextResponse.json({ success: false, error: 'Không tìm thấy thiết bị' }, { status: 404 })

    await d1Query(
      `UPDATE devices SET ip_address=?,gateway=?,subnet_mask=?,dns_primary=?,dns_secondary=?,updated_at=datetime('now') WHERE id=?`,
      [ip_address, gateway || null, subnet_mask || '255.255.255.0', dns_primary || '8.8.8.8', dns_secondary || '8.8.4.4', device_id]
    )
    if (dev.ip_address !== ip_address) {
      await d1Query(
        'INSERT INTO ip_changes (id,device_id,old_ip,new_ip) VALUES (?,?,?,?)',
        [genId('ip'), device_id, dev.ip_address, ip_address]
      )
    }
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    if (!isD1()) return NextResponse.json({ success: true, data: [], _mock: true })
    const { searchParams } = new URL(req.url)
    const device_id = searchParams.get('device_id')
    let sql = 'SELECT c.*, d.name as device_name FROM ip_changes c LEFT JOIN devices d ON c.device_id = d.id'
    const params: any[] = []
    if (device_id) { sql += ' WHERE c.device_id = ?'; params.push(device_id) }
    sql += ' ORDER BY c.changed_at DESC LIMIT 50'
    const data = await d1Query(sql, params)
    return NextResponse.json({ success: true, data })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 })
  }
}
