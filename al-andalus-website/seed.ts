import { getPayload } from 'payload';
import configPromise from './payload.config';
import fs from 'fs';
import path from 'path';

const seed = async () => {
  const payload = await getPayload({ config: configPromise });

  payload.logger.info('Seeding database...');

  // Ensure we have some media to use
  const publicDir = path.join(__dirname, 'public');
  
  // Dummy media creation (if needed)
  let heroMedia;
  let motorMedia;
  let healthMedia;

  try {
    heroMedia = await payload.create({
      collection: 'media',
      data: { alt: 'Hero Background' },
      filePath: path.join(publicDir, 'hero-bg.png'),
    });
    motorMedia = await payload.create({
      collection: 'media',
      data: { alt: 'Motor Insurance' },
      filePath: path.join(publicDir, 'motor-insurance.png'),
    });
    healthMedia = await payload.create({
      collection: 'media',
      data: { alt: 'Health Insurance' },
      filePath: path.join(publicDir, 'health-insurance.png'),
    });
  } catch (error) {
    payload.logger.info('Could not seed media, skipping or files missing.');
  }

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
      mediaId: motorMedia?.id
    },
    { 
      name: "Health Insurance", 
      nameAr: "التأمين الصحي", 
      icon: "❤️", 
      status: "active", 
      isFeatured: true,
      desc: "Comprehensive healthcare coverage for medical treatment, hospitalization, surgeries, diagnostics, and related healthcare expenses for individuals and groups.",
      mediaId: healthMedia?.id
    },
    { name: "Loan Protection", nameAr: "تأمين القروض", icon: "💳", status: "under-development", isFeatured: false },
    { name: "Travel Insurance", nameAr: "تأمين السفر", icon: "✈️", status: "active", isFeatured: false },
    { name: "Medical Malpractice", nameAr: "تأمين الأخطاء الطبية", icon: "⚕️", status: "active", isFeatured: false },
    { name: "Hull Insurance", nameAr: "تأمين بدن السفن", icon: "⚓", status: "active", isFeatured: false },
    { name: "Cyber Insurance", nameAr: "تأمين الأمن السيبراني", icon: "🔐", status: "under-development", isFeatured: false },
  ];

  for (const [index, p] of products.entries()) {
    await payload.create({
      collection: 'products',
      data: {
        title: p.name,
        slug: p.name.toLowerCase().replace(/ /g, '-'),
        shortDescription: p.desc || 'Comprehensive insurance protection.',
        thumbnail: p.mediaId,
        isFeatured: p.isFeatured,
        status: p.status as 'active' | 'under-development',
        order: index + 1,
      },
    });
  }

  payload.logger.info('Products seeded successfully.');
  
  process.exit(0);
};

seed();
