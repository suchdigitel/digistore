/* script.js - full site logic
   - Click Category -> subcategories appear + category products view
   - Click Subcategory -> ONLY products of that subcategory (fixed)
   - Ratings (1-5 stars) stored in localStorage anonymously
   - Buy modal -> generate product code, copy, QR shown on main page
   - Proceed to form -> saves previous page in sessionStorage so form Back returns
   - Video on main page: replace src in index.html (assets/payment-demo.mp4 or YouTube iframe)
*/

/* ========== CONFIG - EDIT HERE ========== */
const CONFIG = {
  CONTACT_NUMBER: '+91-9876543210',         // change your contact number here
  UPI_ID: 'suchiangsanki3@okaxis',                   // replace with your actual UPI ID (used to generate QR on main page)
  FORM_PAGE: 'form.html'                    // form page (embedded Google Form); keep as provided unless you want a direct external URL
};
/* ========================================== */

/* quick helpers */
const $ = id => document.getElementById(id);
const escapeHtml = s => (s+'').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[c]));

/* ========== PRODUCTS - EDIT / ADD ITEMS HERE ==========
Structure:
PRODUCTS = {
  "categorySlug": [
    {
      name: "Subcategory Name",
      img: "URL for subcategory preview",
      products: [
        { id:"unique-id", title:"Product Title", img:"assets/xxx.jpg", short:"short desc", long:"long desc", price:"₹199" },
        ...
      ]
    },
    ...
  ],
  ...
}

- To add a category: add a new key at top-level with array of subcategory objects.
- To add a subcategory: push new object into the category array.
- To add a product: append a product object into the subcategory's products array.
- Ensure JSON syntax (commas/braces) is valid.
====================================================== */          
     const PRODUCTS = {
  "Ebooks": [
    {
      name: "Mind & Psychology / Self-Help",
      img: "https://raw.githubusercontent.com/suchdigitel/digistore/refs/heads/main/Images/IMG_20251013_141144.png",
      products: [
        { id:"EB-MP-01", title:"Overcoming Imposter Syndrome", img:"https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=1200&auto=format&fit=crop", short:"Tools to rebuild confidence", long:"A practical guide to recognise and overcome feelings of fraudulence, with exercises and reflections.", price:"₹199" },
        { id:"EB-MP-02", title:"Ultimate Guide Towards Emotional Control", img:"https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1200&auto=format&fit=crop", short:"Emotional regulation strategies", long:"Step-by-step methods for managing strong emotions and building emotional resilience.", price:"₹199" },
        { id:"EB-MP-03", title:"Anxious but Awesome", img:"https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1200&auto=format&fit=crop", short:"Practical anxiety coping methods", long:"Short strategies to manage anxiety in daily life with simple practices.", price:"₹149" },
        { id:"EB-MP-04", title:"The 5-minute Stress Solution", img:"https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&auto=format&fit=crop", short:"Quick stress relief hacks", long:"Micro-practices for instant calm throughout your day.", price:"₹99" },
        { id:"EB-MP-05", title:"The Anxiety First-Aid Kit", img:"https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=1200&auto=format&fit=crop", short:"Emergency tools for panic", long:"A concise kit of steps to follow when anxiety spikes or panic sets in.", price:"₹129" },
        { id:"EB-MP-06", title:"Mindset Shift for Abundance", img:"https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1200&auto=format&fit=crop", short:"Abundance mindset techniques", long:"Exercises to reshape limiting beliefs and invite abundance into your life.", price:"₹179" }
      ]
    },
    {
      name: "Business & Productivity",
      img: "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?q=80&w=1200&auto=format&fit=crop",
      products: [
        { id:"EB-BP-01", title:"Personal Brand Blueprint", img:"https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?q=80&w=1200&auto=format&fit=crop", short:"Build & grow your brand", long:"A roadmap for positioning yourself and creating authentic brand assets.", price:"₹249" },
        { id:"EB-BP-02", title:"Time Audit & Life Mapping Guide", img:"https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?q=80&w=1200&auto=format&fit=crop", short:"Track time & reclaim focus", long:"Work through time audits, priorities, and weekly mapping to boost productivity.", price:"₹149" },
        { id:"EB-BP-03", title:"The Art of Deep Work", img:"https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?q=80&w=1200&auto=format&fit=crop", short:"Focus & output techniques", long:"Methods and rituals to achieve deep, distraction-free work.", price:"₹199" },
        { id:"EB-BP-04", title:"Passive Income Playbook for Beginners", img:"https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?q=80&w=1200&auto=format&fit=crop", short:"Start passive revenue streams", long:"Intro to practical passive income strategies for creators.", price:"₹199" },
        { id:"EB-BP-05", title:"Scaling Your Freelance Business", img:"https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?q=80&w=1200&auto=format&fit=crop", short:"Grow your freelance business", long:"Operations, pricing and systems for scaling freelancers into agencies.", price:"₹299" }
      ]
    },
    {
      name: "Relationships & Communication",
      img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1200&auto=format&fit=crop",
      products: [
        { id:"EB-RC-01", title:"Personal Growth Within the Partnership", img:"https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1200&auto=format&fit=crop", short:"Grow while in relationship", long:"A guide to individual and mutual growth inside partnerships.", price:"₹169" },
        { id:"EB-RC-02", title:"Communication Mastery", img:"https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1200&auto=format&fit=crop", short:"Communicate with clarity", long:"Tools to express needs, listen deeply, and resolve conflict.", price:"₹149" },
        { id:"EB-RC-03", title:"Building a Shared Life and Managing Conflict", img:"https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1200&auto=format&fit=crop", short:"Rituals & conflict tools", long:"Practical steps for building systems in shared lives.", price:"₹149" },
        { id:"EB-RC-04", title:"Strengthening Communication and Connection", img:"https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1200&auto=format&fit=crop", short:"Deepen intimacy", long:"Exercises and prompts to increase connection.", price:"₹129" }
      ]
    },
    {
      name: "Health & Wellness",
      img: "https://images.unsplash.com/photo-1506806732259-39c2d0268443?q=80&w=1200&auto=format&fit=crop",
      products: [
        { id:"EB-HW-01", title:"Functional Food for Pregnancy", img:"https://images.unsplash.com/photo-1506806732259-39c2d0268443?q=80&w=1200&auto=format&fit=crop", short:"Nutrition guide", long:"Nutrition and functional foods tailored for pregnancy.", price:"₹199" },
        { id:"EB-HW-02", title:"Pelvic Power", img:"https://images.unsplash.com/photo-1506806732259-39c2d0268443?q=80&w=1200&auto=format&fit=crop", short:"Strength & rehab", long:"Exercises and guides for pelvic health.", price:"₹149" }
      ]
    },
    {
      name: "Science Fiction",
      img: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=1200&auto=format&fit=crop",
      products: [
        { id:"EB-SF-01", title:"Last Human Download", img:"https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=1200&auto=format&fit=crop", short:"A lone AI's last act", long:"Sci-fi narrative about identity & data.", price:"₹199" }
      ]
    },
    {
      name: "Mystery / Thriller",
      img: "https://images.unsplash.com/photo-1506459225024-1428097a7e18?q=80&w=1200&auto=format&fit=crop",
      products: [
        { id:"EB-MY-01", title:"The Algorithm Detective", img:"https://images.unsplash.com/photo-1506459225024-1428097a7e18?q=80&w=1200&auto=format&fit=crop", short:"Tech noir mystery", long:"A detective story about algorithmic bias.", price:"₹199" },
        { id:"EB-MY-02", title:"Echoes of the Forgotten Town", img:"https://images.unsplash.com/photo-1506459225024-1428097a7e18?q=80&w=1200&auto=format&fit=crop", short:"Atmospheric historical mystery", long:"A small town with big secrets.", price:"₹179" },
        { id:"EB-MY-03", title:"The Second Chance Promise", img:"https://images.unsplash.com/photo-1506459225024-1428097a7e18?q=80&w=1200&auto=format&fit=crop", short:"Thriller or drama", long:"A story of redemption and danger.", price:"₹179" }
      ]
    },
    {
      name: "Children / Young Readers",
      img: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop",
      products: [
        { id:"EB-CH-01", title:"The Little Kitchen Explorer", img:"https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop", short:"Interactive learning for kids", long:"A playful book encouraging kitchen experiments for children.", price:"₹129" }
      ]
    }
  ],

  /* OTHER categories (you asked to auto-fill others) - sample products added */
  
  "Cheat Sheets": [
    {
      "name": "Social Media & Content Strategy",
      "img": "https://images.unsplash.com/photo-1487014679447-9f8336841d58?q=80&w=1200&auto=format&fit=crop",
      "products": [
        {
          "id": "CS-SM-01",
          "title": "Ultimate Hashtag Strategy",
          "img": "https://images.unsplash.com/photo-1487014679447-9f8336841d58?q=80&w=1200&auto=format&fit=crop",
          "short": "Trending & evergreen hashtag sets.",
          "long": "A complete guide to finding and layering hashtags for maximum reach and target audience engagement.",
          "price": "₹69"
        },
        {
          "id": "CS-SM-02",
          "title": "Video Hook Formulas",
          "img": "https://images.unsplash.com/photo-1487014679447-9f8336841d58?q=80&w=1200&auto=format&fit=crop",
          "short": "10 attention-grabbing openers.",
          "long": "Ready-to-use script templates to hook viewers in the first 3 seconds of any short-form video.",
          "price": "₹49"
        },
        {
          "id": "CS-SM-03",
          "title": "Perfect Posting Schedule",
          "img": "https://images.unsplash.com/photo-1487014679447-9f8336841d58?q=80&w=1200&auto=format&fit=crop",
          "short": "Optimal times for all platforms.",
          "long": "A data-backed schedule showing the best day and time to post on Instagram, TikTok, LinkedIn, and X.",
          "price": "₹39"
        },
        {
          "id": "CS-SM-04",
          "title": "Social Media Image Sizing",
          "img": "https://images.unsplash.com/photo-1487014679447-9f8336841d58?q=80&w=1200&auto=format&fit=crop",
          "short": "Quick size reference for 6 platforms.",
          "long": "The definitive visual guide for all major image dimensions: posts, stories, reels, carousels, and profile headers.",
          "price": "₹49"
        }
      ]
    },
    {
      "name": "Design & Creativity",
      "img": "https://images.unsplash.com/photo-1492724441997-5dc865305da7?q=80&w=1200&auto=format&fit=crop",
      "products": [
        {
          "id": "CS-DG-01",
          "title": "Canva Shortcuts and Tips",
          "img": "https://images.unsplash.com/photo-1492724441997-5dc865305da7?q=80&w=1200&auto=format&fit=crop",
          "short": "Master the canvas with hotkeys.",
          "long": "A powerful list of keyboard shortcuts and hidden tips to speed up your design workflow in Canva by 50%.",
          "price": "₹29"
        },
        {
          "id": "CS-DG-02",
          "title": "Color Psychology for Brands",
          "img": "https://images.unsplash.com/photo-1492724441997-5dc865305da7?q=80&w=1200&auto=format&fit=crop",
          "short": "Match feelings to your color palette.",
          "long": "Quick guide on how different colors influence emotion and perception, perfect for branding and marketing materials.",
          "price": "₹59"
        }
      ]
    },
    {
      "name": "Business & Productivity",
      "img": "https://images.unsplash.com/photo-1517430816045-df4b7de166a1?q=80&w=1200&auto=format&fit=crop",
      "products": [
        {
          "id": "CS-BP-01",
          "title": "AI Prompt Engineering",
          "img": "https://images.unsplash.com/photo-1517430816045-df4b7de166a1?q=80&w=1200&auto=format&fit=crop",
          "short": "Formulas for better AI outputs.",
          "long": "Structure and keywords to use in your prompts to generate higher-quality text, code, and images from large language models.",
          "price": "₹99"
        },
        {
          "id": "CS-BP-02",
          "title": "Project Management Workflow",
          "img": "https://images.unsplash.com/photo-1517430816045-df4b7de166a1?q=80&w=1200&auto=format&fit=crop",
          "short": "Step-by-step task flow.",
          "long": "A visual workflow chart detailing the stages of a project, from initiation and planning to execution and closure.",
          "price": "₹69"
        },
        {
          "id": "CS-BP-03",
          "title": "Freelancer Proposal Template",
          "img": "https://images.unsplash.com/photo-1517430816045-df4b7de166a1?q=80&w=1200&auto=format&fit=crop",
          "short": "Editable proposal for clients.",
          "long": "A comprehensive, fill-in-the-blanks document covering scope, pricing, terms, and next steps for winning client projects.",
          "price": "₹129"
        }
      ]
    }
  ],

  "Ai Prompts": [
    {
      "name": "Visual & E-commerce AI Prompts",
      "img": "https://raw.githubusercontent.com/suchdigitel/digistore/refs/heads/main/Images/IMG_20251013_153230.png",
      "products": [
        {
          "id": "AI-VEP-01",
          "title": "Midjourney / DALL-E Product Mockup & Branding Kit",
          "img": "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop",
          "short": "Visual Prompts for E-commerce Sellers/Digital Creators.",
          "long": "A detailed set of prompt formulas to generate stunning, realistic product photography and lifestyle mockups for branding and listings.",
          "price": "₹199"
        },
        {
          "id": "AI-VEP-02",
          "title": "The Hyper-Specific Niche Art Generator",
          "img": "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=fit",
          "short": "Unique art styles for Print-on-Demand Sellers.",
          "long": "Advanced prompt chains designed to produce unique, high-selling graphics and designs in competitive and niche markets for POD platforms.",
          "price": "₹199"
        }
      ]
    },
    {
      "name": "Content & Strategy AI Prompts",
      "img": "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop",
      "products": [
        {
          "id": "AI-VEP-03",
          "title": "The SEO-Optimized Blog Post Generator",
          "img": "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop",
          "short": "Full article prompts for Freelance Writers/Content Marketers.",
          "long": "A prompt workflow for generating a complete, structure-perfect, and keyword-rich blog post ready for quick editing and publishing.",
          "price": "₹149"
        },
        {
          "id": "AI-VEP-04",
          "title": "5-Minute Social Media Content Creator",
          "img": "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop",
          "short": "Rapid daily content generation and captions.",
          "long": "A prompt system that efficiently takes one idea and converts it into multiple days of engaging posts, hooks, and calls to action.",
          "price": "₹99"
        }
      ]
    },
    {
      "name": "Educational AI Prompts", // Renamed for clarity, incorporating the Tutor product
      "img": "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop",
      "products": [
        {
          "id": "AI-EDU-02",
          "title": "Teacher's Aide Lesson & Activity Planner (K-12/Tutors)",
          "img": "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop",
          "short": "Customized learning prompts for Educators and Tutors.",
          "long": "A prompt system for Tutors and K-12 educators to quickly generate standards-aligned lesson plans, personalized practice problems, and engaging activities.",
          "price": "₹129"
        }
      ]
    }
  ],
  
  "Printable wall posters": [
    {
      "name": "State of Mindfulness", // ADDED 'name' KEY HERE
      "img": "https://raw.githubusercontent.com/suchdigitel/digistore/refs/heads/main/Images/IMG_20251013_212123.png",
      "products": [
        {
          "id": "PW-AT-01",
          "title": "Abstract and typographic + (bonus: bundle of 5 Mind and psychology poster)",
          "img": "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop",
          "short": "Wake up a thoughful day.",
          "long": "High-resolution abstract and typographic art with a bonus pack of five posters focused on mental well-being.",
          "price": "₹399"
        },
        {
          "id": "PW-SL-02",
          "title": "Gratitude & Intentionality + (bonus: bundle of 5 productivity thoughts poster)",
          "img": "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop",
          "short": "Daily reminders for growth.",
          "long": "A set of posters promoting gratitude and intentional living, bundled with five productivity-focused thought posters for your workspace.",
          "price": "₹399"
        }
      ]
    }
  ]
};     
/* ==================================================== */

