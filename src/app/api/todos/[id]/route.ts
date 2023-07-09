import { prisma } from "@/lib/db";
import { todo } from "@/schema/todo";
import { ParamsType } from "@/types/api";
import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

export const DELETE = async (req: NextRequest, { params }: ParamsType) => {
    const token: any = await getToken({ req });
    if (!token || !token?.sub) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    try {
        const todoObject = await prisma.todo.findUnique({
            where: { id: params.id },
        });
        if (!todoObject) {
            return NextResponse.json(
                {
                    message: "Not a valid todo",
                },
                { status: 403, statusText: "Invalid todo" }
            );
        }
        if (todoObject.userId !== token.sub) {
            return NextResponse.json(
                {
                    message: "Unauthorized",
                },
                { status: 401, statusText: "Unauthorized" }
            );
        }
        const data = await prisma.todo.delete({ where: { id: params.id } });
        const validatedData = todo.parse(data);
        return NextResponse.json(
            validatedData,
            { status: 200, statusText: "Deleted" }
        );
    } catch (error) {
        return NextResponse.error();
    } finally {
        await prisma.$disconnect();
    }
};
export const PATCH = async (req: NextRequest, { params }: ParamsType) => {
    const token: any = await getToken({ req });
    if (!token || !token?.sub) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const validBody = z
        .object({
            title: z.string().min(5).optional(),
            completed: z.boolean().optional(),
        })
        .parse(body);
    try {
        const todoObject = await prisma.todo.findUnique({
            where: { id: params.id },
        });
        if (!todoObject) {
            return NextResponse.json(
                {
                    message: "Not a valid todo",
                },
                { status: 403, statusText: "Invalid todo" }
            );
        }
        if (todoObject.userId !== token.sub) {
            return NextResponse.json(
                {
                    message: "Unauthorized",
                },
                { status: 401, statusText: "Unauthorized" }
            );
        }
        try {
            const data = await prisma.todo.update({where: {id: params.id}, data: validBody})
            const validatedData = todo.parse(data);
            return NextResponse.json(validatedData, {status: 200, statusText: "Updated"})
        } catch (error) {
            return NextResponse.error();
        } finally {
            await prisma.$disconnect();
        }
    } catch (error) {
        return NextResponse.error();
    } finally {
        await prisma.$disconnect();
    }
};
