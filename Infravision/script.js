const STR = {
  en:{eyebrow:"Civic issue reporting",title:"Infravision",tagline:"Report potholes, garbage, and water leaks in your neighborhood. Track every issue from report to resolution.",statTotal:"Issues reported",statResolved:"Resolved",statPoints:"Your points",reportHeading:"Report an issue",labelCategory:"Category",labelLocation:"Location",phLocation:"Street, landmark or area",labelDesc:"Description",phDesc:"What did you see?",submitBtn:"Submit report",catPothole:"Pothole",catGarbage:"Garbage",catWater:"Water leak",catOther:"Other",dashHeading:"Dashboard",filterAll:"All",filterReported:"Reported",filterVerified:"Verified",filterResolved:"Resolved",footer:"Demo prototype for Infravision — Smart India Hackathon 2025. Data is stored only in this browser.",dupMsg:"This looks like a duplicate of an existing report — it won't be counted twice.",okMsg:"Report submitted. Our model tagged it as:",empty:"No issues here yet.",advance:"Advance status",upvote:"Upvote"},
  hi:{eyebrow:"नागरिक समस्या रिपोर्टिंग",title:"Infravision",tagline:"अपने इलाके में गड्ढे, कचरा और पानी के रिसाव की रिपोर्ट करें। हर समस्या को रिपोर्ट से समाधान तक ट्रैक करें।",statTotal:"रिपोर्ट की गई समस्याएं",statResolved:"हल हो गईं",statPoints:"आपके अंक",reportHeading:"समस्या दर्ज करें",labelCategory:"श्रेणी",labelLocation:"स्थान",phLocation:"सड़क, लैंडमार्क या क्षेत्र",labelDesc:"विवरण",phDesc:"आपने क्या देखा?",submitBtn:"रिपोर्ट भेजें",catPothole:"गड्ढा",catGarbage:"कचरा",catWater:"पानी का रिसाव",catOther:"अन्य",dashHeading:"डैशबोर्ड",filterAll:"सभी",filterReported:"रिपोर्ट की गई",filterVerified:"सत्यापित",filterResolved:"हल हो गई",footer:"Infravision के लिए डेमो — Smart India Hackathon 2025। डेटा केवल इस ब्राउज़र में संग्रहीत है।",dupMsg:"यह किसी मौजूदा रिपोर्ट जैसा लगता है — इसे दोबारा नहीं गिना जाएगा।",okMsg:"रिपोर्ट सबमिट हुई। हमारे मॉडल ने इसे टैग किया:",empty:"यहां अभी कोई समस्या नहीं है।",advance:"स्थिति बढ़ाएं",upvote:"अपवोट"},
  bn:{eyebrow:"নাগরিক সমস্যা রিপোর্টিং",title:"Infravision",tagline:"আপনার এলাকায় গর্ত, আবর্জনা এবং জল লিক রিপোর্ট করুন। প্রতিটি সমস্যা রিপোর্ট থেকে সমাধান পর্যন্ত ট্র্যাক করুন।",statTotal:"রিপোর্ট করা সমস্যা",statResolved:"সমাধান হয়েছে",statPoints:"আপনার পয়েন্ট",reportHeading:"সমস্যা রিপোর্ট করুন",labelCategory:"বিভাগ",labelLocation:"অবস্থান",phLocation:"রাস্তা, ল্যান্ডমার্ক বা এলাকা",labelDesc:"বিবরণ",phDesc:"আপনি কী দেখেছেন?",submitBtn:"রিপোর্ট জমা দিন",catPothole:"গর্ত",catGarbage:"আবর্জনা",catWater:"জল লিক",catOther:"অন্যান্য",dashHeading:"ড্যাশবোর্ড",filterAll:"সব",filterReported:"রিপোর্ট করা",filterVerified:"যাচাইকৃত",filterResolved:"সমাধান হয়েছে",footer:"Infravision-এর জন্য ডেমো — Smart India Hackathon 2025। ডেটা শুধুমাত্র এই ব্রাউজারে সংরক্ষিত।",dupMsg:"এটি একটি বিদ্যমান রিপোর্টের অনুরূপ মনে হচ্ছে — এটি দুবার গণনা করা হবে না।",okMsg:"রিপোর্ট জমা হয়েছে। আমাদের মডেল এটি ট্যাগ করেছে:",empty:"এখানে এখনও কোনো সমস্যা নেই।",advance:"স্ট্যাটাস এগিয়ে নিন",upvote:"আপভোট"}
};
let lang = 'en';
const STAGES = ['Reported','Verified','Resolved'];
let issues = [];
let points = 0;

