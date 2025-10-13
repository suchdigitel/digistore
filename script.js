// ===== main.js (final) =====
// CONFIG - update with real values
const CONFIG = {
  SHOP_NAME: 'digistore',
  CONTACT_NUMBER: '+91-9876543210',
  UPI_ID: 'your-upi@upi', // replace with real UPI
  GOOGLE_FORM_EMBED: 'https://docs.google.com/forms/d/e/1FAIpQLScFHxcYQoP6nrLCiNKva0_bYHoeWqBPi9tc_NzkHEsyq8ijuQ/viewform?embedded=true',
  SOCIAL: { instagram: '#', telegram: '#', twitter: '#' }
};

// NAV STACK
const NAV_STACK = [];

// ELEMENTS
const categoriesBar = document.getElementById('categories-bar');
const categoryGrid = document.getElementById('category-grid');
const subcatWrap = document.getElementById('subcat-wrap');
const productGrid = document.getElementById('product-grid');
const productPanel = document.getElementById('product-panel');
const goBackBtn = document.getElementById('go-back');
const searchInput = document.getElementById('search');
const searchSuggestions = document.getElementById('search-suggestions');
const modalBackdrop = document.getElementById('modal-backdrop');
const modalUpi = document.getElementById('modal-upi');
const qrWrap = document.getElementById('qr-wrap');
const googleForm = document.getElementById('google-form');
const closeModalBtn = document.getElementById('close-modal');
const iPaidBtn = document.getElementById('i-paid');
const afterConfirm = document.getElementById('after-confirm');
const noResults = document.getElementById('no-results');

// on ready
document.addEventListener('DOMContentLoaded', () => {
  // contact and social
  const contactEl = document.getElementById('contact-number');
  if(contactEl) contactEl.textContent = CONFIG.CONTACT_NUMBER;
  ['ig','tg','tw'].forEach(id=> { const el=document.getElementById(id); if(el) el.href = CONFIG.SOCIAL[id] || '#'; });
  const yearEl = document.getElementById('year'); if(yearEl) yearEl.textContent = new Date().getFullYear();

  renderCategoriesBar();
  renderCategories();
  attachUIHandlers();
});

