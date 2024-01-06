'use client'
import {CategoryColumn} from './colums';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {Edit, MoreHorizontal, Trash, Copy} from "lucide-react";
import toast from "react-hot-toast";
import {useRouter, useParams} from "next/navigation";
import axios from "axios";
import {useState} from "react";

interface CellActionProps{
    data:CategoryColumn;
}
export const CellAction = ({data}:CategoryColumn) => {

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const params = useParams()
    const router = useRouter()
    const onCopy = (id:string) => {
        navigator.clipboard.writeText(id);
        toast.success("Api route has been copied to the clipboard");
    };

    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/categories/${data.id}`);
            router.refresh();
            router.push("/");
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
<div>

    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant='ghost'  className='h-8 w-8 p-0'>

                {/*sr-only screen readers only*/}
                <span className='sr-only'>Open Menu</span>
                <MoreHorizontal className='h-4 w-4'/>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
            <DropdownMenuLabel>
                Actions
            </DropdownMenuLabel>

            <DropdownMenuItem onClick={() => onCopy(data.id)}>
                <Copy className='mr-2 h-4 w-4'/>
                Copy Id
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => router.push(`/${params.storeId}/categories/${data.id}`)}>
                <Edit className='mr-2 h-4 w-4' />
               Update            </DropdownMenuItem>

            <DropdownMenuItem onClick={()=> onDelete()}>
                <Trash className='mr-2 h-4 w-4'/>
                Delete
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
</div>
    )

}