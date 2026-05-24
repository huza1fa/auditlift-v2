const GET = async () => {
  const pages = [
    { url: "https://auditlift.app/", priority: "1.0", changefreq: "weekly" },
    { url: "https://auditlift.app/pricing", priority: "0.9", changefreq: "monthly" },
    { url: "https://auditlift.app/privacy", priority: "0.5", changefreq: "monthly" },
    { url: "https://auditlift.app/terms", priority: "0.5", changefreq: "monthly" }
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(
    (p) => `  <url>
    <loc>${p.url}</loc>
    <priority>${p.priority}</priority>
    <changefreq>${p.changefreq}</changefreq>
  </url>`
  ).join("\n")}
</urlset>`;
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "max-age=3600"
    }
  });
};
export {
  GET
};
