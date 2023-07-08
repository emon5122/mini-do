import { z } from "zod";

export const environmentVariables = z.object({
    "DATABASE_URL": z.string(),
    "NODE_ENV": z.string(),
    "GOOGLE_CLIENT_ID": z.string(),
    "GOOGLE_CLIENT_SECRET": z.string(),
    "GITHUB_CLIENT_ID": z.string(),
    "GITHUB_CLIENT_SECRET": z.string(),
    "NEXTAUTH_SECRET": z.string(),
    "NEXTAUTH_URL": z.string().url(),
})