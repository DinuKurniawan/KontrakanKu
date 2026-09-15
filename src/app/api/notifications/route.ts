import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { notificationRepository } from '@/repositories/notification.repository'

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const [notifications, unreadCount] = await Promise.all([
    notificationRepository.findByUserId(session.user.id, 20),
    notificationRepository.countUnread(session.user.id),
  ])

  return NextResponse.json({ notifications, unreadCount })
}
