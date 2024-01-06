import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";



//api to fetch single billboard
export async function GET(
    req: Request,
    { params }: { params: {  categoryId:string } }
) {
    try {

        if (!params.categoryId) {
            return new NextResponse("Store id is required", { status: 400 });
        }


        const store = await prismadb.category.findUnique({
            where: {

                id: params.categoryId,
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
    { params }: { params: { storeId: string, categoryId:string } }
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("user not authenticated", { status: 401 });
        }
        const body = await req.json();
        const { name, billboardId } = body;

        if (!name) {
            return new NextResponse("Name is required", { status: 401 });
        }

        if (!billboardId) {
            return new NextResponse("Billboard Id is required", { status: 401 });
        }


        if (!params.categoryId) {
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
        const store = await prismadb.category.updateMany({
            where: {

                id: params.categoryId,
            },
            data: {
                name, billboardId,
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
    { params }: { params: { storeId: string, categoryId:string } }
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("user not authenticated", { status: 401 });
        }

        if (!params.categoryId) {
            return new NextResponse("Store id is required", { status: 400 });
        }

        //this checks if the user is unauthorized
        const storeByUserId = await prismadb.category.findFirst({
            where:{
                id:params.categoryId
            }
        })
        if(!storeByUserId){
            return new NextResponse("unauthorized", { status: 403 });
        }
        const store = await prismadb.category.deleteMany({
            where: {

                id: params.categoryId,
            },
        });

        return NextResponse.json(store);
    } catch (error) {
        console.log("[STORE_DELETE]", error);
        return new NextResponse("internal error", { status: 500 });
    }
}


