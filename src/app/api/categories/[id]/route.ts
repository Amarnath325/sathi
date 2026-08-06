import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_CATEGORIES } from '@/lib/initialCategories';
import { ServiceCategory } from '@/lib/types';


let categoriesStore: ServiceCategory[] = [...INITIAL_CATEGORIES];

type Props = {
  params: Promise<{ id: string }>;
};

// GET /api/categories/[id]
export async function GET(_req: NextRequest, props: Props) {
  const { id } = await props.params;
  const category = categoriesStore.find(c => c.id === id || c.slug === id);
  if (!category) {
    return NextResponse.json({ error: 'Category not found.' }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: category });
}

// PATCH /api/categories/[id]
export async function PATCH(req: NextRequest, props: Props) {
  try {
    const { id } = await props.params;
    const updates = await req.json();
    const idx = categoriesStore.findIndex(c => c.id === id || c.slug === id);

    if (idx === -1) {
      return NextResponse.json({ error: 'Category not found.' }, { status: 404 });
    }

    categoriesStore[idx] = { ...categoriesStore[idx], ...updates };

    return NextResponse.json({
      success: true,
      message: 'Category updated successfully.',
      data: categoriesStore[idx]
    });
  } catch {
    return NextResponse.json({ error: 'Invalid JSON request body.' }, { status: 400 });
  }
}

// DELETE /api/categories/[id] — soft delete / toggle inactive
export async function DELETE(_req: NextRequest, props: Props) {
  const { id } = await props.params;
  const idx = categoriesStore.findIndex(c => c.id === id || c.slug === id);

  if (idx === -1) {
    return NextResponse.json({ error: 'Category not found.' }, { status: 404 });
  }

  categoriesStore[idx].isActive = false;

  return NextResponse.json({
    success: true,
    message: `Category ${categoriesStore[idx].name} has been deactivated.`
  });
}