// PRODUCTS (placeholders) - categories include a 'img' for the category thumbnail
const PRODUCTS = {
  "ebooks": [
    { name: "Science Fiction", img: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=900&q=60", products: [
        { id:"sf1", title:"Galactic Odyssey", short:"A thrilling space adventure", long:"Full description of Galactic Odyssey — interstellar travel, vivid worldbuilding, and a fast-paced hero's journey.", price:"₹199", img:"https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=900&q=60" },
        { id:"sf2", title:"Starship Legacy", short:"Epic interstellar saga", long:"Family legacy across stars with political intrigue.", price:"₹199", img:"https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=900&q=60" },
        { id:"sf3", title:"Cosmic Rebels", short:"Rebels in distant galaxies", long:"Rebellion, friendship and the cost of freedom.", price:"₹199", img:"https://images.unsplash.com/photo-1455344898480-7f0b50f3d0f0?auto=format&fit=crop&w=900&q=60" }
    ]},
    { name: "Mystery", img: "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=900&q=60", products: [
        { id:"m1", title:"The Hidden Key", short:"Secrets of the mansion", long:"An atmospheric whodunit with twists and a surprising reveal.", price:"₹199", img:"https://images.unsplash.com/photo-1506459225024-1428097a7e18?auto=format&fit=crop&w=900&q=60" },
        { id:"m2", title:"Midnight Clues", short:"Detective suspense", long:"Classic detective narrative updated.", price:"₹199", img:"https://images.unsplash.com/photo-1516912482560-80ebf46f3b1f?auto=format&fit=crop&w=900&q=60" },
        { id:"m3", title:"Whispered Lies", short:"Thrilling mystery", long:"Secrets and lies that unravel the town's history.", price:"₹199", img:"https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=900&q=60" }
    ]},
    { name: "Romance", img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=60", products: [
        { id:"r1", title:"Love in Paris", short:"Romance set in Paris", long:"Hearts meet in the city of light — a tender, cinematic romance.", price:"₹149", img:"https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?auto=format&fit=crop&w=900&q=60" },
        { id:"r2", title:"Hearts Collide", short:"Heartfelt romance", long:"A second-chance romance that explores forgiveness and growth.", price:"₹149", img:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=60" },
        { id:"r3", title:"Summer of Love", short:"Warm beach romance", long:"Nostalgic seaside romance that warms the heart.", price:"₹149", img:"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=60" }
    ]},
    { name: "Children", img: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=900&q=60", products: [
        { id:"c1", title:"Adventures of Timmy", short:"Fun kids story", long:"Playful characters and gentle lessons for early readers.", price:"₹99", img:"https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=900&q=60" }
    ]},
    { name: "Mental & Psychological", img: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=900&q=60", products: [
        { id:"mth1", title:"Mind Mastery", short:"Mental wellness guide", long:"Practical exercises to build calm and focus.", price:"₹199", img:"https://images.unsplash.com/photo-1509099836639-18ba5f10b3b2?auto=format&fit=crop&w=900&q=60" }
    ]}
  ],

  "cheats": [
    { name: "Design", img:"https://images.unsplash.com/photo-1487014679447-9f8336841d58?auto=format&fit=crop&w=900&q=60", products:[
      { id:"ch1", title:"Color Psychology Cheat Sheet", short:"Colors & meaning", long:"Quick color reference for designers.", price:"₹49", img:"https://images.unsplash.com/photo-1520975917837-0c8d74f3f6f5?auto=format&fit=crop&w=900&q=60" },
      { id:"ch2", title:"Typography Cheatsheet", short:"Font pairing guide", long:"Quick guide to pairing fonts and sizes.", price:"₹49", img:"https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=900&q=60" }
    ]},
    { name: "Marketing", img:"https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=60", products:[
      { id:"ch3", title:"Social Media Cheatsheet", short:"Post templates", long:"Prompts and templates for social media posts.", price:"₹49", img:"https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=60" },
      { id:"ch4", title:"Email Marketing Cheatsheet", short:"Subject & flows", long:"High-converting email templates and subjects.", price:"₹49", img:"https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=900&q=60" }
    ]}
  ],

  "wall":[
    { name: "Motivational Posters", img:"https://images.unsplash.com/photo-1508780709619-79562169bc64?auto=format&fit=crop&w=900&q=60", products:[
      { id:"w1", title:"Dream Big", short:"Motivational poster", long:"High-resolution printable poster.", price:"₹99", img:"https://images.unsplash.com/photo-1508780709619-79562169bc64?auto=format&fit=crop&w=900&q=60" },
      { id:"w2", title:"Keep Going", short:"Encouragement poster", long:"Affirmation art for workspace.", price:"₹99", img:"https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?auto=format&fit=crop&w=900&q=60" }
    ]}
  ],

  "stickers":[
    { name: "Planner Stickers", img:"https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=900&q=60", products:[
      { id:"s1", title:"Cute Planner Pack", short:"Planner icons", long:"PNG & SVG sticker pack for planners.", price:"₹49", img:"https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=900&q=60" },
      { id:"s2", title:"Motivational Stickers", short:"Quote stickers", long:"Printable sticker sheet of motivational quotes.", price:"₹49", img:"https://images.unsplash.com/photo-1520975917837-0c8d74f3f6f5?auto=format&fit=crop&w=900&q=60" }
    ]}
  ],

  "ai":[
    { name:"Content Prompts", img:"https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=60", products:[
      { id:"ai1", title:"Blog Prompts Pack", short:"100 blog prompts", long:"Proven blog ideas & outlines.", price:"₹149", img:"https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=60" },
      { id:"ai2", title:"Social Media Prompts", short:"Post prompts", long:"Captions and carousel prompts.", price:"₹149", img:"https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=60" }
    ]}
  ],

  "freelancer":[
    { name:"Starter Packs", img:"https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=60", products:[
      { id:"f1", title:"Freelancer Design Kit", short:"Templates & contracts", long:"Starter templates for freelancers.", price:"₹299", img:"https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=60" }
    ]}
  ],

  "sidehustle":[
    { name:"Kits", img:"https://images.unsplash.com/photo-1524635962361-8b3b7b8b0b40?auto=format&fit=crop&w=900&q=60", products:[
      { id:"sh1", title:"Ebook Creation Kit", short:"Templates + guide", long:"Write & publish an ebook fast with templates.", price:"₹199", img:"https://images.unsplash.com/photo-1524635962361-8b3b7b8b0b40?auto=format&fit=crop&w=900&q=60" }
    ]}
  ]
};

