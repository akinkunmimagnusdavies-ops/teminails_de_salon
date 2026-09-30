// Auto detect page
const CART_KEY = window.location.pathname.includes('academy')
 ? 'teminails_academy_cart'
  : 'teminails_salon_cart';

let cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];

function addToCart(name, price){
  let cleanName = name.replace(/[<>]/g,'');
  let existing = cart.find(i=>i.name===cleanName);
  if(existing) existing.qty+=1;
  else cart.push({name:cleanName, price:parseInt(price), qty:1});
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCart(); openCart();
}
function updateCart(){
  const countEl = document.getElementById('cart-count');
  const itemsEl = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total');
  if(!countEl) return;
  countEl.innerText = cart.reduce((s,i)=>s+i.qty,0);
  let total=0, html="";
  cart.forEach((item,index)=>{
    total+=item.price*item.qty;
    html+=`<p style="color:#000; display:flex; justify-content:space-between; margin:10px 0;">
      <span>${item.name} (₦${item.price})</span>
      <span><button onclick="changeQty(${index},-1)">-</button> ${item.qty} <button onclick="changeQty(${index},1)">+</button>
      <button onclick="removeItem(${index})" style="margin-left:8px;background:red;color:white;border:none;padding:2px 8px;border-radius:10px;">x</button></span></p>`;
  });
  if(itemsEl) itemsEl.innerHTML = html || "<p style='color:#888'>Cart empty</p>";
  if(totalEl) totalEl.innerText = total.toLocaleString();
}
function changeQty(i,d){ cart[i].qty+=d; if(cart[i].qty<=0) cart.splice(i,1); localStorage.setItem(CART_KEY, JSON.stringify(cart)); updateCart(); }
function removeItem(i){ cart.splice(i,1); localStorage.setItem(CART_KEY, JSON.stringify(cart)); updateCart(); }
function openCart(){ document.getElementById('cart-popup').style.display='flex'; }
function closeCart(){ document.getElementById('cart-popup').style.display='none'; }
function checkout(){
  if(cart.length===0) return alert("Cart empty");
  let msg = CART_KEY.includes('academy')
   ? "Hi TEMINAILS ACADEMY! I want to enroll:\n"
    : "Hi TEMINAILS DE SALON! I want to book:\n";
  cart.forEach(item=>{ msg+=`- ${item.name} x${item.qty} = ₦${item.price*item.qty}\n`; });
  let total=cart.reduce((s,i)=>s+i.price*i.qty,0);
  msg+=`\nTotal: ₦${total}\nName: ${document.getElementById('fName')?.value || document.getElementById('name')?.value || ''}`;
  window.open(`https://wa.me/2349156002887?text=${encodeURIComponent(msg)}`,'_blank');
}
updateCart();