import { prisma } from "@/lib/db";
import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { z } from "zod";
import { todo, todos } from "@/schema/todo";

export const GET = async (req: NextRequest) => {
    const token: any = await getToken({ req });
    if (!token) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    try {
        const data = await prisma.todo.findMany({
            where: {
                userId: token.id,
            },
        });
        const validatedData = todos.parse(data);
        return NextResponse.json(validatedData, { status: 200 });
    } catch (err) {
        return NextResponse.error();
    } finally {
        await prisma.$disconnect();
    }
};

export const POST = async (req: NextRequest) => {
    const token: any = await getToken({ req });
    if (!token) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const json = await req.json();
    if (typeof json !== "object" || json === null || !("title" in json)) {
        return NextResponse.error();
    }
    const { title } = json;
    const validatedTitle = z.string().min(5).parse(title);

    try {
        const data = await prisma.todo.create({
            data: { title: validatedTitle, userId: token.id },
        });
        const validatedData = todo.parse(data);
        return NextResponse.json(validatedData, { status: 200 });
    } catch (err) {
        return NextResponse.error();
    } finally {
        await prisma.$disconnect();
    }
};
