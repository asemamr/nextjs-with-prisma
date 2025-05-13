'use client';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import React, { useTransition } from 'react';
import { UpdateAvailabilityProduct } from '../../_actions/products';
import { useRouter } from 'next/navigation';

export default function ActiveToggleDropdownItem({
  id,
  isAvailableForPurchase,
}: {
  id: string;
  isAvailableForPurchase: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  return (
    <DropdownMenuItem
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          await UpdateAvailabilityProduct(id, !isAvailableForPurchase);
          router.refresh();
        })
      }
    >
      {isAvailableForPurchase ? 'DeActivate' : 'Activate'}
    </DropdownMenuItem>
  );
}
