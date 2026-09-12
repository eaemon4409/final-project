import{a as R}from"./pageExtractor.js";import{g as h,n as y,a as Y,r as H}from"./storageService.js";(function(){if(document.getElementById("compare-anything-fab-root"))return;const a=document.createElement("div");a.id="compare-anything-fab-root",a.style.position="fixed",a.style.zIndex="2147483647",a.style.bottom="26px",a.style.right="26px",a.style.pointerEvents="none";const C=a.attachShadow({mode:"open"}),k=document.createElement("style");k.textContent=`
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
      width: 310px;
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
      gap: 8px;
      margin-top: 4px;
    }

    .toast-btn-compare {
      flex: 1;
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      color: #ffffff;
      border: none;
      border-radius: 8px;
      padding: 8px 12px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
      transition: background 0.18s ease, transform 0.18s ease;
    }

    .toast-btn-compare:hover {
      background: linear-gradient(135deg, #f87171 0%, #ef4444 100%);
      transform: translateY(-1px);
    }

    .toast-btn-remove {
      background: rgba(239, 68, 68, 0.18);
      color: #fca5a5;
      border: 1px solid rgba(239, 68, 68, 0.35);
      border-radius: 8px;
      padding: 8px 10px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.18s ease, color 0.18s ease;
    }

    .toast-btn-remove:hover {
      background: rgba(239, 68, 68, 0.35);
      color: #ffffff;
    }

    .toast-btn-close {
      background: rgba(255, 255, 255, 0.1);
      color: #cbd5e1;
      border: none;
      border-radius: 8px;
      padding: 8px 10px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.18s ease;
    }

    .toast-btn-close:hover {
      background: rgba(255, 255, 255, 0.2);
      color: #ffffff;
    }
  `;const E=`
    <svg class="fab-icon-svg" viewBox="0 0 24 24">
      <rect x="3" y="4" width="7" height="16" rx="1.5"></rect>
      <rect x="14" y="10" width="7" height="10" rx="1.5"></rect>
      <path d="M14 4h4a2 2 0 0 1 2 2v2"></path>
      <line x1="17" y1="1" x2="17" y2="7"></line>
    </svg>
  `,F=`
    <svg class="fab-icon-svg" viewBox="0 0 24 24">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  `,f=document.createElement("div");f.className="fab-wrapper";const g=document.createElement("div");g.className="fab-tooltip",g.textContent="Add to Compare (Click)";const e=document.createElement("button");e.className="fab-button",e.title="Compare Anything — Click to Add",e.innerHTML=E;const s=document.createElement("div");s.className="fab-badge",s.textContent="0",s.style.display="none",e.appendChild(s);const o=document.createElement("div");o.className="fab-toast",o.innerHTML=`
    <div class="toast-header">
      <div class="toast-status-row">
        <span class="toast-status-text">✓ Added to Comparison!</span>
      </div>
      <span class="toast-count-text" style="font-size: 11px; color: #cbd5e1;">(1/4)</span>
    </div>
    <div class="toast-title"></div>
    <div class="toast-actions">
      <button class="toast-btn-compare">Compare Now ➔</button>
      <button class="toast-btn-remove" style="display: none;">Remove</button>
      <button class="toast-btn-close">Close</button>
    </div>
  `,f.appendChild(g),f.appendChild(o),f.appendChild(e),C.appendChild(k),C.appendChild(f),(document.body||document.documentElement).appendChild(a);let S=!1,v=null,w=null;async function u(){try{const t=await h(),n=window.location.href,i=y(n),d=t.pages.length;s.textContent=String(d),s.style.display=d>0?"flex":"none";const r=t.pages.find(l=>y(l.url)===i);S=!!r,v=r?r.id:null,S?(e.classList.add("is-added"),e.innerHTML=F,e.appendChild(s),g.textContent=`Page Added (${d}/4) — Click to view`):(e.classList.remove("is-added"),e.innerHTML=E,e.appendChild(s),g.textContent=d>0?`Add to Compare (${d}/4 added)`:"Add to Compare (Click)")}catch(t){console.error("Failed to update compare widget state:",t)}}function c(t,n,i,d=!1,r=!1){w&&clearTimeout(w);const l=o.querySelector(".toast-status-text"),b=o.querySelector(".toast-title"),p=o.querySelector(".toast-count-text"),$=o.querySelector(".toast-btn-compare"),q=o.querySelector(".toast-btn-remove");l&&(l.textContent=t,l.style.color=d?"#f87171":"#34d399"),b&&(b.textContent=n),p&&(p.textContent=i),$&&($.style.display="flex"),q&&(q.style.display=r?"block":"none"),o.classList.add("show"),w=setTimeout(()=>{o.classList.remove("show")},4500)}async function I(){try{const t=await h(),n=window.location.href,i=y(n);if(t.pages.find(p=>y(p.url)===i)){c("✓ Already in Comparison!",document.title||"This Webpage",`(${t.pages.length}/4 pages)`,!1,!0);return}if(t.pages.length>=4){c("⚠️ Maximum 4 pages reached!","You already have 4 pages selected. Click Compare Now to see your side-by-side analysis.","(4/4)",!0,!1);return}const r=R(),l={id:`page-${t.pages.length+1}`,url:r.url,domain:r.domain,title:r.title,description:r.description,structuredData:r.structuredData,importantText:r.importantText,capturedAt:r.capturedAt},b=await Y(l);if(b.success){await u();const p=await h();c("✓ Added to Comparison!",l.title||"Page added",`(${p.pages.length}/4 pages)`,!1,!0)}else c("Note:",b.message||"Could not add page.",`(${t.pages.length}/4)`,!0,!1)}catch(t){console.error("Error adding page to comparison:",t),c("Extraction error","Could not capture enough details from this page.","",!0,!1)}}async function N(){if(v)try{await H(v),await u();const t=await h();c("Removed from Comparison",document.title||"Page",`(${t.pages.length}/4 pages)`,!1,!1)}catch(t){console.error("Failed to remove page:",t)}}let x=!1,z=0,L=0,M=0,P=0,m=!1;e.addEventListener("pointerdown",t=>{x=!0,m=!1,z=t.clientX,L=t.clientY;const n=a.getBoundingClientRect();M=n.left,P=n.top,e.setPointerCapture(t.pointerId)}),e.addEventListener("pointermove",t=>{if(!x)return;const n=t.clientX-z,i=t.clientY-L;(Math.abs(n)>5||Math.abs(i)>5)&&(m=!0,a.style.bottom="auto",a.style.right="auto",a.style.left=`${Math.max(10,Math.min(window.innerWidth-68,M+n))}px`,a.style.top=`${Math.max(10,Math.min(window.innerHeight-68,P+i))}px`)}),e.addEventListener("pointerup",t=>{if(x){x=!1;try{e.releasePointerCapture(t.pointerId)}catch{}}}),e.addEventListener("click",t=>{if(t.stopPropagation(),m){m=!1;return}I()});const A=o.querySelector(".toast-btn-compare");A&&A.addEventListener("click",t=>{t.stopPropagation(),chrome.runtime.sendMessage({action:"openResults"})});const T=o.querySelector(".toast-btn-remove");T&&T.addEventListener("click",t=>{t.stopPropagation(),N()});const B=o.querySelector(".toast-btn-close");B&&B.addEventListener("click",t=>{t.stopPropagation(),o.classList.remove("show")}),typeof chrome<"u"&&chrome.storage&&chrome.storage.onChanged&&chrome.storage.onChanged.addListener((t,n)=>{n==="local"&&t.compare_anything_state&&u()}),u()})();
