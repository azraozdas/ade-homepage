/* ===== Helpers & constants ===== */
const TABS = ["ALL","FACE","LIPS","SKIN","BROWS","EYES","TOOLS","SETS","ADE’S COLLECTION"];

const products = [
    {id:1, name:'Velvet Lip Color', category:'LIPS', price:'₺499', rating:4.7, image:'assets/images/cat-lips.jpg', swatches:['#C2243A','#E9B3C3','#111'], badge:'Bestseller'},
    {id:2, name:'Glow Foundation', category:'FACE', price:'₺699', rating:4.6, image:'assets/images/cat-face.jpg', swatches:['#F8D7B6','#D2A277','#9C6F4B'], badge:'New'},
    {id:3, name:'Precision Mascara', category:'EYES', price:'₺459', rating:4.8, image:'assets/images/cat-ade-collection.jpg'},
    {id:4, name:'Brush Set', category:'TOOLS', price:'₺799', rating:4.5, image:'assets/images/cat-tools.jpg'},
    {id:5, name:'Hydra Skin Tint', category:'SKIN', price:'₺629', rating:4.4, image:'assets/images/cat-face.jpg'},
    {id:6, name:'Brow Sculpt Gel', category:'BROWS', price:'₺379', rating:4.6, image:'assets/images/cat-ade-collection.jpg'},
    {id:7, name:'Lip Oil Shine', category:'LIPS', price:'₺349', rating:4.5, image:'assets/images/cat-lips.jpg'},
    {id:8, name:'Eye Quad Palette', category:'EYES', price:'₺699', rating:4.7, image:'assets/images/cat-ade-collection.jpg'},
    {id:9, name:'Starter Set', category:'SETS', price:'₺1199', rating:4.3, image:'assets/images/cat-ade-collection.jpg'}
];

const FEATURE_TILES = [
    {key:'ADE’S COLLECTION', img:'assets/images/cat-ade-collection.jpg'},
    {key:'FACE', img:'assets/images/cat-face.jpg'},
    {key:'LIPS', img:'assets/images/cat-lips.jpg'},
    {key:'TOOLS', img:'assets/images/cat-tools.jpg'},
];

const LS_KEYS = { TAB:'ade_active_tab', WISHLIST:'ade_wishlist', CART:'ade_cart' };
const $ = (s,r=document)=>r.querySelector(s); const $$ = (s,r=document)=>[...r.querySelectorAll(s)];

/* ===== State ===== */
let activeTab = localStorage.getItem(LS_KEYS.TAB) || 'ALL';
let wishlist = JSON.parse(localStorage.getItem(LS_KEYS.WISHLIST) || '[]');
let cart = JSON.parse(localStorage.getItem(LS_KEYS.CART) || '[]');

/* ===== Utilities ===== */
const save = ()=>{ localStorage.setItem(LS_KEYS.TAB,activeTab); localStorage.setItem(LS_KEYS.WISHLIST,JSON.stringify(wishlist)); localStorage.setItem(LS_KEYS.CART,JSON.stringify(cart)); };
const money = s=>s;
const stars = n=>'★'.repeat(Math.round(n))+'☆'.repeat(5-Math.round(n));
function toast(msg){ const t=$('#toast'); t.textContent=msg; t.hidden=false; clearTimeout(toast._timer); toast._timer=setTimeout(()=>t.hidden=true,1600); }

/* ===== Rendering ===== */
function renderTabs(){ $$('.tab').forEach(b=>{ const on=b.dataset.tab===activeTab; b.classList.toggle('active',on); b.setAttribute('aria-selected',on?'true':'false'); }); }
function renderContent(){
    const host=$('#content'); host.innerHTML='';
    if(activeTab==='ALL'){ const grid=document.createElement('div'); grid.className='grid cols-4'; FEATURE_TILES.forEach(t=>grid.appendChild(tileCard(t))); host.appendChild(grid); }
    else{ const grid=document.createElement('div'); grid.className='grid cols-4'; const list=products.filter(p=>p.category===activeTab); list.forEach(p=>grid.appendChild(productCard(p))); if(list.length===0){ const p=document.createElement('p'); p.textContent='No products in this category yet.'; host.appendChild(p);} else{ host.appendChild(grid); requestAnimationFrame(()=>grid.style.opacity=1);} }
}
function tileCard({key,img}){ const a=document.createElement('article'); a.className='card tile'; a.innerHTML=`<img class="card-img" src="${img}" alt="${key} category" loading="lazy"><div class="card-body"><div class="card-title">${key}</div></div>`; a.addEventListener('click',()=>{ setActiveTab(key); smoothScrollTo('#content');}); return a; }
function productCard(p){
    const inWish=wishlist.includes(p.id);
    const el=document.createElement('article'); el.className='card';
    el.innerHTML=`
    <img class="card-img" src="${p.image}" alt="${p.name}" loading="lazy">
    <div class="card-body">
      <div>${p.badge?`<span class="badge">${p.badge}</span>`:''}</div>
      <div class="card-title">${p.name}</div>
      <div class="rating" aria-label="Rating ${p.rating}">${stars(p.rating)}</div>
      <div class="swatches">${(p.swatches||[]).map(c=>`<span class="swatch" style="background:${c}"></span>`).join('')}</div>
      <div class="card-actions">
        <span class="price">${money(p.price)}</span>
        <div style="display:flex;gap:8px">
          <button class="btn btn-outline add-to-cart" data-id="${p.id}">Add to Cart</button>
          <button class="heart-btn wishlist-toggle" aria-pressed="${inWish}" aria-label="Toggle wishlist" data-id="${p.id}">♡</button>
        </div>
      </div>
    </div>`;
    el.querySelector('.add-to-cart').addEventListener('click',()=>addToCart(p.id));
    el.querySelector('.wishlist-toggle').addEventListener('click',e=>toggleWishlist(p.id,e.currentTarget));
    return el;
}