/* ========== DOM refs ========== */
const categoriesBar = $('categories-bar');
const subcatWrap = $('subcat-wrap');
const categoryGrid = $('category-grid');
const productGrid = $('product-grid');
const noResults = $('no-results');
const productPanel = $('product-panel');
const buyModal = $('buyModal');
const buyModalContent = $('buyModalContent');
const buyModalClose = $('buyModalClose');
const searchInput = $('search');
const searchSuggestions = $('search-suggestions');
const backAllWrap = $('back-all-wrap');
const backAllBtn = $('back-all');

/* ========== INIT ========== */
document.addEventListener('DOMContentLoaded', () => {
  $('contact-number').textContent = CONFIG.CONTACT_NUMBER;
  $('year').textContent = new Date().getFullYear();
  // Generate main page QR from CONFIG.UPI_ID
  if(window.QRCode && CONFIG.UPI_ID){
    const canvas = $('mainPageQR');
    QRCode.toCanvas(canvas, CONFIG.UPI_ID, { width: 180 }, (err)=>{ if(err) console.error('QR err',err); });
    $('upi-id-text').textContent = CONFIG.UPI_ID;
  }

  renderCategoriesBar();
  renderCategoriesGrid();
  setupHandlers();

  // modal interactions
  buyModalClose?.addEventListener('click', closeBuyModal);
  buyModal?.addEventListener('click', (e)=> { if(e.target === buyModal) closeBuyModal(); });
});

