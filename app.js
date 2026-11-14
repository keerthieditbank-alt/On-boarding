/* FRAMEWORK — fully static, privacy-first, GitHub Pages-ready application. */
(() => {
  'use strict';
  const D = window.SOP_DATA;
  const LS_KEY = 'framework_video_sop_v1'; // Keep existing browser progress across website updates.
  const app = document.getElementById('app');
  const toastEl = document.getElementById('toast');
  const keys = ['short','long'];
  const esc = str => String(str ?? '').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const clamp = (n,a,b) => Math.max(a,Math.min(b,n));
  const dateTime = () => new Date().toLocaleString('en-IN',{dateStyle:'medium',timeStyle:'short'});
  const clone = x => JSON.parse(JSON.stringify(x));
  function initState(){
    return { v:3, editor:'Editor', activeFormat:'short', progress:{short:{},long:{}}, settings:{short:clone(D.formats.short.defaults),long:clone(D.formats.long.defaults)}, final:{short:{checks:[],mixerChecks:[],mixerSource:'',project:'',url:'',reviewer:'',notes:'',submitted:false,submitTime:''},long:{checks:[],mixerChecks:[],mixerSource:'',project:'',url:'',reviewer:'',notes:'',submitted:false,submitTime:''}}};
  }
  function normalizeState(input){
    const base=initState();
    if(!input || typeof input!=='object')return base;
    if(typeof input.editor==='string')base.editor=input.editor.slice(0,100);
    if(keys.includes(input.activeFormat))base.activeFormat=input.activeFormat;
    for(const fmt of keys){
      const userSettings=input.settings?.[fmt];
      if(userSettings && typeof userSettings==='object')for(const k of Object.keys(base.settings[fmt]))if(typeof userSettings[k]==='string')base.settings[fmt][k]=userSettings[k].slice(0,200);
      // For existing deployments, upgrade UNMODIFIED legacy defaults to the exact user screenshots.
      // Keep user-customized fields (and all saved quizzes/checklists) untouched.
      if(input.v===1 && userSettings && typeof userSettings==='object'){
        const legacy=fmt==='short'?{resolution:'1080 × 1920',fps:'30',bitrate:'16 Mbps',maxBitrate:'20 Mbps',bitrateEncoding:'VBR, 1 pass',audioBitrate:'320 kbps'}:{resolution:'1920 × 1080',fps:'25',bitrate:'16 Mbps',maxBitrate:'25 Mbps',bitrateEncoding:'VBR, 1 pass',audioBitrate:'320 kbps'};
        if(Object.entries(legacy).every(([k,v])=>userSettings[k]===v))Object.assign(base.settings[fmt],D.formats[fmt].defaults);
      }
      const progress=input.progress?.[fmt];
      if(progress && typeof progress==='object')for(const m of D.common){
        const p=progress[m.id];if(!p || typeof p!=='object')continue;
        const legacyPassed=p.quizPassed===true;
        const answers=m.quizzes.map((q,i)=>{
          if(Array.isArray(p.quizAnswers) && Number.isInteger(p.quizAnswers[i]))return p.quizAnswers[i];
          if(i===0 && legacyPassed)return q.correct; // existing one-question progress preserved
          return null;
        });
        base.progress[fmt][m.id]={tasks:m.tasks.map((_,i)=>p.tasks?.[i]===true),quizAnswers:answers,quizPassed:m.quizzes.every((q,i)=>answers[i]===q.correct),selected:Number.isInteger(p.selected)?p.selected:null};
      }
      const f=input.final?.[fmt];if(f && typeof f==='object'){
        base.final[fmt].checks=D.finalChecks[fmt].map((_,i)=>f.checks?.[i]===true);
        base.final[fmt].mixerChecks=D.mixerChecks.map((_,i)=>f.mixerChecks?.[i]===true);
        for(const key of ['mixerSource','project','url','reviewer','notes','submitTime'])if(typeof f[key]==='string')base.final[fmt][key]=f[key].slice(0,3000);
        base.final[fmt].submitted=f.submitted===true;
      }
    }
    return base;
  }
  function getState(){try{const str=localStorage.getItem(LS_KEY);return str?normalizeState(JSON.parse(str)):initState()}catch(err){return initState()}}
  let state=getState(), searchQuery='', toastTimer;
  function save(){try{localStorage.setItem(LS_KEY,JSON.stringify(state))}catch(err){toast('Could not save to this browser. Please export your backup.')}}
  function toast(msg){toastEl.textContent=msg;toastEl.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toastEl.classList.remove('show'),2800)}
  function prog(fmt,id){if(!state.progress[fmt][id])state.progress[fmt][id]={tasks:D.common.find(x=>x.id===id).tasks.map(()=>false),quizAnswers:D.common.find(x=>x.id===id).quizzes.map(()=>null),quizPassed:false,selected:null};return state.progress[fmt][id]}
  function done(fmt,m){const p=prog(fmt,m.id);return m.quizzes.every((q,i)=>p.quizAnswers?.[i]===q.correct) && m.tasks.every((_,i)=>p.tasks[i]===true)}
  function count(fmt){let n=0;for(const m of D.common){if(!done(fmt,m))break;n++}return n}
  function percent(fmt){return Math.round(count(fmt)/D.common.length*100)}
  function moduleIndex(id){return D.common.findIndex(m=>m.id===id)}
  function unlocked(fmt,id){const i=moduleIndex(id);return i>=0 && D.common.slice(0,i).every(m=>done(fmt,m))}
  function requiredPrevious(fmt,id){const i=moduleIndex(id);return i<=0?null:D.common.slice(0,i).find(m=>!done(fmt,m))||null}
  function fmtName(fmt){return D.formats[fmt].name}
  function route(){let h=decodeURIComponent(location.hash.replace(/^#\/?/,'')||'overview');return h.split('/').filter(Boolean)}
  function jump(hash){if(location.hash===hash){render(true)}else{location.hash=hash}}
  function nav(active){const entries=[['overview','Overview'],['library','SOP Library'],['final','Final Edit'],['settings','Settings']];return `<header class="topbar"><div class="top-inner"><a class="brand" href="#/overview" aria-label="FRAMEWORK overview"><span class="brand-logo">ϟ</span><span><span class="brand-name">FRAMEWORK</span><span class="brand-tag">The Editing Playbook</span></span></a><nav id="topnav" class="topnav" aria-label="Main navigation">${entries.map(([href,label])=>`<a class="navbtn ${active===href?'active':''}" href="#/${href}">${label}</a>`).join('')}</nav><div class="topright"><span class="tiny-progress"><span class="tiny-dot"></span>${count(state.activeFormat)}/8 complete</span><span class="avatar" title="Local profile">${esc((state.editor.trim()[0]||'E').toUpperCase())}</span><button class="menu-btn" data-action="menu" aria-label="Toggle navigation">☰</button></div></div></header>`}
  function footer(){return `<footer class="foot"><span>© FRAMEWORK · A local-first editing SOP & onboarding workspace</span><span>Made by Senior Editor Md Irfan Raza · Built for GitHub Pages</span></footer>`}
  function pageHtml(content,active='overview'){return `<div class="shell">${nav(active)}<main class="wrap" id="main-content">${content}</main>${footer()}</div>`}
  function formatSelector(){return `<div class="formatbar" role="group" aria-label="Choose video format">${keys.map(k=>`<button type="button" class="format-pill ${state.activeFormat===k?'selected':''}" data-action="format" data-format="${k}" aria-pressed="${state.activeFormat===k}"><span class="glyph">${D.formats[k].icon}</span>${D.formats[k].name}<span class="fmt-small">${D.formats[k].defaults.ratio}</span></button>`).join('')}</div>`}
  function nextId(fmt){return (D.common.find(m=>!done(fmt,m))||D.common[0]).id}
  function moduleCards(fmt){return D.common.map((m,i)=>{
    const completed=done(fmt,m), locked=!unlocked(fmt,m.id), requirement=requiredPrevious(fmt,m.id);
    const label=locked?`Locked · Finish Module ${requirement?.number||'01'} first`:completed?'✓ Completed':(prog(fmt,m.id).quizAnswers||[]).every((choice,i)=>choice===m.quizzes[i].correct)?'Finish remaining tasks':'Start module';
    return `<button type="button" data-action="open-module" data-format="${fmt}" data-module="${m.id}" class="module-card tone-${m.theme} ${completed&&!locked?'complete':''} ${locked?'module-locked':''}" aria-label="${locked?'Locked':'Open'} module ${i+1}: ${esc(m.title)}" ${locked?`disabled title="Complete Module ${requirement?.number||'01'} to unlock"`:''}><span class="num">MODULE ${m.number}</span><span class="module-icon" aria-hidden="true">${locked?'🔒':m.icon}</span><h3>${esc(m.title)}</h3><p>${esc(m.subtitle)}</p><span class="card-bottom"><span class="status ${completed&&!locked?'complete':''}">${label}</span><span class="card-arrow">${locked?'🔒':'↗'}</span></span>${completed&&!locked?'<span class="ribbon">DONE</span>':''}</button>`;
  }).join('')}
  function overview(){const f=state.activeFormat,settings=state.settings[f];let overall=Math.round((count('short')+count('long'))/16*100);return pageHtml(`<section class="hero"><div class="hero-content"><div class="hero-kicker">VIDEO EDITOR ONBOARDING · ${D.formats[f].tag}</div><h1>LET’S EDIT<br/>SOME <span class="grad-word">${f==='short'?'REELS':'STORIES'}</span><span class="green-word">.</span></h1><p>${esc(D.formats[f].heroNote)} Eight guided modules, real SOP checklists, instant quizzes and a final delivery review.</p><div class="hero-actions"><button class="btn" data-action="open-module" data-format="${f}" data-module="${nextId(f)}">${count(f)===0?'Start onboarding':'Continue learning'} <span>↗</span></button><a class="btn secondary" href="#/settings">⚙ Original screenshots</a></div>${formatSelector()}</div><div class="hero-floating"><div class="eyebrow">YOUR PROGRESS</div><div class="big-num">${count(f)}<span style="color:#adbbc2"> / 8</span></div><div class="floating-sub">modules completed · ${esc(fmtName(f))}</div><div style="margin-top:14px" class="progress-track"><div class="progress-bar" style="width:${percent(f)}%"></div></div></div></section><div class="metrics-row"><div class="metric"><div class="metric-name">Format</div><div class="metric-value">${esc(settings.ratio)}</div><div class="metric-note">${esc(D.formats[f].tag)} workflow</div></div><div class="metric"><div class="metric-name">Video target</div><div class="metric-value" style="font-size:24px">${esc(settings.duration)}</div><div class="metric-note">From your original reference</div></div><div class="metric"><div class="metric-name">Total journey</div><div class="metric-value">${overall}%</div><div class="metric-note">Across both formats</div></div></div><section aria-labelledby="modules-title"><div class="page-heading"><div><div class="eyebrow">EIGHT MODULES · PERSONALIZED SOP</div><h2 id="modules-title">THE EIGHT <span class="green-word">MODULES</span></h2><p>Finish each checklist and all quiz questions to unlock the next module. Quiz difficulty increases as you progress.</p></div><span class="tagline">${percent(f)}% complete · ${esc(fmtName(f))}</span></div><div class="modules-grid">${moduleCards(f)}</div></section><div class="info-strip"><div><strong>All eight modules complete?</strong><p>Run your final quality checklist, paste a review link and export a shareable delivery report.</p></div><a href="#/final" class="btn dark">Go to Final Edit ↗</a></div><div class="overview-bottom"><div class="insight"><div class="smallcaps">YOUR FORMAT</div><h3 style="margin-top:10px">${esc(fmtName(f))} settings</h3><div class="summary-row"><span>Resolution</span><strong>${esc(settings.resolution)}</strong></div><div class="summary-row"><span>Frame rate</span><strong>${esc(settings.fps)} fps</strong></div><div class="summary-row"><span>Hook target</span><strong>${esc(settings.hook)}</strong></div><div class="summary-row"><span>Visual rhythm</span><strong>${esc(settings.visual)}</strong></div><a class="workbench-link" href="#/settings" style="display:inline-block;margin-top:17px">View original screenshots →</a></div><div class="insight"><div class="smallcaps">CREATIVE STANDARDS</div><h3 style="margin-top:10px">The rules we work by</h3><p>From your uploaded Video Editing SOP. Creative judgment matters more than rigid timing.</p><div class="rule-tags"><span class="rule-tag">Story before effects</span><span class="rule-tag">No recycled B-roll</span><span class="rule-tag">Natural color</span><span class="rule-tag">Clear voice</span><span class="rule-tag">Purposeful visuals</span><span class="rule-tag">Full export review</span></div></div></div>`,'overview')}
  function welcomeResources(fmt){return `<section class="panel resources-panel"><div class="section-label">PROJECT FOLDER STRUCTURE</div><h2>Organize every editing project like this</h2>
      <div class="file-tree" role="tree" aria-label="Project file structure">
        <div class="tree-row root-row" role="treeitem" aria-expanded="true"><span>📁</span> ${fmt==='short'?'SF':'LF'}_Video_Name</div>
        <div class="tree-row depth1" role="treeitem"><span>📁</span> 01_Raw_Footage <small>Original source clips</small></div>
        <div class="tree-row depth1" role="treeitem"><span>📁</span> 02_B-Roll <small>Supporting video / images</small></div>
        <div class="tree-row depth1" role="treeitem"><span>📁</span> 03_Audio <small>Music / voice / SFX</small></div>
        <div class="tree-row depth2" role="treeitem"><span>📂</span> Music</div>
        <div class="tree-row depth2" role="treeitem"><span>📂</span> SFX</div>
        <div class="tree-row depth1" role="treeitem"><span>📁</span> 04_Graphics <small>Super text / titles / assets</small></div>
        <div class="tree-row depth1" role="treeitem"><span>📁</span> 05_Project_File <small>Premiere / After Effects</small></div>
        <div class="tree-row depth1" role="treeitem"><span>📁</span> 06_Exports</div>
        <div class="tree-row depth2" role="treeitem"><span>🎞️</span> ${fmt==='short'?'SF':'LF'}_&lt;video name&gt;_1st draft.mp4</div>
        <div class="tree-row depth2" role="treeitem"><span>🎞️</span> ${fmt==='short'?'SF':'LF'}_&lt;video name&gt;_Final.mp4</div>
        <div class="tree-row depth1" role="treeitem"><span>📁</span> 07_Script_Notes <small>Brief / transcript</small></div>
      </div><p class="resource-note">Folder names are a suggested visual organization; use the required SF_ / LF_ filename convention for draft and final exports.</p>
      </section><section class="panel resources-panel"><div class="section-label">PRACTICAL ASSIGNMENT</div><h2>Choose one reel to edit</h2>
      <p>The assignment's raw-files folder contains <strong>multiple reels</strong>. Choose the reel you want to edit, then follow the modules from planning to final export.</p>
      <a class="resource-button" href="https://drive.google.com/drive/folders/1egBN0TJipvxXzDK7aiCJ3d6Hx7l7pkxL?usp=sharing" target="_blank" rel="noopener noreferrer">📁 Open assignment raw files ↗</a></section>`}
  function audioResources(){return `<section class="panel resources-panel"><div class="section-label">TEAM AUDIO PRESET</div><h2>Approved audio preset</h2><p>Use the shared reference preset for your audio workflow, then verify the Audio Track Mixer effects in Premiere Pro before export.</p><a class="resource-button" href="https://drive.google.com/file/d/1P1t1-sIoFl6C9_dsH9EWSV-NAiEAm8NR/view?usp=sharing" target="_blank" rel="noopener noreferrer">🔊 Open audio preset on Google Drive ↗</a></section>`}
  function lesson(fmt,id){const m=D.common.find(x=>x.id===id);if(!m)return notFound();const p=prog(fmt,m.id),overlay=D.overlays[fmt][id],passed=done(fmt,m),idx=D.common.indexOf(m),prev=D.common[idx-1],next=D.common[idx+1];return pageHtml(`<div class="lesson-layout"><aside class="sidebar" aria-label="Course modules"><div class="sidebar-kicker">MODULES · ${esc(fmtName(fmt))}</div>${D.common.map(x=>{const locked=!unlocked(fmt,x.id),req=requiredPrevious(fmt,x.id);return `<button type="button" class="step-link ${m.id===x.id?'active':''} ${locked?'is-locked':''}" data-action="open-module" data-format="${fmt}" data-module="${x.id}" ${locked?`disabled title="Finish Module ${req?.number||'01'} first"`:''} aria-label="${locked?'Locked ':'Module '}${x.number} ${esc(x.title)}"><span class="step-id">${x.number}</span><span class="step-title">${esc(x.title)}</span>${locked?'<span class="lock-icon" aria-hidden="true">🔒</span>':done(fmt,x)?'<span class="done">✓</span>':''}</button>`}).join('')}<div class="side-divider"></div><div class="side-mini"><strong>${count(fmt)}/8 complete</strong> · Your progress is saved in this browser.</div><div class="side-progress"><span style="width:${percent(fmt)}%"></span></div></aside><article class="lesson-main"><div class="lesson-top"><a class="backlink" href="#/overview">← All modules</a><span class="dim">${esc(fmtName(fmt))} · ${idx+1} of 8</span></div><header class="lesson-header"><div class="lesson-count">MODULE ${m.number} / 08</div><h1>${esc(m.title)}</h1><p>${esc(m.subtitle)} This module follows the team SOP with ${esc(fmtName(fmt).toLowerCase())} guidance.</p></header><div class="panel focus-panel"><div class="section-label">${D.formats[fmt].tag} · ${esc(state.settings[fmt].ratio)}</div><h2>${esc(fmtName(fmt))} focus</h2><p>${esc(overlay.focus)}</p><ul>${overlay.tips.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>${m.lessons.map((l,i)=>`<section class="panel"><div class="section-label">LESSON ${m.number}.${i+1}</div><h2>${esc(l.title)}</h2><p>${esc(l.body)}</p><ul>${l.points.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></section>`).join('')}${id==='setup'?welcomeResources(fmt):''}${id==='audio'?audioResources():''}${id==='setup'?originalScreenshot(fmt):id==='delivery'?`${originalScreenshot(fmt)}${originalScreenshot('mixer')}`:''}<div class="two-panels"><section class="panel dos"><div class="section-label" style="color:#3d965a">DO THIS</div><ul>${m.dos.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></section><section class="panel donts"><div class="section-label" style="color:#c86b60">AVOID THIS</div><ul>${m.donts.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></section></div><section class="task-card"><div class="task-heading"><div><div class="section-label">PRACTICAL CHECKLIST</div><h2>Mark each step done</h2></div><span class="status">${p.tasks.filter(Boolean).length} / ${m.tasks.length} tasks</span></div>${m.tasks.map((task,i)=>`<label class="task-row"><input type="checkbox" data-action="task" data-format="${fmt}" data-module="${id}" data-index="${i}" ${p.tasks[i]?'checked':''} /><span>${esc(task)}</span></label>`).join('')}</section><section class="quiz"><div class="section-label">KNOWLEDGE CHECK · ${m.quizzes.length} ${m.quizzes.length===1?'QUESTION':'QUESTIONS'}</div><h2>Check your understanding</h2><p class="quiz-intro">Answer every question correctly before the next module unlocks.</p><div class="quiz-counter">${m.quizzes.filter((q,i)=>p.quizAnswers?.[i]===q.correct).length} / ${m.quizzes.length} correct</div>${m.quizzes.map((q,qi)=>{const selection=p.quizAnswers?.[qi];const correct=selection===q.correct;return `<div class="question-block"><div class="question-number">QUESTION ${qi+1} / ${m.quizzes.length}</div><div class="quiz-question">${esc(q.q)}</div>${q.a.map((x,i)=>`<button type="button" class="answer ${selection===i?(correct?'correct':'wrong'):''}" data-action="quiz" data-format="${fmt}" data-module="${id}" data-question="${qi}" data-choice="${i}" ${correct?'disabled':''}><span class="letter">${String.fromCharCode(65+i)}</span><span>${esc(x)}</span>${selection===i?'<span style="margin-left:auto">'+(correct?'✓':'×')+'</span>':''}</button>`).join('')}${correct?`<div class="quiz-feedback good">✓ Correct. ${esc(q.why)}</div>`:selection!==null&&selection!==undefined?`<div class="quiz-feedback bad">Try again — review the lesson if needed.</div>`:''}</div>`}).join('')}</section>${passed?'<div class="complete-banner completion-confetti"><span class="star">✦</span><span>Module completed! Your checklist and all questions are finished.</span></div>':`<div class="notice" style="margin-top:15px">To complete this module: check all ${m.tasks.length} tasks and answer all ${m.quizzes.length} questions correctly.</div>`}<div class="lesson-ctas">${prev?`<button class="btn secondary" data-action="open-module" data-format="${fmt}" data-module="${prev.id}">← Previous module</button>`:'<a class="btn secondary" href="#/overview">← Overview</a>'}${next?`<button class="btn dark" data-action="open-module" data-format="${fmt}" data-module="${next.id}" ${passed?'':'disabled title="Finish all tasks and pass the quiz to unlock"'}>${passed?'Next module →':'🔒 Next module locked'}</button>`:`<a class="btn dark ${passed?'':'disabled-link'}" ${passed?'href="#/final"':'aria-disabled="true"'}>Continue to Final Edit →</a>`}</div><div class="callout-bottom">Source: your uploaded <a class="simple-link" href="./reference/Video_Editing_SOP.html" target="_blank" rel="noopener noreferrer">Video Editing SOP ↗</a>. This learning interface organizes those standards into practical tasks and quiz steps. Check the full SOP for additional details.</div></article></div>`,'overview')}
  function originalScreenshot(type){
    const ref={short:{file:'short-format-export-original.png',title:'Original Short Format Export Settings',w:455,h:2048},long:{file:'long-format-export-original.png',title:'Original Long Format Export Settings',w:455,h:2048},mixer:{file:'audio-track-mixer-original.png',title:'Original Audio Track Mixer',w:1920,h:963}}[type];
    if(!ref)return '';
    const src=`./assets/original-screenshots/${ref.file}`;
    return `<figure class="screenshot-only-item ${type==='mixer'?'screenshot-mixer':''}"><figcaption>${esc(ref.title)}</figcaption><a href="${src}" target="_blank" rel="noopener noreferrer" aria-label="Open ${esc(ref.title)} screenshot in a new tab"><img src="${src}" width="${ref.w}" height="${ref.h}" alt="${esc(ref.title)} – original user screenshot" loading="eager" decoding="async"></a></figure>`;
  }
  function sourceSequenceNotes(fmt){
    return fmt==='short'
    ? `<div class="sequence-source-note"><strong>Sequence Settings from your earlier screenshot:</strong> Custom · 1080 × 1920 (9:16) · 25.00 fps · Square Pixels (1.0) · Progressive · 48,000 Hz Stereo · QuickTime / Apple ProRes 422 LT previews. Sequence: Maximum Render Quality checked; Maximum Bit Depth unchecked; Composite in Linear Color checked.</div>`
    : `<div class="sequence-source-note"><strong>Sequence Settings from your earlier screenshot:</strong> Custom · 3840 × 2160 (16:9) · 23.976 fps · Square Pixels (1.0) · Progressive · 48,000 Hz Stereo · QuickTime / Apple ProRes 422 LT previews. Sequence: Maximum Render Quality unchecked; Maximum Bit Depth unchecked; Composite in Linear Color checked.</div>`;
  }
  function settingsCard(fmt){
    const s=state.settings[fmt], f=D.formats[fmt];
    const entryFields=[
      ['resolution','Export resolution','text'],['ratio','Aspect ratio','select'],
      ['fps','Frame rate (fps)','select'],['duration','Target video duration','text'],
      ['hook','Hook window','text'],['visual','Suggested visual change','text'],
      ['subtitles','Subtitles','select'],['platform','Primary platform','text'],
      ['safeZone','Safe-zone note','text']
    ];
    const exportFields=[
      ['exportFormat','Format / container','select'],['bitrateEncoding','Bitrate encoding','select'],
      ['bitrate','Target bitrate','text'],['maxBitrate','Maximum bitrate','text'],
      ['fieldOrder','Field order','select'],['pixelAspect','Pixel aspect ratio','select'],
      ['colorSpace','Color space','select'],['audioCodec','Audio codec','select'],
      ['audioSampleRate','Audio sample rate','select'],['audioBitrate','Audio bitrate','select'],
      ['renderQuality','Render quality','select'],['renderDepth','Render at maximum depth','select'],['performance','Encoding performance','select'],['timeInterpolation','Time interpolation','select']
    ];
    const selectors={
      ratio:fmt==='short'?['9:16','4:5','1:1']:['16:9','21:9','4:3'],
      fps:['23.976','24','25','29.97','30','50','59.94','60'],
      subtitles:['On','Selective','Off'],
      exportFormat:['H.264 / MP4','HEVC / MP4'],
      bitrateEncoding:['VBR, 1 pass','VBR, 2 pass','CBR'],
      fieldOrder:['Progressive','Upper Field First','Lower Field First'],
      pixelAspect:['Square Pixels (1.0)'],colorSpace:['Rec.709','Rec.2020 (HDR)'],
      audioCodec:['AAC'],audioSampleRate:['48000 Hz','44100 Hz'],
      audioBitrate:['128 kbps','192 kbps','256 kbps','320 kbps','384 kbps'],
      renderQuality:['Maximum Render Quality: On','Maximum Render Quality: Off'],
      renderDepth:['Render at Maximum Depth: On','Render at Maximum Depth: Off'],
      performance:['Software Encoding','Hardware Encoding'],
      timeInterpolation:['Frame Sampling','Frame Blending','Optical Flow']
    };
    const fieldHtml=([key,label,type])=>`<div class="form-block"><label class="edit-line" for="${fmt}-${key}">${esc(label)}</label>${type==='select'?`<select class="field" id="${fmt}-${key}" data-setting="${key}" data-format="${fmt}">${[...new Set([...selectors[key],s[key]])].map(o=>`<option value="${esc(o)}" ${s[key]===o?'selected':''}>${esc(o)}</option>`).join('')}</select>`:`<input class="field" type="text" maxlength="200" id="${fmt}-${key}" data-setting="${key}" data-format="${fmt}" value="${esc(s[key])}"/>`}</div>`;
    return `<section class="settings-card ${state.activeFormat===fmt?'highlight':''}">
      <div class="settings-title"><div class="setting-icon">${f.icon}</div><div><h2>${esc(f.name)}</h2><p>${esc(f.summary)}</p></div></div>
      <div class="settings-preview"><div class="${fmt==='short'?'preview-phone':'preview-screen'}">${esc(s.ratio)}</div><div class="preview-ratio"><strong>${esc(s.resolution)}</strong><br>${esc(s.fps)} fps · ${esc(s.duration)}<br>${esc(s.platform)}</div></div>
      <div class="section-label">YOUR ORIGINAL PREMIERE PRO REFERENCES</div>
      ${sourceSequenceNotes(fmt)}
      ${originalScreenshot(fmt)}
      <div class="section-label">SEQUENCE & EDITING</div>
      <div class="setting-grid">${entryFields.map(fieldHtml).join('')}</div>
      <div class="settings-separator"></div>
      <div class="section-label">${fmt==='long'?'LONG FORMAT EXPORT SETTINGS':'SHORT FORMAT EXPORT SETTINGS'}</div>
      <h3 class="settings-smalltitle">Premiere Pro / Media Encoder</h3>
      ${fmt==='long'?`<div class="export-preset-row"><button type="button" class="btn secondary small" data-action="apply-export-preset" data-format="long" data-preset="1080">YouTube 1080p preset</button><button type="button" class="btn secondary small" data-action="apply-export-preset" data-format="long" data-preset="4k">YouTube 4K preset</button></div>`:''}
      <div class="setting-grid">${exportFields.map(fieldHtml).join('')}</div>
      <div class="export-summary"><strong>${esc(s.exportFormat)}</strong> · ${esc(s.resolution)} · ${esc(s.fps)} fps<br><span>${esc(s.bitrateEncoding)} · Target ${esc(s.bitrate)} · Max ${esc(s.maxBitrate)}<br>${esc(s.audioCodec)} · ${esc(s.audioSampleRate)} · ${esc(s.audioBitrate)}</span></div>
      <div class="settings-actions"><button type="button" class="btn dark small" data-action="download-export-settings" data-format="${fmt}">↓ Download ${esc(f.name)} export sheet</button><button type="button" class="btn secondary small" data-action="reset-settings" data-format="${fmt}">↶ Restore defaults</button></div>
      <div class="settings-foot">Settings save automatically on this browser and are separate for Short and Long formats. Your source screenshot above is unchanged. Editable fields can differ from the image if you customize them. These are SOP references, not an automatic Premiere Pro preset file. Match the source frame rate and final delivery brief.</div>
    </section>`;
  }

  function settingsPage(){
    const shot=(type,caption)=>{
      const file={short:'short-format-export-original.png',long:'long-format-export-original.png',mixer:'audio-track-mixer-original.png'}[type];
      const src=`./assets/original-screenshots/${file}`;
      return `<figure class="screenshot-only-item ${type==='mixer'?'screenshot-mixer':''}"><figcaption>${esc(caption)}</figcaption><a href="${src}" target="_blank" rel="noopener noreferrer" aria-label="Open original ${esc(caption)} screenshot"><img src="${src}" alt="Original user-provided ${esc(caption)} Premiere Pro screenshot, unchanged" loading="eager" decoding="async" width="${type==='mixer'?'1920':'455'}" height="${type==='mixer'?'963':'2048'}"></a></figure>`;
    };
    return pageHtml(`<section class="shot-page" aria-label="Your original Premiere Pro screenshots">
      <h1>Original Premiere Pro screenshots</h1>
      <div class="screenshots-only-grid">
        ${shot('short','Short Format — Export Settings')}
        ${shot('long','Long Format — Export Settings')}
      </div>
      ${shot('mixer','Audio Track Mixer — Copy / Paste Track Effects')}
    </section>`,'settings');
  }
  const sopSections=[['01','Pre-Edit Planning','Define the video goal, viewer emotion, creative standards and AI assistant’s role.'],['02','File Management & Project Setup','Folder organization, Premiere template, timeline tracks, shortcuts and asset library.'],['03','Footage Review & Story Understanding','Two-pass footage review, story arc and color labels for candidate footage.'],['04','On-Location Documentary','Five-act documentary structure, immersion, authenticity and purposeful scenes.'],['05','Editing Flow & Workflow','Seven production stages, rough cut, A-roll technique and hook rules.'],['06','Visual Layering & B-Roll','Topic relevance, B-cam, punch-ins, matching eye lines and AE usage.'],['07','Animations & Effects','Motion restraint, approved effect styles and text highlight requirements.'],['08','Sound Design','Natural ambient sound, repetition limits and mix process.'],['09','Color Grading & Final Export','Natural correction, quality-control checklist and online export.']];
  function library(){let matches=sopSections.map((x,i)=>({...{num:x[0],title:x[1],desc:x[2],idx:i}})).filter(s=>(s.title+' '+s.desc).toLowerCase().includes(searchQuery.toLowerCase()));return pageHtml(`<section class="page-intro"><div class="eyebrow">YOUR ORIGINAL REFERENCE DOCUMENT</div><h1>Video Editing <span class="grad-word">SOP library.</span></h1><p>The full nine-section SOP you provided is included in this ZIP. Read it alongside the interactive eight-module course.</p></section><div class="toolbar"><input id="sop-search" class="field" type="search" placeholder="Search SOP sections…" value="${esc(searchQuery)}" aria-label="Search SOP sections"/><a class="btn secondary" href="./reference/Video_Editing_SOP.html" target="_blank" rel="noopener noreferrer">Open original SOP ↗</a><span class="hint-inline">${matches.length} of 9 sections</span></div>${matches.length?`<div class="library-list">${matches.map(x=>`<div class="library-item"><span class="library-num">${x.num}</span><div><h3>${esc(x.title)}</h3><p>${esc(x.desc)}</p><a class="btn secondary small" href="./reference/Video_Editing_SOP.html#${x.idx===8?'s9':'s'+(x.idx+1)}" target="_blank" rel="noopener noreferrer">Read section ↗</a></div></div>`).join('')}</div>`:'<div class="empty-state" style="margin-top:20px">No sections found. Try a different search.</div>'}<section style="margin-top:38px"><div class="page-heading"><div><h2>Your original Premiere Pro screenshots</h2><p>Unmodified files from your uploads — click each to view at original resolution.</p></div></div>${originalScreenshot('short')}${originalScreenshot('long')}${originalScreenshot('mixer')}</section><section style="margin-top:38px"><div class="page-heading"><div><h2>Full SOP preview</h2><p>Original document, embedded without edits.</p></div></div><iframe class="wide-iframe" title="Original video editing SOP" src="./reference/Video_Editing_SOP.html" loading="lazy"></iframe></section>`,'library')}
  function allChecks(fmt){return D.finalChecks[fmt].every((_,i)=>state.final[fmt].checks[i]===true)}
  function mixerReady(fmt){const f=state.final[fmt];return f.mixerSource.trim().length>0 && D.mixerChecks.every((_,i)=>f.mixerChecks[i]===true)}
  function validLink(url){try{const u=new URL(url);return (u.protocol==='https:' || u.protocol==='http:') && u.hostname.includes('.') }catch{return false}}
  function canSubmit(fmt){return count(fmt)===8&&mixerReady(fmt)&&allChecks(fmt)&&validLink(state.final[fmt].url)&&state.final[fmt].project.trim().length>0}
  function finalPage(){const fmt=state.activeFormat, f=state.final[fmt],settings=state.settings[fmt],list=D.finalChecks[fmt],checked=list.filter((_,i)=>f.checks[i]).length,completeCount=count(fmt),ready=canSubmit(fmt);return pageHtml(`<section class="page-intro"><div class="eyebrow">DELIVERY GATE · ${esc(fmtName(fmt).toUpperCase())}</div><h1>Your final <span class="grad-word">edit.</span></h1><p>Before delivery, finish all eight modules, review the rendered video and complete the checklist. Generate a report for your producer or reviewer.</p>${formatSelector()}</section><div class="final-banner"><div class="smallcaps">COURSE COMPLETION</div><h2 style="margin:9px 0">${completeCount} of 8 modules complete</h2><p>${completeCount===8?'Great — the training gate is complete. Finish the self-checklist and link below.':'Complete your remaining modules before you can mark this delivery ready.'}</p><div class="progress-track" style="margin-top:18px"><div class="progress-bar" style="width:${percent(fmt)}%"></div></div></div><section class="mixer-gate" aria-labelledby="mixer-title"><div class="mixer-gate-header"><span class="mixer-gate-step">STEP BEFORE EXPORT</span><span class="mixer-gate-count">${D.mixerChecks.filter((_,i)=>f.mixerChecks[i]).length}/${D.mixerChecks.length} complete</span></div><h2 id="mixer-title">Copy the approved Audio Track Mixer first</h2><p class="mixer-intro">Editing complete → copy the previous project's mixer effects into the current delivery sequence → verify by listening → only then export. This step is mandatory for ${esc(fmtName(fmt))}.</p><div class="mixer-procedure"><div><b>01</b><span>Open / import the approved old .prproj and choose its reference sequence.</span></div><div><b>02</b><span>Window → Audio Track Mixer → Show/Hide Effects and Sends. Identify source track and Mix/Master racks.</span></div><div><b>03</b><span>Right-click the old effects rack → <strong>Copy Track Effects</strong>; switch to the new sequence, right-click the matching rack → <strong>Paste Track Effects</strong>.</span></div><div><b>04</b><span>Check effect chain, settings, faders/routing and audio meters. Save the current project before export.</span></div></div>${originalScreenshot('mixer')}<p class="final-preset-resource">Team audio preset: <a class="simple-link" href="https://drive.google.com/file/d/1P1t1-sIoFl6C9_dsH9EWSV-NAiEAm8NR/view?usp=sharing" target="_blank" rel="noopener noreferrer">Open approved preset on Google Drive ↗</a></p><div class="mixer-warning">⚠ Pasting a rack may replace its existing effects. Back up the target sequence first. Effects-rack copying does not guarantee the same fader, pan or routing values; verify those separately.</div><div class="mixer-input"><label class="edit-line" for="mixer-source">Approved old / reference project name *</label><input class="field" id="mixer-source" data-final="mixerSource" value="${esc(f.mixerSource)}" placeholder="e.g. Previous_Approved_Edit.prproj" maxlength="200"/></div><div class="mixer-checks">${D.mixerChecks.map((x,i)=>`<label class="check-row ${f.mixerChecks[i]?'checked':''}"><input type="checkbox" data-action="mixer-check" data-index="${i}" ${f.mixerChecks[i]?'checked':''}/><span>${esc(x)}</span></label>`).join('')}</div><p class="mixer-source-note"><a href="https://helpx.adobe.com/premiere/desktop/add-audio-effects/apply-audio-effects/copy-and-move-effects-in-audio-track-mixer.html" target="_blank" rel="noopener noreferrer">Official Adobe: copy and move track effects ↗</a> · This website is a checklist; it does not modify Premiere project files.</p></section><div class="final-columns"><section class="check-panel"><div class="section-label">SELF CHECKLIST</div><h2>Review the exported video</h2><p style="font-size:12px;color:#8997a1">After you have applied the mixer effects and exported, tick only after verifying the real MP4, not just the timeline.</p><div class="final-progress">${checked} / ${list.length} checks complete</div><div style="margin-top:15px">${list.map((x,i)=>`<label class="check-row ${f.checks[i]?'checked':''}"><input type="checkbox" data-action="final-check" data-index="${i}" ${f.checks[i]?'checked':''}/><span>${esc(x)}</span></label>`).join('')}</div></section><section class="submission-panel"><div class="section-label">DELIVERY DETAILS</div><h2>Prepare your submission</h2><p style="color:#83939c;font-size:12px">Keep a review link and notes with your checklist.</p><div class="form-block"><label class="edit-line" for="project">Project / video title *</label><input id="project" class="field" data-final="project" value="${esc(f.project)}" placeholder="e.g. Street Food Documentary" maxlength="200"/></div><div class="file-naming-note"><strong>Export filename:</strong> ${fmt==='short'?'SF_&lt;video name&gt;_1st draft.mp4 / SF_&lt;video name&gt;_Final.mp4':'LF_&lt;video name&gt;_1st draft.mp4 / LF_&lt;video name&gt;_Final.mp4'}</div><div class="form-block"><label class="edit-line" for="review-url">Review video link *</label><input id="review-url" class="field" data-final="url" type="url" value="${esc(f.url)}" placeholder="https://drive.google.com/…" maxlength="2000"/><div class="field-help">Paste a Drive, Frame.io, YouTube (unlisted) or other reviewable link. Set permissions appropriately.</div></div><div class="form-block"><label class="edit-line" for="reviewer">Reviewer / recipient (optional)</label><input id="reviewer" class="field" data-final="reviewer" value="${esc(f.reviewer)}" placeholder="Producer / team lead" maxlength="200"/></div><div class="form-block"><label class="edit-line" for="notes">Notes / revision history</label><textarea id="notes" class="field" data-final="notes" maxlength="3000" placeholder="Version, unresolved changes, sources, important timestamps…">${esc(f.notes)}</textarea></div><div class="summary-row"><span>Export target</span><strong>${esc(settings.resolution)}</strong></div><div class="summary-row"><span>Ratio · FPS</span><strong>${esc(settings.ratio)} · ${esc(settings.fps)} fps</strong></div><div class="summary-row"><span>Container</span><strong>${esc(settings.exportFormat)} · ${esc(settings.audioCodec)}</strong></div><div class="summary-row"><span>Export bitrate</span><strong>${esc(settings.bitrate)} / ${esc(settings.maxBitrate)} max</strong></div>${f.submitted?`<div class="locked-note saved">✓ Locally marked ready on ${esc(f.submitTime)}. Export the report to actually share it with a reviewer.</div>`:!ready?`<div class="locked-note">${completeCount<8?`${8-completeCount} module(s) still need completion. `:''}${!mixerReady(fmt)?'Complete the Audio Track Mixer transfer gate and enter the source project. ':''}${!allChecks(fmt)?`${list.length-checked} checklist item(s) unchecked. `:''}${!f.project.trim()?'Add the video title. ':''}${!validLink(f.url)?'Add a valid review URL.':''}</div>`:''}<div class="submission-actions"><button class="btn green" data-action="finalize" ${ready?'':'disabled'}>${f.submitted?'✓ Ready locally':'Mark ready for review'}</button><button class="btn secondary" data-action="export-report">↓ Export report</button></div><div class="settings-foot">This is a GitHub Pages website; it does not upload video files or notify reviewers. The button records a local completion state. Use “Export report” and share it with your video link.</div></section></div>`,'final')}
  function lockedModulePage(fmt,id){
    const m=D.common.find(x=>x.id===id),prev=requiredPrevious(fmt,id);
    return pageHtml(`<section class="lock-screen"><div class="lock-large">🔒</div><div class="eyebrow">${esc(fmtName(fmt).toUpperCase())} · SEQUENTIAL LEARNING</div><h1>${esc(m?.title||'Module')} is locked</h1><p>First complete <strong>Module ${prev?.number||'01'} — ${esc(prev?.title||'Welcome & Setup')}</strong>, including all checklist tasks and the correct quiz answer.</p><button class="btn" data-action="open-module" data-format="${fmt}" data-module="${prev?.id||'setup'}">Continue Module ${prev?.number||'01'} →</button><a class="backlink" href="#/overview">← Back to all modules</a></section>`,'overview')
  }
  function notFound(){return pageHtml('<section class="page-intro"><h1>Page not found.</h1><p>The requested section does not exist.</p><a class="btn" style="margin-top:20px" href="#/overview">Return to overview →</a></section>','overview')}
  function render(resetScroll=false){const path=route(),what=path[0],main=what==='overview'?overview():what==='module'?(unlocked(keys.includes(path[1])?path[1]:state.activeFormat,path[2])?lesson(keys.includes(path[1])?path[1]:state.activeFormat,path[2]):lockedModulePage(keys.includes(path[1])?path[1]:state.activeFormat,path[2])):what==='settings'?settingsPage():what==='library'?library():what==='final'?finalPage():notFound();const y=window.scrollY;app.innerHTML=main;if(resetScroll)window.scrollTo(0,0);else window.scrollTo(0,y)}
  function download(filename,contents,contentType){const blob=new Blob([contents],{type:contentType});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000)}
  function report(){const fmt=state.activeFormat, f=state.final[fmt],s=state.settings[fmt],modules=D.common.map(m=>`- ${done(fmt,m)?'[x]':'[ ]'} ${m.number} — ${m.title}`).join('\n'),checkList=D.finalChecks[fmt].map((c,i)=>`- ${f.checks[i]?'[x]':'[ ]'} ${c}`).join('\n');const mixerList=D.mixerChecks.map((c,i)=>`- ${f.mixerChecks[i]?'[x]':'[ ]'} ${c}`).join('\n');const out=`# Video Editing SOP — Delivery Report\n\nGenerated: ${dateTime()}\nEditor: ${state.editor}\nFormat: ${fmtName(fmt)}\nProject: ${f.project||'(not set)'}\nReview link: ${f.url||'(not set)'}\nReviewer: ${f.reviewer||'(not set)'}\nLocal status: ${f.submitted?'Ready for review (local only)':'In progress'}\n\n## Required export filenames\n${fmt==='short'?'SF_<video name>_1st draft.mp4\nSF_<video name>_Final.mp4':'LF_<video name>_1st draft.mp4\nLF_<video name>_Final.mp4'}\n\n## Format settings\n${Object.entries(s).map(([k,v])=>`- ${k}: ${v}`).join('\n')}\n\n## Course progress (${count(fmt)}/8)\n${modules}\n\n## Mandatory pre-export Audio Track Mixer transfer\nReference project: ${f.mixerSource||'(not provided)'}\n${mixerList}\n\n## Final quality checklist\n${checkList}\n\n## Notes\n${f.notes||'(none)'}\n\n---\nThis report is generated locally. No upload or email has been sent.\n`;download(`SOP_Report_${fmt}_${new Date().toISOString().slice(0,10)}.md`,out,'text/markdown;charset=utf-8')}
  function exportSheet(fmt){
    const s=state.settings[fmt];
    const labels={resolution:'Resolution',ratio:'Aspect ratio',fps:'Frame rate',duration:'Duration target',exportFormat:'Export format',bitrateEncoding:'Bitrate encoding',bitrate:'Target bitrate',maxBitrate:'Maximum bitrate',fieldOrder:'Field order',pixelAspect:'Pixel aspect ratio',colorSpace:'Color space',audioCodec:'Audio codec',audioSampleRate:'Audio sample rate',audioBitrate:'Audio bitrate',renderQuality:'Use maximum render quality',renderDepth:'Render at maximum depth',performance:'Encoding performance',timeInterpolation:'Time interpolation',subtitles:'Subtitles',safeZone:'Safe zone'};
    const lines=[`${fmtName(fmt).toUpperCase()} — PREMIERE PRO EXPORT SETTINGS`,'',`Generated: ${dateTime()}`,'Compare against the unmodified original screenshot stored in assets/original-screenshots/.','Follow the project brief if it differs from these saved SOP settings.',`FILENAME 1ST DRAFT: ${fmt==='short'?'SF':'LF'}_<video name>_1st draft.mp4`,`FILENAME FINAL: ${fmt==='short'?'SF':'LF'}_<video name>_Final.mp4`,'',...Object.entries(labels).map(([key,label])=>`${label}: ${s[key]||'(not set)'}`),'','MANDATORY BEFORE EXPORT — AUDIO TRACK MIXER:','[ ] Open or import the approved old Premiere project and reference sequence','[ ] Window > Audio Track Mixer > Show/Hide Effects and Sends','[ ] Right-click source rack > Copy Track Effects','[ ] Right-click target delivery-sequence rack > Paste Track Effects','[ ] Verify Mix/Master, track FX order, enable states and plugin values','[ ] Check fader, pan, sends and routing separately; verify audio by listening','[ ] Save the new project before rendering','Note: pasting a rack can replace existing effects.','', 'CHECK BEFORE DELIVERY:','[ ] Match timeline and export resolution / frame rate','[ ] Check export video format, rate control and target/max bitrate','[ ] Confirm Progressive + Square Pixels where required','[ ] Check Rec.709 output for SDR projects','[ ] Verify AAC audio at the selected bitrate and sample rate','[ ] Watch the complete exported video and verify captions, colors and sound'];
    download(`${fmt==='long'?'Long':'Short'}_Format_Export_Settings.txt`,lines.join('\n')+'\n','text/plain;charset=utf-8');
  }
  function applyExportPreset(fmt,preset){
    if(fmt!=='long' || !['1080','4k'].includes(preset))return;
    const s=state.settings.long;
    Object.assign(s,preset==='4k'?{
      resolution:'3840 × 2160',ratio:'16:9',fps:'23.976',bitrate:'30 Mbps',maxBitrate:'30 Mbps'
    }:{resolution:'1920 × 1080',ratio:'16:9',fps:'23.976',bitrate:'16 Mbps',maxBitrate:'25 Mbps'});
    Object.assign(s,{exportFormat:'H.264 / MP4',bitrateEncoding:preset==='4k'?'VBR, 2 pass':'VBR, 1 pass',fieldOrder:'Progressive',pixelAspect:'Square Pixels (1.0)',colorSpace:'Rec.709',audioCodec:'AAC',audioSampleRate:'48000 Hz',audioBitrate:'384 kbps',renderQuality:'Maximum Render Quality: On',renderDepth:'Render at Maximum Depth: On',performance:'Software Encoding',timeInterpolation:'Frame Sampling'});
    state.final.long.submitted=false;
    save();render();toast(`${preset==='4k'?'4K':'1080p'} YouTube preset applied. Confirm settings against your original screenshot and project brief.`);
  }
  function resetSelectedProgress(){const fmt=state.activeFormat;if(!confirm(`Reset all ${fmtName(fmt)} module progress and final review? This cannot be undone unless you imported a backup.`))return;state.progress[fmt]={};state.final[fmt]=initState().final[fmt];save();render();toast(`${fmtName(fmt)} progress reset`)}
  document.addEventListener('click',async e=>{
    const target=e.target.closest('[data-action]');if(!target)return;
    const a=target.dataset.action, fmt=target.dataset.format;
    if(a==='menu'){document.getElementById('topnav')?.classList.toggle('open');return}
    if(a==='format'){
      state.activeFormat=fmt;save();const r=route();if(r[0]==='module'&&r[2])jump(`#/module/${fmt}/${r[2]}`);else render();return;
    }
    if(a==='open-module'){if(!unlocked(fmt,target.dataset.module)){toast('Locked: complete the previous module first.');return}state.activeFormat=fmt;save();jump(`#/module/${fmt}/${target.dataset.module}`);return}
    if(a==='quiz'){
      if(!unlocked(fmt,target.dataset.module)){toast('Complete the previous module first');return}
      const m=D.common.find(x=>x.id===target.dataset.module),p=prog(fmt,m.id);
      const qIndex=Number(target.dataset.question),question=m.quizzes[qIndex];
      if(!question || p.quizAnswers?.[qIndex]===question.correct)return;
      const selected=Number(target.dataset.choice);p.quizAnswers[qIndex]=selected;
      p.quizPassed=m.quizzes.every((q,i)=>p.quizAnswers[i]===q.correct);
      toast(selected===question.correct?'Correct answer! ✓':'Try another answer');save();render();return;
    }
    if(a==='apply-export-preset'){applyExportPreset(fmt,target.dataset.preset);return}
    if(a==='download-export-settings'){exportSheet(fmt);toast('Export settings sheet downloaded');return}
    if(a==='reset-settings'){if(!confirm(`Restore default ${fmtName(fmt)} settings?`))return;state.settings[fmt]=clone(D.formats[fmt].defaults);save();render();toast('Defaults restored');return}
    if(a==='export-backup'){download('FRAMEWORK_SOP_Backup.json',JSON.stringify(state,null,2),'application/json');toast('Backup exported');return}
    if(a==='import-backup'){document.getElementById('backup-file').click();return}
    if(a==='reset-progress'){resetSelectedProgress();return}
    if(a==='finalize'){const f=state.final[state.activeFormat];if(!canSubmit(state.activeFormat)){toast('Finish all requirements first');render();return}f.submitted=true;f.submitTime=dateTime();save();render();toast('Marked ready locally — export your report to share');return}
    if(a==='export-report'){report();toast('Markdown delivery report exported');return}
  });
  document.addEventListener('change',e=>{
    const el=e.target;
    if(el.dataset.action==='task'){const p=prog(el.dataset.format,el.dataset.module);p.tasks[Number(el.dataset.index)]=el.checked;save();render();if(done(el.dataset.format,D.common.find(m=>m.id===el.dataset.module)))toast('Module completed! ✦');return}
    if(el.dataset.action==='mixer-check'){const f=state.final[state.activeFormat];f.mixerChecks[Number(el.dataset.index)]=el.checked;f.submitted=false;save();render();return}
    if(el.dataset.action==='final-check'){const f=state.final[state.activeFormat];f.checks[Number(el.dataset.index)]=el.checked;f.submitted=false;save();render();return}
    if(el.id==='backup-file' && el.files?.[0]){
      const file=el.files[0];if(file.size>1024*1024){toast('Backup file must be smaller than 1 MB');return}
      file.text().then(str=>{
        const parsed=JSON.parse(str);if(![1,2,3].includes(parsed.v) || !parsed.progress || !parsed.settings || !parsed.final)throw new Error('Invalid backup');
        if(!confirm('Import this backup and replace current local progress?'))return;
        state=normalizeState(parsed);save();render();toast('Backup imported');
      }).catch(()=>toast('The selected file is not a valid FRAMEWORK backup'));
    }
  });
  document.addEventListener('input',e=>{
    const el=e.target;
    if(el.dataset.setting){state.settings[el.dataset.format][el.dataset.setting]=el.value.slice(0,200);state.final[el.dataset.format].submitted=false;save();return}
    if(el.dataset.profile==='editor'){state.editor=el.value.slice(0,100);save();return}
    if(el.dataset.final){const f=state.final[state.activeFormat];f[el.dataset.final]=el.value;f.submitted=false;save();return}
    if(el.id==='sop-search'){searchQuery=el.value;const start=el.selectionStart,end=el.selectionEnd;render();const input=document.getElementById('sop-search');if(input){input.focus();input.setSelectionRange(start,end)}return}
  });
  window.addEventListener('hashchange',()=>render(true));
  if(!location.hash)location.hash='#/overview';else render(true);
})();
