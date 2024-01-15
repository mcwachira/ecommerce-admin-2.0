"use client";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import {Separator} from "@/components/ui/separator"

import { Plus } from "lucide-react";

import React from "react";
import {Order} from "@prisma/client";
import {OrderColumn, columns} from "@/app/(dashboard)/[storeId]/(routes)/orders/components/columns";
import {DataTable} from "@/components/ui/data-table";
import {useRouter} from "next/navigation";


interface OrderClientProps{
    data:OrderColumn[]
}

const OrderClient = ({data}:OrderClientProps) => {

    const router = useRouter()

  return (
      <>
          <Heading title={`Orders (${data.length})`} description="Manage orders for your store" />
          <Separator />
          <DataTable searchKey="products" columns={columns} data={data} />
      </>
  );
};

export default OrderClient;
