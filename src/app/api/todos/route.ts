import { prisma } from "@/lib/db"
import { type NextRequest } from 'next/server'
import { getToken } from "next-auth/jwt"
import { z } from "zod"

export const GET = async(req: NextRequest) => {
    const token: any = await getToken({ req });
    try {
        return prisma.todo.findMany({
            where: {
                userId: token.id
            }
})
    } catch (err) {
throw new Error(err as string)        
    } finally {
        prisma.$disconnect()
    }
}

export const POST = async (req: NextRequest) => { 
    const token:any = await getToken({ req });
    const {title} = await req.json()
    const validatedTitle = z.string().min(5).parse(title)
    
    try {
        return await prisma.todo.create({
            data:
                { title: validatedTitle, userId: token.id }
        })
    } catch (err) {
throw new Error(err as string)        
    } finally {
        prisma.$disconnect()
    }
}