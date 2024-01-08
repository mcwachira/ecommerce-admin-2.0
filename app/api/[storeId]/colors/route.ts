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

        const {name,value } = body;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!name) {
            return new NextResponse("name is required", { status: 400 });
        }


        if (!value) {
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
        const color = await prismadb.color.create({
            data: {
               name,
                value,
                storeId:params.storeId
            },
        });

        return NextResponse.json(color);
    } catch (error) {
        console.log("Colors" +
            "COLORS_POST", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}


//fetches all the billboards
export async function GET(req: Request, {params}:{params:{storeId:string}

}) {
    try {


        if (!params.storeId) {
            return new NextResponse("Store  Id  is required", { status: 400 });
        }


        const sizes = await prismadb.color.findMany({
         where:{
             storeId:params.storeId
         }
        });

        return NextResponse.json(sizes);
    } catch (error) {
        console.log("Colors_GET", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
