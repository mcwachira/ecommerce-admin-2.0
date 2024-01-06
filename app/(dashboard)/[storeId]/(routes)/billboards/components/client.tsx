"use client";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Separator } from "@radix-ui/react-separator";
import { Plus } from "lucide-react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React from "react";
import {Billboard} from "@prisma/client";
import {BillboardColumn, columns} from "@/app/(dashboard)/[storeId]/(routes)/billboards/components/colums";
import {DataTable} from "@/components/ui/data-table";

interface BillboardClientProps{
    data:BillboardColumn[]
}

const BillBoardClient = ({data}:BillboardClientProps) => {
    console.log(data)
  const params = useParams();
  const router = useRouter();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Billboard(${data.length})`}
          description="Manage Billboards fro your store"
        />

        <Button
          onClick={() => router.push(`/${params.storeId}/billboards/new`)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />
        <DataTable columns={columns} data={data} searchKey='label'/>
    </>
  );
};

export default BillBoardClient;
