import { getPayload } from 'payload';
import configPromise from '@/payload.config';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const payload = await getPayload({ config: configPromise });

    // Seed Products
    const products = [
      { name: "Cargo Insurance", nameAr: "تأمين نقل البضائع", icon: "🚢", status: "active", isFeatured: false },
      { name: "Engineering Insurance", nameAr: "التأمين الهندسي", icon: "🏗️", status: "active", isFeatured: false },
      { name: "Glass Insurance", nameAr: "تأمين الألواح الزجاجية", icon: "🪟", status: "active", isFeatured: false },
      { name: "Burglary Insurance", nameAr: "تأمين السرقة", icon: "🔒", status: "active", isFeatured: false },
      { name: "Bankers Blanket", nameAr: "التأمين المصرفي الشامل", icon: "🏦", status: "under-development", isFeatured: false },
      { name: "Cash in Transit", nameAr: "تأمين نقل وحفظ النقد", icon: "💰", status: "active", isFeatured: false },
      { name: "Public Liability", nameAr: "تأمين المسؤولية المدنية", icon: "⚖️", status: "active", isFeatured: false },
      { name: "Fire Insurance", nameAr: "تأمين الحريق", icon: "🔥", status: "active", isFeatured: false },
      { name: "Fidelity Guarantee", nameAr: "تأمين ضمان الأمانة", icon: "🛡️", status: "active", isFeatured: false },
      { 
        name: "Motor Insurance", 
        nameAr: "تأمين السيارات", 
        icon: "🚗", 
        status: "active", 
        isFeatured: true,
        desc: "Comprehensive coverage for vehicles against accidents, damages, and legal liabilities. Protecting you and your vehicle on every road in Iraq.",
      },
      { 
        name: "Health Insurance", 
        nameAr: "التأمين الصحي", 
        icon: "❤️", 
        status: "active", 
        isFeatured: true,
        desc: "Comprehensive healthcare coverage for medical treatment, hospitalization, surgeries, diagnostics, and related healthcare expenses for individuals and groups.",
      },
      { name: "Loan Protection", nameAr: "تأمين القروض", icon: "💳", status: "under-development", isFeatured: false },
      { name: "Travel Insurance", nameAr: "تأمين السفر", icon: "✈️", status: "active", isFeatured: false },
      { name: "Medical Malpractice", nameAr: "تأمين الأخطاء الطبية", icon: "⚕️", status: "active", isFeatured: false },
      { name: "Hull Insurance", nameAr: "تأمين بدن السفن", icon: "⚓", status: "active", isFeatured: false },
      { name: "Cyber Insurance", nameAr: "تأمين الأمن السيبراني", icon: "🔐", status: "under-development", isFeatured: false },
    ];

    let count = 0;
    for (const [index, p] of products.entries()) {
      // Avoid creating duplicates if we run this multiple times
      const existing = await payload.find({
        collection: 'products',
        where: {
          slug: { equals: p.name.toLowerCase().replace(/ /g, '-') }
        }
      });
      
      if (existing.totalDocs === 0) {
        await payload.create({
          collection: 'products',
          data: {
            title: p.name,
            slug: p.name.toLowerCase().replace(/ /g, '-'),
            shortDescription: p.desc || 'Comprehensive insurance protection.',
            isFeatured: p.isFeatured,
            status: p.status as 'active' | 'under-development',
            order: index + 1,
          },
        });
        count++;
      }
    }

    // Seed Partners
    let partnersCount = 0;
    const fs = require('fs');
    const path = require('path');
    const partnersDir = 'c:\\\\Users\\\\omlsa\\\\Desktop\\\\Al-Andulas\\\\partners logos';
    
    if (fs.existsSync(partnersDir)) {
      const files = fs.readdirSync(partnersDir).filter((f: string) => f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.jpeg') || f.endsWith('.svg'));
      
      for (const [index, file] of files.entries()) {
        const existingPartner = await payload.find({
          collection: 'partners',
          where: { name: { equals: `Partner ${index + 1}` } }
        });
        
        if (existingPartner.totalDocs === 0) {
          const filePath = path.join(partnersDir, file);
          
          // 1. Create Media doc
          const mediaDoc = await payload.create({
            collection: 'media',
            data: { alt: `Partner ${index + 1} Logo` },
            filePath,
          });
          
          // 2. Create Partner doc
          await payload.create({
            collection: 'partners',
            data: {
              name: `Partner ${index + 1}`,
              logo: mediaDoc.id,
              order: index + 1,
            }
          });
          partnersCount++;
        }
      }
    }

    // Seed News
    let newsCount = 0;
    const dummyNews = [
      { title: "Al-Andalus Expands Insurance Network", category: "company", publishedDate: new Date().toISOString() },
      { title: "New Health Insurance Packages for 2027", category: "health", publishedDate: new Date(Date.now() - 86400000).toISOString() },
      { title: "Awarded Best Insurtech of the Year", category: "company", publishedDate: new Date(Date.now() - 86400000 * 5).toISOString() },
      { title: "Important Update on Motor Policies", category: "motor", publishedDate: new Date(Date.now() - 86400000 * 10).toISOString() },
      { title: "Navigating Travel Insurance in 2026", category: "travel", publishedDate: new Date(Date.now() - 86400000 * 15).toISOString() },
    ];

    for (const news of dummyNews) {
      const existing = await payload.find({
        collection: 'news',
        where: { slug: { equals: news.title.toLowerCase().replace(/ /g, '-') } }
      });
      
      if (existing.totalDocs === 0) {
        await payload.create({
          collection: 'news',
          data: {
            title: news.title,
            slug: news.title.toLowerCase().replace(/ /g, '-'),
            category: news.category as any,
            publishedDate: news.publishedDate,
            status: 'published',
            excerpt: "This is a placeholder excerpt for the news article to demonstrate the layout.",
          }
        });
        newsCount++;
      }
    }

    return NextResponse.json({ success: true, message: `Seeded ${count} products, ${partnersCount} partners, and ${newsCount} news articles.` });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
