"use client"
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import React, { useTransition } from 'react'
import { deleteProduct } from '../../_actions/products';
import { useRouter } from 'next/navigation';

export default function DeleteDropdownItem({id, disabled}: {id: string, disabled: boolean}) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  return (
    <DropdownMenuItem disabled={isPending || disabled} onClick={() => startTransition(async () => {
      await deleteProduct(id);
      router.refresh()
    })}>
      delete
    </DropdownMenuItem>
  )
}
