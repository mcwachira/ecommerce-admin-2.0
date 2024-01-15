"use client";

import {Product, Image, Category, Color, Size} from "@prisma/client";
import React, { useState } from "react";
import Heading from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox"
import { TrashIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import * as z from "zod";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    FormField,
    Form,
    FormItem,
    FormControl,
    FormLabel,
    FormMessage, FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import axios from "axios";
import { AlertModal } from "@/components/modals/alert-modal";

import ImageUpload from "@/components/ui/image-upload";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";


const formSchema = z.object({
  name: z.string().min(1),
  images: z.object({ url: z.string() }).array(),
  price: z.coerce.number().min(1),
  categoryId: z.string().min(1),
  colorId: z.string().min(1),
  sizeId: z.string().min(1),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional()
});

type ProductFormValues = z.infer<typeof formSchema>

interface ProductFormProps {
  initialData: Product & {
    images: Image[]
  } | null;
  categories: Category[];
  colors: Color[];
  sizes: Size[];
}


const ProductForm = ({ initialData, categories, sizes, colors }: ProductFormProps) => {
    console.log(colors)
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Edit Product" : "Create Product";
  const description = initialData ? "Edit Product" : "Add a new  Product";
  const toastMessage = initialData ? "Product Updated" : "Product Created";

  const action = initialData ? "save changes" : "Create";

    const router = useRouter();
    const params = useParams();



  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ?{
      ...initialData,
      price: parseFloat(String(initialData?.price)),
    } : {
      name: '',
      images: [],
      price: 0,
      categoryId: '',
      colorId: '',
      sizeId: '',
      isFeatured: false,
      isArchived: false,
    },
  });


  const onSubmit = async (data: ProductFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(`/api/${params.storeId}/products/${params.productId}`, data);
      } else {
        await axios.post(`/api/${params.storeId}/products`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/products`)
      toast.success(toastMessage);
    } catch (error: any) {
      toast.error(error.error);
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
      router.refresh();
      router.push(`/${params.storeId}/products`);
      toast.success("Product deleted successfully");
    } catch (error) {
        toast.error('Something went wrong.');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };
  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />

        {initialData && (
          <Button
            variant="destructive"
            size="icon"
            disabled={loading}
            onClick={() => setOpen(true)}
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        )}
      </div>

      <Separator />

      <Form {...form}>
          <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8  w-full"
          >
              <FormField
                  control={form.control}
                  name="images"
                  render={({field}) => (
                      <FormItem>
                          <FormLabel>Images</FormLabel>
                          <FormControl>
                              <ImageUpload
                                  value={field.value.map((image) => image.url)}
                                  disabled={loading}
                                  onChange={(url:string) => field.onChange([...field.value, {url}])}
                                  onRemove={(url:string) => field.onChange([...field.value.filter((current) => current.url != url)])}
                              />
                          </FormControl>
                          <FormMessage/>
                      </FormItem>
                  )}
              />

              <div className="md:grid md:grid-cols-3 gap-8">
                  <FormField
                      control={form.control}
                      name="name"
                      render={({field}) => (
                          <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                  <Input
                                      disabled={loading}
                                      placeholder="Product name"
                                      {...field}
                                  />
                              </FormControl>
                              <FormMessage/>
                          </FormItem>
                      )}
                  />

                  <FormField
                      control={form.control}
                      name="price"
                      render={({field}) => (
                          <FormItem>
                              <FormLabel>Price</FormLabel>
                              <FormControl>
                                  <Input
                                      type='number'
                                      disabled={loading}
                                      placeholder="0.99"
                                      {...field}
                                  />
                              </FormControl>
                              <FormMessage/>
                          </FormItem>
                      )}
                  />

                  <FormField
                      control={form.control}
                      name="categoryId"
                      render={({field}) => (
                          <FormItem>
                              <FormLabel>Category</FormLabel>
                              <Select disabled={loading} onValueChange={field.onChange} value={field.value}
                                      defaultValue={field.value}

                              >
                                  <FormControl>
                                      <SelectTrigger>
                                          <SelectValue defaultValue={field.value} placeholder='Select Category'/>


                                      </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                      {categories.map((category) => (
                                          <SelectItem value={category.id} key={category.id}>
                                              {category.name}
                                          </SelectItem>

                                      ))}
                                  </SelectContent>

                              </Select>
                              <FormMessage/>
                          </FormItem>
                      )}
                  />

                  <FormField
                      control={form.control}
                      name="sizeId"
                      render={({field}) => (
                          <FormItem>
                              <FormLabel>Size</FormLabel>
                              <Select disabled={loading} onValueChange={field.onChange} value={field.value}
                                      defaultValue={field.value}

                              >
                                  <FormControl>
                                      <SelectTrigger>
                                          <SelectValue defaultValue={field.value} placeholder='Select Size'/>


                                      </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                      {sizes.map((size) => (
                                          <SelectItem value={size.id} key={size.id}>
                                              {size.name}
                                          </SelectItem>

                                      ))}
                                  </SelectContent>

                              </Select>
                              <FormMessage/>
                          </FormItem>
                      )}
                  />


                  <FormField
                      control={form.control}
                      name="colorId"
                      render={({field}) => (
                          <FormItem>
                              <FormLabel>Color</FormLabel>
                              <Select disabled={loading} onValueChange={field.onChange} value={field.value}
                                      defaultValue={field.value}

                              >
                                  <FormControl>
                                      <SelectTrigger>
                                          <SelectValue defaultValue={field.value} placeholder='Select Color'/>


                                      </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                      {colors.map((color) => (
                                          <SelectItem value={color.id} key={color.id}>
                                              {color.name}
                                          </SelectItem>

                                      ))}
                                  </SelectContent>

                              </Select>
                              <FormMessage/>
                          </FormItem>
                      )}
                  />


                  <FormField
                      control={form.control}
                      name="isFeatured"
                      render={({field}) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                              <FormControl>
                                  <Checkbox
                                      checked={field.value}
                                      // @ts-ignore
                                      onCheckedChange={field.onChange}
                                  />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                  <FormLabel>
                                      Featured
                                  </FormLabel>
                                  <FormDescription>
                                      This product will appear on the home page
                                  </FormDescription>
                              </div>
                          </FormItem>
                      )}
                  />
                  <FormField
                      control={form.control}
                      name="isArchived"
                      render={({field}) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                              <FormControl>
                                  <Checkbox
                                      checked={field.value}
                                      // @ts-ignore
                                      onCheckedChange={field.onChange}
                                  />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                  <FormLabel>
                                      Archived
                                  </FormLabel>
                                  <FormDescription>
                                      This product will not appear anywhere in the store.
                                  </FormDescription>
                              </div>
                          </FormItem>
                      )}
                  />
              </div>


              <Button disabled={loading} className="ml-auto" type="submit">
                  {action}
              </Button>
          </form>
      </Form>
        <Separator/>
        {/* <ApiAlert
        title="NEXT_PUBLIC_API_URL"
        description={`${origin}/api/${params.storeId}`}
        variant="public"
      /> */}
    </>
  );
};

export default ProductForm;
