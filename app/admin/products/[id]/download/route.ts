import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import  fs  from "fs/promises";
import { notFound } from 'next/navigation';
import { json } from 'stream/consumers';

// export async function GET() {
//   return Response.json({ message: 'Hello World' })
// }

export async function GET(
  req: Request,
  {params}: {params: Promise<{ id: string }>}
) {
  const { id } = await params;
  const product = await db.product.findUnique({
    where: { id },
    select: { filePath: true, name: true },
  });
  if(!product) return notFound()
  const {size} = await fs.stat(product.filePath)
  const file = await fs.readFile(product.filePath);
  const extension = product.filePath.split(".").pop();


  // return Response.json({message: id})
  return new NextResponse(file, {
    headers: {
      "Content-Disposition": `attachment; filename="${product.name}.${extension}"`,
      "Content-Length": size.toString()
    }
  })
}