// UI functions

function renderCategoriesBar(){
  if(!categoriesBar) return;
  categoriesBar.innerHTML = '';
  Object.keys(PRODUCTS).forEach(catKey => {
    const btn = document.createElement('button');
    btn.textContent = catKey;
    btn.dataset.cat = catKey;
    btn.addEventListener('click', ()=> {
      if(currentState().type !== 'root') NAV_STACK.push(currentState());
      selectCategory(catKey);
    });
    categoriesBar.appendChild(btn);
  });
}

function currentState(){
  if (productPanel && productPanel.classList.contains('open')) return { type:'product' };
  if (selectedSubcat) return { type:'subcategory', cat:selectedCategory, sub:selectedSubcat };
  if (selectedCategory) return { type:'category', cat:selectedCategory };
  return { type:'root' };
}

let selectedCategory = null;
let selectedSubcat = null;

function renderCategories(){
  if(!categoryGrid) return;
  categoryGrid.innerHTML = '';
  productGrid.style.display = 'none';
  categoryGrid.style.display = '';
  noResults.style.display = 'none';
  Object.keys(PRODUCTS).forEach(catKey => {
    const el = document.createElement('div');
    el.className = 'card';
    // use category's thumbnail (first subcategory image or explicit img)
    const catObj = PRODUCTS[catKey];
    let catImg = '';
    if(Array.isArray(catObj) && catObj[0]){
      catImg = catObj[0].img || catObj[0].products && catObj[0].products[0] && catObj[0].products[0].img || '';
    }
    el.innerHTML = `
      <img src="${catImg}" alt="${escapeHtml(catKey)}">
      <h3>${escapeHtml(catKey)}</h3>
      <p class="muted">Explore ${escapeHtml(catKey)}</p>
    `;
    el.addEventListener('click', () => {
      NAV_STACK.push({ type:'root' });
      selectCategory(catKey);
    });
    categoryGrid.appendChild(el);
  });
  updateGoBack();
  highlightCategoryButton(null);
}

function selectCategory(catKey){
  selectedCategory = catKey;
  selectedSubcat = null;
  categoryGrid.style.display = 'none';
  productGrid.style.display = '';
  renderSubcategories(catKey);
  clearProducts();
  updateGoBack();
  highlightCategoryButton(catKey);
}

function renderSubcategories(catKey){
  if(!subcatWrap) return;
  subcatWrap.innerHTML = '';
  const arr = PRODUCTS[catKey] || [];
  arr.forEach(sc => {
    const b = document.createElement('button');
    b.textContent = sc.name || sc.name;
    b.addEventListener('click', () => {
      NAV_STACK.push({ type:'category', cat:selectedCategory });
      selectSubcategory(sc.name);
    });
    subcatWrap.appendChild(b);
  });
}

function selectSubcategory(subName){
  selectedSubcat = subName;
  renderProducts(selectedCategory, subName);
  updateGoBack();
  Array.from(subcatWrap.children).forEach(btn => btn.classList.toggle('active', btn.textContent===subName));
}

