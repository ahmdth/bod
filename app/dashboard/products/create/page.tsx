"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import React from "react"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useFileUpload } from "@/hooks/use-file-upload"
import { AlertCircleIcon, ImageIcon, UploadIcon, XIcon } from "lucide-react"
import { useSearchParams } from "next/navigation"

const FormSchema = z.object({
  title: z
    .string({
      required_error: "Product title required.",
    }),
  description: z
    .string({
      required_error: "Product description required.",
    }),
  price: z.number().min(1, "Price must be at least 1"),
  category: z.string().min(1, "Please select a category"),
  image: z.string().min(1, "Please upload an image"),
})

export default function Page() {
  const searchParams = useSearchParams()
  const id = searchParams.get("id")

  const queryClient = useQueryClient()
  
  const maxSizeMB = 2
  const maxSize = maxSizeMB * 1024 * 1024 // 2MB default

  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      getInputProps,
    },
  ] = useFileUpload({
    accept: "image/svg+xml,image/png,image/jpeg,image/jpg,image/gif",
    maxSize,
  })
  const previewUrl = files[0]?.preview || null
  // Mutation for creating a product

  const createProductMutation = useMutation({
    mutationFn: async (data: z.infer<typeof FormSchema>) => {
      const res = await fetch("https://fakestoreapi.com/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error("Failed to create product")
      return res.json()
    },
    onSuccess: () => {
      toast.success("Product created successfully!")
      queryClient.invalidateQueries({ queryKey: ["products"] })
    },
    onError: (error: any) => {
      toast.error("Error creating product", { description: error.message })
    },
  })

  const updateProductMutation = useMutation({
    mutationFn: async (data: z.infer<typeof FormSchema> & { id: number }) => {
      const res = await fetch(`https://fakestoreapi.com/products/${data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error("Failed to update product")
      return res.json()
    },
    onSuccess: () => {
      toast("Product updated successfully!")
      queryClient.invalidateQueries({ queryKey: ["products"] })
    },
    onError: (error: any) => {
      toast("Error updating product", { description: error.message })
    },
  })
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      category: "",
      image: "",
    },
  })

  React.useEffect(() => {
    if (files[0]?.preview) {
      form.setValue("image", files[0].preview)
    } else {
      form.setValue("image", "")
    }
  }, [files, form])

  React.useEffect(() => {
    if (id) {
      fetch(`https://fakestoreapi.com/products/${id}`)
        .then(res => res.json())
        .then(product => {
          form.reset({
            title: product.title || "",
            description: product.description || "",
            price: Number(product.price) || 0,
            category: product.category || "",
            image: product.image || "",
          })
        })
    }
  }, [id, form])

  function onSubmit(data: z.infer<typeof FormSchema>) {
    if (id) {
      updateProductMutation.mutate({ ...data, id: Number(id) })
    } else {
      createProductMutation.mutate(data)
    }
  }

  return (
    <div className="p-8 space-y-6">
      <h4 className="text-xl font-bold">
        {id ? "Update Product" : "Create Product"}
      </h4>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-gray-700">Title</FormLabel>
                <FormControl>
                  <Input
                    id="title"
                    type="text"
                    placeholder="Product title"
                    aria-label="product title"
                    {...field}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-gray-700">Description</FormLabel>
                <FormControl>
                  <Textarea
                    id="description"
                    placeholder="Product description"
                    aria-label="product description"
                    {...field}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 resize-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-gray-700">Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Men's Clothing">Men's Clothing</SelectItem>
                      <SelectItem value="Women's Clothing">Women's Clothing</SelectItem>
                      <SelectItem value="Jewelery">Jewelery</SelectItem>
                      <SelectItem value="Electronics">Electronics</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-gray-700">Price</FormLabel>
                  <FormControl>
                    <Input
                      id="price"
                      type="number"
                      min={1}
                      step={1}
                      placeholder="Product price"
                      aria-label="product price"
                      {...field}
                      value={field.value}
                      onChange={e => field.onChange(e.target.valueAsNumber)}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="image"
            render={() => (
              <FormItem>
                <FormLabel className="font-semibold text-gray-700">Image</FormLabel>
                <FormControl>
                  <div className="flex flex-col gap-2">
                    <div className="relative">
                      {/* Drop area */}
                      <div
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        data-dragging={isDragging || undefined}
                        className="border-input data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 relative flex min-h-52 flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors has-[input:focus]:ring-[3px]"
                      >
                        <input
                          {...getInputProps()}
                          className="sr-only"
                          aria-label="Upload image file"
                        />
                        {previewUrl ? (
                          <div className="absolute inset-0 flex items-center justify-center p-4">
                            <img
                              src={previewUrl}
                              alt={files[0]?.file?.name || "Uploaded image"}
                              className="mx-auto max-h-full rounded object-contain"
                            />
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
                            <div
                              className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
                              aria-hidden="true"
                            >
                              <ImageIcon className="size-4 opacity-60" />
                            </div>
                            <p className="mb-1.5 text-sm font-medium">Drop your image here</p>
                            <p className="text-muted-foreground text-xs">
                              SVG, PNG, JPG or GIF (max. {maxSizeMB}MB)
                            </p>
                            <Button
                              variant="outline"
                              className="mt-4"
                              onClick={openFileDialog}
                            >
                              <UploadIcon
                                className="-ms-1 size-4 opacity-60"
                                aria-hidden="true"
                              />
                              Select image
                            </Button>
                          </div>
                        )}
                      </div>

                      {previewUrl && (
                        <div className="absolute top-4 right-4">
                          <button
                            type="button"
                            className="focus-visible:border-ring focus-visible:ring-ring/50 z-50 flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-[color,box-shadow] outline-none hover:bg-black/80 focus-visible:ring-[3px]"
                            onClick={() => removeFile(files[0]?.id)}
                            aria-label="Remove image"
                          >
                            <XIcon className="size-4" aria-hidden="true" />
                          </button>
                        </div>
                      )}
                    </div>

                    {errors.length > 0 && (
                      <div
                        className="text-destructive flex items-center gap-1 text-xs"
                        role="alert"
                      >
                        <AlertCircleIcon className="size-3 shrink-0" />
                        <span>{errors[0]}</span>
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="py-3 mt-2 shadow"
          >
            {id ? "Update" : "Create"}
          </Button>
        </form>
      </Form>
    </div>
  )
}
