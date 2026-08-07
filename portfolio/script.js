const header=document.querySelector('.site-header');
const menuToggle=document.querySelector('.menu-toggle');
const mobileMenu=document.querySelector('#mobile-menu');
const progressBar=document.querySelector('.scroll-progress span');
const backTop=document.querySelector('.back-top');
const yearNode=document.querySelector('#current-year');
const copyStatus=document.querySelector('#copy-status');

if(yearNode) yearNode.textContent=new Date().getFullYear();

// Força o carregamento imediato das prévias. Os iframes são reduzidos via CSS e,
// quando combinados com loading="lazy", alguns navegadores postergam o download
// mesmo quando o card já está visível, deixando apenas o fundo escuro da moldura.
const previewFrames=[...document.querySelectorAll('.iframe-stage iframe')];
previewFrames.forEach(frame=>{
  const rawSrc=frame.getAttribute('src');
  if(!rawSrc) return;
  const absoluteSrc=new URL(rawSrc,window.location.href).href;
  frame.loading='eager';
  frame.setAttribute('loading','eager');
  frame.src=absoluteSrc;
});

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

const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealElements=document.querySelectorAll('.reveal');
if(reducedMotion||!('IntersectionObserver' in window)){
  revealElements.forEach(el=>el.classList.add('in-view'));
}else{
  const revealObserver=new IntersectionObserver((entries,observer)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  },{threshold:.1,rootMargin:'0px 0px -38px'});
  revealElements.forEach((el,index)=>{
    el.style.transitionDelay=`${Math.min(index%4,3)*45}ms`;
    revealObserver.observe(el);
  });
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

const message='Olá! Vi seu portfólio de sites e gostaria de conversar sobre a criação de um site para minha empresa.';
const copyMessage=async(button)=>{
  try{
    await navigator.clipboard.writeText(message);
    const original=button.textContent;
    button.textContent='Mensagem copiada ✓';
    if(copyStatus) copyStatus.textContent='Mensagem copiada. Agora é só colar no WhatsApp, Instagram ou outro canal de contato.';
    setTimeout(()=>{button.textContent=original;if(copyStatus) copyStatus.textContent='';},2600);
  }catch{
    if(copyStatus) copyStatus.textContent=`Copie esta mensagem: ${message}`;
  }
};

document.querySelectorAll('.copy-message').forEach(button=>button.addEventListener('click',()=>copyMessage(button)));