function renderProducts(cat, sub){
  if(!productGrid) return;
  productGrid.innerHTML = '';
  const subs = PRODUCTS[cat] || [];
  let found = false;
  subs.forEach(sc => {
    if (sc.name === sub) {
      sc.products.forEach(p => {
        found = true;
        const card = document.createElement('div');
        card.className = 'card';
        const pImg = p.img || sc.img || '';
        card.innerHTML = `<img src="${pImg}" alt="${escapeHtml(p.title)}"><h3>${escapeHtml(p.title)}</h3><p class="muted">${escapeHtml(p.short)}</p>`;
        card.addEventListener('click', () => {
          NAV_STACK.push({ type:'subcategory', cat:selectedCategory, sub:selectedSubcat });
          openPanel(p);
        });
        productGrid.appendChild(card);
      });
    }
  });
  noResults.style.display = found ? 'none' : '';
  updateGoBack();
}

function clearProducts(){ if(productGrid) productGrid.innerHTML = ''; }

function openPanel(p){
  if(!productPanel) return;
  productPanel.innerHTML = '';
  const header = document.createElement('div'); header.className='product-detail-header';
  const backBtn = document.createElement('button'); backBtn.id='panel-back'; backBtn.className='btn-ghost'; backBtn.textContent='← Go Back';
  backBtn.addEventListener('click', () => {
    productPanel.classList.remove('open');
    if (NAV_STACK.length && NAV_STACK[NAV_STACK.length-1].type==='product') NAV_STACK.pop();
    updateGoBack();
  });
  header.appendChild(backBtn);
  const title = document.createElement('h2'); title.textContent = p.title; title.style.marginLeft='8px'; title.style.flex='1';
  header.appendChild(title);

  const img = document.createElement('img'); img.src = p.img; img.alt = p.title; img.style.width='100%'; img.style.borderRadius='10px'; img.style.marginTop='12px';

  const longDesc = document.createElement('p'); longDesc.textContent = p.long; longDesc.style.marginTop='12px'; longDesc.style.color='rgba(238,246,255,0.8)';

  const price = document.createElement('p'); price.innerHTML = `<strong>Price: ${p.price}</strong>`;

  const buyBtn = document.createElement('button'); buyBtn.className='btn-primary'; buyBtn.textContent='Buy'; buyBtn.addEventListener('click', ()=> {
    NAV_STACK.push({ type:'product', value:p });
    openModal(p.id);
  });

  productPanel.appendChild(header);
  productPanel.appendChild(img);
  productPanel.appendChild(longDesc);
  productPanel.appendChild(price);
  productPanel.appendChild(buyBtn);

  productPanel.classList.add('open');
  updateGoBack();
}

// --- Modal improvements: body lock without shifting
function openModal(productId){
  // lock scroll by adding class to body; CSS prevents shift by overflow-x: hidden in root
  document.body.classList.add('modal-open'); // if you want additional effects, style .modal-open in CSS
  modalBackdrop.style.display = 'flex';
  modalBackdrop.setAttribute('aria-hidden','false');
  modalUpi.textContent = CONFIG.UPI_ID;
  googleForm.src = CONFIG.GOOGLE_FORM_EMBED;
  // draw large QR
  qrWrap.innerHTML = '';
  QRCode.toCanvas(qrWrap, CONFIG.UPI_ID, { width:220 }, function(err){
    if(err) console.error(err);
  });
  // ensure the modal-right (iframe) is scrolled to top
  const mr = modalBackdrop.querySelector('.modal-right');
  if(mr) mr.scrollTop = 0;
}

function closeModal(){
  document.body.classList.remove('modal-open');
  modalBackdrop.style.display = 'none';
  modalBackdrop.setAttribute('aria-hidden','true');
  afterConfirm.style.display = 'none';
  googleForm.src = '';
}

