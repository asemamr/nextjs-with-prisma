import { ProductCard, ProductCardSkeleton } from '@/components/ProductCard'
import { Button } from '@/components/ui/button'
import { Product } from '@/generated/prisma'
import { cache } from '@/lib/cach'
import { db } from '@/lib/db'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React, { Suspense } from 'react'


export default function page() {
  const getMostPopularProducts = cache(async () =>  {
    return await db.product.findMany({ orderBy: { orders: { _count: "asc" } }, where: { isAvailableForPurchase: true }, take: 6 })
  }, ["/", "getMostPopularProducts"], {revalidate: 60 * 60 * 24})

  const getNewestProducts = cache(async () => {
    return await db.product.findMany({ where: { isAvailableForPurchase: true }, orderBy: { createdAt: "desc" }, take: 6 })
  }, ["/", "getNewestProducts"], {revalidate: 60* 60* 24})

  return (
    <main>
      <main className="space-y-12">
        <ProductGridSection
          title="Most Popular"
          productsFetcher={getMostPopularProducts}
        />
        <ProductGridSection title="Newest" productsFetcher={getNewestProducts} />
      </main>
    </main>
  )
}

type ProductGridSectionProps = {
  title: string
  productsFetcher: () => Promise<Product[]>
}

function ProductGridSection({
  productsFetcher,
  title,
}: ProductGridSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <h2 className="text-3xl font-bold">{title}</h2>
        <Button variant="outline" asChild>
          <Link href="/products" className="space-x-2">
            <span>View All</span>
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <Suspense
          fallback={
            <>
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
            </>
          }
        >
          <ProductSuspense productsFetcher={productsFetcher} />
        </Suspense>
      </div>
    </div>
  )
}


async function ProductSuspense({
  productsFetcher,
}: {
  productsFetcher: () => Promise<Product[]>
}) {
  return (await productsFetcher()).map(product => (
    <ProductCard key={product.id} {...product} />
  ))
}