/* ========== RENDER CATEGORIES BAR ========== */
function renderCategoriesBar(){
  categoriesBar.innerHTML = '';
  Object.keys(PRODUCTS).forEach((cat, idx) => {
    const btn = document.createElement('button');
    btn.className = 'category-item' + (idx % 2 === 0 ? ' alt' : '');
    btn.textContent = humanizeCat(cat);
    btn.dataset.cat = cat;
    btn.addEventListener('click', ()=> {
      // Show subcategories and all products in that category (merged)
      renderSubcategories(cat);
      renderProductsForCategory(cat);
      backAllWrap.style.display = '';
      productGrid.scrollIntoView({behavior:'smooth', block:'start'});
    });
    categoriesBar.appendChild(btn);
  });
}

/* ========== RENDER MAIN CATEGORIES GRID ========== */
function renderCategoriesGrid(){
  categoryGrid.innerHTML = '';
  Object.keys(PRODUCTS).forEach(cat => {
    const card = document.createElement('div'); card.className = 'card';
    const sub = PRODUCTS[cat][0];
    const bg = sub && sub.img ? `background-image:url(${sub.img})` : 'background:linear-gradient(90deg,#2a0054,#ff2d95)';
    card.innerHTML = `<div class="card-hero" style="${bg}"></div><div class="card-content"><h3>${escapeHtml(humanizeCat(cat))}</h3><p class="muted">Explore ${escapeHtml(humanizeCat(cat))}</p></div>`;
    card.addEventListener('click', ()=> {
      renderSubcategories(cat);
      renderProductsForCategory(cat);
      backAllWrap.style.display = '';
      productGrid.scrollIntoView({ behavior:'smooth', block:'start' });
    });
    categoryGrid.appendChild(card);
  });
}

