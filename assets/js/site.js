'use strict';

// Static prototype. Forms never persist data or send requests.
const assetBase = new URL('../images/', document.currentScript.src).href;
const optimizedPhotoSizes = {"tow-highway-modal":{"width":640,"height":853,"widths":[320,480,640]},"brands-diagnostic":{"width":800,"height":600,"widths":[320,480,640,800]},"brands-hero":{"width":900,"height":675,"widths":[320,480,640,900]},"brands-modal":{"width":640,"height":853,"widths":[320,480,640]},"clutch-phone":{"width":800,"height":600,"widths":[320,480,640,800]},"diagnostic-phone":{"width":800,"height":600,"widths":[320,480,640,800]},"dsg-diagnostic-client":{"width":800,"height":600,"widths":[320,480,640,800]},"dsg-hero-client":{"width":900,"height":675,"widths":[320,480,640,900]},"dsg-modal-client":{"width":640,"height":853,"widths":[320,480,640]},"dsg-repair-client":{"width":800,"height":600,"widths":[320,480,640,800]},"gearboxes-clutch":{"width":800,"height":600,"widths":[320,480,640,800]},"gearboxes-diagnostic":{"width":800,"height":600,"widths":[320,480,640,800]},"gearboxes-hero":{"width":900,"height":675,"widths":[320,480,640,900]},"gearboxes-modal":{"width":640,"height":853,"widths":[320,480,640]},"gearboxes-repair":{"width":800,"height":600,"widths":[320,480,640,800]},"hero-phone":{"width":900,"height":675,"widths":[320,480,640,900]},"home-clutch-fitting":{"width":800,"height":600,"widths":[320,480,640,800]},"home-gearbox-stand":{"width":800,"height":600,"widths":[320,480,640,800]},"home-mechatronic-detail":{"width":800,"height":600,"widths":[320,480,640,800]},"home-modal":{"width":640,"height":853,"widths":[320,480,640]},"home-test-drive":{"width":800,"height":600,"widths":[320,480,640,800]},"mechatronic-phone":{"width":800,"height":600,"widths":[320,480,640,800]},"shop-phone":{"width":800,"height":600,"widths":[320,480,640,800]}};
const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
// Directory URLs on the server; direct-file previews resolve them to local index files.
if(location.protocol==='file:'){
 const siteRoot=new URL('../../',document.currentScript.src);
 document.querySelectorAll('a[href^="/"]').forEach(link=>{
  const target=new URL(link.getAttribute('href'),'https://local.invalid');
  const local=target.pathname==='/'?'index.html':target.pathname.replace(/^\//,'').replace(/\/$/,'/index.html');
  link.href=new URL(local+target.search+target.hash,siteRoot).href;
 });
}
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const motionCurve = 'cubic-bezier(0.23, 1, 0.32, 1)';
// Keep a national-number model so editing punctuation never traps the caret.
function phoneDigits(value) {
  const digits = value.replace(/\D/g, '');
  return ((digits.length > 10 && /^[78]/.test(digits)) || value.startsWith('+7') ? digits.slice(1) : digits).slice(0, 10);
}
function formatPhone(digits) {
  if(!digits) return '+7 (';
  let value = '+7 (' + digits.slice(0, 3);
  if(digits.length >= 3) value += ') ';
  if(digits.length > 3) value += digits.slice(3, 6);
  if(digits.length >= 6) value += '-';
  if(digits.length > 6) value += digits.slice(6, 8);
  if(digits.length >= 8) value += '-';
  if(digits.length > 8) value += digits.slice(8, 10);
  return value;
}
$$('input[type="tel"]').forEach(input => {
  input.placeholder = '+7 (999) 999-99-99';
  input.maxLength = 18;
  const indexAt = position => Math.max(0, (input.value.slice(0, position).match(/\d/g) || []).length - (input.value.startsWith('+7') ? 1 : 0));
  function render(digits, index) {
    input.value = formatPhone(digits);
    let caret = input.value.length;
    if(index === 0) caret = 4;
    else {
      let count = 0;
      for(let i = 4; i < input.value.length; i++) {
        if(/\d/.test(input.value[i]) && ++count === index) {caret = i + 1; break;}
      }
      while(caret < input.value.length && /[^\d]/.test(input.value[caret])) caret++;
    }
    input.setSelectionRange(caret, caret);
    input.dispatchEvent(new Event('input', {bubbles:true}));
  }
  input.addEventListener('focus', () => {if(!input.value) {input.value = '+7 ('; input.setSelectionRange(4, 4);}});
  input.addEventListener('blur', () => {if(!phoneDigits(input.value)) input.value = '';});
  input.addEventListener('beforeinput', event => {
    if(!event.cancelable || !['insertText','deleteContentBackward','deleteContentForward'].includes(event.inputType)) return;
    event.preventDefault();
    const digits = phoneDigits(input.value);
    let start = indexAt(input.selectionStart), end = indexAt(input.selectionEnd);
    if(event.inputType === 'insertText') {
      const added = (event.data || '').replace(/\D/g, '');
      if(!added) return;
      render((digits.slice(0, start) + added + digits.slice(end)).slice(0, 10), Math.min(start + added.length, 10));
    } else {
      if(start === end) {
        if(event.inputType === 'deleteContentBackward') start = Math.max(0, start - 1);
        else end = Math.min(digits.length, end + 1);
      }
      render(digits.slice(0, start) + digits.slice(end), start);
    }
  });
  input.addEventListener('paste', event => {
    event.preventDefault();
    const added = phoneDigits(event.clipboardData.getData('text'));
    const digits = phoneDigits(input.value), start = indexAt(input.selectionStart), end = indexAt(input.selectionEnd);
    render((digits.slice(0, start) + added + digits.slice(end)).slice(0, 10), Math.min(start + added.length, 10));
  });
  // Autofill and browsers without cancelable beforeinput use this fallback.
  input.addEventListener('input', () => {
    const digits = phoneDigits(input.value), formatted = formatPhone(digits);
    if(input.value && input.value !== formatted) input.value = formatted;
  });
});
const menuButton = $('.menu-toggle');
const menu = $('#mobile-menu');
function closeMenu() {
  menu.hidden = true;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Открыть меню');
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menu.hidden = !open;
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
});
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if(event.key === 'Escape' && !menu.hidden) { closeMenu(); menuButton.focus(); }
});
window.matchMedia('(min-width: 1191px)').addEventListener('change', event => { if(event.matches) closeMenu(); });

