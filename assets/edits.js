(() => {
  const mode = document.body.dataset.mode;
  const records = window.POLICY_EDITS[mode].filter(record => /\p{L}/u.test(record.text));
  const $ = id => document.getElementById(id);
  const years = [...new Set(records.map(record => record.date.slice(0,4)))].sort();
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let year = '', entries = [], index = 0, playing = !reduced.matches, timer;
  $('mode-label').textContent = mode === 'additions' ? 'Added to the policy' : 'Deleted from the policy';
  document.querySelector(`header nav a[href="${mode}.html"]`).setAttribute('aria-current','page');
  function fit() {
    const el = $('phrase'), box = el.parentElement;
    let lo=8, hi=4*parseFloat(getComputedStyle(box).fontSize);
    for(let i=0;i<12;i++) {
      const size=(lo+hi)/2; el.style.fontSize=size+'px';
      if(el.scrollHeight<=box.clientHeight && el.scrollWidth<=box.clientWidth) lo=size; else hi=size;
    }
    el.style.fontSize=lo+'px';
  }
  function render() {
    const entry=entries[index];
    const el=$('phrase'); el.replaceChildren();
    if(!entry) {
      el.textContent = 'No '+mode+' recorded in '+year+'.';
      $('edit-date').textContent = year;
      $('source').hidden=true; $('position').textContent='0 / 0'; $('part-note').textContent='';
    } else {
      const words=entry.text.split(/\s+/), truncated=words.length>100;
      const preview=words.slice(0,100).join(' ')+(truncated?'…':'');
      preview.split(' ').forEach((word,i)=>{
        const span=document.createElement('span');span.className='word';span.style.setProperty('--i',Math.min(i,40));span.textContent=word;
        el.append(span,document.createTextNode(' '));
      });
      $('edit-date').textContent=entry.label;
      $('edit-date').dateTime=entry.date.replace(/(\d{4})(\d{2})(\d{2})/,'$1-$2-$3');
      $('source').hidden=false; $('source').href=entry.url;
      $('position').textContent=`${index+1} / ${entries.length}`;
      $('part-note').textContent=truncated?'First 100 words…':'';
    }
    document.querySelector('.progress div').style.width=entries.length?`${(index+1)/entries.length*100}%`:'0';
    fit();
  }
  function schedule() {
    clearInterval(timer);
    $('play').textContent=playing?'Pause':'Play'; $('play').setAttribute('aria-pressed',String(playing));
    if(playing && entries.length>1 && !document.hidden) timer=setInterval(()=>{ index=(index+1)%entries.length;render(); },1000);
  }
  function choose(value) {
    year=years.includes(value)?value:years[0];
    entries=records.filter(r=>r.date.startsWith(year)); index=0;
    document.querySelectorAll('.years a').forEach(a=>{
      if(a.dataset.year===year) a.setAttribute('aria-current','date');else a.removeAttribute('aria-current');
    });
    document.querySelector('.years a[aria-current]').scrollIntoView({block:'nearest',inline:'center'});
    $('year-slider').value=years.indexOf(year);
    $('year-slider').setAttribute('aria-valuetext',year);
    document.querySelectorAll('header nav a').forEach(a=>{ a.href=a.getAttribute('href').split('#')[0]+'#'+year; });
    render();schedule();
  }
  for(const y of years) {
    const a=document.createElement('a');a.href='#'+y;a.dataset.year=y;a.textContent=y;
    const count=records.filter(r=>r.date.startsWith(y)).length;
    a.title=`${y}: ${count} ${mode}`;
    if(!count) a.classList.add('empty');
    document.querySelector('.years').append(a);
  }
  $('year-slider').min=0;
  $('year-slider').max=years.length-1;
  $('year-slider').addEventListener('input',e=>{location.hash=years[Number(e.target.value)];});
  window.addEventListener('hashchange',()=>choose(location.hash.slice(1)));
  $('play').onclick=()=>{playing=!playing;schedule();};
  function step(delta) {playing=false; if(entries.length) index=(index+delta+entries.length)%entries.length;render();schedule();}
  $('previous').onclick=()=>step(-1);$('next').onclick=()=>step(1);
  document.addEventListener('keydown',e=>{
    if(e.target.closest('a,button,input'))return;
    if(e.code==='Space'){e.preventDefault();playing=!playing;schedule();}
    if(e.key==='ArrowRight')step(1);if(e.key==='ArrowLeft')step(-1);
  });
  document.addEventListener('visibilitychange',schedule);
  window.addEventListener('resize',fit);
  document.fonts.ready.then(fit);
  choose(location.hash.slice(1));
})();