/* ========== RENDER SUBCATEGORIES ========== */
function renderSubcategories(categorySlug){
  subcatWrap.innerHTML = '';
  const subs = PRODUCTS[categorySlug] || [];
  subs.forEach(sc => {
    const btn = document.createElement('button');
    btn.className = 'category-item';
    btn.textContent = sc.name;
    btn.addEventListener('click', ()=> {
      // ********** IMPORTANT: this shows ONLY the products IN THIS SUBCATEGORY **********
      renderProductsForSubcategory(categorySlug, sc.name);
      backAllWrap.style.display = '';
      productGrid.scrollIntoView({ behavior:'smooth', block:'start' });
    });
    subcatWrap.appendChild(btn);
  });
}

/* ========== SHOW PRODUCTS: category(all subcats merged) ========== */
function renderProductsForCategory(categorySlug){
  productGrid.style.display = '';
  categoryGrid.style.display = 'none';
  productGrid.innerHTML = '';
  const subs = PRODUCTS[categorySlug] || [];
  const allProducts = [];
  subs.forEach(sc => sc.products.forEach(p => allProducts.push({...p, __cat: categorySlug, __sub: sc.name})));
  if(allProducts.length === 0){ noResults.style.display = ''; return; }
  noResults.style.display = 'none';
  allProducts.forEach(p => productGrid.appendChild(createProductCard(p)));
}

