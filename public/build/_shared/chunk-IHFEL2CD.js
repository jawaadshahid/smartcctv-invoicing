import{A as _e,B as xe,C as B,D as re,E as be,F as ne,G as Ne,H as Je,I as Ve,a as U,b as $e,c as Z,d as V,e as ye,f as q,g as z,h as Ie,i as ge,j as Be,k as ve,l as ee,m as P,n as je,o as we,p as W,q as H,r as A,s as Ee,t as M,u as x,v as te,w as $,x as Se,y as I,z as X}from"/build/_shared/chunk-XTGBAL5E.js";import{b as Dt,e as T}from"/build/_shared/chunk-ADMCF34Z.js";function C(){return C=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var o in r)Object.prototype.hasOwnProperty.call(r,o)&&(e[o]=r[o])}return e},C.apply(this,arguments)}function Fe(e,t){if(e==null)return{};var r={},o=Object.keys(e),n,i;for(i=0;i<o.length;i++)n=o[i],!(t.indexOf(n)>=0)&&(r[n]=e[n]);return r}function le(e){return e!=null&&typeof e.tagName=="string"}function jt(e){return le(e)&&e.tagName.toLowerCase()==="button"}function Jt(e){return le(e)&&e.tagName.toLowerCase()==="form"}function Vt(e){return le(e)&&e.tagName.toLowerCase()==="input"}function zt(e){return!!(e.metaKey||e.altKey||e.ctrlKey||e.shiftKey)}function Wt(e,t){return e.button===0&&(!t||t==="_self")&&!zt(e)}function Xt(){if(oe===null)try{new FormData(document.createElement("form"),0),oe=!1}catch{oe=!0}return oe}function ke(e){return e!=null&&!Kt.has(e)?null:e}function Yt(e,t){let r,o,n,i,a;if(Jt(e)){let s=e.getAttribute("action");o=s?z(s,t):null,r=e.getAttribute("method")||ie,n=ke(e.getAttribute("enctype"))||Ce,i=new FormData(e)}else if(jt(e)||Vt(e)&&(e.type==="submit"||e.type==="image")){let s=e.form;if(s==null)throw new Error('Cannot submit a <button> or <input type="submit"> without a <form>');let c=e.getAttribute("formaction")||s.getAttribute("action");if(o=c?z(c,t):null,r=e.getAttribute("formmethod")||s.getAttribute("method")||ie,n=ke(e.getAttribute("formenctype"))||ke(s.getAttribute("enctype"))||Ce,i=new FormData(s,e),!Xt()){let{name:l,type:d,value:f}=e;if(d==="image"){let m=l?l+".":"";i.append(m+"x","0"),i.append(m+"y","0")}else l&&i.append(l,f)}}else{if(le(e))throw new Error('Cannot submit element that is not <form>, <button>, or <input type="submit|image">');r=ie,o=null,n=Ce,a=e}return i&&n==="text/plain"&&(a=i,i=void 0),{action:o,method:r.toLowerCase(),encType:n,formData:i,body:a}}function Xe(e,t){return je({basename:t?.basename,future:C({},t?.future,{v7_prependBasename:!0}),history:$e({window:t?.window}),hydrationData:t?.hydrationData||qt(),routes:e,mapRouteProperties:Je}).initialize()}function qt(){var e;let t=(e=window)==null?void 0:e.__staticRouterHydrationData;return t&&t.errors&&(t=C({},t,{errors:er(t.errors)})),t}function er(e){if(!e)return null;let t=Object.entries(e),r={};for(let[o,n]of t)if(n&&n.__type==="RouteErrorResponse")r[o]=new ee(n.status,n.statusText,n.data,n.internal===!0);else if(n&&n.__type==="Error"){let i=new Error(n.message);i.stack="",r[o]=i}else r[o]=n;return r}function Ye(e){let t=p.useContext(W);return t||Z(!1),t}function ir(e){let t=p.useContext(H);return t||Z(!1),t}function sr(e,t){let{target:r,replace:o,state:n,preventScrollReset:i,relative:a}=t===void 0?{}:t,s=te(),c=x(),l=$(e,{relative:a});return p.useCallback(d=>{if(Wt(d,r)){d.preventDefault();let f=o!==void 0?o:V(c)===V(l);s(e,{replace:f,state:n,preventScrollReset:i,relative:a})}},[c,s,l,o,n,r,e,i,a])}function lr(){if(typeof document>"u")throw new Error("You are calling submit during the server render. Try calling submit within a `useEffect` or callback instead.")}function Ge(){let{router:e}=Ye(se.UseSubmit),{basename:t}=p.useContext(A),r=Se();return p.useCallback(function(o,n){n===void 0&&(n={}),lr();let{action:i,method:a,encType:s,formData:c,body:l}=Yt(o,t);e.navigate(n.action||i,{preventScrollReset:n.preventScrollReset,formData:c,body:l,formMethod:n.method||a,formEncType:n.encType||s,replace:n.replace,fromRouteId:r})},[e,t,r])}function Qe(e,t){let{relative:r}=t===void 0?{}:t,{basename:o}=p.useContext(A),n=p.useContext(Ee);n||Z(!1);let[i]=n.matches.slice(-1),a=C({},$(e||".",{relative:r})),s=x();if(e==null&&(a.search=s.search,a.hash=s.hash,i.route.index)){let c=new URLSearchParams(a.search);c.delete("index"),a.search=c.toString()?"?"+c.toString():""}return(!e||e===".")&&i.route.index&&(a.search=a.search?a.search.replace(/^\?/,"?index&"):"?index"),o!=="/"&&(a.pathname=a.pathname==="/"?o:Ie([o,a.pathname])),V(a)}function Ze(e){let{getKey:t,storageKey:r}=e===void 0?{}:e,{router:o}=Ye(se.UseScrollRestoration),{restoreScrollPosition:n,preventScrollReset:i}=ir(Le.UseScrollRestoration),{basename:a}=p.useContext(A),s=x(),c=X(),l=I();p.useEffect(()=>(window.history.scrollRestoration="manual",()=>{window.history.scrollRestoration="auto"}),[]),ur(p.useCallback(()=>{if(l.state==="idle"){let d=(t?t(s,c):null)||s.key;ae[d]=window.scrollY}sessionStorage.setItem(r||ze,JSON.stringify(ae)),window.history.scrollRestoration="auto"},[r,t,l.state,s,c])),typeof document<"u"&&(p.useLayoutEffect(()=>{try{let d=sessionStorage.getItem(r||ze);d&&(ae=JSON.parse(d))}catch{}},[r]),p.useLayoutEffect(()=>{let d=t&&a!=="/"?(m,g)=>t(C({},m,{pathname:z(m.pathname,a)||m.pathname}),g):t,f=o?.enableScrollRestoration(ae,()=>window.scrollY,d);return()=>f&&f()},[o,a,t]),p.useLayoutEffect(()=>{if(n!==!1){if(typeof n=="number"){window.scrollTo(0,n);return}if(s.hash){let d=document.getElementById(s.hash.slice(1));if(d){d.scrollIntoView();return}}i!==!0&&window.scrollTo(0,0)}},[s,n,i]))}function ur(e,t){let{capture:r}=t||{};p.useEffect(()=>{let o=r!=null?{capture:r}:void 0;return window.addEventListener("pagehide",e,o),()=>{window.removeEventListener("pagehide",e,o)}},[e,r])}var p,ie,Ce,oe,Kt,Gt,Qt,Zt,tr,on,rr,nr,De,Ke,or,ar,se,Le,ze,ae,F=Dt(()=>{p=T(U());Ve();Ve();we();ie="get",Ce="application/x-www-form-urlencoded";oe=null;Kt=new Set(["application/x-www-form-urlencoded","multipart/form-data","text/plain"]);Gt=["onClick","relative","reloadDocument","replace","state","target","to","preventScrollReset"],Qt=["aria-current","caseSensitive","className","end","style","to","children"],Zt=["reloadDocument","replace","method","action","onSubmit","submit","relative","preventScrollReset"];tr="startTransition",on=p[tr],rr=typeof window<"u"&&typeof window.document<"u"&&typeof window.document.createElement<"u",nr=/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i,De=p.forwardRef(function(t,r){let{onClick:o,relative:n,reloadDocument:i,replace:a,state:s,target:c,to:l,preventScrollReset:d}=t,f=Fe(t,Gt),{basename:m}=p.useContext(A),g,h=!1;if(typeof l=="string"&&nr.test(l)&&(g=l,rr))try{let v=new URL(window.location.href),S=l.startsWith("//")?new URL(v.protocol+l):new URL(l),O=z(S.pathname,m);S.origin===v.origin&&O!=null?l=O+S.search+S.hash:h=!0}catch{}let y=M(l,{relative:n}),E=sr(l,{replace:a,state:s,target:c,preventScrollReset:d,relative:n});function _(v){o&&o(v),v.defaultPrevented||E(v)}return p.createElement("a",C({},f,{href:g||y,onClick:h||i?o:_,ref:r,target:c}))}),Ke=p.forwardRef(function(t,r){let{"aria-current":o="page",caseSensitive:n=!1,className:i="",end:a=!1,style:s,to:c,children:l}=t,d=Fe(t,Qt),f=$(c,{relative:d.relative}),m=x(),g=p.useContext(H),{navigator:h}=p.useContext(A),y=h.encodeLocation?h.encodeLocation(f).pathname:f.pathname,E=m.pathname,_=g&&g.navigation&&g.navigation.location?g.navigation.location.pathname:null;n||(E=E.toLowerCase(),_=_?_.toLowerCase():null,y=y.toLowerCase());let v=E===y||!a&&E.startsWith(y)&&E.charAt(y.length)==="/",S=_!=null&&(_===y||!a&&_.startsWith(y)&&_.charAt(y.length)==="/"),O=v?o:void 0,J;typeof i=="function"?J=i({isActive:v,isPending:S}):J=[i,v?"active":null,S?"pending":null].filter(Boolean).join(" ");let b=typeof s=="function"?s({isActive:v,isPending:S}):s;return p.createElement(De,C({},d,{"aria-current":O,className:J,ref:r,style:b,to:c}),typeof l=="function"?l({isActive:v,isPending:S}):l)}),or=p.forwardRef((e,t)=>{let r=Ge();return p.createElement(ar,C({},e,{submit:r,ref:t}))}),ar=p.forwardRef((e,t)=>{let{reloadDocument:r,replace:o,method:n=ie,action:i,onSubmit:a,submit:s,relative:c,preventScrollReset:l}=e,d=Fe(e,Zt),f=n.toLowerCase()==="get"?"get":"post",m=Qe(i,{relative:c});return p.createElement("form",C({ref:t,method:f,action:m,onSubmit:r?a:h=>{if(a&&a(h),h.defaultPrevented)return;h.preventDefault();let y=h.nativeEvent.submitter,E=y?.getAttribute("formmethod")||n;s(y||h.currentTarget,{method:E,replace:o,relative:c,preventScrollReset:l})}},d))});(function(e){e.UseScrollRestoration="useScrollRestoration",e.UseSubmit="useSubmit",e.UseSubmitFetcher="useSubmitFetcher",e.UseFetcher="useFetcher"})(se||(se={}));(function(e){e.UseFetchers="useFetchers",e.UseScrollRestoration="useScrollRestoration"})(Le||(Le={}));ze="react-router-scroll-positions",ae={}});var D=T(U());F();function w(){return w=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var o in r)Object.prototype.hasOwnProperty.call(r,o)&&(e[o]=r[o])}return e},w.apply(this,arguments)}var u=T(U());F();var R=T(U());F();var ue=class extends R.default.Component{constructor(t){super(t),this.state={error:t.error||null,location:t.location}}static getDerivedStateFromError(t){return{error:t}}static getDerivedStateFromProps(t,r){return r.location!==t.location?{error:t.error||null,location:t.location}:{error:t.error||r.error,location:r.location}}render(){return this.state.error?R.default.createElement(this.props.component,{error:this.state.error}):this.props.children}};function j({error:e}){return R.default.useEffect(()=>{console.error(e)},[e]),R.default.createElement("html",{lang:"en"},R.default.createElement("head",null,R.default.createElement("meta",{charSet:"utf-8"}),R.default.createElement("meta",{name:"viewport",content:"width=device-width, initial-scale=1, viewport-fit=cover"}),R.default.createElement("title",null,"Application Error!")),R.default.createElement("body",null,R.default.createElement("main",{style:{fontFamily:"system-ui, sans-serif",padding:"2rem"}},R.default.createElement("h1",{style:{fontSize:"24px"}},"Application Error"),e.stack?R.default.createElement("pre",{style:{padding:"2rem",background:"hsla(10, 50%, 50%, 0.1)",color:"red",overflow:"auto"}},e.stack):null),R.default.createElement("script",{dangerouslySetInnerHTML:{__html:`
              console.log(
                "\u{1F4BF} Hey developer\u{1F44B}. You can provide a way better UX than this when your app throws errors. Check out https://remix.run/guides/errors for more information."
              );
            `}})))}function qe(){let e=B();if(P(e))return R.default.createElement(nt,{caught:e});if(e instanceof Error)return R.default.createElement(j,{error:e});{let t=e==null?"Unknown Error":typeof e=="object"&&"toString"in e?e.toString():JSON.stringify(e);return R.default.createElement(j,{error:new Error(t)})}}var et=R.default.createContext(void 0);function cr(){return(0,R.useContext)(et)}function tt({catch:e,component:t,children:r}){return e?R.default.createElement(et.Provider,{value:e},R.default.createElement(t,null)):R.default.createElement(R.default.Fragment,null,r)}function rt(){let e=cr();return R.default.createElement(nt,{caught:e})}function nt({caught:e}){return R.default.createElement("html",{lang:"en"},R.default.createElement("head",null,R.default.createElement("meta",{charSet:"utf-8"}),R.default.createElement("meta",{name:"viewport",content:"width=device-width, initial-scale=1, viewport-fit=cover"}),R.default.createElement("title",null,"Unhandled Thrown Response!")),R.default.createElement("body",null,R.default.createElement("h1",{style:{fontFamily:"system-ui, sans-serif",padding:"2rem"}},e.status," ",e.statusText),R.default.createElement("script",{dangerouslySetInnerHTML:{__html:`
              console.log(
                "\u{1F4BF} Hey developer\u{1F44B}. You can provide a way better UX than this when your app throws 404s (and other responses). Check out https://remix.run/guides/not-found for more information."
              );
            `}})))}function N(e,t){if(e===!1||e===null||typeof e>"u")throw new Error(t)}F();async function ce(e,t){if(e.id in t)return t[e.id];try{let r=await import(e.module);return t[e.id]=r,r}catch{return window.location.reload(),new Promise(()=>{})}}function ot(e,t,r){let o=e.map(i=>{var a;let s=t[i.route.id];return((a=s.links)===null||a===void 0?void 0:a.call(s))||[]}).flat(1),n=mr(e,r);return hr(o,n)}async function at(e){if(!e.links)return;let t=e.links();if(!t)return;let r=[];for(let n of t)!de(n)&&n.rel==="stylesheet"&&r.push({...n,rel:"preload",as:"style"});let o=r.filter(n=>!n.media||window.matchMedia(n.media).matches);await Promise.all(o.map(dr))}async function dr(e){return new Promise(t=>{let r=document.createElement("link");Object.assign(r,e);function o(){document.head.contains(r)&&document.head.removeChild(r)}r.onload=()=>{o(),t()},r.onerror=()=>{o(),t()},document.head.appendChild(r)})}function de(e){return e!=null&&typeof e.page=="string"}function fr(e){return e==null?!1:e.href==null?e.rel==="preload"&&(typeof e.imageSrcSet=="string"||typeof e.imagesrcset=="string")&&(typeof e.imageSizes=="string"||typeof e.imagesizes=="string"):typeof e.rel=="string"&&typeof e.href=="string"}async function it(e,t,r){return(await Promise.all(e.map(async n=>{let i=await ce(t.routes[n.route.id],r);return i.links?i.links():[]}))).flat(1).filter(fr).filter(n=>n.rel==="stylesheet"||n.rel==="preload").map(n=>n.rel==="preload"?{...n,rel:"prefetch"}:{...n,rel:"prefetch",as:"style"})}function Ae(e,t,r,o,n,i){let a=ut(e),s=(d,f)=>r[f]?d.route.id!==r[f].route.id:!0,c=(d,f)=>{var m;return r[f].pathname!==d.pathname||((m=r[f].route.path)===null||m===void 0?void 0:m.endsWith("*"))&&r[f].params["*"]!==d.params["*"]};return i==="data"&&n.search!==a.search?t.filter((d,f)=>{if(!o.routes[d.route.id].hasLoader)return!1;if(s(d,f)||c(d,f))return!0;if(d.route.shouldRevalidate){var g;let h=d.route.shouldRevalidate({currentUrl:new URL(n.pathname+n.search+n.hash,window.origin),currentParams:((g=r[0])===null||g===void 0?void 0:g.params)||{},nextUrl:new URL(e,window.origin),nextParams:d.params,defaultShouldRevalidate:!0});if(typeof h=="boolean")return h}return!0}):t.filter((d,f)=>{let m=o.routes[d.route.id];return(i==="assets"||m.hasLoader)&&(s(d,f)||c(d,f))})}function st(e,t,r){let o=ut(e);return Me(t.filter(n=>r.routes[n.route.id].hasLoader).map(n=>{let{pathname:i,search:a}=o,s=new URLSearchParams(a);return s.set("_data",n.route.id),`${i}?${s}`}))}function lt(e,t){return Me(e.map(r=>{let o=t.routes[r.route.id],n=[o.module];return o.imports&&(n=n.concat(o.imports)),n}).flat(1))}function mr(e,t){return Me(e.map(r=>{let o=t.routes[r.route.id],n=[o.module];return o.imports&&(n=n.concat(o.imports)),n}).flat(1))}function Me(e){return[...new Set(e)]}function hr(e,t){let r=new Set,o=new Set(t);return e.reduce((n,i)=>{if(!de(i)&&i.as==="script"&&i.href&&o.has(i.href))return n;let s=JSON.stringify(i);return r.has(s)||(r.add(s),n.push(i)),n},[])}function ut(e){let t=ye(e);return t.search===void 0&&(t.search=""),t}var pr={"&":"\\u0026",">":"\\u003e","<":"\\u003c","\u2028":"\\u2028","\u2029":"\\u2029"},Rr=/[&><\u2028\u2029]/g;function K(e){return e.replace(Rr,t=>pr[t])}function Oe(e){return{__html:e}}function dt(){let e=u.useContext(W);return N(e,"You must render this element inside a <DataRouterContext.Provider> element"),e}function G(){let e=u.useContext(H);return N(e,"You must render this element inside a <DataRouterStateContext.Provider> element"),e}var Q=u.createContext(void 0);Q.displayName="Remix";function k(){let e=u.useContext(Q);return N(e,"You must render this element inside a <Remix> element"),e}function ft({id:e}){let{routeModules:t,future:r}=k();N(t,`Cannot initialize 'routeModules'. This normally occurs when you have server code in your client modules.
Check this link for more details:
https://remix.run/pages/gotchas#server-code-in-client-bundles`);let{default:o,ErrorBoundary:n,CatchBoundary:i}=t[e];return!o&&(n||!r.v2_errorBoundary&&i)&&(o=ne),N(o,`Route "${e}" has no component! Please go add a \`default\` export in the route module file.
If you were trying to navigate or submit to a resource route, use \`<a>\` instead of \`<Link>\` or \`<Form reloadDocument>\`.`),u.createElement(o,null)}function mt({id:e}){let{future:t,routeModules:r}=k();N(r,`Cannot initialize 'routeModules'. This normally occurs when you have server code in your client modules.
Check this link for more details:
https://remix.run/pages/gotchas#server-code-in-client-bundles`);let o=B(),{CatchBoundary:n,ErrorBoundary:i}=r[e];if(t.v2_errorBoundary){if(e==="root"&&(i||(i=qe)),i)return u.createElement(i,null);throw o}if(e==="root"&&(n||(n=rt),i||(i=j)),P(o)){let a=o;if(a!=null&&a.error&&a.status!==404&&i)return u.createElement(i,{error:a.error});if(n)return u.createElement(tt,{catch:o,component:n})}if(o instanceof Error&&i)return u.createElement(i,{error:o});throw o}function ht(e,t){let[r,o]=u.useState(!1),[n,i]=u.useState(!1),{onFocus:a,onBlur:s,onMouseEnter:c,onMouseLeave:l,onTouchStart:d}=t,f=u.useRef(null);u.useEffect(()=>{if(e==="render"&&i(!0),e==="viewport"){let h=E=>{E.forEach(_=>{i(_.isIntersecting)})},y=new IntersectionObserver(h,{threshold:.5});return f.current&&y.observe(f.current),()=>{y.disconnect()}}},[e]);let m=()=>{e==="intent"&&o(!0)},g=()=>{e==="intent"&&(o(!1),i(!1))};return u.useEffect(()=>{if(r){let h=setTimeout(()=>{i(!0)},100);return()=>{clearTimeout(h)}}},[r]),[n,f,{onFocus:Y(a,m),onBlur:Y(s,g),onMouseEnter:Y(c,m),onMouseLeave:Y(l,g),onTouchStart:Y(d,m)}]}var pt=/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i,Rt=u.forwardRef(({to:e,prefetch:t="none",...r},o)=>{let n=typeof e=="string"&&pt.test(e),i=M(e),[a,s,c]=ht(t,r);return u.createElement(u.Fragment,null,u.createElement(Ke,w({},r,c,{ref:vt(o,s),to:e})),a&&!n?u.createElement(fe,{page:i}):null)});Rt.displayName="NavLink";var yt=u.forwardRef(({to:e,prefetch:t="none",...r},o)=>{let n=typeof e=="string"&&pt.test(e),i=M(e),[a,s,c]=ht(t,r);return u.createElement(u.Fragment,null,u.createElement(De,w({},r,c,{ref:vt(o,s),to:e})),a&&!n?u.createElement(fe,{page:i}):null)});yt.displayName="Link";function Y(e,t){return r=>{e&&e(r),r.defaultPrevented||t(r)}}var yr="\u26A0\uFE0F REMIX FUTURE CHANGE: The behavior of links `imagesizes` and `imagesrcset` will be changing in v2. Only the React camel case versions will be valid. Please change to `imageSizes` and `imageSrcSet`. For instructions on making this change see https://remix.run/docs/en/v1.15.0/pages/v2#links-imagesizes-and-imagesrcset";function gr(){let{manifest:e,routeModules:t}=k(),{errors:r,matches:o}=G(),n=r?o.slice(0,o.findIndex(a=>r[a.route.id])+1):o,i=u.useMemo(()=>ot(n,t,e),[n,t,e]);return u.useEffect(()=>{i.some(a=>"imagesizes"in a||"imagesrcset"in a)&&void 0},[i]),u.createElement(u.Fragment,null,i.map(a=>{if(de(a))return u.createElement(fe,w({key:a.page},a));let s=null;return"useId"in u?(a.imagesrcset&&(a.imageSrcSet=s=a.imagesrcset,delete a.imagesrcset),a.imagesizes&&(a.imageSizes=a.imagesizes,delete a.imagesizes)):(a.imageSrcSet&&(a.imagesrcset=s=a.imageSrcSet,delete a.imageSrcSet),a.imageSizes&&(a.imagesizes=a.imageSizes,delete a.imageSizes)),u.createElement("link",w({key:a.rel+(a.href||"")+(s||"")},a))}))}function fe({page:e,...t}){let{router:r}=dt(),o=u.useMemo(()=>q(r.routes,e),[r.routes,e]);return o?u.createElement(wr,w({page:e,matches:o},t)):(console.warn(`Tried to prefetch ${e} but no routes matched.`),null)}function vr(e){let{manifest:t,routeModules:r}=k(),[o,n]=u.useState([]);return u.useEffect(()=>{let i=!1;return it(e,t,r).then(a=>{i||n(a)}),()=>{i=!0}},[e,t,r]),o}function wr({page:e,matches:t,...r}){let o=x(),{manifest:n}=k(),{matches:i}=G(),a=u.useMemo(()=>Ae(e,t,i,n,o,"data"),[e,t,i,n,o]),s=u.useMemo(()=>Ae(e,t,i,n,o,"assets"),[e,t,i,n,o]),c=u.useMemo(()=>st(e,a,n),[a,e,n]),l=u.useMemo(()=>lt(s,n),[s,n]),d=vr(s);return u.createElement(u.Fragment,null,c.map(f=>u.createElement("link",w({key:f,rel:"prefetch",as:"fetch",href:f},r))),l.map(f=>u.createElement("link",w({key:f,rel:"modulepreload",href:f},r))),d.map(f=>u.createElement("link",w({key:f.href},f))))}function Er(){let{routeModules:e}=k(),{errors:t,matches:r,loaderData:o}=G(),n=x(),i=t?r.slice(0,r.findIndex(c=>t[c.route.id])+1):r,a={},s={};for(let c of i){let l=c.route.id,d=o[l],f=c.params,m=e[l];if(m.meta){let g=typeof m.meta=="function"?m.meta({data:d,parentsData:s,params:f,location:n}):m.meta;if(g&&Array.isArray(g))throw new Error("The route at "+c.route.path+" returns an array. This is only supported with the `v2_meta` future flag in the Remix config. Either set the flag to `true` or update the route's meta function to return an object.\n\nTo reference the v1 meta function API, see https://remix.run/route/meta");Object.assign(a,g)}s[l]=d}return u.createElement(u.Fragment,null,Object.entries(a).map(([c,l])=>{if(!l)return null;if(["charset","charSet"].includes(c))return u.createElement("meta",{key:"charSet",charSet:l});if(c==="title")return u.createElement("title",{key:"title"},String(l));let d=/^(og|music|video|article|book|profile|fb):.+$/.test(c);return[l].flat().map(f=>d?u.createElement("meta",{property:c,content:f,key:c+f}):typeof f=="string"?u.createElement("meta",{name:c,content:f,key:c+f}):u.createElement("meta",w({key:c+JSON.stringify(f)},f)))}))}function Sr(){let{routeModules:e}=k(),{errors:t,matches:r,loaderData:o}=G(),n=x(),i=t?r.slice(0,r.findIndex(l=>t[l.route.id])+1):r,a=[],s=null,c=[];for(let l=0;l<i.length;l++){let d=i[l],f=d.route.id,m=o[f],g=d.params,h=e[f],y=[],E={id:f,data:m,meta:[],params:d.params,pathname:d.pathname,handle:d.route.handle,get route(){return console.warn("The meta function in "+d.route.path+" accesses the `route` property on `matches`. This is deprecated and will be removed in Remix version 2. See"),d.route}};if(c[l]=E,h!=null&&h.meta?y=typeof h.meta=="function"?h.meta({data:m,params:g,location:n,matches:c}):Array.isArray(h.meta)?[...h.meta]:h.meta:s&&(y=[...s]),y=y||[],!Array.isArray(y))throw new Error("The `v2_meta` API is enabled in the Remix config, but the route at "+d.route.path+` returns an invalid value. In v2, all route meta functions must return an array of meta objects.

To reference the v1 meta function API, see https://remix.run/route/meta`);E.meta=y,c[l]=E,a=[...y],s=a}return u.createElement(u.Fragment,null,a.flat().map(l=>{if(!l)return null;if("tagName"in l){let d=l.tagName;return delete l.tagName,_r(d)?u.createElement(d,w({key:JSON.stringify(l)},l)):(console.warn(`A meta object uses an invalid tagName: ${d}. Expected either 'link' or 'meta'`),null)}if("title"in l)return u.createElement("title",{key:"title"},String(l.title));if("charset"in l&&(l.charSet??(l.charSet=l.charset),delete l.charset),"charSet"in l&&l.charSet!=null)return typeof l.charSet=="string"?u.createElement("meta",{key:"charSet",charSet:l.charSet}):null;if("script:ld+json"in l){let d=null;try{d=JSON.stringify(l["script:ld+json"])}catch{}return d!=null&&u.createElement("script",{key:"script:ld+json",type:"application/ld+json",dangerouslySetInnerHTML:{__html:JSON.stringify(l["script:ld+json"])}})}return u.createElement("meta",w({key:JSON.stringify(l)},l))}))}function _r(e){return typeof e=="string"&&/^(meta|link)$/.test(e)}function xr(){let{future:e}=k();return e!=null&&e.v2_meta?u.createElement(Sr,null):u.createElement(Er,null)}function gt(e){return u.createElement(Ne,e)}var Te=!1;function br(e){let{manifest:t,serverHandoffString:r,abortDelay:o}=k(),{router:n,static:i,staticContext:a}=dt(),{matches:s}=G(),c=I();u.useEffect(()=>{Te=!0},[]);let l=[],d=u.useMemo(()=>{var h;let y=a?`window.__remixContext = ${r};`:" ",E=a?.activeDeferreds;y+=E?["__remixContext.p = function(v,e,p,x) {","  if (typeof e !== 'undefined') {",`    x=new Error("Unexpected Server Error");
    x.stack=undefined;`,"    p=Promise.reject(x);","  } else {","    p=Promise.resolve(v);","  }","  return p;","};","__remixContext.n = function(i,k) {","  __remixContext.t = __remixContext.t || {};","  __remixContext.t[i] = __remixContext.t[i] || {};","  let p = new Promise((r, e) => {__remixContext.t[i][k] = {r:(v)=>{r(v);},e:(v)=>{e(v);}};});",typeof o=="number"?`setTimeout(() => {if(typeof p._error !== "undefined" || typeof p._data !== "undefined"){return;} __remixContext.t[i][k].e(new Error("Server timeout."))}, ${o});`:"","  return p;","};","__remixContext.r = function(i,k,v,e,p,x) {","  p = __remixContext.t[i][k];","  if (typeof e !== 'undefined') {",`    x=new Error("Unexpected Server Error");
    x.stack=undefined;`,"    p.e(x);","  } else {","    p.r(v);","  }","};"].join(`
`)+Object.entries(E).map(([v,S])=>{let O=new Set(S.pendingKeys),J=S.deferredKeys.map(b=>{if(O.has(b))return l.push(u.createElement(ct,{key:`${v} | ${b}`,deferredData:S,routeId:v,dataKey:b,scriptProps:e})),`${JSON.stringify(b)}:__remixContext.n(${JSON.stringify(v)}, ${JSON.stringify(b)})`;{let Re=S.data[b];if(typeof Re._error<"u"){let Ft={message:"Unexpected Server Error",stack:void 0};return`${JSON.stringify(b)}:__remixContext.p(!1, ${K(JSON.stringify(Ft))})`}else{if(typeof Re._data>"u")throw new Error(`The deferred data for ${b} was not resolved, did you forget to return data from a deferred promise?`);return`${JSON.stringify(b)}:__remixContext.p(${K(JSON.stringify(Re._data))})`}}}).join(`,
`);return`Object.assign(__remixContext.state.loaderData[${JSON.stringify(v)}], {${J}});`}).join(`
`)+(l.length>0?`__remixContext.a=${l.length};`:""):"";let _=i?`${(h=t.hmr)!==null&&h!==void 0&&h.runtime?`import ${JSON.stringify(t.hmr.runtime)};`:""}import ${JSON.stringify(t.url)};
${s.map((v,S)=>`import * as route${S} from ${JSON.stringify(t.routes[v.route.id].module)};`).join(`
`)}
window.__remixRouteModules = {${s.map((v,S)=>`${JSON.stringify(v.route.id)}:route${S}`).join(",")}};

import(${JSON.stringify(t.entry.module)});`:" ";return u.createElement(u.Fragment,null,u.createElement("script",w({},e,{suppressHydrationWarning:!0,dangerouslySetInnerHTML:Oe(y),type:void 0})),u.createElement("script",w({},e,{suppressHydrationWarning:!0,dangerouslySetInnerHTML:Oe(_),type:"module",async:!0})))},[]);if(!i&&typeof __remixContext=="object"&&__remixContext.a)for(let h=0;h<__remixContext.a;h++)l.push(u.createElement(ct,{key:h,scriptProps:e}));let f=u.useMemo(()=>{if(c.location){let h=q(n.routes,c.location);return N(h,`No routes match path "${c.location.pathname}"`),h}return[]},[c.location,n.routes]),m=s.concat(f).map(h=>{let y=t.routes[h.route.id];return(y.imports||[]).concat([y.module])}).flat(1),g=Te?[]:t.entry.imports.concat(m);return Te?null:u.createElement(u.Fragment,null,u.createElement("link",{rel:"modulepreload",href:t.entry.module,crossOrigin:e.crossOrigin}),Cr(g).map(h=>u.createElement("link",{key:h,rel:"modulepreload",href:h,crossOrigin:e.crossOrigin})),d,l)}function ct({dataKey:e,deferredData:t,routeId:r,scriptProps:o}){return typeof document>"u"&&t&&e&&r&&N(t.pendingKeys.includes(e),`Deferred data for route ${r} with key ${e} was not pending but tried to render a script for it.`),u.createElement(u.Suspense,{fallback:typeof document>"u"&&t&&e&&r?null:u.createElement("script",w({},o,{async:!0,suppressHydrationWarning:!0,dangerouslySetInnerHTML:{__html:" "}}))},typeof document>"u"&&t&&e&&r?u.createElement(gt,{resolve:t.data[e],errorElement:u.createElement(Nr,{dataKey:e,routeId:r,scriptProps:o}),children:n=>u.createElement("script",w({},o,{async:!0,suppressHydrationWarning:!0,dangerouslySetInnerHTML:{__html:`__remixContext.r(${JSON.stringify(r)}, ${JSON.stringify(e)}, ${K(JSON.stringify(n))});`}}))}):u.createElement("script",w({},o,{async:!0,suppressHydrationWarning:!0,dangerouslySetInnerHTML:{__html:" "}})))}function Nr({dataKey:e,routeId:t,scriptProps:r}){let o=re(),n={message:"Unexpected Server Error",stack:void 0};return u.createElement("script",w({},r,{suppressHydrationWarning:!0,dangerouslySetInnerHTML:{__html:`__remixContext.r(${JSON.stringify(t)}, ${JSON.stringify(e)}, !1, ${K(JSON.stringify(n))});`}}))}function Cr(e){return[...new Set(e)]}function Ue(){let{routeModules:e}=k(),t=X();return u.useMemo(()=>t.map(r=>({id:r.id,pathname:r.pathname,params:r.params,data:r.data,handle:e[r.id].handle})),[t,e])}function kr(){return _e()}function Lr(){return xe()}var Fr=()=>null;function vt(...e){return t=>{e.forEach(r=>{typeof r=="function"?r(t):r!=null&&(r.current=t)})}}we();function wt(e){if(!e)return null;let t=Object.entries(e),r={};for(let[o,n]of t)if(n&&n.__type==="RouteErrorResponse")r[o]=new ee(n.status,n.statusText,n.data,n.internal===!0);else if(n&&n.__type==="Error"){let i=new Error(n.message);i.stack=n.stack,r[o]=i}else r[o]=n;return r}var He=T(U());F();we();function St(e){return e.headers.get("X-Remix-Catch")!=null}function Dr(e){return e.headers.get("X-Remix-Error")!=null}function _t(e){return e.headers.get("X-Remix-Redirect")!=null}function xt(e){var t;return!!((t=e.headers.get("Content-Type"))!==null&&t!==void 0&&t.match(/text\/remix-deferred/))}async function Pe(e,t,r=0){let o=new URL(e.url);o.searchParams.set("_data",t);let n={signal:e.signal};if(e.method!=="GET"){n.method=e.method;let s=e.headers.get("Content-Type");s&&/\bapplication\/json\b/.test(s)?(n.headers={"Content-Type":s},n.body=JSON.stringify(await e.json())):s&&/\btext\/plain\b/.test(s)?(n.headers={"Content-Type":s},n.body=await e.text()):s&&/\bapplication\/x-www-form-urlencoded\b/.test(s)?n.body=new URLSearchParams(await e.text()):n.body=await e.formData()}r>0&&await new Promise(s=>setTimeout(s,5**r*10));let i=window.__remixRevalidation,a=await fetch(o.href,n).catch(s=>{if(typeof i=="number"&&i===window.__remixRevalidation&&s?.name==="TypeError"&&r<3)return Pe(e,t,r+1);throw s});if(Dr(a)){let s=await a.json(),c=new Error(s.message);return c.stack=s.stack,c}return a}var Ar="__deferred_promise:";async function bt(e){if(!e)throw new Error("parseDeferredReadableStream requires stream argument");let t,r={};try{let o=Mr(e),i=(await o.next()).value;if(!i)throw new Error("no critical data");let a=JSON.parse(i);if(typeof a=="object"&&a!==null)for(let[s,c]of Object.entries(a))typeof c!="string"||!c.startsWith(Ar)||(t=t||{},t[s]=new Promise((l,d)=>{r[s]={resolve:f=>{l(f),delete r[s]},reject:f=>{d(f),delete r[s]}}}));return(async()=>{try{for await(let s of o){let[c,...l]=s.split(":"),d=l.join(":"),f=JSON.parse(d);if(c==="data")for(let[m,g]of Object.entries(f))r[m]&&r[m].resolve(g);else if(c==="error")for(let[m,g]of Object.entries(f)){let h=new Error(g.message);h.stack=g.stack,r[m]&&r[m].reject(h)}}for(let[s,c]of Object.entries(r))c.reject(new ge(`Deferred ${s} will never be resolved`))}catch(s){for(let c of Object.values(r))c.reject(s)}})(),new Be({...a,...t})}catch(o){for(let n of Object.values(r))n.reject(o);throw o}}async function*Mr(e){let t=e.getReader(),r=[],o=[],n=!1,i=new TextEncoder,a=new TextDecoder,s=async()=>{if(o.length>0)return o.shift();for(;!n&&o.length===0;){let l=await t.read();if(l.done){n=!0;break}r.push(l.value);try{let f=a.decode(Et(...r)).split(`

`);if(f.length>=2&&(o.push(...f.slice(0,-1)),r=[i.encode(f.slice(-1).join(`

`))]),o.length>0)break}catch{continue}}return o.length>0||r.length>0&&(o=a.decode(Et(...r)).split(`

`).filter(d=>d),r=[]),o.shift()},c=await s();for(;c;)yield c,c=await s()}function Et(...e){let t=new Uint8Array(e.reduce((o,n)=>o+n.length,0)),r=0;for(let o of e)t.set(o,r),r+=o.length;return t}function Ct(e){let t={};return Object.values(e).forEach(r=>{let o=r.parentId||"";t[o]||(t[o]=[]),t[o].push(r)}),t}function kt(e,t,r,o){return me(t,r,o,"",Ct(t),e)}function me(e,t,r,o="",n=Ct(e),i){return(n[o]||[]).map(a=>{let s=r.v2_errorBoundary===!0?a.id==="root"||a.hasErrorBoundary:a.id==="root"||a.hasCatchBoundary||a.hasErrorBoundary,c={caseSensitive:a.caseSensitive,element:He.createElement(ft,{id:a.id}),errorElement:s?He.createElement(mt,{id:a.id}):void 0,id:a.id,index:a.index,path:a.path,handle:void 0,loader:Nt(a,t,!1),action:Nt(a,t,!0),shouldRevalidate:Or(a,t,i)},l=me(e,t,r,a.id,n,i);return l.length>0&&(c.children=l),c})}function Or(e,t,r){let o=!1;return function(n){let i=t[e.id];return N(i,`Expected route module to be loaded for ${e.id}`),r!==void 0&&!o?(o=!0,r.has(e.id)):i.shouldRevalidate?i.shouldRevalidate(n):n.defaultShouldRevalidate}}async function Tr(e,t){let r=await ce(e,t);return await at(r),r}function Nt(e,t,r){return async({request:o})=>{let n=Tr(e,t);try{if(r&&!e.hasAction){let a=`Route "${e.id}" does not have an action, but you are trying to submit to it. To fix this, please add an \`action\` function to the route`;throw console.error(a),new Error(a)}else if(!r&&!e.hasLoader)return null;let i=await Pe(o,e.id);if(i instanceof Error)throw i;if(_t(i))throw Ur(i);if(St(i))throw i;return xt(i)&&i.body?await bt(i.body):i}finally{await n}}}function Ur(e){let t=parseInt(e.headers.get("X-Remix-Status"),10)||302,r=e.headers.get("X-Remix-Redirect"),o={},n=e.headers.get("X-Remix-Revalidate");return n&&(o["X-Remix-Revalidate"]=n),ve(r,{status:t,headers:o})}var L,he;import.meta&&import.meta.hot&&import.meta.hot.accept("remix:manifest",async({assetsManifest:e,needsRevalidation:t})=>{let r=[...new Set(L.state.matches.map(s=>s.route.id).concat(Object.keys(window.__remixRouteModules)))];he&&he.abort(),he=new AbortController;let o=he.signal,n=Object.assign({},window.__remixRouteModules,Object.fromEntries((await Promise.all(r.map(async s=>{var c,l,d,f;if(!e.routes[s])return null;let m=await import(e.routes[s].module+`?t=${(c=e.hmr)===null||c===void 0?void 0:c.timestamp}`);return[s,{...m,default:m.default?((l=window.__remixRouteModules[s])===null||l===void 0?void 0:l.default)??m.default:m.default,CatchBoundary:m.CatchBoundary?((d=window.__remixRouteModules[s])===null||d===void 0?void 0:d.CatchBoundary)??m.CatchBoundary:m.CatchBoundary,ErrorBoundary:m.ErrorBoundary?((f=window.__remixRouteModules[s])===null||f===void 0?void 0:f.ErrorBoundary)??m.ErrorBoundary:m.ErrorBoundary}]}))).filter(Boolean)));Object.assign(window.__remixRouteModules,n);let i=kt(t,e.routes,window.__remixRouteModules,window.__remixContext.future);L._internalSetRoutes(i);let a=L.subscribe(s=>{if(s.revalidation==="idle"){if(a(),o.aborted)return;setTimeout(()=>{Object.assign(window.__remixManifest,e),window.$RefreshRuntime$.performReactRefresh()},1)}});window.__remixRevalidation=(window.__remixRevalidation||0)+1,L.revalidate()});function Pr(e){if(!L){let o=me(window.__remixManifest.routes,window.__remixRouteModules,window.__remixContext.future),n=window.__remixContext.state;n&&n.errors&&(n={...n,errors:wt(n.errors)}),L=Xe(o,{hydrationData:n,future:{v7_normalizeFormMethod:window.__remixContext.future.v2_normalizeFormMethod}});let i=window.__remixContext.url,a=window.location.pathname+window.location.search;if(i!==a){let s=`Initial URL (${i}) does not match URL at time of hydration (${a}), reloading page...`;console.error(s),window.location.reload()}}let[t,r]=D.useState(L.state.location);return D.useLayoutEffect(()=>L.subscribe(o=>{o.location!==t&&r(o.location)}),[t]),D.createElement(Q.Provider,{value:{manifest:window.__remixManifest,routeModules:window.__remixRouteModules,future:window.__remixContext.future}},D.createElement(ue,{location:t,component:j},D.createElement(be,{router:L,fallbackElement:null,future:{v7_startTransition:!0}})))}F();var pe=T(U());F();var Lt="positions";function Hr({getKey:e,...t}){let r=x(),o=Ue();Ze({getKey:e,storageKey:Lt});let n=pe.useMemo(()=>{if(!e)return null;let a=e(r,o);return a!==r.key?a:null},[]),i=((a,s)=>{if(!window.history.state||!window.history.state.key){let c=Math.random().toString(32).slice(2);window.history.replaceState({key:c},"")}try{let l=JSON.parse(sessionStorage.getItem(a)||"{}")[s||window.history.state.key];typeof l=="number"&&window.scrollTo(0,l)}catch(c){console.error(c),sessionStorage.removeItem(a)}}).toString();return pe.createElement("script",w({},t,{suppressHydrationWarning:!0,dangerouslySetInnerHTML:{__html:`(${i})(${JSON.stringify(Lt)}, ${JSON.stringify(n)})`}}))}export{or as a,gr as b,xr as c,br as d,kr as e,Lr as f,Fr as g,Pr as h,Hr as i};
/*! Bundled license information:

react-router-dom/dist/index.js:
  (**
   * React Router DOM v6.14.0
   *
   * Copyright (c) Remix Software Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE.md file in the root directory of this source tree.
   *
   * @license MIT
   *)

@remix-run/react/dist/esm/_virtual/_rollupPluginBabelHelpers.js:
  (**
   * @remix-run/react v1.18.0
   *
   * Copyright (c) Remix Software Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE.md file in the root directory of this source tree.
   *
   * @license MIT
   *)

@remix-run/react/dist/esm/errorBoundaries.js:
  (**
   * @remix-run/react v1.18.0
   *
   * Copyright (c) Remix Software Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE.md file in the root directory of this source tree.
   *
   * @license MIT
   *)

@remix-run/react/dist/esm/invariant.js:
  (**
   * @remix-run/react v1.18.0
   *
   * Copyright (c) Remix Software Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE.md file in the root directory of this source tree.
   *
   * @license MIT
   *)

@remix-run/react/dist/esm/routeModules.js:
  (**
   * @remix-run/react v1.18.0
   *
   * Copyright (c) Remix Software Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE.md file in the root directory of this source tree.
   *
   * @license MIT
   *)

@remix-run/react/dist/esm/links.js:
  (**
   * @remix-run/react v1.18.0
   *
   * Copyright (c) Remix Software Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE.md file in the root directory of this source tree.
   *
   * @license MIT
   *)

@remix-run/react/dist/esm/markup.js:
  (**
   * @remix-run/react v1.18.0
   *
   * Copyright (c) Remix Software Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE.md file in the root directory of this source tree.
   *
   * @license MIT
   *)

@remix-run/react/dist/esm/components.js:
  (**
   * @remix-run/react v1.18.0
   *
   * Copyright (c) Remix Software Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE.md file in the root directory of this source tree.
   *
   * @license MIT
   *)

@remix-run/react/dist/esm/errors.js:
  (**
   * @remix-run/react v1.18.0
   *
   * Copyright (c) Remix Software Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE.md file in the root directory of this source tree.
   *
   * @license MIT
   *)

@remix-run/react/dist/esm/data.js:
  (**
   * @remix-run/react v1.18.0
   *
   * Copyright (c) Remix Software Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE.md file in the root directory of this source tree.
   *
   * @license MIT
   *)

@remix-run/react/dist/esm/routes.js:
  (**
   * @remix-run/react v1.18.0
   *
   * Copyright (c) Remix Software Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE.md file in the root directory of this source tree.
   *
   * @license MIT
   *)

@remix-run/react/dist/esm/browser.js:
  (**
   * @remix-run/react v1.18.0
   *
   * Copyright (c) Remix Software Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE.md file in the root directory of this source tree.
   *
   * @license MIT
   *)

@remix-run/react/dist/esm/scroll-restoration.js:
  (**
   * @remix-run/react v1.18.0
   *
   * Copyright (c) Remix Software Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE.md file in the root directory of this source tree.
   *
   * @license MIT
   *)

@remix-run/react/dist/esm/index.js:
  (**
   * @remix-run/react v1.18.0
   *
   * Copyright (c) Remix Software Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE.md file in the root directory of this source tree.
   *
   * @license MIT
   *)
*/