const leadDialog = $('#lead-dialog');
const modalForm = $('#modal-form');
const modalPhotoTitleMarkup=$('.modal-photo-copy h3')?.innerHTML;
const modalPhotoListMarkup=$('.modal-photo-copy ul')?.innerHTML;
const modalPhotoLabel=$('.modal-photo-copy>span')?.textContent;
const contexts = {
  tow: {label:'Доставка автомобиля в сервис', title:'Вызвать эвакуатор', description:'Оставьте телефон — согласуем адрес и подачу эвакуатора. До 100 км от МКАД, подача в течение 30 минут. Бесплатно при ремонте АКПП в нашем сервисе.', button:'Вызвать эвакуатор', image:'tow-highway-modal'},
  installment: {label:'Консультация по рассрочке', title:'Обсудите ремонт\nв рассрочку на 4 месяца.', description:'Расскажите о вашем автомобиле. Мастер объяснит условия рассрочки без процентов и обсудит график платежей до начала ремонта.', button:'Получить консультацию по рассрочке', image:'home-modal'},
  consult: {"label": "Консультация специалиста", "title": "Получить консультацию", "description": "Оставьте телефон. Специалист ответит на вопросы по вашей коробке, уточнит симптомы и объяснит порядок диагностики и ремонта.", "button": "Получить консультацию", "image": "diagnostic-phone"},
  family: {"label": "Консультация специалиста", "title": "Получить консультацию", "description": "Оставьте телефон. Специалист ответит на вопросы по вашей коробке, уточнит симптомы и объяснит порядок диагностики и ремонта.", "button": "Получить консультацию", "image": "diagnostic-phone"},
  car: {"label": "Консультация специалиста", "title": "Получить консультацию", "description": "Оставьте телефон. Специалист ответит на вопросы по вашей коробке, уточнит симптомы и объяснит порядок диагностики и ремонта.", "button": "Получить консультацию", "image": "diagnostic-phone"},
  guarantee: {"label": "Консультация специалиста", "title": "Получить консультацию", "description": "Оставьте телефон. Специалист ответит на вопросы по вашей коробке, уточнит симптомы и объяснит порядок диагностики и ремонта.", "button": "Получить консультацию", "image": "diagnostic-phone"},
  repair: {"label": "Расчет стоимости ремонта", "title": "Расчет стоимости ремонта АКПП", "description": "Укажите автомобиль и оставьте телефон. Специалист рассчитает предварительную стоимость работ и деталей. Точную смету согласуем после диагностики.", "button": "Узнать стоимость ремонта", "image": "mechatronic-phone"},
  price: {"label": "Расчет стоимости ремонта", "title": "Расчет стоимости ремонта АКПП", "description": "Укажите автомобиль и оставьте телефон. Специалист рассчитает предварительную стоимость работ и деталей. Точную смету согласуем после диагностики.", "button": "Узнать стоимость ремонта", "image": "mechatronic-phone"},
  diagnostic: {"label": "Диагностика АКПП", "title": "Записаться на диагностику", "description": "Оставьте телефон, чтобы выбрать время визита. Диагностика DSG бесплатна; условия проверки других коробок уточнит специалист.", "button": "Записаться на диагностику", "image": "diagnostic-phone"},
  visit: {"label": "Консультация специалиста", "title": "Получить консультацию", "description": "Автомобиль не на ходу? Оставьте телефон. Специалист согласует доставку в сервис. Бесплатный эвакуатор — до 100 км от МКАД при ремонте АКПП в сервисе. Подача в течение 30 минут.", "button": "Получить консультацию", "image": "diagnostic-phone"},
  question: {"label": "Консультация специалиста", "title": "Получить консультацию", "description": "Оставьте телефон. Специалист ответит на вопросы по вашей коробке, уточнит симптомы и объяснит порядок диагностики и ремонта.", "button": "Получить консультацию", "image": "diagnostic-phone"},
  experience: {"label": "Консультация специалиста", "title": "Получить консультацию", "description": "Оставьте телефон. Специалист ответит на вопросы по вашей коробке, уточнит симптомы и объяснит порядок диагностики и ремонта.", "button": "Получить консультацию", "image": "diagnostic-phone"}
};
function updateScrollLock() {
  document.body.classList.toggle('dialog-open', Boolean(document.querySelector('dialog[open]')));
}
function showDialog(dialog, event) {
  dialog.scrollTop = 0;
  dialog.showModal();
  dialog.scrollTop = 0;
  updateScrollLock();
  if(!reducedMotion.matches && event && event.detail !== 0) {
    dialog.dataset.opening = 'true';
    const openingMotion = dialog.animate([{opacity:0,transform:'scale(.96)'},{opacity:1,transform:'scale(1)'}],{duration:250,easing:motionCurve});
    openingMotion.finished.finally(()=>{delete dialog.dataset.opening;});
  }
}
function closeDialog(dialog, event) {
  if(!dialog.open || dialog.dataset.closing) return;
  if(!reducedMotion.matches && event && event.detail !== 0) {
    dialog.dataset.closing = 'true';
    dialog.animate([{opacity:1,transform:'scale(1)'},{opacity:0,transform:'scale(.96)'}],{duration:180,easing:motionCurve}).finished.then(()=>{
      delete dialog.dataset.closing;
      if(dialog.open) dialog.close();
    });
  } else dialog.close();
}
$$('dialog').forEach(dialog => {
  dialog.addEventListener('close', updateScrollLock);
  dialog.addEventListener('click', event => {
    if(event.target !== dialog || dialog.dataset.opening) return;
    const rect = dialog.getBoundingClientRect();
    if(event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeDialog(dialog, event);
  });
});
function resetModal() {
  modalForm.reset();
  modalForm.hidden = false;
  $('#modal-error').textContent = '';
  $('#modal-phone').removeAttribute('aria-invalid');
  $('#modal-consent').removeAttribute('aria-invalid');
}
function openLead(key, event) {
  const context = contexts[key] || contexts.consult;
  resetModal();
  if(event?.currentTarget?.dataset.carBrand) $('#modal-car').value = event.currentTarget.dataset.carBrand;
  $('#modal-source').value = key;
  $('#modal-eyebrow').textContent = context.label;
  $('#modal-title').textContent = context.title;
  $('#modal-description').textContent = context.description;
  const selectedGearbox=event?.currentTarget?.dataset.gearbox;
  if(selectedGearbox){
    $('#modal-eyebrow').textContent='Расчет стоимости ремонта · '+selectedGearbox;
    $('#modal-title').textContent='Расчет стоимости ремонта АКПП';
    $('#modal-description').textContent='Оставьте телефон для предварительного расчета ремонта '+selectedGearbox+'. Специалист уточнит автомобиль, симптомы и состав возможных работ.';
    $('#modal-source').value='gearbox:'+selectedGearbox;
  }

  $('#modal-submit').replaceChildren(document.createTextNode(context.button + ' '));
  const arrow = document.createElement('span'); arrow.setAttribute('aria-hidden','true'); arrow.textContent = '↗';
  $('#modal-submit').append(arrow);
  const photoTitle=$('.modal-photo-copy h3');
  if(photoTitle){if(key==='installment')photoTitle.innerHTML=modalPhotoTitleMarkup;else photoTitle.textContent=context.label;}

  const photoList=$('.modal-photo-copy ul');
  const photoLabel=$('.modal-photo-copy>span');
  if(photoList)photoList.innerHTML=key==='tow'?'<li>До 100 км от МКАД</li><li>Подача в течение 30 минут</li><li>Бесплатно при ремонте АКПП у нас</li>':modalPhotoListMarkup;
  if(photoLabel)photoLabel.textContent=key==='tow'?'Помощь на дороге':modalPhotoLabel;
  const modalImage = $('.modal-photo>img');
  if(modalImage) {
    const name=key==='tow'?context.image:(document.body.dataset.leadImage || context.image);
    modalImage.alt=key==='tow'?'Эвакуатор перевозит автомобиль по загородной трассе':'Работа мастера в автосервисе';
    const photo=optimizedPhotoSizes[name];
    if(photo){
      modalImage.sizes='(max-width:700px) 1px, (max-width:960px) 40vw, 475px';
      modalImage.srcset=photo.widths.map(width=>assetBase+(width===photo.width?name+'.jpg':'responsive/'+name+'-'+width+'.jpg')+' '+width+'w').join(', ');
      modalImage.width=photo.width;modalImage.height=photo.height;
    } else {modalImage.removeAttribute('srcset');modalImage.removeAttribute('sizes');}
    modalImage.src=assetBase+name+'.jpg';
  }
  closeMenu();
  showDialog(leadDialog, event);
}
$$('[data-open-lead]').forEach(button => button.addEventListener('click',event => openLead(button.dataset.openLead,event)));
$$('[data-close-lead]').forEach(button => button.addEventListener('click',event => closeDialog(leadDialog,event)));
$$('.model-card').forEach(card=>card.addEventListener('click',event=>{
  if(event.target.closest('button'))return;
  const action=card.querySelector('[data-gearbox]');
  if(action)openLead('repair',{currentTarget:action,detail:event.detail});
}));

const privacyDialog = $('#privacy-dialog');
$$('[data-privacy]').forEach(button => button.addEventListener('click',event => showDialog(privacyDialog,event)));
$$('[data-close-dialog]').forEach(button => button.addEventListener('click',event => closeDialog(privacyDialog,event)));

function validPhone(value) {
  const digits = value.replace(/\D/g,'');
  return /^(?:7|8)\d{10}$/.test(digits) || /^9\d{9}$/.test(digits);
}
function validateForm(form, phone, consent, error) {
  phone.removeAttribute('aria-invalid'); consent.removeAttribute('aria-invalid');
  if(!validPhone(phone.value)) {
    error.textContent = 'Введите телефон: +7 и 10 цифр после кода страны.';
    phone.setAttribute('aria-invalid','true'); phone.focus(); return false;
  }
  if(!consent.checked) {
    error.textContent = 'Подтвердите согласие на обработку данных.';
    consent.setAttribute('aria-invalid','true'); consent.focus(); return false;
  }
  error.textContent = ''; return true;
}
modalForm.addEventListener('submit', event => {
  event.preventDefault();
  if(!validateForm(modalForm,$('#modal-phone'),$('#modal-consent'),$('#modal-error'))) return;
  $('#modal-error').textContent = 'Не удалось отправить заявку. Попробуйте позже.';
});
$('#hero-form')?.addEventListener('submit', event => {
  event.preventDefault();
  if(!validateForm(event.currentTarget,$('#hero-phone'),$('#hero-consent'),$('#hero-error'))) return;
  $('#hero-error').textContent = 'Не удалось отправить заявку. Попробуйте позже.';
});
[$('#hero-form'),$('#tow-form'),modalForm].filter(Boolean).forEach(form => form.addEventListener('input',()=>{
  form.querySelectorAll('[aria-invalid]').forEach(input=>input.removeAttribute('aria-invalid'));
  form.querySelector('.form-error').textContent = '';
}));

$('#tow-form')?.addEventListener('submit',event=>{
  event.preventDefault();
  if(!validateForm(event.currentTarget,$('#tow-phone'),$('#tow-consent'),$('#tow-error')))return;
  $('#tow-error').textContent='Не удалось отправить заявку. Попробуйте позже.';
});

// Real contacts can be entered in config.js. Empty values always remain explicit placeholders.
const business=window.DSG_CONFIG||{};
if(business.phone && /^\+?\d[\d ()-]{8,}$/.test(business.phone)) {
  $$('.phone-placeholder').forEach(item=>{
    const link=document.createElement('a');link.className='phone-placeholder';link.href='tel:'+business.phone.replace(/[^+\d]/g,'');link.textContent=business.phone;item.replaceWith(link);
  });
}
if(business.hours) $$('.phone-block small').forEach(item=>{
  const desktop = document.createElement('span');desktop.className='hours-desktop';desktop.textContent=business.hours.replace(/\n/g,' | ');
  const mobile = document.createElement('span');mobile.className='hours-mobile';mobile.textContent=business.hours.replace(/9\.00/g,'9').replace(/19\.00/g,'19').replace(/20\.00/g,'20').replace(/\n/g,' | ');
  item.replaceChildren(desktop,mobile);
});
const contactDialog=$('#contact-dialog');
$$('[data-contact]').forEach(button=>button.addEventListener('click',event=>{
  const name=button.dataset.contact;
  const url=business.messengers?.[name];
  if(url && /^https:\/\//.test(url)) {window.open(url,'_blank','noopener,noreferrer');return;}
  $('#contact-title').textContent='Написать в '+name;showDialog(contactDialog,event);
}));
$$('[data-close-contact]').forEach(button=>button.addEventListener('click',event=>closeDialog(contactDialog,event)));
if($('.address-list')&&Array.isArray(business.addresses)&&business.addresses.length) {
  const list=$('.address-list');const cta=list.querySelector('.address-list-cta');list.replaceChildren();
  const label=document.createElement('p');label.className='small-label';label.textContent='Адреса техцентров';list.append(label);
  business.addresses.forEach((address,index)=>{
    const article=document.createElement('article');article.className='address-item';
    const number=document.createElement('span');number.className='address-index';number.textContent=String(index+1).padStart(2,'0');
    const text=document.createElement('div');const title=document.createElement('h3');title.textContent=address.address;
    text.append(title);article.append(number,text);list.append(article);
  });
  if(cta) list.append(cta);
}
if($('.map-panel iframe') && /^https:\/\/yandex\.ru\/map-widget\//.test(business.mapEmbedUrl||'')) {
  $('.map-panel iframe').src=business.mapEmbedUrl;
}

// Once per section; never hide the hero or delay interaction. Keyboard focus reveals instantly.
const revealTargets=$$('.section-heading,.family-card,.gallery-item,.review-placeholder,.address-map-grid,.auto-brand-card');
if('IntersectionObserver' in window&&!reducedMotion.matches) {
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(!entry.isIntersecting)return;
    entry.target.classList.remove('is-pending');entry.target.classList.add('is-visible');observer.unobserve(entry.target);
  }),{rootMargin:'0px 0px 65px 0px',threshold:.08});
  revealTargets.forEach((element,index)=>{
    element.classList.add('reveal');
    if(element.getBoundingClientRect().top>window.innerHeight) {
      element.classList.add('is-pending');element.style.setProperty('--reveal-delay',(index%3)*50+'ms');observer.observe(element);
    }
  });
  document.addEventListener('focusin',event=>{
    const pending=event.target.closest('.reveal.is-pending');if(pending){pending.classList.remove('is-pending');pending.classList.add('is-visible');observer.unobserve(pending);}
  });
  reducedMotion.addEventListener('change',event=>{if(event.matches){revealTargets.forEach(item=>item.classList.remove('is-pending'));observer.disconnect();}});
}
if(window.visualViewport) window.visualViewport.addEventListener('resize',()=>{
  const editing=['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName);
  $('.mobile-bottom').classList.toggle('is-keyboard-open',editing&&visualViewport.height<innerHeight*.78);
});
// The floating CTA yields to any in-view section CTA, including the first form.
if('IntersectionObserver' in window) {
  const visibleActions = new Set();
  const observer = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{if(entry.isIntersecting) visibleActions.add(entry.target);else visibleActions.delete(entry.target);});
    $('.mobile-bottom').classList.toggle('is-inline-visible', visibleActions.size > 0);
  },{threshold:.35});
  $$('#hero-form,main [data-open-lead],.footer-cta .button').forEach(element=>observer.observe(element));
}
// Illustrate the order of approval once; replay is optional and interruptible.
const approvalBoard = $('.approval-board');
let approvalAnimations = [];
function animateApproval(event) {
  if(!approvalBoard) return;
  approvalAnimations.forEach(animation => animation.cancel());
  approvalAnimations = [];
  if(reducedMotion.matches || (event && event.detail === 0)) return;
  approvalAnimations.push($('.approval-rail-fill').animate([{transform:'scaleY(0)'},{transform:'scaleY(1)'}],{duration:900,easing:motionCurve}));
  $$('.approval-step').forEach((step,index)=>approvalAnimations.push(step.animate([{opacity:.25,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:350,delay:index*150,easing:motionCurve,fill:'backwards'})));
  approvalAnimations.push($('.approval-decision').animate([{opacity:.25,transform:'translateY(6px)'},{opacity:1,transform:'translateY(0)'}],{duration:350,delay:500,easing:motionCurve,fill:'backwards'}));
}
$('#replay-approval')?.addEventListener('click',animateApproval);
if('IntersectionObserver' in window) {
  const approvalObserver = new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting)){animateApproval();approvalObserver.disconnect();}},{threshold:.35});
  if(approvalBoard) approvalObserver.observe(approvalBoard);
}
reducedMotion.addEventListener('change',event=>{if(event.matches) approvalAnimations.forEach(animation=>animation.cancel());});

