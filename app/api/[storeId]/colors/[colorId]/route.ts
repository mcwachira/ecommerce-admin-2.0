import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";



//api to fetch single billboard
export async function GET(
    req: Request,
    { params }: { params: {  colorId:string } }
) {
    try {

        if (!params.colorId) {
            return new NextResponse("Store id is required", { status: 400 });
        }


        const color = await prismadb.color.findUnique({
            where: {

                id: params.colorId,
            },
        });

        return NextResponse.json(color);
    } catch (error) {
        console.log("[COLOR_DELETE]", error);
        return new NextResponse("internal error", { status: 500 });
    }
}
//api to update the Billboard  name
export async function PATCH(
    req: Request,
    { params }: { params: { storeId: string, colorId:string } }
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


        if (!params.colorId) {
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
        const color = await prismadb.color.updateMany({
            where: {

                id: params.colorId,
            },
            data: {
                name, value,
            },
        });

        return NextResponse.json(color);
    } catch (error) {
        console.log("[COLOR_PATCH]", error);
        return new NextResponse("internal error", { status: 500 });
    }
}

//api to delete the store
export async function DELETE(
    req: Request,
    { params }: { params: { storeId: string, colorId:string } }
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("user not authenticated", { status: 401 });
        }

        if (!params.colorId) {
            return new NextResponse("Store id is required", { status: 400 });
        }

        //this checks if the user is unauthorized
        const storeByUserId = await prismadb.color.findFirst({
            where:{
                id:params.colorId
            }
        })
        if(!storeByUserId){
            return new NextResponse("unauthorized", { status: 403 });
        }
        const color = await prismadb.color.deleteMany({
            where: {

                id: params.colorId,
            },
        });

        return NextResponse.json(color);
    } catch (error) {
        console.log("[COLOR_DELETE]", error);
        return new NextResponse("internal error", { status: 500 });
    }
}


