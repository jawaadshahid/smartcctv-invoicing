import{b}from"/build/_shared/chunk-LWBMBOK4.js";import{e as f,f as a}from"/build/_shared/chunk-4P2AEKIR.js";import{a as D,b as c,c as p}from"/build/_shared/chunk-BRYEQANA.js";import{a as i,e as l}from"/build/_shared/chunk-IHFEL2CD.js";import{J as u,a as A,y as m}from"/build/_shared/chunk-XTGBAL5E.js";import{e as r}from"/build/_shared/chunk-ADMCF34Z.js";var h=r(D());var s=r(A());var t=r(u()),w=()=>[{title:`${c} - Users`}];function N(){let{users:d}=l(),n=m().state==="submitting",[y,g]=(0,s.useState)(0),[v,o]=(0,s.useState)(!1),I=(0,s.useContext)(p);return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)("table",{className:"table static",children:[(0,t.jsx)("thead",{children:(0,t.jsxs)("tr",{className:"hidden md:table-row",children:[(0,t.jsx)("th",{children:"ID"}),(0,t.jsx)("th",{children:"First Name"}),(0,t.jsx)("th",{children:"Last Name"}),(0,t.jsx)("th",{children:"Email"}),(0,t.jsx)("th",{children:"Approved"}),(0,t.jsx)("th",{children:"Actions"})]})}),(0,t.jsx)("tbody",{children:d&&d.map(e=>(0,t.jsxs)("tr",{className:f,children:[(0,t.jsx)("td",{"data-label":"ID",className:a,children:e.id}),(0,t.jsx)("td",{"data-label":"First Name",className:a,children:e.firstName}),(0,t.jsx)("td",{"data-label":"Last Name",className:a,children:e.lastName}),(0,t.jsx)("td",{"data-label":"Email",className:a,children:e.email}),(0,t.jsx)("td",{"data-label":"Approved",className:a,children:e.isApproved?"Approved":(0,t.jsxs)(i,{method:"post",children:[(0,t.jsx)("input",{type:"hidden",name:"approvedUserId",value:e.id}),(0,t.jsx)("button",{type:"submit",className:"btn",children:"Approve"})]})}),(0,t.jsx)("td",{"data-label":"Actions",className:a,children:(0,t.jsxs)("div",{className:"btn-group",children:[(0,t.jsx)("a",{href:`users/${e.id}`,className:"btn",children:"EDIT"}),(0,t.jsx)("button",{className:"btn",disabled:I.id===e.id,onClick:()=>{g(e.id),o(!0)},children:"DELETE"})]})})]},e.id))})]}),(0,t.jsxs)(b,{open:v,children:[(0,t.jsx)("p",{className:"py-4",children:"Are you sure you want to delete this user?"}),(0,t.jsxs)("div",{className:"modal-action",children:[(0,t.jsxs)(i,{method:"post",onSubmit:()=>{o(!1)},children:[(0,t.jsx)("input",{type:"hidden",name:"uid",value:y}),(0,t.jsx)("button",{className:"btn",type:"submit",disabled:n,children:n?"Confirming...":"Confirm"})]}),(0,t.jsx)("button",{className:"btn",disabled:n,onClick:()=>o(!1),children:"Close"})]})]})]})}export{N as default,w as meta};
