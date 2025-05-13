import { Loader2 } from 'lucide-react'
import React from 'react'

export default function loading() {
  return (
    <div className='flex justify-center'>
      <Loader2 className='size-12 animate-spin' />
    </div>
  )
}
