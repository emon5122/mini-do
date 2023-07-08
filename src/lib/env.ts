import { environmentVariables } from "@/schema/env";

export const envVariables = environmentVariables.parse(process.env)