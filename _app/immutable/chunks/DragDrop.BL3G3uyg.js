import{s as g,k as b,e as D,c as w,b as v,f as c,h as d,y as h,i as A,z as m,u as k,l as y,m as T,A as W}from"./scheduler.BZf3Antt.js";import{S as E,i as z,t as F,b as S}from"./index.C7bWdOrd.js";import{b as $}from"./paths.DYh8d7W1.js";import{g as q}from"./entry.C06OU6_c.js";import{v as p}from"./stores.BEpXIDt_.js";function B(r){let e,s,f,u;const l=r[4].default,t=b(l,r,r[3],null);return{c(){e=D("div"),t&&t.c(),this.h()},l(a){e=w(a,"DIV",{role:!0,tabindex:!0,"aria-label":!0,class:!0});var n=v(e);t&&t.l(n),n.forEach(c),this.h()},h(){d(e,"role","button"),d(e,"tabindex","0"),d(e,"aria-label","dropzone"),d(e,"class","grow"),h(e,"blur",r[0])},m(a,n){A(a,e,n),t&&t.m(e,null),s=!0,f||(u=[m(e,"dragenter",r[1]),m(e,"dragover",r[1]),m(e,"dragleave",r[5]),m(e,"drop",r[2])],f=!0)},p(a,[n]){t&&t.p&&(!s||n&8)&&k(t,l,a,a[3],s?T(l,a[3],n,null):y(a[3]),null),(!s||n&1)&&h(e,"blur",a[0])},i(a){s||(F(t,a),s=!0)},o(a){S(t,a),s=!1},d(a){a&&c(e),t&&t.d(a),f=!1,W(u)}}}function C(r,e,s){let{$$slots:f={},$$scope:u}=e,l=!1;function t(o){s(0,l=!0),o.preventDefault()}function a(o){s(0,l=!1);const _=new FileReader;if(o.dataTransfer!==null){const i=o.dataTransfer.files[0];if(_.onloadend=async function(){i.name.endsWith(".onnx")?p.set({kind:"onnx",data:new Uint8Array(this.result)}):i.name.endsWith(".dot")&&p.set({kind:"dot",data:this.result}),await q(`${$}/viewer`)},i.name.endsWith(".onnx"))_.readAsArrayBuffer(i);else if(i.name.endsWith(".dot"))_.readAsText(i);else throw new Error(`unknown extension: ${i.name}`)}s(0,l=!1),o.preventDefault()}const n=()=>s(0,l=!1);return r.$$set=o=>{"$$scope"in o&&s(3,u=o.$$scope)},[l,t,a,u,f,n]}class G extends E{constructor(e){super(),z(this,e,C,B,g,{})}}export{G as D};