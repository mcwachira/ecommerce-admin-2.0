"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import  Heading  from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import  ApiList  from "@/components/ui/api-list";

import { columns, ColorColumn } from "./columns";


interface ColorsClientProps{
    data:ColorColumn[]
}

const ColorsClient = ({data}:ColorsClientProps) => {
    console.log(data)
  const params = useParams();
  const router = useRouter();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Colors(${data.length})`}
          description="Manage Colors for your store"
        />

        <Button
          onClick={() => router.push(`/${params.storeId}/colors/new`)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />
        <DataTable columns={columns} data={data} searchKey='name'/>

        <Heading title='Api' description='Api calls for Colors'/>
        <Separator/>
        <ApiList entityName='colors' entityIdName='colorId'/>

    </>
  );
};

export default ColorsClient;
