import{a as U}from"./pageExtractor.js";import{g as j,S as _,a as C,n as v,b as V,f as W}from"./storageService.js";(function(){if(typeof window<"u"&&window.self!==window.top)return;const k=document.getElementById("compare-anything-fab-root");if(k)try{k.remove()}catch{}const e=document.createElement("div");e.id="compare-anything-fab-root",e.style.position="fixed",e.style.zIndex="2147483647",e.style.bottom="26px",e.style.right="26px",e.style.pointerEvents="none",e.style.setProperty("display","none","important"),e.style.setProperty("visibility","hidden","important"),e.style.setProperty("opacity","0","important"),e.setAttribute("hidden",""),e.classList.add("fab-hidden");const P=e.attachShadow({mode:"open"}),E=document.createElement("style");E.textContent=`
    :host([hidden]),
    :host(.fab-hidden),
    .fab-wrapper.fab-hidden {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    }

    .fab-wrapper {
      position: relative;
      pointer-events: auto;
      user-select: none;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 12px;
    }

    /* Floating Red Circular Button */
    .fab-button {
      width: 52px;
      height: 52px;
      border-radius: 50%;
      background: linear-gradient(135deg, #ff4b4b 0%, #dc2626 100%);
      color: #ffffff;
      border: 2px solid rgba(255, 255, 255, 0.45);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 6px 22px rgba(220, 38, 38, 0.5), 0 2px 8px rgba(0, 0, 0, 0.2);
      transition: transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.22s ease, background 0.25s ease;
      position: relative;
      outline: none;
      -webkit-tap-highlight-color: transparent;
      touch-action: none;
    }

    .fab-button:hover {
      transform: translateY(-3px) scale(1.08);
      box-shadow: 0 10px 28px rgba(220, 38, 38, 0.65), 0 4px 12px rgba(0, 0, 0, 0.25);
      background: linear-gradient(135deg, #f87171 0%, #ef4444 100%);
    }

    .fab-button:active {
      transform: scale(0.94);
      box-shadow: 0 4px 14px rgba(220, 38, 38, 0.4);
    }

    .fab-button.is-added {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      box-shadow: 0 6px 22px rgba(16, 185, 129, 0.5), 0 2px 8px rgba(0, 0, 0, 0.2);
      border-color: rgba(255, 255, 255, 0.6);
    }

    .fab-button.is-added:hover {
      background: linear-gradient(135deg, #34d399 0%, #10b981 100%);
      box-shadow: 0 10px 28px rgba(16, 185, 129, 0.65);
    }

    .fab-icon-svg {
      width: 25px;
      height: 25px;
      stroke: #ffffff;
      stroke-width: 2.2;
      stroke-linecap: round;
      stroke-linejoin: round;
      fill: none;
      transition: transform 0.22s ease;
    }

    .fab-button:hover .fab-icon-svg {
      transform: scale(1.06);
    }

    /* Counter Badge on top-right */
    .fab-badge {
      position: absolute;
      top: -3px;
      right: -3px;
      background: #0f172a;
      color: #ffffff;
      font-size: 11px;
      font-weight: 800;
      min-width: 22px;
      height: 22px;
      border-radius: 11px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 5px;
      border: 2px solid #ffffff;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
      transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    /* Tooltip */
    .fab-tooltip {
      position: absolute;
      right: 66px;
      background: #0f172a;
      color: #ffffff;
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
      white-space: nowrap;
      pointer-events: none;
      opacity: 0;
      transform: translateX(8px);
      transition: opacity 0.2s ease, transform 0.2s ease;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.15);
    }

    .fab-wrapper:hover .fab-tooltip {
      opacity: 1;
      transform: translateX(0);
    }

    /* Sleek Floating Toast Card */
    .fab-toast {
      position: absolute;
      bottom: 68px;
      right: 0;
      width: 335px;
      background: #0f172a;
      color: #ffffff;
      border-radius: 14px;
      padding: 14px 16px;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.45), 0 4px 12px rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.15);
      opacity: 0;
      transform: translateY(14px) scale(0.96);
      pointer-events: none;
      transition: opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1), transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      display: flex;
      flex-direction: column;
      gap: 8px;
      z-index: 10;
    }

    .fab-toast.show {
      opacity: 1;
      transform: translateY(0) scale(1);
      pointer-events: auto;
    }

    .toast-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 13px;
      font-weight: 700;
      gap: 6px;
    }

    .toast-status-row {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .toast-title {
      font-size: 12px;
      color: #94a3b8;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .toast-actions {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-top: 6px;
    }

    .toast-btn-compare {
      flex: 1.2;
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      color: #ffffff;
      border: none;
      border-radius: 8px;
      padding: 8px 10px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      white-space: nowrap;
      transition: background 0.18s ease, transform 0.18s ease, box-shadow 0.18s ease;
      box-shadow: 0 2px 6px rgba(239, 68, 68, 0.35);
    }

    .toast-btn-compare:hover {
      background: linear-gradient(135deg, #f87171 0%, #ef4444 100%);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.45);
    }

    .toast-btn-clear {
      flex: 1;
      background: rgba(239, 68, 68, 0.15);
      color: #fca5a5;
      border: 1px solid rgba(239, 68, 68, 0.35);
      border-radius: 8px;
      padding: 8px 10px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      white-space: nowrap;
      transition: background 0.18s ease, color 0.18s ease, border-color 0.18s ease, transform 0.18s ease;
    }

    .toast-btn-clear:hover {
      background: rgba(239, 68, 68, 0.32);
      color: #ffffff;
      border-color: rgba(239, 68, 68, 0.6);
      transform: translateY(-1px);
    }

    .toast-btn-close {
      background: rgba(255, 255, 255, 0.1);
      color: #cbd5e1;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 8px;
      padding: 8px 12px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
      transition: background 0.18s ease, color 0.18s ease, transform 0.18s ease;
    }

    .toast-btn-close:hover {
      background: rgba(255, 255, 255, 0.2);
      color: #ffffff;
      transform: translateY(-1px);
    }
  `;const L=`
    <svg class="fab-icon-svg" viewBox="0 0 24 24">
      <rect x="3" y="4" width="7" height="16" rx="1.5"></rect>
      <rect x="14" y="10" width="7" height="10" rx="1.5"></rect>
      <path d="M14 4h4a2 2 0 0 1 2 2v2"></path>
      <line x1="17" y1="1" x2="17" y2="7"></line>
    </svg>
  `,X=`
    <svg class="fab-icon-svg" viewBox="0 0 24 24">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  `,l=document.createElement("div");l.className="fab-wrapper";const p=document.createElement("div");p.className="fab-tooltip",p.textContent="Add to Compare (Click)";const o=document.createElement("button");o.className="fab-button",o.title="Compare Anything — Click to Add",o.innerHTML=L;const d=document.createElement("div");d.className="fab-badge",d.textContent="0",d.style.display="none",o.appendChild(d);const a=document.createElement("div");a.className="fab-toast",a.innerHTML=`
    <div class="toast-header">
      <div class="toast-status-row">
        <span class="toast-status-text">✓ Added to Comparison!</span>
      </div>
      <span class="toast-count-text" style="font-size: 11px; color: #cbd5e1;">(1/4)</span>
    </div>
    <div class="toast-title"></div>
    <div class="toast-actions">
      <button class="toast-btn-compare">Compare Now ➔</button>
      <button class="toast-btn-clear">Clear All</button>
      <button class="toast-btn-close">Close</button>
    </div>
  `,l.appendChild(p),l.appendChild(a),l.appendChild(o),P.appendChild(E),P.appendChild(l);let A=!1,D=null,f=null,b=!1;function x(t){if(b=t,t){e.removeAttribute("hidden"),e.classList.remove("fab-hidden"),e.style.setProperty("display","block","important"),e.style.setProperty("visibility","visible","important"),e.style.setProperty("opacity","1","important"),e.style.setProperty("pointer-events","none","important"),l.style.removeProperty("display"),l.classList.remove("fab-hidden"),o.style.removeProperty("display"),p.style.removeProperty("display"),a.style.removeProperty("display");const n=document.body||document.documentElement;n&&!e.parentElement&&n.appendChild(e),h()}else if(e.style.setProperty("display","none","important"),e.style.setProperty("visibility","hidden","important"),e.style.setProperty("opacity","0","important"),e.style.setProperty("pointer-events","none","important"),e.setAttribute("hidden",""),e.classList.add("fab-hidden"),l.style.setProperty("display","none","important"),l.classList.add("fab-hidden"),o.style.setProperty("display","none","important"),p.style.setProperty("display","none","important"),a.style.setProperty("display","none","important"),a.classList.remove("show"),f&&(clearTimeout(f),f=null),e.parentElement)try{e.remove()}catch{}}j().then(t=>{x(t)}).catch(()=>{x(!1)}),window.addEventListener("focus",()=>{j().then(t=>{x(t)}).catch(()=>{})});async function h(){if(b)try{const t=await C(),n=window.location.href,s=v(n),i=t.pages.length;d.textContent=String(i),d.style.display=i>0?"flex":"none";const r=t.pages.find(c=>v(c.url)===s);A=!!r,D=r?r.id:null,A?(o.classList.add("is-added"),o.innerHTML=X,o.appendChild(d),p.textContent=`Page Added (${i}/4) — Click to view`):(o.classList.remove("is-added"),o.innerHTML=L,o.appendChild(d),p.textContent=i>0?`Add to Compare (${i}/4 added)`:"Add to Compare (Click)")}catch(t){console.error("Failed to update compare widget state:",t)}}function g(t,n,s,i=!1,r=!0){if(!b)return;const c=document.body||document.documentElement;c&&!e.parentElement&&c.appendChild(e),f&&clearTimeout(f);const u=a.querySelector(".toast-status-text"),m=a.querySelector(".toast-title"),H=a.querySelector(".toast-count-text"),I=a.querySelector(".toast-btn-compare"),N=a.querySelector(".toast-btn-clear"),$=a.querySelector(".toast-btn-close");u&&(u.textContent=t,u.style.color=i?"#f87171":"#34d399"),m&&(m.textContent=n),H&&(H.textContent=s),I&&(I.style.display=r?"flex":"none"),N&&(N.style.display=r?"flex":"none"),$&&($.style.display="block"),a.classList.add("show"),f=setTimeout(()=>{a.classList.remove("show")},5e3)}async function S(){if(b)try{const t=await C(),n=window.location.href,s=v(n);if(t.pages.find(m=>v(m.url)===s)){g("✓ Already in Comparison!",document.title||"This Webpage",`(${t.pages.length}/4 pages)`,!1,!0);return}if(t.pages.length>=4){g("⚠️ Maximum 4 pages reached!","You already have 4 pages selected. Click Compare Now to see your side-by-side analysis, or Clear All to start fresh.","(4/4)",!0,!0);return}const r=U(),c={id:`page-${t.pages.length+1}`,url:r.url,domain:r.domain,title:r.title,description:r.description,structuredData:r.structuredData,importantText:r.importantText,capturedAt:r.capturedAt},u=await V(c);if(u.success){await h();const m=await C();g("✓ Added to Comparison!",c.title||"Page added",`(${m.pages.length}/4 pages)`,!1,!0)}else g("Note:",u.message||"Could not add page.",`(${t.pages.length}/4)`,!0,!1)}catch(t){console.error("Error adding page to comparison:",t),g("Extraction error","Could not capture enough details from this page.","",!0,!1)}}async function R(){try{await W(),await h(),g("✓ All Pages Cleared!","All selected pages have been cleared. You can start fresh.","(0/4)",!1,!1)}catch(t){console.error("Failed to clear all pages:",t)}}let y=!1,z=0,M=0,B=0,T=0,w=!1;o.addEventListener("pointerdown",t=>{y=!0,w=!1,z=t.clientX,M=t.clientY;const n=e.getBoundingClientRect();B=n.left,T=n.top,o.setPointerCapture(t.pointerId)}),o.addEventListener("pointermove",t=>{if(!y)return;const n=t.clientX-z,s=t.clientY-M;(Math.abs(n)>5||Math.abs(s)>5)&&(w=!0,e.style.bottom="auto",e.style.right="auto",e.style.left=`${Math.max(10,Math.min(window.innerWidth-68,B+n))}px`,e.style.top=`${Math.max(10,Math.min(window.innerHeight-68,T+s))}px`)}),o.addEventListener("pointerup",t=>{if(y){y=!1;try{o.releasePointerCapture(t.pointerId)}catch{}}}),o.addEventListener("click",t=>{if(t.stopPropagation(),w){w=!1;return}S()});const F=a.querySelector(".toast-btn-compare");F&&F.addEventListener("click",t=>{t.stopPropagation(),chrome.runtime.sendMessage({action:"openResults"})});const Y=a.querySelector(".toast-btn-clear");Y&&Y.addEventListener("click",t=>{t.stopPropagation(),R()});const q=a.querySelector(".toast-btn-close");q&&q.addEventListener("click",t=>{t.stopPropagation(),a.classList.remove("show")}),typeof chrome<"u"&&chrome.storage&&chrome.storage.onChanged&&chrome.storage.onChanged.addListener((t,n)=>{if(n==="local"){if(t[_]){const s=t[_].newValue===!0;x(s)}t.compare_anything_state&&b&&h()}}),typeof chrome<"u"&&chrome.runtime&&chrome.runtime.onMessage&&chrome.runtime.onMessage.addListener((t,n,s)=>{if(t.action==="toggleFloatingButton"){const i=t.enabled===!0;return x(i),s({success:!0,isVisible:i}),!1}return t.action==="triggerAddCurrentPage"&&(b&&S(),s({success:!0})),!1})})();
