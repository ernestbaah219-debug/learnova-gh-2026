const LEARNOVA_VERSION="Learnova-AI-Final-All-Updates";

(()=>{"use strict";
const C=window.LEARNOVA_CURRICULUM||{},levels=Object.keys(C),$=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
let state={level:localStorage.getItem("learnova.level")||levels[1]||levels[0],subject:"",topic:null,user:null,quiz:null,exam:null,teach:false,tutorHistory:[],tutorMode:"adaptive"};
function esc(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]))}
function userKey(){return "learnova.user"}
function getUser(){try{return JSON.parse(localStorage.getItem(userKey())||"null")}catch{return null}}
function saveUser(u){localStorage.setItem(userKey(),JSON.stringify(u));state.user=u}
function savedKey(){return "learnova.saved"}
function getSaved(){try{return JSON.parse(localStorage.getItem(savedKey())||"[]")}catch{return []}}
function saveTopic(){if(!state.topic)return;let a=getSaved(),k=state.level+"|"+state.subject+"|"+state.topic.title;if(!a.some(x=>x.key===k))a.unshift({key:k,level:state.level,subject:state.subject,title:state.topic.title});localStorage.setItem(savedKey(),JSON.stringify(a));renderSaved();alert("Topic saved for revision.")}
function renderSaved(){let g=$("#savedList");if(!g)return;let a=getSaved();g.innerHTML=a.length?a.map((x,i)=>`<button class="topic-card"><span class="num">🔖</span><b>${esc(x.title)}</b><small>${esc(x.level)} • ${esc(x.subject)}</small></button>`).join(""):"<div class=\"empty-big\">🔖<h2>No saved lessons yet</h2><p>Open a lesson and tap Save for Revision.</p></div>";$$('#savedList .topic-card').forEach((b,i)=>b.onclick=()=>{let x=a[i],t=(C[x.level]?.[x.subject]||[]).find(t=>t.title===x.title);if(t)openTopic(t,(C[x.level][x.subject]||[]).indexOf(t))})}
function logActivity(text){let u=state.user||getUser();if(!u)return;u.activity=u.activity||[];u.activity.unshift({text,at:new Date().toLocaleString()});u.activity=u.activity.slice(0,8);saveUser(u);renderActivity?.()}
function initials(n){return (n||"Student").split(/\s+/).map(x=>x[0]).slice(0,2).join("").toUpperCase()}
function showPage(id){$$(".page").forEach(p=>p.classList.toggle("active",p.id===id));$$(".nav").forEach(n=>n.classList.toggle("active",n.dataset.page===id));scrollTo(0,0)}
$$("[data-page]").forEach(x=>x.addEventListener("click",()=>showPage(x.dataset.page)));
function fillClasses(sel){sel.innerHTML=levels.map(x=>`<option>${esc(x)}</option>`).join("");sel.value=state.level}
function setupAuth(){
 const cls=$("#authClass");fillClasses(cls);let mode="login";
 $("#loginTab").onclick=()=>{mode="login";$("#loginTab").classList.add("active");$("#signupTab").classList.remove("active");$("#nameWrap").classList.add("hidden");$("#classWrap").classList.add("hidden");$("#roleWrap").classList.add("hidden");$("#authSubmit").textContent="Login to Learnova"};
 $("#signupTab").onclick=()=>{mode="signup";$("#signupTab").classList.add("active");$("#loginTab").classList.remove("active");$("#nameWrap").classList.remove("hidden");$("#classWrap").classList.remove("hidden");$("#roleWrap").classList.remove("hidden");$("#authSubmit").textContent="Create my account"};
 $("#authForm").onsubmit=e=>{e.preventDefault();let email=$("#authEmail").value.trim().toLowerCase(),pw=$("#authPassword").value;
   if(!email||!pw)return;
   let existing=getUser();
   if(mode==="signup"){let name=$("#authName").value.trim()||"Student";let u={name,email,password:pw,level:cls.value,role:$("#authRole").value||"student",topics:0,quizzes:0,scoreTotal:0,scoreCount:0,completed:[],last:null,mastery:{},activity:[]};saveUser(u);enterApp()}
   else {if(existing&&existing.email===email&&existing.password===pw){state.user=existing;state.level=existing.level;enterApp()}else{$("#authMsg").textContent="No matching demo account found. Use Create Account first."}}
 }
}
function addAISettings(){
 let card=$("#settings .settings-card"); if(!card||$("#aiEndpoint")) return;
 let d=document.createElement("div");d.style="margin-top:25px;padding-top:20px;border-top:1px solid var(--line);text-align:left";
 d.innerHTML='<h3>Real AI connection</h3><p style="font-size:12px;color:#6f7890">Optional: connect your own secure AI backend. Without it, Learnova uses its built-in teacher.</p><input id="aiEndpoint" placeholder="AI backend endpoint" style="width:100%;padding:12px;border:1px solid #e8eaf2;border-radius:12px"><button class="primary wide" id="saveEndpoint" style="margin-top:10px">Save AI connection</button>';
 card.appendChild(d);$("#aiEndpoint").value=localStorage.getItem("learnova.aiEndpoint")||"";$("#saveEndpoint").onclick=()=>{localStorage.setItem("learnova.aiEndpoint",$("#aiEndpoint").value.trim());alert("AI connection saved.")};
}
function enterApp(){state.user=getUser();if(!state.user)return;state.level=state.user.level||state.level;$("#auth").classList.add("hidden");$("#app").classList.remove("hidden");renderUser();renderDashboard();renderActivity();renderClasses();renderSaved();initTutor();initQuiz();initExam();addAISettings();initV11();initSchoolPortal();showPage("dashboard")}
function renderUser(){let u=state.user||getUser()||{name:"Student",level:state.level};let i=initials(u.name);["avatar","topAvatar","settingsAvatar"].forEach(id=>{if($( "#"+id))$("#"+id).textContent=i});$("#sideName").textContent=u.name;$("#sideClass").textContent=(u.role&&u.role!=="student"?((u.role==="admin"?"School Admin":u.role[0].toUpperCase()+u.role.slice(1))+" • "):"")+u.level;$("#topName").textContent=u.name;$("#helloName").textContent=u.name.split(" ")[0];$("#settingsName").textContent=u.name;$("#settingsEmail").textContent=u.email||"";$("#settingsClass").textContent=u.level||"";$("#currentLevelLabel")?.textContent;$("#statTopics").textContent=u.topics||0;$("#statQuizzes").textContent=u.quizzes||0;$("#statScore").textContent=u.scoreCount?Math.round(u.scoreTotal/u.scoreCount)+"%":"0%";$("#points").textContent=120+(u.topics||0)*10+(u.quizzes||0)*15;let ms=Object.values(u.mastery||{});if($("#statMastery")) $("#statMastery").textContent=ms.length?Math.round(ms.reduce((a,x)=>a+(x.score||0),0)/ms.length)+"%":"0%"};renderDashboardCommand()

function renderWeakTopics(){let box=$("#weakTopics");if(!box)return;let u=state.user||getUser();let entries=Object.entries(u?.mastery||{}).filter(([k,v])=>(v.score||0)<70).sort((a,b)=>(a[1].score||0)-(b[1].score||0)).slice(0,6);if(!entries.length){box.innerHTML='<div class="empty-big">🌟<h2>No weak topics yet</h2><p>Take a few quizzes and Learnova will recommend what to revise.</p></div>';return}box.innerHTML=entries.map(([k,v])=>{let [l,s,t]=k.split("|");return `<button class="topic-card" data-weak="${esc(k)}"><span class="num">🎯</span><b>${esc(t)}</b><small>${esc(l)} • ${esc(s)} • ${v.score||0}% mastery • ${esc(v.level||"Developing")}</small></button>`}).join("");$$('[data-weak]').forEach(b=>b.onclick=()=>{let [l,s,t]=b.dataset.weak.split("|");state.level=l;state.subject=s;let topic=(C[l]?.[s]||[]).find(x=>x.title===t);if(topic)openTopic(topic,(C[l][s]||[]).indexOf(topic));showPage("learn")})}
function renderDashboardCommand(){
 const u=state.user||getUser()||{},ms=Object.entries(u.mastery||{}),avg=ms.length?Math.round(ms.reduce((a,[,v])=>a+(v.score||0),0)/ms.length):0;
 const acts=u.activity||[]; const days=new Set(acts.map(x=>{const d=new Date(x.at);return isNaN(d)?null:d.toDateString()}).filter(Boolean));
 let streak=0,d=new Date();while(days.has(d.toDateString())){streak++;d.setDate(d.getDate()-1)}
 const completed=(u.completed||[]).length, practice=u.practiceSessions||0, goalDone=Math.min(2,(completed>0?1:0)+(practice>0?1:0));
 const weak=ms.filter(([,v])=>(v.score||0)<70).sort((a,b)=>(a[1].score||0)-(b[1].score||0))[0];
 const ids=['dashGoalFill','dashGoalMeta','dashHealthMastery','dashHealthPractice','dashHealthQuizzes','statStreak','topStreak','dashNextTitle','dashNextText','dashHealthTitle','dashHealthText'];
 if($('#dashGoalFill'))$('#dashGoalFill').style.width=(goalDone/2*100)+'%';
 if($('#dashGoalMeta'))$('#dashGoalMeta').textContent=`${goalDone} / 2 activities completed today`;
 if($('#dashHealthMastery'))$('#dashHealthMastery').textContent=avg+'%'; if($('#dashHealthPractice'))$('#dashHealthPractice').textContent=practice; if($('#dashHealthQuizzes'))$('#dashHealthQuizzes').textContent=u.quizzes||0;
 if($('#statStreak'))$('#statStreak').textContent=streak+' day'+(streak===1?'':'s'); if($('#topStreak'))$('#topStreak').textContent='🔥 '+streak+' day'+(streak===1?'':'s')+' streak';
 let nextTitle='Start your first lesson',nextText='Choose a class and subject to begin building your learning history.',action=()=>showPage('learn');
 if(weak){const [l,s,t]=weak[0].split('|');nextTitle='Strengthen: '+t;nextText=`Your current mastery is ${weak[1].score||0}%. Revise this topic, then practise it again.`;action=()=>{state.level=l;state.subject=s;const o=(C[l]?.[s]||[]).find(x=>x.title===t);if(o){openTopic(o,(C[l][s]||[]).indexOf(o));showPage('learn')}}}
 else if(practice>0){nextTitle='Try an adaptive practice';nextText='Keep your momentum by practising a topic and letting the difficulty adjust to your performance.';action=()=>showPage('practice')}
 else if(completed>0){nextTitle='Take a quiz';nextText='Check what you remember and update your mastery.';action=()=>showPage('quiz')}
 if($('#dashNextTitle'))$('#dashNextTitle').textContent=nextTitle;if($('#dashNextText'))$('#dashNextText').textContent=nextText;if($('#dashNextBtn'))$('#dashNextBtn').onclick=action;
 if($('#dashHealthTitle'))$('#dashHealthTitle').textContent=avg>=80?'Strong learning health':avg>=55?'Growing steadily':'Building your foundation';
 if($('#dashHealthText'))$('#dashHealthText').textContent=avg>=80?'You are ready for more challenging practice and exams.':avg>=55?'Keep practising weak topics and use AI Tutor when stuck.':'Complete lessons and adaptive practice to build reliable understanding.';
}

function renderDashboard(){let box=$("#dashClasses");box.innerHTML="";[["Primary 1","Primary","1–6","🎒"],["JHS 1","JHS","1–3","📘"],["SHS 1","SHS","1–3","🎓"],["ALL","All Classes","P1–SHS3","🌟"]].forEach(([level,label,range,ic])=>{let b=document.createElement("button");b.className="class-card";b.innerHTML=`${ic}<b>${label}</b><small>${range}</small><em>Explore classes →</em>`;b.onclick=()=>{showPage("learn");level==="ALL"?renderClasses():openLevel(level)};box.appendChild(b)});
 let pop=$("#popular"),names=["Mathematics","Science","Integrated Science","English Language","French","Computing","Ghanaian Language","Social Studies","RME"];pop.innerHTML="";names.forEach((n,i)=>{let b=document.createElement("button");b.textContent=["🧮","🧪","🧪","📖","🇫🇷","💻","💬","🌍","📗"][i]+" "+n;b.onclick=()=>{showPage("learn");let l=levels.find(x=>C[x][n])||state.level;openLevel(l);if(C[l]?.[n])openSubject(l,n)};pop.appendChild(b)})}
function renderActivity(){let b=$("#recentActivity");if(!b)return;let a=state.user?.activity||[];b.innerHTML=a.length?a.slice(0,5).map(x=>`<div style="padding:8px 0;border-bottom:1px solid var(--line)">${esc(x.text)}<small style="display:block;color:#7b8499">${esc(x.at)}</small></div>`).join(""):"<small>Start a lesson or quiz and it will appear here.</small>"}
function renderClasses(){let g=$("#classPicker");g.innerHTML="";levels.forEach(l=>{let b=document.createElement("button");b.className="class-card";b.innerHTML=`🎓<b>${esc(l)}</b><small>${Object.keys(C[l]||{}).length} subjects</small><em>Open subjects →</em>`;b.onclick=()=>openLevel(l);g.appendChild(b)})}
function openLevel(l){state.level=l;localStorage.setItem("learnova.level",l);if(state.user){state.user.level=l;saveUser(state.user)}$("#classPicker").classList.add("hidden");$("#topicArea").classList.add("hidden");$("#lessonArea").classList.add("hidden");$("#subjectArea").classList.remove("hidden");$("#selectedClass").textContent=l+" Subjects";let g=$("#subjectGrid");g.innerHTML="";Object.keys(C[l]||{}).forEach((s,i)=>{let b=document.createElement("button");b.className="subject-card";b.innerHTML=`<span class="icon">${["🧮","📖","🧪","💻","🇫🇷","🌍","📗","🎨"][i%8]}</span><b>${esc(s)}</b><small>${(C[l][s]||[]).length} topics</small>`;b.onclick=()=>openSubject(l,s);g.appendChild(b)})}
function openSubject(l,s){state.subject=s;$("#subjectArea").classList.add("hidden");$("#topicArea").classList.remove("hidden");$("#selectedSubject").textContent=s+" — "+l;let g=$("#topicGrid");g.innerHTML="";(C[l][s]||[]).forEach((t,i)=>{let b=document.createElement("button");b.className="topic-card";b.innerHTML=`<span class="num">${i+1}</span><b>${esc(t.title)}</b><small>${esc(t.keyIdea)}</small>`;b.onclick=()=>openTopic(t,i);g.appendChild(b)})}
function levelRank(l){const m=String(l).match(/(Primary|JHS|SHS)\s*(\d+)/i);if(!m)return 1;return m[1].toLowerCase()==='primary'?Number(m[2]):m[1].toLowerCase()==='jhs'?6+Number(m[2]):9+Number(m[2])}
function stageFor(l){const r=levelRank(l);return r<=3?'Foundation':r<=6?'Developing':r<=9?'Application':'Advanced'}
function isMath(s){return /math/i.test(s||'')}
function languageSubject(s){return /french|ghanaian language|arabic|english language/i.test(s||'')}
function topicDefinition(t){return (t.keyIdea||'').replace(/^The topic is\s*/i,'').trim()||`This topic explains ${t.title}.`}
function practicalExamples(t,l,s){const title=t.title, def=topicDefinition(t), rank=levelRank(l), math=isMath(s), lang=languageSubject(s);let out=[];
 if(math){out=[`A learner uses ${title} to solve a real school or everyday problem. Start by identifying the known information, choose the correct operation or rule, show each step, and check the result.`,`Suppose a learner meets a ${title} problem in class. They write the given values, identify what must be found, apply the relevant mathematical rule, and state the answer with the correct unit when needed.`,`In a practical situation such as shopping, measuring, sharing, planning time, or comparing quantities, ${title} helps the learner make a calculation and explain why the method works.`,`Worked approach: read the problem, underline the important information, choose a method, calculate carefully, and verify the answer using another check.`,`A teacher can assess ${title} by changing the numbers or context while keeping the same mathematical idea. This shows whether the learner understands the concept rather than memorising one answer.`,`At ${l}, explain why the method works, not only what buttons or operations to use. Connect the calculation to the situation described in the question.`,`Error analysis: if a learner gets a different result, compare each step, identify the first incorrect step, correct it, and recalculate from there.`,`Practical extension: create your own ${title} problem from a real situation, solve it fully, and explain the meaning of the final answer.`,`Comparison example: solve one straightforward ${title} problem and then solve a second problem where the information is presented in words.`,`Mastery example: combine ${title} with another mathematical idea and justify the method used.`];}
 else if(lang){let trans=/french/i.test(s)?['Bonjour — Hello','Merci — Thank you','Comment allez-vous ? — How are you?','Je m\'appelle… — My name is…','Au revoir — Goodbye']:['Akwaaba — Welcome (Twi)','Medaase — Thank you (Twi)','Mepa wo kyɛw — Please (Twi)','Yɛbɛhyia bio — See you again (Twi)','Meda wo ase — I thank you (Twi)'];out=[`Meaning in context: ${def}`,`Translation example: <b>${trans[0]}</b>. The English meaning is given beside the original language so the learner can understand and use it correctly.`,`Translation example: <b>${trans[1]}</b>. Explain when this expression would be used in a real conversation.`,`Communication example: use ${title} in a short school or everyday conversation and explain the meaning in English.`,`Reading example: read a short passage containing ${title}, identify the language feature, and explain it in English.`,`Writing example: write a short sentence using ${title}, then provide its English translation.`,`Speaking example: use ${title} in a realistic classroom, family, travel, or community situation.`,`Vocabulary example: select key words related to ${title}, give their meanings in English, and use each in a sentence.`,`Grammar example: show how the language structure connected with ${title} changes meaning or accuracy.`,`Advanced example for ${l}: compare two uses of ${title}, explain the difference, and justify which is appropriate in context.`];}
 else {out=[`Definition in context: ${def}`,`Importance: ${title} matters because learners can use the idea to understand, explain, or solve real situations connected with the topic.`,`Real-life application: describe a familiar school, home, community, environmental, scientific, social, or creative situation where ${title} can be observed.`,`Cause and effect: explain what can happen when the principle behind ${title} is present, changed, or ignored.`,`Process example: describe the main steps involved in applying or demonstrating ${title} and explain the purpose of each step.`,`Comparison example: compare ${title} with a closely related idea and state one important difference.`,`Evidence example: give an observation, object, event, text, diagram, performance, or situation that demonstrates ${title}.`,`Problem-solving example: identify a realistic problem connected with ${title}, propose a solution, and justify it.`,`Importance to Ghana: connect ${title} to school, family, community, culture, environment, work, citizenship, or national development where appropriate.`,`Advanced application for ${l}: analyse a new situation involving ${title}, use evidence or reasoning, and reach a justified conclusion.`];}
 return out.map((x,i)=>`${x} <b>Why it matches:</b> It directly applies the idea of <b>${esc(title)}</b>, rather than giving a hint.`)}
