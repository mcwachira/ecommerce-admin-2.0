"use client"

import { ColumnDef } from "@tanstack/react-table"
import {CellAction} from "@/app/(dashboard)/[storeId]/(routes)/categories/components/cell-action";
import {format} from "date-fns";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type CategoryColumn = {
    id: string
    name: string
    createdAt: string
    billboardLabel:string

}

export const columns: ColumnDef<CategoryColumn>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },

    {
        accessorKey: "billboard",
        header: "Billboard",
        cell:({row}) => <CellAction data={row.original.billboardLabel}/>
    },

    {
        accessorKey: "createdAt",
        header: "Date",
    },
    {
        id:"actions",
        cell:({row}) => <CellAction data={row.original}/>
    }

]
