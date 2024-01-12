"use client";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import {Separator} from "@/components/ui/separator"

import { Plus } from "lucide-react";

import React from "react";
import {Order} from "@prisma/client";
import {OrderColumn, columns} from "@/app/(dashboard)/[storeId]/(routes)/orders/components/columns";
import {DataTable} from "@/components/ui/data-table";


interface OrderClientProps{
    data:OrderColumn[]
}

const OrderClient = ({data}:OrderClientProps) => {

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Order(${data.length})`}
          description="Manage Orders fro your store"
        />

        <Button
          onClick={() => router.push(`/${params.storeId}/orders/new`)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />
        <DataTable columns={columns} data={data} searchKey='products'/>



    </>
  );
};

export default OrderClient;
