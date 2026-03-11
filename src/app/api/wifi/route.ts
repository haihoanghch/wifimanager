import { NextRequest, NextResponse } from 'next/server'
import { d1Query, genId } from '@/lib/db'

const isD1 = () => !!(process.env.CLOUDFLARE_ACCOUNT_ID && process.env.CLOUDFLARE_API_TOKEN && process.env.D1_DATABASE_ID)

export async function PUT(req: NextRequest) {
  try {
    const { device_id, ssid, password, band, channel, security, hidden_ssid } = await req.json()
    if (!device_id) return NextResponse.json({ success: false, error: 'device_id required' }, { status: 400 })
    if (!isD1()) return NextResponse.json({ success: true, _mock: true })

    const [dev] = await d1Query('SELECT wifi_ssid FROM devices WHERE id = ?', [device_id])
    if (!dev) return NextResponse.json({ success: false, error: 'Device not found' }, { status: 404 })

    await d1Query(
      `UPDATE devices SET wifi_ssid=?,wifi_password=?,wifi_band=?,channel=?,security=?,hidden_ssid=?,updated_at=datetime('now') WHERE id=?`,
      [ssid, password, band, channel, security, hidden_ssid ? 1 : 0, device_id]
    )

    if (dev.wifi_ssid !== ssid) {
      await d1Query(
        'INSERT INTO wifi_history (id,device_id,old_ssid,new_ssid) VALUES (?,?,?,?)',
        [genId('wh'), device_id, dev.wifi_ssid, ssid]
      )
    }
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const device_id = searchParams.get('device_id')
    if (!device_id) return NextResponse.json({ success: false, error: 'device_id required' }, { status: 400 })
    if (!isD1()) return NextResponse.json({ success: true, data: [], _mock: true })
    const data = await d1Query('SELECT * FROM wifi_history WHERE device_id = ? ORDER BY changed_at DESC LIMIT 20', [device_id])
    return NextResponse.json({ success: true, data })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 })
  }
}