/* ===== Interactions ===== */
function setActiveTab(tab){ activeTab=tab; save(); renderTabs(); renderContent(); }
function smoothScrollTo(sel){ const t=$(sel); if(t) t.scrollIntoView({behavior:'smooth',block:'start'}); }
$$('.tab').forEach(b=>b.addEventListener('click',()=>{ setActiveTab(b.dataset.tab); smoothScrollTo('#content'); }));

/* Search */
(function(){
    const input=$('#searchInput'); const panel=$('#search-panel');
    function open(){ panel.hidden=false; input.setAttribute('aria-expanded','true'); const opts=$$('.search-list li',panel); opts.forEach(o=>o.removeAttribute('aria-selected')); if(opts[0]) opts[0].setAttribute('aria-selected','true'); }
    function close(){ panel.hidden=true; input.setAttribute('aria-expanded','false'); }
    function current(){ return $('.search-list li[aria-selected="true"]',panel); }
    function move(d){ const opts=$$('.search-list li',panel); const i=opts.findIndex(o=>o.getAttribute('aria-selected')==='true'); const n=Math.max(0,Math.min(opts.length-1,i+d)); opts.forEach(o=>o.removeAttribute('aria-selected')); if(opts[n]) opts[n].setAttribute('aria-selected','true'); }
    input.addEventListener('focus',open); input.addEventListener('click',open);
    document.addEventListener('click',e=>{ if(!panel.contains(e.target)&&!input.contains(e.target)) close(); });
    input.addEventListener('keydown',e=>{ if(panel.hidden) return; if(e.key==='ArrowDown'){e.preventDefault();move(+1);} if(e.key==='ArrowUp'){e.preventDefault();move(-1);} if(e.key==='Enter'){ const o=current(); if(o){ input.value=o.textContent; toast(`Search: ${o.textContent}`); close(); } } if(e.key==='Escape'){ close(); input.blur(); }});
    $$('.chip',panel).forEach(ch=>ch.addEventListener('click',()=>{ setActiveTab(ch.dataset.tab); close(); smoothScrollTo('#content'); }));
})();

/* Wishlist */
function toggleWishlist(id,btn){ const i=wishlist.indexOf(id); if(i>-1){ wishlist.splice(i,1); toast('Removed from wishlist'); } else { wishlist.push(id); toast('Added to wishlist'); } save(); if(btn) btn.setAttribute('aria-pressed',wishlist.includes(id)?'true':'false'); }

/* Cart */
function addToCart(id){ const f=cart.find(it=>it.id===id); if(f) f.qty+=1; else { const p=products.find(p=>p.id===id); cart.push({id,qty:1,name:p.name,price:p.price,image:p.image}); } save(); renderCart(); openCart(); toast('Added to cart'); }
function removeFromCart(id){ cart=cart.filter(it=>it.id!==id); save(); renderCart(); }
function cartSubtotal(){ const toNumber=s=>Number(String(s).replace(/[^\d]/g,''))||0; const sum=cart.reduce((a,it)=>{ const p=products.find(p=>p.id===it.id); const n=p?toNumber(p.price):0; return a+n*it.qty; },0); return '₺'+sum.toLocaleString('tr-TR'); }
function renderCart(){ const list=$('#cartItems'); list.innerHTML=''; cart.forEach(it=>{ const p=products.find(p=>p.id===it.id); const row=document.createElement('div'); row.className='cart-item'; row.innerHTML=`<img src="${it.image}" alt="${it.name}"><div><div style="font-weight:700">${it.name}</div><div class="muted">${p?p.price:''} × ${it.qty}</div></div><button class="drawer-close" aria-label="Remove">&times;</button>`; row.querySelector('button').addEventListener('click',()=>removeFromCart(it.id)); list.appendChild(row); }); $('#cartSubtotal').textContent=cartSubtotal(); }

