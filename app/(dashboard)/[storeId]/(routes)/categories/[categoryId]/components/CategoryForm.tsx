"use client";

import {Billboard, Category} from "@prisma/client";
import React, { useState } from "react";
import Heading from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import axios from "axios";
import { AlertModal } from "@/components/modals/alert-modal";

import ImageUpload from "@/components/ui/image-upload";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";


interface   CategoriesFormProps {
  initialData:  Category | null;
  billboards:Billboard[]
}

const formSchema = z.object({
 name: z.string().min(1),
  billboardId: z.string().min(1),
});

type  CategoriesFormValues = z.infer<typeof formSchema>;

const CategoryForm = ({ initialData, billboards }:  CategoriesFormProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Edit   categories" : "Create   categories";
  const description = initialData ? "Edit   categories" : "Add a new    categories";
  const toastMessage = initialData ? "  categories Updated" : " categories Created";

  const action = initialData ? "save changes" : "Create";



  const form = useForm< CategoriesFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
billboardId: "",
    },
  });

  const router = useRouter();
  const params = useParams();

  console.log(params);
  const onSubmit = async (data:   CategoriesFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(`/api/${params.storeId}/categories/${params.categoryId}`, data);
      } else {
        await axios.post(`/api/${params.storeId}/categories`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/categories`)
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
      await axios.delete(`/api/${params.storeId}/categories/${params.categoryId}`);
      router.refresh();
      router.push(`/${params.storeId}/categories`);
      toast.success("Store deleted successfully");
    } catch (error) {
      toast.error(
        "Make sure you have removed all products using this category  first"
      );
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


          <div className="grid grid-col-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder=" Category name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
                control={form.control}
                name="billboardId"
                render={({ field }) => (
                    <FormItem>
                      <FormLabel>BillBoard</FormLabel>
                      <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}

                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue defaultValue={field.value} placeholder='Select Billboard'/>


                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {billboards.map((billboard) => (
                          <SelectItem value={billboard.id} key={billboard.id}>
                            {billboard.label}
                          </SelectItem>

                          ))}
                        </SelectContent>

                      </Select>
                      <FormMessage />
                    </FormItem>
                )}
            />
          </div>

          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
      <Separator />
      {/* <ApiAlert
        title="NEXT_PUBLIC_API_URL"
        description={`${origin}/api/${params.storeId}`}
        variant="public"
      /> */}
    </>
  );
};

export default CategoryForm;
