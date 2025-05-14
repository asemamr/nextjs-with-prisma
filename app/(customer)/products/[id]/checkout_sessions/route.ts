import { NextResponse, userAgent } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe';
import { db } from '@/lib/db';
import { ProductCard } from '@/components/ProductCard';
import { notFound } from 'next/navigation';


export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const headersList = await headers()
    const origin = headersList.get('origin')
    const userProduct = await db.product.findUnique({ where: { id } })

    if (!userProduct) return notFound()
    const product = await stripe.products.create({
      name: userProduct.name,
    });

    // 2. Create price
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: userProduct.priceInCents, // $20.00
      currency: 'usd',
    });

    // Create Checkout Sessions from body params.
    
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (for example, price_1234) of the product you want to sell
          price: price.id,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?canceled=true`,
    });
  return NextResponse.redirect(session.url, 303)
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 }
    )
  }
  // return NextResponse.json({ message: id })
}