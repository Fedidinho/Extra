const header=document.querySelector('.site-header');
const menuToggle=document.querySelector('.menu-toggle');
const mobileMenu=document.querySelector('#mobile-menu');
const backToTop=document.querySelector('.back-to-top');
const yearNode=document.querySelector('#current-year');
const form=document.querySelector('#contact-form');
const formStatus=document.querySelector('#form-status');

if(yearNode) yearNode.textContent=new Date().getFullYear();

const handleScroll=()=>{
  header?.classList.toggle('scrolled',window.scrollY>30);
  backToTop?.classList.toggle('visible',window.scrollY>700);
};
handleScroll();
window.addEventListener('scroll',handleScroll,{passive:true});

const closeMenu=()=>{
  if(!menuToggle||!mobileMenu) return;
  menuToggle.setAttribute('aria-expanded','false');
  menuToggle.setAttribute('aria-label','Abrir menu');
  mobileMenu.hidden=true;
  document.body.classList.remove('menu-open');
};

menuToggle?.addEventListener('click',()=>{
  if(!mobileMenu) return;
  const isOpen=menuToggle.getAttribute('aria-expanded')==='true';
  menuToggle.setAttribute('aria-expanded',String(!isOpen));
  menuToggle.setAttribute('aria-label',isOpen?'Abrir menu':'Fechar menu');
  mobileMenu.hidden=isOpen;
  document.body.classList.toggle('menu-open',!isOpen);
});

document.querySelectorAll('#mobile-menu a').forEach(link=>link.addEventListener('click',closeMenu));
window.addEventListener('resize',()=>{if(window.innerWidth>1080) closeMenu();});

backToTop?.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));

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
  },{threshold:.12,rootMargin:'0px 0px -40px'});
  revealElements.forEach(el=>revealObserver.observe(el));
}

const animateCounter=element=>{
  const target=Number(element.dataset.counter||0);
  const suffix=element.dataset.suffix||'';
  const duration=1300;
  const startTime=performance.now();
  const tick=now=>{
    const progress=Math.min((now-startTime)/duration,1);
    const eased=1-Math.pow(1-progress,3);
    element.textContent=`${Math.floor(target*eased)}${suffix}`;
    if(progress<1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

const counters=document.querySelectorAll('[data-counter]');
if('IntersectionObserver' in window&&!reducedMotion){
  const counterObserver=new IntersectionObserver((entries,observer)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  },{threshold:.5});
  counters.forEach(counter=>counterObserver.observe(counter));
}else{
  counters.forEach(counter=>counter.textContent=`${counter.dataset.counter||0}${counter.dataset.suffix||''}`);
}

document.querySelectorAll('.faq-item button').forEach(button=>{
  button.addEventListener('click',()=>{
    const answer=button.closest('.faq-item')?.querySelector('.faq-answer');
    if(!answer) return;
    const expanded=button.getAttribute('aria-expanded')==='true';

    document.querySelectorAll('.faq-item button[aria-expanded="true"]').forEach(openButton=>{
      if(openButton!==button){
        openButton.setAttribute('aria-expanded','false');
        const openAnswer=openButton.closest('.faq-item')?.querySelector('.faq-answer');
        if(openAnswer) openAnswer.hidden=true;
      }
    });

    button.setAttribute('aria-expanded',String(!expanded));
    answer.hidden=expanded;
  });
});

form?.addEventListener('submit',event=>{
  event.preventDefault();
  if(!form.checkValidity()){
    form.reportValidity();
    if(formStatus) formStatus.textContent='Revise os campos obrigatórios antes de continuar.';
    return;
  }
  if(formStatus) formStatus.textContent='Demonstração concluída. Em um projeto real, os dados seriam enviados à integração escolhida.';
  form.reset();
});
