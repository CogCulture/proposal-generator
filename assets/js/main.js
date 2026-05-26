const selectedItems = {};
let SERVICE_ORDER = {
  'Branding': ['brand_ambassador', 'brand_manual', 'brand_digital_assets', 'brand_communication', 'packaging', 'video_production'],
  'Digital & Social': ['social_media', 'content_seo', 'SEO_GEO', 'social_listening', 'social_crm', 'analytics_business', 'analytics_reporting', 'google_analytics', 'influencer_marketing', 'performance_marketing', 'orm', 'media_buying', 'ecommerce'],
  'Website': ['website_process', 'website'],
  'Annexures': ['annexures'],
  'Others': []
};
const annexureOverrides = {};
const annexureTaskOverrides = {};
const annexureDetailOverrides = {};
const annexureNotesOverrides = {};
const annexureCatOverrides = {};
const annexureHeadingOverrides = {};
const CUSTOM_ANNEXURE_IDS = new Set();
const expandedBlocks = {};
const expandedServices = {};
const expandedAnnexureSections = {};
let annexureEnabled = true;
const disabledAnnexures = new Set();
const disabledAnnexureRows = new Set();
const disabledAnnexureSections = new Set();

const ANNEXURE_DATA = {
  A: {
    title: "Annexure A",
    subtitle: "Brand Ambassador (KA) — Integrated Plan",
    sections: [
      {
        name: "PR & Announcement", rows: [
          { id: 1, task: "Press Release ", detail: "Full PR copy + media distribution strategy", timing: "Pre-launch", notes: "Coordinate with PR agency for wire distribution" },
          { id: 2, task: "Media Kit", detail: "Brand story, bio, product facts, key visuals (print + digital)", timing: "Pre-launch", notes: "High-res assets for press" },
          { id: 3, task: "Celebrity Event / Launch Activation", detail: "Concept, collaterals, event AV, post-event content", timing: "Launch Day", notes: "Execution on actuals; 3D by event agency" },
        ]
      },
      {
        name: "TVC & Audio-Visual", rows: [
          { id: 4, task: "Hero TVC — 60 sec", detail: "Script, storyboard, production brief ", timing: "Pre-Season", notes: "Main film production on actuals" },
          { id: 5, task: "Cut-downs — 30 / 20 / 10 sec", detail: "Edit suite from hero TVC", timing: "Post TVC shoot", notes: "All 3 durations included" },
          { id: 6, task: "OTT Pre-roll — 4 Variants", detail: "Genre-triggered: Action / Comedy / Sports / Drama", timing: "Post TVC shoot", notes: "Platform trafficking on actuals" },
          { id: 7, task: "Radio Spot — 30 sec", detail: "VO script + music adaptation", timing: "Pre-Season", notes: "Up to 7 vernacular languages" },
        ]
      },
      {
        name: "Key Visual & Print", rows: [
          { id: 8, task: "Campaign KV — Master", detail: "Full product visual in brand language", timing: "Pre-Season", notes: "Ratios: 16:9, 9:16, 1:1, 4:5" },
          { id: 9, task: "Newspaper Full-Page Ad", detail: "Broadsheet ad with product hero shot", timing: "Campaign", notes: "—" },
          { id: 10, task: "OOH / Hoarding Design", detail: "Outdoor billboard — feature", timing: "Campaign", notes: "—" },
          { id: 11, task: "Trade Magazine Ad", detail: "B2B / trade press ", timing: "Campaign", notes: "—" },
        ]
      },
      {
        name: "Social Media & Digital", rows: [
          { id: 12, task: "Social Media Content", detail: "Reels, static, stories, carousels", timing: "Monthly", notes: "Shoot on actuals; 60%+ video mix" },
          { id: 13, task: "YouTube Long-form Content", detail: "Unboxing / review / brand story", timing: "Monthly", notes: "Production on actuals" },
          { id: 14, task: "Paid Social Creatives", detail: "Static / carousel / video — Meta, YT", timing: "Per campaign", notes: "Ratios per platform specs" },
          { id: 15, task: "Hashtag & UGC Campaign", detail: "concept + tracking", timing: "Per campaign", notes: "—" },
        ]
      },
      {
        name: "Influencer & Seeding", rows: [
          { id: 16, task: "Influencer Unboxing Programme", detail: "Brief, content review, approval & reporting", timing: "Per launch", notes: "Influencer fees on actuals" },
          { id: 17, task: "Micro / Nano Influencer Seeding", detail: "Secondary seeding plan around activity", timing: "Per campaign", notes: "Influencer fees on actuals" },
        ]
      },
      {
        name: "Retail & BTL", rows: [
          { id: 18, task: "In-Store Demo Zone", detail: "Demo zone design", timing: "Campaign", notes: "Fabrication on actuals" },
          { id: 19, task: "Standees & POSM ", detail: "standees + shelf materials", timing: "Campaign", notes: "Print on actuals" },
          { id: 20, task: "Dealer Kit", detail: "Channel partner kit + USPs", timing: "Campaign", notes: "—" },
        ]
      },
      {
        name: "Packaging", rows: [
          { id: 21, task: "Special Edition Box", detail: "Limited-edition LED box with KA imagery", timing: "On request", notes: "Separate production estimate" },
          { id: 22, task: "Unboxing Insert Card", detail: "Personalised insert with KA message", timing: "On request", notes: "—" },
        ]
      },
      {
        name: "Internal & Trade", rows: [
          { id: 23, task: "Sales Team Pitch Deck — KA", detail: "Internal deck showcasing KA campaign strategy", timing: "Pre-Season", notes: "—" },
          { id: 24, task: "Dealer / Trade Communication", detail: "KA announcement to channel partners", timing: "Pre-launch", notes: "—" },
        ]
      },
    ]
  },
  B1: {
    title: "Annexure B/1",
    subtitle: "Creative ATL Scope of Work ",
    sections: [
      {
        name: "Brand Level & Corporate Campaigns", rows: [
          { id: 1, cat: "Brand Campaign", task: "Corporate 360 campaign — concept, master KV, sub-master styles", freq: "Annual", notes: "OOH / Digital / POSM style; 2–3 sub-styles" },
          { id: 2, cat: "Brand Campaign", task: "Product category campaigns — concept + execution", freq: "Per launch", notes: "Brand track on actuals; third-party costs extra" },
          { id: 3, cat: "Brand Campaign", task: "Main campaign assets: KV, teasers, main film, radio, sustenance idea", freq: "360 approach", notes: "Main film production on actuals" },
          { id: 4, cat: "Brand Campaign", task: "Vernacular adaptation — main film & radio", freq: "Up to 7 languages", notes: "Per platform specs" },
        ]
      },
      {
        name: "Sales Promo Campaigns", rows: [
          { id: 5, cat: "Sales Promo", task: "Monthly sales promo — master + layouts", freq: "Monthly", notes: "—" },
          { id: 6, cat: "Sales Promo", task: "Season / festive campaign — POSM, digital, print", freq: "Per season", notes: "—" },
          { id: 7, cat: "Sales Promo", task: "Topical campaign (New Year, Valentine, etc.)", freq: "Monthly", notes: "—" },
        ]
      },
      {
        name: "TVC & Radio", rows: [
          { id: 8, cat: "TVC", task: "Hero TVC — 60 sec", freq: "Annual per category", notes: "Production on actuals" },
          { id: 9, cat: "TVC", task: "Cut-downs — 30 / 20 / 10 sec", freq: "Per hero film", notes: "Included" },
          { id: 10, cat: "TVC", task: "OTT pre-roll variants — 4 genre triggers", freq: "Per campaign", notes: "Action / Comedy / Sports / Drama" },
          { id: 11, cat: "Radio", task: "Radio spot — 30 sec", freq: "Per campaign", notes: "Up to 7 vernacular languages" },
        ]
      },
      {
        name: "Photography", rows: [
          { id: 12, cat: "Photography", task: "Hero campaign shoot", freq: "Per campaign", notes: "Charged on actuals" },
          { id: 13, cat: "Photography", task: "Lifestyle scenario shoot", freq: "As required", notes: "Charged on actuals" },
          { id: 14, cat: "Photography", task: "Product-only studio shoot", freq: "Per SKU", notes: "Charged on actuals" },
          { id: 15, cat: "Photography", task: "E-commerce white-background shoot", freq: "Per SKU", notes: "Charged on actuals" },
          { id: 16, cat: "Photography", task: "Behind-the-scenes content shoot", freq: "Per shoot", notes: "Repurposed for social" },
          { id: 17, cat: "Photography", task: "360° product shoot (36/72 frames)", freq: "Per online SKU", notes: "Charged on actuals" },
          { id: 18, cat: "Photography", task: "Product 3D modelling & renders", freq: "As required", notes: "Charged extra" },
        ]
      },
      {
        name: "Packaging", rows: [
          { id: 19, cat: "Packaging", task: "Master carton design", freq: "Per SKU", notes: "Print on actuals" },
          { id: 20, cat: "Packaging", task: "Inner box & flap messaging", freq: "Per SKU", notes: "—" },
          { id: 21, cat: "Packaging", task: "Remote control sleeve (LED)", freq: "Per SKU", notes: "LED category" },
          { id: 22, cat: "Packaging", task: "Manual cover design", freq: "Per SKU", notes: "Content by client" },
          { id: 23, cat: "Packaging", task: "Unboxing insert card", freq: "Per SKU", notes: "—" },
          { id: 24, cat: "Packaging", task: "QR code integration", freq: "Per SKU", notes: "URL by client" },
        ]
      },
    ]
  },
  B2: {
    title: "Annexure B/2",
    subtitle: "Creative ATL Scope of Work",
    sections: [
      {
        name: "POSM & Collaterals", rows: [
          { id: 25, cat: "POSM", task: "Poster — all categories with 3D mock-ups", freq: "Monthly", notes: "—" },
          { id: 26, cat: "POSM", task: "Sticker / shelf talker", freq: "Monthly", notes: "—" },
          { id: 27, cat: "POSM", task: "Dangler A4 (double-sided)", freq: "Monthly", notes: "—" },
          { id: 28, cat: "POSM", task: "Crowner / table tent cards / wobblers", freq: "Monthly", notes: "Sampling/proofs extra" },
          { id: 29, cat: "POSM", task: "Standee", freq: "Monthly", notes: "—" },
          { id: 30, cat: "POSM", task: "Product / counter display unit", freq: "Per requirement", notes: "—" },
          { id: 31, cat: "POSM", task: "Leaflet / multi-fold brochure", freq: "Quarterly", notes: "—" },
          { id: 32, cat: "POSM", task: "In-shop branding / hoarding (multi-ratio)", freq: "Per requirement", notes: "Ratios: 1:1, 1:2, 1:3, 1:4, 2:1, 3:1" },
          { id: 33, cat: "POSM", task: "Quarterly newsletter (40+ pages)", freq: "Quarterly", notes: "Content by client" },
          { id: 34, cat: "POSM", task: "Dealer partner greeting creatives", freq: "8–10 quarterly", notes: "Birthday, anniversary, special events" },
        ]
      },
      {
        name: "Print & Outdoor", rows: [
          { id: 35, cat: "Print / OOH", task: "Newspaper full-page ad", freq: "Per campaign", notes: "—" },
          { id: 36, cat: "Print / OOH", task: "OOH / hoarding design", freq: "Per campaign", notes: "—" },
          { id: 37, cat: "Print / OOH", task: "Cinema slide", freq: "Per campaign", notes: "—" },
          { id: 38, cat: "Print / OOH", task: "Trade magazine ad", freq: "Quarterly", notes: "—" },
        ]
      },
      {
        name: "Retail & BTL", rows: [
          { id: 39, cat: "Retail / BTL", task: "In-store demo zone design", freq: "Per requirement", notes: "Fabrication on actuals" },
          { id: 40, cat: "Retail / BTL", task: "Dealer kit", freq: "Quarterly", notes: "—" },
          { id: 41, cat: "Retail / BTL", task: "Road show / activation concept", freq: "Per activation", notes: "Execution on actuals" },
        ]
      },
      {
        name: "B2B — Trade & Channel", rows: [
          { id: 42, cat: "B2B", task: "Product leaflets", freq: "3–6 monthly", notes: "—" },
          { id: 43, cat: "B2B", task: "Product brochure (4 pages)", freq: "1 per 6 months", notes: "—" },
          { id: 44, cat: "B2B", task: "Poster A3", freq: "4 monthly", notes: "—" },
          { id: 45, cat: "B2B", task: "B2B standee", freq: "2 monthly", notes: "—" },
          { id: 46, cat: "B2B", task: "Stock AV — animation, script, music", freq: "1 monthly", notes: "Charged extra" },
          { id: 47, cat: "B2B", task: "Website banners", freq: "6 monthly", notes: "—" },
          { id: 48, cat: "B2B", task: "EDM (electronic direct mailer)", freq: "4 monthly", notes: "—" },
          { id: 49, cat: "B2B", task: "Wish posts", freq: "12 annually", notes: "—" },
        ]
      },
      {
        name: "PR, Influencer & Experiential", rows: [
          { id: 50, cat: "PR / Influencer", task: "Press release — ambassador signing & launches", freq: "Per event", notes: "—" },
          { id: 51, cat: "PR / Influencer", task: "Media kit design", freq: "Annual", notes: "—" },
          { id: 52, cat: "PR / Influencer", task: "Influencer unboxing programme", freq: "Per campaign", notes: "Influencer fees on actuals" },
          { id: 53, cat: "PR / Influencer", task: "Celebrity event / launch activation", freq: "Per event", notes: "Execution on actuals" },
          { id: 54, cat: "Experiential", task: "Event rendition, design, creative", freq: "Per event", notes: "3D by event agency" },
          { id: 55, cat: "Experiential", task: "Event AV", freq: "Per event", notes: "Execution on actuals" },
        ]
      },
      {
        name: "Internal & Value-Add", rows: [
          { id: 56, cat: "Internal", task: "Sales team pitch deck", freq: "Per season", notes: "—" },
          { id: 57, cat: "Internal", task: "Product catalogue", freq: "Bi-annual", notes: "—" },
          { id: 58, cat: "Internal", task: "Warranty card & after-sales comms", freq: "Per SKU", notes: "—" },
          { id: 59, cat: "Internal", task: "Competitor analysis", freq: "Quarterly", notes: "—" },
          { id: 60, cat: "Internal", task: "Copywriting — news / magazine articles", freq: "As required", notes: "—" },
          { id: 61, cat: "Internal", task: "Innovative brand/category ideas", freq: "Quarterly", notes: "—" },
          { id: 62, cat: "Internal", task: "Support on important presentations", freq: "As required", notes: "—" },
          { id: 63, cat: "Internal", task: "Award entries", freq: "As required", notes: "Charged extra" },
          { id: 64, cat: "Internal", task: "Collaboration / sponsorship ideas", freq: "Quarterly", notes: "—" },
          { id: 65, cat: "Internal", task: "Stock / image library subscription", freq: "Annual", notes: "Charged extra" },
        ]
      },
    ]
  },
  C: {
    title: "Annexure C",
    subtitle: "Digital Scope of Work | All Categories",
    sections: [
      {
        name: "Social Media — Content & Management", rows: [
          { id: 1, cat: "Social Media", task: "Static posts with copies", freq: "10-15 per month", notes: "All product categories" },
          { id: 2, cat: "Social Media", task: "Video / Reel / YT Shorts with copies", freq: "5-10 per month", notes: "Production-led video & shoot on actuals" },
          { id: 3, cat: "Social Media", task: "Story adaptations (engagement, offers, brand)", freq: "20–30 per month", notes: "—" },
          { id: 4, cat: "Social Media", task: "Content calendar — monthly", freq: "Monthly", notes: "Shared 7 days in advance" },
          { id: 5, cat: "Social Media", task: "Platform strategy (IG, YT, Twitter-X, FB)", freq: "Annual", notes: "—" },
          { id: 6, cat: "Social Media", task: "Reels series concept", freq: "Quarterly", notes: "—" },
          { id: 7, cat: "Social Media", task: "YouTube long-form series", freq: "Quarterly", notes: "Production on actuals" },
          { id: 8, cat: "Social Media", task: "Hashtag & UGC campaign", freq: "Per campaign", notes: "—" },
          { id: 9, cat: "Social Media", task: "Topical production-led content", freq: "1 per quarter", notes: "Production charged separately" },
          { id: 10, cat: "Social Media", task: "Handle health management", freq: "Ongoing", notes: "—" },
          { id: 11, cat: "Social Media", task: "Influencer seeding plan", freq: "Per campaign", notes: "Influencer fees on actuals" },
          { id: 12, cat: "Social Media", task: "Monthly + quarterly reports", freq: "Monthly / Quarterly", notes: "Reporting tool license by client" },
        ]
      },
      {
        name: "Media Campaign Creatives", rows: [
          { id: 13, cat: "Media Creative", task: "All media adaptations (Google, PMAX, YT, Meta)", freq: "1–2 campaigns/qtr", notes: "Adaptation from Intex team" },
          { id: 14, cat: "Media Creative", task: "Rich media banners", freq: "10 per campaign", notes: "—" },
          { id: 15, cat: "Media Creative", task: "Master banners (3) + 60 adaptations", freq: "3 masters + 60 adapts", notes: "—" },
          { id: 16, cat: "Media Creative", task: "Discovery Ads with video", freq: "3 adapts", notes: "—" },
          { id: 17, cat: "Media Creative", task: "Facebook carousels (3 masters)", freq: "3 masters", notes: "—" },
          { id: 18, cat: "Media Creative", task: "HTML banner + 20 adapts", freq: "1 master + 20 adapts", notes: "—" },
          { id: 19, cat: "Media Creative", task: "Text ad copies", freq: "As required", notes: "—" },
        ]
      },
      {
        name: "One-to-One / CRM Communication", rows: [
          { id: 20, cat: "CRM / One-to-One", task: "WhatsApp broadcast creatives", freq: "30–40 annually", notes: "Stock license by client" },
          { id: 21, cat: "CRM / One-to-One", task: "Email marketing templates", freq: "12–15 annually", notes: "—" },
          { id: 22, cat: "CRM / One-to-One", task: "Office internal creative", freq: "20–24 annually", notes: "—" },
          { id: 23, cat: "CRM / One-to-One", task: "SMS copies", freq: "As required", notes: "—" },
        ]
      },
      {
        name: "D2C & E-Commerce Content", rows: [
          { id: 24, cat: "D2C / E-com", task: "Product listing infographics", freq: "7–12 per SKU", notes: "—" },
          { id: 25, cat: "D2C / E-com", task: "A+ content basic (creative + text)", freq: "15 SKUs", notes: "—" },
          { id: 26, cat: "D2C / E-com", task: "A+ content premium", freq: "On request", notes: "Stock/AI license by client" },
          { id: 27, cat: "D2C / E-com", task: "Merchant center update — Google & Meta", freq: "All SKUs", notes: "—" },
          { id: 28, cat: "D2C / E-com", task: "Brand store tile creatives", freq: "12–15 tiles", notes: "—" },
          { id: 29, cat: "D2C / E-com", task: "Amazon / Flipkart banner creatives", freq: "Per campaign", notes: "—" },
          { id: 30, cat: "D2C / E-com", task: "e-Promoter video", freq: "2–4 per category", notes: "Production charged separately" },
          { id: 31, cat: "D2C / E-com", task: "SBV video assets (15 & 30 sec)", freq: "2–3 per category", notes: "Charged separately" },
          { id: 32, cat: "D2C / E-com", task: "360° product shoot frames", freq: "36 / 72 frames per SKU", notes: "Shoot on actuals" },
          { id: 33, cat: "D2C / E-com", task: "Display advertising banner assets", freq: "5 per campaign", notes: "—" },
        ]
      },
      {
        name: "Website (D2C & Corporate)", rows: [
          { id: 34, cat: "Website", task: "Website banners (homepage, product, corporate)", freq: "All products", notes: "Adaptation from Intex team" },
          { id: 35, cat: "Website", task: "Landing pages — product / campaign", freq: "Per campaign", notes: "HTML development on actuals" },
          { id: 36, cat: "Website", task: "Website copy — new writing + optimization", freq: "As required", notes: "All categories" },
        ]
      },
      {
        name: "SEO / GEO", rows: [
          { id: 37, cat: "SEO/GEO", task: "Technical SEO — metadata, schema, sitemaps, redirects", freq: "Ongoing", notes: "With Japan tech team; AI license by client" },
          { id: 38, cat: "SEO/GEO", task: "On-page SEO — FAQs, blogs, UI alignment", freq: "2 blogs + FAQs per qtr", notes: "—" },
          { id: 39, cat: "SEO/GEO", task: "Off-page — guest articles, forums, backlinks", freq: "10–15 articles per qtr", notes: "Backlinks TBD" },
          { id: 40, cat: "SEO/GEO", task: "Quarterly SEO/GEO audit", freq: "Quarterly", notes: "—" },
        ]
      },
      {
        name: "ORM", rows: [
          { id: 41, cat: "ORM", task: "Sprinklr management — comments, response, escalation", freq: "Ongoing", notes: "Tool license by client" },
          { id: 42, cat: "ORM", task: "Weekly & monthly ORM reports", freq: "Monthly", notes: "—" },
        ]
      },
      {
        name: "Internal Communication Video", rows: [
          { id: 43, cat: "Internal Video", task: "Non-shoot video up to 2 mins (stock/AI/internal)", freq: "2–3 annually", notes: "Stock/AI license by client; shoot on actuals" },
        ]
      },
    ]
  }
};

