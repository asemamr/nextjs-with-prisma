import { Button } from '@/components/ui/button'
import React from 'react'

export default function page() {
// / if (canceled) {
// /   console.log(
// /     'Order canceled -- continue to shop around and checkout when you’re ready.'
//   //   )
//   // }

  return (
    <form action="/api/checkout_sessions" method="POST">
      <section>
        <Button type="submit" role="link">
          Checkout
        </Button>
      </section>
    </form>
  )
}