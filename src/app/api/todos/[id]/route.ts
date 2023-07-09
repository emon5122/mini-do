import { prisma } from '@/lib/db'
import { todo } from '@/schema/todo';
import { ParamsType } from '@/types/api'
import { Todo } from '@/types/todo';
import { getToken } from 'next-auth/jwt';
import {  NextResponse, type NextRequest,  } from 'next/server'
import { z } from 'zod';

export const DELETE = async (req: NextRequest, { params }: ParamsType) => {
    const token:any = await getToken({ req });
    if (!token) {
        return NextResponse.json({message: "Unauthorized" },{status: 401});
    }
    try {
        const todoObject = await prisma.todo.findUnique({ where: { id: params.id } })
        if (!todoObject) {
            return NextResponse.json({
                message: 'Not a valid todo'
            },{status: 403, statusText:"Invalid todo"})
        }
        if (todoObject.userId !== token.id) {
            return NextResponse.json({
                message: 'Unauthorized'
            },{status: 401, statusText:"Unauthorized"})
        }
        const data =await prisma.todo.delete({ where: { id: params.id } })
        const validatedData = todo.parse(data)
        return NextResponse.json({
            validatedData
        },{status: 200, statusText:"Deleted"})
    }
     catch (error) {
        NextResponse.error()
    } finally {
        prisma.$disconnect()
}
}
export const PATCH = async (req: NextRequest, { params }: ParamsType) => {
    const token: any = await getToken({ req });
    if (!token) {
        return NextResponse.json({message: "Unauthorized" },{status: 401});
    }
    const body = await req.json()
    const validBody = z.object({
        title: z.string().min(5).optional(),
        completed: z.boolean().optional()
    }).parse(body)

    try {
        const todoObject = await prisma.todo.findUnique({ where: { id: params.id } })
        let data: Todo
        if (!todoObject) {
            return NextResponse.json({
                message: 'Not a valid todo'
            },{status: 403, statusText:"Invalid todo"})
        }
        if (todoObject.userId !== token.id) {
            return NextResponse.json({
                message: 'Unauthorized'
            },{status: 401, statusText:"Unauthorized"})
        }
        if (validBody.title && validBody.completed) {
            const res = await prisma.todo.update({
                where: { id: params.id },
                data: { title: validBody.title, completed: validBody.completed }
            })
            data = todo.parse(res)
        } 
        else if (validBody.title) {
            const res =await prisma.todo.update({
                where: { id: params.id },
                data: { title: validBody.title }
            })
            data = todo.parse(res)
        } else if (validBody.completed) {
            const res = await prisma.todo.update({
                where: { id: params.id },
                data: { completed: validBody.completed }
            })
            data = todo.parse(res)
        } else {
            return NextResponse.json({
                message: "You don't know what you want, how do you expect me to understand?"
            },{status: 422, statusText:"Unprocessable Entity"})
        }
        return NextResponse.json({
            data
        },{status: 200, statusText:"Updated"})
    }
     catch (error) {
        return NextResponse.error()
    } finally {
        prisma.$disconnect()
}
}