const SERVICE_ANNEXURE_MAP = {
  brand_ambassador: { A: null },
  brand_manual: { B2: ["Internal & Value-Add"] },
  brand_digital_assets: { C: ["Website (D2C & Corporate)"] },
  brand_communication: { B1: ["Brand Level & Corporate Campaigns", "Sales Promo Campaigns"] },
  packaging: { B1: ["Packaging"], B2: ["POSM & Collaterals"] },
  social_media: { B2: ["Print & Outdoor", "Retail & BTL"], C: ["Social Media — Content & Management"] },
  content_seo: { C: ["Media Campaign Creatives", "One-to-One / CRM Communication"] },
  SEO_GEO: { C: ["SEO / GEO"] },
  social_listening: { C: ["ORM"] },
  social_crm: { C: ["ORM"] },
  analytics_business: { C: ["Internal Communication Video"] },
  analytics_reporting: { C: ["Internal Communication Video"] },
  google_analytics: { C: ["SEO / GEO"] },
  website_process: { C: ["Website (D2C & Corporate)"] },
  website: { C: ["Website (D2C & Corporate)"] },
  influencer_marketing: { B2: ["PR, Influencer & Experiential"], C: ["Social Media — Content & Management"] },
  performance_marketing: { C: ["Media Campaign Creatives"] },
  orm: { C: ["One-to-One / CRM Communication", "ORM"] },
  media_buying: { B2: ["B2B — Trade & Channel"] },
  ecommerce: { C: ["D2C & E-Commerce Content"] },
  video_production: { B1: ["TVC & Radio", "Photography"] },
};

