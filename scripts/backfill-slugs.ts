import { PrismaClient } from "@prisma/client";
import { slugify } from "../src/lib/slugify";

const prisma = new PrismaClient();

async function main() {
  const vendors = await prisma.vendorProfile.findMany({
    where: { slug: null },
    select: { id: true, businessName: true },
  });

  console.log(`Backfilling ${vendors.length} vendor(s)…`);

  for (const v of vendors) {
    const base = slugify(v.businessName);
    let slug = base;
    let n = 2;

    while (true) {
      const taken = await prisma.vendorProfile.findUnique({ where: { slug } });
      if (!taken) break;
      slug = `${base}-${n++}`;
    }

    await prisma.vendorProfile.update({ where: { id: v.id }, data: { slug } });
    console.log(`  ${v.businessName} → ${slug}`);
  }

  console.log("Done.");
}

main().finally(() => prisma.$disconnect());
