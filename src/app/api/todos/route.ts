import { prisma } from "@/lib/db";
import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { z } from "zod";
import type { NextApiRequest } from "next";
import { todo, todos } from "@/schema/todo";

export const GET = async (req: NextRequest, res: NextApiRequest) => {
    const token: any = await getToken({ req });
    if (!token) {
        return NextResponse.json({message: "Unauthorized" },{status: 401});
    }
    try {
        const data = await prisma.todo.findMany({
            where: {
                userId: token.id,
            },
        });
        const validatedData = todos.parse(data)
        return NextResponse.json(validatedData,{status: 200})
    } catch (err) {
        return NextResponse.error()
    } finally {
        prisma.$disconnect();
    }
};

export const POST = async (req: NextRequest) => {
    const token: any = await getToken({ req });
    if (!token) {
        return NextResponse.json({message: "Unauthorized" },{status: 401});
    }
    const { title } = await req.json();
    const validatedTitle = z.string().min(5).parse(title);

    try {
        const data = await prisma.todo.create({
            data: { title: validatedTitle, userId: token.id },
        });
        const validatedData = todo.parse(data);
        return NextResponse.json(validatedData,{status: 200})
    } catch (err) {
        return NextResponse.error()
    } finally {
        prisma.$disconnect();
    }
};
