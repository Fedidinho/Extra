const header=document.querySelector('.site-header');
const menuToggle=document.querySelector('.menu-toggle');
const mobileMenu=document.querySelector('#mobile-menu');
const backTop=document.querySelector('.back-top');
const progressBar=document.querySelector('.scroll-progress span');
const heroMedia=document.querySelector('.hero-media');
const yearNode=document.querySelector('#current-year');
const form=document.querySelector('#contact-form');
const formStatus=document.querySelector('#form-status');
const phoneInput=document.querySelector('#telefone');
const propertySearch=document.querySelector('#property-search');
const searchFeedback=document.querySelector('#search-feedback');
const emptyState=document.querySelector('#empty-state');
const resetSearch=document.querySelector('#reset-search');

const migrateOwnerRefs=()=>{
  const oldHost='fedidinho.github.io';
  const newHost='felipeempreendimentos.github.io';
  const author=document.querySelector('meta[name="author"]');
  if(author) author.content='FelipeEmpreendimentos';
  document.querySelectorAll('[href]').forEach(el=>{const value=el.getAttribute('href');if(value?.includes(oldHost)) el.setAttribute('href',value.replaceAll(oldHost,newHost));});
  document.querySelectorAll('meta[content]').forEach(el=>{const value=el.getAttribute('content');if(value?.includes(oldHost)) el.setAttribute('content',value.replaceAll(oldHost,newHost));});
  document.querySelectorAll('script[type="application/ld+json"]').forEach(el=>{if(el.textContent.includes(oldHost)) el.textContent=el.textContent.replaceAll(oldHost,newHost);});
  const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
  let node; while((node=walker.nextNode())){if(node.nodeValue?.includes('Fedidinho')) node.nodeValue=node.nodeValue.replaceAll('Fedidinho','FelipeEmpreendimentos');}
};
migrateOwnerRefs();

if(yearNode) yearNode.textContent=new Date().getFullYear();

const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const updateScrollUI=()=>{
  const y=window.scrollY;
  header?.classList.toggle('scrolled',y>28);
  backTop?.classList.toggle('visible',y>700);
  if(progressBar){
    const doc=document.documentElement;
    const max=doc.scrollHeight-doc.clientHeight;
    progressBar.style.width=max>0?`${Math.min((y/max)*100,100)}%`:'0%';
  }
};
updateScrollUI();
window.addEventListener('scroll',updateScrollUI,{passive:true});

const closeMenu=()=>{
  if(!menuToggle||!mobileMenu) return;
  menuToggle.setAttribute('aria-expanded','false');
  menuToggle.setAttribute('aria-label','Abrir menu');
  mobileMenu.hidden=true;
  document.body.classList.remove('menu-open');
};

menuToggle?.addEventListener('click',()=>{
  if(!mobileMenu) return;
  const open=menuToggle.getAttribute('aria-expanded')==='true';
  menuToggle.setAttribute('aria-expanded',String(!open));
  menuToggle.setAttribute('aria-label',open?'Abrir menu':'Fechar menu');
  mobileMenu.hidden=open;
  document.body.classList.toggle('menu-open',!open);
});

document.querySelectorAll('#mobile-menu a').forEach(link=>link.addEventListener('click',closeMenu));
window.addEventListener('resize',()=>{if(window.innerWidth>1080) closeMenu();});
window.addEventListener('keydown',event=>{if(event.key==='Escape') closeMenu();});
backTop?.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));

const revealElements=document.querySelectorAll('.reveal');
if(reducedMotion||!('IntersectionObserver' in window)){
  revealElements.forEach(el=>el.classList.add('in-view'));
}else{
  const revealObserver=new IntersectionObserver((entries,observer)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add('in-view');observer.unobserve(entry.target);}
    });
  },{threshold:.1,rootMargin:'0px 0px -40px'});
  revealElements.forEach((el,index)=>{el.style.transitionDelay=`${Math.min(index%4,3)*45}ms`;revealObserver.observe(el);});
}

