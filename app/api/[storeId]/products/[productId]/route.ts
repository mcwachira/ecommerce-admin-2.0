import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";



//api to fetch single product
export async function GET(
    req: Request,
    { params }: { params: {  productId:string } }
) {
    try {

        if (!params.productId) {
            return new NextResponse("Store id is required", { status: 400 });
        }


        const store = await prismadb.product.findUnique({
            where: {

                id: params.productId,
            },
            include:{
                images:true,
                category:true,
                size:true,
                color:true,
            }
        });

        return NextResponse.json(store);
    } catch (error) {
        console.log("[PRODUCT_GET]", error);
        return new NextResponse("internal error", { status: 500 });
    }
}
//api to update the Billboard  name
export async function PATCH(
    req: Request,
    { params }: { params: { storeId: string, productId:string } }
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("user not authenticated", { status: 401 });
        }
        const body = await req.json();
        const { name, price, categoryId, images, colorId, sizeId, isFeatured, isArchived } = body;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }
        if (!images || !images.length) {
            return new NextResponse("Name is required", { status: 400 });
        }

        if (!price) {
            return new NextResponse("Price is required", { status: 400 });
        }
        if (!categoryId) {
            return new NextResponse("Category Id is required", { status: 400 });
        }
        if (!colorId) {
            return new NextResponse(" Color Id is required", { status: 400 });
        }

        if (!sizeId) {
            return new NextResponse("Size id is required", { status: 400 });
        }


        if (!params.productId) {
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
        await prismadb.product.update({
            where: {
                id: params.productId
            },
            data: {
                name,
                price,
                categoryId,
                colorId,
                sizeId,
                images: {
                    deleteMany: {},
                },
                isFeatured,
                isArchived,
            },
        });

        const product  = await prismadb.product.update({
            where:{
                id:params.productId
            },
            data:{
                images:{
                    createMany:{
                        data:[
                            ...images.map((image:{url:string}) => image)
                        ]
                    }
                }
            }
        })

        return NextResponse.json(product);
    } catch (error) {
        // console.log("[PRODUCT_PATCH]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

//api to delete the store
export async function DELETE(
    req: Request,
    { params }: { params: { storeId: string, productId:string } }
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("user not authenticated", { status: 401 });
        }

        if (!params.productId) {
            return new NextResponse("Store id is required", { status: 400 });
        }

        //this checks if the user is unauthorized
        const storeByUserId = await prismadb.product.findFirst({
            where:{
                id:params.productId
            }
        })
        if(!storeByUserId){
            return new NextResponse("unauthorized", { status: 403 });
        }
        const product = await prismadb.product.deleteMany({
            where: {

                id: params.productId,
            },
        });

        return NextResponse.json(product);
    } catch (error) {
        console.log("[PRODUCT_DELETE]", error);
        return new NextResponse("internal error", { status: 500 });
    }
}