function getActiveAnnexures() {
  const selectedSvcKeys = getOrderedServiceIds().filter(id => id !== 'annexures' && anyItemsInService(id));
  const result = {};

  selectedSvcKeys.forEach(svcKey => {
    const mapping = SERVICE_ANNEXURE_MAP[svcKey];
    if (!mapping) return;

    Object.entries(mapping).forEach(([annexId, sectionNames]) => {
      if (!result[annexId]) result[annexId] = {};
      const annex = ANNEXURE_DATA[annexId];
      if (!annex) return;

      const targetSections = (sectionNames === null) ? annex.sections.map(s => s.name) : sectionNames;

      targetSections.forEach(n => {
        if (!result[annexId][n]) result[annexId][n] = new Set();
        const section = annex.sections.find(s => s.name === n);
        if (section) {
          section.rows.forEach(row => result[annexId][n].add(row));
        }
      });
    });
  });

  const activeStandard = ["A", "B1", "B2", "C"]
    .filter(id => (result[id] && Object.keys(result[id]).some(sn => result[id][sn].size > 0)) || (ANNEXURE_DATA[id].sections && ANNEXURE_DATA[id].sections.some(s => s.isCustom)))
    .map(id => ({
      id,
      title: ANNEXURE_DATA[id].title,
      subtitle: ANNEXURE_DATA[id].subtitle,
      sections: ANNEXURE_DATA[id].sections
        .filter(s => s.isCustom || (result[id] && result[id][s.name] && result[id][s.name].size > 0))
        .map(s => {
          const rowsSet = (result[id] && result[id][s.name]) ? result[id][s.name] : new Set();
          if (s.isCustom) {
            (s.rows || []).forEach(row => rowsSet.add(row));
          }
          return {
            name: s.name,
            rows: Array.from(rowsSet).sort((a, b) => a.id - b.id)
          };
        }),
    }));

  const activeCustom = [];
  CUSTOM_ANNEXURE_IDS.forEach(id => {
    const annex = ANNEXURE_DATA[id];
    if (annex) {
      activeCustom.push({
        id,
        title: annex.title,
        subtitle: annex.subtitle,
        sections: annex.sections || []
      });
    }
  });

  return [...activeStandard, ...activeCustom];
}


function allItemsInBlock(svcId, blockIdx) {
  const block = SERVICES[svcId].blocks[blockIdx];
  const set = selectedItems[svcId]?.[blockIdx];
  if (!set) return false;
  const count = block.items.length;
  if (count === 0) return set.has("__selected__");
  return set.size === count;
}
function anyItemsInBlock(svcId, blockIdx) {
  const block = SERVICES[svcId].blocks[blockIdx];
  const set = selectedItems[svcId]?.[blockIdx];
  if (!set) return false;
  if (block.items.length === 0) return set.has("__selected__");
  return set.size > 0;
}
function anyItemsInService(svcId) {
  if (svcId === 'annexures') {
    return annexureEnabled && getActiveAnnexures().length > 0;
  }
  return SERVICES[svcId].blocks.some((_, bi) => anyItemsInBlock(svcId, bi));
}
function allItemsInService(svcId) {
  if (svcId === 'annexures') return annexureEnabled;
  return SERVICES[svcId].blocks.every((_, bi) => allItemsInBlock(svcId, bi));
}
function ensureState(svcId, blockIdx) {
  if (!selectedItems[svcId]) selectedItems[svcId] = {};
  if (!selectedItems[svcId][blockIdx]) selectedItems[svcId][blockIdx] = new Set();
}
function selectAllInBlock(svcId, blockIdx) {
  ensureState(svcId, blockIdx);
  const count = SERVICES[svcId].blocks[blockIdx].items.length;
  if (count === 0) selectedItems[svcId][blockIdx] = new Set(["__selected__"]);
  else selectedItems[svcId][blockIdx] = new Set([...Array(count).keys()]);
}
function deselectAllInBlock(svcId, blockIdx) {
  ensureState(svcId, blockIdx);
  selectedItems[svcId][blockIdx] = new Set();
}
function selectAllInService(svcId) {
  SERVICES[svcId].blocks.forEach((_, bi) => selectAllInBlock(svcId, bi));
}
function deselectAllInService(svcId) {
  SERVICES[svcId].blocks.forEach((_, bi) => deselectAllInBlock(svcId, bi));
}

function getOrderedServiceIds() {
  const sectionOrder = ['Branding', 'Digital & Social', 'Website', 'Annexures', 'Others'];
  const orderedIds = [];
  sectionOrder.forEach(sec => {
    const list = SERVICE_ORDER[sec] || [];
    list.forEach(id => {
      if (SERVICES[id] && !orderedIds.includes(id)) {
        orderedIds.push(id);
      }
    });
  });

  // Just in case any service is not in SERVICE_ORDER (fallback), append them at the end
  Object.keys(SERVICES).forEach(id => {
    if (!orderedIds.includes(id)) {
      orderedIds.push(id);
    }
  });

  return orderedIds;
}

function initPanel() {
  const container = document.getElementById('dynamicServices');
  if (!container) return;
  container.innerHTML = '';

  // 1. Sync SERVICE_ORDER with current SERVICES keys
  Object.keys(SERVICES).forEach(id => {
    const s = SERVICES[id].section || 'Others';
    if (!SERVICE_ORDER[s]) SERVICE_ORDER[s] = [];
    if (!SERVICE_ORDER[s].includes(id)) {
      SERVICE_ORDER[s].push(id);
    }
  });

  // 2. Remove deleted keys from SERVICE_ORDER
  Object.keys(SERVICE_ORDER).forEach(s => {
    SERVICE_ORDER[s] = SERVICE_ORDER[s].filter(id => SERVICES[id]);
  });

  const sectionOrder = ['Branding', 'Digital & Social', 'Website', 'Annexures', 'Others'];
  sectionOrder.forEach(sectionName => {
    const svcIds = SERVICE_ORDER[sectionName] || [];
    if (svcIds.length === 0 && sectionName === 'Annexures') return;

    const sectionDiv = document.createElement('div');
    sectionDiv.className = 'section-group';
    sectionDiv.innerHTML = `<div class="section-label">${sectionName}</div>`;

    svcIds.forEach(svcId => {
      const svc = SERVICES[svcId];
      const svcRow = document.createElement('div');
      svcRow.className = 'service-row';
      svcRow.dataset.id = svcId;

      // Make it draggable (if not annexures)
      if (sectionName !== 'Annexures') {
        svcRow.setAttribute('draggable', 'true');
        svcRow.setAttribute('ondragstart', `handleServiceDragStart(event, '${svcId}')`);
        svcRow.setAttribute('ondragover', `handleServiceDragOver(event)`);
        svcRow.setAttribute('ondragleave', `handleServiceDragLeave(event)`);
        svcRow.setAttribute('ondrop', `handleServiceDrop(event, '${svcId}')`);
      }

      svcRow.onclick = (e) => toggleService(e, svcId);

      const isCustom = svcId.startsWith('custom_');

      svcRow.innerHTML = `
        <div class="checkbox"><svg class="checkbox-mark" viewBox="0 0 10 7" fill="none"><polyline points="1,3.5 4,6.5 9,1" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
        <div class="service-info">
          <div class="service-name">${svc.name}</div>
          <div class="service-sub">${(svc.blocks || []).map(b => b.title || '').filter(t => t).join(', ') || 'Service Details'}</div>
        </div>
        ${isCustom ? `
          <button class="svc-delete-btn" onclick="deleteService(event, '${svcId}')" title="Delete Service" style="background: none; border: none; cursor: pointer; padding: 3px 5px; border-radius: 4px; color: rgba(255,255,255,0.25); margin-left: 6px; transition: all 0.15s; display: flex; align-items: center; justify-content: center; font-size: 11px;">✕</button>
        ` : ''}
        <button class="svc-expand-btn" onclick="toggleExpand(event,'${svcId}')"><span class="svc-expand-arrow${expandedServices[svcId] ? ' open' : ''}" id="svc-arrow-${svcId}">▼</span></button>
      `;
      sectionDiv.appendChild(svcRow);

      const blocksCont = document.createElement('div');
      blocksCont.className = 'blocks-container' + (expandedServices[svcId] ? ' open' : '');
      blocksCont.id = 'blocks-' + svcId;

      if (svc.dynamic) {
        blocksCont.classList.add('dynamic-blocks-cont');
      } else {
        blocksCont.innerHTML = svc.blocks.map((block, bi) => `
          <div class="block-row" id="block-row-${svcId}-${bi}" onclick="toggleBlock(event,'${svcId}',${bi})">
            <div class="block-checkbox">
              <svg class="block-checkbox-mark" viewBox="0 0 10 7" fill="none"><polyline points="1,3.5 4,6.5 9,1" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
            <span class="block-name">${block.title || (svc.name + ' Sub-Block ' + (bi + 1))}</span>
            <button class="block-delete-btn" onclick="deleteBlock(event, '${svcId}', ${bi})" title="Delete Sub-heading">✕</button>
            <button class="block-expand-btn" onclick="toggleBlockExpand(event,'${svcId}',${bi})">
              <span class="block-expand-arrow${expandedBlocks[`${svcId}-${bi}`] ? ' open' : ''}" id="block-arrow-${svcId}-${bi}">▼</span>
            </button>
          </div>
          <div class="items-container${expandedBlocks[`${svcId}-${bi}`] ? ' open' : ''}" id="items-${svcId}-${bi}">
            ${(block.items || []).map((item, ii) => `
              <div class="item-row" id="item-row-${svcId}-${bi}-${ii}" 
                   draggable="true"
                   ondragstart="handleItemDragStart(event, '${svcId}', ${bi}, ${ii})"
                   ondragover="handleItemDragOver(event)"
                   ondragleave="handleItemDragLeave(event)"
                   ondrop="handleItemDrop(event, '${svcId}', ${bi}, ${ii})"
                   onclick="toggleItem(event,'${svcId}',${bi},${ii})">
                <div class="item-checkbox">
                  <svg class="item-checkbox-mark" viewBox="0 0 10 7" fill="none"><polyline points="1,3.5 4,6.5 9,1" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </div>
                <span class="item-name">${item}</span>
              </div>
            `).join('')}
            <div class="item-add-input-wrapper">
              <span class="add-plus-icon">+</span>
              <input class="inline-add-input" placeholder="Add custom item..." onkeydown="handleItemAdd(event, '${svcId}', ${bi})">
            </div>
          </div>
        `).join('') + `
          <div class="block-add-input-wrapper">
            <span class="add-plus-icon">+</span>
            <input class="inline-add-input" style="font-weight:500;" placeholder="Add sub-heading..." onkeydown="handleBlockAdd(event, '${svcId}')">
          </div>
        `;
      }
      sectionDiv.appendChild(blocksCont);
    });

    if (sectionName !== 'Annexures') {
      const addServiceWrapper = document.createElement('div');
      addServiceWrapper.className = 'service-add-input-wrapper';
      addServiceWrapper.style.padding = '6px 22px 12px';
      addServiceWrapper.style.display = 'flex';
      addServiceWrapper.style.alignItems = 'center';
      addServiceWrapper.style.gap = '8px';
      addServiceWrapper.innerHTML = `
        <span class="add-plus-icon" style="color: rgba(255,255,255,0.3); font-size: 14px;">+</span>
        <input class="inline-add-input" style="font-weight: 500;" placeholder="Add service to ${sectionName}..." onkeydown="handleServiceAdd(event, '${sectionName}')">
      `;
      sectionDiv.appendChild(addServiceWrapper);
    }

    container.appendChild(sectionDiv);
  });
  refreshAllUI();
}

function handleServiceAdd(e, sectionName) {
  if (e.key === 'Enter') {
    const val = e.target.value.trim();
    if (!val) return;

    const svcId = 'custom_service_' + Date.now();

    SERVICES[svcId] = {
      section: sectionName,
      name: val,
      blocks: []
    };

    if (!SERVICE_ORDER[sectionName]) SERVICE_ORDER[sectionName] = [];
    SERVICE_ORDER[sectionName].push(svcId);

    e.target.value = '';
    initPanel();
    renderPreview();

    expandedServices[svcId] = true;
    initPanel();

    setTimeout(() => {
      const blockCont = document.getElementById('blocks-' + svcId);
      if (blockCont) {
        const input = blockCont.querySelector('.inline-add-input');
        if (input) input.focus();
      }
    }, 50);
  }
}

function deleteService(e, svcId) {
  e.stopPropagation();
  if (!confirm(`Are you sure you want to delete the service "${SERVICES[svcId].name}"?`)) return;

  delete SERVICES[svcId];
  delete selectedItems[svcId];
  delete expandedServices[svcId];

  initPanel();
  renderPreview();
  updateCount();
}