function textbookExplanation(t,l,s){const def=topicDefinition(t),r=levelRank(l),stage=stageFor(l);const deeper=r>=10?'At this level, learners should analyse relationships, justify conclusions, solve unfamiliar problems, and connect the topic to other ideas.':r>=7?'At this level, learners should apply the idea to unfamiliar situations, explain reasons, and evaluate different approaches.':r>=4?'At this level, learners should move beyond recall and explain how and why the idea works.':'At this level, learners should build a clear foundation, use simple language, and connect the idea to familiar experiences.';return `<b>Definition</b><br>${esc(def)}<br><br><b>What the topic means</b><br>${esc(t.title)} is studied so that learners understand the central idea, its features, and how it is used. The explanation below is written for <b>${esc(l)}</b>, not as a hint.<br><br><b>Why it is important</b><br>This topic develops knowledge and skills that learners can use in school and in real life. The exact importance depends on the subject: mathematical topics support accurate reasoning and problem solving; science topics help explain the natural world; languages support communication; social and humanities topics help learners understand people, society and decisions; creative and practical subjects develop making, designing and performing skills.<br><br><b>How to understand it</b><br>Begin with the definition, identify the main features, study a concrete example, practise the process, and then explain the idea in your own words. ${deeper}<br><br><b>Class level</b><br>${esc(stage)} learning for ${esc(l)} should become more demanding than the same idea at a lower class.`}
function openTopic(t,i){state.topic=t;let u=state.user;if(u){u.last={level:state.level,subject:state.subject,title:t.title};saveUser(u)}$("#topicArea").classList.add("hidden");$("#lessonArea").classList.remove("hidden");
 let examples=practicalExamples(t,state.level,state.subject),ex=examples.map((x,j)=>`<li><b>Example ${j+1}:</b> ${x}</li>`).join(""),qs=(t.questions||[]).map((q,j)=>`<li class="lesson-practice-item"><b>Q${j+1}.</b> ${esc(q.question)}<textarea data-practice-input="${j}" placeholder="Write your answer here…"></textarea><button class="outline" data-check-practice="${j}">Check my answer</button><span class="practice-feedback" id="practice-feedback-${j}"></span><details><summary>Show model answer</summary>${esc(q.answer)}</details></li>`).join("");
 $("#lesson").innerHTML=`<span class="eyebrow">${esc(state.level)} • ${esc(state.subject)} • ${esc(stageFor(state.level))}</span><h1>${i+1}. ${esc(t.title)}</h1><div class="key"><b>Key Idea:</b> ${esc(t.keyIdea)}</div><h2>Textbook Explanation</h2><div class="textbook-copy">${textbookExplanation(t,state.level,state.subject)}</div><h2>10 Practical, Topic-Matched Examples</h2><ol>${ex}</ol><h2>10 Topic-Matched Practice Questions</h2><ol>${qs}</ol><div class="lesson-summary"><h2>Quick Revision</h2><p><b>Remember:</b> ${esc(t.keyIdea)}</p><p><b>Next step:</b> Take the quiz. Your result updates your mastery and revision plan.</p></div><div class="lesson-actions"><button class="primary" id="lessonQuiz">🏆 Take 10-question quiz</button><button class="ghost" id="lessonTutor">🤖 Ask AI Tutor</button><button class="outline" id="saveTopic">🔖 Save for Revision</button><button class="outline" id="doneTopic">✓ Mark complete</button></div>`;
 $$("[data-check-practice]").forEach(btn=>btn.onclick=()=>{const i=Number(btn.dataset.checkPractice),q=t.questions?.[i],input=$("[data-practice-input=\""+i+"\"]"),fb=$("#practice-feedback-"+i);if(!q||!input||!fb)return;const words=String(q.answer||"").toLowerCase().split(/\W+/).filter(w=>w.length>4);const a=input.value.toLowerCase();const hit=words.filter(w=>a.includes(w)).length;fb.textContent=hit>=Math.max(1,Math.min(3,Math.ceil(words.length*.2)))?" ✓ Good start — your answer contains key ideas. Review the model answer for completeness.":" ✗ Not enough key ideas yet. Read the textbook explanation, try again, or ask AI Tutor to check your reasoning.";fb.className="practice-feedback "+(hit>=1?"good":"needs")});$("#lessonQuiz").onclick=()=>startQuizFor(state.level,state.subject,t);$("#saveTopic").onclick=saveTopic;$("#lessonTutor").onclick=()=>{showPage("tutor");$("#tutorLevel").value=state.level;populateTutorSubjects();$("#tutorSubject").value=state.subject;$("#tutorTopic").value=t.title;$("#tutorQuestion").focus()};$("#doneTopic").onclick=()=>{let u=state.user||getUser();u.topics=(u.topics||0)+1;u.completed=u.completed||[];if(!u.completed.includes(state.level+"|"+state.subject+"|"+t.title))u.completed.push(state.level+"|"+state.subject+"|"+t.title);saveUser(u);logActivity(`Completed ${state.topic.title} (${state.subject})`);renderUser();renderActivity();$("#doneTopic").textContent="✓ Completed";updateProgress();renderRevisionPlan();renderReport()}}

function initTutor(){fillClasses($("#tutorLevel"));populateTutorSubjects();$("#tutorLevel").onchange=()=>{state.level=$("#tutorLevel").value;populateTutorSubjects()};$("#tutorModeSelect").onchange=()=>{state.tutorMode=$("#tutorModeSelect").value;$("#tutorStatus").textContent="AI Tutor 7.0 • "+$("#tutorModeSelect").selectedOptions[0].textContent.replace(/^\S+\s*/,"")};$("#askTutor").onclick=askTutor;$("#clearTutor").onclick=()=>{$("#tutorQuestion").value="";$("#tutorAnswer").innerHTML='<div class="ai-icon">🤖</div><div><b>Hi! I\'m your Learnova Tutor.</b><p>Ask me anything about your school work.</p></div>'};$$(".tutor-tips button").forEach(b=>b.onclick=()=>{$("#tutorQuestion").value=b.textContent;$("#tutorQuestion").focus()});initTeachMode()}
function initTeachMode(){if($("#teachMe"))$("#teachMe").onclick=()=>{state.teach=!state.teach;$("#tutorMode").style.display=state.teach?"block":"none";$("#tutorMode").innerHTML=state.teach?"🎓 <b>Teach Me mode:</b> I’ll teach one step at a time and wait for your answer.":""};if($("#voiceTutor"))$("#voiceTutor").onclick=()=>{let r=window.SpeechRecognition||window.webkitSpeechRecognition;if(!r){alert("Voice input is not supported in this browser.");return}let x=new r();x.lang="en-GH";x.onresult=e=>{$("#tutorQuestion").value=e.results[0][0].transcript};x.start()}}
function populateTutorSubjects(){let l=$("#tutorLevel").value||state.level;$("#tutorSubject").innerHTML='<option value="">Any subject</option>'+Object.keys(C[l]||{}).map(x=>`<option>${esc(x)}</option>`).join("")}
function masteryFor(level,subject,title){let u=state.user||getUser();let k=level+"|"+subject+"|"+title;let m=u?.mastery?.[k];return m||{attempts:0,correct:0,score:0,level:"Beginner"}}
function adaptiveLabel(score){return score>=90?"Mastered":score>=75?"Advanced":score>=55?"Confident":score>=30?"Developing":"Beginner"}
const legacyAdvancedMathTutor=advancedMathTutor;

/* Learnova GH Math Tutor 2.0: broader school-maths solver. */
function advancedMathTutor(q,l,s,t){
  const raw=String(q||'').trim(), x=raw.toLowerCase().replace(/[−–—]/g,'-').replace(/×/g,'*').replace(/÷/g,'/').replace(/²/g,'^2').replace(/³/g,'^3');
  const escN=n=>mathFormat(n);
  let m;
  // Pythagoras
  m=x.match(/(?:hypotenuse|longest side).*?(?:legs?|sides?)\s*(\d+(?:\.\d+)?)\s*(?:and|,)\s*(\d+(?:\.\d+)?)/i);
  if(m){const a=+m[1],b=+m[2],r=Math.sqrt(a*a+b*b);return `<b>Step-by-step Maths • Pythagoras</b><br><br>Formula: c² = a² + b²<br>= ${a}² + ${b}²<br>= ${a*a+b*b}<br>c = √${a*a+b*b} = <b>${escN(r)}</b><br><b>Answer: ${escN(r)}</b>`}
  // HCF / GCD
  m=x.match(/(?:hcf|highest common factor|gcd).*?(\d+)\s*(?:and|,)\s*(\d+)/i);
  if(m){const a=+m[1],b=+m[2],g=gcdMath(a,b);return `<b>Step-by-step Maths • HCF</b><br><br>Numbers: ${a} and ${b}.<br>Use common factors or the Euclidean algorithm.<br>${a} = ${Math.floor(a/b)} × ${b} + ${a%b}<br><b>Answer: HCF = ${g}</b>`}
  // LCM
  m=x.match(/(?:lcm|lowest common multiple).*?(\d+)\s*(?:and|,)\s*(\d+)/i);
  if(m){const a=+m[1],b=+m[2],g=gcdMath(a,b),lcm=Math.abs(a*b)/g;return `<b>Step-by-step Maths • LCM</b><br><br>LCM(a,b) = (a × b) ÷ HCF.<br>= (${a} × ${b}) ÷ ${g}<br>= <b>${lcm}</b><br><b>Answer: LCM = ${lcm}</b>`}
  // Square root / cube root
  m=x.match(/(?:square root|sqrt)\s*(?:of)?\s*(\d+(?:\.\d+)?)/i);
  if(m){const n=+m[1],r=Math.sqrt(n);return `<b>Step-by-step Maths • Square Root</b><br><br>We need a number which multiplied by itself gives ${n}.<br>√${n} = <b>${escN(r)}</b><br>Check: ${escN(r)} × ${escN(r)} ≈ ${escN(r*r)}.`}
  m=x.match(/(?:cube root)\s*(?:of)?\s*(\d+(?:\.\d+)?)/i);
  if(m){const n=+m[1],r=Math.cbrt(n);return `<b>Step-by-step Maths • Cube Root</b><br><br>∛${n} = <b>${escN(r)}</b><br>Check: ${escN(r)}³ ≈ ${escN(r*r*r)}.`}
  // Direct proportion
  m=x.match(/(?:if|when)\s*(\d+(?:\.\d+)?)\s*(?:costs|items|units).*?(?:then|what).*?(\d+(?:\.\d+)?)\s*(?:costs|items|units).*?(?:how much|cost|for)\s*(\d+(?:\.\d+)?)/i);
  if(m){const a=+m[1],b=+m[2],c=+m[3],r=b*c/a;return `<b>Step-by-step Maths • Proportion</b><br><br>Unit value = ${b} ÷ ${a} = ${escN(b/a)}.<br>For ${c}: ${escN(b/a)} × ${c} = <b>${escN(r)}</b>.<br><b>Answer: ${escN(r)}</b>`}
  // Simple quadratic x² = n
  m=x.match(/(?:solve|find)\s*x\s*\^?2\s*=\s*(-?\d+(?:\.\d+)?)/i);
  if(m){const n=+m[1];if(n<0)return '<b>Step-by-step Maths • Quadratic</b><br><br>x² cannot equal a negative real number, so there is no real solution.';const r=Math.sqrt(n);return `<b>Step-by-step Maths • Quadratic</b><br><br>x² = ${n}<br>Take the square root of both sides.<br>x = ±√${n}<br><b>Answer: x = ${escN(r)} or x = ${escN(-r)}</b>`}
  // Percentage increase/decrease with explicit values
  m=x.match(/(?:increase|decrease)\s*(?:of)?\s*(\d+(?:\.\d+)?)\s*(?:by)\s*(\d+(?:\.\d+)?)\s*%/i);
  if(m){const n=+m[1],p=+m[2],change=n*p/100,r=/decrease/.test(x)?n-change:n+change;return `<b>Step-by-step Maths • Percentage Change</b><br><br>Change = ${n} × ${p}/100 = ${escN(change)}.<br>New value = ${n} ${/decrease/.test(x)?'-':'+'} ${escN(change)} = <b>${escN(r)}</b>.<br><b>Answer: ${escN(r)}</b>`}
  // Time conversion
  m=x.match(/(\d+(?:\.\d+)?)\s*(hours?|hrs?)\s*(?:and\s*)?(\d+(?:\.\d+)?)?\s*(minutes?|mins?)?\s*(?:to|in)\s*(minutes?|mins?)/i);
  if(m){const h=+m[1],mi=m[3]?+m[3]:0,r=h*60+mi;return `<b>Step-by-step Maths • Time</b><br><br>${h} hours = ${h} × 60 = ${h*60} minutes.<br>Add ${mi} minutes: ${h*60} + ${mi} = <b>${r} minutes</b>.`}
  // Generic explicit expression, using existing safe parser from previous build.
  const legacy=legacyAdvancedMathTutor(raw,l,s,t); if(legacy)return legacy;
  return null;
}

function genericTutorAnswer(q,l,s,t){const topicObj=(C[l]?.[s]||[]).find(x=>x.title===t);const rank=levelRank(l);const title=t||s||'your question';let def=topicObj?topicDefinition(topicObj):`your question about ${title}`;let base=topicObj?textbookExplanation(topicObj,l,s):`I can help with ${title}. First, identify the exact concept, what the question is asking, and any information given.`;let x=q.toLowerCase();if(/who is|what is|define|meaning/.test(x)&&topicObj)return `<b>AI Tutor 7.0</b><br><br><b>Definition:</b> ${esc(def)}<br><br><b>Explanation:</b> ${base}<br><br><b>Check:</b> Explain the definition in your own words.`;if(isMath(s)){let m=x.match(/(-?\d+(?:\.\d+)?)\s*([+\-*\/])\s*(-?\d+(?:\.\d+)?)/);if(m){let a=+m[1],o=m[2],b=+m[3],r=o==='+'?a+b:o==='-'?a-b:o==='*'?a*b:a/b;return `<b>AI Tutor 7.0 • Step-by-step Maths</b><br><br>1. Identify the operation: <b>${esc(o)}</b>.<br>2. Substitute the numbers: <b>${a} ${esc(o)} ${b}</b>.<br>3. Calculate carefully.<br>4. Check whether the answer is reasonable.<br><br><b>Answer: ${r}</b><br><br>Send another problem and I will show every step.`}}if(/why|importance|benefit|reason/.test(x)&&topicObj)return `<b>AI Tutor 7.0</b><br><br><b>Why ${esc(t)} matters:</b> ${base}<br><br>At ${esc(l)}, the important part is to explain the reason, not just state a fact.`;return `<b>AI Tutor 7.0 • ${esc(l)}${s?' • '+esc(s):''}</b><br><br>${topicObj?base:`I can answer school questions across your class subjects. Your question is: <b>${esc(q)}</b>`}<br><br><b>Let's solve it:</b> Tell me the exact question, any information given, and what you have tried. I will explain the answer clearly, show the reasoning, and adjust the explanation to ${esc(l)}.`}
async function askTutor(){let q=$("#tutorQuestion").value.trim();if(!q){$("#tutorAnswer").textContent="Please type a school question first.";return}let l=$("#tutorLevel").value,s=$("#tutorSubject").value,t=$("#tutorTopic").value.trim();$("#tutorAnswer").innerHTML='<div class="ai-icon">🤖</div><div><b>Thinking…</b><p>Building a class-aware answer.</p></div>';let endpoint=localStorage.getItem("learnova.aiEndpoint")||"/api/tutor";try{let res=await fetch(endpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({question:q,level:l,subject:s,topic:t,history:state.tutorHistory.slice(-12),mode:state.tutorMode||"adaptive"})});let j=await res.json();let answer=j.answer||j.content||j.choices?.[0]?.message?.content;if(res.ok&&answer){state.tutorHistory.push({role:"user",content:q},{role:"assistant",content:answer});state.tutorHistory=state.tutorHistory.slice(-12);$("#tutorAnswer").innerHTML='<div class="ai-icon">🤖</div><div>'+answer+'</div>';return}}catch(e){}let local=genericTutorAnswer(q,l,s,t);state.tutorHistory.push({role:"user",content:q},{role:"assistant",content:local.replace(/<[^>]+>/g," ")});state.tutorHistory=state.tutorHistory.slice(-12);$("#tutorAnswer").innerHTML='<div class="ai-icon">🤖</div><div>'+local+'</div>'}

