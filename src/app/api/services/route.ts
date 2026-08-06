import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_CATEGORIES } from '@/lib/initialCategories';


// GET /api/services — public endpoint returning flattened list of all services across categories
export async function GET(_req: NextRequest) {
  const allServices = INITIAL_CATEGORIES.flatMap(cat =>
    cat.subcategories.map(sub => ({
      serviceId: sub.id,
      serviceName: sub.name,
      serviceDescription: sub.description,
      basePrice: sub.basePrice,
      requiredVerification: sub.requiredVerification,
      categoryId: cat.id,
      categoryName: cat.name,
      riskLevel: cat.riskLevel,
      baseRateMultiplier: cat.baseRateMultiplier
    }))
  );

  return NextResponse.json({
    success: true,
    total: allServices.length,
    data: allServices
  });
}