function handleServiceDragStart(e, svcId) {
  e.stopPropagation();
  e.dataTransfer.setData('text/plain', JSON.stringify({ svcId }));
  e.target.classList.add('dragging');
}

function handleServiceDragOver(e) {
  e.preventDefault();
  const row = e.target.closest('.service-row');
  if (row) row.classList.add('drag-over');
}

function handleServiceDragLeave(e) {
  const row = e.target.closest('.service-row');
  if (row) row.classList.remove('drag-over');
}

function handleServiceDrop(e, targetSvcId) {
  e.preventDefault();
  const row = e.target.closest('.service-row');
  if (row) row.classList.remove('drag-over');

  const rawData = e.dataTransfer.getData('text/plain');
  if (!rawData) return;

  let data;
  try {
    data = JSON.parse(rawData);
  } catch (err) {
    return;
  }

  const sourceSvcId = data.svcId;
  if (!sourceSvcId || sourceSvcId === targetSvcId) return;

  const sourceSvc = SERVICES[sourceSvcId];
  const targetSvc = SERVICES[targetSvcId];
  if (!sourceSvc || !targetSvc) return;

  if (sourceSvc.section !== targetSvc.section) return;

  const sectionName = sourceSvc.section;
  const list = SERVICE_ORDER[sectionName];
  const sourceIdx = list.indexOf(sourceSvcId);
  const targetIdx = list.indexOf(targetSvcId);

  if (sourceIdx !== -1 && targetIdx !== -1) {
    const [movedSvcId] = list.splice(sourceIdx, 1);
    list.splice(targetIdx, 0, movedSvcId);

    initPanel();
    renderPreview();
  }
}

function handleItemAdd(e, svcId, bi) {
  if (e.key === 'Enter') {
    const val = e.target.value.trim();
    if (!val) return;
    SERVICES[svcId].blocks[bi].items.push(val);
    ensureState(svcId, bi);
    selectedItems[svcId][bi].add(SERVICES[svcId].blocks[bi].items.length - 1);
    e.target.value = '';
    initPanel();
    renderPreview();
    setTimeout(() => {
      const inputs = document.querySelectorAll(`#items-${svcId}-${bi} .inline-add-input`);
      if (inputs.length) inputs[0].focus();
    }, 10);
  }
}

function handleBlockAdd(e, svcId) {
  if (e.key === 'Enter') {
    const val = e.target.value.trim();
    if (!val) return;
    SERVICES[svcId].blocks.push({ title: val, items: [] });
    const bi = SERVICES[svcId].blocks.length - 1;
    ensureState(svcId, bi);
    e.target.value = '';
    initPanel();
    renderPreview();
    setTimeout(() => {
      const inputs = document.querySelectorAll(`#items-${svcId}-${bi} .inline-add-input`);
      if (inputs.length) inputs[0].focus();
    }, 10);
  }
}

function deleteBlock(e, svcId, bi) {
  e.stopPropagation();
  if (!confirm(`Are you sure you want to delete the sub-heading "${SERVICES[svcId].blocks[bi].title}"?`)) return;

  // Remove block from SERVICES
  SERVICES[svcId].blocks.splice(bi, 1);

  // Clean up selectedItems state
  if (selectedItems[svcId]) {
    delete selectedItems[svcId][bi];
    // Re-index remaining blocks in selectedItems
    const newSvcSelected = {};
    Object.keys(selectedItems[svcId]).forEach(oldBi => {
      const oldIdx = parseInt(oldBi);
      if (oldIdx > bi) {
        newSvcSelected[oldIdx - 1] = selectedItems[svcId][oldBi];
      } else if (oldIdx < bi) {
        newSvcSelected[oldIdx] = selectedItems[svcId][oldBi];
      }
    });
    selectedItems[svcId] = newSvcSelected;
  }

  // Clean up expandedBlocks state
  const newExpandedBlocks = {};
  Object.keys(expandedBlocks).forEach(key => {
    const parts = key.split('-');
    if (parts[0] === svcId) {
      const idx = parseInt(parts[1]);
      if (idx > bi) {
        newExpandedBlocks[`${svcId}-${idx - 1}`] = expandedBlocks[key];
      } else if (idx < bi) {
        newExpandedBlocks[key] = expandedBlocks[key];
      }
    } else {
      newExpandedBlocks[key] = expandedBlocks[key];
    }
  });
  // Replace expandedBlocks contents
  for (let key in expandedBlocks) delete expandedBlocks[key];
  Object.assign(expandedBlocks, newExpandedBlocks);

  initPanel();
  renderPreview();
}

function toggleExpand(e, svcId) {
  e.stopPropagation();
  const el = document.getElementById('blocks-' + svcId);
  const arrow = document.getElementById('svc-arrow-' + svcId);
  if (!el || !arrow) return;
  const open = el.classList.toggle('open');
  arrow.classList.toggle('open', open);
  expandedServices[svcId] = open; // Caches state
}

function toggleBlockExpand(e, svcId, bi) {
  e.stopPropagation();
  const el = document.getElementById(`items-${svcId}-${bi}`);
  const arrow = document.getElementById(`block-arrow-${svcId}-${bi}`);
  if (!el || !arrow) return;
  const open = el.classList.toggle('open');
  arrow.classList.toggle('open', open);
  const key = `${svcId}-${bi}`;
  expandedBlocks[key] = open; // Caches state
}

function toggleService(e, svcId) {
  if (svcId === 'annexures') {
    annexureEnabled = !annexureEnabled;
  } else {
    if (allItemsInService(svcId)) deselectAllInService(svcId);
    else selectAllInService(svcId);
  }
  refreshServiceUI(svcId);
  updateCount();
  renderPreview();
}

function toggleBlock(e, svcId, bi) {
  e.stopPropagation();
  if (allItemsInBlock(svcId, bi)) deselectAllInBlock(svcId, bi);
  else selectAllInBlock(svcId, bi);
  refreshServiceUI(svcId);
  updateCount();
  renderPreview();
}

function toggleItem(e, svcId, bi, ii) {
  e.stopPropagation();
  ensureState(svcId, bi);
  if (selectedItems[svcId][bi].has(ii)) selectedItems[svcId][bi].delete(ii);
  else selectedItems[svcId][bi].add(ii);
  refreshServiceUI(svcId);
  updateCount();
  renderPreview();
}

function handleItemDragStart(e, svcId, bi, ii) {
  e.dataTransfer.setData('text/plain', JSON.stringify({ svcId, bi, ii }));
  e.target.classList.add('dragging');
}

function handleItemDragOver(e) {
  e.preventDefault();
  const row = e.target.closest('.item-row');
  if (row) row.classList.add('drag-over');
}

function handleItemDragLeave(e) {
  const row = e.target.closest('.item-row');
  if (row) row.classList.remove('drag-over');
}

function handleItemDrop(e, targetSvcId, targetBi, targetIi) {
  e.preventDefault();
  const row = e.target.closest('.item-row');
  if (row) row.classList.remove('drag-over');

  const data = JSON.parse(e.dataTransfer.getData('text/plain'));
  const { svcId: sourceSvcId, bi: sourceBi, ii: sourceIi } = data;

  // Only allow reordering within the same block
  if (sourceSvcId !== targetSvcId || sourceBi !== targetBi || sourceIi === targetIi) return;

  const block = SERVICES[targetSvcId].blocks[targetBi];
  const items = block.items;

  // Track selected items by value before reordering
  const selectedIndices = selectedItems[targetSvcId][targetBi];
  const selectedValues = new Set();
  selectedIndices.forEach(idx => selectedValues.add(items[idx]));

  // Reorder array
  const [movedItem] = items.splice(sourceIi, 1);
  items.splice(targetIi, 0, movedItem);

  // Update selectedItems Set with new indices
  const newSelectedSet = new Set();
  items.forEach((item, idx) => {
    if (selectedValues.has(item)) newSelectedSet.add(idx);
  });
  selectedItems[targetSvcId][targetBi] = newSelectedSet;

  initPanel(); // Re-render sidebar to show new order
  renderPreview();
}

function refreshServiceUI(svcId) {
  const svc = SERVICES[svcId];
  const svcRow = document.querySelector(`.service-row[data-id="${svcId}"]`);
  if (!svcRow) return;
  const hasAny = anyItemsInService(svcId);
  const hasAll = allItemsInService(svcId);
  svcRow.classList.toggle('active', hasAny);
  const cb = svcRow.querySelector('.checkbox');
  const mark = svcRow.querySelector('.checkbox-mark');

  if (hasAny && !hasAll) {
    cb.style.background = 'rgba(200,55,43,0.5)';
    cb.style.borderColor = 'var(--red)';
    if (mark) mark.style.opacity = '1';
  } else {
    cb.style.background = '';
    cb.style.borderColor = '';
    if (mark) mark.style.opacity = '';
  }

  if (svc.dynamic) {
    if (svcId === 'annexures') renderAnnexureSidebar();
    return;
  }

  svc.blocks.forEach((block, bi) => {
    const blockRow = document.getElementById(`block-row-${svcId}-${bi}`);
    if (!blockRow) return;
    const anyB = anyItemsInBlock(svcId, bi);
    const allB = allItemsInBlock(svcId, bi);
    blockRow.classList.remove('active', 'partial');
    if (allB) blockRow.classList.add('active');
    else if (anyB) blockRow.classList.add('partial');
    (block.items || []).forEach((_, ii) => {
      const itemRow = document.getElementById(`item-row-${svcId}-${bi}-${ii}`);
      if (!itemRow) return;
      const checked = selectedItems[svcId]?.[bi]?.has(ii);
      itemRow.classList.toggle('active', !!checked);
    });
  });
}

function refreshAllUI() {
  Object.keys(SERVICES).forEach(refreshServiceUI);
  // Always refresh annexures if it depends on others
  if (SERVICES.annexures) renderAnnexureSidebar();
}

