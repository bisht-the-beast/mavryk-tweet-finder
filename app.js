let data=[],filter='all';
const ist=d=>new Date(d).toLocaleString('en-IN',{timeZone:'Asia/Kolkata',dateStyle:'medium',timeStyle:'short'})+' IST';
const fmt=n=>n>=1e6?(n/1e6).toFixed(1).replace(/\.0$/,'')+'M':n>=1e3?Math.round(n/1e3)+'K':String(n);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function render(){const m=document.getElementById('batches');
 const bs=[...data].sort((a,b)=>new Date(b.time)-new Date(a.time));
 m.innerHTML=bs.map(b=>{const ps=b.posts.filter(p=>filter==='all'||p.reply_as===filter);if(!ps.length)return'';
  return `<section><h2>${esc(ist(b.time))}${b.label?` <small>· ${esc(b.label)}</small>`:''}</h2>`+ps.map(p=>`<article class="post"><div class="top">
  <span class="author">@${esc(p.author)}</span><span class="fol">${fmt(+p.followers||0)} followers</span>
  <span class="badge b-${esc(p.reply_as)}">Reply as ${esc(p.reply_as)}</span></div>
  <p class="reason">${esc(p.reason)}</p><a href="${esc(p.url)}" target="_blank" rel="noopener">${esc(p.url)}</a></article>`).join('')+'</section>'}).join('')||'<p class="muted">No posts.</p>';}
document.getElementById('filters').onclick=e=>{const f=e.target.dataset.f;if(!f)return;filter=f;
 document.querySelectorAll('#filters button').forEach(b=>b.classList.toggle('on',b.dataset.f===f));render();};
fetch('data/batches.json?'+Date.now()).then(r=>r.json()).then(j=>{data=j.batches||[];
 document.getElementById('updated').textContent='Last updated: '+(j.updated?ist(j.updated):'—');render();})
 .catch(()=>document.getElementById('batches').innerHTML='<p class="muted">Could not load data.</p>');
