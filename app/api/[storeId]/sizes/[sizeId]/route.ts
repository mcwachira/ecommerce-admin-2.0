import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";



//api to fetch single billboard
export async function GET(
    req: Request,
    { params }: { params: {  sizeId:string } }
) {
    try {

        if (!params.sizeId) {
            return new NextResponse("Store id is required", { status: 400 });
        }


        const store = await prismadb.size.findUnique({
            where: {

                id: params.sizeId,
            },
        });

        return NextResponse.json(store);
    } catch (error) {
        console.log("[SIZE_DELETE]", error);
        return new NextResponse("internal error", { status: 500 });
    }
}
//api to update the Billboard  name
export async function PATCH(
    req: Request,
    { params }: { params: { storeId: string, sizeId:string } }
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("user not authenticated", { status: 401 });
        }
        const body = await req.json();
        const { name, value } = body;

        if (!name) {
            return new NextResponse("Name is required", { status: 401 });
        }

        if (!value) {
            return new NextResponse("Value is required", { status: 401 });
        }


        if (!params.sizeId) {
            return new NextResponse("Store id is required", { status: 400 });
        }


        //this checks if the user is unauthorized
        const storeByUserId = await prismadb.store.findFirst({
            where:{
                id:params.storeId,
                userId
            }
        })
        if(!storeByUserId){
            return new NextResponse("unauthorized", { status: 403 });
        }
        const store = await prismadb.size.updateMany({
            where: {

                id: params.sizeId,
            },
            data: {
                name, value,
            },
        });

        return NextResponse.json(store);
    } catch (error) {
        console.log("[SIZE_PATCH]", error);
        return new NextResponse("internal error", { status: 500 });
    }
}

//api to delete the store
export async function DELETE(
    req: Request,
    { params }: { params: { storeId: string, sizeId:string } }
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("user not authenticated", { status: 401 });
        }

        if (!params.sizeId) {
            return new NextResponse("Store id is required", { status: 400 });
        }

        //this checks if the user is unauthorized
        const storeByUserId = await prismadb.size.findFirst({
            where:{
                id:params.sizeId
            }
        })
        if(!storeByUserId){
            return new NextResponse("unauthorized", { status: 403 });
        }
        const store = await prismadb.size.deleteMany({
            where: {

                id: params.sizeId,
            },
        });

        return NextResponse.json(store);
    } catch (error) {
        console.log("[SIZE_DELETE]", error);
        return new NextResponse("internal error", { status: 500 });
    }
}


