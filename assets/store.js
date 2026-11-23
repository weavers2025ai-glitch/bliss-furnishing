/* Bliss Furnishing — store engine (cart, orders, accounts, settings)
   Demo-level: everything is stored in this browser's localStorage.
   Pages set window.ROOT ("../" from /animated/ and /admin/) before loading. */
(function(){
const R = window.ROOT || "";
const K = {cart:"bliss_cart", orders:"bliss_orders", users:"bliss_users", session:"bliss_session",
           override:"bliss_override", settings:"bliss_settings", pw:"bliss_admin_pw"};
const load=(k,d)=>{try{const v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}};
const save=(k,v)=>localStorage.setItem(k,JSON.stringify(v));

const DEFAULT_SLIDES=[
 {img:"images/hero-bliss.jpg",kick:"Bliss Furnishing · Crafting Comfort, Shaping Spaces",h:"Outdoor living, beautifully crafted for the Emirates.",sub:"Premium outdoor furniture for Dubai villas, resorts and terraces — a proud legacy of Weavers Creation.",btn:"Explore the Collection",link:"collection.html"},
 {img:"images-uae/dining.jpg",kick:"Dining Inspirations",h:"Dine under the open sky.",sub:"Teak dining sets and pergolas, custom-made for long Emirates evenings.",btn:"Shop Dining",link:"collection.html"},
 {img:"images/milano.jpg",kick:"Featured — The Milano Sofa",h:"Resort comfort, made to your size.",sub:"Plush cushioning and weather-resistant materials — Ocean Mist, Sunset Coral or Classic Gray.",btn:"Shop the Milano",link:"collection.html"},
 {img:"images-uae/sunbeds.jpg",kick:"Season Offer",h:"Villa & resort packages, with free design consultation.",sub:"Complete pool-deck and terrace packages — one team for design, fabrication and installation.",btn:"Get the Offer",link:"contact.html"},
 {img:"images/gazebo.jpg",kick:"Custom FF&E Projects",h:"Gazebos & pergolas, built around your space.",sub:"Villas · Resorts · Hotels — custom sizes, fabrics and finishes, finished in Dubai.",btn:"Start a Project",link:"contact.html"}
];
const DEFAULT_SETTINGS={wa:"923139168846",email:"sales@blissfurnishing.ae",googleClientId:"",heroSlides:DEFAULT_SLIDES};

window.Bliss={
 K,
 money:n=>"AED "+Number(n||0).toLocaleString("en-US"),
 img:p=>{ const v=p.img||""; return (v.startsWith("data:")||v.startsWith("http"))?v:R+v; },
 products(){ const o=load(K.override,null); if(Array.isArray(o)&&o.length) return o; return (typeof PRODUCTS!=="undefined"&&Array.isArray(PRODUCTS))?PRODUCTS:[]; },
 saveProducts(list){ save(K.override,list); },
 settings(){ return Object.assign({},DEFAULT_SETTINGS,load(K.settings,{})); },
 saveSettings(s){ save(K.settings,s); },
 /* cart */
 cart(){ return load(K.cart,[]); },
 cartCount(){ return this.cart().reduce((a,i)=>a+i.qty,0); },
 cartTotal(){ const ps=this.products(); return this.cart().reduce((a,i)=>{const p=ps.find(x=>x.id===i.id);return a+(p?p.price*i.qty:0)},0); },
 cartHasQuote(){ const ps=this.products(); return this.cart().some(i=>{const p=ps.find(x=>x.id===i.id);return p&&!p.price}); },
 addToCart(id,qty){ const c=this.cart(); const it=c.find(i=>i.id===id); if(it)it.qty+=(qty||1); else c.push({id,qty:qty||1}); save(K.cart,c); this.badge(); this.toast("Added to cart"); },
 setQty(id,q){ let c=this.cart(); const it=c.find(i=>i.id===id); if(it){it.qty=q; if(q<=0)c=c.filter(i=>i.id!==id);} save(K.cart,c); this.badge(); },
 clearCart(){ save(K.cart,[]); this.badge(); },
 badge(){ document.querySelectorAll(".cartCount").forEach(e=>{const n=this.cartCount(); e.textContent=n; e.style.display=n?"grid":"none";}); },
 /* orders */
 orders(){ return load(K.orders,[]); },
 addOrder(o){ const os=this.orders(); os.unshift(o); save(K.orders,os); },
 saveOrders(os){ save(K.orders,os); },
 /* accounts (manual) */
 users(){ return load(K.users,[]); },
 signup(name,email,phone,pass){ const us=this.users(); if(us.some(u=>u.email===email)) return {err:"This email is already registered. Please log in."};
   us.push({name,email,phone,pass,provider:"manual",at:Date.now()}); save(K.users,us); save(K.session,{name,email}); return {ok:1}; },
 login(email,pass){ const u=this.users().find(u=>u.email===email&&u.pass===pass); if(!u) return {err:"Email or password is incorrect."};
   save(K.session,{name:u.name,email:u.email}); return {ok:1}; },
 googleLogin(profile){ const us=this.users(); if(!us.some(u=>u.email===profile.email)){ us.push({name:profile.name,email:profile.email,phone:"",pass:"",provider:"google",at:Date.now()}); save(K.users,us);} save(K.session,{name:profile.name,email:profile.email}); },
 user(){ return load(K.session,null); },
 logout(){ localStorage.removeItem(K.session); },
 /* ui */
 toast(msg){ let t=document.getElementById("blissToast"); if(!t){ t=document.createElement("div"); t.id="blissToast";
   t.style.cssText="position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(20px);background:#0d1f3c;color:#fff;padding:13px 22px;border-radius:99px;font-weight:700;font-size:14.5px;z-index:300;opacity:0;transition:.35s;box-shadow:0 16px 36px rgba(8,22,48,.3)"; document.body.appendChild(t);} 
   t.textContent=msg; t.style.opacity="1"; t.style.transform="translateX(-50%) translateY(0)";
   clearTimeout(t._h); t._h=setTimeout(()=>{t.style.opacity="0"; t.style.transform="translateX(-50%) translateY(20px)"},2200); }
};
document.addEventListener("DOMContentLoaded",()=>Bliss.badge());
})();
