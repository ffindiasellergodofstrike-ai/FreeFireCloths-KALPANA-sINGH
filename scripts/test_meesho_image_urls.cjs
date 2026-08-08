const fs = require('fs');
const path = require('path');
const https = require('https');

const meeshoPath = path.join(__dirname, '../src/data/meeshoData.ts');
const content = fs.readFileSync(meeshoPath, 'utf8');

const match = content.match(/export const meeshoProducts: Product\[\] = (\[[\s\S]*\]);/);
const meeshoProducts = JSON.parse(match[1]);

const urls = meeshoProducts.map(p => p.image);
console.log(`Total URLs: ${urls.length}`);

// Check unique URLs
const uniqueUrls = [...new Set(urls)];
console.log(`Unique URLs: ${uniqueUrls.length}`);

// Count by URL occurrence
const urlCounts = {};
urls.forEach(u => { urlCounts[u] = (urlCounts[u] || 0) + 1; });
console.log('Top repeated image URLs:');
console.log(Object.entries(urlCounts).sort((a,b) => b[1] - a[1]).slice(0, 10));

// Let's test HTTP status of unique URLs
async function testUrls() {
  console.log('\nTesting HTTP HEAD on unique URLs...');
  let okCount = 0;
  let failCount = 0;
  for (const url of uniqueUrls) {
    try {
      const res = await new Promise((resolve, reject) => {
        const req = https.request(url, { method: 'HEAD', timeout: 5000 }, (res) => resolve(res));
        req.on('error', reject);
        req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
        req.end();
      });
      if (res.statusCode >= 200 && res.statusCode < 400) {
        okCount++;
      } else {
        failCount++;
        console.log(`FAIL ${res.statusCode}: ${url}`);
      }
    } catch (err) {
      failCount++;
      console.log(`ERROR ${err.message}: ${url}`);
    }
  }
  console.log(`\nURL Check Result: OK: ${okCount}, FAIL: ${failCount}`);
}

testUrls();
