import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { db } from '@/lib/db'
import { formatCurrency, formatNumber } from '@/lib/formatters'
import { waitForDebugger } from 'inspector'
import React from 'react'

function wait(duration: number) {
  return new Promise((resolve) => setTimeout(resolve, duration))
}
async function getSalesData() {
  const data = await db.order.aggregate({
    _sum: {
      pricePaidInCents: true
    },
    _count: true
  })
  await wait(2000);
  return {
    amount: data._sum.pricePaidInCents || 0,
    numberOfSales: data._count
  }
}

async function getUsersData() {
  const [userCount, orderData] = await Promise.all([
    db.user.count(),
    db.order.aggregate({
      _sum: { pricePaidInCents: true }
    })
  ])

  return {
    userCount,
    averageValuePerUser: userCount === 0 ? 0 : (orderData._sum.pricePaidInCents || 0) / userCount / 100
  }
}
async function getProductData() {
  const [activeProducts, inActiveProducts] = await Promise.all([
    db.product.count({ where: { isAvailableForPurchase: true } }),
    db.product.count({ where: { isAvailableForPurchase: false } })
  ])
  return {
    activeProducts,
    inActiveProducts
  }
}

export default async function page() {
  // const { amount, numberOfSales } = await getSalesData()
  const [sales, users, products] = await Promise.all([
    getSalesData(),
    getUsersData(),
    getProductData()
  ])
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
      <DashboardCard title='sales' subtitle={`${formatNumber(sales.numberOfSales)} Orders`} body={formatCurrency(sales.amount)} />
      <DashboardCard title='customers' subtitle={`${formatNumber(users.averageValuePerUser)} Average Value`} body={formatCurrency(users.userCount)} />
      <DashboardCard title='Active Products' subtitle={`${formatNumber(products.inActiveProducts)} Inactive`} body={formatNumber(products.activeProducts)} />
    </div>
  )
}

type DashboardCardProps = {
  title: string
  subtitle: string
  body: string
}


function DashboardCard({ title, subtitle, body }: DashboardCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{body}</p>
      </CardContent>
    </Card>
  )
}
