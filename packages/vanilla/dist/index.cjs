'use strict';var core=require('@confirmkit/core'),confirm_controller=require('@confirmkit/core/engine/confirm.controller'),confirm_state=require('@confirmkit/core/engine/confirm.state'),confirm_queue=require('@confirmkit/core/engine/confirm.queue'),renderer=require('@confirmkit/core/dom/renderer'),scrollLock=require('@confirmkit/core/a11y/scroll-lock'),focusRestore=require('@confirmkit/core/a11y/focus-restore'),focusTrap=require('@confirmkit/core/a11y/focus-trap'),keyboard=require('@confirmkit/core/a11y/keyboard'),portal=require('@confirmkit/core/dom/portal');function h(){return portal.createPortalManager({zIndex:9999})}function v(e,...t){let m={...e};for(let i of t)if(i){for(let n in i)if(Object.prototype.hasOwnProperty.call(i,n)){let o=n,a=i[o];a!=null&&(m[o]=a);}}return m}function s(e,t,...m){if(!e)return;let i=v(t||{},...m);Object.keys(i).length>0&&Object.assign(e.style,i);}var S="confirmkit-vanilla-styles";function w(e){if(typeof document>"u"||document.getElementById(S))return;let t=document.createElement("style");t.id=S,t.textContent=e,document.head.appendChild(t);}function B(){if(typeof document>"u")return;let e=document.getElementById(S);e&&e.remove();}var p={overlay:{position:"fixed",inset:"0",background:"rgba(17, 24, 39, 0.35)",backdropFilter:"blur(6px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:"9999",pointerEvents:"auto"},container:{background:"#ffffff",padding:"28px 24px",borderRadius:"18px",width:"100%",maxWidth:"420px",textAlign:"center",boxShadow:"0 10px 25px rgba(0,0,0,0.08), 0 20px 48px rgba(0,0,0,0.12)"},title:{margin:"0 0 8px",fontSize:"1.25rem",fontWeight:"600",color:"#111827"},description:{margin:"0 0 24px",fontSize:"0.95rem",color:"#6b7280",lineHeight:"1.5"},actions:{display:"flex",flexDirection:"column",gap:"12px",marginTop:"12px"},confirmButton:{background:"linear-gradient(135deg, #2563eb, #3b82f6)",color:"#fff",boxShadow:"0 6px 14px rgba(37, 99, 235, 0.35)"},cancelButton:{background:"#e5edf8",color:"#3b82f6"},icon:{}},E=`
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

.ck-btn-confirm:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 20px rgba(37, 99, 235, 0.45);
}

.ck-btn-cancel:hover {
    background: #dbeafe;
}

.ck-icon, .ck-icon-custom {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 auto 16px;
    animation: ck-scale-up 0.3s ease-out;
}

@keyframes ck-fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes ck-scale-up {
    from { transform: scale(0.9); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
}
`;var H={success:{confirmButton:{background:"linear-gradient(135deg, #10b981, #059669)",boxShadow:"0 6px 14px rgba(16, 185, 129, 0.35)"},icon:{color:"#10b981"}},error:{confirmButton:{background:"linear-gradient(135deg, #ef4444, #dc2626)",boxShadow:"0 6px 14px rgba(239, 68, 68, 0.35)"},icon:{color:"#ef4444"}},warning:{confirmButton:{background:"linear-gradient(135deg, #f59e0b, #d97706)",boxShadow:"0 6px 14px rgba(245, 158, 11, 0.35)"},icon:{color:"#f59e0b"}},info:{confirmButton:{background:"linear-gradient(135deg, #3b82f6, #2563eb)",boxShadow:"0 6px 14px rgba(59, 130, 246, 0.35)"},icon:{color:"#3b82f6"}}};function T(e,t){if(e)return t?.[e]||H[e]}var R={success:'<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>',error:'<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>',warning:'<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',info:'<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>'};function N(e){let t=document.createElement("div");return t.className="ck-icon",t.innerHTML=R[e],t}function I(e){if(!e)return null;if(e instanceof HTMLElement)return e;if(typeof e=="string"){if(Object.keys(R).includes(e))return N(e);let t=document.createElement("div");return t.className="ck-icon-custom",t.innerHTML=e,t}return null}function V(e){e&&e.remove(),B();}function b(e){let{getState:t,confirmAction:m,cancelAction:i}=e,n=null,o=null;return {mount:a=>{let u=t();if(!u)return;let r=u.options,c=r.styles,L=!!c,D=r.variant,f=T(D,u.presets);L||w(E),n=document.createElement("div"),n.className="ck-overlay",s(n,p.overlay,f?.overlay,c?.overlay),n.onclick=M=>{M.target===n&&r.closeOnEsc!==false&&i();};let l=document.createElement("div");l.setAttribute("role","dialog"),l.setAttribute("aria-modal","true"),l.className="ck-container",s(l,p.container,f?.container,c?.container),n.appendChild(l);let C=I(r.icon);C&&(s(C,f?.icon,c?.icon),l.appendChild(C));let g=document.createElement("h2");g.className="ck-title",g.textContent=typeof r.title=="function"?r.title(u.context):r.title||"",s(g,p.title,f?.title,c?.title),l.appendChild(g);let y=document.createElement("p");y.className="ck-description",y.textContent=typeof r.message=="function"?r.message(u.context):r.message||"",s(y,p.description,f?.description,c?.description),l.appendChild(y);let x=document.createElement("div");x.className="ck-actions",s(x,p.actions,f?.actions,c?.actions),l.appendChild(x);let d=document.createElement("button");d.type="button",d.className="ck-btn ck-btn-cancel",d.textContent=r.cancelText||"Cancel",d.onclick=i,s(d,p.cancelButton,f?.cancelButton,c?.cancelButton),x.appendChild(d),o=document.createElement("button"),o.type="button",o.className="ck-btn ck-btn-confirm",o.textContent=r.confirmText||"OK",o.onclick=m,s(o,p.confirmButton,f?.confirmButton,c?.confirmButton),x.appendChild(o),a.appendChild(n);},update:()=>{let a=t();!a||!o||(o.disabled=a.loading,a.loading?o.textContent="...":o.textContent=a.options.confirmText||"OK");},unmount:()=>{V(n),n=null,o=null;}}}var O=confirm_state.createState(),U=confirm_queue.createQueue(),P=h(),A=renderer.createRenderer(P),G=scrollLock.createScrollLock(),J=focusRestore.createFocusRestorer(),X=focusTrap.createFocusTrap(),Z=keyboard.createKeyboardHandler(),k=confirm_controller.createController({state:O,queue:U,renderer:A,scrollLock:G,focusRestorer:J,focusTrap:X,keyboard:Z,portal:P});A.setAdapter(b({getState:O.getState,confirmAction:k.confirmAction,cancelAction:k.cancelAction}));async function Oe(e){let t=typeof e=="string"?{message:e,title:"Confirm"}:{...e,message:e.message||e.description||""};return k.open({confirmText:"OK",cancelText:"Cancel",closeOnEsc:true,...t})}function ee(e){let t=core.createConfirmKit(e);t.setRenderer(b({getState:t.getState,confirmAction:t.confirmAction,cancelAction:t.cancelAction}));let m=t.confirm;return {...t,confirm:n=>{let o=typeof n=="string"?n:{...n,message:n.message||n.description||""};return m(o)}}}var Pe=ee;var Le={adapterName:"vanilla"};
exports.BUILT_IN_PRESETS=H;exports.applyStyles=s;exports.cleanupDom=V;exports.confirm=Oe;exports.controller=k;exports.createBuiltInIcon=N;exports.createConfirm=Pe;exports.createConfirmKit=ee;exports.createPortal=h;exports.createVanillaRenderer=b;exports.defaultCSS=E;exports.defaultStyles=p;exports.injectDefaultStyles=w;exports.internalContext=Le;exports.mergeStyles=v;exports.removeDefaultStyles=B;exports.resolveIcon=I;exports.resolvePreset=T;//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map