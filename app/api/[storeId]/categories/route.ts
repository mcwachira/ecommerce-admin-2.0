import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";


//create a billboard
export async function POST(req: Request, {params}:{params:{storeId:string}

}) {
    try {
        //check if user is signed in
        const { userId } = auth();
        const body = await req.json();
        console.log(body);

        const {name,billboardId } = body;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!name) {
            return new NextResponse("name is required", { status: 400 });
        }


        if (!billboardId) {
            return new NextResponse("Billboard Id  is required", { status: 400 });
        }

        if (!params.storeId) {
            return new NextResponse("Store  Id  is required", { status: 400 });
        }

        const storeByUserId = await prismadb.store.findFirst({
            where:{
                id:params.storeId,
                userId
            }
        })
        if(!storeByUserId){
            return new NextResponse("unauthorized", { status: 403 });
        }
        const category = await prismadb.category.create({
            data: {
               name,
                billboardId,
                storeId:params.storeId
            },
        });

        return NextResponse.json(category);
    } catch (error) {
        console.log("Categories_POST", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}


//fetches all the categories
export async function GET(req: Request, {params}:{params:{storeId:string}

}) {
    try {


        if (!params.storeId) {
            return new NextResponse("Store  Id  is required", { status: 400 });
        }


        const categories = await prismadb.category.findMany({
         where:{
             storeId:params.storeId
         }
        });

        return NextResponse.json(categories);
    } catch (error) {
        console.log("Categories_GET", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