function initQuiz(){fillClasses($("#quizLevel"));populateQuizSubjects();$("#quizLevel").onchange=populateQuizSubjects;$("#quizSubject").onchange=populateQuizTopics;$("#startQuiz").onclick=()=>{let l=$("#quizLevel").value,s=$("#quizSubject").value,t=$("#quizTopic").value;startQuizFor(l,s,(C[l][s]||[]).find(x=>x.title===t)||C[l][s][0])}}
function populateQuizSubjects(){let l=$("#quizLevel").value||state.level;$("#quizSubject").innerHTML=Object.keys(C[l]||{}).map(x=>`<option>${esc(x)}</option>`).join("");populateQuizTopics()}
function populateQuizTopics(){let l=$("#quizLevel").value,s=$("#quizSubject").value;$("#quizTopic").innerHTML=(C[l]?.[s]||[]).map(x=>`<option>${esc(x.title)}</option>`).join("")}
function assessmentFor(t,l,s){const base=topicDefinition(t),rank=levelRank(l),hard=rank>=10?"Analyse, compare, justify or evaluate":rank>=7?"Apply, explain why or solve in a new situation":rank>=4?"Explain, apply or identify": "Define, identify or describe";return Array.from({length:10},(_,i)=>({question:`${hard} ${t.title}. Question ${i+1}: use a different situation, example or reason each time.`,answer:base,hint:`Focus on the definition, key features and real application of ${t.title}.`}))}
function startQuizFor(l,s,t){if(!t)return;let topic={...t,questions:assessmentFor(t,l,s)};showPage("quiz");$("#quizSetup").classList.add("hidden");$("#quizRun").classList.remove("hidden");state.quiz={level:l,subject:s,topic,index:0,score:0};renderQuizQuestion()}
function renderQuizQuestion(){let q=state.quiz.topic.questions[state.quiz.index];$("#quizRun").innerHTML=`<div class="quiz-question"><span class="eyebrow">QUESTION ${state.quiz.index+1} OF 10</span><h2>${esc(q.question)}</h2><div class="quiz-options"><button data-a="A">${esc(q.answer)}</button><button data-a="B">The statement is unrelated to ${esc(state.quiz.topic.title)}.</button><button data-a="C">A different topic is being described.</button><button data-a="D">None of the topic's defining ideas apply.</button></div><p class="hint">💡 Hint: ${esc(q.hint)}</p></div>`;let opts=$$("#quizRun .quiz-options button");opts.sort(()=>Math.random()-.5);let container=$("#quizRun .quiz-options");opts.forEach(o=>container.appendChild(o));opts.forEach(o=>o.onclick=()=>{if(o.dataset.a==="A")state.quiz.score++;state.quiz.index++;state.quiz.index<10?renderQuizQuestion():finishQuiz()})}
function finishQuiz(){let q=state.quiz,s=Math.round(q.score*10),u=state.user||getUser();u.quizzes=(u.quizzes||0)+1;u.scoreTotal=(u.scoreTotal||0)+s;u.scoreCount=(u.scoreCount||0)+1;u.mastery=u.mastery||{};let mk=q.level+"|"+q.subject+"|"+q.topic.title;let mm=u.mastery[mk]||{attempts:0,correct:0,score:0};mm.attempts++;mm.correct+=q.score;mm.score=Math.round((mm.correct/(mm.attempts*10))*100);mm.level=adaptiveLabel(mm.score);u.mastery[mk]=mm;saveUser(u);logActivity(`Finished ${q.topic.title} quiz: ${q.score}/10`);renderUser();renderActivity();updateProgress();renderWeakTopics();renderRevisionPlan();renderReport();$("#quizRun").innerHTML=`<div class="quiz-result"><span class="eyebrow">QUIZ COMPLETE</span><div class="score-circle">${q.score}/10</div><h2>${q.score>=8?"Excellent work!":q.score>=5?"Good effort!":"Keep practising!"}</h2><p>You scored ${s}%. Review the lesson and try another quiz to improve.</p><button class="primary" id="againQuiz">Try Again</button> <button class="ghost" id="backLearn">Back to Learn</button></div>`;$("#againQuiz").onclick=()=>startQuizFor(q.level,q.subject,q.topic);$("#backLearn").onclick=()=>showPage("learn")}
function initExam(){
 fillClasses($('#examLevel')); populateExamSubjects();
 $('#examLevel').onchange=populateExamSubjects; $('#examSubject').onchange=populateExamTopics;
 $('#examScope').onchange=()=>{$('#examTopic').disabled=$('#examScope').value!=='topic'};
 $('#startExam').onclick=generateExam;
 $('#examTimerMinutes')?.addEventListener('change',()=>{});
}
function populateExamSubjects(){let l=$('#examLevel').value||state.level;$('#examSubject').innerHTML=Object.keys(C[l]||{}).map(x=>`<option>${esc(x)}</option>`).join('');populateExamTopics()}
function populateExamTopics(){let l=$('#examLevel').value,s=$('#examSubject').value;$('#examTopic').innerHTML=(C[l]?.[s]||[]).map(x=>`<option>${esc(x.title)}</option>`).join('');$('#examTopic').disabled=$('#examScope')?.value!=='topic'}
function examDifficultyRank(l,d){let r=levelRank(l);let base=r<=3?1:r<=6?2:r<=9?3:4;if(d==='foundation')base=Math.max(1,base-1);if(d==='challenge')base=Math.min(5,base+1);if(d==='adaptive'){let u=state.user||getUser(),ms=Object.values(u?.mastery||{});let avg=ms.length?ms.reduce((a,x)=>a+(x.score||0),0)/ms.length:50;if(avg>=80)base=Math.min(5,base+1);if(avg<45)base=Math.max(1,base-1)}return base}
function examPool(l,s,scope,topicTitle){let topics=scope==='topic'?(C[l]?.[s]||[]).filter(t=>t.title===topicTitle):(C[l]?.[s]||[]);let pool=[];const rank=examDifficultyRank(l,$('#examDifficulty').value);topics.forEach(t=>{let qs=t.questions||[];qs.forEach(q=>pool.push({question:q.question,answer:q.answer,hint:q.hint||'',topic:t.title,level:l,source:t}));let def=topicDefinition(t);let templates=rank<=2?[`What is ${t.title}?`,`Which statement best describes ${t.title}?`,`Why is ${t.title} important?`,`Which example shows ${t.title}?`,`What is one feature of ${t.title}?`,`How would you use ${t.title} in everyday life?`,`Which situation is related to ${t.title}?`,`What should a learner remember about ${t.title}?`,`How can ${t.title} be identified?`,`Which reason best explains ${t.title}?`]:rank===3?[`Apply ${t.title} to a realistic situation.`,`Which option best demonstrates ${t.title} in practice?`,`What would happen if the main condition in ${t.title} changed?`,`Which statement correctly compares ideas related to ${t.title}?`,`How should a learner solve a problem involving ${t.title}?`,`Which conclusion is supported by the idea of ${t.title}?`,`Which mistake would most likely lead to an incorrect use of ${t.title}?`,`How can ${t.title} be connected to another concept?`,`Which evidence best supports an explanation of ${t.title}?`,`How would you explain ${t.title} to another learner?`]:[`Analyse a new situation involving ${t.title}.`,`Which conclusion is best justified by ${t.title}?`,`How could ${t.title} be applied to solve a real problem?`,`Which claim about ${t.title} is best supported by evidence?`,`What is the most likely result when a key condition of ${t.title} changes?`,`Which explanation best distinguishes ${t.title} from a related concept?`,`How would you evaluate an approach to a problem involving ${t.title}?`,`Which reason best supports the importance of ${t.title}?`,`How can knowledge of ${t.title} be transferred to a new context?`,`Which response demonstrates mastery of ${t.title}?`];templates.forEach(q=>pool.push({question:`${q} [${l}]`,answer:def,hint:'Use the definition, features and application of the topic.',topic:t.title,level:l,source:t}))});return pool}
function uniquePool(pool){let seen=new Set();return pool.filter(q=>{let k=q.question.toLowerCase().replace(/\s+/g,' ').trim();if(seen.has(k))return false;seen.add(k);return true})}
function makeExamChoices(q,pool){let others=[...new Set(pool.filter(x=>x.topic!==q.topic&&x.answer&&x.answer!==q.answer).map(x=>x.answer))];let distractors=others.slice(0,3);while(distractors.length<3){let d=`A different idea from the ${q.topic} topic`;if(!distractors.includes(d)&&d!==q.answer)distractors.push(d);else distractors.push(`An unrelated interpretation of ${q.topic}`)}let choices=[q.answer,...distractors];for(let i=choices.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[choices[i],choices[j]]=[choices[j],choices[i]]}return {question:q.question,choices,correct:choices.indexOf(q.answer),answer:q.answer,hint:q.hint,topic:q.topic}}
function gradeName(p){return p>=80?'A — Excellent':p>=70?'B — Very good':p>=60?'C — Good':p>=50?'D — Developing':'E — Needs more practice'}
function stopExamTimer(){if(state.exam?.timerId){clearInterval(state.exam.timerId);state.exam.timerId=null}}
function startExamTimer(){const e=state.exam;if(!e||!e.minutes)return;const tick=()=>{const left=Math.max(0,e.endsAt-Date.now());e.secondsLeft=Math.ceil(left/1000);const m=Math.floor(e.secondsLeft/60),s=e.secondsLeft%60;const el=$('#examTimer');if(el)el.textContent=`Time ${m}:${String(s).padStart(2,'0')}`;if(left<=0){stopExamTimer();e.timeUp=true;finishExam()}};tick();e.timerId=setInterval(tick,1000)}
async function generateExam(){let l=$('#examLevel').value,s=$('#examSubject').value,scope=$('#examScope').value,topic=$('#examTopic').value,count=Number($('#examCount').value)||10,difficulty=$('#examDifficulty').value,minutes=Number($('#examTimerMinutes')?.value||20);let pool=uniquePool(examPool(l,s,scope,topic));if(!pool.length){$('#examStatus').textContent='No questions are available for this selection yet.';return}$('#examStatus').textContent=`Building a ${l} exam with class-level difficulty and fresh questions…`;let endpoint=localStorage.getItem('learnova.aiEndpoint')||'/api/ai/exam';let qs=[];try{let r=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({level:l,subject:s,topic:scope==='topic'?topic:'Whole subject',scope,count,difficulty,questions:pool.slice(0,80).map(x=>({question:x.question,answer:x.answer,topic:x.topic}))})});let j=await r.json();let remote=j.exam||j.questions;if(typeof remote==='string'){try{remote=JSON.parse(remote)}catch{remote=null}}if(Array.isArray(remote))qs=remote.map(x=>({question:x.question||x.prompt||'',choices:x.choices||x.options||[],correct:Number.isInteger(x.correct)?x.correct:0,answer:x.answer||x.explanation||'',hint:x.hint||'',topic:x.topic||topic})).filter(x=>x.question&&x.choices.length>=2).slice(0,count)}catch(e){}if(qs.length<count){let shuffled=pool.slice().sort(()=>Math.random()-.5),chosen=[];for(const q of shuffled){if(chosen.length>=count)break;if(!chosen.some(x=>x.question===q.question))chosen.push(q)}qs=chosen.map(q=>makeExamChoices(q,pool))}qs=qs.slice(0,count);state.exam={level:l,subject:s,scope,topic,count,difficulty,minutes,questions:qs,index:0,score:0,answers:[],startedAt:Date.now(),endsAt:Date.now()+minutes*60000,timeUp:false,timerId:null};$('#examSetup').classList.add('hidden');$('#examRun').classList.remove('hidden');$('#examStatus').textContent='';showPage('exam');renderExamQuestion();startExamTimer()}
function renderExamQuestion(){let e=state.exam,q=e.questions[e.index];if(!q)return finishExam();let opts=q.choices.map((x,i)=>`<button data-i="${i}">${esc(x)}</button>`).join('');$('#examRun').innerHTML=`<div class="exam-head"><span class="eyebrow">AI EXAM 3.0 • QUESTION ${e.index+1} OF ${e.questions.length}</span><span class="badge">${esc(e.difficulty)} • ${esc(e.subject)}</span><span id="examTimer" class="badge">Time ${e.minutes}:00</span></div><div class="quiz-question"><h2>${esc(q.question)}</h2><div class="quiz-options exam-options-list">${opts}</div><p class="hint">💡 Hint: ${esc(q.hint||'Identify what the question asks and compare each option against its conditions.')}</p></div>`;$$('#examRun .exam-options-list button').forEach(b=>b.onclick=()=>answerExam(Number(b.dataset.i)))}
function answerExam(choice){let e=state.exam;if(!e||e.timeUp)return;let q=e.questions[e.index],ok=choice===q.correct;e.answers.push({question:q.question,chosen:q.choices[choice],correct:q.answer,ok,topic:q.topic});if(ok)e.score++;e.index++;e.index<e.questions.length?renderExamQuestion():finishExam()}
function finishExam(){let e=state.exam;if(!e)return;stopExamTimer();let u=state.user||getUser(),pct=e.questions.length?Math.round(e.score/e.questions.length*100):0;u.exams=(u.exams||0)+1;u.examScoreTotal=(u.examScoreTotal||0)+pct;u.examHistory=u.examHistory||[];u.examHistory.unshift({at:new Date().toLocaleString(),level:e.level,subject:e.subject,topic:e.scope==='topic'?e.topic:'Whole subject',score:e.score,total:e.questions.length,pct,difficulty:e.difficulty,minutes:e.minutes,timeUp:!!e.timeUp});u.examHistory=u.examHistory.slice(0,20);u.mistakes=u.mistakes||[];e.answers.filter(x=>!x.ok).slice(0,10).forEach(x=>u.mistakes.unshift({type:'exam',question:x.question,correct:x.correct,topic:x.topic,at:new Date().toLocaleString()}));u.mistakes=u.mistakes.slice(0,50);u.activity=u.activity||[];u.activity.unshift({text:`Finished AI Exam: ${e.subject} — ${e.score}/${e.questions.length} (${pct}%)`,at:new Date().toLocaleString()});u.activity=u.activity.slice(0,8);saveUser(u);renderUser();renderActivity();renderReport?.();updateProgress();let weak=[...new Set(e.answers.filter(x=>!x.ok).map(x=>x.topic).filter(Boolean))];let weakText=weak.length?`Focus next on: ${weak.slice(0,3).join(', ')}.`:'Great work — no missed questions!';let answered=e.answers.length,unanswered=Math.max(0,e.questions.length-answered);$('#examRun').innerHTML=`<div class="quiz-result"><span class="eyebrow">AI EXAM 3.0 COMPLETE</span><div class="score-circle">${e.score}/${e.questions.length}</div><h2>${gradeName(pct)}</h2><p>You scored ${pct}%. ${e.timeUp?'Time ran out. ':''}${unanswered?`${unanswered} question${unanswered===1?'':'s'} unanswered. `:''}${weakText}</p><div class="exam-summary-grid"><div><b>${answered}</b><small>Answered</small></div><div><b>${e.questions.length- e.score}</b><small>To review</small></div><div><b>${Math.round((Date.now()-e.startedAt)/60000)}m</b><small>Time used</small></div></div><div class="exam-review"><h3>Review & corrections</h3>${e.answers.map((x,i)=>`<div class="exam-review-row"><b>${i+1}. ${esc(x.question)}</b><span class="${x.ok?'exam-correct':'exam-wrong'}">${x.ok?'✓ Correct':'✗ Review'}</span>${x.ok?'<small>Good — your selected answer matched the exam key.</small>':`<small>Correct answer: ${esc(x.correct)}. Revisit ${esc(x.topic||'this topic')} and ask AI Tutor for a step-by-step explanation.</small>`}</div>`).join('')}${unanswered?`<div class="exam-review-row"><b>${answered+1}. Unanswered questions</b><span class="exam-wrong">✗ Review</span><small>The exam ended before these questions were answered.</small></div>`:''}</div><button class="primary" id="againExam">New AI Exam</button> <button class="ghost" id="examTutor">Ask AI Tutor</button> <button class="ghost" id="examBack">Back to Dashboard</button></div>`;$('#againExam').onclick=()=>{$('#examSetup').classList.remove('hidden');$('#examRun').classList.add('hidden');showPage('exam')};$('#examBack').onclick=()=>showPage('dashboard');$('#examTutor').onclick=()=>{let first=e.answers.find(x=>!x.ok);showPage('tutor');$('#tutorLevel').value=e.level;populateTutorSubjects();$('#tutorSubject').value=e.subject;$('#tutorTopic').value=first?.topic||e.topic||'';$('#tutorQuestion').value=first?`Explain why the correct answer is: ${first.correct}`:`Help me improve my ${e.subject} exam performance.`;$('#askTutor').click()}}