// update go back UI
function updateGoBack(){
  if(!goBackBtn) return;
  goBackBtn.style.display = NAV_STACK.length > 0 ? '' : 'none';
}

// back button main
if(goBackBtn){
  goBackBtn.addEventListener('click', () => {
    const last = NAV_STACK.pop();
    if(!last){
      selectedCategory = null; selectedSubcat = null; renderCategories(); return;
    }
    switch(last.type){
      case 'root':
        selectedCategory = null; selectedSubcat = null; productPanel.classList.remove('open'); renderCategories(); break;
      case 'category':
        selectedCategory = last.cat; selectedSubcat = null; renderSubcategories(selectedCategory); clearProducts(); break;
      case 'subcategory':
        selectedCategory = last.cat; selectedSubcat = last.sub; renderSubcategories(selectedCategory); renderProducts(selectedCategory, selectedSubcat); break;
      case 'product':
        productPanel.classList.remove('open'); break;
    }
    updateGoBack();
  });
}

// search
if(searchInput){
  searchInput.addEventListener('input', ()=>{
    const q = searchInput.value.trim().toLowerCase();
    searchSuggestions.innerHTML = '';
    if(!q){ searchSuggestions.style.display = 'none'; return; }
    const matches = [];
    Object.keys(PRODUCTS).forEach(cat=>{
      PRODUCTS[cat].forEach(sc=>{
        sc.products.forEach(p=>{
          if(p.title.toLowerCase().includes(q) || p.short.toLowerCase().includes(q) || p.long.toLowerCase().includes(q)){
            matches.push({p,cat,sub:sc.name});
          }
        });
      });
    });
    if(matches.length===0){ searchSuggestions.style.display='none'; return; }
    matches.slice(0,12).forEach(m=>{
      const div = document.createElement('div');
      div.innerHTML = `<strong>${escapeHtml(m.p.title)}</strong> <div class="muted" style="font-size:12px">${escapeHtml(m.cat)} › ${escapeHtml(m.sub)}</div>`;
      div.addEventListener('click', ()=>{
        NAV_STACK.push({ type:'root' });
        selectCategory(m.cat);
        NAV_STACK.push({ type:'category', cat:m.cat });
        selectSubcategory(m.sub);
        NAV_STACK.push({ type:'subcategory', cat:m.cat, sub:m.sub });
        openPanel(m.p);
        searchSuggestions.style.display = 'none';
        searchInput.value = '';
      });
      searchSuggestions.appendChild(div);
    });
    searchSuggestions.style.display = 'block';
  });
}

// modal handlers
if(closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
if(iPaidBtn) iPaidBtn.addEventListener('click', ()=> { afterConfirm.style.display = ''; });

if(modalBackdrop){
  modalBackdrop.addEventListener('click', (e)=>{ if(e.target === modalBackdrop) closeModal(); });
}

// helpers & attach
function attachUIHandlers(){
  // category bar active toggles
  if(categoriesBar){
    Array.from(categoriesBar.children).forEach(btn=>{
      btn.addEventListener('click', ()=> highlightCategoryButton(btn.dataset.cat));
    });
  }
  // footer product links
  document.querySelectorAll('[data-scroll]').forEach(a=>{
    a.addEventListener('click', (ev)=>{
      ev.preventDefault();
      const cat = a.dataset.scroll;
      if(PRODUCTS[cat]){ NAV_STACK.push({ type:'root' }); selectCategory(cat); window.scrollTo({ top: 0, behavior: 'smooth' }); }
    });
  });

  // click outside search suggestions to hide
  document.addEventListener('click', (e)=>{
    if(!searchInput.contains(e.target) && !searchSuggestions.contains(e.target)) searchSuggestions.style.display='none';
  });
}

function highlightCategoryButton(catKey){
  if(!categoriesBar) return;
  Array.from(categoriesBar.children).forEach(btn=> btn.classList.toggle('active', btn.dataset.cat === catKey));
}

function escapeHtml(s){ return (s+'').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[c])); }


