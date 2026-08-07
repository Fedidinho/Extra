const header=document.querySelector('.site-header');
const menuToggle=document.querySelector('.menu-toggle');
const mobileMenu=document.querySelector('#mobile-menu');
const progressBar=document.querySelector('.scroll-progress span');
const backTop=document.querySelector('.back-top');
const yearNode=document.querySelector('#current-year');
const form=document.querySelector('#contact-form');
const formStatus=document.querySelector('#form-status');
const phoneInput=document.querySelector('#telefone');
const diagnosisResult=document.querySelector('#diagnosis-result');

if(yearNode) yearNode.textContent=new Date().getFullYear();

const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const updateScrollUI=()=>{
  const y=window.scrollY;
  header?.classList.toggle('scrolled',y>24);
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

const animateCounter=element=>{
  const target=Number(element.dataset.counter||0);
  const suffix=element.dataset.suffix||'';
  const duration=1250;
  const start=performance.now();
  const tick=now=>{
    const progress=Math.min((now-start)/duration,1);
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
  },{threshold:.55});
  counters.forEach(counter=>counterObserver.observe(counter));
}else{
  counters.forEach(counter=>counter.textContent=`${counter.dataset.counter||0}${counter.dataset.suffix||''}`);
}

const diagnosisContent={
  abrir:{label:'Abertura e estruturação',title:'Comece com enquadramento e rotina bem definidos.',text:'Uma boa primeira conversa deve mapear atividade, sócios, faturamento esperado e operação para organizar a abertura e os próximos passos.'},
  impostos:{label:'Planejamento e entendimento tributário',title:'Primeiro, transforme imposto em informação compreensível.',text:'O caminho é revisar atividade, regime, faturamento e composição das operações para entender de onde vêm os valores e quais pontos merecem análise.'},
  financeiro:{label:'BPO financeiro',title:'Organize o fluxo antes de tentar analisar o resultado.',text:'Contas a pagar, receber, conciliação e projeção de caixa criam uma base mais confiável para enxergar o que está acontecendo.'},
  crescimento:{label:'Consultoria de gestão',title:'Quando a empresa cresce, processo e indicador precisam crescer junto.',text:'A prioridade costuma ser estruturar rotinas, responsabilidades e indicadores que devolvam previsibilidade ao gestor.'}
};

document.querySelectorAll('[data-diagnosis]').forEach(button=>{
  button.addEventListener('click',()=>{
    const key=button.dataset.diagnosis;
    const data=diagnosisContent[key];
    if(!data||!diagnosisResult) return;
    document.querySelectorAll('[data-diagnosis]').forEach(item=>item.classList.toggle('active',item===button));
    diagnosisResult.innerHTML=`<span>${data.label}</span><strong>${data.title}</strong><p>${data.text}</p>`;
  });
});

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
    submit.textContent='Conversa preparada ✓';
    setTimeout(()=>{submit.disabled=false;submit.innerHTML=original;},2200);
  }
  if(formStatus) formStatus.textContent='Demonstração concluída. Em um projeto real, os dados seriam enviados à integração escolhida.';
  form.reset();
});

document.querySelectorAll('a[href="#"]').forEach(link=>link.addEventListener('click',event=>event.preventDefault()));