import { NextRequest, NextResponse } from 'next/server'
import { d1Query, genId, MOCK_DEVICES } from '@/lib/db'

const isD1Configured = () => !!(
  process.env.CLOUDFLARE_ACCOUNT_ID &&
  process.env.CLOUDFLARE_API_TOKEN &&
  process.env.D1_DATABASE_ID
)

export async function GET(req: NextRequest) {
  try {
    if (!isD1Configured()) {
      return NextResponse.json({ success: true, data: MOCK_DEVICES, _mock: true })
    }
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const type   = searchParams.get('type')
    let sql = 'SELECT * FROM devices'
    const conds: string[] = [], params: any[] = []
    if (status) { conds.push('status = ?'); params.push(status) }
    if (type)   { conds.push('device_type = ?'); params.push(type) }
    if (conds.length) sql += ' WHERE ' + conds.join(' AND ')
    sql += ' ORDER BY created_at DESC'
    const data = await d1Query(sql, params)
    return NextResponse.json({ success: true, data })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, mac_address, ip_address, device_type, model, firmware, location, wifi_ssid, wifi_password, wifi_band, channel } = body
    if (!name || !mac_address) return NextResponse.json({ success: false, error: 'Thiếu name và mac_address' }, { status: 400 })

    if (!isD1Configured()) {
      return NextResponse.json({ success: true, data: { id: genId('dev'), name, mac_address }, _mock: true }, { status: 201 })
    }
    const id = genId('dev')
    await d1Query(
      `INSERT INTO devices (id,name,mac_address,ip_address,device_type,model,firmware,location,wifi_ssid,wifi_password,wifi_band,channel,status,last_seen)
       VALUES (?,?,?,?,?,?,?,?,?,?,'2.4GHz',6,'offline',datetime('now'))`,
      [id, name, mac_address, ip_address||null, device_type||'router', model||null, firmware||null, location||null, wifi_ssid||null, wifi_password||null]
    )
    return NextResponse.json({ success: true, data: { id, name, mac_address } }, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ success: false, error: 'Missing id' }, { status: 400 })
    if (!isD1Configured()) return NextResponse.json({ success: true, _mock: true })
    await d1Query('DELETE FROM devices WHERE id = ?', [id])
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 })
  }
}