/* ========== SHOW PRODUCTS: subcategory ONLY (FIXED) ========== */
function renderProductsForSubcategory(categorySlug, subName){
  productGrid.style.display = '';
  categoryGrid.style.display = 'none';
  productGrid.innerHTML = '';
  const subs = PRODUCTS[categorySlug] || [];
  let found = false;
  subs.forEach(sc => {
    if(sc.name === subName){
      found = true;
      sc.products.forEach(p0 => {
        const p = {...p0, __cat: categorySlug, __sub: sc.name};
        productGrid.appendChild(createProductCard(p));
      });
    }
  });
  if(!found) noResults.style.display = '';
  else noResults.style.display = 'none';
}

/* ========== CREATE PRODUCT CARD ========== */
function createProductCard(p){
  const card = document.createElement('div'); card.className = 'card';
  const hero = document.createElement('div'); hero.className = 'card-hero'; hero.style.backgroundImage = `url(${p.img})`;
  const content = document.createElement('div'); content.className = 'card-content';
  content.innerHTML = `<h3>${escapeHtml(p.title)}</h3><p class="muted">${escapeHtml(p.short)}</p>`;
  const ratingEl = renderStars(p.id);
  const buyBtn = document.createElement('button'); buyBtn.className = 'btn-ghost'; buyBtn.textContent = 'Buy';
  buyBtn.addEventListener('click', (ev)=> { ev.stopPropagation(); openBuyModal(Object.assign({}, p)); });
  content.appendChild(ratingEl);
  content.appendChild(buyBtn);
  card.appendChild(hero); card.appendChild(content);
  card.addEventListener('click', ()=> openProductPanel(p));
  return card;
}

