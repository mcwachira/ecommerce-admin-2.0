"use client";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import {Separator} from "@/components/ui/separator"

import { Plus } from "lucide-react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React from "react";
import {Billboard} from "@prisma/client";
import {CategoryColumn, columns} from "@/app/(dashboard)/[storeId]/(routes)/categories/components/colums";
import {DataTable} from "@/components/ui/data-table";
import ApiList from "@/components/ui/api-list";

interface CategoryClientProps{
    data:CategoryColumn[]
}

const CategoryClient = ({data}:CategoryClientProps) => {
    console.log(data)
  const params = useParams();
  const router = useRouter();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Category(${data.length})`}
          description="Manage Categories for your store"
        />

        <Button
          onClick={() => router.push(`/${params.storeId}/categories/new`)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />
        <DataTable columns={columns} data={data} searchKey='name'/>

        <Heading title='Api' description='Api calls for Categories'/>
        <Separator/>
        <ApiList entityName='Categories' entityIdName='categoryId'/>

    </>
  );
};

export default CategoryClient;
