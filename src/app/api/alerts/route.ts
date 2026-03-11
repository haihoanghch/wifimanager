import { NextRequest, NextResponse } from 'next/server'
import { d1Query, genId, MOCK_ALERTS } from '@/lib/db'

const isD1 = () => !!(process.env.CLOUDFLARE_ACCOUNT_ID && process.env.CLOUDFLARE_API_TOKEN && process.env.D1_DATABASE_ID)

export async function GET(req: NextRequest) {
  try {
    if (!isD1()) return NextResponse.json({ success: true, data: MOCK_ALERTS, _mock: true })
    const { searchParams } = new URL(req.url)
    const unread = searchParams.get('unread')
    let sql = 'SELECT a.*, d.name as device_name FROM alerts a LEFT JOIN devices d ON a.device_id = d.id'
    const params: any[] = []
    if (unread === '1') { sql += ' WHERE a.is_read = 0' }
    sql += ' ORDER BY a.created_at DESC LIMIT 100'
    const data = await d1Query(sql, params)
    return NextResponse.json({ success: true, data })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, is_read } = await req.json()
    if (!isD1()) return NextResponse.json({ success: true, _mock: true })
    if (id) {
      await d1Query('UPDATE alerts SET is_read = ? WHERE id = ?', [is_read ? 1 : 0, id])
    } else {
      await d1Query('UPDATE alerts SET is_read = 1', [])
    }
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!isD1()) return NextResponse.json({ success: true, _mock: true })
    if (id) {
      await d1Query('DELETE FROM alerts WHERE id = ?', [id])
    } else {
      await d1Query('DELETE FROM alerts WHERE is_read = 1', [])
    }
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { device_id, type, message, severity } = await req.json()
    if (!isD1()) return NextResponse.json({ success: true, _mock: true })
    await d1Query(
      'INSERT INTO alerts (id,device_id,type,message,severity) VALUES (?,?,?,?,?)',
      [genId('alr'), device_id || null, type, message, severity || 'info']
    )
    return NextResponse.json({ success: true }, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 })
  }
}
