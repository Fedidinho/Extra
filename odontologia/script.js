const header=document.querySelector('.site-header');
const menuToggle=document.querySelector('.menu-toggle');
const mobileMenu=document.querySelector('#mobile-menu');
const backToTop=document.querySelector('.back-to-top');
const progressBar=document.querySelector('.scroll-progress span');
const yearNode=document.querySelector('#current-year');
const form=document.querySelector('#booking-form');
const formStatus=document.querySelector('#form-status');
const phoneInput=document.querySelector('#telefone');
const heroVisual=document.querySelector('.hero-visual');
const floatingCards=document.querySelectorAll('.floating-card');

if(yearNode) yearNode.textContent=new Date().getFullYear();

const updateScrollUI=()=>{
  const y=window.scrollY;
  header?.classList.toggle('scrolled',y>22);
  backToTop?.classList.toggle('visible',y>650);

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
  const isOpen=menuToggle.getAttribute('aria-expanded')==='true';
  menuToggle.setAttribute('aria-expanded',String(!isOpen));
  menuToggle.setAttribute('aria-label',isOpen?'Abrir menu':'Fechar menu');
  mobileMenu.hidden=isOpen;
  document.body.classList.toggle('menu-open',!isOpen);
});

document.querySelectorAll('#mobile-menu a').forEach(link=>link.addEventListener('click',closeMenu));
window.addEventListener('resize',()=>{if(window.innerWidth>1100) closeMenu();});
window.addEventListener('keydown',event=>{if(event.key==='Escape') closeMenu();});
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
  },{threshold:.11,rootMargin:'0px 0px -35px'});

  revealElements.forEach((el,index)=>{
    el.style.transitionDelay=`${Math.min(index%4,3)*55}ms`;
    revealObserver.observe(el);
  });
}

const navLinks=[...document.querySelectorAll('.desktop-nav a[href^="#"]')];
const navSections=navLinks.map(link=>document.querySelector(link.getAttribute('href'))).filter(Boolean);

if('IntersectionObserver' in window&&navSections.length){
  const navObserver=new IntersectionObserver(entries=>{
    const current=entries.filter(entry=>entry.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
    if(!current) return;
    navLinks.forEach(link=>link.classList.toggle('active',link.getAttribute('href')===`#${current.target.id}`));
  },{rootMargin:'-28% 0px -58% 0px',threshold:[0,.05,.2,.5]});
  navSections.forEach(section=>navObserver.observe(section));
}

if(heroVisual&&!reducedMotion&&window.matchMedia('(min-width: 881px)').matches){
  heroVisual.addEventListener('pointermove',event=>{
    const rect=heroVisual.getBoundingClientRect();
    const x=(event.clientX-rect.left)/rect.width-.5;
    const y=(event.clientY-rect.top)/rect.height-.5;
    floatingCards.forEach((card,index)=>{
      const intensity=index===0?9:-8;
      card.style.transform=`translate(${x*intensity}px,${y*intensity}px)`;
    });
  });

  heroVisual.addEventListener('pointerleave',()=>{
    floatingCards.forEach(card=>card.style.transform='');
  });
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

phoneInput?.addEventListener('input',()=>{
  const digits=phoneInput.value.replace(/\D/g,'').slice(0,11);
  let formatted=digits;
  if(digits.length>2) formatted=`(${digits.slice(0,2)}) ${digits.slice(2)}`;
  if(digits.length>7) formatted=`(${digits.slice(0,2)}) ${digits.slice(2,7)}-${digits.slice(7)}`;
  phoneInput.value=formatted;
});

form?.addEventListener('submit',event=>{
  event.preventDefault();

  if(!form.checkValidity()){
    form.reportValidity();
    if(formStatus) formStatus.textContent='Revise os campos obrigatórios antes de continuar.';
    return;
  }

  const submit=form.querySelector('button[type="submit"]');
  if(submit){
    const original=submit.innerHTML;
    submit.disabled=true;
    submit.textContent='Solicitação preparada ✓';
    setTimeout(()=>{
      submit.disabled=false;
      submit.innerHTML=original;
    },2200);
  }

  if(formStatus) formStatus.textContent='Demonstração concluída. Em um projeto real, a solicitação seria enviada à clínica.';
  form.reset();
});

document.querySelectorAll('a[href="#"]').forEach(link=>link.addEventListener('click',event=>event.preventDefault()));
