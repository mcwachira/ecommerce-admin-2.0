"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import  Heading  from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import  ApiList  from "@/components/ui/api-list";

import { columns, SizeColumn } from "./columns";


interface SizesClientProps{
    data:SizeColumn[]
}

const SizesClient = ({data}:SizesClientProps) => {
    console.log(data)
  const params = useParams();
  const router = useRouter();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Size(${data.length})`}
          description="Manage Sizes for your store"
        />

        <Button
          onClick={() => router.push(`/${params.storeId}/sizes/new`)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />
        <DataTable columns={columns} data={data} searchKey='name'/>

        <Heading title='Api' description='Api calls for Sizes'/>
        <Separator/>
        <ApiList entityName='Sizes' entityIdName='sizeId'/>

    </>
  );
};

export default SizesClient;
