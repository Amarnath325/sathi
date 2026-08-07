import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const department = searchParams.get('department');
    const role = searchParams.get('role');
    const status = searchParams.get('status');

    // Mock response representing DB fetch
    const mockStaff = [
      {
        id: 'stf-001',
        employeeId: 'EMP-2026-001',
        fullName: 'Alexander Vance',
        email: 'alexander.vance@sathi.io',
        department: 'EXECUTIVE',
        designation: 'Chief Technology Officer',
        assignedRole: 'SUPER_ADMIN',
        shiftStatus: 'ON_DUTY',
        is2FAEnforced: true,
        mfaEnabled: true,
        status: 'ACTIVE',
      },
      {
        id: 'stf-002',
        employeeId: 'EMP-2026-002',
        fullName: 'Priya Sharma',
        email: 'priya.sharma@sathi.io',
        department: 'TRUST_AND_SAFETY',
        designation: 'Head of Emergency Dispatch',
        assignedRole: 'ADMIN',
        shiftStatus: 'ON_DUTY',
        is2FAEnforced: true,
        mfaEnabled: true,
        status: 'ACTIVE',
      },
    ];

    let filtered = mockStaff;
    if (department && department !== 'ALL') {
      filtered = filtered.filter((s) => s.department === department);
    }
    if (role && role !== 'ALL') {
      filtered = filtered.filter((s) => s.assignedRole === role);
    }
    if (status && status !== 'ALL') {
      filtered = filtered.filter((s) => s.status === status);
    }

    return NextResponse.json({
      success: true,
      totalCount: filtered.length,
      staff: filtered,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email, department, designation, assignedRole } = body;

    if (!fullName || !email || !department || !assignedRole) {
      return NextResponse.json(
        { success: false, error: 'Missing required staff fields: fullName, email, department, assignedRole' },
        { status: 400 }
      );
    }

    const empNum = Math.floor(100 + Math.random() * 900);
    const newStaff = {
      id: 'stf-' + Date.now(),
      employeeId: `EMP-2026-${empNum}`,
      fullName,
      email,
      department,
      designation: designation || 'Staff Member',
      assignedRole,
      shiftStatus: 'ON_DUTY',
      is2FAEnforced: true,
      mfaEnabled: false,
      status: 'ACTIVE',
      joinedDate: new Date().toISOString().split('T')[0],
    };

    return NextResponse.json(
      {
        success: true,
        message: 'Staff member account created and credentials dispatched',
        staff: newStaff,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
