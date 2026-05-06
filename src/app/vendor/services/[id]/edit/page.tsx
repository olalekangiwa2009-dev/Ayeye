import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import EditServiceForm from "./EditServiceForm";

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();

  if (!session || session.user.role !== "VENDOR") redirect("/login");

  const profile = await prisma.vendorProfile.findUnique({ where: { userId: session.user.id } });
  const service = await prisma.service.findUnique({ where: { id } });

  if (!service || !profile || service.vendorProfileId !== profile.id) notFound();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit service</h1>
        <div className="bg-white rounded-2xl shadow-md p-8">
          <EditServiceForm
            id={service.id}
            initialTitle={service.title}
            initialDescription={service.description}
            initialPriceFrom={service.priceFrom}
            initialPriceTo={service.priceTo ?? undefined}
            initialImages={JSON.parse(service.images || "[]")}
          />
        </div>
      </div>
    </div>
  );
}