function renderAnnexureSidebar() {
  const container = document.getElementById('blocks-annexures');
  if (!container) return;

  const activeAnnexures = getActiveAnnexures();

  if (activeAnnexures.length === 0) {
    container.innerHTML = `<div style="padding:20px; font-size:12px; color:rgba(255,255,255,0.3); text-align:center; font-style:italic;">Select services above to populate annexures or create a custom one below</div>`;

    // Render the add custom annexure input even when empty!
    const addWrapper = document.createElement('div');
    addWrapper.className = 'annexure-add-wrapper';
    addWrapper.style.padding = '12px';
    addWrapper.style.borderTop = '1px solid rgba(255,255,255,0.06)';
    addWrapper.style.display = 'flex';
    addWrapper.style.gap = '8px';
    addWrapper.innerHTML = `
      <span style="color: rgba(255,255,255,0.3); font-size: 14px; align-self: center;">+</span>
      <input type="text" 
             class="inline-add-input" 
             style="font-weight: 500; font-size:12px; flex: 1;" 
             placeholder="Create new blank annexure (e.g. Annexure D)..." 
             onkeydown="handleCustomAnnexureAdd(event)">
    `;
    container.appendChild(addWrapper);
    return;
  }

  let html = '';
  activeAnnexures.forEach((annex, ai) => {
    const key = `annexures-${ai}`;
    const isBlockOpen = expandedBlocks[key] !== false; // Default open
    const isAnnexDisabled = disabledAnnexures.has(annex.id);
    const isCustomAnnex = CUSTOM_ANNEXURE_IDS.has(annex.id);
    const headingVal = annexureHeadingOverrides[annex.id] || getAnnexureDefaultHeading(annex.id);

    html += `
      <div class="block-row ${isAnnexDisabled ? '' : 'active'}" onclick="toggleAnnexureVisibility(event, '${annex.id}')">
        <div class="block-checkbox"><div class="block-checkbox-mark"></div></div>
        <span class="block-name">${annex.title || `Annexure ${annex.id}`}</span>
        ${isCustomAnnex ? `
          <button class="svc-delete-btn" onclick="deleteCustomAnnexure(event, '${annex.id}')" title="Delete Custom Annexure" style="background: none; border: none; cursor: pointer; padding: 3px 5px; border-radius: 4px; color: rgba(255,255,255,0.25); margin-left: auto; margin-right: 6px; transition: all 0.15s; display: flex; align-items: center; justify-content: center; font-size: 11px;">✕</button>
        ` : ''}
        <button class="block-expand-btn" style="${isCustomAnnex ? 'margin-left: 0;' : 'margin-left: auto;'}" onclick="toggleBlockExpand(event, 'annexures', ${ai})">
          <span class="block-expand-arrow ${isBlockOpen ? 'open' : ''}" id="block-arrow-annexures-${ai}">▼</span>
        </button>
      </div>
      <div class="items-container ${isBlockOpen ? 'open' : ''}" id="items-annexures-${ai}">
        
        <div class="annexure-main-heading-edit" style="margin: 8px 12px 12px 12px;">
          <div class="field-label" style="font-size:9px; color:rgba(255,255,255,0.4); margin-bottom:4px; text-transform:none; letter-spacing:0.02em;">Main Heading Banner (Red Block)</div>
          <input type="text" 
                 class="field-input" 
                 style="width: 100%; padding: 6px 10px; font-size:12px; background: rgba(0,0,0,0.2);"
                 value="${headingVal}"
                 oninput="updateAnnexureHeadingOverride('${annex.id}', this.value)" />
        </div>

        ${annex.sections.map((sec, si) => {
      const secKey = `${annex.id}-${sec.name}`;
      const isSecOpen = !!expandedAnnexureSections[secKey];

      return `
            <div class="item-row ${disabledAnnexureSections.has(`${annex.id}_${sec.name}`) ? '' : 'active'}" 
                 onclick="toggleAnnexureSectionVisibility(event, '${annex.id}', '${sec.name.replace(/'/g, "\\'")}')">
              <div class="item-checkbox">
                <svg class="item-checkbox-mark" viewBox="0 0 10 7" fill="none" style="opacity: ${disabledAnnexureSections.has(`${annex.id}_${sec.name}`) ? '0' : '1'}">
                  <polyline points="1,3.5 4,6.5 9,1" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <span class="item-name">${sec.name}</span>
              <button class="svc-expand-btn" style="margin-left:auto; background:none; border:none; padding:4px;" onclick="toggleAnnexureSectionExpand(event, '${annex.id}', '${sec.name.replace(/'/g, "\\'")}')">
                <span class="svc-expand-arrow ${isSecOpen ? 'open' : ''}" style="font-size:8px;">▼</span>
              </button>
            </div>
            <div class="annexure-tasks-wrapper" style="max-height:${isSecOpen ? '10000px' : '0'}; overflow:hidden; transition: max-height 0.5s ease; padding-left:var(--annex-indent); margin-bottom:${isSecOpen ? '10px' : '0'};">
              ${sec.rows.map(row => {
        const val = annexureOverrides[`${annex.id}_${row.id}`] || (annex.id === 'A' ? row.timing : row.freq);
        const isRowDisabled = disabledAnnexureRows.has(`${annex.id}_${row.id}`);
        const taskVal = annexureTaskOverrides[`${annex.id}_${row.id}`] || row.task;
        const detailVal = annexureDetailOverrides[`${annex.id}_${row.id}`] || row.detail;
        const notesVal = annexureNotesOverrides[`${annex.id}_${row.id}`] || row.notes;
        const catVal = annexureCatOverrides[`${annex.id}_${row.id}`] || row.cat;

        return `
                  <div class="annexure-edit-row" style="margin: 8px 12px 12px 0; display: flex; align-items: flex-start; gap: 8px;">
                    <div class="item-checkbox ${isRowDisabled ? '' : 'active'}" 
                         style="margin-top: 2px; flex-shrink: 0;" 
                         onclick="toggleAnnexureRowVisibility(event, '${annex.id}', ${row.id})">
                      <svg class="item-checkbox-mark" viewBox="0 0 10 7" fill="none" style="opacity: ${isRowDisabled ? '0' : '1'}"><polyline points="1,3.5 4,6.5 9,1" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </div>
                    <div style="flex: 1;">
                      <div class="field-label" style="font-size:9px; color:rgba(255,255,255,0.4); margin-bottom:4px; text-transform:none; letter-spacing:0.02em;">Task Name</div>
                      <input type="text" 
                             class="field-input" 
                             style="width: 100%; padding: 6px 10px; font-size:12px; background: rgba(0,0,0,0.2); margin-bottom: 8px;"
                             value="${taskVal}"
                             oninput="updateAnnexureTaskOverride('${annex.id}', ${row.id}, this.value)" />
                      
                      ${(annex.id === 'A' || isCustomAnnex) ? `
                        <div class="field-label" style="font-size:9px; color:rgba(255,255,255,0.4); margin-bottom:4px; text-transform:none; letter-spacing:0.02em;">Deliverable Detail</div>
                        <input type="text" 
                               class="field-input" 
                               style="width: 100%; padding: 6px 10px; font-size:12px; background: rgba(0,0,0,0.2); margin-bottom: 8px;"
                               value="${detailVal || ''}"
                               oninput="updateAnnexureDetailOverride('${annex.id}', ${row.id}, this.value)" />
                      ` : `
                        <div class="field-label" style="font-size:9px; color:rgba(255,255,255,0.4); margin-bottom:4px; text-transform:none; letter-spacing:0.02em;">Category</div>
                        <input type="text" 
                               class="field-input" 
                               style="width: 100%; padding: 6px 10px; font-size:12px; background: rgba(0,0,0,0.2); margin-bottom: 8px;"
                               value="${catVal || ''}"
                               oninput="updateAnnexureCatOverride('${annex.id}', ${row.id}, this.value)" />
                      `}

                      <div class="field-label" style="font-size:9px; color:rgba(255,255,255,0.4); margin-bottom:4px; text-transform:none; letter-spacing:0.02em;">Timing / Frequency</div>
                      <input type="text" 
                             class="field-input" 
                             style="width: 100%; padding: 6px 10px; font-size:12px; background: rgba(0,0,0,0.2); margin-bottom: 8px;"
                             value="${val || ''}"
                             oninput="updateAnnexureOverride('${annex.id}', ${row.id}, this.value)" />
                      
                      <div class="field-label" style="font-size:9px; color:rgba(255,255,255,0.4); margin-bottom:4px; text-transform:none; letter-spacing:0.02em;">Notes</div>
                      <input type="text" 
                             class="field-input" 
                             style="width: 100%; padding: 6px 10px; font-size:12px; background: rgba(0,0,0,0.2);"
                             value="${notesVal || ''}"
                             oninput="updateAnnexureNotesOverride('${annex.id}', ${row.id}, this.value)" />
                    </div>
                  </div>
                `;
      }).join('')}

              <div class="annexure-task-add-wrapper" style="margin: 8px 12px 12px 28px;">
                <span style="color: rgba(255,255,255,0.3); font-size: 14px; margin-right: 6px;">+</span>
                <input class="inline-add-input" placeholder="Add new task..." onkeydown="handleAnnexureRowAdd(event, '${annex.id}', '${sec.name.replace(/'/g, "\\'")}')">
              </div>
            </div>
          `;
    }).join('')}

        <div class="annexure-section-add-wrapper" style="padding: 12px 12px 12px 12px; border-top: 1px solid rgba(255,255,255,0.06);">
          <span style="color: rgba(255,255,255,0.3); font-size: 14px; margin-right: 6px;">+</span>
          <input class="inline-add-input" style="font-weight: 500;" placeholder="Add deliverable group (e.g. PR & Media)..." onkeydown="handleAnnexureSectionAdd(event, '${annex.id}')">
        </div>
      </div>
    `;
  });

  html += `
    <div class="annexure-add-wrapper" style="padding: 12px; border-top: 1px solid rgba(255,255,255,0.06); display: flex; gap: 8px;">
      <span style="color: rgba(255,255,255,0.3); font-size: 14px; align-self: center;">+</span>
      <input type="text" 
             class="inline-add-input" 
             style="font-weight: 500; font-size:12px; flex: 1;" 
             placeholder="Create new blank annexure (e.g. Annexure D)..." 
             onkeydown="handleCustomAnnexureAdd(event)">
    </div>
  `;

  container.innerHTML = html;
}

function toggleAnnexureVisibility(event, annexId) {
  event.stopPropagation();
  if (disabledAnnexures.has(annexId)) disabledAnnexures.delete(annexId);
  else disabledAnnexures.add(annexId);
  refreshServiceUI('annexures');
  renderPreview();
}

function toggleAnnexureRowVisibility(event, annexId, rowId) {
  event.stopPropagation();
  const key = `${annexId}_${rowId}`;
  if (disabledAnnexureRows.has(key)) disabledAnnexureRows.delete(key);
  else disabledAnnexureRows.add(key);
  renderAnnexureSidebar();
  renderPreview();
}

function toggleAnnexureSectionVisibility(event, annexId, secName) {
  event.stopPropagation();
  const key = `${annexId}_${secName}`;
  if (disabledAnnexureSections.has(key)) disabledAnnexureSections.delete(key);
  else disabledAnnexureSections.add(key);
  renderAnnexureSidebar();
  renderPreview();
}

function toggleAnnexureSectionExpand(event, annexId, secName) {
  event.stopPropagation();
  const key = `${annexId}-${secName}`;
  expandedAnnexureSections[key] = !expandedAnnexureSections[key];
  renderAnnexureSidebar(); // Refresh to apply state
}

function handleAnnexureOverride(key, val) {
  annexureOverrides[key] = val;
  renderPreview();
}

function updateAnnexureOverride(annexId, rowId, val) {
  annexureOverrides[`${annexId}_${rowId}`] = val;
  renderPreview();
}

function updateAnnexureTaskOverride(annexId, rowId, val) {
  annexureTaskOverrides[`${annexId}_${rowId}`] = val;
  renderPreview();
}

function updateAnnexureDetailOverride(annexId, rowId, val) {
  annexureDetailOverrides[`${annexId}_${rowId}`] = val;
  renderPreview();
}

function updateAnnexureNotesOverride(annexId, rowId, val) {
  annexureNotesOverrides[`${annexId}_${rowId}`] = val;
  renderPreview();
}

function updateAnnexureCatOverride(annexId, rowId, val) {
  annexureCatOverrides[`${annexId}_${rowId}`] = val;
  renderPreview();
}

function updateAnnexureHeadingOverride(annexId, val) {
  annexureHeadingOverrides[annexId] = val;
  renderPreview();
}

function getAnnexureDefaultHeading(annexId) {
  if (annexId === 'A') return 'Brand Ambassador — Integrated Plan';
  if (annexId === 'B1') return 'Creative ATL Scope of Work';
  if (annexId === 'B2') return 'Creative ATL Scope of Work';
  if (annexId === 'C') return 'Digital Scope of Work | All Categories';
  const customAnnex = ANNEXURE_DATA[annexId];
  return customAnnex ? customAnnex.subtitle || `Annexure ${annexId}` : `Annexure ${annexId}`;
}

function handleCustomAnnexureAdd(e) {
  if (e.key === 'Enter') {
    const val = e.target.value.trim();
    if (!val) return;

    let cleanName = val;
    let id = val;
    if (val.toLowerCase().startsWith('annexure ')) {
      id = val.substring(9).trim();
    } else {
      cleanName = 'Annexure ' + val;
    }

    if (!id) return;

    if (ANNEXURE_DATA[id]) {
      alert("An annexure with this name already exists!");
      return;
    }

    ANNEXURE_DATA[id] = {
      title: cleanName,
      subtitle: cleanName + ' — Custom Plan',
      sections: []
    };

    CUSTOM_ANNEXURE_IDS.add(id);

    e.target.value = '';
    renderAnnexureSidebar();
    renderPreview();

    const activeAn = getActiveAnnexures();
    const customIdx = activeAn.findIndex(a => a.id === id);
    if (customIdx !== -1) {
      expandedBlocks[`annexures-${customIdx}`] = true;
      renderAnnexureSidebar();
    }
  }
}

