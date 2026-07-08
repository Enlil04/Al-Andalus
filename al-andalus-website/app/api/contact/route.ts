import { getPayload } from 'payload';
import configPromise from '@/payload.config';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const payload = await getPayload({ config: configPromise });

    // Validate required fields
    if (!data.name || !data.email || !data.message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required.' },
        { status: 400 }
      );
    }

    // Create entry in ContactMessages collection
    const result = await payload.create({
      collection: "contact-messages",
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || '',
        subject: data.subject || 'New Contact Form Submission',
        message: data.message,
        isRead: false,
      },
    });

    return NextResponse.json({ success: true, result }, { status: 201 });
  } catch (error: any) {
    console.error('Contact Form Error:', error);
    return NextResponse.json(
      { error: 'An error occurred while submitting the form.' },
      { status: 500 }
    );
  }
}
