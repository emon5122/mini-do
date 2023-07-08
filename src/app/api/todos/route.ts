import { prisma } from "@/lib/db";
import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { z } from "zod";
import { getServerSession } from "next-auth";
import type { NextApiRequest } from "next";
import { authOptions } from "../auth/[...nextauth]/route";
import { todos } from "@/schema/todo";

export const GET = async (req: NextRequest, res: NextApiRequest) => {
    const token: any = await getToken({ req });
    if (!token) {
        return NextResponse.json({ status: 401, message: "Unauthorized" });
    }
    try {
        const data = await prisma.todo.findMany({
            where: {
                userId: token.id,
            },
        });
        const validatedData = todos.parse(data)
        return NextResponse.json(validatedData)
    } catch (err) {
        throw new Error(err as string);
    } finally {
        prisma.$disconnect();
    }
};

export const POST = async (req: NextRequest) => {
    const token: any = await getToken({ req });
    if (!token) {
        return NextResponse.json({ status: 401, message: "Unauthorized" });
    }
    const { title } = await req.json();
    const validatedTitle = z.string().min(5).parse(title);

    try {
        return await prisma.todo.create({
            data: { title: validatedTitle, userId: token.id },
        });
    } catch (err) {
        throw new Error(err as string);
    } finally {
        prisma.$disconnect();
    }
};
