import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";



//api to fetch single billboard
export async function GET(
    req: Request,
    { params }: { params: {  billboardId:string } }
) {
    try {

        if (!params.billboardId) {
            return new NextResponse("Store id is required", { status: 400 });
        }


        const store = await prismadb.billboard.findUnique({
            where: {

                id: params.billboardId,
            },
        });

        return NextResponse.json(store);
    } catch (error) {
        console.log("[STORE_DELETE]", error);
        return new NextResponse("internal error", { status: 500 });
    }
}
//api to update the Billboard  name
export async function PATCH(
    req: Request,
    { params }: { params: { storeId: string, billboardId:string } }
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("user not authenticated", { status: 401 });
        }
        const body = await req.json();
        const { label, imageUrl } = body;

        if (!label) {
            return new NextResponse("Name is required", { status: 401 });
        }

        if (!imageUrl) {
            return new NextResponse("Name is required", { status: 401 });
        }


        if (!params.billboardId) {
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
        const store = await prismadb.billboard.updateMany({
            where: {

                id: params.billboardId,
            },
            data: {
                label, imageUlr,
            },
        });

        return NextResponse.json(store);
    } catch (error) {
        console.log("[STORE_PATCH]", error);
        return new NextResponse("internal error", { status: 500 });
    }
}

//api to delete the store
export async function DELETE(
    req: Request,
    { params }: { params: { storeId: string, billboardId:string } }
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("user not authenticated", { status: 401 });
        }

        if (!params.billboardId) {
            return new NextResponse("Store id is required", { status: 400 });
        }

        //this checks if the user is unauthorized
        const storeByUserId = await prismadb.billboard.findFirst({
            where:{
                id:params.billboardId
            }
        })
        if(!storeByUserId){
            return new NextResponse("unauthorized", { status: 403 });
        }
        const store = await prismadb.billboard.deleteMany({
            where: {

                id: params.billboardId,
            },
        });

        return NextResponse.json(store);
    } catch (error) {
        console.log("[STORE_DELETE]", error);
        return new NextResponse("internal error", { status: 500 });
    }
}


