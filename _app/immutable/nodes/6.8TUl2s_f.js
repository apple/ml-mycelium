import{c as s}from"../chunks/index.BeFZgILa.js";import{b as i}from"../chunks/paths.DYh8d7W1.js";import{s as c}from"../chunks/scheduler.BZf3Antt.js";import{S as m,i as l,c as f,a as p,m as u,t as _,b as w,d}from"../chunks/index.C7bWdOrd.js";import{V as g}from"../chunks/Viewer.C5t0eI9O.js";async function $({fetch:r}){const n=await(await r(`${i}/examples/lenet.onnx`)).arrayBuffer(),e=new Uint8Array(n);return{network:s(e)}}const j=Object.freeze(Object.defineProperty({__proto__:null,load:$},Symbol.toStringTag,{value:"Module"}));function b(r){let t,n;return t=new g({props:{title:"LeNet • Example",network:r[0].network}}),{c(){f(t.$$.fragment)},l(e){p(t.$$.fragment,e)},m(e,o){u(t,e,o),n=!0},p(e,[o]){const a={};o&1&&(a.network=e[0].network),t.$set(a)},i(e){n||(_(t.$$.fragment,e),n=!0)},o(e){w(t.$$.fragment,e),n=!1},d(e){d(t,e)}}}function k(r,t,n){let{data:e}=t;return r.$$set=o=>{"data"in o&&n(0,e=o.data)},[e]}class M extends m{constructor(t){super(),l(this,t,k,b,c,{data:0})}}export{M as component,j as universal};