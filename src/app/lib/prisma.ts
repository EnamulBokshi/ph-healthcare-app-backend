import "dotenv/config"
import {PrismaPg} from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client";
const connectionString = process.env.DATABASE_URL || "postgresql://postgres:password@localhost:5432/healthcare?schema=public";

const adapter = new PrismaPg({
connectionString,
})

const prisma = new PrismaClient({adapter});

export default prisma;