function updateProgress(){let u=state.user||getUser()||{topics:0,quizzes:0,scoreTotal:0,scoreCount:0};let mastery=Object.values(u.mastery||{});let avgMastery=mastery.length?Math.round(mastery.reduce((a,x)=>a+(x.score||0),0)/mastery.length):0;let p=Math.min(100,Math.round((u.topics||0)*3+(u.quizzes||0)*1.5+avgMastery*.5));$("#bigProgress").textContent=p+"%";$("#progressFill").style.width=p+"%";$("#progressCopy").textContent=`${u.topics||0} topics completed • ${u.quizzes||0} quizzes taken • ${u.scoreCount?Math.round(u.scoreTotal/u.scoreCount):0}% average quiz score.`}
$("#backClasses").onclick=()=>{$("#subjectArea").classList.add("hidden");$("#classPicker").classList.remove("hidden")};$("#backSubjects").onclick=()=>openLevel(state.level);$("#backTopics").onclick=()=>openSubject(state.level,state.subject);
function logout(){localStorage.removeItem(userKey());location.reload()}$("#logout").onclick=logout;$("#logout2").onclick=logout;
document.addEventListener("keydown",e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){e.preventDefault();$("#searchBox").focus()}});
/* Learnova AI learning engine upgrade: class-aware tutor, unique exams and stronger assessment. */
function examSeed(str){let h=2166136261;for(let i=0;i<str.length;i++)h=(h^str.charCodeAt(i))*16777619>>>0;return h>>>0}
function examRand(seed,min,max){return min+((seed>>>0)%(max-min+1))}
function classDifficulty(l){const r=levelRank(l);return r<=3?'foundation':r<=6?'developing':r<=9?'application':'advanced'}
function tutorDirectMath(q){
 const m=q.replace(/,/g,'').match(/(-?\d+(?:\.\d+)?)\s*(\+|−|-|×|\*|÷|\/)\s*(-?\d+(?:\.\d+)?)/);
 if(!m)return null;const a=Number(m[1]),op=m[2],b=Number(m[3]);let r=op==='+'?a+b:op==='−'||op==='-'?a-b:op==='×'||op==='*'?a*b:a/b;
 if(!Number.isFinite(r))return '<b>AI Tutor 7.0</b><br><br>I can work this out, but division by zero is not defined. Please check the numbers.';
 return `<b>AI Tutor 7.0 • Step-by-step solution</b><br><br><b>1. Identify:</b> We need to calculate ${a} ${esc(op)} ${b}.<br><b>2. Work it out:</b> ${a} ${esc(op)} ${b} = <b>${r}</b>.<br><b>3. Check:</b> The result is ${r}.<br><br><b>Answer: ${r}</b><br><br>Send the full question if there are more steps, units or a word problem.`;
}
function genericTutorAnswer(q,l,s,t){
 const topicObj=(C[l]?.[s]||[]).find(x=>x.title===t);const title=t||s||'this question';const rank=levelRank(l);const lower=q.toLowerCase();
 const direct=tutorDirectMath(q);if(direct&&isMath(s))return direct;
 if(topicObj){
  const def=topicDefinition(topicObj),examples=topicObj.examples||[],ex=examples[0]||`Apply ${title} to a real ${s} situation.`;
  if(/^(what|who|define|meaning|what does|what are)\b/.test(lower))return `<b>Definition</b><br>${esc(def)}<br><br><b>Explanation for ${esc(l)}</b><br>${textbookExplanation(topicObj,l,s)}<br><br><b>Example</b><br>${ex}`;
  if(/\bwhy\b|importance|benefit|reason|purpose/.test(lower))return `<b>Why ${esc(title)} matters</b><br>${esc(title)} is important because learners use it to understand and apply ideas in ${esc(s)}. ${rank>=10?'At this level, explain evidence, consequences and real-world applications.':rank>=7?'At this level, explain causes, effects and applications.':'At this level, connect the idea to familiar situations.'}<br><br><b>Topic example:</b> ${ex}`;
  if(/example|show me|demonstrate|practical/.test(lower))return `<b>Practical example of ${esc(title)}</b><br>${ex}<br><br><b>Next:</b> Try a similar problem yourself and explain why your method matches the topic.`;
  if(/translate|translation/.test(lower)&&languageSubject(s))return `<b>Translation help</b><br>${(topicObj.examples||[]).slice(0,3).join('<br>')}<br><br>Send the exact sentence and I will translate it and explain the meaning.`;
  if(/how|solve|calculate|work out|steps|explain/.test(lower))return `<b>Let's work through ${esc(title)}</b><br><br><b>1.</b> Identify what the question gives you.<br><b>2.</b> Identify what it asks you to find or explain.<br><b>3.</b> Apply the rule, process or evidence connected with <b>${esc(title)}</b>.<br><b>4.</b> Check the result and explain why it is correct.<br><br><b>Topic knowledge:</b> ${esc(def)}<br><br><b>Practical example:</b> ${ex}`;
  return `<b>AI Tutor 7.0 • ${esc(l)}</b><br><br>I understand your question about <b>${esc(title)}</b>. ${esc(def)}<br><br>${rank>=10?'For SHS, I will analyse the idea, connect concepts and justify the conclusion.':rank>=7?'For JHS, I will apply the idea and explain why the answer works.':'For Primary, I will use simple language and familiar examples.'}<br><br><b>Your question:</b> ${esc(q)}<br><br><b>Start here:</b> ${ex}`;
 }
 if(/translate|translation/.test(lower))return `<b>AI Tutor 7.0 • Language help</b><br><br>Please send the exact word, sentence or passage. I will give the English meaning, explain the grammar or context, and provide an example at ${esc(l)} level.`;
 return `<b>AI Tutor 7.0</b><br><br>I can help with this question even when you have not selected a topic. <b>Your question:</b> ${esc(q)}<br><br>For the best answer, I will identify the concept, explain it in ${esc(l)}-appropriate language, show the reasoning or calculation, give a practical example, and check the final answer. If this is a Maths question, include all the numbers and symbols.`;
}
function assessmentFor(t,l,s){
 const qs=uniqueExamQuestions(l,s,t,10);return qs.map(q=>({question:q.question,answer:q.answer,hint:q.hint,choices:q.choices,correct:q.correct,topic:t.title}));
}
function uniqueExamQuestions(l,s,t,count){
 const r=levelRank(l),seedBase=examSeed(l+'|'+s+'|'+t.title+'|'+Date.now()+'|'+Math.random()),out=[];const def=topicDefinition(t);let i=0;
 while(out.length<count&&i<80){const seed=(seedBase+i*2654435761)>>>0;let question,answer;
  if(isMath(s)){
   const a=examRand(seed,2+r,10+r*2),b=examRand(seed>>5,2,12+r),c=examRand(seed>>10,2,9);
   if(/percentage/i.test(t.title)){const pct=examRand(seed>>15,5,35);question=`A school item costs GH₵${a*10}. What is ${pct}% of the price?`;answer=`GH₵${((a*10*pct)/100).toFixed(2)}`}
   else if(/area|geometry|measurement/i.test(t.title)){question=`A rectangle is ${a} m long and ${b} m wide. What is its area?`;answer=`${a*b} m²`}
   else if(/fraction/i.test(t.title)){question=`A class has ${a+b} equal parts and ${a} are selected. What fraction is selected?`;answer=`${a}/${a+b}`}
   else if(/equation|algebra/i.test(t.title)){question=`Solve ${a}x + ${b} = ${a*c+b}. What is x?`;answer=String(c)}
   else if(/probability/i.test(t.title)){const favourable=examRand(seed>>15,1,5),total=favourable+examRand(seed>>18,2,7);question=`A bag has ${total} equally likely items and ${favourable} are favourable to an event. What is the probability of the event?`;answer=`${favourable}/${total}`}
   else {question=`A learner uses ${a} groups of ${b} in a ${t.title} problem. What is the calculated total?`;answer=String(a*b)}
  } else {
   const verbs=r<=3?['identify','describe','choose the best meaning','state one use','recognise']:r<=6?['explain','apply','compare','describe why','identify a real-life use']:r<=9?['apply','analyse','compare','justify','explain the consequence']:['analyse','evaluate','justify','infer','critically examine'];
   const v=verbs[i%verbs.length],contexts=['school','community','Ghanaian','real-world','classroom']; const context=contexts[i%contexts.length]; const variants=[`What does ${t.title} mean, and how is it used in a ${context} situation?`,`Which example best applies ${t.title} in a ${context} situation?`,`Why is ${t.title} important in this ${context} situation?`,`How could a learner explain ${t.title} using evidence from a ${context} situation?`,`Which consequence is most closely connected with ${t.title} in this ${context} situation?`]; question=`${l}: ${variants[i%variants.length]} (new version ${i+1})`; answer=def;
  }
  const others=[];for(const x of (C[l]?.[s]||[])){const d=topicDefinition(x);if(d&&d!==answer&&!others.includes(d))others.push(d)}
  let choices=[answer,...others.slice(0,3)];while(choices.length<4)choices.push(`An unrelated idea that does not describe ${t.title}`);choices=choices.slice(0,4);const rot=examRand(seed>>22,0,3);choices=choices.slice(rot).concat(choices.slice(0,rot));const correct=choices.indexOf(answer);
  const key=question.toLowerCase().replace(/\s+/g,' ').trim();if(!out.some(x=>x.question.toLowerCase().replace(/\s+/g,' ').trim()===key))out.push({question,answer,choices,correct,hint:`Use the definition, relevant evidence and practical application of ${t.title}.`,topic:t.title});i++;
 }
 return out;
}
function examSeenKey(l,s,t){return `learnova.examSeen|${l}|${s}|${t||'whole'}`}
function getExamSeen(k){try{return new Set(JSON.parse(localStorage.getItem(k)||'[]'))}catch{return new Set()}}
function saveExamSeen(k,set){localStorage.setItem(k,JSON.stringify([...set].slice(-200)))}
async function generateExam(){
 const l=$("#examLevel").value,s=$("#examSubject").value,scope=$("#examScope").value,topic=$("#examTopic").value,count=Number($("#examCount").value)||10,difficulty=$("#examDifficulty").value;let topics=scope==='topic'?(C[l]?.[s]||[]).filter(t=>t.title===topic):(C[l]?.[s]||[]);if(!topics.length){$("#examStatus").textContent='No topics are available for this selection.';return}
 $("#examStatus").textContent=`Building a ${l} ${difficulty} exam with new questions…`;
 let pool=[];topics.forEach(t=>pool.push(...uniqueExamQuestions(l,s,t,Math.max(4,Math.ceil(count/topics.length)+4))));
 const seenKey=examSeenKey(l,s,scope==='topic'?topic:'whole'),seen=getExamSeen(seenKey);pool=pool.sort(()=>Math.random()-.5).filter(q=>{const k=q.question.toLowerCase().replace(/\s+/g,' ').trim();if(seen.has(k))return false;seen.add(k);return true});
 // If a learner has seen many generated variants, allow fresh variants with a new session signature rather than repeating exact wording.
 while(pool.length<count){const t=topics[pool.length%topics.length];const more=uniqueExamQuestions(l,s,t,10);for(const q of more){const k=q.question.toLowerCase().replace(/\s+/g,' ').trim();if(!seen.has(k)){seen.add(k);pool.push(q)}if(pool.length>=count)break}if(pool.length>=count)break}
 saveExamSeen(seenKey,seen);pool=pool.slice(0,count);
 if(pool.length<count){$("#examStatus").textContent='Not enough unique questions for this selection. Choose a whole subject or a larger topic set.';return}
 state.exam={level:l,subject:s,scope,topic,count,difficulty,questions:pool,index:0,score:0,answers:[]};$("#examSetup").classList.add('hidden');$("#examRun").classList.remove('hidden');$("#examStatus").textContent='';showPage('exam');renderExamQuestion();
}
function renderQuizQuestion(){const q=state.quiz.topic.questions[state.quiz.index];let choices=q.choices||[q.answer,'A different idea from the topic.','An unrelated statement.','None of these'];const opts=choices.map((x,i)=>`<button data-i="${i}">${esc(x)}</button>`).join('');$("#quizRun").innerHTML=`<div class="quiz-question"><span class="eyebrow">QUESTION ${state.quiz.index+1} OF 10</span><h2>${esc(q.question)}</h2><div class="quiz-options">${opts}</div><p class="hint">💡 ${esc(q.hint||'Use the topic definition and apply it carefully.')}</p></div>`;$$('#quizRun .quiz-options button').forEach(b=>b.onclick=()=>{if(Number(b.dataset.i)===(q.correct??0))state.quiz.score++;state.quiz.index++;state.quiz.index<10?renderQuizQuestion():finishQuiz()})}


function renderTutorChat(){const box=$("#tutorChat");if(!box)return;const h=state.tutorHistory||[];box.innerHTML=h.length?h.map(m=>`<div class="chat-bubble ${m.role==='user'?'user':'ai'}"><b>${m.role==='user'?'You':'Learnova AI Tutor'}</b><br>${esc(m.content).replace(/\n/g,'<br>')}</div>`).join(''):'<div class="chat-bubble ai"><b>Learnova AI Tutor</b><br>Ask me a school question and I will answer it directly, then explain the reasoning.</div>';box.scrollTop=box.scrollHeight}
async function askTutor(){let q=$("#tutorQuestion").value.trim();if(!q){$("#tutorAnswer").textContent="Please type a school question first.";return}let l=$("#tutorLevel").value,s=$("#tutorSubject").value,t=$("#tutorTopic").value.trim();state.tutorHistory.push({role:'user',content:q});renderTutorChat();$("#tutorQuestion").value='';$("#tutorAnswer").innerHTML='<div class="ai-icon">🤖</div><div><b>Thinking…</b><p>Answering your actual question.</p></div>';let endpoint=localStorage.getItem('learnova.aiEndpoint')||'/api/tutor';let answer=null;try{let res=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question:q,level:l,subject:s,topic:t,history:state.tutorHistory.slice(-12),mode:state.tutorMode||'adaptive',profile:tutorContext(),instructions:'Act as Learnova AI Tutor 7.0. Answer the actual school question. Match the learner level. Prefer guided reasoning, clear definitions, worked examples, misconception checks, and a short check-for-understanding question. For Maths show workings. For languages include translation when requested. Do not invent curriculum facts.'})});let j=await res.json();answer=j.answer||j.content||j.choices?.[0]?.message?.content||null}catch(e){}if(!answer){const direct=directTutorKnowledge(q,l,s,t);if(direct)answer=direct;} if(!answer){const pack=subjectTutorAnswer(q,l,s,t);if(pack)answer=pack;} if(!answer)answer=genericTutorAnswer(q,l,s,t);state.tutorHistory.push({role:'assistant',content:String(answer).replace(/<[^>]+>/g,' ')});state.tutorHistory=state.tutorHistory.slice(-12);renderTutorChat();$("#tutorAnswer").innerHTML='<div class="ai-icon">🤖</div><div>'+answer+'</div>'}

let existing=getUser();setupAuth();if(existing){state.user=existing;state.level=existing.level||state.level;enterApp()}else{$("#auth").classList.remove("hidden")}

