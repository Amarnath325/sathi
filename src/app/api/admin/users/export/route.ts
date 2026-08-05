import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'csv';

    const users = await prisma.user.findMany({
      take: 1000,
      orderBy: { createdAt: 'desc' },
      include: {
        profile: true
      }
    });

    if (format === 'xlsx') {
      let xmlTable = `<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"><Worksheet ss:Name="Users"><Table><Row>`;
      xmlTable += `<Cell><Data ss:Type="String">ID</Data></Cell>`;
      xmlTable += `<Cell><Data ss:Type="String">FullName</Data></Cell>`;
      xmlTable += `<Cell><Data ss:Type="String">Email</Data></Cell>`;
      xmlTable += `<Cell><Data ss:Type="String">Role</Data></Cell>`;
      xmlTable += `<Cell><Data ss:Type="String">City</Data></Cell>`;
      xmlTable += `</Row>`;

      users.forEach((u) => {
        xmlTable += `<Row>`;
        xmlTable += `<Cell><Data ss:Type="String">${u.id}</Data></Cell>`;
        xmlTable += `<Cell><Data ss:Type="String">${u.fullName}</Data></Cell>`;
        xmlTable += `<Cell><Data ss:Type="String">${u.email}</Data></Cell>`;
        xmlTable += `<Cell><Data ss:Type="String">${u.role}</Data></Cell>`;
        xmlTable += `<Cell><Data ss:Type="String">${u.profile?.city || 'N/A'}</Data></Cell>`;
        xmlTable += `</Row>`;
      });

      xmlTable += `</Table></Worksheet></Workbook>`;

      return new NextResponse(xmlTable, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename="users_export_${Date.now()}.xlsx"`
        }
      });
    }

    const headers = ['ID', 'FullName', 'Email', 'Role', 'City', 'CreatedAt'];
    const lines = [headers.join(',')];

    users.forEach((u) => {
      lines.push(`"${u.id}","${u.fullName}","${u.email}","${u.role}","${u.profile?.city || 'N/A'}","${u.createdAt.toISOString()}"`);
    });

    return new NextResponse(lines.join('\n'), {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="users_export_${Date.now()}.csv"`
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Export failed' },
      { status: 500 }
    );
  }
}
