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
const NEW='https://github.com/bisht-the-beast/mavryk-tweet-finder/issues/new';
const openIssue=(t,b)=>window.open(`${NEW}?title=${encodeURIComponent(t)}&labels=${encodeURIComponent(t)}&body=${encodeURIComponent(b)}`,'_blank','noopener');
document.getElementById('refresh').onclick=()=>openIssue('refresh','Please run the reply scanner and publish the latest batch.');
const af=document.getElementById('addform');document.getElementById('addbtn').onclick=()=>{af.hidden=!af.hidden;if(!af.hidden)document.getElementById('handles').focus();};
af.onsubmit=e=>{e.preventDefault();const hs=[...new Set(document.getElementById('handles').value.split(/[,\n\s]+/).map(s=>s.trim().replace(/^@/,'')).filter(s=>/^\w{1,15}$/.test(s)))];
 if(!hs.length){alert('Enter at least one valid X handle.');return;}openIssue('add-accounts',hs.join('\n'));};
const chips=a=>a.length?'<div class="chips">'+a.map(h=>`<a href="https://x.com/${esc(h)}" target="_blank" rel="noopener">@${esc(h)}</a>`).join('')+'</div>':'<p class="muted">None yet.</p>';
fetch('data/accounts.json?'+Date.now()).then(r=>r.json()).then(j=>{document.getElementById('acctlist').innerHTML=
 '<h3>Priority</h3>'+chips(j.priority||[])+'<h3>Added by you</h3>'+chips(j.added||[]);}).catch(()=>document.getElementById('acctlist').textContent='Could not load accounts.');
