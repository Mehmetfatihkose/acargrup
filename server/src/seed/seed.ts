import { fileURLToPath } from 'node:url';
import db from '../db/connection.js';
import {
  seedProjects,
  seedProducts,
  seedMilestones,
  seedNews,
  seedCertificates,
  seedStats,
} from './seedData.js';

/**
 * Veritabanını gerçekçi Türkçe kurumsal verilerle doldurur.
 * force=true ise mevcut katalog tablolarını temizleyip yeniden yazar (form mesajlarını korur).
 */
export function runSeed(force = false): void {
  const existingCount = (
    db.prepare('SELECT COUNT(*) as count FROM projects').get() as { count: number }
  ).count;

  if (existingCount > 0 && !force) {
    return;
  }

  const seedTransaction = db.transaction(() => {
    db.prepare('DELETE FROM project_images').run();
    db.prepare('DELETE FROM projects').run();
    db.prepare('DELETE FROM products').run();
    db.prepare('DELETE FROM milestones').run();
    db.prepare('DELETE FROM news').run();
    db.prepare('DELETE FROM certificates').run();
    db.prepare('DELETE FROM stats').run();

    const insertProject = db.prepare(`
      INSERT INTO projects (
        title, slug, category, sector, location, year, client,
        description, cover_image, budget_range, duration
      ) VALUES (
        @title, @slug, @category, @sector, @location, @year, @client,
        @description, @cover_image, @budget_range, @duration
      )
    `);

    const insertProjectImage = db.prepare(`
      INSERT INTO project_images (project_id, image_url, caption, sort_order)
      VALUES (@project_id, @image_url, @caption, @sort_order)
    `);

    for (const project of seedProjects) {
      const info = insertProject.run({
        title: project.title,
        slug: project.slug,
        category: project.category,
        sector: project.sector,
        location: project.location,
        year: project.year,
        client: project.client,
        description: project.description,
        cover_image: project.cover_image,
        budget_range: project.budget_range,
        duration: project.duration,
      });

      const projectId = Number(info.lastInsertRowid);
      project.gallery.forEach((img, index) => {
        insertProjectImage.run({
          project_id: projectId,
          image_url: img.image_url,
          caption: img.caption,
          sort_order: index + 1,
        });
      });
    }

    const insertProduct = db.prepare(`
      INSERT INTO products (name, slug, category, description, specs_json, packaging, image)
      VALUES (@name, @slug, @category, @description, @specs_json, @packaging, @image)
    `);

    for (const product of seedProducts) {
      insertProduct.run({
        name: product.name,
        slug: product.slug,
        category: product.category,
        description: product.description,
        specs_json: JSON.stringify(product.specs),
        packaging: product.packaging,
        image: product.image,
      });
    }

    const insertMilestone = db.prepare(`
      INSERT INTO milestones (year, title, description)
      VALUES (@year, @title, @description)
    `);
    for (const milestone of seedMilestones) {
      insertMilestone.run(milestone);
    }

    const insertNews = db.prepare(`
      INSERT INTO news (title, slug, summary, content, image, published_at)
      VALUES (@title, @slug, @summary, @content, @image, @published_at)
    `);
    for (const item of seedNews) {
      insertNews.run(item);
    }

    const insertCertificate = db.prepare(`
      INSERT INTO certificates (name, image, description)
      VALUES (@name, @image, @description)
    `);
    for (const cert of seedCertificates) {
      insertCertificate.run(cert);
    }

    const insertStat = db.prepare(`
      INSERT INTO stats (label, value, suffix, sort_order)
      VALUES (@label, @value, @suffix, @sort_order)
    `);
    for (const stat of seedStats) {
      insertStat.run(stat);
    }
  });

  seedTransaction();
  console.log(
    `[Acar Grup Seed] Başarıyla tamamlandı: ${seedProjects.length} proje, ${seedProducts.length} ürün, ${seedMilestones.length} dönüm noktası, ${seedNews.length} haber, ${seedCertificates.length} sertifika, ${seedStats.length} istatistik.`
  );
}

// Doğrudan CLI üzerinden çalıştırıldığında (npm run seed)
const isDirectExecution =
  process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];

if (isDirectExecution) {
  runSeed(true);
}