// Explanatory motion: connect diagnosis to the answer, then trace the repair path.
// It runs once in view; all text and actions are available before it starts.
const explanatoryAnimations = [];
function revealSequence(element, itemSelector, trackSelector, vertical) {
  if(!element) return;
  const items = [...element.querySelectorAll(itemSelector)];
  const animate = () => {
    const reduce = reducedMotion.matches;
    items.forEach((item,index) => explanatoryAnimations.push(item.animate(
      reduce ? [{opacity:.7},{opacity:1}] : [{opacity:.3,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],
      {duration:reduce?160:350,delay:reduce?0:index*80,easing:motionCurve}
    )));
    const track = element.querySelector(trackSelector);
    if(track && !reduce) explanatoryAnimations.push(track.animate(
      [{transform:vertical()?'scaleY(0)':'scaleX(0)'},{transform:vertical()?'scaleY(1)':'scaleX(1)'}],
      {duration:900,easing:motionCurve}
    ));
    element.dataset.motionPlayed = 'true';
  };
  if(!('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting)){animate();observer.disconnect();}},{threshold:.35});
  observer.observe(element);
}
revealSequence($('.diagnostic-route'),'.route-item','.route-line>span',()=>matchMedia('(max-width:700px)').matches);
revealSequence($('.process-grid'),'article','.process-track>span',()=>false);
reducedMotion.addEventListener('change',event=>{if(event.matches) explanatoryAnimations.forEach(animation=>animation.cancel());});

// Native details semantics and no-JS fallback, with an interruptible 200ms answer.
$$('.faq-list details').forEach(details => {
  const summary = details.querySelector('summary');
  const answer = details.querySelector('.faq-answer');
  if(!summary || !answer) return;
  let animation = null;
  let desired = details.open;
  summary.addEventListener('click', event => {
    event.preventDefault();
    details.classList.toggle('faq-instant', event.detail === 0 || reducedMotion.matches);
    if(!animation) desired = details.open;
    const opening = !desired;
    desired = opening;
    details.classList.toggle('is-closing', !opening && event.detail !== 0 && !reducedMotion.matches);
    const wasOpen = details.open;
    const start = wasOpen ? answer.getBoundingClientRect().height : 0;
    const startOpacity = wasOpen ? getComputedStyle(answer).opacity : 0;
    if(animation) {animation.cancel(); animation = null;}
    if(event.detail === 0 || reducedMotion.matches) {
      details.open = opening;
      return;
    }
    details.open = true;
    const end = opening ? answer.scrollHeight : 0;
    const running = answer.animate(
      [{height:start+'px',opacity:startOpacity},{height:end+'px',opacity:opening?1:0}],
      {duration:200,easing:motionCurve,fill:'both'}
    );
    animation = running;
    running.finished.then(() => {
      if(animation !== running) return;
      details.open = desired;
      animation = null;
      details.classList.remove('is-closing');
      running.cancel();
    }).catch(() => {});
  });
  reducedMotion.addEventListener('change', event => {
    if(event.matches && animation) {animation.cancel(); animation = null; details.open = desired; details.classList.remove('is-closing');}
  });
});

// Internal catalogue: useful local navigation, no external data or libraries.
const catalog = $('#model-grid');
if(catalog) {
  const search = $('#gearbox-search');
  const familyButtons = $$('[data-family-filter]');
  const cards = $$('.model-card');
  const brandNames = {volkswagen:'Volkswagen',audi:'Audi',skoda:'Škoda',seat:'SEAT',ford:'Ford',volvo:'Volvo'};
  const incomingBrand = new URLSearchParams(location.search).get('brand');
  const selectedBrand = Object.keys(brandNames).includes(incomingBrand) ? incomingBrand : '';
  const matchesBrand = card => !selectedBrand || card.dataset.brands.split(' ').includes(selectedBrand);
  let selectedFamily = selectedBrand ? (['ford','volvo'].includes(selectedBrand) ? 'powershift' : 'dsg') : 'all';
  let filterAnimation = null;
  function updateCatalogue(event) {
    const query = search.value.trim().toLowerCase().replace(/[\s/-]+/g,'');
    let count = 0;
    cards.forEach(card => {
      const matches = matchesBrand(card) && (selectedFamily === 'all' || card.dataset.family === selectedFamily) && card.dataset.search.toLowerCase().replace(/[\s/-]+/g,'').includes(query);
      card.hidden = !matches;
      if(matches) count++;
    });
    familyButtons.forEach(button => {
      const selected = button.dataset.familyFilter === selectedFamily;
      const familyCount = cards.filter(card=>matchesBrand(card) && (button.dataset.familyFilter==='all' || card.dataset.family===button.dataset.familyFilter)).length;
      button.querySelector('span').textContent = familyCount;
      button.disabled = familyCount === 0;
      button.setAttribute('aria-pressed',String(selected));
      button.classList.toggle('is-selected',selected);
    });
    $('#catalog-result').textContent = 'Найдено коробок: '+count;
    $('#catalog-empty').hidden = count !== 0;
    if(filterAnimation) filterAnimation.cancel();
    if(event && event.type === 'click' && event.detail !== 0 && !reducedMotion.matches && count) {
      filterAnimation = catalog.animate([{opacity:.65},{opacity:1}],{duration:160,easing:motionCurve});
    }
  }
  familyButtons.forEach(button=>button.addEventListener('click',event=>{selectedFamily=button.dataset.familyFilter;updateCatalogue(event);}));
  $$('[data-filter-jump]').forEach(link=>link.addEventListener('click',event=>{selectedFamily=link.dataset.filterJump;search.value='';updateCatalogue(event);}));
  if(selectedBrand) {
    $('#catalog-brand-context').hidden = false;
    $('#catalog-brand-name').textContent = brandNames[selectedBrand];
    const consultButton = $('.catalog-assist [data-open-lead]');
    consultButton.dataset.carBrand = brandNames[selectedBrand];
    consultButton.firstChild.textContent = 'Получить консультацию ';
  }
  updateCatalogue();
  search.addEventListener('input',updateCatalogue);
  search.addEventListener('search',updateCatalogue);
  reducedMotion.addEventListener('change',event=>{if(event.matches && filterAnimation) filterAnimation.cancel();});
}

// Interruptible disclosure motion; native details remains the no-JS fallback.
$$('.gearbox-dropdown').forEach(dropdown => {
  const trigger = dropdown.querySelector('summary');
  const panel = dropdown.querySelector('.gearbox-dropdown-panel');
  const chevron = dropdown.querySelector('.dropdown-chevron');
  let desired = dropdown.open;
  let animations = [];
  let pointerNavigation = false;
  function setExpanded(open, animate) {
    if(open === desired && (animations.length || dropdown.open === open)) return;
    const wasOpen = dropdown.open;
    const panelStyle = getComputedStyle(panel);
    const panelFrom = wasOpen ? {opacity:panelStyle.opacity,transform:panelStyle.transform} : {opacity:0,transform:'translateY(-6px) scale(.98)'};
    const arrowFrom = getComputedStyle(chevron).transform;
    animations.forEach(item=>item.cancel());
    animations = [];
    desired = open;
    if(!animate || reducedMotion.matches) {dropdown.open = open;return;}
    dropdown.open = true;
    const options = {duration:open?180:140,easing:motionCurve,fill:'both'};
    const panelAnimation = panel.animate([panelFrom,{opacity:open?1:0,transform:open?'translateY(0) scale(1)':'translateY(-6px) scale(.98)'}],options);
    const arrowAnimation = chevron.animate([{transform:arrowFrom},{transform:open?'rotate(180deg)':'rotate(0deg)'}],options);
    animations = [panelAnimation,arrowAnimation];
    panelAnimation.finished.then(()=>{
      if(animations[0] !== panelAnimation) return;
      dropdown.open = desired;
      animations.forEach(item=>item.cancel());
      animations = [];
    }).catch(()=>{});
  }
  trigger.addEventListener('click',event=>{
    event.preventDefault();
    if(!animations.length) desired = dropdown.open;
    setExpanded(!desired,event.detail !== 0);
  });
  dropdown.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>setExpanded(false,false)));
  document.addEventListener('pointerdown',()=>{pointerNavigation=true;},true);
  document.addEventListener('click',event=>{
    if(!dropdown.contains(event.target)) setExpanded(false,event.detail !== 0);
    pointerNavigation=false;
  });
  document.addEventListener('focusin',event=>{if(!pointerNavigation&&!dropdown.contains(event.target)) setExpanded(false,false);});
  document.addEventListener('keydown',event=>{
    pointerNavigation=false;
    if(event.key==='Escape'&&dropdown.open){setExpanded(false,false);trigger.focus();}
  });
  reducedMotion.addEventListener('change',event=>{
    if(event.matches){animations.forEach(item=>item.cancel());animations=[];dropdown.open=desired;}
  });
});

// Rating configuration is independent of the lead forms.
const rating=Number(business.reviewRating);
if($('[data-company-rating]')&&Number.isFinite(rating)&&rating>=0&&rating<=5){
  $('[data-company-rating]').textContent=rating.toFixed(1).replace('.',',');
  $('.company-rating').setAttribute('aria-label','Рейтинг компании '+rating.toFixed(1).replace('.',',')+' из 5');
}

// Infinite native-scroll carousel. Clones provide continuous touch scrolling at both ends.
const reviewTrack = $('.simple-review-grid');
if (reviewTrack) {
  const cards = [...reviewTrack.querySelectorAll('.simple-review')];
  const total = cards.length;
  const nav = $('.review-slider-nav'), dots = $('.review-slider-dots');
  const prev = $('[data-review-prev]'), next = $('[data-review-next]');
  let settleTimer, resizing = false;
  const mod = value => ((value % total) + total) % total;
  function cloneCard(card) {
    const clone = card.cloneNode(true);
    clone.setAttribute('aria-hidden','true');clone.inert = true;
    clone.dataset.reviewClone = 'true';
    return clone;
  }
  reviewTrack.prepend(...cards.map(cloneCard));
  reviewTrack.append(...cards.map(cloneCard));
  function step() {const items=reviewTrack.children;return items[1].offsetLeft-items[0].offsetLeft;}
  function physical() {return Math.round(reviewTrack.scrollLeft/step());}
  function sync() {
    const index=mod(physical());
    [...dots.children].forEach((dot,i)=>dot.setAttribute('aria-current',String(i===index)));
    $('.review-slider-status').textContent='Отзыв '+(index+1)+' из '+total;
  }
  function settle() {
    clearTimeout(settleTimer);
    const position=physical();
    if(position<total || position>=total*2) {
      reviewTrack.scrollTo({left:(total+mod(position))*step(),behavior:'instant'});
    }
    sync();
  }
  function move(position,event) {
    const animated=event && event.detail!==0 && !reducedMotion.matches;
    reviewTrack.scrollTo({left:position*step(),behavior:animated?'smooth':'instant'});
    if(!animated)settle();
  }
  for(let i=0;i<total;i++) {
    const dot=document.createElement('button');dot.type='button';dot.className='review-dot';
    dot.setAttribute('aria-label','Показать отзыв '+(i+1));
    dot.addEventListener('click',event=>{
      const current=physical(),index=mod(current);
      let delta=i-index;
      if(delta>total/2)delta-=total;if(delta<-total/2)delta+=total;
      move(current+delta,event);
    });dots.append(dot);
  }
  prev.disabled=false;next.disabled=false;nav.hidden=false;
  prev.addEventListener('click',event=>move(physical()-1,event));
  next.addEventListener('click',event=>move(physical()+1,event));
  reviewTrack.addEventListener('scroll',()=>{
    sync();clearTimeout(settleTimer);settleTimer=setTimeout(settle,180);
  },{passive:true});
  reviewTrack.addEventListener('scrollend',settle);
  reviewTrack.addEventListener('keydown',event=>{
    const current=physical(),index=mod(current);
    const targets={ArrowLeft:current-1,ArrowRight:current+1,Home:current-index,End:current+(total-1-index)};
    if(event.key in targets){event.preventDefault();move(targets[event.key],null);}
  });
  let previousWidth=reviewTrack.clientWidth;
  new ResizeObserver(()=>{
    if(resizing || previousWidth===reviewTrack.clientWidth)return;
    resizing=true;previousWidth=reviewTrack.clientWidth;
    reviewTrack.scrollTo({left:total*step(),behavior:'instant'});sync();resizing=false;
  }).observe(reviewTrack);
  reviewTrack.scrollTo({left:total*step(),behavior:'instant'});sync();
}

// One-time explanatory entrance, decorative imagery only; content and CTA never wait.
(() => {
  const art=document.querySelector('.tow-flight');
  if(!art||!('IntersectionObserver' in window)) return;
  art.dataset.motion='waiting';
  const observer=new IntersectionObserver(entries=>{
    if(!entries.some(entry=>entry.isIntersecting)) return;
    observer.disconnect();
    const image=art.querySelector('img');
    const ready=image?.decode ? image.decode().catch(()=>{}) : Promise.resolve();
    ready.then(()=>{art.dataset.motion='playing';});
  },{threshold:.25});
  observer.observe(art);
})();