/* ========== PRODUCT PANEL ========== */
function openProductPanel(p){
  productPanel.innerHTML = '';
  productPanel.style.display = 'block';
  productPanel.classList.add('open');
  productPanel.innerHTML = `
    <div style="padding:14px;color:#fff">
      <button id="panel-back" class="btn-ghost" style="margin-bottom:12px">← Go Back</button>
      <div style="background-image:url(${p.img});background-size:cover;background-position:center;height:180px;border-radius:10px"></div>
      <h2 style="margin-top:12px">${escapeHtml(p.title)}</h2>
      <div class="muted">${escapeHtml(humanizeCat(p.__cat))} › ${escapeHtml(p.__sub)}</div>
      <p style="margin-top:8px;color:#ddd">${escapeHtml(p.long)}</p>
      <p style="margin-top:10px;font-weight:700">${escapeHtml(p.price)}</p>
      <div style="display:flex;gap:10px;margin-top:12px">
        <button id="panel-buy" class="btn-primary">Buy</button>
        <div id="panel-stars" class="stars"></div>
      </div>
    </div>
  `;
  const panelStars = renderStars(p.id);
  $('panel-stars')?.appendChild(panelStars);
  $('panel-back').addEventListener('click', ()=> { productPanel.classList.remove('open'); productPanel.style.display='none'; });
  $('panel-buy').addEventListener('click', ()=> openBuyModal(p));
}

/* ========== RATINGS (localStorage) ========== */
const RATINGS_KEY = 'digistore_ratings_v1';
function readRatings(){ const raw = localStorage.getItem(RATINGS_KEY); return raw ? JSON.parse(raw) : {}; }
function writeRatings(obj){ localStorage.setItem(RATINGS_KEY, JSON.stringify(obj)); }
function getRating(productId){ const obj = readRatings(); return obj[productId] || { sum:0, count:0 }; }
function addRating(productId, score){ const obj = readRatings(); const cur = obj[productId] || { sum:0, count:0 }; cur.sum += score; cur.count += 1; obj[productId] = cur; writeRatings(obj); }