function schoolData(){try{return JSON.parse(localStorage.getItem("learnova.school")||'{"classes":[],"assignments":[],"students":[],"teachers":[]}')}catch(e){return {classes:[],assignments:[],students:[],teachers:[]}}}
function saveSchool(x){localStorage.setItem("learnova.school",JSON.stringify(x))}
function roleOf(){return (state.user&&state.user.role)||"student"}
function renderSchoolPortal(){
 const u=state.user||getUser(); const r=roleOf();
 ["portalStudent","portalTeacher","portalParent","portalAdmin"].forEach(id=>document.getElementById(id)?.classList.add("hidden"));
 const map={student:"portalStudent",teacher:"portalTeacher",parent:"portalParent",admin:"portalAdmin"}; document.getElementById(map[r])?.classList.remove("hidden");
 const rb=document.getElementById("roleBadge"); if(rb) rb.textContent=r==="admin"?"School Admin":r[0].toUpperCase()+r.slice(1);
 const d=schoolData();
 if(r==="teacher"){
   document.getElementById("teacherClassCount").textContent=d.classes.length; document.getElementById("teacherAssignmentCount").textContent=d.assignments.length;
   const students=d.students.length?d.students:[{name:u?.name||"Demo Student",level:u?.level||"JHS 2",mastery:Object.values(u?.mastery||{}).reduce((a,x)=>a+(x.score||0),0)/(Object.keys(u?.mastery||{}).length||1)}];
   const avg=Math.round(students.reduce((a,x)=>a+(x.mastery||0),0)/(students.length||1)); document.getElementById("teacherProgressFill").style.width=avg+"%";document.getElementById("teacherProgressText").textContent=`Average mastery: ${avg}%`;
   document.getElementById("teacherStudentList").innerHTML=students.map(x=>`<div class="report-card"><h3>${esc(x.name)}</h3><p>${esc(x.level||"")} • Mastery ${Math.round(x.mastery||0)}%</p></div>`).join("");
 }
 if(r==="parent"){
   const ms=Object.values(u?.mastery||{}),avg=ms.length?Math.round(ms.reduce((a,x)=>a+(x.score||0),0)/ms.length):0; document.getElementById("parentMastery").textContent=avg+"%";
   const weak=ms.map((x,i)=>x).length; document.getElementById("parentWeak").textContent=weak?`${ms.filter(x=>(x.score||0)<70).length} topic(s) need more practice.`:"No weak topics yet.";
   document.getElementById("parentActivity").innerHTML=(u?.activity||[]).slice(0,5).map(x=>`<div>${esc(x.text)}<small style="display:block;color:#7b8499">${esc(x.at)}</small></div>`).join("")||"No activity yet.";
   document.getElementById("parentSummary").textContent=avg>=80?"Excellent progress. Encourage continued challenge and revision.":avg>=55?"Progress is developing. Encourage regular practice and revision.":"The learner needs more foundation practice. Use AI Tutor 7.0 and Smart Revision.";
 }
 if(r==="admin"){document.getElementById("adminStudentCount").textContent=d.students.length;document.getElementById("adminTeacherCount").textContent=d.teachers.length;document.getElementById("adminMastery").textContent=(u?.scoreCount?Math.round(u.scoreTotal/u.scoreCount):0)+"%";document.getElementById("schoolDataPreview").textContent=JSON.stringify(d,null,2)}
}
function initSchoolPortal(){
 const addClass=document.getElementById("addClassBtn"),addAssign=document.getElementById("addAssignmentBtn"),seed=document.getElementById("seedSchoolBtn"),exp=document.getElementById("exportSchoolBtn");
 addClass?.addEventListener("click",()=>{let d=schoolData();d.classes.push({name:`Demo Class ${d.classes.length+1}`,created:new Date().toISOString()});saveSchool(d);renderSchoolPortal()});
 addAssign?.addEventListener("click",()=>{let d=schoolData();d.assignments.push({title:"Topic Quiz",subject:state.subject||"Mathematics",deadline:"Next week"});saveSchool(d);renderSchoolPortal()});
 seed?.addEventListener("click",()=>{saveSchool({classes:[{name:"JHS 2A"},{name:"JHS 3A"}],assignments:[{title:"Mathematics Practice",deadline:"Friday"},{title:"Science Quiz",deadline:"Monday"}],students:[{name:"Demo Student 1",level:"JHS 2",mastery:76},{name:"Demo Student 2",level:"JHS 2",mastery:61}],teachers:[{name:"Demo Teacher"}]});renderSchoolPortal()});
 exp?.addEventListener("click",()=>{const blob=new Blob([JSON.stringify(schoolData(),null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="learnova-school-data.json";a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500)});
 $$('[data-page="school"]').forEach(x=>x.addEventListener("click",()=>setTimeout(renderSchoolPortal,0)));
 renderSchoolPortal();
}
function getMasteryEntries(){let u=state.user||getUser();return Object.entries(u?.mastery||{}).map(([k,v])=>{let p=k.split("|");return {key:k,level:p[0],subject:p[1],title:p.slice(2).join("|"),score:v.score||0,levelName:v.level||adaptiveLabel(v.score||0)}})}
function renderRevisionPlan(){let b=$("#revisionPlan");if(!b)return;let a=getMasteryEntries().sort((x,y)=>x.score-y.score).filter(x=>x.score<80).slice(0,8);if(!a.length){b.innerHTML='<div class="empty-big">🌟<h2>Your revision plan is ready</h2><p>Take a few quizzes and Learnova will identify topics that need practice.</p><button class="primary" data-page="learn">Start Learning</button></div>';return}b.innerHTML=a.map((x,i)=>`<div class="revision-card"><div class="rec-icon">${i<2?'🎯':'📚'}</div><div><span class="badge">${esc(x.levelName)} • ${x.score}%</span><h3>${esc(x.title)}</h3><p>${esc(x.level)} • ${esc(x.subject)}</p><small>${x.score<30?'Start with the basics and read the lesson.':x.score<55?'Review the explanation and examples.':x.score<75?'Try practice and explain your reasoning.':'Take another quiz to reach mastery.'}</small></div><button class="outline" data-revise="${esc(x.key)}">Revise →</button></div>`).join('');$$('[data-revise]').forEach(btn=>btn.onclick=()=>{let p=btn.dataset.revise.split('|'),l=p[0],s=p[1],t=p.slice(2).join('|');let o=(C[l]?.[s]||[]).find(z=>z.title===t);if(o){state.level=l;state.subject=s;openTopic(o,(C[l][s]||[]).indexOf(o));showPage('learn')}})}
function renderReport(){let b=$("#reportContent");if(!b)return;let u=state.user||getUser()||{},a=getMasteryEntries(),avg=a.length?Math.round(a.reduce((n,x)=>n+x.score,0)/a.length):0,good=a.filter(x=>x.score>=75).sort((x,y)=>y.score-x.score).slice(0,4),weak=a.filter(x=>x.score<55).sort((x,y)=>x.score-y.score).slice(0,4);b.innerHTML=`<div class="report-card report-wide"><div class="report-number">${avg}%</div><div><h2>Overall mastery</h2><p>${avg>=80?'Excellent progress. Keep challenging yourself.':avg>=55?'You are building confidence. Keep practising.':'Use Smart Revision to build your foundations.'}</p><div class="progress-track"><i style="width:${avg}%"></i></div></div></div><div class="report-card"><h2>💪 Strengths</h2>${good.length?good.map(x=>`<div class="report-row"><b>${esc(x.title)}</b><span>${x.score}%</span></div>`).join(''):'<p>No strong topics recorded yet.</p>'}</div><div class="report-card"><h2>🎯 Improve next</h2>${weak.length?weak.map(x=>`<div class="report-row"><b>${esc(x.title)}</b><span>${x.score}%</span></div>`).join(''):'<p>No weak topics identified yet.</p>'}</div><div class="report-card report-wide"><h2>🕘 Recent learning</h2>${(u.activity||[]).slice(0,8).map(x=>`<div class="activity-row">${esc(x.text)}<small>${esc(x.at)}</small></div>`).join('')||'<p>Your activity will appear here.</p>'}</div>`}
function initV11(){
 renderRevisionPlan();renderReport();
 const s=$("#searchBox"), box=$("#searchResults");
 if(!s||!box)return;
 const close=()=>{box.classList.add("hidden")};
 const resultsFor=q=>{
   const out=[]; if(!q)return out;
   for(const l of levels){
     for(const sub of Object.keys(C[l]||{})){
       const subjectMatch=sub.toLowerCase().includes(q);
       if(subjectMatch && !out.some(x=>x.level===l&&x.subject===sub)) out.push({type:"subject",level:l,subject:sub,title:sub,keyIdea:"Subject"});
       for(const t of (C[l][sub]||[])){
         const hay=(t.title+' '+(t.keyIdea||'')).toLowerCase();
         if(hay.includes(q)) out.push({type:"topic",level:l,subject:sub,title:t.title,keyIdea:t.keyIdea||""});
         if(out.length>=12)return out;
       }
     }
   }
   return out;
 };
 const render=()=>{
   const q=s.value.trim().toLowerCase();
   if(!q){box.innerHTML="";close();return}
   const rs=resultsFor(q);
   if(!rs.length){box.innerHTML='<div class="search-empty">No subjects or topics found. Try another word.</div>';box.classList.remove("hidden");return}
   box.innerHTML=rs.map((r,i)=>`<button class="search-result" data-search-index="${i}"><b>${esc(r.title)}</b><small>${esc(r.level)} • ${esc(r.subject)}${r.type==='subject'?' • Subject':''}</small></button>`).join("");
   box.classList.remove("hidden");
   box.querySelectorAll("[data-search-index]").forEach(btn=>btn.onclick=()=>{
     const r=rs[Number(btn.dataset.searchIndex)];
     state.level=r.level;state.subject=r.subject;
     if(r.type==='subject'){
       showPage('learn');setTimeout(()=>{
         $("#classPicker")?.classList.add("hidden");$("#subjectArea")?.classList.remove("hidden");$("#selectedClass").textContent=r.level;openLevel(r.level);
       },0);
     }else{
       const arr=C[r.level]?.[r.subject]||[], idx=arr.findIndex(t=>t.title===r.title);
       if(idx>=0){showPage('learn');setTimeout(()=>{openLevel(r.level);openSubject(r.level,r.subject);openTopic(arr[idx],idx);setTimeout(()=>document.getElementById('lessonArea')?.scrollIntoView({behavior:'smooth',block:'start'}),120)},40)}
     }
     s.value="";close();
   });
 };
 s.oninput=render;
 s.onfocus=()=>{if(s.value.trim())render()};
 document.addEventListener("click",e=>{if(!e.target.closest('.search-wrap'))close()});
}

function initFeedback(){const b=$("#sendFeedback");if(!b)return;b.onclick=()=>{const t=$("#feedbackText").value.trim();if(!t){$("#feedbackMsg").textContent="Please enter feedback first.";return}let a=[];try{a=JSON.parse(localStorage.getItem("learnova.betaFeedback")||"[]")}catch(e){}a.unshift({text:t,at:new Date().toISOString()});localStorage.setItem("learnova.betaFeedback",JSON.stringify(a));$("#feedbackText").value="";$("#feedbackMsg").textContent="Thanks — your beta feedback was saved on this device."}}


/* Learnova Tutor reliability upgrade: direct school answers + automatic topic detection. */
function findTutorTopic(q,l,s,t){
 const query=String(q||'').toLowerCase();
 if(t){const exact=(C[l]?.[s]||[]).find(x=>x.title.toLowerCase()===String(t).toLowerCase());if(exact)return {topic:exact,level:l,subject:s};}
 const preferred=[]; if(C[l]) for(const subj of Object.keys(C[l])) for(const x of (C[l][subj]||[])) preferred.push({topic:x,level:l,subject:subj});
 const all=[]; for(const lev of Object.keys(C)) for(const subj of Object.keys(C[lev]||{})) for(const x of (C[lev][subj]||[])) all.push({topic:x,level:lev,subject:subj});
 const pool=preferred.concat(all), words=query.replace(/[^\w\s-]/g,' ').split(/\s+/).filter(w=>w.length>=3); let best=null,score=0;
 for(const item of pool){const hay=(item.topic.title+' '+(item.topic.keyIdea||'')).toLowerCase();let sc=0;if(query.includes(item.topic.title.toLowerCase()))sc+=20;for(const w of words)if(hay.includes(w))sc+=2;if(sc>score){score=sc;best=item;}}
 return score>=4?best:null;
}
function cellsTutorAnswer(l){
 const r=levelRank(l); const depth=r>=10?'At SHS level, connect cell structure to transport, energy conversion, protein synthesis, genetics and specialised cell function.':r>=7?'At JHS level, focus on organelles, their functions, differences between plant and animal cells, and how structure supports function.':'At Primary level, focus on the idea that a cell is a tiny living unit and learn a few important parts using familiar examples.';
 return `<b>AI Tutor 7.0 • Cells</b><br><br><b>Definition</b><br>A <b>cell</b> is the smallest basic structural and functional unit of a living organism. Living things are made of one or many cells.<br><br><b>Main idea</b><br>Cells carry out life processes such as obtaining or using energy, removing waste, growing and reproducing. A group of similar cells can form a tissue, tissues can form organs, and organs can work together in organ systems.<br><br><b>Important cell parts</b><br>• <b>Cell membrane:</b> controls what enters and leaves the cell.<br>• <b>Cytoplasm:</b> where many chemical reactions take place.<br>• <b>Nucleus:</b> contains genetic material and helps control cell activities.<br>• <b>Mitochondria:</b> release usable energy from food during respiration.<br>• <b>Ribosomes:</b> make proteins.<br>• <b>Cell wall:</b> gives plant cells extra support and shape.<br>• <b>Chloroplasts:</b> contain chlorophyll and are the site of photosynthesis in plant cells.<br>• <b>Vacuole:</b> stores cell sap and helps plant cells maintain firmness.<br><br><b>Plant cell vs animal cell</b><br>Plant cells usually have a cell wall, chloroplasts and a large permanent vacuole. Animal cells do not have a cell wall or chloroplasts and usually have smaller vacuoles.<br><br><b>Example</b><br>If a plant is placed in sunlight, chloroplasts help its cells carry out photosynthesis. If a muscle cell needs energy for movement, mitochondria help release usable energy through respiration.<br><br><b>For ${esc(l)}</b><br>${depth}<br><br><b>Quick check:</b> What is the function of the nucleus?`;
}
function subjectTutorAnswer(q,l,s,t){
 const x=String(q||'').toLowerCase(), subj=String(s||'').toLowerCase(), topic=String(t||'').toLowerCase();
 const wantsWhy=/\b(why|importance|important|reason|purpose|benefit)\b/.test(x);
 const packs=[
  [/\b(demand)\b/,`<b>Demand</b><br><br><b>Definition:</b> Demand is the quantity of a good or service that consumers are willing and able to buy at a given price during a given period.<br><br><b>Explanation:</b> Demand is affected by factors such as price, income, tastes, prices of related goods and expectations. Other things remaining constant, quantity demanded generally falls when price rises and rises when price falls.<br><br><b>Example:</b> If the price of a school bag falls from GH₵120 to GH₵90 and more students can afford it, the quantity demanded may increase.<br><br><b>Class-level focus:</b> ${esc(l)} — explain the definition first, then identify the factor affecting demand in the question.`],
  [/\b(supply)\b/,`<b>Supply</b><br><br><b>Definition:</b> Supply is the quantity of a good or service that producers are willing and able to offer for sale at different prices during a given period.<br><br><b>Explanation:</b> Supply is influenced by production costs, technology, taxes, number of sellers and expectations. Other things remaining constant, a higher price can encourage producers to supply more.<br><br><b>Example:</b> If improved farming equipment lowers the cost of producing tomatoes, farmers may be able to supply more tomatoes.`],
  [/\b(inflation)\b/,`<b>Inflation</b><br><br><b>Definition:</b> Inflation is a sustained increase in the general price level of goods and services over time, which reduces the purchasing power of money.<br><br><b>Example:</b> If a basket of commonly purchased goods becomes more expensive across many months, the same GH₵100 buys fewer goods than before.<br><br><b>Why it matters:</b> Inflation affects household budgets, savings, wages and business costs.`],
  [/\b(citizenship|rights|responsibilit)/,`<b>Citizenship, Rights and Responsibilities</b><br><br><b>Definition:</b> Citizenship is the legal membership of a person in a state, with rights and responsibilities under its laws.<br><br><b>Rights</b> are protections or freedoms recognised by law. <b>Responsibilities</b> are duties citizens are expected to perform, such as obeying lawful rules and contributing positively to society.<br><br><b>Example:</b> A citizen can exercise a lawful right while also respecting the rights of other people.`],
  [/\b(photosynthesis)\b/,`<b>Photosynthesis</b><br><br><b>Definition:</b> Photosynthesis is the process by which green plants use light energy to make glucose from carbon dioxide and water, releasing oxygen as a by-product.<br><br><b>Word equation:</b> carbon dioxide + water → glucose + oxygen, using light energy and chlorophyll.<br><br><b>Importance:</b> It provides food energy for plants and supplies oxygen to the environment.`],
  [/\b(ecosystem|ecology)\b/,`<b>Ecosystem</b><br><br><b>Definition:</b> An ecosystem is a community of living organisms interacting with one another and with the non-living parts of their environment.<br><br><b>Example:</b> A pond ecosystem can contain fish, algae, insects, microorganisms, water, light and dissolved substances. These parts interact through food chains and nutrient cycles.<br><br><b>Why it matters:</b> Changes to one part can affect other parts of the system.`],
  [/\b(electricity|circuit|current|voltage|resistance)\b/,`<b>Electricity</b><br><br><b>Definition:</b> Electric current is the rate at which electric charge flows through a circuit.<br><br><b>Key relationship:</b> For a simple ohmic component under suitable conditions, V = IR, where V is voltage, I is current and R is resistance.<br><br><b>Example:</b> If V = 12 V and R = 4 Ω, then I = V ÷ R = 12 ÷ 4 = 3 A.<br><br><b>Safety:</b> Real electrical systems should be handled using appropriate safety procedures.`],
  [/\b(force|motion)\b/,`<b>Force and Motion</b><br><br><b>Definition:</b> A force is a push or pull that can change the motion or shape of an object.<br><br><b>Example:</b> Pushing a stationary trolley can make it move; increasing the push can change its acceleration when other conditions are controlled.<br><br><b>Approach:</b> Identify the forces acting, their directions and the effect on motion.`],
  [/\b(matter|solid|liquid|gas)\b/,`<b>Matter</b><br><br><b>Definition:</b> Matter is anything that has mass and occupies space.<br><br><b>States:</b> Solids have a fixed shape and volume; liquids have a fixed volume but take the shape of their container; gases have neither a fixed shape nor a fixed volume.<br><br><b>Example:</b> Heating ice causes a change from solid water to liquid water.`],
  [/\b(noun|verb|adjective|adverb|grammar|sentence)\b/,`<b>English Grammar</b><br><br><b>Definition:</b> Grammar is the system of rules that determines how words are formed and combined into meaningful sentences.<br><br><b>Example:</b> In “The student solved the problem,” “student” is a noun and “solved” is a verb.<br><br><b>Tip:</b> Identify the job each word performs in the sentence rather than guessing from its position alone.`],
  [/\b(comprehension|passage|reading)\b/,`<b>Reading Comprehension</b><br><br><b>Definition:</b> Reading comprehension is the ability to understand, interpret and evaluate information in a written passage.<br><br><b>Method:</b> Read for the main idea, identify supporting details, infer meaning from evidence and answer using information from the passage.<br><br><b>Example:</b> If a passage states that a farmer planted maize after rainfall, a question about the timing should be answered from that stated evidence.`],
  [/\b(algorithm|programming|coding|computer)\b/,`<b>Computing</b><br><br><b>Definition:</b> An algorithm is a finite, ordered set of clear steps for solving a problem or completing a task.<br><br><b>Example:</b> To calculate an average: input the values, add them, count them, divide the total by the count, then display the result.<br><br><b>Why it matters:</b> Clear algorithms make solutions easier to test, explain and implement in programs.`],
  [/\b(agriculture|crop|farming)\b/,`<b>Agriculture</b><br><br><b>Definition:</b> Agriculture is the science and practice of cultivating crops and rearing animals for food, raw materials and other uses.<br><br><b>Example:</b> A farmer can improve crop production by selecting suitable varieties, preparing the soil, managing water and controlling pests appropriately.<br><br><b>Importance:</b> Agriculture supports food supply, employment and many industries.`]
 ];
 for(const [re,ans] of packs) if(re.test(x)||re.test(topic)) return `<b>AI Tutor 7.0 • ${esc(l)}</b><br><br>${ans}${wantsWhy?'':'<br><br><b>Check yourself:</b> State the definition, give one example and explain how the idea applies to the question.'}`;
 return null;
}
function directTutorKnowledge(q,l,s,t){
 const x=String(q||'').toLowerCase();
 if(/\b(cell|cells|cell organelle|organelles|plant cell|animal cell)\b/.test(x))return cellsTutorAnswer(l);
 if(/\bphotosynthesis\b/.test(x))return `<b>AI Tutor 7.0 • Photosynthesis</b><br><br><b>Definition:</b> Photosynthesis is the process by which green plants use light energy to make glucose from carbon dioxide and water, releasing oxygen as a by-product.<br><br><b>Where?</b> It mainly occurs in chloroplasts containing chlorophyll.<br><br><b>Word equation:</b> carbon dioxide + water → glucose + oxygen, using light energy and chlorophyll.<br><br><b>Why it matters:</b> It provides food energy for plants and forms the starting point for many food chains.`;
 if(/\bconstitution\b/.test(x))return `<b>AI Tutor 7.0 • Constitution</b><br><br><b>Definition:</b> A constitution is a set of fundamental rules and principles used to govern a country and define how state power is organised and exercised.<br><br><b>Why it matters:</b> It establishes institutions, rights, responsibilities and limits on government power.<br><br><b>Exam approach:</b> Define the term first, then explain its major features and importance.`;
 return null;
}
function mathFormat(n){
 if(!Number.isFinite(n)) return 'undefined';
 if(Math.abs(n-Math.round(n))<1e-10) return String(Math.round(n));
 return String(Number(n.toFixed(10)));
}
function gcdMath(a,b){a=Math.abs(Math.trunc(a));b=Math.abs(Math.trunc(b));while(b){const t=a%b;a=b;b=t}return a||1}
function solveArithmeticExpression(expr){
 let x=String(expr).replace(/[×x]/g,'*').replace(/÷/g,'/').replace(/[−–—]/g,'-').replace(/\s+/g,'');
 if(!x || !/^[0-9+*/().%^_-]+$/.test(x)) return null;
 let i=0;
 function parseExpr(){let v=parseTerm();while(i<x.length&&(x[i]=='+'||x[i]=='-')){const op=x[i++];const r=parseTerm();if(r===null)return null;v=op==='+'?v+r:v-r}return v}
 function parseTerm(){let v=parsePower();while(i<x.length&&(x[i]=='*'||x[i]=='/'||x[i]=='%')){const op=x[i++];const r=parsePower();if(r===null)return null;if(op==='/'&&r===0)return null;v=op==='*'?v*r:op==='/'?v/r:v%r}return v}
 function parsePower(){let v=parseUnary();if(i<x.length&&x[i]==='^'){i++;const r=parsePower();if(r===null)return null;v=Math.pow(v,r)}return v}
 function parseUnary(){if(x[i]==='+'){i++;return parseUnary()}if(x[i]==='-'){i++;const v=parseUnary();return v===null?null:-v}if(x[i]==='('){i++;const v=parseExpr();if(x[i]!==')')return null;i++;return v}let m=x.slice(i).match(/^\d+(?:\.\d+)?/);if(!m)return null;i+=m[0].length;return Number(m[0])}
 const v=parseExpr();return i===x.length&&Number.isFinite(v)?v:null;
}
function advancedMathTutor(q,l,s,t){
 const raw=String(q||'').trim(), x=raw.toLowerCase().replace(/,/g,'');
 // General arithmetic: supports parentheses, decimals, powers and normal order of operations.
 let expr=x.replace(/^\s*(what is|calculate|compute|work out|evaluate|solve)\s+/,'').replace(/\?\s*$/,'').trim();
 // Accept natural-language arithmetic such as “3 plus 3”, “10 times 4”, and “20 divided by 5”.
 expr=expr.replace(/\bplus\b/g,'+').replace(/\bminus\b/g,'-').replace(/\b(?:times|multiplied by)\b/g,'*').replace(/\b(?:divided by|over)\b/g,'/').replace(/\bto the power of\b/g,'^');
 if(/^[0-9+*/().%^×÷−\-\s]+$/.test(expr) && /\d/.test(expr)){
  const r=solveArithmeticExpression(expr);
  if(r!==null)return `<b>AI Tutor 7.0 • Step-by-step Maths</b><br><br><b>Question:</b> ${esc(raw)}<br><b>Step 1:</b> Follow the order of operations: brackets, powers, multiplication/division, then addition/subtraction.<br><b>Step 2:</b> Calculate carefully: <b>${esc(expr)}</b>.<br><b>Step 3:</b> Check the result by substituting or estimating.<br><br><b>Answer: ${mathFormat(r)}</b>`;
 }
 // Percentage of a quantity.
 let m=x.match(/(?:what is|calculate|find|work out)?\s*(\d+(?:\.\d+)?)\s*(?:%|percent)\s+(?:of)\s+(?:gh[₵c]|ghs?|₵)?\s*(\d+(?:\.\d+)?)/i);
 if(m){const pct=+m[1],base=+m[2],r=base*pct/100;return `<b>Step-by-step Maths • Percentage</b><br><br><b>Formula:</b> (${pct} ÷ 100) × ${base}<br><b>Substitute:</b> ${pct/100} × ${base}<br><b>Calculate:</b> ${mathFormat(r)}<br><b>Answer: ${mathFormat(r)}</b>`}
 // Percentage increase/decrease.
 m=x.match(/(?:increase|decrease)\s+(\d+(?:\.\d+)?)\s+by\s+(\d+(?:\.\d+)?)\s*%/i);
 if(m){const n=+m[1],p=+m[2],d=n*p/100,r=/decrease/.test(x)?n-d:n+d;return `<b>Step-by-step Maths • Percentage Change</b><br><br>Percentage change = (${p} ÷ 100) × ${n} = ${mathFormat(d)}.<br>${/decrease/.test(x)?`New value = ${n} − ${mathFormat(d)}`:`New value = ${n} + ${mathFormat(d)}`}<br><b>Answer: ${mathFormat(r)}</b>`}
 // Fractions: simplify or basic add/subtract/multiply/divide.
 m=x.match(/(?:simplify|reduce)\s+(\d+)\s*\/\s*(\d+)/i);
 if(m){const a=+m[1],b=+m[2],g=gcdMath(a,b);return `<b>Step-by-step Maths • Fraction</b><br><br>Fraction = ${a}/${b}<br>Greatest common divisor = ${g}.<br>${a} ÷ ${g} = ${a/g}; ${b} ÷ ${g} = ${b/g}.<br><b>Answer: ${a/g}/${b/g}</b>`}
 m=x.match(/(\d+)\s*\/\s*(\d+)\s*([+\-*/])\s*(\d+)\s*\/\s*(\d+)/);
 if(m){const a=+m[1],b=+m[2],op=m[3],c=+m[4],d=+m[5];let n,den;if(op==='+'){n=a*d+c*b;den=b*d}else if(op==='-'){n=a*d-c*b;den=b*d}else if(op==='*'){n=a*c;den=b*d}else{n=a*d;den=b*c}const g=gcdMath(n,den);return `<b>Step-by-step Maths • Fractions</b><br><br><b>Question:</b> ${a}/${b} ${op} ${c}/${d}<br>${op==='+'||op==='-'?`Use a common denominator: ${b} × ${d} = ${den}.`:''}<br><b>Numerator:</b> ${n}<br><b>Fraction:</b> ${n}/${den}<br><b>Simplify:</b> divide top and bottom by ${g}.<br><b>Answer: ${n/g}/${den/g}</b>`}
 // Linear equation ax+b=c.
 m=x.match(/(?:solve|find)\s+(?:for\s+)?x\s*[:=]?\s*(-?\d+(?:\.\d+)?)\s*x\s*([+-])\s*(\d+(?:\.\d+)?)\s*=\s*(-?\d+(?:\.\d+)?)/i);
 if(m){const a=+m[1],op=m[2],b=+m[3],c=+m[4];if(a===0)return '<b>Equation:</b> This equation has no unique value of x because the coefficient of x is zero.';const rhs=op==='+'?c-b:c+b,r=rhs/a;return `<b>Step-by-step Maths • Linear Equation</b><br><br><b>Equation:</b> ${a}x ${op} ${b} = ${c}<br><b>Step 1:</b> ${op==='+'?`Subtract ${b} from both sides.`:`Add ${b} to both sides.`}<br><b>Step 2:</b> ${a}x = ${mathFormat(rhs)}<br><b>Step 3:</b> Divide both sides by ${a}.<br><b>Answer: x = ${mathFormat(r)}</b><br><b>Check:</b> Substitute x = ${mathFormat(r)} into the original equation.`}
 // Simple x-only equations such as 3x=12.
 m=x.match(/(?:solve|find)\s+(?:for\s+)?x\s*[:=]?\s*(-?\d+(?:\.\d+)?)\s*x\s*=\s*(-?\d+(?:\.\d+)?)/i);
 if(m){const a=+m[1],c=+m[2],r=c/a;return `<b>Step-by-step Maths • Equation</b><br><br>${a}x = ${c}<br>Divide both sides by ${a}.<br><b>Answer: x = ${mathFormat(r)}</b>`}
 // Mean/average.
 m=x.match(/(?:mean|average)\s+(?:of|for)\s+([\d.]+(?:\s*[,+]\s*[\d.]+)+)/i);
 if(m){const nums=m[1].split(/[, +]+/).filter(Boolean).map(Number),sum=nums.reduce((a,b)=>a+b,0),r=sum/nums.length;return `<b>Step-by-step Maths • Mean</b><br><br><b>Values:</b> ${nums.join(', ')}<br><b>Step 1:</b> Add them: ${nums.join(' + ')} = ${mathFormat(sum)}.<br><b>Step 2:</b> Count the values: ${nums.length}.<br><b>Step 3:</b> ${mathFormat(sum)} ÷ ${nums.length} = ${mathFormat(r)}.<br><b>Answer: ${mathFormat(r)}</b>`}
 // Median and mode.
 m=x.match(/median\s+(?:of|for)\s+([\d.]+(?:\s*[, ]\s*[\d.]+)+)/i);
 if(m){const a=m[1].split(/[, ]+/).filter(Boolean).map(Number).sort((a,b)=>a-b),mid=Math.floor(a.length/2),r=a.length%2?a[mid]:(a[mid-1]+a[mid])/2;return `<b>Step-by-step Maths • Median</b><br><br>Arrange the numbers: ${a.join(', ')}.<br>The middle value(s) are ${a.length%2?a[mid]:`${a[mid-1]} and ${a[mid]}`} .<br><b>Answer: ${mathFormat(r)}</b>`}
 m=x.match(/mode\s+(?:of|for)\s+([\d.]+(?:\s*[, ]\s*[\d.]+)+)/i);
 if(m){const a=m[1].split(/[, ]+/).filter(Boolean).map(Number),freq={};a.forEach(v=>freq[v]=(freq[v]||0)+1);const mx=Math.max(...Object.values(freq)),modes=Object.keys(freq).filter(k=>freq[k]===mx);return `<b>Step-by-step Maths • Mode</b><br><br>Count how often each value occurs.<br><b>Answer:</b> ${mx===1?'There is no mode because no value occurs more than once.':modes.join(', ')} (occurs ${mx} times).`}
 // Ratio sharing.
 m=x.match(/(?:divide|share|split)\s+(\d+(?:\.\d+)?)\s+(?:in|into|among)\s+(?:the\s+)?ratio\s+(\d+)\s*[:]\s*(\d+)/i);
 if(m){const total=+m[1],a=+m[2],b=+m[3],parts=a+b,one=total/parts;return `<b>Step-by-step Maths • Ratio</b><br><br>Total = ${total}; ratio = ${a}:${b}.<br><b>Step 1:</b> Total ratio parts = ${a} + ${b} = ${parts}.<br><b>Step 2:</b> One part = ${total} ÷ ${parts} = ${mathFormat(one)}.<br><b>Step 3:</b> First share = ${a} × ${mathFormat(one)} = ${mathFormat(a*one)}; second share = ${b} × ${mathFormat(one)} = ${mathFormat(b*one)}.<br><b>Answer: ${mathFormat(a*one)} and ${mathFormat(b*one)}</b>`}
 // Geometry: rectangle, triangle, circle, perimeter.
 m=x.match(/(?:area|find the area of)\s+(?:a\s+)?rectangle[^0-9]*?(\d+(?:\.\d+)?)\s*(?:m|cm|metres?|centimetres?)?[^0-9]+(\d+(?:\.\d+)?)\s*(?:m|cm|metres?|centimetres?)/i);
 if(m){const a=+m[1],b=+m[2];return `<b>Step-by-step Maths • Area of a Rectangle</b><br><br><b>Formula:</b> A = length × width<br><b>Substitute:</b> ${a} × ${b}<br><b>Calculate:</b> ${mathFormat(a*b)}<br><b>Answer: ${mathFormat(a*b)} square units.</b>`}
 m=x.match(/(?:area of|find the area of)\s+(?:a\s+)?triangle[^0-9]*?(\d+(?:\.\d+)?)\D+(\d+(?:\.\d+)?)/i);
 if(m){const b=+m[1],h=+m[2],r=.5*b*h;return `<b>Step-by-step Maths • Area of a Triangle</b><br><br>A = ½ × base × height<br>= ½ × ${b} × ${h}<br>= <b>${mathFormat(r)}</b> square units.<br><b>Answer: ${mathFormat(r)} square units.</b>`}
 m=x.match(/(?:area of|find the area of)\s+(?:a\s+)?circle[^0-9]*?(\d+(?:\.\d+)?)/i);
 if(m){const r=+m[1],area=Math.PI*r*r;return `<b>Step-by-step Maths • Area of a Circle</b><br><br>A = πr²<br>= π × ${r}²<br>≈ <b>${mathFormat(area)}</b> square units (using π ≈ 3.142).<br><b>Answer: ${mathFormat(Math.PI*r*r)}</b> square units.`}
 m=x.match(/(?:perimeter of|find the perimeter of)\s+(?:a\s+)?rectangle[^0-9]*?(\d+(?:\.\d+)?)\D+(\d+(?:\.\d+)?)/i);
 if(m){const a=+m[1],b=+m[2],r=2*(a+b);return `<b>Step-by-step Maths • Perimeter</b><br><br>P = 2(l + w)<br>= 2(${a} + ${b})<br>= <b>${mathFormat(r)}</b> units.<br><b>Answer: ${mathFormat(r)} units.</b>`}
 // Probability from favourable/total.
 m=x.match(/probability.*?(?:favourable|successful|desired).*?(\d+)\D+(?:total|possible).*?(\d+)/i);
 if(m){const a=+m[1],b=+m[2],g=gcdMath(a,b);return `<b>Step-by-step Maths • Probability</b><br><br>P(event) = favourable outcomes ÷ total outcomes.<br>= ${a}/${b}<br>Simplify by ${g}: ${a/g}/${b/g}.<br><b>Answer: ${mathFormat(a/b)} = ${a/g}/${b/g}</b>`}
 // Speed, distance and time.
 m=x.match(/(?:speed|velocity).*?(?:distance)\s*[=:]?\s*(\d+(?:\.\d+)?)\s*(?:km|m)?[^0-9]+(?:time)\s*[=:]?\s*(\d+(?:\.\d+)?)\s*(?:h|hr|hours?|s|sec|seconds?)/i);
 if(m){const d=+m[1],tm=+m[2],r=d/tm;return `<b>Step-by-step Maths • Speed</b><br><br>Speed = distance ÷ time.<br>= ${d} ÷ ${tm}<br><b>Answer: ${mathFormat(r)} distance-units per time-unit.</b>`}
 // Simple interest.
 m=x.match(/simple\s+interest.*?(?:p(?:rincipal)?|capital)\s*[=:]?\s*(\d+(?:\.\d+)?).*?(?:rate|r)\s*[=:]?\s*(\d+(?:\.\d+)?)\s*%.*?(?:time|t)\s*[=:]?\s*(\d+(?:\.\d+)?)/i);
 if(m){const p=+m[1],r=+m[2],tm=+m[3],si=p*r*tm/100;return `<b>Step-by-step Maths • Simple Interest</b><br><br>I = PRT/100<br>= ${p} × ${r} × ${tm} ÷ 100<br>= <b>${mathFormat(si)}</b><br><b>Answer: ${mathFormat(si)}</b> interest; amount = ${mathFormat(p+si)}.`}
 // Conversion shortcuts.
 m=x.match(/(\d+(?:\.\d+)?)\s*(?:km)\s+(?:to|in)\s*(?:m|metres?)/i);if(m){const n=+m[1];return `<b>Conversion:</b> 1 km = 1000 m.<br>${n} × 1000 = <b>${mathFormat(n*1000)} m</b>.`}
 m=x.match(/(\d+(?:\.\d+)?)\s*(?:m)\s+(?:to|in)\s*(?:cm|centimetres?)/i);if(m){const n=+m[1];return `<b>Conversion:</b> 1 m = 100 cm.<br>${n} × 100 = <b>${mathFormat(n*100)} cm</b>.`}
 // Factorial.
 m=x.match(/(?:factorial|calculate)\s*(\d+)\s*!/i);if(m){let n=+m[1],r=1;for(let k=2;k<=n;k++)r*=k;return `<b>Step-by-step Maths • Factorial</b><br><br>${n}! = ${Array.from({length:n},(_,i)=>i+1).join(' × ')}<br><b>Answer: ${r}</b>`}
 return null;
}
function genericTutorAnswer(q,l,s,t){
 const mathDirect=advancedMathTutor(q,l,s,t); if(mathDirect)return mathDirect;
 const direct=directTutorKnowledge(q,l,s,t); if(direct)return direct;
 const found=findTutorTopic(q,l,s,t), topicObj=found?.topic, subject=found?.subject||s||'General', title=topicObj?.title||t||subject||'this question', rank=levelRank(l);
 if(topicObj){const def=topicDefinition(topicObj),examples=topicObj.examples||[],ex=examples[0]||`Apply ${title} to a real ${subject} situation.`, lower=String(q).toLowerCase();
  if(/\b(what is|what are|define|meaning|who is|explain)\b/.test(lower))return `<b>AI Tutor 7.0 • ${esc(l)}</b><br><br><b>Definition:</b> ${esc(def)}<br><br><b>Detailed explanation:</b><br>${textbookExplanation(topicObj,l,subject)}<br><br><b>Topic-matched example:</b><br>${esc(ex)}`;
  if(/\b(why|importance|important|reason|purpose|benefit)\b/.test(lower))return `<b>AI Tutor 7.0</b><br><br><b>Why ${esc(title)} is important</b><br>${esc(title)} is important because it helps learners understand and apply ideas in ${esc(subject)}. ${rank>=10?'At SHS level, connect the idea to evidence, consequences and unfamiliar situations.':rank>=7?'At JHS level, explain causes, effects and applications.':'At Primary level, connect it to familiar everyday situations.'}<br><br><b>Example:</b> ${esc(ex)}`;
  if(/\b(example|practical|demonstrate|show me)\b/.test(lower))return `<b>Practical example — ${esc(title)}</b><br><br>${esc(ex)}<br><br><b>Now apply it:</b> Try a similar situation and explain why your answer fits the topic.`;
  if(/\b(translate|translation)\b/.test(lower)&&languageSubject(subject))return `<b>Translation help</b><br><br>${examples.slice(0,5).map(x=>esc(x)).join('<br>')||'Send the exact sentence or word you want translated.'}<br><br>Send the exact sentence and I will explain its meaning and grammar at ${esc(l)} level.`;
  return `<b>AI Tutor 7.0 • ${esc(l)} • ${esc(subject)}</b><br><br><b>Your question:</b> ${esc(q)}<br><br><b>Answer:</b> ${esc(def)}<br><br><b>How to apply it:</b> Start from the definition, identify the relevant feature or rule, apply it to the facts in the question, and check the result.<br><br><b>Topic example:</b> ${esc(ex)}`;
 }
 const math=tutorDirectMath(q); if(math&&isMath(s))return math;
 return `<b>AI Tutor 7.0</b><br><br><b>Answering your question:</b> ${esc(q)}<br><br>I can answer school questions even when no topic is selected. I will identify the concept, explain the answer directly, show the reasoning or calculation, give a practical example and match the explanation to ${esc(l)}.`;
}
function renderTutorProfile(){
 const u=state.user||getUser(); if(!u)return;
 const mastery=u.mastery||{}; const vals=Object.values(mastery).map(x=>Number(x?.score??x)).filter(Number.isFinite);
 const avg=vals.length?Math.round(vals.reduce((a,b)=>a+b,0)/vals.length):0;
 const attempts=(u.quizScoreCount||u.scoreCount||0)+(u.practiceAttempts||0)+(u.exams||0);
 const streak=Number(u.streak||0);
 const title=avg>=80?'Strong progress — challenge yourself.':avg>=55?'Good progress — target your weak areas.':'Build your foundation with guided practice.';
 const el=id=>document.getElementById(id); if(el('tutorMastery'))el('tutorMastery').textContent=avg+'%'; if(el('tutorStreak'))el('tutorStreak').textContent=streak; if(el('tutorAttempts'))el('tutorAttempts').textContent=attempts; if(el('tutorProgressTitle'))el('tutorProgressTitle').textContent=title; if(el('tutorProgressText'))el('tutorProgressText').textContent=`${u.level||state.level} learner • ${vals.length} tracked topic${vals.length===1?'':'s'} • Tutor will adjust support to your progress.`;
}
function tutorContext(){
 const u=state.user||getUser()||{}; const mastery=u.mastery||{}; const vals=Object.values(mastery).map(x=>Number(x?.score??x)).filter(Number.isFinite); const avg=vals.length?Math.round(vals.reduce((a,b)=>a+b,0)/vals.length):0;
 return {level:$('#tutorLevel')?.value||state.level,subject:$('#tutorSubject')?.value||'',topic:$('#tutorTopic')?.value.trim()||'',masteryAverage:avg,streak:Number(u.streak||0),recentActivity:(u.activity||[]).slice(0,5),mode:state.tutorMode||'adaptive'};
}
function initTutor(){renderTutorProfile();fillClasses($('#tutorLevel'));populateTutorSubjects();$('#tutorLevel').onchange=()=>{state.level=$('#tutorLevel').value;populateTutorSubjects();renderTutorProfile()};$('#tutorModeSelect').onchange=()=>{$('#tutorStatus').textContent='AI Tutor 7.0 • '+$('#tutorModeSelect').selectedOptions[0].textContent.replace(/^\S+\s*/,'')};$('#askTutor').onclick=askTutor;$('#clearTutor').onclick=()=>{$('#tutorQuestion').value='';$('#tutorAnswer').innerHTML='<div class="ai-icon">🤖</div><div><b>Hi! I\'m your Learnova Tutor.</b><p>Ask me anything about your school work.</p></div>'};$$('.tutor-tips button').forEach(b=>b.onclick=()=>{$('#tutorQuestion').value=b.dataset.q||b.textContent;$('#tutorQuestion').focus()});initTeachMode()}
function speakTutorAnswer(){
 const el=$('#tutorAnswer'); if(!el)return;
 const text=el.innerText||el.textContent||''; if(!text.trim())return;
 if(!('speechSynthesis' in window)){alert('Text-to-speech is not supported in this browser.');return}
 window.speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(text.replace(/AI Tutor 6\.0/g,'Learnova AI Tutor')); u.lang='en-GH'; u.rate=.92; u.pitch=1; window.speechSynthesis.speak(u);
}
async function askTutor(){
 const q=$('#tutorQuestion').value.trim(); if(!q){$('#tutorAnswer').innerHTML='<div class="ai-icon">🤖</div><div><b>Ask me a question.</b><p>For example: “What are cells?”</p></div>';return}
 const l=$('#tutorLevel').value||state.level,s=$('#tutorSubject').value||'',t=$('#tutorTopic').value.trim(); state.tutorHistory.push({role:'user',content:q});state.tutorHistory=state.tutorHistory.slice(-12);renderTutorChat();$('#tutorAnswer').innerHTML='<div class="ai-icon">🤖</div><div><b>Thinking…</b><p>Answering your actual question.</p></div>';
 let answer=null;
 // Always solve Maths locally first. This guarantees basic and supported school-maths questions are answered even if the AI endpoint returns a refusal, timeout, or weak response.
 const localMath=advancedMathTutor(q,l,s,t);
 if(localMath) answer=localMath;
 const endpoint=localStorage.getItem('learnova.aiEndpoint')||'/api/tutor';
 if(!answer){try{const res=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question:q,level:l,subject:s,topic:t,history:state.tutorHistory.slice(-12),mode:state.tutorMode||'adaptive',profile:tutorContext(),instructions:'Act as Learnova AI Tutor 7.0. Answer the actual school question. Match the learner level. Prefer guided reasoning, clear definitions, worked examples, misconception checks, and a short check-for-understanding question. For Maths show workings. For languages include translation when requested. Do not invent curriculum facts.'})});const j=await res.json();answer=j.answer||j.content||j.choices?.[0]?.message?.content||null}catch(e){}}
 if(!answer){const direct=directTutorKnowledge(q,l,s,t);if(direct)answer=direct;} if(!answer){const pack=subjectTutorAnswer(q,l,s,t);if(pack)answer=pack;} if(!answer)answer=genericTutorAnswer(q,l,s,t);state.tutorHistory.push({role:'assistant',content:String(answer).replace(/<[^>]+>/g,' ')});state.tutorHistory=state.tutorHistory.slice(-12);renderTutorChat();renderTutorProfile();$('#tutorAnswer').innerHTML='<div class="ai-icon">🤖</div><div>'+answer+'<br><button class="outline speak-answer" type="button">🔊 Read this answer aloud</button></div>'; $('#tutorAnswer').querySelector('.speak-answer')?.addEventListener('click',speakTutorAnswer);
}

