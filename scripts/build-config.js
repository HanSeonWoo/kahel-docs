import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as cheerio from 'cheerio';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOCS_DIR = path.join(__dirname, '../public/docs');
const OUTPUT_FILE = path.join(__dirname, '../public/config.json');

function scanDirectory(dir) {
  const categories = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const categoryPath = path.join(dir, entry.name);
      const category = {
        id: entry.name,
        name: entry.name.charAt(0).toUpperCase() + entry.name.slice(1),
        description: `${entry.name} 관련 문서 모음`,
        path: entry.name,
        documentCount: 0,
        documents: []
      };

      const files = fs.readdirSync(categoryPath);
      const htmlFiles = files.filter(f => f.endsWith('.html'));

      for (const file of htmlFiles) {
        const filePath = path.join(categoryPath, file);
        const htmlContent = fs.readFileSync(filePath, 'utf-8');
        const $ = cheerio.load(htmlContent);

        const doc = {
          id: path.basename(file, '.html'),
          title: $('title').text() || file,
          description: $('meta[name="description"]').attr('content') || '',
          date: $('meta[name="date"]').attr('content') || new Date().toISOString().split('T')[0],
          path: `${entry.name}/${file}`,
          category: entry.name
        };

        category.documents.push(doc);
        category.documentCount++;
      }

      categories.push(category);
    }
  }

  return categories;
}

function buildConfig() {
  console.log('📂 Scanning docs directory...');

  if (!fs.existsSync(DOCS_DIR)) {
    console.error('❌ public/docs/ directory not found');
    process.exit(1);
  }

  const categories = scanDirectory(DOCS_DIR);

  // 최근 문서 추출 (날짜 기준 정렬)
  const allDocs = categories.flatMap(cat => cat.documents);
  const recentDocuments = allDocs
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)
    .map(doc => ({
      id: doc.id,
      title: doc.title,
      category: doc.category,
      date: doc.date
    }));

  const config = {
    categories,
    recentDocuments,
    metadata: {
      totalDocuments: allDocs.length,
      totalCategories: categories.length,
      lastUpdated: new Date().toISOString()
    }
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(config, null, 2));
  console.log('✅ config.json generated successfully');
  console.log(`📊 ${config.metadata.totalDocuments} documents in ${config.metadata.totalCategories} categories`);
}

buildConfig();
