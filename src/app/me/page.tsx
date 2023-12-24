import React from 'react'
import { getServerAuthSession } from '@/server/auth'
import { redirect } from 'next/navigation'

async function Me() {
    const auth = await getServerAuthSession()

    if (!auth) {
        redirect('/')
    }

    redirect(`/@${auth.user.username}`)
  return (
    <div>Redirecting you...</div>
  )
}

export default Me