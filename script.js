const PRODUCTS = [
  {id:1,name:'Microfiber Towel (Pack 3)',price:12.99,img:'https://images.unsplash.com/photo-1529101091764-c3526daf38fe?w=800&q=60'},
  {id:2,name:'pH Neutral Car Soap (1L)',price:14.99,img:'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&q=60'},
  {id:3,name:'Clay Bar Kit',price:19.99,img:'https://images.unsplash.com/photo-1581091870620-3a6f0b5f8b4a?w=800&q=60'},
  {id:4,name:'Ceramic Sealant (250ml)',price:39.99,img:'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=60'},
  {id:5,name:'Interior Cleaner (500ml)',price:11.99,img:'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?w=800&q=60'}
];

function $(s){return document.querySelector(s)}

function renderProducts(){
  const el = $('#products'); if(!el) return;
  el.innerHTML = PRODUCTS.map(p=>`
    <div class="product">
      <img src="${p.img}" alt="${p.name}">
      <h4>${p.name}</h4>
      <p class="price-tag">$${p.price.toFixed(2)}</p>
      <button class="btn add" data-id="${p.id}">Add to cart</button>
    </div>
  `).join('');
  document.querySelectorAll('.add').forEach(b=>b.addEventListener('click',e=>{
    addToCart(Number(e.target.dataset.id));
  }));
}

function loadCart(){
  try{return JSON.parse(localStorage.getItem('mtl_cart')||'[]')}catch(e){return []}
}
function saveCart(c){localStorage.setItem('mtl_cart',JSON.stringify(c));renderCart()}

function addToCart(id){
  const cart = loadCart();
  const item = cart.find(i=>i.id===id);
  if(item) item.qty++;
  else cart.push({id,qty:1});
  saveCart(cart);
}

function renderCart(){
  const el = $('#cart-items'); if(!el) return;
  const cart = loadCart();
  if(cart.length===0){el.innerHTML='<p>Cart is empty</p>'; $('#cart-total').textContent='0';return}
  let total=0;
  el.innerHTML = cart.map(ci=>{
    const p = PRODUCTS.find(x=>x.id===ci.id);
    const sub = p.price*ci.qty; total+=sub;
    return `<div>${p.name} x${ci.qty} — $${sub.toFixed(2)}</div>`
  }).join('');
  $('#cart-total').textContent=total.toFixed(2);
}

document.addEventListener('DOMContentLoaded',()=>{
  renderProducts(); renderCart();
  const checkout = $('#checkout'); if(checkout) checkout.addEventListener('click',()=>{
    alert('Checkout is a demo. For orders call (514) 555-0123.');
  });
});