function deleteCustomAnnexure(e, annexId) {
  e.stopPropagation();
  if (!confirm(`Are you sure you want to delete the custom annexure "${ANNEXURE_DATA[annexId].title}"?`)) return;

  delete ANNEXURE_DATA[annexId];
  CUSTOM_ANNEXURE_IDS.delete(annexId);

  delete annexureHeadingOverrides[annexId];

  renderAnnexureSidebar();
  renderPreview();
}

function handleAnnexureSectionAdd(e, annexId) {
  if (e.key === 'Enter') {
    const val = e.target.value.trim();
    if (!val) return;

    const annex = ANNEXURE_DATA[annexId];
    if (!annex) return;

    if (!annex.sections) annex.sections = [];
    if (annex.sections.some(s => s.name === val)) {
      alert("This deliverable group already exists!");
      return;
    }

    annex.sections.push({
      name: val,
      rows: [],
      isCustom: true
    });

    e.target.value = '';
    renderAnnexureSidebar();
    renderPreview();
  }
}

function handleAnnexureRowAdd(e, annexId, secName) {
  if (e.key === 'Enter') {
    const val = e.target.value.trim();
    if (!val) return;

    const annex = ANNEXURE_DATA[annexId];
    if (!annex) return;

    const section = annex.sections.find(s => s.name === secName);
    if (!section) return;

    const newRowId = Date.now();
    section.rows.push({
      id: newRowId,
      task: val,
      detail: '',
      timing: 'Pre-launch',
      freq: 'Once',
      notes: '—'
    });

    e.target.value = '';
    renderAnnexureSidebar();
    renderPreview();
  }
}

function toggleAll() {
  const all = Object.keys(SERVICES);
  const anySelected = all.some(id => anyItemsInService(id));
  if (anySelected) all.forEach(id => deselectAllInService(id));
  else all.forEach(id => selectAllInService(id));
  refreshAllUI();
  updateCount();
  renderPreview();
}

function clearAll() {
  Object.keys(SERVICES).forEach(id => deselectAllInService(id));
  const bInput = document.getElementById('brandInput');
  const cInput = document.getElementById('costInput');
  const pInput = document.getElementById('paymentInput');
  const aInput = document.getElementById('ambassadorInput');
  if (bInput) bInput.value = '';
  if (cInput) cInput.value = '';
  if (pInput) pInput.value = '';
  if (aInput) aInput.value = '';
  annexureEnabled = true;
  disabledAnnexures.clear();
  disabledAnnexureRows.clear();
  disabledAnnexureSections.clear();
  for (let key in annexureTaskOverrides) delete annexureTaskOverrides[key];
  for (let key in annexureDetailOverrides) delete annexureDetailOverrides[key];
  for (let key in annexureNotesOverrides) delete annexureNotesOverrides[key];
  for (let key in annexureCatOverrides) delete annexureCatOverrides[key];
  refreshAllUI();
  updateCount();
  renderPreview();
}

function updateCount() {
  const active = Object.keys(SERVICES).filter(id => anyItemsInService(id));
  const badge = document.getElementById('countBadge');
  const btn = document.getElementById('selectAllBtn');
  if (badge) badge.textContent = active.length;
  if (btn) {
    const allSelected = active.length === Object.keys(SERVICES).length;
    btn.textContent = allSelected ? 'Deselect all' : 'Select all';
  }
}

function getActiveBlocksForSlide(svcId) {
  const svc = SERVICES[svcId];
  const result = [];
  svc.blocks.forEach((block, bi) => {
    const itemSet = selectedItems[svcId]?.[bi];
    const activeItems = (block.items || []).filter((_, ii) => itemSet?.has(ii));
    const isSelected = (activeItems.length > 0) || (block.items.length === 0 && itemSet && itemSet.has("__selected__"));
    if (isSelected) result.push({ ...block, items: activeItems });
  });
  return result;
}

function renderPreview() {
  const brand = document.getElementById('brandInput')?.value.trim() || 'Your Brand';
  const ambassadorName = document.getElementById('ambassadorInput')?.value.trim() || 'Brand Ambassador';
  const costValue = document.getElementById('costInput')?.value.trim() || 'xxxx';
  const paymentValue = document.getElementById('paymentInput')?.value.trim() || 'Monthly Advance';
  const scroll = document.getElementById('previewScroll');
  if (!scroll) return;
  const selectedList = getOrderedServiceIds().filter(id => anyItemsInService(id));

  if (!selectedList.length && !document.getElementById('brandInput')?.value.trim()) {
    scroll.innerHTML = `<div class="empty-state"><div class="empty-state-icon">📋</div><h3>Start building your proposal</h3><p>Enter a brand name and select services from the left panel. Your proposal will appear here in real time.</p></div>`;
    const pCount = document.getElementById('pageCount');
    if (pCount) pCount.textContent = '0 slides';
    return;
  }

  let slides = [];
  slides.push(`
    <div class="slide">
      <div class="slide-inner">
        <div style="position:absolute;inset:0;">
          <img src="assets/img/first-page.png" style="width:100%; height:100%; object-fit:cover; display:block;" draggable="false" />
        </div>
      </div>
    </div>
  `);

  if (selectedList.length > 0) {
    const allContentItems = [];
    selectedList.filter(id => id !== 'annexures').forEach((svcId) => {
      const svc = SERVICES[svcId];
      const blocks = getActiveBlocksForSlide(svcId);
      blocks.forEach(block => allContentItems.push({ svcName: svc.name, block }));
    });

    const processedContentItems = [];
    allContentItems.forEach(item => {
      const block = item.block;
      const CHUNK_SIZE = 15; // smaller chunks for safety, they will merge if on same page
      if (block.items && block.items.length > CHUNK_SIZE) {
        const itemsCopy = [...block.items];
        let part = 1;
        while (itemsCopy.length > 0) {
          const chunk = itemsCopy.splice(0, CHUNK_SIZE);
          processedContentItems.push({
            svcName: item.svcName,
            part: part,
            originalTitle: block.title,
            block: {
              ...block,
              title: block.title, // keep original title for reference
              para: part === 1 ? block.para : '',
              boldItems: part === 1 ? block.boldItems : [],
              items: chunk
            }
          });
          part++;
        }
      } else {
        processedContentItems.push({ ...item, part: 1, originalTitle: item.block.title });
      }
    });

    let slideGroups = [];
    let currentGroup = [];
    let currentScore = 0;
    let isFirstSlide = true;
    let lastSvcName = "";
    const ITEM_SCORE = 1.1, BLOCK_TITLE_SCORE = 2.5, SVC_TITLE_SCORE = 3.5, DIVIDER_SCORE = 2;
    const FIRST_PAGE_LIMIT = 24, NORMAL_PAGE_LIMIT = 34;

    processedContentItems.forEach(item => {
      let itemScore = 0;
      if (item.svcName !== lastSvcName) {
        itemScore += SVC_TITLE_SCORE;
        if (currentGroup.length > 0) itemScore += DIVIDER_SCORE;
      }
      itemScore += BLOCK_TITLE_SCORE;
      if (item.block.para) itemScore += Math.ceil(item.block.para.length / 80) + 2;
      if (item.block.items) itemScore += (item.block.items.length * ITEM_SCORE);
      if (item.block.boldItems) item.block.boldItems.forEach(bi => itemScore += Math.ceil((bi.bold.length + bi.text.length) / 80) * ITEM_SCORE);

      const limit = isFirstSlide ? FIRST_PAGE_LIMIT : NORMAL_PAGE_LIMIT;
      if (currentScore + itemScore > limit && currentGroup.length > 0) {
        slideGroups.push(currentGroup);
        currentGroup = [];
        currentScore = 0;
        isFirstSlide = false;
        lastSvcName = "";
      }
      currentGroup.push(item);
      currentScore += itemScore;
      lastSvcName = item.svcName;
    });
    if (currentGroup.length > 0) slideGroups.push(currentGroup);

    let globalLastSvc = "";
    slideGroups.forEach((group, gIdx) => {
      const isFirstSlideOfContent = (gIdx === 0);
      let bodyHTML = "";
      let slidePrevSvc = "";

      group.forEach((item, i) => {
        if (item.svcName !== globalLastSvc) {
          if (i > 0) bodyHTML += `<div class="plus-divider">+</div>`;
          bodyHTML += `<div class="service-slide-title">${item.svcName}</div>`;
          globalLastSvc = item.svcName;
        } else if (i > 0 && item.svcName !== slidePrevSvc) {
          bodyHTML += `<div class="plus-divider">+</div>`;
        }
        slidePrevSvc = item.svcName;
        const block = item.block;

        // Logical title display: 
        // 1. If it's part 1, show normal title.
        // 2. If it's part > 1 AND it's at the TOP of a slide (i === 0), show "(continued)".
        // 3. Otherwise (part > 1 but not at top), don't show a title at all (flow into previous list).
        let displayTitle = "";
        let isContinuationSameSlide = false;
        if (item.part === 1) {
          displayTitle = block.title ? block.title.replace(/{Ambassador}/g, ambassadorName) : '';
        } else if (i === 0) {
          displayTitle = item.originalTitle ? `${item.originalTitle.replace(/{Ambassador}/g, ambassadorName)} (continued)` : '';
        } else {
          // Part > 1 and NOT at top of slide. Check if previous item was the same block.
          if (group[i - 1].originalTitle === item.originalTitle && group[i - 1].svcName === item.svcName) {
            isContinuationSameSlide = true;
          }
        }

        let blockBodyHTML = '';
        if (block.para) blockBodyHTML += `<p class="service-block-para">${block.para}</p>`;
        if (block.boldItems && block.boldItems.length) {
          blockBodyHTML += `<ul class="service-block-items">` + block.boldItems.map(bi => `<li><strong>${bi.bold}</strong>${bi.text}</li>`).join('') + `</ul>`;
        }
        if (block.items && block.items.length) {
          blockBodyHTML += `<ul class="service-block-items">` + block.items.map(it => `<li>${it.replace(/{Ambassador}/g, ambassadorName)}</li>`).join('') + `</ul>`;
        }
        bodyHTML += `
          <div class="service-block${displayTitle ? '' : ' service-block--no-title'}${isContinuationSameSlide ? ' service-block--continuation' : ''}">
            ${displayTitle ? `<div class="service-block-title">${displayTitle}</div>` : ''}
            ${blockBodyHTML}
          </div>
        `;
      });

      slides.push(`
        <div class="slide">
          <div class="slide-inner"><div class="slide-content">
            <div class="slide-header"><img src="assets/img/header.png" style="width:100%; height:auto; display:block;" /></div>
            <div class="slide-body">
              ${isFirstSlideOfContent ? `
                <div class="intro-client">Client | <strong>${brand}</strong></div>
                <div class="intro-body">Post our discussions, here's a 'Tailor Made' proposal in detail. Please go through it carefully. We will be happy to explain to you each and every point that is written here. Happy to be working with you soon.</div>
                <div class="plus-divider">+</div>
              ` : ''}
              <div class="scope-heading">SCOPE OF WORK</div>
              <div class="plus-divider">+</div>
              ${bodyHTML}
            </div>
            <div class="slide-footer"><img src="assets/img/footer.png" style="width:100%; height:auto; display:block;" /></div>
          </div></div>
        </div>
      `);
    });
  }

  // DYNAMIC ANNEXURES BASED ON LOGIC
  if (annexureEnabled) {
    slides.push(...generateDynamicAnnexureSlides());
  }

  if (selectedList.length > 0) {
    slides.push(`
      <div class="slide">
        <div class="slide-inner"><div class="slide-content">
          <div class="slide-header"><img src="assets/img/header.png" style="width:100%;" /></div>
          <div class="slide-body">
            <div class="commercials-title">Commercials</div>
            <div class="intro-plus">+</div>
            <div class="retainer-label">Retainer Cost</div>
            <div class="retainer-amount">${costValue}</div>
            <div class="payment-label">Mode of Payment</div>
            <div class="payment-value">${paymentValue}</div>
            <div class="intro-plus">+</div>
            <div class="tnc-title">Terms and Conditions</div>
            <ul class="tnc-list">
              <li>The commercials do not include third-party costs such as AI Licenses, purchasing images from photo banks / illustrations / video footage / integrations / 3D renders/ voice over / music that may be used, they will be charged on actuals.</li>
              <li>Shoots will be charged separately.</li>
              <li>The agency will charge a 15% fee for all third-party facilitation, media and influencer facilitation</li>
              <li>Travel/boarding/lodging expenses outside the NCR will be on actuals and to be borne by the client.</li>
              <li>Any third-party plugins, software, or tool subscriptions required for the execution of the services shall be procured upon prior approval from the client and shall be charged as actuals, over and above the agreed fees.</li>
              <li>Please refer all the Annexures for final deliverables.</li>
              <li>All applicable taxes as per GOI will be extra.</li>
            </ul>
          </div>
          <div class="slide-footer"><img src="assets/img/footer.png" style="width:100%;" /></div>
        </div></div>
      </div>
    `);
  }

  slides.push(`
    <div class="slide">
      <div class="slide-inner">
        <div style="position:absolute;inset:0;"><img src="assets/img/second-page.png" style="width:100%; height:100%; object-fit:cover; display:block;" /></div>
      </div>
    </div>
  `);

  scroll.innerHTML = slides.join('');
  const pCount = document.getElementById('pageCount');
  if (pCount) pCount.textContent = `${slides.length} slide${slides.length !== 1 ? 's' : ''}`;
}

