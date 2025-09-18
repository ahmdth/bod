"use client"
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

export default function ProductDetails({ id }: { id: string }) {
  const queryClient = useQueryClient();
  const { data: product } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const res = await fetch(`https://fakestoreapi.com/products/${id}`);
      return res.json();
    },
    enabled: !!id,
  })
  if (!product) {
    return <div>Loading...</div>
  }
  return (
    <>
      {/* Product Image Section */}
      <div className="space-y-4">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-card shadow-lg">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* Product Details Section */}
      <div className="space-y-6">
        {/* Category Badge */}
        <Badge variant="secondary" className="text-sm font-medium">
          {product.category}
        </Badge>

        {/* Product Title */}
        <h1 className="text-3xl font-bold text-foreground text-balance">{product.title}</h1>

        {/* Price */}
        <div className="flex items-center gap-4">
          <span className="text-4xl font-bold text-gray-700">${product.price}</span>
        </div>
        {/* Description */}
        <h3 className="text-lg font-semibold mb-3 text-foreground">Product Description</h3>
        <p className="text-muted-foreground leading-relaxed text-pretty">{product.description}</p>
      </div>
    </>
  )
}
