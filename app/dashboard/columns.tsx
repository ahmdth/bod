import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ColumnDef } from "@tanstack/react-table"
import { EyeIcon, MoreHorizontal, PencilIcon, TrashIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"


export type Product = {
  id: number
  title: string
  price: number
  category: "Men's Clothing" | "Wemen's Clothing" | "Jewelery" | "Electronics",
  image: string
}

export function getColumns(onDelete: (product: Product) => void): ColumnDef<Product>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "image",
      header: "Image",
      cell: ({ row }) => <Image height={64} width={64} alt={row.getValue("image")} src={row.getValue("image")} className="size-16" />
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => <div className="lowercase">{row.getValue("title")}</div>,
    },
    {
      header: "Category",
      accessorKey: "category",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("category")}</div>
      ),
      enableSorting: false,
      meta: {
        filterVariant: "select"
      },
      filterFn: (row, id, filterValue) => {
        const rowValue = row.getValue(id)
        if (!filterValue || filterValue === "all") return true
        return String(rowValue).toLowerCase() === String(filterValue).toLowerCase()
      },
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => {
        const price = parseFloat(row.getValue("price"))
        // Format the amount as a dollar amount
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(price)
        return <div className="font-medium">{formatted}</div>
      },
      meta: {
        filterVariant: "range"
      }
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const product = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>
                <Link className="absolute inset-0" href={`/dashboard/products/${product.id}`} />
                <EyeIcon size={16} aria-hidden="true" />
                <span>View</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link className="absolute inset-0" href={`/dashboard/products/create?id=${product.id}`} />
                <PencilIcon size={16} aria-hidden="true" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onClick={() => onDelete(product)}
              >
                <TrashIcon size={16} aria-hidden="true" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]
}

