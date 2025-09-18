import type { Metadata, ResolvingMetadata } from 'next'
import ProductDetails from "@/components/product-details";

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = (await params).id

  const product = await fetch(`https://fakestoreapi.com/products/${id}`).then((res) =>
    res.json()
  )

  return {
    title: `BOD - ${product.title}`,
    description: product.description,
  }
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <ProductDetails id={id}/>
      </div>
    </div>
  )
}