const navLinks=[...document.querySelectorAll('.desktop-nav a[href^="#"]')];
const navSections=navLinks.map(link=>document.querySelector(link.getAttribute('href'))).filter(Boolean);
if('IntersectionObserver' in window&&navSections.length){
  const navObserver=new IntersectionObserver(entries=>{
    const visible=entries.filter(entry=>entry.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
    if(!visible) return;
    navLinks.forEach(link=>link.classList.toggle('active',link.getAttribute('href')===`#${visible.target.id}`));
  },{rootMargin:'-28% 0px -58% 0px',threshold:[0,.05,.2,.5]});
  navSections.forEach(section=>navObserver.observe(section));
}

if(heroMedia&&!reducedMotion&&window.matchMedia('(min-width: 861px)').matches){
  window.addEventListener('scroll',()=>{if(window.scrollY<window.innerHeight*1.15){heroMedia.style.transform=`scale(1.04) translateY(${window.scrollY*.05}px)`;}},{passive:true});
}

const counters=document.querySelectorAll('[data-counter]');
const animateCounter=element=>{
  const target=Number(element.dataset.counter||0);const duration=1200;const start=performance.now();
  const tick=now=>{const progress=Math.min((now-start)/duration,1);const eased=1-Math.pow(1-progress,3);element.textContent=Math.floor(target*eased);if(progress<1) requestAnimationFrame(tick);};
  requestAnimationFrame(tick);
};
if('IntersectionObserver' in window&&!reducedMotion){
  const counterObserver=new IntersectionObserver((entries,observer)=>{entries.forEach(entry=>{if(entry.isIntersecting){animateCounter(entry.target);observer.unobserve(entry.target);}});},{threshold:.6});
  counters.forEach(counter=>counterObserver.observe(counter));
}else{counters.forEach(counter=>counter.textContent=counter.dataset.counter||'0');}

const cards=[...document.querySelectorAll('.property-card')];
const applyFilters=()=>{
  if(!propertySearch) return;
  const negocio=propertySearch.negocio.value;const tipo=propertySearch.tipo.value;const bairro=propertySearch.bairro.value;let visible=0;
  cards.forEach(card=>{const matchNegocio=negocio==='todos'||card.dataset.negocio===negocio;const matchTipo=tipo==='todos'||card.dataset.tipo===tipo;const matchBairro=bairro==='todos'||card.dataset.bairro===bairro;const show=matchNegocio&&matchTipo&&matchBairro;card.classList.toggle('hidden',!show);if(show) visible++;});
  if(emptyState) emptyState.hidden=visible>0;
  if(searchFeedback) searchFeedback.textContent=visible===0?'Nenhum resultado nesta seleção demonstrativa.':`${visible} ${visible===1?'imóvel encontrado':'imóveis encontrados'} nesta demonstração.`;
  document.querySelector('#imoveis')?.scrollIntoView({behavior:reducedMotion?'auto':'smooth',block:'start'});
};
propertySearch?.addEventListener('submit',event=>{event.preventDefault();applyFilters();});
resetSearch?.addEventListener('click',()=>{if(!propertySearch)return;propertySearch.reset();cards.forEach(card=>card.classList.remove('hidden'));if(emptyState) emptyState.hidden=true;if(searchFeedback) searchFeedback.textContent='';});
document.querySelectorAll('[data-region]').forEach(link=>{link.addEventListener('click',()=>{if(!propertySearch)return;propertySearch.bairro.value=link.dataset.region||'todos';propertySearch.negocio.value='todos';propertySearch.tipo.value='todos';setTimeout(applyFilters,80);});});
document.querySelectorAll('.favorite').forEach(button=>{button.addEventListener('click',event=>{event.preventDefault();event.stopPropagation();const active=button.classList.toggle('active');button.textContent=active?'♥':'♡';button.setAttribute('aria-label',active?'Remover dos favoritos demonstrativos':'Adicionar aos favoritos demonstrativos');});});
phoneInput?.addEventListener('input',()=>{const digits=phoneInput.value.replace(/\D/g,'').slice(0,11);let formatted=digits;if(digits.length>2) formatted=`(${digits.slice(0,2)}) ${digits.slice(2)}`;if(digits.length>7) formatted=`(${digits.slice(0,2)}) ${digits.slice(2,7)}-${digits.slice(7)}`;phoneInput.value=formatted;});
form?.addEventListener('submit',event=>{event.preventDefault();if(!form.checkValidity()){form.reportValidity();if(formStatus) formStatus.textContent='Revise os campos obrigatórios antes de continuar.';return;}const submit=form.querySelector('button[type="submit"]');if(submit){const original=submit.innerHTML;submit.disabled=true;submit.textContent='Mensagem preparada ✓';setTimeout(()=>{submit.disabled=false;submit.innerHTML=original;},2200);}if(formStatus) formStatus.textContent='Demonstração concluída. Em um site real, a mensagem seria enviada ao CRM, e-mail ou WhatsApp.';form.reset();});
document.querySelectorAll('a[href="#"]').forEach(link=>link.addEventListener('click',event=>event.preventDefault()));