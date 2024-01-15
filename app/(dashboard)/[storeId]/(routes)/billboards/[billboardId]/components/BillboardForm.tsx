"use client";

import { Billboard } from "@prisma/client";
import React, { useState } from "react";
import Heading from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import {Trash, TrashIcon} from "lucide-react";
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


interface BillboardFormProps {
  initialData: Billboard | null;
}

const formSchema = z.object({
  label: z.string().min(1),
  imageUrl: z.string().min(1),
});

type BillboardFormValues = z.infer<typeof formSchema>;

const BillboardForm = ({ initialData }: BillboardFormProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Edit Billboard" : "Create Billboard";
  const description = initialData ? "Edit Billboard" : "Add a new  Billboard";
  const toastMessage = initialData ? "Billboard Updated" : "Billboard Created";

  const action = initialData ? "save changes" : "Create";



  const form = useForm<BillboardFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      label: "",
      imageUrl: "",
    },
  });

  const router = useRouter();
  const params = useParams();

  console.log(params);
  const onSubmit = async (data: BillboardFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(`/api/${params.storeId}/billboards/${params.billboardId}`, data);
      } else {
        await axios.post(`/api/${params.storeId}/billboards`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/billboards`)
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
      await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`);
      router.refresh();
      router.push(`/${params.storeId}/billboards`);
      toast.success("Store deleted successfully");
    } catch (error) {
      toast.error(
        "Make sure you have removed all categories using this billboard  first"
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
                  disabled={loading}
                  variant="destructive"
                  size="sm"
                  onClick={() => setOpen(true)}
              >
                <Trash className="h-4 w-4" />
              </Button>
          )}
        </div>
        <Separator />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
            <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                    <FormItem>
                      <FormLabel>Background image</FormLabel>
                      <FormControl>
                        <ImageUpload
                            value={field.value ? [field.value] : []}
                            disabled={loading}
                            onChange={(url) => field.onChange(url)}
                            onRemove={() => field.onChange('')}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                )}
            />
            <div className="md:grid md:grid-cols-3 gap-8">
              <FormField
                  control={form.control}
                  name="label"
                  render={({ field }) => (
                      <FormItem>
                        <FormLabel>Label</FormLabel>
                        <FormControl>
                          <Input disabled={loading} placeholder="Billboard label" {...field} />
                        </FormControl>
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
      </>
  );
};

export default BillboardForm;