function load(){
  try{
    const raw = localStorage.getItem('infravision_issues');
    issues = raw ? JSON.parse(raw) : [];
    points = parseInt(localStorage.getItem('infravision_points')||'0',10);
  }catch(e){ issues=[]; points=0; }
}
function save(){
  try{
    localStorage.setItem('infravision_issues', JSON.stringify(issues));
    localStorage.setItem('infravision_points', String(points));
  }catch(e){}
}
function simpleHash(str){
  let h=0;
  for(let i=0;i<str.length;i++){ h=(h<<5)-h+str.charCodeAt(i); h|=0; }
  return h;
}
function applyLang(){
  const s = STR[lang];
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const k = el.getAttribute('data-i18n');
    if(s[k]) el.textContent = s[k];
  });
  document.querySelectorAll('[data-i18n-ph]').forEach(el=>{
    const k = el.getAttribute('data-i18n-ph');
    if(s[k]) el.placeholder = s[k];
  });
  document.querySelectorAll('.lang-btn').forEach(b=>b.classList.toggle('active', b.dataset.lang===lang));
  render();
}
document.querySelectorAll('.lang-btn').forEach(b=>{
  b.addEventListener('click',()=>{ lang=b.dataset.lang; applyLang(); });
});

let activeFilter = 'all';
document.querySelectorAll('.filter-btn').forEach(b=>{
  b.addEventListener('click',()=>{
    document.querySelectorAll('.filter-btn').forEach(x=>x.classList.remove('active'));
    b.classList.add('active');
    activeFilter = b.dataset.filter;
    render();
  });
});

document.getElementById('issueForm').addEventListener('submit', e=>{
  e.preventDefault();
  const category = document.getElementById('category').value;
  const location = document.getElementById('location').value.trim();
  const description = document.getElementById('description').value.trim();
  const flag = document.getElementById('flagMsg');
  if(!description){ return; }
  const hash = simpleHash(category+'|'+description.toLowerCase().replace(/\s+/g,''));
  const dup = issues.some(i=>i.hash===hash);
  const s = STR[lang];
  if(dup){
    flag.className='flag dup';
    flag.textContent = s.dupMsg;
  } else {
    const issue = {
      id: Date.now(),
      category, location: location || '—', description,
      status: 'Reported', hash, upvotes: 0, created: new Date().toISOString()
    };
    issues.unshift(issue);
    save();
    flag.className='flag ok';
    flag.textContent = s.okMsg + ' ' + category;
    render();
  }
  document.getElementById('description').value='';
  document.getElementById('location').value='';
});

function advanceStatus(id){
  const issue = issues.find(i=>i.id===id);
  if(!issue) return;
  const idx = STAGES.indexOf(issue.status);
  if(idx < STAGES.length-1){
    issue.status = STAGES[idx+1];
    if(issue.status==='Resolved'){ points += 10; }
    save();
    render();
  }
}
function upvote(id){
  const issue = issues.find(i=>i.id===id);
  if(!issue) return;
  issue.upvotes = (issue.upvotes||0)+1;
  save();
  render();
}

function render(){
  const s = STR[lang];
  document.getElementById('statTotal').textContent = issues.length;
  document.getElementById('statResolved').textContent = issues.filter(i=>i.status==='Resolved').length;
  document.getElementById('statPoints').textContent = points;

  const list = document.getElementById('issueList');
  const filtered = activeFilter==='all' ? issues : issues.filter(i=>i.status===activeFilter);
  if(filtered.length===0){
    list.innerHTML = `<div class="empty">${s.empty}</div>`;
    return;
  }
  list.innerHTML = filtered.map(issue=>{
    const stageIdx = STAGES.indexOf(issue.status);
    const track = STAGES.map((st,i)=>{
      const dot = `<div class="dot ${i<=stageIdx?'done':''}"></div>`;
      const seg = i<STAGES.length-1 ? `<div class="seg ${i<stageIdx?'done':''}"></div>` : '';
      return dot+seg;
    }).join('');
    const catLabel = {Pothole:s.catPothole,Garbage:s.catGarbage,'Water Leak':s.catWater,Other:s.catOther}[issue.category] || issue.category;
    const nextBtn = issue.status!=='Resolved' ? `<button class="mini-btn" onclick="advanceStatus(${issue.id})">${s.advance}</button>` : '';
    return `<div class="issue">
      <div class="issue-top">
        <div>
          <div class="issue-title">${catLabel}</div>
          <div class="issue-meta">${issue.location}</div>
        </div>
        <span class="badge ${issue.status}">${s['filter'+issue.status] || issue.status}</span>
      </div>
      <div class="issue-desc">${escapeHtml(issue.description)}</div>
      <div class="track">${track}</div>
      <div class="issue-actions">
        ${nextBtn}
        <div class="upvote">
          <button class="mini-btn" onclick="upvote(${issue.id})">▲ ${s.upvote} (${issue.upvotes||0})</button>
        </div>
      </div>
    </div>`;
  }).join('');
}
function escapeHtml(str){
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

load();
applyLang();