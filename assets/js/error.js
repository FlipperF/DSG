"use strict";
const skip=document.querySelector('.error-skip');
if(skip&&location.protocol!=='file:')skip.href=location.pathname+location.search+'#error-main';
const mechanism=document.querySelector('.error-art');
requestAnimationFrame(()=>requestAnimationFrame(()=>mechanism.classList.add('is-playing')));
const business=window.DSG_CONFIG||{};
const phone=document.querySelector('.error-phone>span');
if(business.phone){const link=document.createElement('a');link.href='tel:'+business.phone.replace(/[^+0-9]/g,'');link.textContent=business.phone;phone.replaceWith(link);}
const contactDialog=document.getElementById('contact-dialog');
document.querySelectorAll('[data-contact]').forEach(button=>button.addEventListener('click',()=>{
 const name=button.dataset.contact,url=business.messengers?.[name];
 if(url&&/^https:\/\//.test(url)){window.open(url,'_blank','noopener,noreferrer');return;}
 document.getElementById('contact-title').textContent='Написать в '+name;
 contactDialog.showModal();
}));
document.querySelectorAll('[data-close-contact]').forEach(button=>button.addEventListener('click',()=>contactDialog.close()));
contactDialog.addEventListener('click',event=>{if(event.target!==contactDialog)return;const r=contactDialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)contactDialog.close();});

if(location.protocol==='file:'){
 document.querySelectorAll('a[href]').forEach(link=>{
  const target=new URL(link.getAttribute('href'),location.href);
  if(target.protocol==='file:'&&target.pathname.endsWith('/'))link.href=new URL('index.html'+target.search+target.hash,target).href;
 });
}