/* Drawers & Modals */
const overlay=$('[data-overlay]');
function openOverlay(){ overlay.hidden=false; }
function closeOverlay(){ overlay.hidden=true; }
function openDrawer(el){ el.classList.add('open'); el.setAttribute('aria-hidden','false'); openOverlay(); trapFocus(el); }
function closeDrawer(el){ el.classList.remove('open'); el.setAttribute('aria-hidden','true'); closeOverlay(); releaseFocus(); }
function openCart(){ openDrawer($('#cart-drawer')); }
function closeCart(){ closeDrawer($('#cart-drawer')); }
$('#openCart').addEventListener('click',openCart);
$('#openCartMobile').addEventListener('click',openCart);
$('.cart-close').addEventListener('click',closeCart);
overlay.addEventListener('click',()=>{ closeCart(); closeMobile(); closeModal(); });
document.addEventListener('keydown',e=>{ if(e.key==='Escape'){ closeCart(); closeMobile(); closeModal(); const sp=$('#search-panel'); if(sp && !sp.hidden) sp.hidden=true; }});

/* Mobile drawer */
const mobile=$('#mobile-drawer'); const hamburger=$('.hamburger'); const mobileClose=$('.mobile-drawer .drawer-close');
function openMobile(){ mobile.classList.add('open'); mobile.setAttribute('aria-hidden','false'); hamburger.setAttribute('aria-expanded','true'); openOverlay(); trapFocus(mobile); }
function closeMobile(){ mobile.classList.remove('open'); mobile.setAttribute('aria-hidden','true'); hamburger.setAttribute('aria-expanded','false'); closeOverlay(); releaseFocus(); }
hamburger.addEventListener('click',openMobile); mobileClose.addEventListener('click',closeMobile);

/* Register modal */
const modal=$('#register-modal'); const modalClose=$('.modal-close'); const openReg=$('#openRegister'); const openRegMobile=$('#openRegisterMobile');
function openModal(){ if(!modal) return; modal.hidden=false; openOverlay(); trapFocus(modal); const first=$('#registerForm input[name="email"]'); if(first) first.focus(); }
function closeModal(){ if(!modal) return; modal.hidden=true; closeOverlay(); releaseFocus(); }
if(openReg) openReg.addEventListener('click',e=>{ e.preventDefault(); openModal(); });
if(openRegMobile) openRegMobile.addEventListener('click',e=>{ e.preventDefault(); closeMobile(); openModal(); });
if(modalClose) modalClose.addEventListener('click',closeModal);
if(modal) modal.addEventListener('click',e=>{ if(e.target===modal) closeModal(); });
window.addEventListener('DOMContentLoaded',()=>{ if(modal) modal.hidden=true; if(overlay) overlay.hidden=true; });

/* Focus trap */
let lastFocused=null;
function trapFocus(container){
    lastFocused=document.activeElement;
    const nodes=[...container.querySelectorAll('a,button,input,select,textarea,[tabindex]:not([tabindex="-1"])')].filter(n=>!n.disabled);
    if(nodes[0]) nodes[0].focus();
    container.addEventListener('keydown', container._trap=(e)=>{
        if(e.key!=='Tab') return;
        const first=nodes[0], last=nodes[nodes.length-1];
        if(e.shiftKey && document.activeElement===first){ e.preventDefault(); last.focus(); }
        else if(!e.shiftKey && document.activeElement===last){ e.preventDefault(); first.focus(); }
    });
}
function releaseFocus(){
    [$('#cart-drawer'),$('#mobile-drawer'),$('#register-modal')].forEach(c=>{ if(c && c._trap) c.removeEventListener('keydown',c._trap); });
    if(lastFocused) lastFocused.focus();
}

/* Quick wishlist/cart actions */
$('#openWishlist').addEventListener('click',()=>toast(`Wishlist: ${wishlist.length} item(s)`));
$('#openWishlistMobile').addEventListener('click',()=>{ closeMobile(); toast(`Wishlist: ${wishlist.length} item(s)`); });
$('#checkoutBtn').addEventListener('click',()=>toast('Checkout not implemented in demo'));

/* ===== Init ===== */
function init(){
    if(!TABS.includes(activeTab)) activeTab='ALL';
    renderTabs(); renderContent(); renderCart();
    document.addEventListener('keydown',e=>{
        if(e.target.closest('input,textarea')) return;
        if(['ArrowLeft','ArrowRight'].includes(e.key)){
            const idx=TABS.indexOf(activeTab);
            setActiveTab(e.key==='ArrowRight'?TABS[Math.min(TABS.length-1,idx+1)]:TABS[Math.max(0,idx-1)]);
        }
    });
}
init();
