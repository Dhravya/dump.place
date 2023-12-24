import React from 'react'

function Layout({children}: {children: React.ReactNode}) {
  return (
    <div className='p-4 md:p-8'>{children}</div>
  )
}

export default Layout