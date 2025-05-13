import PageHeader from '@/app/admin/_components/PageHeader';
import { db } from '@/lib/db'
import React from 'react'
import ProductForm from '../../_components/ProductForm';

export default async function page({params}: {params: Promise<{id: string}>}) {
  const { id } = await params;
  const product = await db.product.findUnique({where: {id}})
  return (
    <>
      <PageHeader>Edit Product</PageHeader>
      <ProductForm product={product} />
    </>
  )
}
