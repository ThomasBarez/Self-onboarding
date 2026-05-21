import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, sheetName, fieldKey, fieldValue, fieldType } = body;

    if (!sessionId || !sheetName || !fieldKey) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Convert fieldType to uppercase to match Prisma enum
    const normalizedFieldType = (fieldType || 'text').toUpperCase();

    const field = await prisma.formField.upsert({
      where: {
        sessionId_sheetName_fieldKey: {
          sessionId,
          sheetName,
          fieldKey,
        },
      },
      update: {
        fieldValue: fieldValue || '',
        fieldType: normalizedFieldType as any,
        completed: !!fieldValue,
        updatedAt: new Date(),
      },
      create: {
        sessionId,
        sheetName,
        fieldKey,
        fieldValue: fieldValue || '',
        fieldType: normalizedFieldType as any,
        completed: !!fieldValue,
      },
    });

    return NextResponse.json({ success: true, field });
  } catch (error) {
    console.error('Autosave error:', error);
    return NextResponse.json(
      { error: 'Failed to save field' },
      { status: 500 }
    );
  }
}
