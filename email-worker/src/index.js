// Cloudflare Worker. Set secrets: RESEND_API_KEY, REVIEWER_EMAIL, SENDER_EMAIL, ALLOWED_ORIGIN.
const j=(data,status=200,origin='')=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json','Access-Control-Allow-Origin':origin,'Vary':'Origin','Cache-Control':'no-store'}});
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export default {async fetch(req,env){
 const origin=req.headers.get('Origin')||'';
 const allowed=env.ALLOWED_ORIGIN||'';
 if(!allowed||origin!==allowed)return j({error:'Origin not allowed'},403,allowed);
 if(req.method==='OPTIONS')return new Response(null,{status:204,headers:{'Access-Control-Allow-Origin':allowed,'Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type','Access-Control-Max-Age':'7200'}});
 if(req.method!=='POST')return j({error:'Method not allowed'},405,allowed);
 if(Number(req.headers.get('content-length')||0)>12000)return j({error:'Payload too large'},413,allowed);
 try{
  const d=await req.json();
  const str=(key,n=200)=>typeof d[key]==='string'?d[key].trim().slice(0,n):'';
  const name=str('name',100),phone=str('phone',20),email=str('email',150),format=str('format',50),project=str('project'),url=str('assignmentLink',2000),notes=str('notes',2500);
  if(name.length<2||!/^[+0-9 ()-]{7,20}$/.test(phone)||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||!project||!['Short Format','Long Format'].includes(format)||Number(d.moduleCount)!==8)return j({error:'Invalid submission'},400,allowed);
  const link=new URL(url); if(!['https:','http:'].includes(link.protocol))throw new Error('Bad URL');
  if(!env.RESEND_API_KEY||!env.REVIEWER_EMAIL||!env.SENDER_EMAIL)return j({error:'Mail backend missing secrets'},503,allowed);
  const lines=[['Editor name',name],['Phone',phone],['Email',email],['Format',format],['Project',project],['Assignment URL',url],['Notes',notes],['Reviewer note',str('reviewer')],['Audio reference',str('mixerSource')],['Modules completed',String(d.moduleCount)],['Checklist',`${Number(d.checksDone)||0}/${Number(d.checksTotal)||0}`],['Submitted at',str('submittedAt')]];
  const html=`<h2>New SOP Editing Assignment</h2><table>${lines.map(([k,v])=>`<tr><th style="text-align:left;padding:8px">${esc(k)}</th><td style="padding:8px;overflow-wrap:anywhere">${esc(v)}</td></tr>`).join('')}</table>`;
  const res=await fetch('https://api.resend.com/emails',{method:'POST',headers:{'Authorization':'Bearer '+env.RESEND_API_KEY,'Content-Type':'application/json'},body:JSON.stringify({from:env.SENDER_EMAIL,to:[env.REVIEWER_EMAIL],subject:`[SOP] ${format} · ${project} · ${name}`,html,reply_to:email})});
  if(!res.ok)return j({error:'Email provider rejected submission'},502,allowed);
  return j({ok:true},200,allowed);
 }catch(e){return j({error:'Invalid submission data'},400,allowed)}
}};
