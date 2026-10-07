  document.getElementById('yr').textContent = new Date().getFullYear();
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Menu mobile
  var toggle = document.getElementById('menuToggle');
  var nav = document.getElementById('mainNav');
  if(toggle && nav){
    toggle.addEventListener('click', function(){
      var open = nav.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    });
    nav.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){
        nav.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Abrir menu');
      });
    });
  }

  // Header: borda inferior ao rolar
  var hd = document.getElementById('hd');
  if(hd){
    var onScroll = function(){ hd.classList.toggle('stuck', window.scrollY > 10); };
    onScroll();
    window.addEventListener('scroll', onScroll, {passive:true});
  }

  // Reveal
  var reveals = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(es){
      es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
    },{threshold:.12});
    reveals.forEach(function(el){ io.observe(el); });
  }else{
    reveals.forEach(function(el){ el.classList.add('in'); });
  }

  // Parallax suave — hero + fotos dos procedimentos
  var pxEls = [];
  if(!reduce){
    var hero = document.getElementById('heroImg');
    if(hero) pxEls.push({el:hero, k:0.06});
    document.querySelectorAll('.proc-media .frame img').forEach(function(img){ pxEls.push({el:img, k:0.05}); });
    window.addEventListener('scroll', function(){
      var vh = window.innerHeight;
      pxEls.forEach(function(p){
        var r = p.el.getBoundingClientRect();
        if(r.bottom > 0 && r.top < vh){
          var offset = (r.top + r.height/2 - vh/2) * -p.k;
          p.el.style.transform = 'translateY(' + offset.toFixed(1) + 'px)';
        }
      });
    }, {passive:true});
  }

  // Mobile — os cards de Mama e Corpo sobem sobre a foto conforme o scroll
  // (a faixa "A beleza que respeita sua essência" usa o mesmo efeito, ≤900px;
  //  o card de "Onde atendo" sobe sobre o mapa, ≤920px)
  (function(){
    if(reduce) return;
    var mq980 = window.matchMedia('(max-width:980px)');
    var mq900 = window.matchMedia('(max-width:900px)');
    var mq920 = window.matchMedia('(max-width:920px)');
    var pairs = [];
    function gather(){
      pairs = [];
      document.querySelectorAll('.proc .proc-card').forEach(function(card){
        var grid = card.closest('.proc-grid');
        if(grid){ pairs.push({card:card, media:grid.querySelector('.proc-media'), mq:mq980}); }
      });
      var sig = document.querySelector('.signature');
      var hm = document.querySelector('.hero-media');
      if(sig && hm) pairs.push({card:sig, media:hm, mq:mq900});
      var place = document.querySelector('.place-card');
      var pm = document.querySelector('.place-map');
      if(place && pm) pairs.push({card:place, media:pm, mq:mq920});
    }
    gather();
    var ticking = false;
    function lift(){
      ticking = false;
      var vh = window.innerHeight;
      pairs.forEach(function(o){
        var m = o.media, c = o.card;
        if(!m || !o.mq.matches){ if(c.style.translate) c.style.translate=''; return; }
        var r = m.getBoundingClientRect();
        // Sem reset quando a mídia sai da tela: o clamp abaixo congela o translate em −85px
        // (p=1) em vez de zerar, evitando o "salto" do card ao continuar rolando.
        var p = (vh - r.top) / (vh + r.height);       // 0 (foto entrando) → 1 (foto saindo)
        p = p < 0 ? 0 : p > 1 ? 1 : p;
        c.style.translate = '0 ' + ((-30 - p * 55).toFixed(1)) + 'px';  // −30px → −85px
      });
    }
    window.addEventListener('scroll', function(){ if(!ticking){ ticking = true; requestAnimationFrame(lift); } }, {passive:true});
    window.addEventListener('resize', function(){ gather(); lift(); });
    lift();
  })();

// Modais "Saiba mais" — cards Também atendo
  var procData = {
    face:{
      title:'Face',
      icon:'assets/ico_face.webp',
      body:'Harmonização e rejuvenescimento facial com um olhar de naturalidade: cada conduta é planejada para valorizar os seus traços — nunca para descaracterizá-los.',
      list:['Blefaroplastia e lifting facial','Harmonização com preenchedores e toxina botulínica','Enxerto de gordura facial','Rinomodelação'],
      wa:'https://wa.me/5511945855039?text=Tenho%20interesse%20em%20procedimentos%20de%20face'
    },
    estetica:{
      title:'Estética',
      icon:'assets/ico_estetica.webp',
      body:'Tratamentos não cirúrgicos que acompanham e prolongam o resultado da cirurgia, com protocolos personalizados e foco no conforto e no bem-estar.',
      list:['Bioestimuladores de colágeno','Peeling e cuidados com a pele','Protocolos de recuperação pós-operatória','Avaliação estética personalizada'],
      wa:'https://wa.me/5511945855039?text=Tenho%20interesse%20em%20est%C3%A9tica'
    },
    tecnologias:{
      title:'Tecnologias',
      icon:'assets/ico_tecnologias.webp',
      body:'Tecnologia a serviço da segurança e do conforto: recursos e protocolos modernos no planejamento, na execução e na recuperação de cada procedimento.',
      list:['Lipoaspiração assistida por tecnologias de retração de pele: laser, Retraction e Ignite RF','Sistemas de recuperação acelerada','Planejamento com recursos de imagem','Equipamentos de última geração'],
      wa:'https://wa.me/5511945855039?text=Quero%20saber%20sobre%20as%20tecnologias%20utilizadas'
    }
  };
  var procModal = document.getElementById('procModal');
  var procModalTitle = document.getElementById('procModalTitle');
  var procModalIcon = document.getElementById('procModalIcon');
  var procModalBody = document.getElementById('procModalBody');
  var procModalList = document.getElementById('procModalList');
  var procModalCta = document.getElementById('procModalCta');
  var lastFocus = null;
  function openModal(key, trigger){
    var data = procData[key];
    if(!data || !procModal) return;
    procModalTitle.textContent = data.title;
    procModalIcon.setAttribute('src', data.icon);
    procModalBody.textContent = data.body;
    procModalList.innerHTML = '';
    data.list.forEach(function(item){
      var li = document.createElement('li');
      li.textContent = item;
      procModalList.appendChild(li);
    });
    procModalCta.setAttribute('href', data.wa);
    lastFocus = trigger;
    procModal.classList.add('open');
    procModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    var focusClose = function(){
      var closeBtn = procModal.querySelector('.modal-close');
      if(closeBtn && closeBtn.focus) closeBtn.focus();
    };
    if(reduce){ focusClose(); } else { setTimeout(focusClose, 320); }
  }
  function closeModal(){
    if(!procModal) return;
    procModal.classList.remove('open');
    procModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    if(lastFocus && lastFocus.focus) lastFocus.focus();
  }
  document.querySelectorAll('.also-card').forEach(function(card){
    card.addEventListener('click', function(){
      openModal(card.getAttribute('data-proc'), card);
    });
  });
  procModal.querySelectorAll('[data-close]').forEach(function(el){
    el.addEventListener('click', closeModal);
  });
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape' && procModal.classList.contains('open')) closeModal();
  });
