import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function exportToPDF(elementId: string, filename: string = 'portfolio.pdf') {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Element not found');
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(filename);
  } catch (error) {
    console.error('PDF export error:', error);
    throw error;
  }
}

// PDF Export API Route
// app/api/export-cv/route.ts
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoDb';
import SiteSettings from '@/models/SiteSettings';
import Skill from '@/models/Skill';
import Experience from '@/models/Experience';
import Project from '@/models/Project';

export async function GET() {
  try {
    await connectDB();

    const [siteData, skills, experiences, projects] = await Promise.all([
      SiteSettings.findOne(),
      Skill.find().sort({ order: 1 }),
      Experience.find().sort({ order: 1 }),
      Project.find({ featured: true }).sort({ order: 1 }).limit(5)
    ]);

    // Generate HTML for PDF
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
    h1 { color: #06b6d4; border-bottom: 3px solid #06b6d4; padding-bottom: 10px; }
    h2 { color: #0891b2; margin-top: 30px; }
    .section { margin-bottom: 30px; }
    .experience, .project { margin-bottom: 20px; padding: 15px; background: #f0f9ff; border-left: 4px solid #06b6d4; }
    .skills { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
    .skill { background: #f0f9ff; padding: 10px; border-radius: 5px; text-align: center; }
    .contact { display: flex; gap: 20px; flex-wrap: wrap; }
    .contact-item { display: flex; align-items: center; gap: 5px; }
  </style>
</head>
<body>
  <h1>${siteData.name}</h1>
  <p style="font-size: 1.2em; color: #06b6d4;">${siteData.title}</p>
  <p>${siteData.description}</p>
  
  <div class="contact">
    ${siteData.email ? `<div class="contact-item">📧 ${siteData.email}</div>` : ''}
    ${siteData.phone ? `<div class="contact-item">📱 ${siteData.phone}</div>` : ''}
    ${siteData.github ? `<div class="contact-item">🔗 ${siteData.github}</div>` : ''}
  </div>

  <div class="section">
    <h2>Yetenekler</h2>
    <div class="skills">
      ${skills.map(s => `<div class="skill"><strong>${s.name}</strong><br>${s.level}%</div>`).join('')}
    </div>
  </div>

  <div class="section">
    <h2>Deneyimler</h2>
    ${experiences.map(e => `
      <div class="experience">
        <h3>${e.title}</h3>
        <p><strong>${e.company}</strong> | ${e.startDate} - ${e.current ? 'Devam ediyor' : e.endDate}</p>
        <p>${e.description}</p>
        ${e.technologies?.length ? `<p><em>Teknolojiler: ${e.technologies.join(', ')}</em></p>` : ''}
      </div>
    `).join('')}
  </div>

  <div class="section">
    <h2>Öne Çıkan Projeler</h2>
    ${projects.map(p => `
      <div class="project">
        <h3>${p.title}</h3>
        <p>${p.description}</p>
        <p><em>Teknolojiler: ${p.technologies.join(', ')}</em></p>
      </div>
    `).join('')}
  </div>
</body>
</html>
    `;

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': 'attachment; filename="cv.html"'
      }
    });
  } catch (error) {
    return NextResponse.json(
      { message: 'CV oluşturulamadı' },
      { status: 500 }
    );
  }
}