async function generatePDF() {
  if (!window.jspdf || !window.html2canvas) { alert("Libraries are still loading..."); return; }
  const active = Object.keys(selectedItems).some(k => Object.keys(selectedItems[k]).some(b => selectedItems[k][b].size > 0));
  if (!active && !document.getElementById('brandInput')?.value.trim()) { alert('Add content first.'); return; }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: 'portrait', unit: 'px', format: [720, 1018] });
  const slides = document.querySelectorAll('.slide');
  const overlay = document.getElementById('loadingOverlay');
  const progress = document.getElementById('loadingProgress');
  if (overlay) overlay.classList.add('active');

  await new Promise(r => setTimeout(r, 500));

  for (let i = 0; i < slides.length; i++) {
    if (progress) progress.textContent = `Slide ${i + 1} of ${slides.length}…`;
    const slide = slides[i];
    const images = Array.from(slide.querySelectorAll('img'));
    await Promise.all(images.map(img => img.complete ? Promise.resolve() : new Promise(resolve => { img.onload = resolve; img.onerror = resolve; })));
    await new Promise(r => setTimeout(r, 100));
    const canvas = await html2canvas(slide, { scale: 3, useCORS: true, logging: false, backgroundColor: '#ffffff' });
    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    if (i > 0) doc.addPage();
    doc.addImage(imgData, 'JPEG', 0, 0, 720, 1018);
  }

  const brand = document.getElementById('brandInput')?.value.trim() || 'Proposal';
  doc.save(`CogCulture_${brand.replace(/\s+/g, '_')}.pdf`);
  if (overlay) overlay.classList.remove('active');
}

document.addEventListener('DOMContentLoaded', () => {
  initPanel();
  renderPreview();
});

/* ═══════════════════════════════════════════════════════════════
   ANNEXURE SLIDE GENERATORS
   Each returns a full .slide HTML string using header.png / footer.png
   Table styles are scoped inside .annex-slide to avoid conflicts.
═══════════════════════════════════════════════════════════════ */

const ANNEX_STYLES = `
<style>
.annex-slide{font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:7.5px;color:#111;line-height:1}
.annex-label{font-size:11px;font-weight:700;color:#111;margin:6px 0 5px;letter-spacing:.01em}
.at{width:100%;border-collapse:collapse;border:1px solid #000;table-layout:fixed}
.at td{border:1px solid #000;padding:0;vertical-align:top;overflow:hidden}
/* main header */
.at .mh td{background:#000;color:#fff;font-size:8.5px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;text-align:center;padding:5px 4px;height:18px;line-height:1;vertical-align:middle;border:none}
/* sub header (Annexure A only) */
.at .sh td{background:#000;color:#fff;font-size:7px;font-weight:400;text-align:center;padding:2px 4px;height:11px;line-height:1;vertical-align:middle;border:none}
.at .sp td{background:#e7ecf4;height:7px;border-left:none;border-right:none;border-top:1px solid #000;border-bottom:none}
.at .ch td{background:#000;color:#fff;font-size:6.5px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;text-align:center;vertical-align:middle;padding:5px 3px 6px;height:18px;line-height:1.2;border:1px solid #000}
.at .sc td{background:#fff;color:#000;font-size:7px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;padding:2px 4px 2px 5px;height:11px;line-height:1;vertical-align:middle;border:1px solid #000}
.at .dr td{background:#e7ecf4;height:11px;padding:2px 3px;font-size:7.5px;line-height:1;vertical-align:middle;border:1px solid #000}
.at .dr.wh td{background:#fff}
.at .dr td.nc{text-align:center;padding:2px 1px}
.at .dr.tall td{height:17px;line-height:1.3;vertical-align:middle;padding:2px 3px}
</style>
`;

function annexSlideWrap(label, tableHTML) {
  return `
    <div class="slide">
      <div class="slide-inner"><div class="slide-content">
        <div class="slide-header"><img src="assets/img/header.png" style="width:100%;height:auto;display:block;" /></div>
        <div class="slide-body annex-slide" style="padding:0 28px;overflow:hidden;">
          ${ANNEX_STYLES}
          ${label ? `<div class="annex-label">${label}</div>` : ''}
          ${tableHTML}
        </div>
        <div class="slide-footer"><img src="assets/img/footer.png" style="width:100%;height:auto;display:block;" /></div>
      </div></div>
    </div>`;
}

function generateDynamicAnnexureSlides() {
  const activeAnnexures = getActiveAnnexures().filter(a => !disabledAnnexures.has(a.id));
  if (activeAnnexures.length === 0) return [];

  const MAX_SCORE = 32; 
  const HEADER_SCORE = 4;
  const SECTION_HEADER_SCORE = 1.5; 
  const ROW_SCORE = 1.1; 
  
  let annexureSlidesHTML = [];
  let currentSlideHTML = '';
  let currentScore = 0;
  
  function pushSlide() {
    if (currentSlideHTML) {
      annexureSlidesHTML.push(annexSlideWrap('', currentSlideHTML));
      currentSlideHTML = '';
      currentScore = 0;
    }
  }

  activeAnnexures.forEach(annex => {
    const prefix = annex.id === 'A' || annex.id === 'B1' || annex.id === 'B2' || annex.id === 'C' ? `${annex.id}_` : `${annex.id}_`;
    
    let counter = 1;
    const filteredSections = (annex.sections || [])
      .filter(sec => !disabledAnnexureSections.has(`${prefix}${sec.name}`))
      .map(sec => {
        const visibleRows = sec.rows.filter(row => !disabledAnnexureRows.has(`${prefix}${row.id}`));
        return { ...sec, rows: visibleRows };
      })
      .filter(sec => sec.rows.length > 0);

    if (filteredSections.length === 0) return;

    let colGroup = `<colgroup><col style="width:17px"><col style="width:130px"><col style="width:233px"><col style="width:110px"><col style="width:110px"></colgroup>`;
    if (annex.id === 'C') {
      colGroup = `<colgroup><col style="width:17px"><col style="width:110px"><col style="width:200px"><col style="width:100px"><col style="width:173px"></colgroup>`;
    }
    
    let headingText = annexureHeadingOverrides[annex.id] || '';
    if (!headingText) {
      if (annex.id === 'A') headingText = 'Brand Ambassador — Integrated Plan';
      else if (annex.id === 'B1' || annex.id === 'B2') headingText = 'Creative ATL Scope of Work';
      else if (annex.id === 'C') headingText = 'Digital Scope of Work | All Categories';
      else headingText = annex.subtitle || annex.title || `Annexure ${annex.id}`;
    }

    const labelText = annex.id === 'B1' ? 'Annexure B/1' : (annex.id === 'B2' ? 'Annexure B/2' : (annex.title || `Annexure ${annex.id}`));

    const renderHeaders = (isCont) => {
      let html = `<div class="annex-label" style="margin-top: ${currentScore > 0 ? '16px' : '0'};">${labelText}${isCont ? ' (Continued)' : ''}</div>`;
      html += `<table class="at" style="margin-bottom: 12px;">`;
      html += colGroup;
      html += `<tbody>`;
      html += `<tr class="mh"><td colspan="5">${headingText}</td></tr>`;
      html += `<tr class="sp"><td colspan="5"></td></tr>`;
      html += `<tr class="ch"><td></td><td>Category</td><td>Deliverable / Task</td><td>Quantity / Frequency</td><td>Exclusions / Notes</td></tr>`;
      return html;
    };
    
    const renderRow = (row, ri) => {
      const displayId = counter++;
      const override = annexureOverrides[`${prefix}${row.id}`];
      const taskOverride = annexureTaskOverrides[`${prefix}${row.id}`];
      const detailOverride = annexureDetailOverrides[`${prefix}${row.id}`];
      const catOverride = annexureCatOverrides[`${prefix}${row.id}`];
      const notesOverride = annexureNotesOverrides[`${prefix}${row.id}`];
      
      let col2, col3, col4;
      if (annex.id === 'A') {
        col2 = taskOverride || row.task;
        col3 = detailOverride || row.detail;
        col4 = override || row.timing;
      } else if (annex.id === 'B1' || annex.id === 'B2' || annex.id === 'C') {
        col2 = catOverride || row.cat || '';
        col3 = taskOverride || row.task;
        col4 = override || row.freq;
      } else {
        col2 = taskOverride || row.task;
        col3 = detailOverride || row.detail || '';
        col4 = override || row.timing || row.freq || '';
      }
      const col5 = notesOverride || row.notes || '';
      
      return `
      <tr class="dr ${ri % 2 === 0 ? 'wh' : ''}">
        <td class="nc">${displayId}</td>
        <td>${col2}</td>
        <td>${col3}</td>
        <td>${col4}</td>
        <td>${col5}</td>
      </tr>`;
    };

    let isContinued = false;
    let pendingTableHTML = renderHeaders(isContinued);
    let pendingTableScore = HEADER_SCORE + (currentScore > 0 ? 1.5 : 0);
    
    filteredSections.forEach(sec => {
      const sectionScore = SECTION_HEADER_SCORE + (sec.rows.length * ROW_SCORE);
      
      if (currentScore + pendingTableScore + sectionScore > MAX_SCORE) {
        if (currentScore === 0 && pendingTableScore + sectionScore > MAX_SCORE) {
          // Section alone exceeds slide size, split it row by row
          currentSlideHTML += pendingTableHTML;
          currentSlideHTML += `<tr class="sc"><td colspan="5">${sec.name}</td></tr>`;
          currentScore += pendingTableScore + SECTION_HEADER_SCORE;
          
          sec.rows.forEach((row, ri) => {
            if (currentScore + ROW_SCORE > MAX_SCORE) {
              currentSlideHTML += `</tbody></table>`;
              pushSlide();
              isContinued = true;
              currentSlideHTML += renderHeaders(isContinued);
              currentScore = HEADER_SCORE;
            }
            currentSlideHTML += renderRow(row, ri);
            currentScore += ROW_SCORE;
          });
          
          pendingTableHTML = "";
          pendingTableScore = 0;
          return;
        } else {
          // Close table and push
          if (pendingTableHTML && pendingTableHTML !== renderHeaders(isContinued)) {
            currentSlideHTML += pendingTableHTML + `</tbody></table>`;
          }
          pushSlide();
          isContinued = true;
          pendingTableHTML = renderHeaders(isContinued);
          pendingTableScore = HEADER_SCORE;
          
          // Re-evaluate the current section on the new slide
          if (pendingTableScore + sectionScore > MAX_SCORE) {
             // Still doesn't fit? It's larger than a whole page, so split it
             currentSlideHTML += pendingTableHTML;
             currentSlideHTML += `<tr class="sc"><td colspan="5">${sec.name}</td></tr>`;
             currentScore += pendingTableScore + SECTION_HEADER_SCORE;
             
             sec.rows.forEach((row, ri) => {
               if (currentScore + ROW_SCORE > MAX_SCORE) {
                 currentSlideHTML += `</tbody></table>`;
                 pushSlide();
                 currentSlideHTML += renderHeaders(isContinued);
                 currentScore = HEADER_SCORE;
               }
               currentSlideHTML += renderRow(row, ri);
               currentScore += ROW_SCORE;
             });
             pendingTableHTML = "";
             pendingTableScore = 0;
             return;
          }
        }
      }
      
      pendingTableHTML += `<tr class="sc"><td colspan="5">${sec.name}</td></tr>`;
      sec.rows.forEach((row, ri) => {
        pendingTableHTML += renderRow(row, ri);
      });
      pendingTableScore += sectionScore;
    });

    if (pendingTableHTML && pendingTableHTML !== renderHeaders(isContinued)) {
      currentSlideHTML += pendingTableHTML + `</tbody></table>`;
      currentScore += pendingTableScore;
    }
  });

  if (currentSlideHTML) {
    pushSlide();
  }

  return annexureSlidesHTML;
}

