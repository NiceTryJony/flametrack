"use strict";var ye=Object.create;var P=Object.defineProperty;var xe=Object.getOwnPropertyDescriptor;var we=Object.getOwnPropertyNames;var ke=Object.getPrototypeOf,Se=Object.prototype.hasOwnProperty;var De=(t,e)=>{for(var a in e)P(t,a,{get:e[a],enumerable:!0})},ae=(t,e,a,i)=>{if(e&&typeof e=="object"||typeof e=="function")for(let n of we(e))!Se.call(t,n)&&n!==a&&P(t,n,{get:()=>e[n],enumerable:!(i=xe(e,n))||i.enumerable});return t};var p=(t,e,a)=>(a=t!=null?ye(ke(t)):{},ae(e||!t||!t.__esModule?P(a,"default",{value:t,enumerable:!0}):a,t)),Re=t=>ae(P({},"__esModule",{value:!0}),t);var We={};De(We,{activate:()=>Ne,deactivate:()=>Oe});module.exports=Re(We);var g=p(require("vscode"));var ge=p(require("vscode")),v=p(require("fs")),N=p(require("path"));function ie(t){return{date:t,events:[],linesAdded:0,linesRemoved:0,filesEdited:[],saves:0,keystrokes:0,activeMinutes:0,sessionStart:null,byLang:{},byProject:{},hourlyActivity:new Array(24).fill(0)}}function m(t){return t.totalLinesAdded}function I(t){return t.totalLinesRemoved}function x(t){return t.totalActiveMinutes}function E(t){return t.totalSaves}function z(t){return t.totalXp}function h(t){return t.bestStreak}function w(t){return Object.keys(t.activity).length}function k(t){return Object.values(t.activity).reduce((e,a)=>e+(a.events?.length??0),0)}function T(t){return Object.values(t.activity).reduce((e,a)=>e+(a.events?.filter(i=>i.kind==="git").length??0),0)}function $(t){let e=new Set;return Object.values(t.activity).forEach(a=>(a.filesEdited??[]).forEach(i=>e.add(i))),e.size}function H(t){return Math.max(0,...Object.values(t.activity).map(e=>e.linesAdded))}function L(t){return Math.max(0,...Object.values(t.activity).map(e=>e.activeMinutes))}function V(t){return Math.max(0,...Object.values(t.activity).map(e=>{let a=e.hourlyActivity??[];return(a[22]??0)+(a[23]??0)+(a[0]??0)+(a[1]??0)+(a[2]??0)+(a[3]??0)}))}function re(t){return Math.max(0,...Object.values(t.activity).map(e=>{let a=e.hourlyActivity??[];return(a[5]??0)+(a[6]??0)+(a[7]??0)}))}function Ae(t){return Math.max(0,...Object.values(t.activity).map(e=>{let a=e.hourlyActivity??[];return(a[12]??0)+(a[13]??0)}))}function Te(t){let e=new Date(t+"T00:00:00Z").getUTCDay();return e===0||e===6}function C(t){return Object.entries(t.activity).filter(([e,a])=>Te(e)&&(a.linesAdded>0||a.activeMinutes>0||(a.events?.length??0)>0)).length}function ne(t){return Object.values(t.activity).filter(e=>e.linesRemoved>0&&e.linesRemoved>e.linesAdded).length}function K(t){return Math.max(0,...Object.values(t.activity).map(e=>(e.filesEdited??[]).length))}function Y(t){let e={};return Object.values(t.activity).forEach(a=>{Object.entries(a.byLang??{}).forEach(([i,n])=>{e[i]=(e[i]??0)+n.linesAdded})}),Math.max(0,...Object.values(e))}function Z(t){let e={};return Object.values(t.activity).forEach(a=>{Object.entries(a.byLang??{}).forEach(([i,n])=>{e[i]=(e[i]??0)+n.linesAdded})}),Object.values(e).filter(a=>a>=100).length}function j(t){let e=Object.keys(t.activity);if(e.length===0)return 0;let a=[...e].sort((s,c)=>s.localeCompare(c)),i=0,n=new Date(a[0]+"T00:00:00Z");n.setUTCDate(n.getUTCDate()-n.getUTCDay());let o=new Date;for(;n<=o;){let s=new Date(n);s.setUTCDate(s.getUTCDate()+6),a.some(R=>{let A=new Date(R+"T00:00:00Z");return A>=n&&A<=s})&&i++,n.setUTCDate(n.getUTCDate()+7)}return i}function r(t){return{id:t.id,name:t.name,description:t.description,icon:t.icon,category:t.category,xpReward:t.xpReward,check:e=>t.metric(e)>=t.target,progress:e=>({current:Math.min(t.metric(e),t.target),target:t.target})}}var S=[r({id:"streak_3",name:"Hat Trick",description:"3-day coding streak",icon:"\u{1F3A9}",category:"streak",xpReward:30,metric:h,target:3}),r({id:"streak_7",name:"Week Warrior",description:"7-day coding streak",icon:"\u{1F525}",category:"streak",xpReward:100,metric:h,target:7}),r({id:"streak_14",name:"Two Weeks",description:"14-day coding streak",icon:"\u{1F4AA}",category:"streak",xpReward:250,metric:h,target:14}),r({id:"streak_30",name:"Monthly Grind",description:"30-day coding streak",icon:"\u{1F4C5}",category:"streak",xpReward:600,metric:h,target:30}),r({id:"streak_60",name:"Iron Coder",description:"60-day coding streak",icon:"\u2699\uFE0F",category:"streak",xpReward:1200,metric:h,target:60}),r({id:"streak_100",name:"Century",description:"100-day coding streak",icon:"\u{1F4AF}",category:"streak",xpReward:2500,metric:h,target:100}),r({id:"streak_200",name:"Unstoppable",description:"200-day coding streak",icon:"\u{1F30A}",category:"streak",xpReward:5e3,metric:h,target:200}),r({id:"streak_365",name:"Full Revolution",description:"365-day coding streak. Legendary.",icon:"\u{1F30D}",category:"streak",xpReward:1e4,metric:h,target:365}),r({id:"lines_100",name:"First Steps",description:"Write 100 lines of code",icon:"\u{1F476}",category:"code",xpReward:10,metric:m,target:100}),r({id:"lines_1k",name:"Getting There",description:"Write 1,000 lines of code",icon:"\u{1F6B6}",category:"code",xpReward:50,metric:m,target:1e3}),r({id:"lines_5k",name:"Codesmith",description:"Write 5,000 lines of code",icon:"\u{1F528}",category:"code",xpReward:150,metric:m,target:5e3}),r({id:"lines_10k",name:"Ten Thousand",description:"Write 10,000 lines of code",icon:"\u{1F4DD}",category:"code",xpReward:300,metric:m,target:1e4}),r({id:"lines_25k",name:"Quarter Million",description:"Write 25,000 lines of code",icon:"\u{1F4DA}",category:"code",xpReward:600,metric:m,target:25e3}),r({id:"lines_50k",name:"Half Centurion",description:"Write 50,000 lines of code",icon:"\u2694\uFE0F",category:"code",xpReward:1200,metric:m,target:5e4}),r({id:"lines_100k",name:"Six Figures",description:"Write 100,000 lines of code",icon:"\u{1F4B0}",category:"code",xpReward:2500,metric:m,target:1e5}),r({id:"lines_500k",name:"Half a Million",description:"Write 500,000 lines of code",icon:"\u{1F3DB}\uFE0F",category:"code",xpReward:7500,metric:m,target:5e5}),r({id:"lines_1m",name:"The Million",description:"Write 1,000,000 lines of code",icon:"\u{1F30B}",category:"code",xpReward:2e4,metric:m,target:1e6}),r({id:"rm_500",name:"Cleanup Crew",description:"Delete 500 lines",icon:"\u{1F9F9}",category:"code",xpReward:50,metric:I,target:500}),r({id:"rm_5k",name:"The Eraser",description:"Delete 5,000 lines",icon:"\u{1F5D1}\uFE0F",category:"code",xpReward:200,metric:I,target:5e3}),r({id:"rm_25k",name:"Great Purge",description:"Delete 25,000 lines",icon:"\u{1F525}",category:"code",xpReward:600,metric:I,target:25e3}),r({id:"rm_100k",name:"Nuclear Option",description:"Delete 100,000 lines",icon:"\u{1F4A5}",category:"code",xpReward:2e3,metric:I,target:1e5}),r({id:"refactor_days_5",name:"Refactor Fan",description:"5 days where you deleted more than you wrote",icon:"\u267B\uFE0F",category:"code",xpReward:150,metric:ne,target:5}),r({id:"refactor_days_20",name:"Less Is More",description:"20 refactor-heavy days",icon:"\u2702\uFE0F",category:"code",xpReward:500,metric:ne,target:20}),r({id:"files_10",name:"Multi-Tasker",description:"Edit 10 different files",icon:"\u{1F4C1}",category:"code",xpReward:20,metric:$,target:10}),r({id:"files_50",name:"File Juggler",description:"Edit 50 different files",icon:"\u{1F939}",category:"code",xpReward:80,metric:$,target:50}),r({id:"files_200",name:"File Collector",description:"Edit 200 different files",icon:"\u{1F5C2}\uFE0F",category:"code",xpReward:250,metric:$,target:200}),r({id:"files_1000",name:"Repository Overlord",description:"Edit 1,000 different files",icon:"\u{1F3F0}",category:"code",xpReward:1500,metric:$,target:1e3}),r({id:"big_day_100",name:"Productive Day",description:"Write 100+ lines in a single day",icon:"\u26A1",category:"code",xpReward:40,metric:H,target:100}),r({id:"big_day_500",name:"Code Tsunami",description:"Write 500+ lines in a single day",icon:"\u{1F30A}",category:"code",xpReward:200,metric:H,target:500}),r({id:"big_day_1000",name:"Code Tornado",description:"Write 1,000+ lines in a single day",icon:"\u{1F300}",category:"code",xpReward:500,metric:H,target:1e3}),r({id:"big_day_2000",name:"Volcanic Output",description:"Write 2,000+ lines in a single day",icon:"\u{1F30B}",category:"code",xpReward:1200,metric:H,target:2e3}),r({id:"one_lang_1k",name:"Language Focus",description:"Write 1,000 lines in a single language",icon:"\u{1F3AF}",category:"code",xpReward:100,metric:Y,target:1e3}),r({id:"one_lang_10k",name:"Language Expert",description:"Write 10,000 lines in a single language",icon:"\u{1F393}",category:"code",xpReward:400,metric:Y,target:1e4}),r({id:"one_lang_50k",name:"Language Master",description:"Write 50,000 lines in one language",icon:"\u{1F3C5}",category:"code",xpReward:1500,metric:Y,target:5e4}),r({id:"polyglot_2",name:"Bilingual",description:"Write 100+ lines in 2 languages",icon:"\u{1F5E3}\uFE0F",category:"code",xpReward:80,metric:Z,target:2}),r({id:"polyglot_4",name:"Polyglot",description:"Write 100+ lines in 4 languages",icon:"\u{1F310}",category:"code",xpReward:250,metric:Z,target:4}),r({id:"polyglot_7",name:"Linguistic God",description:"Write 100+ lines in 7 languages",icon:"\u{1F9E0}",category:"code",xpReward:800,metric:Z,target:7}),r({id:"time_1h",name:"In the Zone",description:"Accumulate 1 hour of active coding",icon:"\u23F1\uFE0F",category:"time",xpReward:30,metric:x,target:60}),r({id:"time_10h",name:"Dedicated",description:"10 hours of active coding",icon:"\u{1F550}",category:"time",xpReward:150,metric:x,target:600}),r({id:"time_50h",name:"Committed",description:"50 hours of active coding",icon:"\u{1F4CC}",category:"time",xpReward:400,metric:x,target:3e3}),r({id:"time_100h",name:"Century Hours",description:"100 hours of active coding",icon:"\u231B",category:"time",xpReward:800,metric:x,target:6e3}),r({id:"time_300h",name:"Marathon Coder",description:"300 hours of active coding",icon:"\u{1F3C3}",category:"time",xpReward:2e3,metric:x,target:18e3}),r({id:"time_1000h",name:"Thousand Hours",description:"1,000 hours. Gladwell approves.",icon:"\u{1F3C5}",category:"time",xpReward:5e3,metric:x,target:6e4}),r({id:"time_5000h",name:"Five Thousand",description:"5,000 hours \u2014 this is your life now.",icon:"\u{1F30C}",category:"time",xpReward:15e3,metric:x,target:3e5}),r({id:"focus_1h",name:"Focused Hour",description:"1 hour of active coding in a single day",icon:"\u{1F3AF}",category:"habit",xpReward:30,metric:L,target:60}),r({id:"focus_4h",name:"Deep Work",description:"4 hours of active coding in a single day",icon:"\u{1F9E0}",category:"habit",xpReward:150,metric:L,target:240}),r({id:"focus_6h",name:"Flow State",description:"6 hours of active coding in a single day",icon:"\u{1F52E}",category:"habit",xpReward:280,metric:L,target:360}),r({id:"focus_8h",name:"Crunch Mode",description:"8 hours of active coding in a single day",icon:"\u{1F480}",category:"habit",xpReward:400,metric:L,target:480}),r({id:"focus_12h",name:"No Life",description:"12+ hours in a single day. Please sleep.",icon:"\u2620\uFE0F",category:"habit",xpReward:800,metric:L,target:720}),r({id:"files_day_10",name:"Spread Thin",description:"Edit 10+ files in a single day",icon:"\u{1F5C3}\uFE0F",category:"habit",xpReward:60,metric:K,target:10}),r({id:"files_day_25",name:"Multithreaded",description:"Edit 25+ files in a single day",icon:"\u{1F500}",category:"habit",xpReward:180,metric:K,target:25}),r({id:"files_day_50",name:"Context Switch Champion",description:"Edit 50+ files in a single day",icon:"\u26A1",category:"habit",xpReward:400,metric:K,target:50}),r({id:"night_owl",name:"Night Owl",description:"30+ lines between 22:00\u201304:00 in a day",icon:"\u{1F989}",category:"habit",xpReward:80,metric:V,target:30}),r({id:"night_owl_pro",name:"Vampire Coder",description:"150+ lines between 22:00\u201304:00 in a day",icon:"\u{1F9DB}",category:"habit",xpReward:300,metric:V,target:150}),r({id:"night_owl_god",name:"Insomniac Dev",description:"500+ lines between 22:00\u201304:00 in a day",icon:"\u{1F311}",category:"habit",xpReward:800,metric:V,target:500}),r({id:"early_bird",name:"Early Bird",description:"30+ lines between 05:00\u201308:00 in a day",icon:"\u{1F426}",category:"habit",xpReward:80,metric:re,target:30}),r({id:"early_bird_pro",name:"Sunrise Sprinter",description:"150+ lines between 05:00\u201308:00 in a day",icon:"\u{1F305}",category:"habit",xpReward:300,metric:re,target:150}),r({id:"lunch_coder",name:"Lunch Break Hero",description:"100+ lines between 12:00\u201314:00 in a day",icon:"\u{1F96A}",category:"habit",xpReward:100,metric:Ae,target:100}),r({id:"weekend_1",name:"Weekend Hobbyist",description:"Code on a Saturday or Sunday",icon:"\u{1F3AE}",category:"habit",xpReward:30,metric:C,target:1}),r({id:"weekend_5",name:"Weekend Regular",description:"Code on 5 different weekend days",icon:"\u{1F3B2}",category:"habit",xpReward:120,metric:C,target:5}),r({id:"weekend_10",name:"Weekend Warrior",description:"Code on 10 different weekend days",icon:"\u2694\uFE0F",category:"habit",xpReward:250,metric:C,target:10}),r({id:"weekend_30",name:"What Is Rest",description:"Code on 30 different weekend days",icon:"\u{1F624}",category:"habit",xpReward:600,metric:C,target:30}),r({id:"weekend_50",name:"No Days Off",description:"Code on 50 different weekend days",icon:"\u{1F6AB}",category:"habit",xpReward:1e3,metric:C,target:50}),r({id:"weeks_4",name:"Monthly Habit",description:"Code in 4 different calendar weeks",icon:"\u{1F5D3}\uFE0F",category:"habit",xpReward:120,metric:j,target:4}),r({id:"weeks_12",name:"Quarterly Grind",description:"Code in 12 different calendar weeks",icon:"\u{1F4C6}",category:"habit",xpReward:400,metric:j,target:12}),r({id:"weeks_26",name:"Half Year",description:"Code in 26 different calendar weeks",icon:"\u{1F313}",category:"habit",xpReward:1e3,metric:j,target:26}),r({id:"weeks_52",name:"Full Year Habit",description:"Code in 52 different calendar weeks",icon:"\u{1F315}",category:"habit",xpReward:3e3,metric:j,target:52}),r({id:"first_build",name:"First Blood",description:"Log your first successful build or test",icon:"\u{1F680}",category:"build",xpReward:25,metric:k,target:1}),r({id:"builds_10",name:"Ship It",description:"Log 10 successful terminal events",icon:"\u{1F4E6}",category:"build",xpReward:100,metric:k,target:10}),r({id:"builds_50",name:"Build Bunny",description:"50 successful builds/tests",icon:"\u{1F407}",category:"build",xpReward:300,metric:k,target:50}),r({id:"builds_100",name:"CI Machine",description:"100 successful builds/tests",icon:"\u{1F916}",category:"build",xpReward:500,metric:k,target:100}),r({id:"builds_500",name:"Pipeline Pro",description:"500 successful builds/tests",icon:"\u{1F3ED}",category:"build",xpReward:1500,metric:k,target:500}),r({id:"builds_1000",name:"CI/CD Deity",description:"1,000 successful builds/tests",icon:"\u{1F451}",category:"build",xpReward:4e3,metric:k,target:1e3}),r({id:"builds_5000",name:"Infinite Loop",description:"5,000 successful builds/tests",icon:"\u267E\uFE0F",category:"build",xpReward:1e4,metric:k,target:5e3}),r({id:"git_push",name:"Shipped to Prod",description:"Do your first git push",icon:"\u{1F4E4}",category:"build",xpReward:50,metric:T,target:1}),r({id:"git_10",name:"Git Wizard",description:"10 git pushes",icon:"\u{1F9D9}",category:"build",xpReward:200,metric:T,target:10}),r({id:"git_50",name:"Commit Machine",description:"50 git pushes",icon:"\u2699\uFE0F",category:"build",xpReward:600,metric:T,target:50}),r({id:"git_100",name:"Push Master",description:"100 git pushes",icon:"\u{1F393}",category:"build",xpReward:1500,metric:T,target:100}),r({id:"git_365",name:"Push Every Day",description:"365 git pushes",icon:"\u{1F30D}",category:"build",xpReward:5e3,metric:T,target:365}),r({id:"git_1000",name:"Git Legend",description:"1,000 git pushes",icon:"\u{1F48E}",category:"build",xpReward:12e3,metric:T,target:1e3}),r({id:"active_days_1",name:"Day One",description:"Your first recorded day",icon:"\u{1F331}",category:"special",xpReward:10,metric:w,target:1}),r({id:"active_days_7",name:"Week Regular",description:"Code on 7 different days",icon:"\u{1F5D3}\uFE0F",category:"special",xpReward:100,metric:w,target:7}),r({id:"active_days_30",name:"Monthly Regular",description:"Code on 30 different days",icon:"\u{1F4C6}",category:"special",xpReward:400,metric:w,target:30}),r({id:"active_days_60",name:"Two Months Strong",description:"Code on 60 different days",icon:"\u{1F4AA}",category:"special",xpReward:800,metric:w,target:60}),r({id:"active_days_100",name:"Triple Digits",description:"Code on 100 different days",icon:"\u{1F522}",category:"special",xpReward:1500,metric:w,target:100}),r({id:"active_days_200",name:"Bicentennial",description:"Code on 200 different days",icon:"\u{1F3DB}\uFE0F",category:"special",xpReward:3e3,metric:w,target:200}),r({id:"active_days_365",name:"Full Year",description:"Code on 365 different days",icon:"\u{1F386}",category:"special",xpReward:6e3,metric:w,target:365}),r({id:"saves_10",name:"First Saves",description:"Save 10 times",icon:"\u{1F4BE}",category:"special",xpReward:10,metric:E,target:10}),r({id:"saves_100",name:"Ctrl+S Addict",description:"Save 100 times \u2014 we see you",icon:"\u{1F4BE}",category:"special",xpReward:60,metric:E,target:100}),r({id:"saves_1000",name:"Panic Saver",description:"1,000 saves. Your Ctrl key needs a rest.",icon:"\u{1F631}",category:"special",xpReward:200,metric:E,target:1e3}),r({id:"saves_10000",name:"Save Legend",description:"10,000 saves. Truly one with the keyboard.",icon:"\u{1F3C6}",category:"special",xpReward:800,metric:E,target:1e4}),r({id:"saves_100000",name:"The Ctrl+S God",description:"100,000 saves. Seeking medical help is ok.",icon:"\u2328\uFE0F",category:"special",xpReward:3e3,metric:E,target:1e5}),r({id:"xp_500",name:"Getting Warmed Up",description:"Earn 500 total XP",icon:"\u{1F525}",category:"special",xpReward:50,metric:z,target:500}),r({id:"xp_5000",name:"XP Hoarder",description:"Earn 5,000 total XP",icon:"\u{1F4B0}",category:"special",xpReward:250,metric:z,target:5e3}),r({id:"xp_25000",name:"XP Tycoon",description:"Earn 25,000 total XP",icon:"\u{1F48E}",category:"special",xpReward:1e3,metric:z,target:25e3}),r({id:"xp_100000",name:"XP Millionaire",description:"Earn 100,000 total XP",icon:"\u{1F451}",category:"special",xpReward:5e3,metric:z,target:1e5})],Ge=new Map(S.map(t=>[t.id,t]));function Q(t){let e=new Set(t.unlockedAchievements),a=[];for(let i of S)e.has(i.id)||i.check(t)&&(t.unlockedAchievements.push(i.id),t.achievementDates[i.id]=new Date().toISOString().slice(0,10),t.totalXp+=i.xpReward,e.add(i.id),a.push({id:i.id,name:i.name,icon:i.icon,xpReward:i.xpReward}));return a}function se(t){let e=new Set(t.unlockedAchievements);return S.map(a=>{let i=e.has(a.id),n=a.progress?a.progress(t):{current:i?1:0,target:1},o=Math.max(n.target,1),s=i?100:Math.min(100,Math.max(0,Math.round(n.current/o*100)));return{id:a.id,name:a.name,description:a.description,icon:a.icon,category:a.category,xpReward:a.xpReward,unlocked:i,unlockedDate:t.achievementDates[a.id],current:n.current,target:n.target,pct:s}})}function Me(t){let e=0;for(let i of Object.values(t.activity))e+=Math.floor(i.linesAdded/10),e+=Math.floor(i.linesRemoved/20),e+=i.activeMinutes,e+=Math.floor(i.saves/5),e+=i.events.length*10;let a=new Map(S.map(i=>[i.id,i.xpReward]));for(let i of t.unlockedAchievements)e+=a.get(i)??0;return Math.max(0,e)}function oe(t){let e=Me(t);return t.totalXp=e,e}function de(t){return Math.floor(t.linesAdded/10)+Math.floor(t.linesRemoved/20)+t.activeMinutesDelta}function ce(){return 10}var le="flametrack.data.v2",_e=3e3;function D(t=new Date){return t.toISOString().slice(0,10)}function Ee(){return{version:2,activity:{},bestStreak:0,currentStreak:0,lastActiveDate:null,totalLinesAdded:0,totalLinesRemoved:0,totalSaves:0,totalActiveMinutes:0,totalXp:0,unlockedAchievements:[],achievementDates:{}}}function pe(t){let e=t.totalXp===void 0;t.totalXp===void 0&&(t.totalXp=0),t.unlockedAchievements||(t.unlockedAchievements=[]),t.achievementDates||(t.achievementDates={});for(let a of Object.values(t.activity))a.hourlyActivity||(a.hourlyActivity=new Array(24).fill(0));return e&&(Q(t),oe(t)),t}var B=class{constructor(e){this.ctx=e;this.saveTimer=null;this.achievementCallbacks=[];let a=e.globalStorageUri.fsPath;v.existsSync(a)||v.mkdirSync(a,{recursive:!0}),this.jsonPath=N.join(a,"flametrack-v2.json"),this.data=this.load()}getData(){return this.data}onAchievementUnlock(e){this.achievementCallbacks.push(e)}ensureDay(e){return this.data.activity[e]||(this.data.activity[e]=ie(e)),this.data.activity[e].hourlyActivity||(this.data.activity[e].hourlyActivity=new Array(24).fill(0)),this.data.activity[e]}recordEdit(e){let a=D(),i=this.ensureDay(a);i.linesAdded+=e.linesAdded,i.linesRemoved+=e.linesRemoved,i.keystrokes+=e.chars,i.activeMinutes+=e.activeMinutesDelta,i.sessionStart===null&&(i.sessionStart=Date.now());let n=new Date().getHours();i.hourlyActivity[n]=(i.hourlyActivity[n]??0)+e.linesAdded;let o=N.basename(e.fileName);i.filesEdited.includes(o)||i.filesEdited.push(o),i.byLang[e.lang]||(i.byLang[e.lang]={linesAdded:0,linesRemoved:0,filesEdited:0}),i.byLang[e.lang].linesAdded+=e.linesAdded,i.byLang[e.lang].linesRemoved+=e.linesRemoved,i.byLang[e.lang].filesEdited++,i.byProject[e.workspace]||(i.byProject[e.workspace]={name:e.workspace,linesAdded:0,linesRemoved:0,activeMinutes:0}),i.byProject[e.workspace].linesAdded+=e.linesAdded,i.byProject[e.workspace].linesRemoved+=e.linesRemoved,i.byProject[e.workspace].activeMinutes+=e.activeMinutesDelta,this.data.totalLinesAdded+=e.linesAdded,this.data.totalLinesRemoved+=e.linesRemoved,this.data.totalActiveMinutes+=e.activeMinutesDelta;let s=de(e);this.data.totalXp+=s,this.recalcStreak(a),this.fireAchievements(),this.scheduleSave()}recordSave(){let e=D(),a=this.ensureDay(e);a.saves++,this.data.totalSaves++,this.data.totalSaves%5===0&&(this.data.totalXp+=1),this.scheduleSave()}recordSuccess(e){let a=D(),i=!this.data.activity[a]?.events?.length;return this.ensureDay(a).events.push(e),this.data.totalXp+=ce(),this.recalcStreak(a),this.fireAchievements(),this.scheduleSave(),i}recalcStreak(e=D()){let a=this.data.activity[e],i=this.getStreakSettings();if(J(a,i)&&this.data.lastActiveDate!==e){if(!this.data.lastActiveDate)this.data.currentStreak=1;else{let n=me(this.data.lastActiveDate,e);n===1||n>1&&ve(this.data.lastActiveDate,e,i)?this.data.currentStreak+=1:this.data.currentStreak=1}this.data.currentStreak>this.data.bestStreak&&(this.data.bestStreak=this.data.currentStreak),this.data.lastActiveDate=e}}checkStreakIntegrity(){if(!this.data.lastActiveDate)return;let e=D();if(this.data.lastActiveDate===e||me(this.data.lastActiveDate,e)<=1)return;let i=this.getStreakSettings();ve(this.data.lastActiveDate,e,i)||(this.data.currentStreak=0)}getStreakSettings(){let e=ge.workspace.getConfiguration("flametrack");return{minActiveMinutes:e.get("streak.minActiveMinutes",5),minLinesAdded:e.get("streak.minLinesAdded",10),weekendFreeze:e.get("streak.weekendFreeze",!0)}}fireAchievements(){let e=Q(this.data);e.length>0&&this.achievementCallbacks.forEach(a=>a(e))}exportMarkdown(){let{currentStreak:e,bestStreak:a,activity:i,totalLinesAdded:n,totalLinesRemoved:o,totalActiveMinutes:s,totalXp:c,unlockedAchievements:R}=this.data,A=Object.keys(i).length,X=Math.round(s/60),u=["# \u{1F525} FlameTrack Stats","","| Metric | Value |","|--------|-------|",`| Current streak | ${e} days |`,`| Best streak | ${a} days |`,`| Active days | ${A} |`,`| Lines added | ${F(n)} |`,`| Lines removed | ${F(o)} |`,`| Active time | ${X}h |`,`| Total XP | ${F(c)} |`,`| Achievements | ${R.length} / ${S.length} |`,"","## Activity Log",""],G=Object.keys(i).sort().reverse();for(let ee of G.slice(0,90)){let _=i[ee],te=Object.keys(_.byLang).join(", ");u.push(`### ${ee}  +${F(_.linesAdded)} / -${F(_.linesRemoved)} lines  \u23F1 ${_.activeMinutes}min`),te&&u.push(`> ${te}`);for(let q of _.events){let be=q.kind==="git"?"\u{1F4E4}":q.kind==="manual"?"\u270B":"\u2705";u.push(`- ${be} \`${q.label}\``)}u.push("")}return u.join(`
`)}load(){try{if(v.existsSync(this.jsonPath)){let a=JSON.parse(v.readFileSync(this.jsonPath,"utf8"));if(a?.version===2)return pe(a)}}catch{}let e=this.ctx.globalState.get(le);return e?.version===2?pe(e):Ee()}scheduleSave(){this.saveTimer&&clearTimeout(this.saveTimer),this.saveTimer=setTimeout(()=>this.flush(),_e)}flush(){this.saveTimer&&(clearTimeout(this.saveTimer),this.saveTimer=null);try{v.writeFileSync(this.jsonPath,JSON.stringify(this.data),"utf8")}catch{}this.ctx.globalState.update(le,this.data)}};function me(t,e){return Math.round((new Date(e).getTime()-new Date(t).getTime())/864e5)}function F(t){return t>=1e3?(t/1e3).toFixed(1)+"k":String(t)}function J(t,e){return t?t.events.length>0||t.activeMinutes>=e.minActiveMinutes||t.linesAdded>=e.minLinesAdded:!1}function Le(t){let e=new Date(t+"T00:00:00Z").getUTCDay();return e===0||e===6}function Ce(t,e){let a=[],i=new Date(t+"T00:00:00Z"),n=new Date(e+"T00:00:00Z");for(i.setUTCDate(i.getUTCDate()+1);i<n;)a.push(i.toISOString().slice(0,10)),i.setUTCDate(i.getUTCDate()+1);return a}function ve(t,e,a){if(!a.weekendFreeze)return!1;let i=Ce(t,e);return i.length>0&&i.every(Le)}var f=p(require("vscode")),Fe=[/\bnpm\s+(run|start|test|build)\b/,/\bpnpm\s+(run|start|test|build)\b/,/\byarn\s+(start|test|build)\b/,/\bbun\s+(run|test|build)\b/,/\bcargo\s+(build|test|run|check|clippy)\b/,/\bgo\s+(build|test|run|vet)\b/,/\bpython\b.*\.py\b/,/\bpytest\b/,/\buvicorn\b/,/\bflask\b/,/\bdjango.*runserver\b/,/\bcmake\s+--build\b/,/\bmake\b(?!\s*install)/,/\bmvn\s+(test|package|install|compile)\b/,/\bgradle\s+(test|build|assemble)\b/,/\bdotnet\s+(build|test|run|publish)\b/,/\bdocker\s+build\b/,/\bdocker\s+compose\s+up\b/,/\bgit\s+push\b/,/\bgit\s+commit\b/,/\bnpm\s+publish\b/,/\bvercel\b/,/\bfly\s+deploy\b/,/\bgcloud\s+deploy\b/,/\baws\b.*deploy/,/\bjest\b/,/\bvitest\b/,/\bmocha\b/,/\bcypress\b.*run\b/,/\bplaywright\s+test\b/,/\bbundle\s+exec\b/,/\brspec\b/,/\brails\s+(test|server)\b/,/\bphp\s+artisan\b/,/\bcomposer\b/,/\bswift\s+(build|test|run)\b/,/\bxcodebuild\b/];function Pe(t){return Fe.some(e=>e.test(t))}function Ie(t){if(/\bcargo\b/.test(t))return"rust";if(/\bgo\s/.test(t))return"go";if(/\bpython|pytest|uvicorn|flask|django\b/.test(t))return"python";if(/\bnpm|pnpm|yarn|bun\b/.test(t))return"node";if(/\bdocker\b/.test(t))return"docker";if(/\bcmake|make\b/.test(t))return"c/cpp";if(/\bdotnet\b/.test(t))return"dotnet";if(/\bmvn|gradle\b/.test(t))return"java";if(/\brspec|rails|ruby\b/.test(t))return"ruby";if(/\bswift|xcodebuild\b/.test(t))return"swift";if(/\bgit\b/.test(t))return"git"}function ue(){return f.workspace.workspaceFolders?.[0]?.name}var O=class{constructor(e){this.storage=e;this.disposables=[];this.successCallbacks=[]}activate(){if("onDidEndTerminalShellExecution"in f.window){let e=f.window.onDidEndTerminalShellExecution(a=>{try{this.handle(a)}catch(i){console.error("[FlameTrack] shell handler error:",i)}});this.disposables.push(e)}else f.window.showInformationMessage("FlameTrack: Upgrade to VS Code 1.93+ for automatic tracking. Use \u270B Mark Today for now.")}onSuccess(e){this.successCallbacks.push(e)}markTodayManual(){let e={ts:Date.now(),label:"Manual check-in",kind:"manual",workspace:ue()},a=this.storage.recordSuccess(e);this.successCallbacks.forEach(n=>n(e));let i=this.storage.getData().currentStreak;f.window.showInformationMessage(a?`\u270B Day marked! Streak: ${i} \u{1F525}`:`Today already logged. Streak: ${i} \u{1F525}`)}dispose(){this.disposables.forEach(e=>e.dispose()),this.disposables=[]}handle(e){if(e.exitCode!==0)return;let a=e.execution?.commandLine?.value??"";if(!Pe(a))return;let i={ts:Date.now(),label:a.trim().slice(0,120),kind:/\bgit\s+push\b/.test(a)?"git":"terminal",workspace:ue(),tech:Ie(a)},n=this.storage.recordSuccess(i);if(this.successCallbacks.forEach(o=>o(i)),n){let o=this.storage.getData().currentStreak,s=o>=30?`\u{1F525} ${o} days \u2014 absolute legend!`:o>=14?`\u{1F525} ${o}-day streak! On fire!`:o>=7?"\u{1F525} Week streak! Keep going!":o>=3?`\u{1F525} ${o} days in a row!`:`\u{1F525} Day logged! Streak: ${o}`;f.window.showInformationMessage(s)}}};var b=p(require("vscode")),he=p(require("path")),ze=2*60*1e3,$e=1e3,W=class{constructor(e){this.storage=e;this.disposables=[];this.flushCallbacks=[];this.pending={added:0,removed:0,chars:0,lang:"",file:"",ws:""};this.batchTimer=null;this.lastEditTs=0;this.pendingMinutes=0}onFlush(e){this.flushCallbacks.push(e)}activate(){this.disposables.push(b.workspace.onDidChangeTextDocument(e=>{if(e.contentChanges.length===0||e.document.uri.scheme!=="file"||e.reason===b.TextDocumentChangeReason.Undo||e.reason===b.TextDocumentChangeReason.Redo)return;let a=0,i=0,n=0;for(let c of e.contentChanges)a+=c.text.split(`
`).length-1,i+=c.range.end.line-c.range.start.line,n+=c.text.length;let o=Date.now();if(this.lastEditTs>0){let c=o-this.lastEditTs;c<ze&&(this.pendingMinutes+=c/6e4)}this.lastEditTs=o;let s=this.pending;s.added+=a,s.removed+=i,s.chars+=n,s.lang=e.document.languageId,s.file=e.document.fileName,s.ws=He(e.document.uri),this.scheduleBatch()})),this.disposables.push(b.workspace.onDidSaveTextDocument(e=>{e.uri.scheme==="file"&&this.storage.recordSave()}))}scheduleBatch(){this.batchTimer||(this.batchTimer=setTimeout(()=>{this.batchTimer=null,this.flushBatch()},$e))}flushBatch(){let e=this.pending;if(e.added===0&&e.removed===0&&e.chars===0)return;let a=Math.floor(this.pendingMinutes);this.pendingMinutes-=a,this.storage.recordEdit({linesAdded:e.added,linesRemoved:e.removed,chars:e.chars,lang:e.lang||"plaintext",fileName:he.basename(e.file),workspace:e.ws||"unknown",activeMinutesDelta:a}),this.pending={added:0,removed:0,chars:0,lang:"",file:"",ws:""},this.flushCallbacks.forEach(i=>i())}dispose(){this.batchTimer&&(clearTimeout(this.batchTimer),this.batchTimer=null,this.flushBatch()),this.disposables.forEach(e=>e.dispose()),this.disposables=[]}};function He(t){return b.workspace.getWorkspaceFolder(t)?.name??b.workspace.workspaceFolders?.[0]?.name??"unknown"}var M=p(require("vscode"));var U=class{constructor(e,a){this.storage=e;this.onClickCommand=a;this.item=M.window.createStatusBarItem(M.StatusBarAlignment.Right,100),this.item.command=a,this.update(),this.item.show()}update(){let{currentStreak:e,activity:a}=this.storage.getData(),i=D(),n=a[i],o=this.storage.getStreakSettings(),s=J(n,o),c=(n?.events?.length??0)>0,R=(n?.linesAdded??0)+(n?.linesRemoved??0),A=e>0?`\u{1F525}${e}`:"\u{1F525}0",X=R>0?`  $(diff-added)${je(n?.linesAdded??0)}`:"";if(this.item.text=A+X,!s&&e>0)this.item.backgroundColor=new M.ThemeColor("statusBarItem.warningBackground"),this.item.tooltip=`FlameTrack
Streak: ${e} \u{1F525}
\u26A0\uFE0F Today not logged yet`;else{this.item.backgroundColor=void 0;let u=n?.activeMinutes??0;this.item.tooltip=["FlameTrack",`Streak: ${e} day${e!==1?"s":""}`,s?c?"\u2705 Today logged":"\u2705 Today logged (coding activity)":"\u2014",R?`Lines today: +${n?.linesAdded??0} / -${n?.linesRemoved??0}`:"",u?`Active: ${u}m`:"","","Click to open stats"].filter(G=>G!==void 0).join(`
`)}}dispose(){this.item.dispose()}};function je(t){return t>=1e3?(t/1e3).toFixed(1)+"k":String(t)}var y=p(require("vscode"));function fe(){return Be}var Be=`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<meta http-equiv="Content-Security-Policy" content="default-src 'none';style-src 'unsafe-inline';script-src 'unsafe-inline';">
<title>FlameTrack</title>
<style>
/* \u2500\u2500 Tokens \u2500\u2500 */
:root{
  --bg:#080810;--surface:#0f0f18;--card:#13131f;--card2:#171726;
  --border:#1e1e30;--border2:#252538;
  --text:#f0f0ff;--muted:#6b6b8a;--dim:#2e2e48;
  --f1:#ff5c1a;--f2:#ff8c00;--f3:#ffc107;
  --green:#22d97a;--blue:#4f9eff;--purple:#a855f7;--red:#ff4d6d;
  --gold:#f59e0b;--cyan:#06b6d4;
  --h0:#0f0f1a;--h1:#2d1408;--h2:#5c2810;--h3:#963d18;--h4:#d45a22;--h5:#ff8c42;
  --r:12px;--r2:8px;
  --mono:"SF Mono","Fira Code","Cascadia Code","Consolas",monospace;
  --sans:-apple-system,BlinkMacSystemFont,"Segoe UI","Inter",sans-serif;
}
*{box-sizing:border-box;margin:0;padding:0}
body{background:var(--bg);color:var(--text);font-family:var(--sans);font-size:13px;line-height:1.5;overflow-x:hidden;min-height:100vh}

/* \u2500\u2500 Scrollbar \u2500\u2500 */
::-webkit-scrollbar{width:4px;height:4px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:var(--border2);border-radius:2px}

/* \u2500\u2500 Layout \u2500\u2500 */
.shell{display:grid;grid-template-rows:auto auto 1fr;min-height:100vh}

/* \u2500\u2500 Top bar \u2500\u2500 */
.topbar{
  display:flex;align-items:center;gap:12px;
  padding:16px 24px 0;
  position:sticky;top:0;z-index:50;
  background:linear-gradient(to bottom,var(--bg) 70%,transparent);
}
.brand{display:flex;align-items:center;gap:10px}
.brand-icon{font-size:26px;animation:breathe 4s ease-in-out infinite}
@keyframes breathe{0%,100%{filter:drop-shadow(0 0 8px rgba(255,92,26,.5))}50%{filter:drop-shadow(0 0 20px rgba(255,193,7,.8))}}
.brand-name{font-size:18px;font-weight:800;letter-spacing:-.3px;
  background:linear-gradient(120deg,var(--f1),var(--f3));
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.brand-sub{font-size:11px;color:var(--muted);margin-top:1px}
.topbar-right{margin-left:auto;display:flex;align-items:center;gap:8px}
.badge-today{
  display:inline-flex;align-items:center;gap:5px;
  padding:4px 10px;border-radius:20px;font-size:11px;font-weight:600;
  transition:all .3s;
}
.badge-today.ok{background:rgba(34,217,122,.12);color:var(--green);border:1px solid rgba(34,217,122,.25)}
.badge-today.no{background:rgba(255,92,26,.1);color:var(--f1);border:1px solid rgba(255,92,26,.2)}
.dot{width:6px;height:6px;border-radius:50%;background:currentColor;animation:blink 1.5s ease-in-out infinite}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}

/* \u2500\u2500 Nav tabs \u2500\u2500 */
.nav{
  display:flex;gap:2px;padding:14px 24px 0;
  border-bottom:1px solid var(--border);margin-bottom:0;
  overflow-x:auto;
}
.tab{
  padding:8px 16px;border-radius:var(--r2) var(--r2) 0 0;
  font-size:12px;font-weight:500;color:var(--muted);
  cursor:pointer;transition:all .2s;border:1px solid transparent;
  border-bottom:none;position:relative;bottom:-1px;
  background:transparent;user-select:none;white-space:nowrap;
}
.tab:hover{color:var(--text)}
.tab.active{
  color:var(--text);background:var(--card);
  border-color:var(--border);border-bottom-color:var(--card);
}

/* \u2500\u2500 Page content \u2500\u2500 */
.page{display:none;padding:24px}
.page.active{display:block}

/* \u2500\u2500 Hero numbers \u2500\u2500 */
.hero-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:20px}
@media(max-width:700px){.hero-grid{grid-template-columns:repeat(2,1fr)}}
.hero-card{
  background:var(--card);border:1px solid var(--border);
  border-radius:var(--r);padding:18px 20px;
  position:relative;overflow:hidden;cursor:default;
  transition:border-color .2s;
}
.hero-card:hover{border-color:var(--border2)}
.hero-card::before{
  content:"";position:absolute;inset:0;
  background:radial-gradient(ellipse at 20% 80%,var(--glow,rgba(255,92,26,.06)),transparent 60%);
  pointer-events:none;
}
.hero-card.streak{--glow:rgba(255,92,26,.1)}
.hero-card.lines-add{--glow:rgba(34,217,122,.08)}
.hero-card.lines-rm{--glow:rgba(255,77,109,.08)}
.hero-card.time{--glow:rgba(79,158,255,.08)}
.hc-label{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:1.2px;color:var(--muted);margin-bottom:8px;display:flex;align-items:center;gap:5px}
.hc-val{font-size:40px;font-weight:800;line-height:1;font-family:var(--mono);letter-spacing:-1px}
.hc-val.streak-val{background:linear-gradient(135deg,var(--f1),var(--f3));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.hc-val.add-val{color:var(--green)}
.hc-val.rm-val{color:var(--red)}
.hc-val.time-val{color:var(--blue)}
.hc-sub{font-size:11px;color:var(--muted);margin-top:5px}
.flame-strip{display:flex;gap:4px;margin-top:10px}
.fs-dot{width:8px;height:8px;border-radius:50%;background:var(--dim);transition:all .3s;flex-shrink:0}
.fs-dot.lit{background:var(--f1);box-shadow:0 0 6px var(--f1);animation:fdot 2s ease-in-out infinite;animation-delay:calc(var(--i)*.12s)}
@keyframes fdot{0%,100%{transform:scale(1)}50%{transform:scale(1.25)}}

/* \u2500\u2500 Heatmap \u2500\u2500 */
.heatmap-wrap{background:var(--card);border:1px solid var(--border);border-radius:var(--r);padding:20px;margin-bottom:16px}
.heatmap-scroll{overflow-x:auto;padding-bottom:6px}
.hm-inner{display:inline-flex;flex-direction:column;gap:3px}
.hm-months{display:flex;gap:0;margin-bottom:6px;padding-left:18px}
.hm-month{font-size:10px;color:var(--muted);font-family:var(--mono);pointer-events:none}
.hm-rows{display:flex;gap:0}
.hm-days{display:flex;flex-direction:column;gap:3px;margin-right:5px}
.hm-day{font-size:9px;color:var(--dim);height:12px;line-height:12px;font-family:var(--mono);text-align:right;width:14px}
.hm-grid{display:flex;gap:3px}
.hm-col{display:flex;flex-direction:column;gap:3px}
.hm-cell{width:12px;height:12px;border-radius:3px;background:var(--h0);flex-shrink:0;cursor:default;transition:transform .1s,box-shadow .1s}
.hm-cell:hover{transform:scale(1.4);z-index:5;box-shadow:0 0 8px currentColor}
.hm-cell[data-v="1"]{background:var(--h1);color:var(--h1)}
.hm-cell[data-v="2"]{background:var(--h2);color:var(--h2)}
.hm-cell[data-v="3"]{background:var(--h3);color:var(--h3)}
.hm-cell[data-v="4"]{background:var(--h4);color:var(--h4)}
.hm-cell[data-v="5"]{background:var(--h5);color:var(--h5)}
.hm-cell.today-cell{outline:1.5px solid var(--f2);outline-offset:1px}
.hm-cell.frozen-cell{border:1px dashed rgba(79,158,255,.45)}
.hm-cell.frozen-cell:not([data-v]){background:rgba(79,158,255,.10)}
.hm-cell.frozen-cell:hover{box-shadow:0 0 8px var(--blue)}
.hm-legend{display:flex;align-items:center;gap:16px;margin-top:10px;flex-wrap:wrap}
.hm-legend-item{display:flex;align-items:center;gap:6px;font-size:10px;color:var(--muted)}
.hm-legend-swatch{width:11px;height:11px;border-radius:3px;flex-shrink:0}
.hm-legend-swatch.frozen{background:rgba(79,158,255,.10);border:1px dashed rgba(79,158,255,.4)}
.hm-legend-swatch.h0{background:var(--h0)}
.hm-legend-swatch.h3{background:var(--h3)}
.hm-legend-swatch.h5{background:var(--h5)}

.streak-rule{
  font-size:10px;color:var(--muted);margin-top:8px;line-height:1.5;
  display:flex;align-items:flex-start;gap:5px;
}
.streak-rule .sr-ico{flex-shrink:0}

/* \u2500\u2500 Hourly heatmap \u2500\u2500 */
.hourly-wrap{background:var(--card);border:1px solid var(--border);border-radius:var(--r);padding:20px;margin-bottom:16px}
.hourly-grid{display:grid;grid-template-columns:repeat(24,1fr);gap:4px;margin-top:10px}
.hh-cell{
  aspect-ratio:1;border-radius:4px;background:var(--h0);
  cursor:default;transition:transform .1s,box-shadow .1s;position:relative;
}
.hh-cell:hover{transform:scale(1.3);z-index:5}
.hh-cell[data-v="1"]{background:var(--h1)}
.hh-cell[data-v="2"]{background:var(--h2)}
.hh-cell[data-v="3"]{background:var(--h3)}
.hh-cell[data-v="4"]{background:var(--h4)}
.hh-cell[data-v="5"]{background:var(--h5)}
.hourly-labels{display:grid;grid-template-columns:repeat(24,1fr);gap:4px;margin-top:4px}
.hh-label{font-size:8px;color:var(--dim);text-align:center;font-family:var(--mono)}

/* \u2500\u2500 Section shared \u2500\u2500 */
.sec-row{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px}
@media(max-width:600px){.sec-row{grid-template-columns:1fr}}
.sec{background:var(--card);border:1px solid var(--border);border-radius:var(--r);padding:20px}
.sec-title{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:1.1px;color:var(--muted);margin-bottom:14px;display:flex;align-items:center;gap:6px}

/* \u2500\u2500 Bar chart \u2500\u2500 */
.bars{display:flex;align-items:flex-end;gap:3px;height:70px;margin-top:4px}
.b-col{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;min-width:0}
.b-bar{width:100%;border-radius:3px 3px 0 0;min-height:2px;transition:height .7s cubic-bezier(.34,1.4,.64,1);cursor:default}
.b-bar.add-bar{background:rgba(34,217,122,.6)}
.b-bar.add-bar:hover{background:var(--green)}
.b-bar.today-bar{background:var(--f1)!important}
.b-lbl{font-size:8px;color:var(--dim);font-family:var(--mono);line-height:1;text-align:center}
.b-lbl.today-lbl{color:var(--f2);font-weight:700}

/* \u2500\u2500 Lang chart \u2500\u2500 */
.lang-list{display:flex;flex-direction:column;gap:8px}
.lang-row{display:flex;align-items:center;gap:8px}
.lang-name{font-family:var(--mono);font-size:11px;color:var(--text);width:70px;flex-shrink:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.lang-bar-wrap{flex:1;height:6px;background:var(--dim);border-radius:3px;overflow:hidden}
.lang-bar-fill{height:100%;border-radius:3px;background:linear-gradient(90deg,var(--f1),var(--f3));transition:width .8s cubic-bezier(.34,1.2,.64,1)}
.lang-stat{font-family:var(--mono);font-size:10px;color:var(--muted);text-align:right;width:56px;flex-shrink:0}

/* \u2500\u2500 Activity feed \u2500\u2500 */
.feed{display:flex;flex-direction:column;gap:0}
.feed-item{display:flex;align-items:flex-start;gap:10px;padding:10px 0;border-bottom:1px solid var(--border)}
.feed-item:last-child{border-bottom:none}
.feed-icon{width:28px;height:28px;border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:13px;flex-shrink:0;background:var(--card2);border:1px solid var(--border2)}
.feed-main{flex:1;min-width:0}
.feed-cmd{font-family:var(--mono);font-size:11px;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.feed-meta{font-size:10px;color:var(--muted);margin-top:2px;display:flex;gap:8px}
.feed-time{font-size:10px;color:var(--dim);font-family:var(--mono);flex-shrink:0;padding-top:1px}
.feed-empty{color:var(--muted);text-align:center;padding:32px 0;font-size:13px}

/* \u2500\u2500 Stats page \u2500\u2500 */
.stats-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:16px}
@media(max-width:600px){.stats-grid{grid-template-columns:repeat(2,1fr)}}
.stat-box{background:var(--card);border:1px solid var(--border);border-radius:var(--r);padding:16px}
.stat-box .v{font-size:26px;font-weight:700;font-family:var(--mono);color:var(--text)}
.stat-box .n{font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.8px;margin-top:3px}

/* \u2500\u2500 Level page \u2500\u2500 */
.level-hero{
  background:var(--card);border:1px solid var(--border);border-radius:var(--r);
  padding:28px;margin-bottom:16px;
  display:flex;align-items:center;gap:24px;
  position:relative;overflow:hidden;
}
.level-hero::before{
  content:"";position:absolute;inset:0;
  background:radial-gradient(ellipse at 80% 50%,rgba(168,85,247,.1),transparent 60%);
  pointer-events:none;
}
.lh-icon{font-size:56px;line-height:1;flex-shrink:0;filter:drop-shadow(0 0 20px rgba(168,85,247,.5))}
.lh-info{flex:1;min-width:0}
.lh-level{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1.2px;color:var(--purple);margin-bottom:4px}
.lh-title{font-size:32px;font-weight:800;letter-spacing:-.5px;
  background:linear-gradient(135deg,var(--purple),var(--blue));
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
.lh-xp{font-size:13px;color:var(--muted);margin-top:4px;font-family:var(--mono)}
.lh-bar-wrap{height:8px;background:var(--dim);border-radius:4px;margin-top:10px;overflow:hidden}
.lh-bar-fill{height:100%;border-radius:4px;background:linear-gradient(90deg,var(--purple),var(--blue));transition:width 1.2s cubic-bezier(.34,1.2,.64,1)}
.lh-next{font-size:10px;color:var(--muted);margin-top:5px;display:flex;justify-content:space-between}

.level-ladder{display:flex;flex-direction:column;gap:3px;margin-bottom:16px}
.ll-row{
  display:flex;align-items:center;gap:12px;
  padding:10px 14px;border-radius:var(--r2);
  border:1px solid transparent;transition:all .15s;
  background:var(--card);
}
.ll-row.current{border-color:var(--purple);background:rgba(168,85,247,.06)}
.ll-row.done{opacity:.55}
.ll-row.locked{opacity:.3}
.ll-num{font-size:10px;color:var(--muted);font-family:var(--mono);width:22px;flex-shrink:0;text-align:center}
.ll-icon{font-size:20px;width:28px;text-align:center;flex-shrink:0}
.ll-name{font-size:13px;font-weight:600;flex:1}
.ll-xp{font-size:11px;color:var(--muted);font-family:var(--mono)}
.ll-badge{font-size:9px;padding:2px 6px;border-radius:10px;font-weight:700;flex-shrink:0}
.ll-badge.cur{background:rgba(168,85,247,.2);color:var(--purple)}
.ll-badge.done2{background:rgba(34,217,122,.15);color:var(--green)}

/* \u2500\u2500 Achievements page \u2500\u2500 */
.ach-header{display:flex;align-items:center;gap:12px;margin-bottom:20px;flex-wrap:wrap}
.ach-progress-text{font-size:13px;color:var(--muted)}
.ach-progress-text strong{color:var(--text)}
.ach-filter{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px}
.ach-pill{
  padding:4px 12px;border-radius:20px;font-size:11px;font-weight:600;
  cursor:pointer;border:1px solid var(--border2);color:var(--muted);
  background:transparent;transition:all .15s;
}
.ach-pill:hover{color:var(--text)}
.ach-pill.active{background:rgba(255,92,26,.12);color:var(--f2);border-color:rgba(255,92,26,.3)}

.ach-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:10px}
.ach-card{
  background:var(--card);border:1px solid var(--border);border-radius:var(--r);
  padding:16px;display:flex;flex-direction:column;gap:8px;
  position:relative;overflow:hidden;transition:border-color .2s;
}
.ach-card:hover{border-color:var(--border2)}
.ach-card.unlocked{border-color:rgba(245,158,11,.25)}
.ach-card.unlocked::before{
  content:"";position:absolute;inset:0;
  background:radial-gradient(ellipse at 20% 20%,rgba(245,158,11,.07),transparent 60%);
  pointer-events:none;
}
.ach-card.locked{opacity:.82}
.ach-top{display:flex;align-items:flex-start;gap:10px}
.ach-icon{font-size:28px;line-height:1;flex-shrink:0}
.ach-info{flex:1;min-width:0}
.ach-name{font-size:13px;font-weight:700;color:var(--text);margin-bottom:2px}
.ach-name.unlocked-name{color:var(--gold)}
.ach-desc{font-size:11px;color:var(--muted);line-height:1.4}
.ach-progress-wrap{height:5px;background:var(--dim);border-radius:3px;overflow:hidden;margin-top:2px}
.ach-progress-fill{height:100%;border-radius:3px;background:linear-gradient(90deg,var(--f1),var(--f3));transition:width .8s cubic-bezier(.34,1.2,.64,1)}
.ach-progress-fill.done{background:linear-gradient(90deg,var(--gold),var(--f2))}
.ach-progress-label{font-size:9px;color:var(--muted);font-family:var(--mono);margin-top:3px;display:flex;justify-content:space-between}
.ach-footer{display:flex;align-items:center;justify-content:space-between;margin-top:2px}
.ach-cat{font-size:9px;text-transform:uppercase;letter-spacing:1px;color:var(--dim);font-weight:600}
.ach-xp{font-size:11px;font-weight:700;color:var(--gold);font-family:var(--mono)}
.ach-date{font-size:9px;color:var(--muted);font-family:var(--mono)}
.ach-lock{position:absolute;top:10px;right:10px;font-size:14px;opacity:.3}
.ach-icon.locked-icon{filter:grayscale(1);opacity:.4}

/* \u2500\u2500 Tooltip \u2500\u2500 */
.tip{
  position:fixed;background:#1a1a2e;color:var(--text);
  font-size:11px;padding:6px 10px;border-radius:6px;
  pointer-events:none;opacity:0;transition:opacity .12s;
  z-index:200;white-space:nowrap;border:1px solid var(--border2);
  font-family:var(--mono);box-shadow:0 4px 16px rgba(0,0,0,.4);
}

/* \u2500\u2500 Action buttons \u2500\u2500 */
.actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:20px}
.btn{
  display:inline-flex;align-items:center;gap:6px;
  padding:8px 16px;border-radius:8px;font-size:12px;font-weight:600;
  cursor:pointer;border:1px solid transparent;font-family:var(--sans);
  transition:all .15s;letter-spacing:.2px;
}
.btn-primary{background:linear-gradient(135deg,var(--f1),var(--f2));color:#fff;border-color:var(--f2);box-shadow:0 2px 12px rgba(255,92,26,.3)}
.btn-primary:hover{filter:brightness(1.1);box-shadow:0 4px 20px rgba(255,92,26,.4)}
.btn-primary:active{transform:scale(.97)}
.btn-ghost{background:transparent;color:var(--muted);border-color:var(--border2)}
.btn-ghost:hover{color:var(--text);border-color:var(--muted);background:var(--card)}

/* \u2500\u2500 Confetti \u2500\u2500 */
.cel{position:fixed;inset:0;pointer-events:none;z-index:999}
.cp{position:absolute;width:7px;height:7px;border-radius:2px;animation:cfal linear forwards}
@keyframes cfal{from{opacity:1;transform:translateY(0) rotate(0)}to{opacity:0;transform:translateY(100vh) rotate(800deg)}}

/* \u2500\u2500 Divider \u2500\u2500 */
.sep{height:1px;background:var(--border);margin:16px 0}

/* \u2500\u2500 Today strip \u2500\u2500 */
.today-strip{
  display:flex;align-items:center;gap:12px;
  margin:0 24px;padding:10px 0;border-bottom:1px solid var(--border);
  flex-wrap:wrap;
}
.ts-item{display:flex;align-items:center;gap:6px;font-size:11px;color:var(--muted)}
.ts-item strong{color:var(--text);font-family:var(--mono)}
.ts-sep{color:var(--dim)}

/* \u2500\u2500 Streak compare \u2500\u2500 */
.streak-compare{margin-top:10px}
.sc-bar{height:3px;background:var(--dim);border-radius:2px;overflow:hidden;margin-top:3px}
.sc-fill{height:100%;border-radius:2px;background:linear-gradient(90deg,var(--f1),var(--f3));transition:width 1s cubic-bezier(.34,1.2,.64,1)}
</style>
</head>
<body>
<div class="shell">

<!-- Top bar -->
<div class="topbar">
  <div class="brand">
    <div class="brand-icon">\u{1F525}</div>
    <div>
      <div class="brand-name">FlameTrack</div>
      <div class="brand-sub">real productivity, not screen time</div>
    </div>
  </div>
  <div class="topbar-right">
    <div class="badge-today no" id="todayBadge">
      <span class="dot"></span> <span id="todayLabel">Loading...</span>
    </div>
  </div>
</div>

<!-- Today quick stats strip -->
<div class="today-strip" id="todayStrip">
  <div class="ts-item">\u23F1 Today: <strong id="ts-time">0 min</strong></div>
  <span class="ts-sep">\xB7</span>
  <div class="ts-item">\u2705 <strong id="ts-add">+0</strong> lines</div>
  <span class="ts-sep">\xB7</span>
  <div class="ts-item">\u{1F5D1} <strong id="ts-rm">-0</strong> removed</div>
  <span class="ts-sep">\xB7</span>
  <div class="ts-item">\u{1F4BE} <strong id="ts-saves">0</strong> saves</div>
  <span class="ts-sep">\xB7</span>
  <div class="ts-item">\u{1F4C4} <strong id="ts-files">0</strong> files</div>
  <span class="ts-sep">\xB7</span>
  <div class="ts-item">\u26A1 <strong id="ts-xp">0 XP</strong></div>
</div>

<!-- Nav -->
<div class="nav">
  <div class="tab active" data-tab="overview">Overview</div>
  <div class="tab" data-tab="code">Code</div>
  <div class="tab" data-tab="activity">Activity</div>
  <div class="tab" data-tab="achievements">\u{1F3C5} Achievements</div>
  <div class="tab" data-tab="levels">\u26A1 Levels</div>
</div>

<!-- \u2500\u2500 PAGE: Overview \u2500\u2500 -->
<div class="page active" id="page-overview">

  <div class="hero-grid">
    <div class="hero-card streak">
      <div class="hc-label">\u{1F525} Streak</div>
      <div class="hc-val streak-val" id="hc-streak">0</div>
      <div class="hc-sub">days in a row \xB7 best: <span id="hc-best">0</span></div>
      <div class="flame-strip" id="flameStrip"></div>
      <div class="streak-rule" id="streakRule"></div>
    </div>
    <div class="hero-card lines-add">
      <div class="hc-label">\u2705 Lines Added</div>
      <div class="hc-val add-val" id="hc-add">0</div>
      <div class="hc-sub">all time \xB7 today: <span id="hc-add-today">0</span></div>
    </div>
    <div class="hero-card lines-rm">
      <div class="hc-label">\u{1F5D1} Lines Removed</div>
      <div class="hc-val rm-val" id="hc-rm">0</div>
      <div class="hc-sub">all time \xB7 today: <span id="hc-rm-today">0</span></div>
    </div>
    <div class="hero-card time">
      <div class="hc-label">\u23F1 Active Time</div>
      <div class="hc-val time-val" id="hc-time">0h</div>
      <div class="hc-sub">total \xB7 today: <span id="hc-time-today">0m</span></div>
    </div>
  </div>

  <!-- Heatmap 12 months -->
  <div class="heatmap-wrap">
    <div class="sec-title">Activity Heatmap \u2014 12 months</div>
    <div class="heatmap-scroll"><div class="hm-inner" id="heatmapRoot"></div></div>
    <div class="hm-legend" id="hmLegend"></div>
  </div>

  <!-- Hourly heatmap -->
  <div class="hourly-wrap">
    <div class="sec-title">\u{1F550} Hourly Activity \u2014 when do you code?</div>
    <div class="hourly-grid" id="hourlyRoot"></div>
    <div class="hourly-labels" id="hourlyLabels"></div>
  </div>

  <!-- 28-day bars + lang breakdown -->
  <div class="sec-row">
    <div class="sec">
      <div class="sec-title">Lines per Day \u2014 4 weeks</div>
      <div class="bars" id="barsRoot"></div>
    </div>
    <div class="sec">
      <div class="sec-title">Top Languages</div>
      <div class="lang-list" id="langRoot"></div>
    </div>
  </div>

</div>

<!-- \u2500\u2500 PAGE: Code \u2500\u2500 -->
<div class="page" id="page-code">

  <div class="stats-grid">
    <div class="stat-box"><div class="v" id="c-totalAdd">0</div><div class="n">Lines Added</div></div>
    <div class="stat-box"><div class="v" id="c-totalRm">0</div><div class="n">Lines Removed</div></div>
    <div class="stat-box"><div class="v" id="c-net">0</div><div class="n">Net Lines</div></div>
    <div class="stat-box"><div class="v" id="c-saves">0</div><div class="n">Total Saves</div></div>
    <div class="stat-box"><div class="v" id="c-hours">0h</div><div class="n">Active Hours</div></div>
    <div class="stat-box"><div class="v" id="c-days">0</div><div class="n">Active Days</div></div>
  </div>

  <div class="sec" style="margin-bottom:14px">
    <div class="sec-title">Lines Written per Day (all time)</div>
    <div id="allTimeBars" style="display:flex;align-items:flex-end;gap:2px;height:80px;overflow-x:auto"></div>
  </div>

  <div class="sec-row">
    <div class="sec">
      <div class="sec-title">Languages Breakdown</div>
      <div class="lang-list" id="langFullRoot"></div>
    </div>
    <div class="sec">
      <div class="sec-title">Most Edited Files (today)</div>
      <div id="filesRoot" style="display:flex;flex-direction:column;gap:6px;margin-top:4px"></div>
    </div>
  </div>

</div>

<!-- \u2500\u2500 PAGE: Activity \u2500\u2500 -->
<div class="page" id="page-activity">

  <div class="sec" style="margin-bottom:14px">
    <div class="sec-title">Recent Successful Actions</div>
    <div class="feed" id="feedRoot"></div>
  </div>

  <div class="actions">
    <button class="btn btn-primary" onclick="markToday()">\u270B Mark Today</button>
    <button class="btn btn-ghost" onclick="exportMd()">\u{1F4E4} Export Markdown</button>
  </div>

</div>

<!-- \u2500\u2500 PAGE: Achievements \u2500\u2500 -->
<div class="page" id="page-achievements">

  <div class="ach-header">
    <div class="ach-progress-text"><strong id="ach-count">0</strong> / <span id="ach-total">0</span> unlocked</div>
    <div style="flex:1;height:6px;background:var(--dim);border-radius:3px;overflow:hidden;min-width:80px">
      <div id="ach-overall-bar" style="height:100%;border-radius:3px;background:linear-gradient(90deg,var(--gold),var(--f2));transition:width 1s cubic-bezier(.34,1.2,.64,1);width:0%"></div>
    </div>
    <div style="font-size:11px;color:var(--muted);font-family:var(--mono)" id="ach-xp-earned">+0 XP earned</div>
  </div>

  <div class="ach-filter" id="achFilter">
    <div class="ach-pill active" data-cat="all">All</div>
    <div class="ach-pill" data-cat="streak">\u{1F525} Streak</div>
    <div class="ach-pill" data-cat="code">\u{1F4DD} Code</div>
    <div class="ach-pill" data-cat="time">\u23F1 Time</div>
    <div class="ach-pill" data-cat="habit">\u{1F319} Habits</div>
    <div class="ach-pill" data-cat="build">\u{1F680} Build</div>
    <div class="ach-pill" data-cat="special">\u2B50 Special</div>
  </div>

  <div class="ach-grid" id="achGrid"></div>

</div>

<!-- \u2500\u2500 PAGE: Levels \u2500\u2500 -->
<div class="page" id="page-levels">

  <div class="level-hero">
    <div class="lh-icon" id="lv-icon">\u2728</div>
    <div class="lh-info">
      <div class="lh-level">Level <span id="lv-num">1</span></div>
      <div class="lh-title" id="lv-title">Spark</div>
      <div class="lh-xp"><span id="lv-xp-total">0</span> XP total</div>
      <div class="lh-bar-wrap"><div class="lh-bar-fill" id="lv-bar" style="width:0%"></div></div>
      <div class="lh-next">
        <span id="lv-progress-text">0 / 100 XP to next level</span>
        <span id="lv-pct">0%</span>
      </div>
    </div>
  </div>

  <div class="sec-title" style="padding:0 0 12px">Level Ladder</div>
  <div class="level-ladder" id="levelLadder"></div>

</div>

</div><!-- /shell -->

<div class="tip" id="tip"></div>
<div class="cel" id="cel"></div>

<script>
const vscode = acquireVsCodeApi();
let D = null;
let activeTab = 'overview';
let achFilter = 'all';
// Defaults mirror package.json \u2014 overwritten by streakSettings from extension
let STREAK_SETTINGS = { minActiveMinutes: 5, minLinesAdded: 10, weekendFreeze: true };
// Fully-resolved achievement list (name/desc/icon/category/xp/current/target/pct/unlocked)
// computed server-side by achievements.ts \u2014 no duplication needed here.
let ACH_PROGRESS = [];

// \u2500\u2500 Level table (mirrors xp.ts) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
const LEVELS = [
  [0,     'Spark',           '\u2728'],
  [100,   'Kindler',         '\u{1FAB5}'],
  [300,   'Flame',           '\u{1F525}'],
  [700,   'Inferno',         '\u{1F30B}'],
  [1500,  'Blaze',           '\u{1F4A5}'],
  [3000,  'Code Arsonist',   '\u{1F9E8}'],
  [6000,  'Senior Burner',   '\u26A1'],
  [12000, 'Legendary Coder', '\u{1F3C6}'],
  [25000, 'Mythic Dev',      '\u{1F48E}'],
  [50000, 'Eternal Flame',   '\u2600\uFE0F'],
];

function getLevelInfo(xp) {
  let idx = 0;
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i][0]) { idx = i; break; }
  }
  const [xpReq, title, icon] = LEVELS[idx];
  const next = LEVELS[idx + 1];
  const xpToNext = next ? next[0] - xpReq : 0;
  const xpIntoLevel = xp - xpReq;
  const pct = xpToNext === 0 ? 100 : Math.min(100, Math.round(xpIntoLevel / xpToNext * 100));
  return { level: idx + 1, title, icon, xpReq, xpToNext, xpIntoLevel, pct, isMax: xpToNext === 0 };
}

// \u2500\u2500 Streak capture helpers (mirrors storage.ts) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

/** Does this day count toward the streak, per current settings? */
function dayQualifiesForStreak(day) {
  if (!day) return false;
  if ((day.events?.length ?? 0) > 0) return true;
  if ((day.activeMinutes ?? 0) >= STREAK_SETTINGS.minActiveMinutes) return true;
  if ((day.linesAdded ?? 0) >= STREAK_SETTINGS.minLinesAdded) return true;
  return false;
}

/** Saturday or Sunday, by UTC day-of-week (matches the date-string keys). */
function isWeekend(dateStr) {
  const dow = new Date(dateStr + 'T00:00:00Z').getUTCDay();
  return dow === 0 || dow === 6;
}

function streakRuleText() {
  const s = STREAK_SETTINGS;
  const parts = [
    'a successful build/test/git push',
    '\u270B manual check-in',
    \`\\u2265\${s.minActiveMinutes} min active\`,
    \`\\u2265\${s.minLinesAdded} lines added\`,
  ];
  let txt = 'A day counts if: ' + parts.join(' \xB7 ');
  if (s.weekendFreeze) txt += '. Weekends are auto-frozen \\u2744\\ufe0f if you skip them.';
  return txt;
}

// \u2500\u2500 Messaging \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
window.addEventListener('message', e => {
  const msg = e.data;
  if (msg.type === 'data') {
    D = msg.payload;
    if (msg.streakSettings) STREAK_SETTINGS = msg.streakSettings;
    // achievementProgress is computed server-side by getAchievementProgressList()
    // and sent alongside the payload. Fall back to empty array if missing.
    if (msg.achievementProgress) ACH_PROGRESS = msg.achievementProgress;
    else if (msg.payload?.achievementProgress) ACH_PROGRESS = msg.payload.achievementProgress;
    renderAll(D);
  }
  if (msg.type === 'switch_tab') { switchTab(msg.tab); }
});
vscode.postMessage({ type: 'request_data' });

// \u2500\u2500 Tab switching \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
function switchTab(tab) {
  document.querySelectorAll('.tab').forEach(x => x.classList.remove('active'));
  document.querySelectorAll('.page').forEach(x => x.classList.remove('active'));
  const t = document.querySelector(\`.tab[data-tab="\${tab}"]\`);
  if (t) t.classList.add('active');
  const p = document.getElementById('page-' + tab);
  if (p) p.classList.add('active');
  activeTab = tab;
  if (D) renderAll(D);
}

document.querySelectorAll('.tab').forEach(t => {
  t.addEventListener('click', () => switchTab(t.dataset.tab));
});

// \u2500\u2500 Achievement filter \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
document.querySelectorAll('.ach-pill').forEach(p => {
  p.addEventListener('click', () => {
    document.querySelectorAll('.ach-pill').forEach(x => x.classList.remove('active'));
    p.classList.add('active');
    achFilter = p.dataset.cat;
    if (D) renderAchievements(D);
  });
});

// \u2500\u2500 Render all \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
function renderAll(d) {
  const today = todayStr();
  const day = d.activity[today];
  const activatedToday = dayQualifiesForStreak(day);
  const todayAdd   = day?.linesAdded ?? 0;
  const todayRm    = day?.linesRemoved ?? 0;
  const todayMin   = day?.activeMinutes ?? 0;
  const todaySaves = day?.saves ?? 0;
  const todayFiles = day?.filesEdited?.length ?? 0;

  const badge = document.getElementById('todayBadge');
  const label = document.getElementById('todayLabel');
  badge.className = 'badge-today ' + (activatedToday ? 'ok' : 'no');
  label.textContent = activatedToday ? 'Today logged' : 'Not logged yet';

  set('ts-time',  todayMin >= 60 ? (todayMin/60).toFixed(1)+'h' : todayMin+'m');
  set('ts-add',   '+' + fmt(todayAdd));
  set('ts-rm',    '-' + fmt(todayRm));
  set('ts-saves', todaySaves);
  set('ts-files', todayFiles);
  set('ts-xp',    fmt(d.totalXp ?? 0) + ' XP');

  renderOverview(d, day);
  renderCode(d, day);
  renderActivity(d);
  renderAchievements(d);
  renderLevels(d);
}

function renderOverview(d, day) {
  const totalHours = Math.round(d.totalActiveMinutes / 60);
  animCount('hc-streak', d.currentStreak, 500);
  animCount('hc-best', d.bestStreak, 500);
  set('hc-add', fmt(d.totalLinesAdded));
  set('hc-add-today', '+' + fmt(day?.linesAdded ?? 0));
  set('hc-rm', fmt(d.totalLinesRemoved));
  set('hc-rm-today', '-' + fmt(day?.linesRemoved ?? 0));
  set('hc-time', totalHours + 'h');
  set('hc-time-today', (day?.activeMinutes ?? 0) + 'm');

  const fs = document.getElementById('flameStrip');
  fs.innerHTML = '';
  for (let i = 0; i < 10; i++) {
    const d2 = document.createElement('div');
    d2.className = 'fs-dot' + (i < Math.min(d.currentStreak, 10) ? ' lit' : '');
    d2.style.setProperty('--i', i);
    fs.appendChild(d2);
  }

  const ruleEl = document.getElementById('streakRule');
  if (ruleEl) ruleEl.innerHTML = '<span class="sr-ico">\u2139\uFE0F</span><span>' + esc(streakRuleText()) + '</span>';

  buildHeatmap(d.activity);
  buildHourlyHeatmap(d.activity);
  buildBars28(d.activity);
  buildLangChart(d.activity, 'langRoot', 6);
}

function renderCode(d, day) {
  const net = d.totalLinesAdded - d.totalLinesRemoved;
  const hours = Math.round(d.totalActiveMinutes / 60);
  const days = Object.keys(d.activity).length;
  set('c-totalAdd', fmt(d.totalLinesAdded));
  set('c-totalRm', fmt(d.totalLinesRemoved));
  set('c-net', (net >= 0 ? '+' : '') + fmt(net));
  set('c-saves', fmt(d.totalSaves));
  set('c-hours', hours + 'h');
  set('c-days', days);
  buildAllTimeBars(d.activity);
  buildLangChart(d.activity, 'langFullRoot', 12);
  buildFilesList(day);
}

function renderActivity(d) {
  const recent = Object.values(d.activity)
    .flatMap(x => x.events || [])
    .sort((a, b) => b.ts - a.ts)
    .slice(0, 30);

  const root = document.getElementById('feedRoot');
  if (!recent.length) {
    root.innerHTML = '<div class="feed-empty">No builds, tests or deploys logged yet.<br>Run some code to start your streak! \u{1F680}</div>';
    return;
  }
  const icons = { git: '\u{1F4E4}', manual: '\u270B', terminal: '\u26A1' };
  root.innerHTML = recent.map(ev => {
    const icon = icons[ev.kind] || '\u26A1';
    const meta = [ev.workspace, ev.tech].filter(Boolean).join(' \xB7 ');
    return \`<div class="feed-item">
      <div class="feed-icon">\${icon}</div>
      <div class="feed-main">
        <div class="feed-cmd" title="\${esc(ev.label)}">\${esc(ev.label)}</div>
        \${meta ? \`<div class="feed-meta"><span>\${esc(meta)}</span></div>\` : ''}
      </div>
      <div class="feed-time">\${relTime(ev.ts)}</div>
    </div>\`;
  }).join('');
}

// \u2500\u2500 Achievements render \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
function renderAchievements(d) {
  // ACH_PROGRESS is the server-computed list with progress bars baked in.
  // Fall back to empty array if not yet received.
  const list = ACH_PROGRESS;
  if (!list.length) return;

  const total = list.length;
  const count = list.filter(a => a.unlocked).length;

  set('ach-count', count);
  set('ach-total', total);

  const totalXpEarned = list
    .filter(a => a.unlocked)
    .reduce((s, a) => s + a.xpReward, 0);
  set('ach-xp-earned', '+' + fmt(totalXpEarned) + ' XP earned');

  const bar = document.getElementById('ach-overall-bar');
  if (bar) setTimeout(() => bar.style.width = Math.round(count / total * 100) + '%', 50);

  const filtered = achFilter === 'all'
    ? list
    : list.filter(a => a.category === achFilter);

  // Unlocked first, then locked \u2014 within each group keep catalogue order
  const sorted = [
    ...filtered.filter(a => a.unlocked),
    ...filtered.filter(a => !a.unlocked),
  ];

  const grid = document.getElementById('achGrid');
  grid.innerHTML = sorted.map(a => {
    const isUnlocked = a.unlocked;
    // Progress bar: only show for in-progress achievements (pct > 0 and not unlocked)
    const showProgress = !isUnlocked && a.target > 1;
    const pct = a.pct ?? 0;
    const progressHtml = showProgress ? \`
      <div class="ach-progress-wrap">
        <div class="ach-progress-fill\${isUnlocked ? ' done' : ''}" style="width:\${pct}%"></div>
      </div>
      <div class="ach-progress-label">
        <span>\${fmtProgress(a.current, a.target)}</span>
        <span>\${pct}%</span>
      </div>\` : isUnlocked ? \`
      <div class="ach-progress-wrap">
        <div class="ach-progress-fill done" style="width:100%"></div>
      </div>
      <div class="ach-progress-label">
        <span>\${fmtProgress(a.target, a.target)}</span>
        <span>\u2713 Done</span>
      </div>\` : '';

    return \`<div class="ach-card \${isUnlocked ? 'unlocked' : 'locked'}">
      \${!isUnlocked ? '<div class="ach-lock">\u{1F512}</div>' : ''}
      <div class="ach-top">
        <div class="ach-icon\${isUnlocked ? '' : ' locked-icon'}">\${a.icon}</div>
        <div class="ach-info">
          <div class="ach-name \${isUnlocked ? 'unlocked-name' : ''}">\${esc(a.name)}</div>
          <div class="ach-desc">\${esc(a.description)}</div>
        </div>
      </div>
      \${progressHtml}
      <div class="ach-footer">
        <div class="ach-cat">\${a.category}</div>
        \${a.unlockedDate ? \`<div class="ach-date">\${a.unlockedDate}</div>\` : ''}
        <div class="ach-xp">+\${a.xpReward} XP</div>
      </div>
    </div>\`;
  }).join('');
}

/** Format progress numbers nicely: 1,234 / 10,000 */
function fmtProgress(current, target) {
  const fmtN = n => {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
    if (n >= 1_000) return n.toLocaleString();
    return String(n);
  };
  return fmtN(Math.min(current, target)) + ' / ' + fmtN(target);
}

// \u2500\u2500 Levels render \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
function renderLevels(d) {
  const xp = d.totalXp ?? 0;
  const info = getLevelInfo(xp);

  set('lv-icon', info.icon);
  set('lv-num', info.level);
  set('lv-title', info.title);
  set('lv-xp-total', fmt(xp));

  const bar = document.getElementById('lv-bar');
  if (bar) setTimeout(() => bar.style.width = info.pct + '%', 50);

  if (info.isMax) {
    set('lv-progress-text', 'MAX LEVEL \u2014 you absolute legend');
    set('lv-pct', '\u221E');
  } else {
    set('lv-progress-text', fmt(info.xpIntoLevel) + ' / ' + fmt(info.xpToNext) + ' XP to next level');
    set('lv-pct', info.pct + '%');
  }

  // Ladder
  const ladder = document.getElementById('levelLadder');
  ladder.innerHTML = LEVELS.map(([xpReq, title, icon], i) => {
    const lvNum = i + 1;
    const isCurrent = info.level === lvNum;
    const isDone = xp >= xpReq && !isCurrent;
    const isLocked = xp < xpReq;
    let cls = 'll-row';
    if (isCurrent) cls += ' current';
    else if (isDone) cls += ' done';
    else cls += ' locked';

    let badge = '';
    if (isCurrent) badge = '<span class="ll-badge cur">CURRENT</span>';
    else if (isDone) badge = '<span class="ll-badge done2">\u2713</span>';

    const next = LEVELS[i + 1];
    const xpNeeded = next ? next[0] : null;

    return \`<div class="\${cls}">
      <div class="ll-num">\${lvNum}</div>
      <div class="ll-icon">\${icon}</div>
      <div class="ll-name">\${esc(title)}</div>
      <div class="ll-xp">\${xpNeeded ? fmt(xpReq) + ' \u2013 ' + fmt(xpNeeded - 1) + ' XP' : fmt(xpReq) + '+ XP'}</div>
      \${badge}
    </div>\`;
  }).join('');
}

// \u2500\u2500 Heatmap 12 months \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
function buildHeatmap(activity) {
  const root = document.getElementById('heatmapRoot');
  if (!root) return;
  const tip = document.getElementById('tip');
  const todayD = new Date(); todayD.setHours(0,0,0,0);
  const start = new Date(todayD); start.setDate(start.getDate() - 364);
  start.setDate(start.getDate() - start.getDay());

  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  let monthHtml = '<div class="hm-months">';
  let colIdx = 0, cur = new Date(start);
  const colsByMonth = {};
  while (cur <= todayD) {
    const mon = cur.getMonth();
    if (!colsByMonth[mon]) colsByMonth[mon] = colIdx;
    cur.setDate(cur.getDate() + 7); colIdx++;
  }
  let prevMon = -1;
  for (let i = 0; i < colIdx; i++) {
    const label = Object.entries(colsByMonth).find(([,v]) => v === i);
    if (label && Number(label[0]) !== prevMon) {
      monthHtml += \`<div class="hm-month" style="width:\${12+3}px">\${months[Number(label[0])]}</div>\`;
      prevMon = Number(label[0]);
    } else {
      monthHtml += \`<div class="hm-month" style="width:\${12+3}px"></div>\`;
    }
  }
  monthHtml += '</div>';

  const dayLabels = '<div class="hm-days"><div class="hm-day"></div><div class="hm-day">M</div><div class="hm-day"></div><div class="hm-day">W</div><div class="hm-day"></div><div class="hm-day">F</div><div class="hm-day"></div></div>';

  const grid = document.createElement('div'); grid.className = 'hm-grid';
  cur = new Date(start);
  while (cur <= todayD) {
    const col = document.createElement('div'); col.className = 'hm-col';
    for (let d = 0; d < 7; d++) {
      const cell = document.createElement('div'); cell.className = 'hm-cell';
      const k = ds(cur);
      const rec = activity[k];
      const lines = (rec?.linesAdded ?? 0) + (rec?.linesRemoved ?? 0);
      const evts = rec?.events?.length ?? 0;
      const heat = lines === 0 && evts === 0 ? 0 : lines < 20 ? 1 : lines < 80 ? 2 : lines < 200 ? 3 : lines < 500 ? 4 : 5;
      if (heat > 0) cell.setAttribute('data-v', heat);
      if (k === ds(todayD)) cell.classList.add('today-cell');

      const qualifies = dayQualifiesForStreak(rec);
      const frozen = !qualifies && isWeekend(k) && STREAK_SETTINGS.weekendFreeze;
      if (frozen) cell.classList.add('frozen-cell');

      cell.addEventListener('mouseenter', e => {
        const parts = [];
        if (evts) parts.push(evts + ' event' + (evts !== 1 ? 's' : ''));
        if (rec?.linesAdded) parts.push('+' + rec.linesAdded + ' lines');
        if (rec?.activeMinutes) parts.push(rec.activeMinutes + 'min');
        let txt = k + (parts.length ? ': ' + parts.join(', ') : ': no activity');
        if (frozen) txt += ' \u2744\uFE0F streak protected (weekend)';
        else if (qualifies) txt += ' \u2713 counted';
        tip.textContent = txt;
        tip.style.opacity = '1';
        tip.style.left = (e.clientX + 14) + 'px';
        tip.style.top  = (e.clientY - 32) + 'px';
      });
      cell.addEventListener('mouseleave', () => { tip.style.opacity = '0'; });
      col.appendChild(cell);
      cur.setDate(cur.getDate() + 1);
    }
    grid.appendChild(col);
  }
  root.innerHTML = monthHtml + '<div class="hm-rows">' + dayLabels + '</div>';
  root.querySelector('.hm-rows').appendChild(grid);

  const legend = document.getElementById('hmLegend');
  if (legend) {
    let legendHtml = \`
      <div class="hm-legend-item"><div class="hm-legend-swatch h0"></div><span>No activity</span></div>
      <div class="hm-legend-item"><div class="hm-legend-swatch h3"></div><span>Active day</span></div>
      <div class="hm-legend-item"><div class="hm-legend-swatch h5"></div><span>Heavy day</span></div>
    \`;
    if (STREAK_SETTINGS.weekendFreeze) {
      legendHtml += '<div class="hm-legend-item"><div class="hm-legend-swatch frozen"></div><span>\u2744\uFE0F Weekend freeze (streak protected)</span></div>';
    }
    legend.innerHTML = legendHtml;
  }
}

// \u2500\u2500 Hourly heatmap \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
function buildHourlyHeatmap(activity) {
  const root    = document.getElementById('hourlyRoot');
  const lblRoot = document.getElementById('hourlyLabels');
  const tip     = document.getElementById('tip');
  if (!root) return;

  // Aggregate all-time lines per hour (index 0\u201323)
  const totals = new Array(24).fill(0);
  Object.values(activity).forEach(day => {
    const h = day.hourlyActivity;
    if (!h) return;
    for (let i = 0; i < 24; i++) totals[i] += h[i] ?? 0;
  });

  const max = Math.max(...totals, 1);

  root.innerHTML = '';
  for (let h = 0; h < 24; h++) {
    const v = totals[h];
    const heat = v === 0 ? 0 : v < max * .1 ? 1 : v < max * .3 ? 2 : v < max * .6 ? 3 : v < max * .85 ? 4 : 5;
    const cell = document.createElement('div');
    cell.className = 'hh-cell';
    if (heat > 0) cell.setAttribute('data-v', heat);
    const label = h === 0 ? '12a' : h < 12 ? h + 'a' : h === 12 ? '12p' : (h - 12) + 'p';
    cell.addEventListener('mouseenter', e => {
      tip.textContent = label + ': ' + fmt(v) + ' lines';
      tip.style.opacity = '1';
      tip.style.left = (e.clientX + 14) + 'px';
      tip.style.top  = (e.clientY - 32) + 'px';
    });
    cell.addEventListener('mouseleave', () => { tip.style.opacity = '0'; });
    root.appendChild(cell);
  }

  // Labels: show every 3 hours
  lblRoot.innerHTML = '';
  for (let h = 0; h < 24; h++) {
    const el = document.createElement('div');
    el.className = 'hh-label';
    el.textContent = h % 3 === 0 ? (h === 0 ? '12a' : h < 12 ? h+'a' : h === 12 ? '12p' : (h-12)+'p') : '';
    lblRoot.appendChild(el);
  }
}

// \u2500\u2500 28-day bars \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
function buildBars28(activity) {
  const root = document.getElementById('barsRoot');
  if (!root) return;
  const todayD = new Date(); todayD.setHours(0,0,0,0);
  const days = [];
  for (let i = 27; i >= 0; i--) { const d2 = new Date(todayD); d2.setDate(d2.getDate()-i); days.push(d2); }
  const max = Math.max(...days.map(d2 => activity[ds(d2)]?.linesAdded ?? 0), 1);
  const dlabels = ['S','M','T','W','T','F','S'];
  root.innerHTML = days.map((d2, i) => {
    const k = ds(d2); const add = activity[k]?.linesAdded ?? 0; const isT = i === 27;
    const h = Math.max(Math.round((add/max)*60), add > 0 ? 4 : 2);
    return \`<div class="b-col">
      <div class="b-bar add-bar\${isT?' today-bar':''}" style="height:\${h}px" title="\${k}: +\${add} lines"></div>
      <div class="b-lbl\${isT?' today-lbl':''}">\${isT?'\u25BC':dlabels[d2.getDay()]}</div>
    </div>\`;
  }).join('');
}

// \u2500\u2500 All-time bars \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
function buildAllTimeBars(activity) {
  const root = document.getElementById('allTimeBars');
  if (!root) return;
  const sorted = Object.entries(activity).sort((a,b) => a[0].localeCompare(b[0]));
  if (!sorted.length) { root.textContent = 'No data yet'; return; }
  const max = Math.max(...sorted.map(([,d]) => d.linesAdded), 1);
  root.innerHTML = sorted.map(([date, d]) => {
    const h = Math.max(Math.round((d.linesAdded/max)*68), d.linesAdded > 0 ? 3 : 1);
    return \`<div style="flex:1;min-width:4px;display:flex;flex-direction:column;align-items:center;gap:2px">
      <div style="width:100%;min-width:4px;background:rgba(34,217,122,.5);border-radius:2px 2px 0 0;height:\${h}px;cursor:default" title="\${date}: +\${d.linesAdded} lines"></div>
    </div>\`;
  }).join('');
}

// \u2500\u2500 Language chart \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
function buildLangChart(activity, rootId, limit) {
  const root = document.getElementById(rootId);
  if (!root) return;
  const map = {};
  Object.values(activity).forEach(d => {
    Object.entries(d.byLang || {}).forEach(([lang, s]) => {
      if (!map[lang]) map[lang] = { added: 0, removed: 0 };
      map[lang].added += s.linesAdded;
      map[lang].removed += s.linesRemoved;
    });
  });
  const sorted = Object.entries(map).sort((a,b) => b[1].added - a[1].added).slice(0, limit);
  if (!sorted.length) { root.innerHTML = '<div style="color:var(--muted);font-size:12px;padding:8px 0">No data yet</div>'; return; }
  const max = sorted[0][1].added || 1;
  root.innerHTML = sorted.map(([lang, s]) => \`
    <div class="lang-row">
      <div class="lang-name">\${esc(lang)}</div>
      <div class="lang-bar-wrap"><div class="lang-bar-fill" style="width:\${Math.round(s.added/max*100)}%"></div></div>
      <div class="lang-stat">+\${fmt(s.added)}</div>
    </div>
  \`).join('');
}

// \u2500\u2500 Files list \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
function buildFilesList(day) {
  const root = document.getElementById('filesRoot');
  if (!root) return;
  const files = day?.filesEdited ?? [];
  if (!files.length) {
    root.innerHTML = '<div style="color:var(--muted);font-size:12px">No files edited today</div>'; return;
  }
  root.innerHTML = files.slice(0, 12).map(f => \`
    <div style="display:flex;align-items:center;gap:8px;padding:5px 0;border-bottom:1px solid var(--border)">
      <span style="font-size:14px">\u{1F4C4}</span>
      <span style="font-family:var(--mono);font-size:11px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">\${esc(f)}</span>
    </div>
  \`).join('');
}

// \u2500\u2500 Actions \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
function markToday() {
  vscode.postMessage({ type: 'mark_today_manual' });
  celebrate();
  setTimeout(() => vscode.postMessage({ type: 'request_data' }), 200);
}
function exportMd() { vscode.postMessage({ type: 'export_markdown' }); }

// \u2500\u2500 Confetti \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
function celebrate() {
  const cel = document.getElementById('cel');
  const cols = ['#ff5c1a','#ff8c00','#ffc107','#22d97a','#4f9eff','#a855f7'];
  cel.innerHTML = '';
  for (let i = 0; i < 50; i++) {
    const p = document.createElement('div'); p.className = 'cp';
    p.style.cssText = \`left:\${Math.random()*100}vw;background:\${cols[i%6]};animation-duration:\${.8+Math.random()*1.5}s;animation-delay:\${Math.random()*.5}s\`;
    cel.appendChild(p);
  }
  setTimeout(() => { cel.innerHTML = ''; }, 3000);
}

// \u2500\u2500 Helpers \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
function set(id, val) { const el = document.getElementById(id); if (el) el.textContent = val; }

function animCount(id, to, ms) {
  const el = document.getElementById(id); if (!el || to === 0) { if(el) el.textContent = 0; return; }
  let n = 0; const steps = Math.min(30, to);
  const iv = setInterval(() => {
    n++; el.textContent = Math.round(to * n / steps);
    if (n >= steps) { el.textContent = to; clearInterval(iv); }
  }, ms / steps);
}

function todayStr() { return new Date().toISOString().slice(0, 10); }
function ds(d) { return d.toISOString().slice(0, 10); }
function fmt(n) {
  if (n >= 1_000_000) return (n/1_000_000).toFixed(1) + 'M';
  if (n >= 1000) return (n/1000).toFixed(1) + 'k';
  return String(n);
}
function relTime(ts) {
  const d = Date.now() - ts;
  if (d < 60000) return 'just now';
  if (d < 3600000) return Math.floor(d/60000) + 'm ago';
  if (d < 86400000) return Math.floor(d/3600000) + 'h ago';
  return Math.floor(d/86400000) + 'd ago';
}
function esc(s) { return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
</script>
</body>
</html>`;var l=class t{constructor(e,a,i){this.context=e;this.storage=a;this.onMarkManual=i;this.disposables=[];this.panel=y.window.createWebviewPanel("flametrack.stats","\u{1F525} FlameTrack",y.ViewColumn.One,{enableScripts:!0,retainContextWhenHidden:!0}),this.panel.webview.html=fe(),this.sendData(a),this.panel.webview.onDidReceiveMessage(n=>{switch(n.type){case"request_data":this.sendData(a);break;case"mark_today_manual":i(),setTimeout(()=>this.sendData(a),100);break;case"export_markdown":{let o=a.exportMarkdown();y.workspace.openTextDocument({content:o,language:"markdown"}).then(s=>y.window.showTextDocument(s));break}}},null,this.disposables),this.panel.onDidDispose(()=>this.dispose(),null,this.disposables),t.current=this}static show(e,a,i){if(t.current){t.current.panel.reveal(y.ViewColumn.One),t.current.sendData(a);return}new t(e,a,i)}static refresh(e){t.current?.sendData(e)}static sendTabSwitch(e){t.current?.panel.webview.postMessage({type:"switch_tab",tab:e})}sendData(e){let a=e.getData();this.panel.webview.postMessage({type:"data",payload:e.getData(),streakSettings:e.getStreakSettings(),achievementProgress:se(a)})}dispose(){t.current=void 0,this.panel.dispose(),this.disposables.forEach(e=>e.dispose()),this.disposables=[]}};var d;function Ne(t){d=new B(t),d.checkStreakIntegrity();let e=new U(d,"flametrack.openStats");t.subscriptions.push(e),d.onAchievementUnlock(o=>{for(let s of o)g.window.showInformationMessage(`${s.icon} Achievement unlocked: ${s.name} (+${s.xpReward} XP)`,"View Achievements").then(c=>{c==="View Achievements"&&(l.show(t,d,()=>{a.markTodayManual(),e.update(),l.refresh(d)}),setTimeout(()=>{l.sendTabSwitch("achievements")},300))});e.update(),l.refresh(d)});let a=new O(d);a.onSuccess(()=>{e.update(),l.refresh(d)}),a.activate(),t.subscriptions.push({dispose:()=>a.dispose()});let i=new W(d);i.onFlush(()=>{e.update(),l.refresh(d)}),i.activate(),t.subscriptions.push({dispose:()=>i.dispose()}),t.subscriptions.push(g.commands.registerCommand("flametrack.openStats",()=>{l.show(t,d,()=>{a.markTodayManual(),e.update(),l.refresh(d)})}),g.commands.registerCommand("flametrack.markToday",()=>{a.markTodayManual(),e.update(),l.refresh(d)}),g.commands.registerCommand("flametrack.exportMarkdown",()=>{let o=d.exportMarkdown();g.workspace.openTextDocument({content:o,language:"markdown"}).then(s=>g.window.showTextDocument(s))}));let n=setInterval(()=>{d.checkStreakIntegrity(),e.update()},60*60*1e3);t.subscriptions.push({dispose:()=>clearInterval(n)})}function Oe(){d?.flush()}0&&(module.exports={activate,deactivate});