/* Render clickable 1-5 star control */
function renderStars(productId){
  const container = document.createElement('div'); container.className = 'stars';
  const data = getRating(productId);
  const avg = data.count ? (data.sum / data.count) : 0;
  const starRow = document.createElement('div'); starRow.style.display='flex';
  for(let i=1;i<=5;i++){
    const s = document.createElement('span'); s.className = 'star'; s.innerHTML = '★';
    if(i <= Math.round(avg)) s.classList.add('active');
    s.addEventListener('mouseover', ()=> {
      const all = starRow.querySelectorAll('.star'); all.forEach((st, idx)=> st.classList.toggle('hover', idx < i));
    });
    s.addEventListener('mouseout', ()=> {
      const all = starRow.querySelectorAll('.star'); all.forEach(st=> st.classList.remove('hover'));
    });
    s.addEventListener('click', ()=> {
      addRating(productId, i);
      const newData = getRating(productId); const newAvg = newData.count ? (newData.sum / newData.count) : 0;
      const all = starRow.querySelectorAll('.star'); all.forEach((st, idx)=> st.classList.toggle('active', idx < Math.round(newAvg)));
      if(container.querySelector('.rating-value')) container.querySelector('.rating-value').textContent = (newAvg.toFixed(1)) + ' / 5';
    });
    starRow.appendChild(s);
  }
  const ratingValue = document.createElement('div'); ratingValue.className = 'rating-value';
  ratingValue.textContent = data.count ? ( (data.sum / data.count).toFixed(1) + ' / 5') : 'No ratings';
  container.appendChild(starRow); container.appendChild(ratingValue);
  return container;
}

/* ========== BUY MODAL ========== */
function shortCode(catSlug, subName, prodTitle){
  const cat = (catSlug||'').replace(/[^A-Za-z]/g,'').substring(0,2).toUpperCase();
  const sub = (subName||'').replace(/[^A-Za-z]/g,'').substring(0,2).toUpperCase();
  const p = (prodTitle||'').replace(/[^A-Za-z]/g,'').substring(0,2).toUpperCase();
  return `${cat} - ${sub} - ${p}`;
}

