// ADE Homepage v1 — basic demo data & tiny interactivity

const products = [
    {id:1,name:'Velvet Lip Color',category:'Lips',price:'₺499',rating:4.7,swatches:['#B1345A','#D88A9A','#8B1E3F'],image:'assets/images/lipstick.jpg',badge:'New'},
    {id:2,name:'Glow Blush',category:'Face',price:'₺549',rating:4.6,swatches:['#F4A2B2','#F7C6D0'],image:'assets/images/mirror.jpg',badge:'Bestseller'},
    {id:3,name:'Precision Mascara',category:'Eyes',price:'₺459',rating:4.8,swatches:['#111111'],image:'assets/images/brush.jpg',badge:'Online Exclusive'},
    {id:4,name:'Nude Eye Palette',category:'Eyes',price:'₺799',rating:4.5,swatches:['#C8A18C','#8D6B58','#4C3A2E'],image:'assets/images/hero.jpg'},
    {id:5,name:'Hydra Skin Tint',category:'Skin',price:'₺699',rating:4.6,swatches:['#EDC9B7','#D7B199','#B98E72'],image:'assets/images/mirror.jpg'},
    {id:6,name:'Brow Sculpt Gel',category:'Brows',price:'₺379',rating:4.4,swatches:['#6B4E3D','#3E2A22'],image:'assets/images/brush.jpg'}
];

const el = (sel) => document.querySelector(sel);

function cardHTML(p){
    const sw = (p.swatches||[]).map(c=>`<span class="swatch" style="background:${c}"></span>`).join('');
    const badge = p.badge ? `<span class="badge">${p.badge}</span>` : '';
    return `
  <article class="card">
    <div style="position:relative">
      ${badge}
      <img src="${p.image}" alt="${p.name}">
    </div>
    <div class="body">
      <div class="name">${p.name}</div>
      <div class="price">${p.price}</div>
      <div class="swatches">${sw}</div>
      <div class="actions">
        <button class="btn add">Add to Cart</button>
        <button class="btn outline" aria-pressed="false">♡</button>
      </div>
    </div>
  </article>`;
}

function render(){
    el('#collection-grid').innerHTML = products.slice(0,4).map(cardHTML).join('');
    el('#new-grid').innerHTML       = products.slice(2,6).map(cardHTML).join('');
    el('#best-grid').innerHTML      = products.slice(0,4).map(cardHTML).join('');
}
render();

// Wishlist toggle (demo)
document.addEventListener('click', (e)=>{
    if(e.target.closest('.outline')){
        const btn = e.target.closest('.outline');
        const pressed = btn.getAttribute('aria-pressed') === 'true';
        btn.setAttribute('aria-pressed', String(!pressed));
        btn.textContent = pressed ? '♡' : '♥';
    }
});
