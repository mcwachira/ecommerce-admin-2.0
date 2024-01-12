"use client";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import {Separator} from "@/components/ui/separator"

import { Plus } from "lucide-react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React from "react";

import {ProductColumn, columns} from "@/app/(dashboard)/[storeId]/(routes)/products/components/columns";
import {DataTable} from "@/components/ui/data-table";
import ApiList from "@/components/ui/api-list";

interface ProductClientProps{
    data:ProductColumn[]
}

const ProductClient = ({data}:ProductClientProps) => {
    console.log(data)
  const params = useParams();
  const router = useRouter();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Product(${data.length})`}
          description="Manage Products fro your store"
        />

        <Button
          onClick={() => router.push(`/${params.storeId}/products/new`)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />
        <DataTable columns={columns} data={data} searchKey='name'/>

        <Heading title='Api' description='Api calls for Products'/>
        <Separator/>
        <ApiList entityName='Products' entityIdName='productId'/>

    </>
  );
};

export default ProductClient;
