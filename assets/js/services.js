const SERVICES = {
  brand_ambassador: {
    section: 'Branding',
    name: 'Brand Ambassador – Way Forward',
    blocks: [
      { title: '{Ambassador} Integration in the Brand', items: ['Tone of Voice', 'TVC Conceptualisation', 'Photoshoot Direction', 'Packaging Alignment', 'Social Media Integration', 'Retail and BTL', 'D2C and Ecommerce', 'Print and Outdoor', 'Promotion and Offers', 'Influencer Colab', 'Internal and Trade Communication'] }
    ]
  },
  brand_manual: {
    section: 'Branding',
    name: 'Brand Manual',
    blocks: [
      { items: ['Vision', 'Mission', 'Purpose', 'Tone of Voice', 'Brand Logo and Typographic Style', 'Do\'s and Don\'ts regarding use of the logo', 'Determining the exclusion zone for the logo', 'Look and Feel of the Brand', 'Adaptation Formats', 'Color Guidelines — CMYK / RGB / Digital'] }
    ]
  },
  brand_digital_assets: {
    section: 'Branding',
    name: 'Brand Manual — Website / Digital Assets',
    blocks: [
      { items: ['Color', 'Typography', 'Logo Animation', 'Icon Style & Bank', 'Button Style', 'Home Page Template only', 'Online Store — Separate Scope'] }
    ]
  },
  brand_communication: {
    section: 'Branding',
    name: 'Brand Communication',
    blocks: [
      { items: ['Digital Launch Campaign', 'Virtual Instore Campaign', 'Outdoors', 'Print Campaign', 'Direct Mailers', 'Gift Ideas', 'Product Story Collaterals', 'All other collateral + ATL and BTL requirements'] }
    ]
  },
  packaging: {
    section: 'Branding',
    name: 'Packaging',
    blocks: [
      { items: ['Designed with a Thought — Environment on our mind', 'Designed with Care — People who use them on our mind', 'Designed to Work — Protection, preservation, and logistics on our mind', 'Designed with Materials — Feel on our mind', 'Designed with Money — Keeping costs in our mind'] }
    ]
  },
  social_media: {
    section: 'Digital & Social',
    name: 'Social Media',
    blocks: [
      { items: ['Brand Communication', 'Product Communication', 'Story Campaigns', 'Customer Engagement Ideas', 'Topical Engagements', 'Brand Ambassadors Stories'] },
      { title: 'Form of Content', items: ['Static, Image, Typography', 'Illustration, Infographics and GIFs', 'Video (Edits Only)'] },
      { title: 'Platforms', items: ['Facebook', 'Instagram', 'YouTube', 'Twitter', 'LinkedIn', 'Quora', 'Sorry — No TikTok'] }
    ]
  },
  content_seo: {
    section: 'Digital & Social',
    name: 'Content & Copywriting',
    blocks: [
      { items: ['Writing, editing and publishing the content', 'Create monthly content bucket and calendar', 'Emailers and HTML', 'Articles', 'Quora and blogs'] },
    ]
  },
  SEO_GEO: {
    section: 'Digital & Social',
    name: 'SEO/GEO',
    blocks: [
      { items: ['URL Structure', 'Page Titles & Meta Descriptions', 'Body Tags (H1–H4)', 'Keyword Density', 'Image SEO', 'Internal Linking', 'Canonical Tags', '301 Redirects', 'Question and Answer Sites', 'Social Bookmarking', 'Press Releases', 'Classifieds', 'Blog & PPT/PDF Submission'] }
    ]
  },
  social_listening: {
    section: 'Digital & Social',
    name: 'Social Listening',
    blocks: [
      { items: ['Blogs, Forums, News, Complaint Forums', 'Twitter, Facebook pages (all)', 'Google Plus, Instagram, YouTube', 'Twitter Mentions & DMs', 'Facebook Inbox, comments, user posts, ratings', 'Instagram comments, locations', 'LinkedIn company page comments', 'YouTube channel comments', 'Google Business Reviews, Emails'] }
    ]
  },
  social_crm: {
    section: 'Digital & Social',
    name: 'Social CRM',
    blocks: [
      { items: ['Responding to customers', 'Escalation Matrix – workflow', 'Agent Queuing Feature', 'Ticketing', 'Classification (Tagging) – can be automated', 'Assigning tasks to team – can be automated', 'Integration with CRM – using Third Party APIs'] }
    ]
  },
  analytics_business: {
    section: 'Digital & Social',
    name: 'Analytics of Business',
    blocks: [
      { items: ['Share of Voice – Volume Analysis', 'Sentiment Analysis', 'Media Type Analysis', 'Twitter Campaign Report', 'Instagram Campaign Report', 'Classification Analysis Report', 'Automated Listening Summary Report', 'TAT Reports – for response management'] }
    ]
  },
  analytics_reporting: {
    section: 'Digital & Social',
    name: 'Reporting',
    blocks: [
      { items: ['Monthly Reports — Traffic, Social Media Followers, ORM', 'Monthly Competitors Activity Summary', 'Keywords Positioning / Social Media Metrics'] }
    ]
  },
  google_analytics: {
    section: 'Digital & Social',
    name: 'Google Analytics',
    blocks: [
      { items: ['Setup and management', 'Fix issues and regular maintenance'] }
    ]
  },
  website_process: {
    section: 'Website',
    name: 'Website — Process',
    blocks: [
      { title: 'Goals', para: 'Firstly, we\'ll work together to establish goals for the website and how they fit into the wider organisational goals.', items: [] },
      { title: 'Discovery', para: 'Once we\'ve established the goals of the website, we\'ll then work to identify where the opportunities lie. This can involve some or all of the following:', boldItems: [{ bold: 'Data analysis', text: ' — We\'ll look at existing website data, including traffic sources, landing pages, conversion rates etc. to understand where the biggest opportunities lie for improving the existing website.' }, { bold: 'Customer interviews', text: ' — We\'ll conduct interviews with your customers to understand how customers use the product, what they were using previously, what problems it solves for them, etc. This will help us write copy that resonates with your audience and the products they are looking for.' }, { bold: 'Internal interviews', text: ' — We\'ll interview a number of internal people to understand how the wider business works and how we engage with the customer across their lifecycle. This will allow us to understand how best to convert people from a visitor to your website to a loyal customer.' }], items: [] },
      { title: 'Strategy', para: 'Once we\'ve completed the discovery phase, we\'ll then come up with an overarching strategy for your website. This will include information like what pages we\'ll have, how navigation will work, visual style, conversion paths, etc. This strategy will be driven by the insights gained from the Discovery stage, and will leverage our deep knowledge of this space and website design best practices. We\'ll present this strategy back to you for review, iteration & approval.', items: [] },
      { title: 'Wireframing', para: 'Once the strategy is agreed on, we\'ll then do a basic wireframe of your new website that will show the navigation, page layouts, copy, etc. This will allow you to understand how the site will look and what messages will be conveyed, and will allow us to iterate quickly until everyone is aligned.', items: [] },
      { title: 'Design', para: 'Once the wireframe is agreed on, we\'ll then turn the wireframe into a high-fidelity design that shows exactly how each page of the website will look. We will present this back to you as an interactive prototype that will allow you to click through the website and experience it as if it was live. We\'ll then iterate and make any final changes in this stage before signing off and beginning development.', items: [] },
      { title: 'Development', para: 'Once the design has been agreed on and signed off, we\'ll then develop the website on the core PHP, developing CMS limited to news, blog and career sections. We use bootstrap design for better UI/UX and thus refrain ourselves from using any specific CMS.', items: [] },
      { title: 'Signoff, Launch and Training', para: 'Once the website is built, we\'ll jump on a video call and walk you through the new website. Once you\'ve signed off on it, we\'ll push it live and archive your old website in case you need anything from it. Finally, we\'ll do a basic training session with your marketing team so they understand how to edit the website when they need.', items: [] }
    ]
  },
  website: {
    section: 'Website',
    name: 'Website — Deliverables',
    blocks: [
      { items: ['Website strategy document', 'Wireframes for review and agreement', 'Full designs for review and agreement', 'Final mobile-responsive website', 'Note: SEO optimisation, Search Engine Submission, other branding assets are outside scope'] }
    ]
  },
  influencer_marketing: {
    section: 'Digital & Social',
    name: 'Influencer Marketing',
    blocks: [
      { title: 'Campaign Strategy', items: ['Understanding campaign objectives (awareness, conversion, reach)', 'Audience persona mapping & influencer category selection (Mega, Macro, Micro, Nano)', 'Narrative and storytelling development for influencer content'] },
      { title: 'Influencer Discovery & Vetting', items: ['Searching for relevant influencers across platforms (Instagram, YouTube, etc.)', 'Vetting for authenticity, engagement rates, and brand fit', 'Managing influencer outreach and initial negotiations'] },
      { title: 'Content Coordination', items: ['Briefing influencers on campaign goals and creative requirements', 'Reviewing and approving influencer content before posting', 'Managing posting schedules and cross-platform synchronization'] },
      { title: 'Relationship Management', items: ['Managing contracts and legal agreements with influencers', 'Handling payments and logistical requirements', 'Building long-term relationships for brand advocacy'] },
      { title: 'Performance Tracking', items: ['Monitoring real-time campaign performance', 'Tracking key metrics: Reach, Impressions, Engagement, and Conversions', 'Detailed post-campaign reporting and ROI analysis'] }
    ]
  },
  performance_marketing: {
    section: 'Digital & Social',
    name: 'Performance Marketing',
    blocks: [
      { title: 'Strategy & Planning', items: ['Defining KPIs (CPA, ROAS, CPC) and conversion goals', 'Budget allocation across platforms (Meta, Google, LinkedIn)', 'Funnel strategy development (TOFU, MOFU, BOFU)'] },
      { title: 'Campaign Execution', items: ['Setting up and managing paid search and social campaigns', 'Continuous A/B testing for creative, copy, and audience targeting', 'Real-time bid optimization and budget management'] },
      { title: 'Data & Analytics', items: ['Advanced pixel and tracking setup (GTM, Meta Pixel)', 'Conversion rate optimization (CRO) for landing pages', 'Attribution modeling and multi-touch analysis'] },
      { title: 'Platforms Covered', items: ['Meta Ads (Facebook & Instagram)', 'Google Ads (Search, Display, Video/YouTube, PMax)', 'LinkedIn Ads', 'Amazon Advertising (AMS)', 'Twitter/X Ads & Snapchat Ads'] }
    ]
  },
  orm: {
    section: 'Digital & Social',
    name: 'Online Reputation Management (ORM)',
    blocks: [
      { title: 'Monitoring & Listening', items: ['24/7 brand mention monitoring across social, news, and forums', 'Sentiment analysis (positive, neutral, negative)', 'Competitor reputation tracking'] },
      { title: 'Crisis Management', items: ['Identifying potential PR crises before they escalate', 'Developing response strategies for negative feedback or misinformation', 'Rapid-response team for real-time issue resolution'] },
      { title: 'Engagement & Support', items: ['Responding to customer reviews and comments (Google, Yelp, Trustpilot, Facebook)', 'Improving brand perception through positive storytelling', 'Encouraging and highlighting customer testimonials'] }
    ]
  },
  media_buying: {
    section: 'Digital & Social',
    name: 'Media Buying & Planning',
    blocks: [
      { title: 'Strategic Planning', items: ['Identifying target audience segments and media habits', 'Selection of media channels for maximum ROI', 'Defining reach and frequency objectives'] },
      { title: 'Negotiation & Buying', items: ['Negotiating best rates for digital and traditional ad placements', 'Purchasing ad space across TV, Radio, Print, and Outdoor (ATL)', 'Programmatic buying for targeted digital display'] },
      { title: 'Campaign Auditing', items: ['Verifying ad placements and proof of execution (Third-party tracking)', 'Post-buy analysis to ensure delivered reach matches planning', 'Budget reconciliation and financial reporting'] }
    ]
  },
  ecommerce: {
    section: 'Digital & Social',
    name: 'E-commerce Management',
    blocks: [
      { title: 'Platform Management', items: ['Setup and management of Shopify, Magento, or WooCommerce stores', 'Managing listings on marketplaces (Amazon, Flipkart, Myntra, Nykaa)', 'Inventory and pricing synchronization across platforms'] },
      { title: 'Catalog & Creative', items: ['Product photography and high-quality image processing', 'Writing conversion-focused product descriptions (A+ Content / Brand Store)', 'Managing product reviews and ratings'] },
      { title: 'Growth Strategy', items: ['Marketplace advertising (AMS, Meta CPAS)', 'Implementing loyalty programs and discount strategies', 'Retention marketing via Email/SMS and WhatsApp automation'] }
    ]
  },
  video_production: {
    section: 'Branding',
    name: 'Motion Graphics & Video Production',
    blocks: [
      { title: 'Pre-production', items: ['Concept development and scriptwriting', 'Storyboarding and visual style exploration', 'Talent scouting and location planning (for live shoots)'] },
      { title: 'Production', items: ['2D & 3D motion graphics and animation', 'Video editing and color grading', 'Sound design and voiceover recording'] },
      { title: 'Post-production', items: ['Adding VFX and special effects', 'Formatting for different platforms (Reels, YouTube, TVC, LinkedIn)', 'Final output delivery in multiple resolutions'] }
    ]
  },
  annexures: {
    section: 'Annexures',
    name: 'Annexures',
    blocks: [
      { title: 'Annexures', items: ['Annexure A', 'Annexure B1', 'Annexure B2', 'Annexure C'] }
    ]
  }
};
