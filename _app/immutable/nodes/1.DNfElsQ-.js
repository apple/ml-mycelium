import{s as E,e as b,t as _,a as x,c as f,b as d,v as g,f as p,d as S,i as l,j as h,w as v,n as $,x as j}from"../chunks/scheduler.BZf3Antt.js";import{S as q,i as w}from"../chunks/index.C7bWdOrd.js";import{s as y}from"../chunks/entry.C06OU6_c.js";const C=()=>{const s=y;return{page:{subscribe:s.page.subscribe},navigating:{subscribe:s.navigating.subscribe},updated:s.updated}},H={subscribe(s){return C().page.subscribe(s)}};function P(s){let t,r=s[0].status+"",o,n,i,c=s[0].error?.message+"",u;return{c(){t=b("h1"),o=_(r),n=x(),i=b("p"),u=_(c)},l(e){t=f(e,"H1",{});var a=d(t);o=g(a,r),a.forEach(p),n=S(e),i=f(e,"P",{});var m=d(i);u=g(m,c),m.forEach(p)},m(e,a){l(e,t,a),h(t,o),l(e,n,a),l(e,i,a),h(i,u)},p(e,[a]){a&1&&r!==(r=e[0].status+"")&&v(o,r),a&1&&c!==(c=e[0].error?.message+"")&&v(u,c)},i:$,o:$,d(e){e&&(p(t),p(n),p(i))}}}function k(s,t,r){let o;return j(s,H,n=>r(0,o=n)),[o]}let D=class extends q{constructor(t){super(),w(this,t,k,P,E,{})}};export{D as component};