// Adaptive Practice 2.0 — final adaptive engine
function practicePopulate(){
 const l=$('#practiceLevel'),sub=$('#practiceSubject'),top=$('#practiceTopic'); if(!l||!sub||!top)return;
 fillClasses(l); l.value=state.level;
 const refreshTopics=()=>{const arr=(curriculum[l.value]||{})[sub.value]||[];top.innerHTML=arr.map((x,i)=>`<option value="${i}">${esc(x.title||x)}</option>`).join('');};
 const refresh=()=>{const level=l.value,arr=curriculum[level]||{};sub.innerHTML=Object.keys(arr).map(x=>`<option>${esc(x)}</option>`).join('');if(state.subject&&arr[state.subject])sub.value=state.subject;refreshTopics()};
 l.onchange=refresh;sub.onchange=refreshTopics;refresh();
}
function practiceDifficultyRank(level, mastery=50, streak=0){
 const base=levelRank(level); let r=base;
 if(mastery<40)r-=2; else if(mastery<60)r-=1; else if(mastery>=85)r+=2; else if(mastery>=70)r+=1;
 if(streak>=3)r+=1; return Math.max(1,Math.min(12,r));
}
function practiceQuestionSet(level,subject,topic,count=10,diffRank=levelRank(level)){
 const source=(topic.questions||[]).map((q,i)=>({...q,_i:i}));
 let generated=[];
 const title=topic.title, def=topicDefinition(topic);
 const templates=diffRank<=3?[`What is ${title}?`,`Which statement best describes ${title}?`,`Which example shows ${title}?`,`Why is ${title} important?`,`How can ${title} be identified?`,`Which feature belongs to ${title}?`,`Where might you use ${title}?`,`What should you remember about ${title}?`,`Which situation relates to ${title}?`,`Which statement about ${title} is true?`]:diffRank<=6?[`Apply ${title} to a familiar situation.`,`How would you use ${title} to solve a problem?`,`Which example correctly applies ${title}?`,`What would happen if a condition related to ${title} changed?`,`Which explanation best supports an answer about ${title}?`,`How can ${title} be compared with a related idea?`,`Which mistake would lead to a wrong use of ${title}?`,`How would you explain ${title} using evidence?`,`Which conclusion follows from ${title}?`,`How can ${title} help solve a real problem?`]:[`Analyse a new situation involving ${title}.`,`Which conclusion is best justified by ${title}?`,`How could ${title} be applied to solve an unfamiliar problem?`,`Which claim about ${title} is best supported?`,`What is the most likely result if a key condition changes?`,`Which explanation distinguishes ${title} from a related concept?`,`How would you evaluate an approach involving ${title}?`,`Which reason best supports the importance of ${title}?`,`How can knowledge of ${title} transfer to a new context?`,`Which response demonstrates mastery of ${title}?`];
 generated=templates.map((q,i)=>({question:`${q} — Practice ${i+1}`,answer:def,hint:`Identify the key idea in ${title}, then apply it to the exact situation in the question.`}));
 let pool=source.concat(generated),seen=JSON.parse(localStorage.getItem('learnova.practiceSeen')||'{}'),key=`${level}|${subject}|${title}`,used=new Set(seen[key]||[]);
 let fresh=pool.filter(q=>!used.has(String(q.question).toLowerCase().trim()));
 if(fresh.length<count) fresh=fresh.concat(pool.filter(q=>!fresh.includes(q)));
 fresh=fresh.slice(0,count);seen[key]=[...(seen[key]||[]),...fresh.map(q=>String(q.question).toLowerCase().trim())].slice(-120);localStorage.setItem('learnova.practiceSeen',JSON.stringify(seen));
 return fresh;
}
function startAdaptivePractice(){
 const l=$('#practiceLevel').value,s=$('#practiceSubject').value,arr=(curriculum[l]||{})[s]||[],i=Number($('#practiceTopic').value),t=arr[i];if(!t)return;
 const u=state.user||getUser()||{},mk=`${l}|${s}|${t.title}`,m=u.mastery?.[mk]?.score??50;
 state.practice={level:l,subject:s,topic:t,index:0,score:0,answered:0,correctStreak:0,wrongStreak:0,mastery:m,difficultyRank:practiceDifficultyRank(l,m,0),questions:practiceQuestionSet(l,s,t,10,practiceDifficultyRank(l,m,0)),results:[]};
 $('#practiceSetup').classList.add('hidden');$('#practiceRun').classList.remove('hidden');renderAdaptivePractice();
}
function renderAdaptivePractice(){
 const p=state.practice,q=p.questions[p.index];if(!q)return finishAdaptivePractice();
 const pct=Math.round((p.index/10)*100),rank=p.difficultyRank;
 const choices=[q.answer,'A related but different idea about '+p.topic.title,'A statement unrelated to '+p.topic.title,'None of the defining ideas apply'];
 $('#practiceRun').innerHTML=`<div class="card"><div class="practice-meta"><span class="badge">${esc(p.level)}</span><span class="badge">${esc(p.subject)}</span><span class="badge">Adaptive ${rank>=10?'Challenge':rank>=7?'Advanced':rank>=4?'Application':'Foundation'}</span><span class="badge">Question ${p.index+1}/10</span></div><div class="practice-progress"><span style="width:${pct}%"></span></div><h2>${esc(q.question)}</h2><p>${p.index<3?'Build accuracy first. Read every condition carefully.':p.index>6?'You are near the end—check your reasoning before answering.':'Show your reasoning and choose the option that fully satisfies the question.'}</p><div class="quiz-options">${choices.map((x,j)=>`<button class="practice-choice" data-pchoice="${j}">${esc(x)}</button>`).join('')}</div><div id="practiceFeedback"></div></div>`;
 $$('#practiceRun [data-pchoice]').forEach(btn=>btn.onclick=()=>answerAdaptivePractice(Number(btn.dataset.pchoice)));
}
function answerAdaptivePractice(choice){
 const p=state.practice,q=p.questions[p.index],correct=choice===0;p.answered++;if(correct){p.score++;p.correctStreak++;p.wrongStreak=0;p.difficultyRank=Math.min(12,p.difficultyRank+(p.correctStreak>=2?1:0));}else{p.wrongStreak++;p.correctStreak=0;p.difficultyRank=Math.max(1,p.difficultyRank-(p.wrongStreak>=2?1:0));}
 p.results.push({question:q.question,answer:q.answer,chosen:choice,correct,difficulty:p.difficultyRank});
 const box=$('#practiceFeedback');box.className='practice-feedback-box '+(correct?'good':'needs');box.innerHTML=correct?`<b>Correct.</b> Your next question will ${p.correctStreak>=2?'increase the challenge if possible.':'keep the current level.'}`:`<b>Review this one.</b><br>Expected answer: ${esc(q.answer)}<br><small>The next question will be adjusted to give you a better chance to strengthen this skill.</small>`;
 $$('#practiceRun [data-pchoice]').forEach(x=>x.disabled=true);const next=document.createElement('div');next.className='practice-actions';next.innerHTML=`<button class="primary" id="nextPractice">${p.index===9?'Finish practice':'Next question →'}</button><button class="outline" id="askPracticeTutor">Ask AI Tutor 7.0</button>`;box.appendChild(next);
 $('#nextPractice').onclick=()=>{p.index++;if(p.index<10){const remaining=p.questions.length-p.index; if(remaining>0)p.questions[p.index]=p.questions[p.index];renderAdaptivePractice()}else finishAdaptivePractice()};
 $('#askPracticeTutor').onclick=()=>{showPage('tutor');$('#tutorLevel').value=p.level;populateTutorSubjects();$('#tutorSubject').value=p.subject;$('#tutorTopic').value=p.topic.title;$('#tutorQuestion').value=`Explain this practice question step by step: ${q.question}`;$('#askTutor').click()};
}
function finishAdaptivePractice(){
 const p=state.practice;if(!p)return;const score=Math.round(p.score*10),u=state.user||getUser();u.mastery=u.mastery||{};const key=`${p.level}|${p.subject}|${p.topic.title}`,old=u.mastery[key]||{attempts:0,correct:0,score:0};old.attempts++;old.correct+=p.score;old.score=Math.round(old.correct/(old.attempts*10)*100);old.level=adaptiveLabel(old.score);u.mastery[key]=old;u.practiceSessions=(u.practiceSessions||0)+1;u.practiceQuestions=(u.practiceQuestions||0)+10;u.activity=u.activity||[];u.activity.unshift({text:`Adaptive practice: ${p.topic.title} — ${p.score}/10`,at:new Date().toLocaleString()});u.activity=u.activity.slice(0,30);saveUser(u);renderUser?.();renderWeakTopics?.();renderRevisionPlan?.();renderReport?.();updateProgress?.();
 $('#practiceRun').innerHTML=`<div class="card"><span class="eyebrow">ADAPTIVE PRACTICE COMPLETE</span><div class="practice-score">${p.score}/10</div><h2>${score>=80?'Excellent progress!':score>=50?'Good progress—keep building!':'Let’s strengthen the foundation.'}</h2><p>Current mastery for <b>${esc(p.topic.title)}</b>: <b>${old.score}%</b> (${esc(old.level||'Developing')}).</p><div class="practice-actions"><button class="primary" id="retryPractice">Try a fresh practice set</button><button class="outline" data-page="tutor">Ask AI Tutor 7.0</button><button class="outline" data-page="learn">Back to lessons</button></div></div>`;
 $('#retryPractice').onclick=()=>{p.index=0;p.score=0;p.answered=0;p.correctStreak=0;p.wrongStreak=0;p.questions=practiceQuestionSet(p.level,p.subject,p.topic,10,practiceDifficultyRank(p.level,old.score,0));renderAdaptivePractice()};
 $$('[data-page]').forEach(x=>x.onclick=()=>showPage(x.dataset.page));
}
(function initAdaptivePractice(){practicePopulate();$('#startPractice')?.addEventListener('click',startAdaptivePractice);$$('[data-page="practice"]').forEach(x=>x.addEventListener('click',practicePopulate));})();

