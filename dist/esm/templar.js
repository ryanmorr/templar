/*! @ryanmorr/templar v3.0.0 | https://github.com/ryanmorr/templar */
class t{constructor(){this.events=new Map}on(t,e){let n=this.events.get(t);n||(n=[],this.events.set(t,n)),n.push(e)}remove(t,e){const n=this.events.get(t);if(n){const t=n.indexOf(e);-1!==t&&n.splice(t,1)}}emit(t,...e){const n=this.events.get(t);n&&n.length&&n.forEach((t=>t(...e)))}}
/*! @ryanmorr/schedule-render v3.0.2 | https://github.com/ryanmorr/schedule-render */let e,n;const o=[],r=5;function i(){return performance.now()}function s(){return o.length>0}function u(){n=i();do{s()&&o.shift()()}while(i()-n<r);e=null,s()&&(e=requestAnimationFrame(u))}function c(t){return new Promise((n=>{e||(e=requestAnimationFrame(u)),o.push((()=>n(t())))}))}const a=document.createElement("template"),l=/<[a-z][\s\S]*>/;function d(t){return l.test(t)}function h(t){return"object"==typeof t&&!0===t.templar}function f(t,e,n){let o;for(t.global&&(t.lastIndex=0);o=t.exec(e);)n(o)}function m(t){return a.innerHTML=t,document.importNode(a.content,!0)}function p(t,e){return h(t)?t:null==t?document.createTextNode(""):("number"==typeof t&&(t=String(t)),"string"==typeof t?!1===e&&d(t)?m(t):document.createTextNode(t):Array.isArray(t)?t.reduce(((t,e)=>t.appendChild(p(e))&&t),document.createDocumentFragment()):t)}function g(t,e,n){h(e)?(e.unmount(),t.insertBefore(e.frag,n),e.setRoot(t)):t.insertBefore(e,n)}function y(t,e,n){h(e)?(e.unmount(),t.replaceChild(e.frag,n),e.setRoot(t)):t.replaceChild(e,n)}function v(t,e,n,o,r){if("number"==typeof n&&(n=String(n)),3===e.nodeType&&"string"==typeof n&&!d(n))return e.data=n,e;const i=p(n,o),s=11===(u=i).nodeType?Array.from(u.childNodes):u;var u;return h(e)?(e.unmount(),g(t,i,r)):Array.isArray(e)?0===e.length?g(t,i,r):1===e.length?y(t,i,e[0]):(!function(t,e){Array.isArray(e)?e.forEach((e=>t.removeChild(e))):t.removeChild(e)}(t,e),g(t,i,r)):y(t,i,e),s}const b=/\{\{\s*&?(.+?)\s*\}\}/g,x=/\{\{\s*(.+?)\s*\}\}|((?:(?!(?:\{\{\s*(.+?)\s*\}\})).)+)/g;function C(t){return-1!==t.indexOf("{{")}function T(t){const e=[];return f(b,t,(t=>e.push(t[1]))),e}function A(t,e,n){e in t||(t[e]=[]),t[e].push(n)}function N(t,e,n,o){let r=null,i=!1;const s=T(o),u=n.startsWith("on");u&&(e[n]=null,e.removeAttribute(n));const a=()=>{i=!1;const c=r;r=u||o==="{{"+s[0]+"}}"?t.data[s[0]]:function(t,e){return t.replace(b,((t,n)=>e[n])).trim()}(o,t.data),r!==c&&(!function(t,e,n,o){if("style"===e)if("string"==typeof o)t.style.cssText=o;else{"string"==typeof n&&(t.style.cssText=n="");for(const e in Object.assign({},o,n)){const n=null==o||null==o[e]?"":o[e];e.startsWith("--")?t.style.setProperty(e,n):t.style[e]=n}}else if(!e.startsWith("on")||"function"!=typeof n&&"function"!=typeof o){if("width"!==e&&"height"!==e&&"href"!==e&&"list"!==e&&"form"!==e&&"tabIndex"!==e&&"download"!==e&&e in t)try{return void(t[e]=null==o?"":o)}catch(t){}null==o||!1===o&&-1==e.indexOf("-")?t.removeAttribute(e):t.setAttribute(e,o)}else e=e.slice(2).toLowerCase(),null==o&&t.removeEventListener(e,n),null==n&&t.addEventListener(e,o)}(e,n,c,r),t.events.emit("attributechange",e,c,r))};return()=>{!i&&s.every((e=>e in t.data))&&(i=!0,document.contains(e)?c(a):a())}}function w(t,e,n,o,r){const i=N(t,e,o,r);T(r).forEach((t=>A(n,t,i)))}function E(t,e,n){const o=document.createDocumentFragment();return f(x,e.data,(e=>{if(null!=e[1]){let r=e[1],i=!1;"&"===r[0]&&(i=!0,r=r.substr(1));const s=document.createTextNode(""),u=document.createTextNode(""),a=function(t,e,n,o,r){let i=null,s=!1;const u=()=>{if(s=!1,i=t.data[o],i===e)return;const u=n.parentNode;e=v(u,e,i,r,n),t.events.emit("change",u)};return()=>{!s&&o in t.data&&(s=!0,document.contains(n)?c(u):u())}}(t,s,u,r,i);A(n,r,a),o.appendChild(s),o.appendChild(u)}else null!=e[2]&&o.appendChild(document.createTextNode(e[2]))})),o}function D(t,e,n={}){return Array.from(e).reduce(((e,n)=>{if(3===n.nodeType)C(n.data)&&n.replaceWith(E(t,n,e));else if(1===n.nodeType){for(let o=0,r=n.attributes.length;o<r;o++){const r=n.attributes[o];C(r.value)&&w(t,n,e,r.name,r.value)}n.hasChildNodes()&&D(t,n.childNodes,e)}return e}),n)}class I{constructor(e,n){this.id=Math.random().toString(36).substring(2,11),this.templar=!0,this.data={};const o=m(e.trim());this.root=this.frag=function(t,e){const n=document.createTextNode(""),o=document.createTextNode("");return n.templarID=o.templarID=e,t.insertBefore(n,t.firstChild),t.appendChild(o),t}(o,this.id),this.bindings=D(this,o.childNodes),this.events=new t,this.mounted=!1,n&&this.set(n)}mount(t){this.mounted&&this.unmount(),t.appendChild(this.frag),this.setRoot(t)}unmount(){this.mounted&&(function(t,e){const n=[];let o=t.firstChild,r=!1;for(;o;)o.templarID!==e||r?o.templarID===e&&r&&(r=!1,n.push(o)):r=!0,r&&n.push(o),o=o.nextSibling;return n}(this.root,this.id).forEach((t=>{this.frag.appendChild(t)})),this.root=this.frag,this.mounted=!1,this.events.emit("unmount"))}get(t){return t in this.data?this.data[t]:null}set(t,e){"string"==typeof t?(this.data[t]=e,this.bindings[t].forEach((t=>t()))):Object.keys(t).forEach((e=>this.set(e,t[e])))}on(t,e){return this.events.on(t,e),()=>this.events.remove(t,e)}setRoot(t){this.root=t,this.mounted=!0,this.events.emit("mount",t)}}function O(t,e){return new I(t,e)}export{O as default};