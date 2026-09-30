const form = document.getElementById('bookingForm');
const fName = document.getElementById('fName');
const fPhone = document.getElementById('fPhone');
const fService = document.getElementById('fService');
const fDate = document.getElementById('fDate');
const fTime = document.getElementById('fTime');
const statusEl = document.getElementById('formStatus');

// Sanitizer - stops <script> injection
const sanitize = (str) => str.replace(/[<>]/g, '').trim();

function showErr(input, id, msg){
  input.classList.add('error');
  let el = document.getElementById(id);
  if(el){ el.textContent = msg; el.classList.add('show'); }
}
function clearErr(input, id){
  input.classList.remove('error');
  let el = document.getElementById(id);
  if(el) el.classList.remove('show');
}

// Real-time prevent
fName.addEventListener('input', function(){
  this.value = this.value.replace(/[^A-Za-z ]/g,'');
  if(this.value.length >=2) clearErr(this, 'eName');
});
fPhone.addEventListener('input', function(){
  this.value = this.value.replace(/[^0-9]/g,'');
  if(this.value.length===11) clearErr(this, 'ePhone');
});
fService.addEventListener('change', function(){ if(this.value) clearErr(this, 'eService'); });
fDate.addEventListener('change', function(){ clearErr(this, 'eDate'); });
fTime.addEventListener('change', function(){ clearErr(this, 'eTime'); });

// Set min date = today
if(fDate){
  let today = new Date().toISOString().split('T')[0];
  fDate.min = today;
}

// Submit
form.addEventListener("submit", async (e) => {
 e.preventDefault();
 let valid = true;

 let nameVal = sanitize(fName.value);
 let phoneVal = fPhone.value.trim();
 let dateVal = fDate.value;

 if(!/^[A-Za-z ]{2,}$/.test(nameVal)){ showErr(fName,'eName','❌ Name: letters only, min 2'); valid=false; }
 if(!/^[0-9]{11}$/.test(phoneVal)){ showErr(fPhone,'ePhone','❌ Phone must be 11 digits'); valid=false; }
 if(!fService.value){ showErr(fService,'eService','❌ Select service'); valid=false; }
 if(!dateVal || new Date(dateVal) < new Date().setHours(0,0,0,0)){ showErr(fDate,'eDate','❌ Date cannot be in past'); valid=false; }
 if(!fTime.value){ showErr(fTime,'eTime','❌ Select time'); valid=false; }

 if(!valid) return;

 // Backend-ready data
 const payload = {
   name: nameVal,
   phone: phoneVal,
   service: sanitize(fService.value),
   date: dateVal,
   time: fTime.value,
   cart: JSON.parse(localStorage.getItem('teminails_salon_cart') || '[]')
 };

 let btn = document.getElementById('bookBtn');
 btn.textContent = "Sending..."; btn.disabled = true;
 statusEl.style.display="block"; statusEl.style.color="#000"; statusEl.textContent="Sending...";

 try{
   // For Formspree now
   let data = new FormData(form);
   let res = await fetch(form.action, {method:'POST', body:data, headers:{'Accept':'application/json'}});

   // FOR FUTURE BACKEND: just replace above with:
   // let res = await fetch('/api/book', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload)})

   if(res.ok){ statusEl.style.color="#00ff88"; statusEl.textContent="✅ Booking sent! We will contact you shortly."; form.reset(); }
   else{ statusEl.style.color="red"; statusEl.textContent="❌ Failed. WhatsApp us: 09156002887"; }
 }catch(err){ statusEl.style.color="red"; statusEl.textContent="❌ Network error"; }
 btn.textContent="Book Now"; btn.disabled=false;
});