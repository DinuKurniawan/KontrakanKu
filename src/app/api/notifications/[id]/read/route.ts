import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { notificationRepository } from '@/repositories/notification.repository'

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  if (!id) {
    return NextResponse.json({ error: 'ID notifikasi wajib diisi' }, { status: 400 })
  }

  await notificationRepository.markAsRead(id, session.user.id)
  return NextResponse.json({ success: true })
}