function openBuyModal(product){
  const code = shortCode(product.__cat, product.__sub, product.title);
  buyModalContent.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:12px;color:#fff">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <div>
          <div style="font-weight:700;font-size:18px">${escapeHtml(product.title)}</div>
          <div class="muted" style="color:rgba(255,255,255,0.65)">${escapeHtml(humanizeCat(product.__cat))} › ${escapeHtml(product.__sub)}</div>
        </div>
        <div style="text-align:right">
          <div class="muted" style="font-size:12px">Price</div>
          <div style="font-weight:800;font-size:16px">${escapeHtml(product.price)}</div>
        </div>
      </div>

      <div>
        <div style="font-size:13px;font-weight:700">Product Code</div>
        <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
          <div id="productCodeText" class="code-box">${escapeHtml(code)}</div>
          <button id="copyCodeBtn" class="copy-btn">Copy Code</button>
          <button id="openFormBtn" class="btn-ghost">Proceed to Form</button>
        </div>
      </div>

      <div style="color:#ddd">After payment (UPI), paste the copied product code into the confirmation form and submit.</div>

      <div style="display:flex;gap:12px;align-items:center">
        <div>
          <div class="muted" style="font-size:12px">UPI ID</div>
          <div style="font-weight:800">${escapeHtml(CONFIG.UPI_ID)}</div>
        </div>
        <div id="buyModalQR"></div>
      </div>
    </div>
  `;
  buyModal.setAttribute('aria-hidden','false');
  buyModal.style.display = 'flex';

  // generate QR in modal as well
  const qrWrap = $('buyModalQR'); qrWrap.innerHTML = '';
  if(window.QRCode && CONFIG.UPI_ID) QRCode.toCanvas(qrWrap, CONFIG.UPI_ID, { width:120 }, ()=>{});

  // copy
  $('copyCodeBtn').addEventListener('click', ()=> {
    navigator.clipboard.writeText(code).then(()=> {
      const btn = $('copyCodeBtn'); btn.textContent = 'Copied ✓';
      setTimeout(()=> btn.textContent = 'Copy Code', 1400);
    }).catch(()=> alert('Copy failed — select and copy manually.'));
  });

  // proceed to form (same tab so Back returns here)
  $('openFormBtn').addEventListener('click', ()=> {
    sessionStorage.setItem('digistore_prev', location.href);
    const qs = new URLSearchParams({ product: product.id || '', title: product.title || '' }).toString();
    location.href = CONFIG.FORM_PAGE + '?' + qs;
  });
}

/* close buy modal */
$('buyModalClose')?.addEventListener('click', ()=> { buyModal.setAttribute('aria-hidden','true'); buyModal.style.display='none'; });

/* ========== SEARCH ========== */
if(searchInput){
  searchInput.addEventListener('input', ()=> {
    const q = searchInput.value.trim().toLowerCase();
    searchSuggestions.innerHTML = '';
    if(!q){ searchSuggestions.style.display='none'; return; }
    const matches = [];
    Object.keys(PRODUCTS).forEach(cat=>{
      PRODUCTS[cat].forEach(sc=>{
        sc.products.forEach(p=>{
          if((p.title||'').toLowerCase().includes(q) || (p.short||'').toLowerCase().includes(q)) matches.push({p,cat,sub:sc.name});
        });
      });
    });
    if(matches.length === 0){ searchSuggestions.style.display='none'; return; }
    matches.slice(0,8).forEach(m=>{
      const div = document.createElement('div'); div.style.padding='8px'; div.style.borderBottom='1px solid rgba(255,255,255,0.03)'; div.style.cursor='pointer';
      div.innerHTML = `<strong>${escapeHtml(m.p.title)}</strong><div class="muted" style="font-size:12px">${escapeHtml(humanizeCat(m.cat))} › ${escapeHtml(m.sub)}</div>`;
      div.addEventListener('click', ()=> {
        renderSubcategories(m.cat);
        renderProductsForSubcategory(m.cat, m.sub);
        searchSuggestions.style.display='none';
        productGrid.scrollIntoView({ behavior:'smooth', block:'start' });
      });
      searchSuggestions.appendChild(div);
    });
    searchSuggestions.style.display='block';
  });
}

/* ========== UTILS ========== */
function humanizeCat(slug){
  const mapping = { ebooks:'Ebooks', cheats:'Cheat Sheets', ai:'AI Prompt Packs', wall:'Printable Wall Art', stickers:'Digital Stickers', freelancer:'Freelancer Packs' };
  return mapping[slug] || slug;
}

/* ========== BACK TO ALL ========== */
if(backAllBtn){
  backAllBtn.addEventListener('click', ()=> {
    categoryGrid.style.display = '';
    productGrid.style.display = 'none';
    subcatWrap.innerHTML = '';
    backAllWrap.style.display = 'none';
    window.scrollTo({ top: 0, behavior:'smooth' });
  });
}

/* ========== CREATE PRODUCT CARD (used else where) ========== */
function createProductCard(p){
  const card = document.createElement('div'); card.className = 'card';
  const hero = document.createElement('div'); hero.className = 'card-hero'; hero.style.backgroundImage = `url(${p.img})`;
  const content = document.createElement('div'); content.className = 'card-content';
  content.innerHTML = `<h3>${escapeHtml(p.title)}</h3><p class="muted">${escapeHtml(p.short)}</p>`;
  const ratingEl = renderStars(p.id);
  const buyBtn = document.createElement('button'); buyBtn.className = 'btn-ghost'; buyBtn.textContent = 'Buy';
  buyBtn.addEventListener('click', (ev)=> { ev.stopPropagation(); openBuyModal(Object.assign({}, p)); });
  content.appendChild(ratingEl);
  content.appendChild(buyBtn);
  card.appendChild(hero); card.appendChild(content);
  card.addEventListener('click', ()=> openProductPanel(p));
  return card;
}

/* ========== SETUP HANDLERS ========== */
function setupHandlers(){
  // hamburger opens drawer
  $('hamburger')?.addEventListener('click', ()=> {
    const md = document.getElementById('mobile-drawer');
    if(md){ md.classList.toggle('open'); md.setAttribute('aria-hidden', !md.classList.contains('open')); }
  });

  // Render initial category grid already done
  renderCategoriesGrid();
}

/* ========== END OF SCRIPT ========== */

/* ========== QUICK EDIT NOTES ==========
- To add categories/subcategories/products: update the PRODUCTS object near the top.
- To change UPI: edit CONFIG.UPI_ID.
- To change embedded Google Form: edit document.getElementById('google-embed').src in form.html (line is already set to your link).
- To replace QR image on main page with a static image: replace <canvas id="mainPageQR"> with <img src="assets/your-qr.png"> in index.html and remove QR generation in DOMContentLoaded.
- To change payment video: replace <video> src in index.html or switch to YouTube iframe there.
================================================= */


