import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    await prisma.patient.createMany({
        data: [
            { firstName: "María", lastName: "González", dob: new Date("1945-06-01") },
            { firstName: "Juan", lastName: "Pérez", dob: new Date("1950-09-12") }
        ]
    });
}

main()
    .catch(e => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());
