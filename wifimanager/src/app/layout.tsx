import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'WiFi Manager — Quản Lý Mạng',
  description: 'Hệ thống quản lý thiết bị WiFi tập trung. Dashboard · Cấu hình · Giám sát.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className="scanlines">{children}</body>
    </html>
  )
}
