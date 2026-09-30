// NAV
function toggleMenu(){
  document.getElementById('navLinks').classList.toggle('active');
}
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    document.getElementById('navLinks').classList.remove('active');
  });
});
document.getElementById('year').textContent = new Date().getFullYear();

// Close cart when click outside
document.getElementById('cart-popup')?.addEventListener('click', (e)=>{
  if(e.target.id === 'cart-popup') closeCart();
});

// SMART WHATSAPP DIRECT BUTTON
document.getElementById('waDirect')?.addEventListener('click', function(){
  let name = document.getElementById('fName')?.value || "Someone";
  let service = document.getElementById('fService')?.value || "nail session";
  let date = document.getElementById('fDate')?.value || "";
  let text = `Hi TEMINAILS! I'm ${name}, I want to book ${service} ${date? 'on '+date : ''}`;
  this.href = `https://wa.me/2349156002887?text=${encodeURIComponent(text)}`;
});