(()=>{var e={};e.id=378,e.ids=[378],e.modules={2934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},4580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},5869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},4161:(e,t,a)=>{"use strict";a.r(t),a.d(t,{GlobalError:()=>o.a,__next_app__:()=>p,originalPathname:()=>m,pages:()=>d,routeModule:()=>h,tree:()=>c}),a(5144),a(9095),a(1506),a(5866);var s=a(3191),i=a(8716),r=a(7922),o=a.n(r),n=a(5231),l={};for(let e in n)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(l[e]=()=>n[e]);a.d(t,l);let c=["",{children:["edit",{children:["image-text",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(a.bind(a,5144)),"/root/.openclaw/workspace/mediaprompt-ai/frontend/app/edit/image-text/page.tsx"]}]},{}]},{layout:[()=>Promise.resolve().then(a.bind(a,9095)),"/root/.openclaw/workspace/mediaprompt-ai/frontend/app/edit/layout.tsx"]}]},{layout:[()=>Promise.resolve().then(a.bind(a,1506)),"/root/.openclaw/workspace/mediaprompt-ai/frontend/app/layout.tsx"],"not-found":[()=>Promise.resolve().then(a.t.bind(a,5866,23)),"next/dist/client/components/not-found-error"]}],d=["/root/.openclaw/workspace/mediaprompt-ai/frontend/app/edit/image-text/page.tsx"],m="/edit/image-text/page",p={require:a,loadChunk:()=>Promise.resolve()},h=new s.AppPageRouteModule({definition:{kind:i.x.APP_PAGE,page:"/edit/image-text/page",pathname:"/edit/image-text",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:c}})},3036:(e,t,a)=>{Promise.resolve().then(a.bind(a,349))},349:(e,t,a)=>{"use strict";a.r(t),a.d(t,{default:()=>d});var s=a(326),i=a(7577),r=a(4260);let o={zh:[{id:"xiaohongshu-1",platform:"小红书",name:"种草推荐",icon:"\uD83D\uDCD5",structure:`标题：{{emoji}}被问爆的{{product}}，真的绝了！

姐妹们！今天必须跟你们分享这个{{product}}！

{{emoji}}使用场景：{{scene}}
{{emoji}}核心卖点：
{{features}}

{{emoji}}使用感受：{{experience}}

{{emoji}}小贴士：{{tips}}

{{hashtags}}

#{{productCategory}} #好物分享 #{{topic}}`,fields:["product","scene","features","experience","tips","hashtags","productCategory","topic","emoji"],example:{product:"神仙高光",scene:"日常通勤和约会都超适合",features:"• 粉质细腻不飞粉\n• 上脸自然水光感\n• 持久度能打8小时",experience:"用了两个月，每次都被问色号！",tips:"建议少量多次叠加更自然",hashtags:"#平价高光 #学生党必备",productCategory:"美妆",topic:"妆容分享",emoji:"✨"}},{id:"douyin-1",platform:"抖音",name:"短视频文案",icon:"\uD83C\uDFB5",structure:`{{hook}}（前3秒抓住眼球）

{{problem}}（痛点共鸣）

{{solution}}（解决方案）

{{proof}}（效果展示）

{{cta}}（行动号召）

{{hashtags}}`,fields:["hook","problem","solution","proof","cta","hashtags"],example:{hook:"用了这个方法，我真的瘦了20斤！",problem:"你是不是也试过无数减肥方法都没用？",solution:"其实只需要坚持这三点...",proof:"看这是我的前后对比！",cta:"点赞关注，下一期分享详细教程",hashtags:"#减肥逆袭 #变美秘籍"}},{id:"weibo-1",platform:"微博",name:"热点话题",icon:"\uD83D\uDCF1",structure:`【{{topic}}】

{{content}}

{{emoji}} {{keyPoint}}

{{emoji}} {{opinion}}

{{emoji}} {{question}}

{{emoji}} {{interaction}}

{{hashtags}}

转发抽{{prize}}！`,fields:["topic","content","keyPoint","opinion","question","interaction","hashtags","prize","emoji"],example:{topic:"2024最值得看的电影",content:"整理了一份年度片单，每一部都是心头好",keyPoint:"悬疑片爱好者必看",opinion:"个人最喜欢第三部",question:"你们今年看了哪些好电影？",interaction:"评论区聊聊",hashtags:"#电影推荐 #年度盘点",prize:"电影票2张",emoji:"\uD83C\uDFAC"}},{id:"wechat-1",platform:"朋友圈",name:"生活分享",icon:"\uD83D\uDCAC",structure:`{{emoji}} {{location}}

{{moment}}

{{feeling}}

{{emoji}} {{detail}}

{{emoji}} {{reflection}}

—— {{signature}}`,fields:["location","moment","feeling","detail","reflection","signature","emoji"],example:{location:"上海\xb7外滩",moment:"傍晚的江风，吹散了所有的疲惫",feeling:"这一刻，觉得生活真好",detail:"对岸的灯火璀璨，像梦里的场景",reflection:"有时候慢下来，才能看清方向",signature:"2024.3.20",emoji:"\uD83C\uDF06"}}],en:[{id:"instagram-1",platform:"Instagram",name:"Lifestyle Post",icon:"\uD83D\uDCF8",structure:`{{emoji}} {{caption}}

{{story}}

✨ {{highlight1}}
✨ {{highlight2}}
✨ {{highlight3}}

{{cta}}

{{hashtags}}`,fields:["caption","story","highlight1","highlight2","highlight3","cta","hashtags","emoji"],example:{caption:"Sunday morning vibes",story:"Waking up to this view never gets old",highlight1:"Fresh coffee",highlight2:"Good book",highlight3:"Zero plans",cta:"How do you spend your Sundays?",hashtags:"#sundayvibes #lifestyle",emoji:"☕"}},{id:"twitter-1",platform:"Twitter/X",name:"Quick Thread",icon:"\uD83D\uDC26",structure:`🧵 {{hook}}

1/ {{point1}}

2/ {{point2}}

3/ {{point3}}

{{conclusion}}

{{cta}}`,fields:["hook","point1","point2","point3","conclusion","cta"],example:{hook:"3 lessons I learned from failing my first startup:",point1:"Your first idea is rarely the best",point2:"Talk to users before building",point3:"Speed matters more than perfection",conclusion:"Failure taught me more than success ever could",cta:"What did failure teach you?"}},{id:"tiktok-1",platform:"TikTok",name:"Viral Script",icon:"\uD83C\uDFB5",structure:`{{hook}} (0-3 sec)

{{setup}} (3-10 sec)

{{climax}} (10-25 sec)

{{cta}} (end)

——
Text overlay: {{textOverlay}}
Sound: {{sound}}`,fields:["hook","setup","climax","cta","textOverlay","sound"],example:{hook:"POV: You found the life hack",setup:"So I was scrolling and saw this trick",climax:"Tried it and it actually worked!",cta:"Follow for more life hacks",textOverlay:"Wait for it...",sound:" trending sound"}}]},n=e=>o[e]||o.zh,l=e=>[...o.zh,...o.en].find(t=>t.id===e),c=(e,t)=>{let a=e;return Object.entries(t).forEach(([e,t])=>{a=a.replace(RegExp(`{{${e}}}`,"g"),t||"")}),a=a.replace(/\{\{[^}]+\}\}/g,"")};function d(){let[e,t]=(0,i.useState)("zh"),[a,o]=(0,i.useState)(null),[d,m]=(0,i.useState)([]),[p,h]=(0,i.useState)(""),[u,x]=(0,i.useState)({}),[g,f]=(0,i.useState)(!1),j=n(e),y="zh"===e?[{name:"小红书",icon:"\uD83D\uDCD5",ids:j.filter(e=>"小红书"===e.platform).map(e=>e.id)},{name:"抖音",icon:"\uD83C\uDFB5",ids:j.filter(e=>"抖音"===e.platform).map(e=>e.id)},{name:"微博",icon:"\uD83D\uDCF1",ids:j.filter(e=>"微博"===e.platform).map(e=>e.id)},{name:"朋友圈",icon:"\uD83D\uDCAC",ids:j.filter(e=>"朋友圈"===e.platform).map(e=>e.id)}]:[{name:"Instagram",icon:"\uD83D\uDCF8",ids:j.filter(e=>"Instagram"===e.platform).map(e=>e.id)},{name:"Twitter/X",icon:"\uD83D\uDC26",ids:j.filter(e=>"Twitter/X"===e.platform).map(e=>e.id)},{name:"TikTok",icon:"\uD83C\uDFB5",ids:j.filter(e=>"TikTok"===e.platform).map(e=>e.id)}],b=e=>{let t=l(e);t&&(o(e),t.example?(h(c(t.structure,t.example)),x(t.example)):(h(""),x({})))},D=(e,t)=>{let s={...u,[e]:t};x(s);let i=l(a);i&&h(c(i.structure,s))},v=(0,i.useCallback)(e=>{e.preventDefault(),Array.from(e.dataTransfer.files).filter(e=>e.type.startsWith("image/")).forEach(e=>{let t=new FileReader;t.onload=e=>{m(t=>[...t,e.target?.result])},t.readAsDataURL(e)})},[]),w=e=>{m(t=>t.filter((t,a)=>a!==e))},N=async()=>{try{await navigator.clipboard.writeText(p),f(!0),setTimeout(()=>f(!1),2e3)}catch(e){console.error("复制失败:",e)}},k=e=>{let t={wechat:"weixin://",xiaohongshu:"https://creator.xiaohongshu.com/creator/post",douyin:"https://creator.douyin.com/",weibo:"https://weibo.com/compose",twitter:"https://twitter.com/compose",instagram:"https://instagram.com/"};t[e]&&window.open(t[e],"_blank")};return s.jsx(r.default,{title:"zh"===e?"图文编辑":"Image & Text Editor",currentPath:"image-text",children:s.jsx("div",{className:"p-6 max-w-[1200px] mx-auto",children:(0,s.jsxs)("div",{className:"grid grid-cols-4 gap-6",children:[(0,s.jsxs)("div",{className:"col-span-1 bg-white rounded-xl p-4 shadow-sm",children:[s.jsx("h2",{className:"text-sm font-semibold text-gray-700 mb-4",children:"zh"===e?"选择模板":"Select Template"}),y.map(e=>(0,s.jsxs)("div",{className:"mb-4",children:[(0,s.jsxs)("div",{className:"flex items-center gap-2 mb-2",children:[s.jsx("span",{children:e.icon}),s.jsx("span",{className:"text-xs font-medium text-gray-600",children:e.name})]}),s.jsx("div",{className:"space-y-1",children:j.filter(t=>e.ids.includes(t.id)).map(e=>s.jsx("button",{onClick:()=>b(e.id),className:`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${a===e.id?"bg-indigo-50 text-indigo-700 border border-indigo-200":"text-gray-600 hover:bg-gray-50"}`,children:e.name},e.id))})]},e.name))]}),(0,s.jsxs)("div",{className:"col-span-2 space-y-4",children:[a&&(0,s.jsxs)("div",{className:"bg-white rounded-xl p-4 shadow-sm",children:[s.jsx("h2",{className:"text-sm font-semibold text-gray-700 mb-4",children:"zh"===e?"编辑内容":"Edit Content"}),s.jsx("div",{className:"space-y-3",children:l(a)?.fields.map(e=>s.jsxs("div",{children:[s.jsx("label",{className:"text-xs text-gray-500 mb-1 block",children:e}),s.jsx("textarea",{value:u[e]||"",onChange:t=>D(e,t.target.value),placeholder:`${e}...`,className:"w-full p-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none",rows:2})]},e))})]}),(0,s.jsxs)("div",{className:"bg-white rounded-xl p-4 shadow-sm",children:[(0,s.jsxs)("div",{className:"flex items-center justify-between mb-4",children:[s.jsx("h2",{className:"text-sm font-semibold text-gray-700",children:"zh"===e?"文案编辑":"Text Editor"}),s.jsx("button",{onClick:N,className:"text-xs text-indigo-600 hover:text-indigo-700",children:g?"✓ 已复制":"zh"===e?"一键复制":"Copy"})]}),s.jsx("textarea",{value:p,onChange:e=>h(e.target.value),placeholder:"zh"===e?"选择模板后开始编辑...":"Select a template to start editing...",className:"w-full h-48 p-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"})]}),(0,s.jsxs)("div",{className:"bg-white rounded-xl p-4 shadow-sm",children:[s.jsx("h2",{className:"text-sm font-semibold text-gray-700 mb-4",children:"zh"===e?"上传图片":"Upload Images"}),s.jsx("div",{onDragOver:e=>e.preventDefault(),onDrop:v,className:"border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:border-indigo-300 transition-colors",children:d.length>0?(0,s.jsxs)("div",{className:"grid grid-cols-3 gap-2",children:[d.map((e,t)=>(0,s.jsxs)("div",{className:"relative group",children:[s.jsx("img",{src:e,alt:"",className:"w-full h-24 object-cover rounded-lg"}),s.jsx("button",{onClick:()=>w(t),className:"absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity",children:s.jsx("svg",{className:"w-3 h-3",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:s.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M6 18L18 6M6 6l12 12"})})})]},t)),s.jsx("div",{className:"border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center h-24 cursor-pointer hover:bg-gray-50",children:s.jsx("span",{className:"text-2xl text-gray-300",children:"+"})})]}):(0,s.jsxs)(s.Fragment,{children:[s.jsx("p",{className:"text-gray-400 text-sm",children:"zh"===e?"拖拽图片到这里，或点击上传":"Drag images here, or click to upload"}),s.jsx("p",{className:"text-gray-300 text-xs mt-1",children:"PNG, JPG, GIF"})]})}),s.jsx("input",{type:"file",accept:"image/*",multiple:!0,className:"hidden",onChange:e=>{Array.from(e.target.files||[]).forEach(e=>{let t=new FileReader;t.onload=e=>{m(t=>[...t,e.target?.result])},t.readAsDataURL(e)})}})]})]}),(0,s.jsxs)("div",{className:"col-span-1 space-y-4",children:[(0,s.jsxs)("div",{className:"bg-white rounded-xl p-4 shadow-sm",children:[s.jsx("h2",{className:"text-sm font-semibold text-gray-700 mb-4",children:"zh"===e?"预览效果":"Preview"}),s.jsx("div",{className:"bg-gray-100 rounded-lg p-4 min-h-[300px]",children:p||d.length>0?(0,s.jsxs)("div",{className:"space-y-3",children:[d.map((e,t)=>s.jsx("img",{src:e,alt:"",className:"w-full rounded-lg"},t)),p.split("\n").map((e,t)=>s.jsx("p",{className:"text-sm text-gray-700 whitespace-pre-wrap",children:e},t))]}):s.jsx("p",{className:"text-gray-400 text-sm text-center",children:"预览区域"})})]}),(0,s.jsxs)("div",{className:"bg-white rounded-xl p-4 shadow-sm",children:[s.jsx("h2",{className:"text-sm font-semibold text-gray-700 mb-4",children:"zh"===e?"一键分享":"Share"}),s.jsx("div",{className:"grid grid-cols-3 gap-2",children:"zh"===e?(0,s.jsxs)(s.Fragment,{children:[(0,s.jsxs)("button",{onClick:()=>k("wechat"),className:"flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-50",children:[s.jsx("span",{className:"text-xl",children:"\uD83D\uDCAC"}),s.jsx("span",{className:"text-xs text-gray-600",children:"微信"})]}),(0,s.jsxs)("button",{onClick:()=>k("xiaohongshu"),className:"flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-50",children:[s.jsx("span",{className:"text-xl",children:"\uD83D\uDCD5"}),s.jsx("span",{className:"text-xs text-gray-600",children:"小红书"})]}),(0,s.jsxs)("button",{onClick:()=>k("douyin"),className:"flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-50",children:[s.jsx("span",{className:"text-xl",children:"\uD83C\uDFB5"}),s.jsx("span",{className:"text-xs text-gray-600",children:"抖音"})]}),(0,s.jsxs)("button",{onClick:()=>k("weibo"),className:"flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-50",children:[s.jsx("span",{className:"text-xl",children:"\uD83D\uDCF1"}),s.jsx("span",{className:"text-xs text-gray-600",children:"微博"})]})]}):(0,s.jsxs)(s.Fragment,{children:[(0,s.jsxs)("button",{onClick:()=>k("instagram"),className:"flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-50",children:[s.jsx("span",{className:"text-xl",children:"\uD83D\uDCF8"}),s.jsx("span",{className:"text-xs text-gray-600",children:"Instagram"})]}),(0,s.jsxs)("button",{onClick:()=>k("twitter"),className:"flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-50",children:[s.jsx("span",{className:"text-xl",children:"\uD83D\uDC26"}),s.jsx("span",{className:"text-xs text-gray-600",children:"Twitter"})]}),(0,s.jsxs)("button",{onClick:()=>k("tiktok"),className:"flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-50",children:[s.jsx("span",{className:"text-xl",children:"\uD83C\uDFB5"}),s.jsx("span",{className:"text-xs text-gray-600",children:"TikTok"})]})]})})]})]})]})})})}},5144:(e,t,a)=>{"use strict";a.r(t),a.d(t,{default:()=>s});let s=(0,a(8570).createProxy)(String.raw`/root/.openclaw/workspace/mediaprompt-ai/frontend/app/edit/image-text/page.tsx#default`)}};var t=require("../../../webpack-runtime.js");t.C(e);var a=e=>t(t.s=e),s=t.X(0,[819,546],()=>a(4161));module.exports=s})();