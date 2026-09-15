import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { notificationRepository } from '@/repositories/notification.repository'

export async function POST() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await notificationRepository.markAllAsRead(session.user.id)
  return NextResponse.json({ success: true })
}
