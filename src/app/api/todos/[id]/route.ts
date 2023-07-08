import { prisma } from '@/lib/db'
import { ParamsType } from '@/types/api'
import { getToken } from 'next-auth/jwt';
import {  NextResponse, type NextRequest,  } from 'next/server'
import { z } from 'zod';

export const DELETE = async (req: NextRequest, { params }: ParamsType) => {
    const token:any = await getToken({ req });
    if (!token) {
        return NextResponse.json({ status: 401, message: "Unauthorized" });
    }
    try {
        const todoObject = await prisma.todo.findUnique({ where: { id: params.id } })
        if (!todoObject) {
            return NextResponse.json({
                status: 403,
                message: 'Not a valid todo'
            
            })
        }
        if (todoObject.userId !== token.id) {
            return NextResponse.json({
                status: 401,
                message: 'Unauthorized'
            
            })
        }
        await prisma.todo.delete({ where: { id: params.id } })
        return NextResponse.json({
            status: 200,
            message: 'Todo deleted successfully'
        
        })
    }
     catch (error) {
        throw new Error(error as string)
    } finally {
        prisma.$disconnect()
}
}
export const PATCH = async (req: NextRequest, { params }: ParamsType) => {
    const token: any = await getToken({ req });
    if (!token) {
        return NextResponse.json({ status: 401, message: "Unauthorized" });
    }
    const body = await req.json()
    const validBody = z.object({
        title: z.string().min(5).optional(),
        completed: z.boolean().optional()
    }).parse(body)

    try {
        const todoObject = await prisma.todo.findUnique({ where: { id: params.id } })
        if (!todoObject) {
            return NextResponse.json({
                status: 403,
                message: 'Not a valid todo'
            
            })
        }
        if (todoObject.userId !== token.id) {
            return NextResponse.json({
                status: 401,
                message: 'Unauthorized'
            
            })
        }
        if (validBody.title && validBody.completed) {
            await prisma.todo.update({
                where: { id: params.id },
                data: { title: validBody.title, completed: validBody.completed }
            })
        } 
        else if (validBody.title) {
            await prisma.todo.update({
                where: { id: params.id },
                data: { title: validBody.title }
            })
        } else if (validBody.completed) {
            await prisma.todo.update({
                where: { id: params.id },
                data: { completed: validBody.completed }
            })
        } else {
            return NextResponse.json({
                status: 422,
                message: "You don't know what you want, how do you expect me to understand?"
            
            })
        }
        return NextResponse.json({
            status: 200,
            message: 'Updated Successfully'
        
        })
    }
     catch (error) {
        throw new Error(error as string)
    } finally {
        prisma.$disconnect()
}
}

 