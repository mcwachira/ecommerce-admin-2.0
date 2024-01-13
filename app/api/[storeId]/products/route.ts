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

        const {   name,
            price,
            categoryId,
            colorId,
            sizeId,
            isFeatured,
            isArchived,
            images,

        } = body;

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
        const product = await prismadb.product.create({
            data: {
                name,
                price,
                categoryId,
                colorId,
                sizeId,
                isFeatured,
                isArchived,
                storeId:params.storeId,
                images:{createMany:{
                    data:[
                        ...images.map((image:{url:string}) => image)
                    ]
                    }}
            },
        });

        return NextResponse.json(product);
    } catch (error) {
        console.log("Billboard_POST", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}


//fetches all the billboards
export async function GET(req: Request, {params}:{params:{storeId:string}

}) {
    try {

        const {searchParams}  =new URL(req.url)

        const categoryId = searchParams.get('categoryId') || undefined
        const colorId = searchParams.get('colorId') || undefined
        const sizeId = searchParams.get('sizeId') || undefined
        const isFeatured = searchParams.get('isFeatured')
        const isArchived = searchParams.get('isArchived')

        if (!params.storeId) {
            return new NextResponse("Store  Id  is required", { status: 400 });
        }


        const products = await prismadb.product.findMany({
         where:{
             storeId:params.storeId,
             categoryId,
             colorId,
             sizeId,
             isFeatured:isFeatured? true:false,
             isArchived:false

         },
            include:{
             images:true,
                category:true,
                color:true,
                size:true,
            },
            orderBy:{
             createdAt:'desc'
            }
        });

        return NextResponse.json(products);
    } catch (error) {
        console.log("Product_GET", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}