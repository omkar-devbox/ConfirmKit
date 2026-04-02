import z,{createContext,useMemo,useState,useEffect,useCallback,useContext}from'react';import {createConfirmKit}from'@confirmkit/core';import {createPortal}from'react-dom';import {jsxs,jsx}from'react/jsx-runtime';var p=createContext(null);var r={overlay:{position:"fixed",inset:"0",backgroundColor:"rgba(17, 24, 39, 0.35)",backdropFilter:"blur(6px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999,pointerEvents:"auto"},container:{backgroundColor:"#ffffff",padding:"28px 24px",borderRadius:"18px",width:"100%",maxWidth:"420px",textAlign:"center",boxShadow:"0 10px 25px rgba(0,0,0,0.08), 0 20px 48px rgba(0,0,0,0.12)"},title:{margin:"0 0 8px",fontSize:"1.25rem",fontWeight:600,color:"#111827"},description:{margin:"0 0 24px",fontSize:"0.95rem",color:"#6b7280",lineHeight:"1.5"},actions:{display:"flex",flexDirection:"column",gap:"12px",marginTop:"12px"},confirmButton:{background:"linear-gradient(135deg, #2563eb, #3b82f6)",color:"#fff",boxShadow:"0 6px 14px rgba(37, 99, 235, 0.35)"},cancelButton:{backgroundColor:"#e5edf8",color:"#3b82f6"},icon:{}},k={success:{confirmButton:{background:"linear-gradient(135deg, #10b981, #059669)",boxShadow:"0 6px 14px rgba(16, 185, 129, 0.35)"},icon:{color:"#10b981"}},error:{confirmButton:{background:"linear-gradient(135deg, #ef4444, #dc2626)",boxShadow:"0 6px 14px rgba(239, 68, 68, 0.35)"},icon:{color:"#ef4444"}},warning:{confirmButton:{background:"linear-gradient(135deg, #f59e0b, #d97706)",boxShadow:"0 6px 14px rgba(245, 158, 11, 0.35)"},icon:{color:"#f59e0b"}},info:{confirmButton:{background:"linear-gradient(135deg, #3b82f6, #2563eb)",boxShadow:"0 6px 14px rgba(59, 130, 246, 0.35)"},icon:{color:"#3b82f6"}}},v=`
@keyframes ck-fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes ck-scale-up {
    from { transform: scale(0.9); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
}

.ck-overlay {
    animation: ck-fade-in 0.2s ease-out;
}

.ck-container {
    animation: ck-scale-up 0.25s ease;
}

.ck-btn {
    width: 100%;
    padding: 12px 16px;
    border-radius: 12px;
    font-weight: 600;
    font-size: 0.95rem;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
}

.ck-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}
`;var w=({children:o,container:m})=>{if(typeof window>"u")return null;let e=m||document.body;return createPortal(o,e)};var h=({state:o,confirmAction:m,cancelAction:e})=>{let{options:u,loading:x,presets:C}=o,{title:d,message:n,description:g,confirmText:B,cancelText:I,styles:a,variant:b,icon:y,closeOnEsc:A}=u,c=b&&(C?.[b]||k[b])||{},s=(l,N,E)=>({...l,...N||{},...E||{}}),i={overlay:s(r.overlay,c.overlay,a?.overlay),container:s(r.container,c.container,a?.container),title:s(r.title,c.title,a?.title),description:s(r.description,c.description,a?.description),actions:s(r.actions,c.actions,a?.actions),confirmButton:s(r.confirmButton,c.confirmButton,a?.confirmButton),cancelButton:s(r.cancelButton,c.cancelButton,a?.cancelButton),icon:s(r.icon,c.icon,a?.icon)},R=n||g||"",L=()=>{if(!y)return null;if(z.isValidElement(y))return jsx("div",{style:i.icon,children:y});let l=typeof y=="string"?y:b;return l&&["success","error","warning","info"].includes(l)?jsx("div",{style:i.icon,className:"ck-icon",children:jsx(M,{type:l})}):null};return jsxs(w,{children:[jsx("style",{dangerouslySetInnerHTML:{__html:v}}),jsx("div",{className:"ck-overlay",style:i.overlay,onClick:l=>{l.target===l.currentTarget&&A!==false&&e();},children:jsxs("div",{className:"ck-container",style:i.container,role:"dialog","aria-modal":"true",children:[L(),d&&jsx("h2",{style:i.title,className:"ck-title",children:typeof d=="function"?d(o.context):d}),R&&jsx("div",{style:i.description,className:"ck-description",children:typeof R=="function"?R(o.context):R}),jsxs("div",{style:i.actions,className:"ck-actions",children:[jsx("button",{type:"button",className:"ck-btn ck-btn-confirm",style:i.confirmButton,onClick:m,disabled:x,children:x?"...":B||"OK"}),jsx("button",{type:"button",className:"ck-btn ck-btn-cancel",style:i.cancelButton,onClick:e,disabled:x,children:I||"Cancel"})]})]})})]})},M=({type:o})=>{switch(o){case "success":return jsxs("svg",{xmlns:"http://www.w3.org/2000/svg",width:"48",height:"48",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[jsx("path",{d:"M22 11.08V12a10 10 0 1 1-5.93-9.14"}),jsx("polyline",{points:"22 4 12 14.01 9 11.01"})]});case "error":return jsxs("svg",{xmlns:"http://www.w3.org/2000/svg",width:"48",height:"48",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[jsx("circle",{cx:"12",cy:"12",r:"10"}),jsx("line",{x1:"15",y1:"9",x2:"9",y2:"15"}),jsx("line",{x1:"9",y1:"9",x2:"15",y2:"15"})]});case "warning":return jsxs("svg",{xmlns:"http://www.w3.org/2000/svg",width:"48",height:"48",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[jsx("path",{d:"M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"}),jsx("line",{x1:"12",y1:"9",x2:"12",y2:"13"}),jsx("line",{x1:"12",y1:"17",x2:"12.01",y2:"17"})]});case "info":return jsxs("svg",{xmlns:"http://www.w3.org/2000/svg",width:"48",height:"48",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[jsx("circle",{cx:"12",cy:"12",r:"10"}),jsx("line",{x1:"12",y1:"16",x2:"12",y2:"12"}),jsx("line",{x1:"12",y1:"8",x2:"12.01",y2:"8"})]});default:return null}};function S(o){return {mount:()=>{},update:()=>{},unmount:()=>{}}}function pt({children:o,presets:m}){let e=useMemo(()=>createConfirmKit({presets:m}),[m]),[u,x]=useState(()=>e.getState());useEffect(()=>{let n=S({confirmAction:e.confirmAction,cancelAction:e.cancelAction});e.setRenderer(n);},[e]),useEffect(()=>{let n=e.subscribe(g=>{x(g);});return ()=>{n();}},[e]);let C=useCallback(async n=>{let g=typeof n=="string"?n:{...n,message:n.message||n.description||""};return e.confirm(g)},[e]),d=useMemo(()=>({confirm:C,getState:()=>e.getState()}),[C,e]);return jsxs(p.Provider,{value:d,children:[o,u&&u.status!=="idle"&&jsx(h,{state:u,confirmAction:e.confirmAction,cancelAction:e.cancelAction})]})}function bt(){let o=useContext(p);if(!o)throw new Error("useConfirm must be used within a ConfirmProvider");return o.confirm}function wt(){let o=useContext(p);if(!o)throw new Error("useConfirmState must be used within a ConfirmProvider");return o.getState()}var q=createConfirmKit(),Tt=o=>q.confirm(o);
export{h as ConfirmDialog,pt as ConfirmProvider,Tt as confirm,r as defaultStyles,bt as useConfirm,wt as useConfirmState};//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map