/* FINAL RELIABILITY PATCH — offline startup + Tutor voice reliability */
function setTutorVoiceButton(mode){
 const b=$('#tutorAnswer .speak-answer'); if(!b)return;
 if(mode==='loading'){b.disabled=true;b.textContent='⏳ Loading voice…';}
 else if(mode==='speaking'){b.disabled=false;b.textContent='⏹ Stop reading';}
 else {b.disabled=false;b.textContent='🔊 Read this answer aloud';}
}
function speakTutorAnswer(){
 const el=$('#tutorAnswer'); if(!el)return;
 const text=(el.innerText||el.textContent||'').replace(/Read this answer aloud|Stop reading|Loading voice…/gi,'').trim();
 if(!text)return;
 if(!('speechSynthesis' in window)){alert('Read aloud is not supported in this browser.');return;}
 const b=el.querySelector('.speak-answer');
 if(window.speechSynthesis.speaking){window.speechSynthesis.cancel();setTutorVoiceButton('idle');return;}
 setTutorVoiceButton('loading');
 window.speechSynthesis.cancel();
 const u=new SpeechSynthesisUtterance(text.replace(/AI Tutor 6\.0/g,'Learnova AI Tutor').replace(/AI Tutor 7\.0/g,'Learnova AI Tutor'));
 u.lang='en-GH';u.rate=.92;u.pitch=1;
 u.onstart=()=>setTutorVoiceButton('speaking');
 u.onend=()=>setTutorVoiceButton('idle');
 u.onerror=()=>setTutorVoiceButton('idle');
 setTimeout(()=>{try{window.speechSynthesis.speak(u)}catch(e){setTutorVoiceButton('idle')}},120);
}
function initTeachMode(){
 if($('#teachMe'))$('#teachMe').onclick=()=>{state.teach=!state.teach;$('#tutorMode').style.display=state.teach?'block':'none';$('#tutorMode').innerHTML=state.teach?'🎓 <b>Teach Me mode:</b> I’ll teach one step at a time and wait for your answer.':''};
 if($('#voiceTutor'))$('#voiceTutor').onclick=()=>{
   const b=$('#voiceTutor'),R=window.SpeechRecognition||window.webkitSpeechRecognition;
   if(!R){alert('Voice input is not supported in this browser.');return}
   if(b.dataset.listening==='1')return;
   const x=new R();b.dataset.listening='1';b.textContent='⏳ Listening…';x.lang='en-GH';x.interimResults=true;x.continuous=false;
   x.onresult=e=>{let txt='';for(let i=0;i<e.results.length;i++)txt+=e.results[i][0].transcript;$('#tutorQuestion').value=txt};
   x.onerror=()=>{b.dataset.listening='0';b.textContent='🎙 Speak'};
   x.onend=()=>{b.dataset.listening='0';b.textContent='🎙 Speak';$('#tutorQuestion').focus()};
   try{x.start()}catch(e){b.dataset.listening='0';b.textContent='🎙 Speak'}
 };
}
async function askTutor(){
 const q=$('#tutorQuestion').value.trim();
 if(!q){$('#tutorAnswer').innerHTML='<div class="ai-icon">🤖</div><div><b>Ask me a question.</b><p>Type or use Speak to tell me the exact school question.</p></div>';return}
 const l=$('#tutorLevel').value||state.level,s=$('#tutorSubject').value||'',t=$('#tutorTopic').value.trim();
 state.tutorHistory.push({role:'user',content:q});state.tutorHistory=state.tutorHistory.slice(-12);renderTutorChat();
 $('#tutorAnswer').innerHTML='<div class="ai-icon">🤖</div><div><b>⏳ Thinking…</b><p>Checking the AI Tutor and built-in school knowledge.</p></div>';
 let answer=null;
 try{
   const endpoint=localStorage.getItem('learnova.aiEndpoint')||'/api/tutor';
   const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),12000);
   const res=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},signal:controller.signal,body:JSON.stringify({question:q,level:l,subject:s,topic:t,history:state.tutorHistory.slice(-12),mode:state.tutorMode||'adaptive',profile:tutorContext(),instructions:'Act as Learnova AI Tutor 7.0. Answer the actual school question directly. Match the learner class. Explain step by step, define terms, show Maths workings, use examples, correct misconceptions and ask one short check question. If the question is outside the selected topic, still answer it if it is a safe school question. Do not refuse merely because topic is blank.'})});clearTimeout(timer);const j=await res.json();answer=j.answer||j.content||j.choices?.[0]?.message?.content||null;
 }catch(e){}
 if(!answer){const math=advancedMathTutor(q,l,s,t);if(math)answer=math}
 if(!answer){const direct=directTutorKnowledge(q,l,s,t);if(direct)answer=direct}
 if(!answer){const pack=subjectTutorAnswer(q,l,s,t);if(pack)answer=pack}
 if(!answer)answer=genericTutorAnswer(q,l,s,t)
 state.tutorHistory.push({role:'assistant',content:String(answer).replace(/<[^>]+>/g,' ')});state.tutorHistory=state.tutorHistory.slice(-12);renderTutorChat();renderTutorProfile();
 $('#tutorAnswer').innerHTML='<div class="ai-icon">🤖</div><div>'+answer+'<br><button class="outline speak-answer" type="button">🔊 Read this answer aloud</button></div>';
 $('#tutorAnswer .speak-answer').onclick=speakTutorAnswer;
}
async function askTutor(){
 const q=$('#tutorQuestion').value.trim();
 if(!q){$('#tutorAnswer').innerHTML='<div class="ai-icon">🤖</div><div><b>Ask me a question.</b><p>Type a school question or use Speak.</p></div>';return}
 const l=$('#tutorLevel').value||state.level||'JHS 2',s=$('#tutorSubject').value||'General',t=$('#tutorTopic').value.trim();
 state.tutorHistory.push({role:'user',content:q});state.tutorHistory=state.tutorHistory.slice(-12);renderTutorChat?.();
 $('#tutorAnswer').innerHTML='<div class="ai-icon">🤖</div><div><b>⏳ Thinking…</b><p>Checking Learnova AI and built-in school knowledge.</p></div>';
 let answer=null, lastError='';
 const payload={question:q,level:l,subject:s,topic:t,history:state.tutorHistory.slice(-12),mode:state.tutorMode||'adaptive',profile:tutorContext(),instructions:'Act as Learnova AI Tutor 7.0. Answer the actual school question directly. Match the learner class. Explain step by step, define terms, show Maths workings, use examples, correct misconceptions and ask one short check question. If the question is outside the selected topic but is a safe school question, still answer it.'};
 const endpoint=localStorage.getItem('learnova.aiEndpoint')||'/api/tutor';
 for(let attempt=0;attempt<2&&!answer;attempt++){
   try{
     const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),9000);
     const res=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},signal:controller.signal,body:JSON.stringify(payload)});
     clearTimeout(timer);
     const raw=await res.text();let j={};try{j=raw?JSON.parse(raw):{}}catch{}
     answer=j.answer||j.content||j.choices?.[0]?.message?.content||null;
     if(!res.ok)lastError='AI service returned '+res.status;
   }catch(e){lastError=e?.name==='AbortError'?'AI request timed out':'AI connection unavailable'}
 }
 if(!answer){answer=advancedMathTutor?.(q,l,s,t)||null}
 if(!answer){answer=directTutorKnowledge?.(q,l,s,t)||null}
 if(!answer){answer=subjectTutorAnswer?.(q,l,s,t)||null}
 if(!answer){answer=generalSchoolTutorFallback(q,l,s,t)}
 state.tutorHistory.push({role:'assistant',content:String(answer).replace(/<[^>]+>/g,' ')});state.tutorHistory=state.tutorHistory.slice(-12);
 renderTutorChat?.();renderTutorProfile?.();
 const offline=navigator.onLine===false;
 const note=offline||lastError?`<small style="display:block;margin-top:10px;opacity:.75">${offline?'Offline mode: ':''}Using Learnova built-in learning support.</small>`:'';
 $('#tutorAnswer').innerHTML='<div class="ai-icon">🤖</div><div>'+answer+note+'<br><button class="outline speak-answer" type="button">🔊 Read this answer aloud</button></div>';
 $('#tutorAnswer .speak-answer').onclick=speakTutorAnswer;
}
function generalSchoolTutorFallback(q,l,s,t){
 const x=q.trim(), low=x.toLowerCase();
 if(/^(hi|hello|hey)\b/.test(low))return `<b>AI Tutor 7.0</b><br><br>Hello! I’m ready to help with ${esc(l)} school work. Ask me the exact question and I’ll explain it step by step.`;
 if(/\b(what is|define|meaning of)\b/.test(low)){
   const term=x.replace(/.*?\b(what is|define|meaning of)\b\s*/i,'').replace(/[?!.]+$/,'').trim();
   if(term)return `<b>AI Tutor 7.0 • Definition</b><br><br><b>${esc(term)}</b> is a concept whose meaning depends on its subject and context. I don’t want to invent a definition without enough context.<br><br>Selected subject: <b>${esc(s)}</b>. Tell me the chapter or give one sentence of context and I’ll explain it at your class level.`;
 }
 if(/\b(why|how|explain)\b/.test(low))return `<b>AI Tutor 7.0</b><br><br>Here is how we will solve it: first identify the main idea, then use the information given, explain each step, and finally check the result. Your question is <b>${esc(x)}</b>.<br><br>Give me any numbers, diagram details, or answer choices included in the question so I can work through the exact problem.`;
 return `<b>AI Tutor 7.0 • ${esc(l)} • ${esc(s)}</b><br><br>I can help with this school question: <b>${esc(x)}</b>.<br><br>I’ll use your class level and selected subject, and I can show workings, examples, definitions, or practice questions. If this is a specific exercise, include the full question and any information shown with it so I can solve the exact problem.`;
}
function initTeachMode(){
 if($('#teachMe'))$('#teachMe').onclick=()=>{state.teach=!state.teach;$('#tutorMode').style.display=state.teach?'block':'none';$('#tutorMode').innerHTML=state.teach?'🎓 <b>Teach Me mode:</b> I’ll teach one step at a time and wait for your answer.':''};
 if($('#voiceTutor'))$('#voiceTutor').onclick=()=>{
   const b=$('#voiceTutor'),R=window.SpeechRecognition||window.webkitSpeechRecognition;
   if(!R){alert('Voice input is not supported in this browser.');return}
   if(b.dataset.listening==='1')return;
   const x=new R();b.dataset.listening='1';b.disabled=true;b.textContent='⏳ Listening…';x.lang='en-GH';x.interimResults=true;x.continuous=false;
   x.onresult=e=>{let txt='';for(let i=0;i<e.results.length;i++)txt+=e.results[i][0].transcript;$('#tutorQuestion').value=txt};
   x.onerror=()=>{b.dataset.listening='0';b.disabled=false;b.textContent='🎙 Speak'};
   x.onend=()=>{b.dataset.listening='0';b.disabled=false;b.textContent='🎙 Speak';$('#tutorQuestion').focus()};
   try{x.start()}catch(e){b.dataset.listening='0';b.disabled=false;b.textContent='🎙 Speak'}
 };
}
function installOfflineReliability(){
 const set=()=>document.body.classList.toggle('learnova-offline',navigator.onLine===false);
 set();window.addEventListener('online',set);window.addEventListener('offline',set);
 if('serviceWorker' in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{});
}
installOfflineReliability();

})();