function annexSlideA(sections) {
  let counter = 1;
  const filteredSections = sections
    .filter(sec => !disabledAnnexureSections.has(`A_${sec.name}`))
    .map(sec => {
      const visibleRows = sec.rows.filter(row => !disabledAnnexureRows.has(`A_${row.id}`));
      return { ...sec, rows: visibleRows };
    })
    .filter(sec => sec.rows.length > 0);

  const rowsHTML = filteredSections.map(sec => {
    const sName = `<tr class="sc"><td colspan="5">${sec.name}</td></tr>`;
    const sRows = sec.rows.map((row, ri) => {
      const override = annexureOverrides[`A_${row.id}`];
      const taskOverride = annexureTaskOverrides[`A_${row.id}`];
      const detailOverride = annexureDetailOverrides[`A_${row.id}`];
      const notesOverride = annexureNotesOverrides[`A_${row.id}`];
      const displayId = counter++;
      return `
      <tr class="dr ${ri % 2 === 0 ? 'wh' : ''}">
        <td class="nc">${displayId}</td>
        <td>${taskOverride || row.task}</td>
        <td>${detailOverride || row.detail}</td>
        <td>${override || row.timing}</td>
        <td>${notesOverride || row.notes}</td>
      </tr>`;
    }).join('');
    return sName + sRows;
  }).join('');

  const headingText = annexureHeadingOverrides['A'] || 'Brand Ambassador — Integrated Plan';

  const t = `
  <table class="at">
    <colgroup><col style="width:17px"><col style="width:130px"><col style="width:233px"><col style="width:110px"><col style="width:110px"></colgroup>
    <tbody>
    <tr class="mh"><td colspan="5">${headingText} &nbsp;&nbsp;</td></tr>
    <tr class="sp"><td colspan="5"></td></tr>
    <tr class="ch"><td></td><td>Category</td><td>Deliverable / Task</td><td>Quantity / Frequency</td><td>Exclusions / Notes</td></tr>
    ${rowsHTML}
    </tbody>
  </table>`;
  return annexSlideWrap('Annexure A', t);
}

function annexSlideB1(sections) {
  let counter = 1;
  const filteredSections = sections
    .filter(sec => !disabledAnnexureSections.has(`B1_${sec.name}`))
    .map(sec => {
      const visibleRows = sec.rows.filter(row => !disabledAnnexureRows.has(`B1_${row.id}`));
      return { ...sec, rows: visibleRows };
    })
    .filter(sec => sec.rows.length > 0);

  const rowsHTML = filteredSections.map(sec => {
    const sName = `<tr class="sc"><td colspan="5">${sec.name}</td></tr>`;
    const sRows = sec.rows.map((row, ri) => {
      const override = annexureOverrides[`B1_${row.id}`];
      const taskOverride = annexureTaskOverrides[`B1_${row.id}`];
      const catOverride = annexureCatOverrides[`B1_${row.id}`];
      const notesOverride = annexureNotesOverrides[`B1_${row.id}`];
      const displayId = counter++;
      return `
      <tr class="dr ${ri % 2 === 0 ? 'wh' : ''}">
        <td class="nc">${displayId}</td>
        <td>${catOverride || row.cat || ''}</td>
        <td>${taskOverride || row.task}</td>
        <td>${override || row.freq}</td>
        <td>${notesOverride || row.notes}</td>
      </tr>`;
    }).join('');
    return sName + sRows;
  }).join('');

  const headingText = annexureHeadingOverrides['B1'] || 'Creative ATL Scope of Work';

  const t = `
  <table class="at">
    <colgroup><col style="width:17px"><col style="width:130px"><col style="width:233px"><col style="width:110px"><col style="width:110px"></colgroup>
    <tbody>
    <tr class="mh"><td colspan="5">${headingText} &nbsp;</td></tr>
    <tr class="sp"><td colspan="5"></td></tr>
    <tr class="ch"><td></td><td>Category</td><td>Deliverable / Task</td><td>Quantity / Frequency</td><td>Exclusions / Notes</td></tr>
    ${rowsHTML}
    </tbody>
  </table>`;
  return annexSlideWrap('Annexure B/1', t);
}

function annexSlideB2(sections) {
  let counter = 1;
  const filteredSections = sections
    .filter(sec => !disabledAnnexureSections.has(`B2_${sec.name}`))
    .map(sec => {
      const visibleRows = sec.rows.filter(row => !disabledAnnexureRows.has(`B2_${row.id}`));
      return { ...sec, rows: visibleRows };
    })
    .filter(sec => sec.rows.length > 0);

  const rowsHTML = filteredSections.map(sec => {
    const sName = `<tr class="sc"><td colspan="5">${sec.name}</td></tr>`;
    const sRows = sec.rows.map((row, ri) => {
      const override = annexureOverrides[`B2_${row.id}`];
      const taskOverride = annexureTaskOverrides[`B2_${row.id}`];
      const catOverride = annexureCatOverrides[`B2_${row.id}`];
      const notesOverride = annexureNotesOverrides[`B2_${row.id}`];
      const displayId = counter++;
      return `
      <tr class="dr ${ri % 2 === 0 ? 'wh' : ''}">
        <td class="nc">${displayId}</td>
        <td>${catOverride || row.cat || ''}</td>
        <td>${taskOverride || row.task}</td>
        <td>${override || row.freq}</td>
        <td>${notesOverride || row.notes}</td>
      </tr>`;
    }).join('');
    return sName + sRows;
  }).join('');

  const headingText = annexureHeadingOverrides['B2'] || 'Creative ATL Scope of Work';

  const t = `
  <table class="at">
    <colgroup><col style="width:17px"><col style="width:130px"><col style="width:233px"><col style="width:110px"><col style="width:110px"></colgroup>
    <tbody>
    <tr class="mh"><td colspan="5">${headingText}</td></tr>
    <tr class="sp"><td colspan="5"></td></tr>
    <tr class="ch"><td></td><td>Category</td><td>Deliverable / Task</td><td>Quantity / Frequency</td><td>Exclusions / Notes</td></tr>
    ${rowsHTML}
    </tbody>
  </table>`;
  return annexSlideWrap('Annexure B/2', t);
}

function annexSlideC(sections) {
  let counter = 1;
  const filteredSections = sections
    .filter(sec => !disabledAnnexureSections.has(`C_${sec.name}`))
    .map(sec => {
      const visibleRows = sec.rows.filter(row => !disabledAnnexureRows.has(`C_${row.id}`));
      return { ...sec, rows: visibleRows };
    })
    .filter(sec => sec.rows.length > 0);

  const rowsHTML = filteredSections.map(sec => {
    const sName = `<tr class="sc"><td colspan="5">${sec.name}</td></tr>`;
    const sRows = sec.rows.map((row, ri) => {
      const override = annexureOverrides[`C_${row.id}`];
      const taskOverride = annexureTaskOverrides[`C_${row.id}`];
      const catOverride = annexureCatOverrides[`C_${row.id}`];
      const notesOverride = annexureNotesOverrides[`C_${row.id}`];
      const displayId = counter++;
      return `
      <tr class="dr ${ri % 2 === 0 ? 'wh' : ''}">
        <td class="nc">${displayId}</td>
        <td>${catOverride || row.cat || ''}</td>
        <td>${taskOverride || row.task}</td>
        <td>${override || row.freq}</td>
        <td>${notesOverride || row.notes}</td>
      </tr>`;
    }).join('');
    return sName + sRows;
  }).join('');

  const headingText = annexureHeadingOverrides['C'] || 'Digital Scope of Work | All Categories';

  const t = `
  <table class="at">
    <colgroup><col style="width:17px"><col style="width:110px"><col style="width:200px"><col style="width:100px"><col style="width:173px"></colgroup>
    <tbody>
    <tr class="mh"><td colspan="5">${headingText}</td></tr>
    <tr class="sp"><td colspan="5"></td></tr>
    <tr class="ch"><td></td><td>Category</td><td>Deliverable / Task</td><td>Quantity / Frequency</td><td>Exclusions / Notes</td></tr>
    ${rowsHTML}
    </tbody>
  </table>`;
  return annexSlideWrap('Annexure C', t);
}

function annexSlideCustom(annex) {
  let counter = 1;
  const filteredSections = (annex.sections || [])
    .filter(sec => !disabledAnnexureSections.has(`${annex.id}_${sec.name}`))
    .map(sec => {
      const visibleRows = sec.rows.filter(row => !disabledAnnexureRows.has(`${annex.id}_${row.id}`));
      return { ...sec, rows: visibleRows };
    })
    .filter(sec => sec.rows.length > 0);

  const rowsHTML = filteredSections.map(sec => {
    const sName = `<tr class="sc"><td colspan="5">${sec.name}</td></tr>`;
    const sRows = sec.rows.map((row, ri) => {
      const override = annexureOverrides[`${annex.id}_${row.id}`];
      const taskOverride = annexureTaskOverrides[`${annex.id}_${row.id}`];
      const detailOverride = annexureDetailOverrides[`${annex.id}_${row.id}`];
      const notesOverride = annexureNotesOverrides[`${annex.id}_${row.id}`];
      const displayId = counter++;
      return `
      <tr class="dr ${ri % 2 === 0 ? 'wh' : ''}">
        <td class="nc">${displayId}</td>
        <td>${taskOverride || row.task}</td>
        <td>${detailOverride || row.detail || ''}</td>
        <td>${override || row.timing || row.freq || ''}</td>
        <td>${notesOverride || row.notes || ''}</td>
      </tr>`;
    }).join('');
    return sName + sRows;
  }).join('');

  const headingText = annexureHeadingOverrides[annex.id] || annex.subtitle || annex.title || `Annexure ${annex.id}`;

  const t = `
  <table class="at">
    <colgroup><col style="width:17px"><col style="width:130px"><col style="width:233px"><col style="width:110px"><col style="width:110px"></colgroup>
    <tbody>
    <tr class="mh"><td colspan="5">${headingText} &nbsp;&nbsp;</td></tr>
    <tr class="sp"><td colspan="5"></td></tr>
    <tr class="ch"><td></td><td>Category</td><td>Deliverable / Task</td><td>Quantity / Frequency</td><td>Exclusions / Notes</td></tr>
    ${rowsHTML}
    </tbody>
  </table>`;
  return annexSlideWrap(annex.title || `Annexure ${annex.id}`, t);
}