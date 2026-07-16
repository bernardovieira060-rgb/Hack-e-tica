// ======================================================
// PrivAware — app.js
// Componente de Menu reutilizável.
// Basta colocar <script src="app.js"></script> em qualquer
// página que o menu (header + navegação) aparece pronto,
// já puxando o style.css e as fontes/ícones necessários.
// ======================================================

(function () {

  // Estrutura de pastas do projeto: /html/*.html, /css/style.css, /js/app.js
  // Como as páginas ficam em /html, o CSS é referenciado subindo uma pasta.
  var CSS_PATH = '../css/style.css';

  // ---------- Sessão (mesma chave usada no login.js) ----------
  var SESSION_KEY = 'privaware_session';

  function getSession() {
    try {
      return JSON.parse(localStorage.getItem(SESSION_KEY));
    } catch (e) {
      return null;
    }
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY);
    window.location.href = 'index.html';
  }

  // Pega as iniciais do nome pra mostrar no "avatar" (ex: "Ana Souza" -> "AS")
  function getInitials(name) {
    if (!name) return '?';
    var parts = name.trim().split(/\s+/);
    var initials = parts[0].charAt(0);
    if (parts.length > 1) initials += parts[parts.length - 1].charAt(0);
    return initials.toUpperCase();
  }

  // Descobre a pasta onde o app.js está (só é usado como referência/debug,
  // não é mais usado pra montar o caminho do CSS)
  var currentScript = document.currentScript;

  // Evita duplicar um <link>/<script> que já exista na página
  function ensureAsset(tag, attrs) {
    var key = attrs.href || attrs.src;
    var already = document.head.querySelector('[href="' + key + '"], [src="' + key + '"]');
    if (already) return;

    var el = document.createElement(tag);
    Object.keys(attrs).forEach(function (attr) {
      el.setAttribute(attr, attrs[attr]);
    });

    // Avisa no console se o arquivo não carregar (ex: caminho errado)
    if (tag === 'link') {
      el.addEventListener('error', function () {
        console.error('[app.js] Não consegui carregar: ' + key + ' — confira se o caminho está certo.');
      });
    }

    document.head.appendChild(el);
  }

  // Garante fontes, ícones e o CSS do site
  ensureAsset('link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' });
  ensureAsset('link', {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700;800&family=Inter:wght@400;500;600&display=swap'
  });
  ensureAsset('link', {
    rel: 'stylesheet',
    href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css'
  });
  ensureAsset('link', { rel: 'stylesheet', href: CSS_PATH });

  // Bloco de "Cadastrar/Entrar" (visitante) ou nome do usuário (logado)
  function buildAccountBlock() {
    var session = getSession();

    if (!session) {
      return '<a href="login.html" class="login-link">Cadastrar/Entrar</a>';
    }

    return (
      '<div class="user-menu" id="appUserMenu">' +
        '<button class="user-menu-toggle" id="appUserMenuToggle" aria-haspopup="true" aria-expanded="false">' +
          '<span class="user-avatar">' + getInitials(session.name) + '</span>' +
          '<span class="user-name">' + (session.name || session.email) + '</span>' +
          '<i class="fa-solid fa-chevron-down user-caret"></i>' +
        '</button>' +
        '<div class="user-menu-dropdown" id="appUserMenuDropdown" hidden>' +
          '<button type="button" id="appLogoutBtn"><i class="fa-solid fa-arrow-right-from-bracket"></i> Sair</button>' +
        '</div>' +
      '</div>'
    );
  }

  // ---------- Busca do site (autocomplete do header) ----------

  // Nome bonito da página pra mostrar como "categoria" no resultado
  var PAGE_LABELS = {
    'index.html': 'Home',
    'privacidade.html': 'Privacidade',
    'bem-estar.html': 'Bem-estar',
    'suporte.html': 'Suporte',
    'treinamentos.html': 'Treinamentos',
    'politicas.html': 'Políticas',
    'frequentes.html': 'Dúvidas Frequentes',
    'duvidas.html': 'Fale Conosco',
    'login.html': 'Cadastrar/Entrar'
  };

  // Tira acentos e deixa minúsculo, pra busca não falhar por causa de "ã", "ç" etc.
  function normalize(str) {
    return (str || '')
      .toString()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  // Índice com as principais páginas/seções do site + as perguntas do FAQ.
  // "hash" leva direto pra uma âncora da página; "query" leva pra
  // frequentes.html já filtrando pela pergunta certa.
  var SEARCH_INDEX = [
    { title: 'Home', page: 'index.html', keywords: 'inicio pagina principal' },
    { title: 'Temas Mais Acessados', page: 'index.html', keywords: 'temas populares acessados' },
    { title: 'Jornada do Bem-estar', page: 'index.html', keywords: 'jornada bem estar programa' },

    { title: 'Privacidade Digital', page: 'privacidade.html', keywords: 'privacidade digital monitoramento dados' },
    { title: 'O que a empresa pode monitorar', page: 'privacidade.html', keywords: 'monitoramento vpn email sistemas corporativos' },
    { title: 'O que não deve ser monitorado', page: 'privacidade.html', keywords: 'vida pessoal redes sociais webcam microfone' },
    { title: 'Seus direitos sobre seus dados', page: 'privacidade.html', keywords: 'direitos lgpd transparencia acesso dados' },
    { title: 'Como proteger seus dados', page: 'privacidade.html', keywords: 'senha autenticacao dois fatores backup' },
    { title: 'Privacidade no Home Office', page: 'privacidade.html', keywords: 'home office trabalho remoto vpn camera' },
    { title: 'Riscos Digitais', page: 'privacidade.html', keywords: 'phishing malware ransomware roubo de identidade' },
    { title: 'Sinais de um possível golpe', page: 'privacidade.html', keywords: 'golpe email suspeito senha urgente' },
    { title: 'LGPD e Trabalho Remoto', page: 'privacidade.html', keywords: 'lgpd trabalho remoto lei geral protecao de dados' },
    { title: 'Boas Práticas de Segurança', page: 'privacidade.html', keywords: 'boas praticas seguranca' },

    { title: 'Bem-estar no Trabalho', page: 'bem-estar.html', keywords: 'bem estar trabalho vigilancia confianca' },
    { title: 'Gestão por Confiança x Vigilância', page: 'bem-estar.html', keywords: 'gestao confianca vigilancia' },
    { title: 'Relação com a NR-1', page: 'bem-estar.html', keywords: 'nr-1 nr1 risco psicossocial' },
    { title: 'Privacy Check — Autoavaliação', page: 'bem-estar.html', hash: 'privacycheck', keywords: 'privacy check autoavaliacao teste equilibrio home office' },
    { title: 'Casos Práticos', page: 'bem-estar.html', keywords: 'casos praticos exemplos' },

    { title: 'Suporte / Fale com o RH', page: 'suporte.html', keywords: 'suporte ajuda rh chat contato canais' },

    { title: 'Treinamentos', page: 'treinamentos.html', keywords: 'treinamentos cursos certificado' },
    { title: 'Cursos Rápidos', page: 'treinamentos.html', keywords: 'cursos rapidos privacidade lgpd monitoramento etico seguranca gestao por confianca nr-1' },
    { title: 'Workshops Corporativos', page: 'treinamentos.html', keywords: 'workshop corporativo empresa' },
    { title: 'Como funciona o certificado', page: 'treinamentos.html', keywords: 'certificado curso conclusao' },

    { title: 'Política de Privacidade — Objetivo', page: 'politicas.html', hash: 'objetivo', keywords: 'objetivo politica de privacidade' },
    { title: 'Política de Privacidade — LGPD e base legal', page: 'politicas.html', hash: 'lgpd', keywords: 'lgpd base legal' },
    { title: 'Política de Privacidade — O que é monitorado', page: 'politicas.html', hash: 'monitoramento', keywords: 'monitoramento politica' },
    { title: 'Política de Privacidade — Seus direitos', page: 'politicas.html', hash: 'direitos', keywords: 'direitos politica' },
    { title: 'Política de Privacidade — Relação com a NR-1', page: 'politicas.html', hash: 'nr1', keywords: 'nr-1 nr1 politica' },
    { title: 'Política de Privacidade — Segurança e retenção', page: 'politicas.html', hash: 'seguranca', keywords: 'seguranca retencao de dados' },
    { title: 'Política de Privacidade — Alterações da política', page: 'politicas.html', hash: 'alteracoes', keywords: 'alteracoes da politica' },
    { title: 'Política de Privacidade — Contato', page: 'politicas.html', hash: 'contato', keywords: 'contato politica' },

    { title: 'Dúvidas Frequentes', page: 'frequentes.html', keywords: 'faq duvidas frequentes perguntas' },
    { title: 'Envie sua Dúvida', page: 'duvidas.html', keywords: 'enviar duvida pergunta contato' },
    { title: 'Cadastrar / Entrar', page: 'login.html', keywords: 'login cadastro entrar conta' },

    // Perguntas do FAQ — ao clicar, abre frequentes.html já filtrado nessa pergunta
    { title: 'O que a empresa pode monitorar no home office?', page: 'frequentes.html', query: 'o que a empresa pode monitorar no home office' },
    { title: 'O que a empresa NÃO pode monitorar?', page: 'frequentes.html', query: 'o que a empresa nao pode monitorar' },
    { title: 'Como sei se estou sendo vigiado(a) de forma excessiva?', page: 'frequentes.html', query: 'sendo vigiado de forma excessiva' },
    { title: 'O que é a LGPD?', page: 'frequentes.html', query: 'o que e a lgpd' },
    { title: 'Quais direitos eu tenho sobre meus dados?', page: 'frequentes.html', query: 'quais direitos eu tenho sobre meus dados' },
    { title: 'Como proteger meus dados no dia a dia?', page: 'frequentes.html', query: 'como proteger meus dados no dia a dia' },
    { title: 'O que é a NR-1 e por que ela importa aqui?', page: 'frequentes.html', query: 'o que e a nr-1' },
    { title: 'O que é o Privacy Check?', page: 'frequentes.html', query: 'o que e o privacy check' },
    { title: 'Qual a diferença entre gestão por confiança e por vigilância?', page: 'frequentes.html', query: 'gestao por confianca e por vigilancia' },
    { title: 'Os cursos são pagos?', page: 'frequentes.html', query: 'os cursos sao pagos' },
    { title: 'Como recebo meu certificado?', page: 'frequentes.html', query: 'como recebo meu certificado' }
  ];

  // Filtra o índice pelo termo digitado (ignorando página atual, se fizer sentido manter)
  function searchIndex(termo) {
    var n = normalize(termo);
    if (n === '') return [];

    return SEARCH_INDEX.filter(function (item) {
      var haystack = normalize(item.title) + ' ' + normalize(item.keywords || '') + ' ' + normalize(item.query || '');
      return haystack.indexOf(n) !== -1;
    }).slice(0, 8);
  }

  // Monta a URL final de um item do índice (com âncora ou ?q= quando aplicável)
  function buildResultUrl(item) {
    if (item.hash) return item.page + '#' + item.hash;
    if (item.query) return item.page + '?q=' + encodeURIComponent(item.query);
    return item.page;
  }

  // HTML do menu (mesmo markup usado no index.html)
  function buildMenuHTML() {
    return (
    '<header class="site-header">' +
      '<div class="header-top container">' +
        '<a href="index.html" class="logo">' +
          '<span class="logo-badge"><i class="fa-solid fa-shield-halved"></i></span>' +
          'Safe Space' +
        '</a>' +

        '<form class="search-form" id="appMenuSearchForm" autocomplete="off">' +
          '<input type="text" id="appMenuSearchInput" placeholder="Pesquisar" aria-label="Buscar" role="combobox" aria-expanded="false" aria-owns="appMenuSearchResults" aria-autocomplete="list">' +
          '<button type="submit" aria-label="Buscar"><i class="fa-solid fa-magnifying-glass"></i></button>' +
          '<div class="search-results" id="appMenuSearchResults" role="listbox"></div>' +
        '</form>' +

        '<div class="header-actions">' +
          '<button class="icon-btn" aria-label="Carrinho"><i class="fa-solid fa-cart-shopping"></i></button>' +
          buildAccountBlock() +
        '</div>' +

        '<button class="menu-toggle" id="appMenuToggle" aria-label="Abrir menu">' +
          '<i class="fa-solid fa-bars"></i>' +
        '</button>' +
      '</div>' +

      '<nav class="main-nav" id="appMainNav">' +
        '<ul>' +
          '<li><a href="index.html" data-page="index.html">Home</a></li>' +
          '<li><a href="privacidade.html" data-page="privacidade.html">Privacidade</a></li>' +
          '<li><a href="bem-estar.html" data-page="bem-estar.html">Bem-estar</a></li>' +
          '<li><a href="suporte.html" data-page="suporte.html">Suporte</a></li>' +
          '<li><a href="treinamentos.html" data-page="treinamentos.html">Treinamentos</a></li>' +
          '<li><a href="politicas.html" data-page="politicas.html">Políticas</a></li>' +
          '<li><a href="frequentes.html" data-page="frequentes.html">Dúvidas Frequentes</a></li>' +
        '</ul>' +
        '<button class="btn btn-help" onclick="window.location.href=\'suporte.html\'">PRECISO DE AJUDA</button>' +
      '</nav>' +
    '</header>'
    );
  }

  // Insere o menu: usa <div id="app-menu"></div> se existir na página,
  // ou coloca no topo do <body> automaticamente.
  function mountMenu() {
    var mount = document.getElementById('app-menu') || document.querySelector('.site-header');
    if (mount) {
      mount.outerHTML = buildMenuHTML();
    } else {
      document.body.insertAdjacentHTML('afterbegin', buildMenuHTML());
    }
    setActiveLink();
    initToggle();
    initSearch();
    initUserMenu();
  }

  // Dropdown do usuário logado (abrir/fechar + sair)
  function initUserMenu() {
    var wrap = document.getElementById('appUserMenu');
    if (!wrap) return;

    var toggle = document.getElementById('appUserMenuToggle');
    var dropdown = document.getElementById('appUserMenuDropdown');
    var logoutBtn = document.getElementById('appLogoutBtn');

    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = !dropdown.hidden;
      dropdown.hidden = isOpen;
      toggle.setAttribute('aria-expanded', String(!isOpen));
    });

    document.addEventListener('click', function () {
      dropdown.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
    });

    logoutBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      logout();
    });
  }

  // Marca o link da página atual como ativo, pelo nome do arquivo
  function setActiveLink() {
    var current = window.location.pathname.split('/').pop() || 'index.html';
    var links = document.querySelectorAll('#appMainNav a[data-page]');
    links.forEach(function (link) {
      if (link.getAttribute('data-page') === current) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // Botão hambúrguer (mobile)
  function initToggle() {
    var toggle = document.getElementById('appMenuToggle');
    var nav = document.getElementById('appMainNav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
      });
    });
  }

  // Busca do topo (dentro do menu): mostra sugestões enquanto digita
  // e leva pra página/seção certa (ou pro FAQ já filtrado, como último recurso).
  function initSearch() {
    var form = document.getElementById('appMenuSearchForm');
    if (!form) return;

    var input = document.getElementById('appMenuSearchInput');
    var resultsBox = document.getElementById('appMenuSearchResults');
    var activeIndex = -1;
    var currentResults = [];

    function renderResults(list) {
      currentResults = list;
      activeIndex = -1;

      if (list.length === 0) {
        resultsBox.innerHTML = '<div class="sr-empty">Nenhum resultado. Aperte Enter pra buscar nas Dúvidas Frequentes.</div>';
      } else {
        resultsBox.innerHTML = list.map(function (item, i) {
          var label = PAGE_LABELS[item.page] || item.page;
          return (
            '<a href="' + buildResultUrl(item) + '" data-index="' + i + '" role="option">' +
              '<span class="sr-title">' + item.title + '</span>' +
              '<span class="sr-page">' + label + '</span>' +
            '</a>'
          );
        }).join('');
      }

      resultsBox.classList.add('show');
      input.setAttribute('aria-expanded', 'true');
    }

    function closeResults() {
      resultsBox.classList.remove('show');
      resultsBox.innerHTML = '';
      input.setAttribute('aria-expanded', 'false');
      activeIndex = -1;
      currentResults = [];
    }

    function highlight(index) {
      var links = resultsBox.querySelectorAll('a');
      links.forEach(function (a) { a.classList.remove('active'); });
      if (index >= 0 && links[index]) {
        links[index].classList.add('active');
        links[index].scrollIntoView({ block: 'nearest' });
      }
      activeIndex = index;
    }

    input.addEventListener('input', function () {
      var termo = input.value.trim();
      if (termo === '') {
        closeResults();
        return;
      }
      renderResults(searchIndex(termo));
    });

    input.addEventListener('focus', function () {
      if (input.value.trim() !== '') renderResults(searchIndex(input.value));
    });

    input.addEventListener('keydown', function (e) {
      if (!resultsBox.classList.contains('show')) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        highlight(Math.min(activeIndex + 1, currentResults.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        highlight(Math.max(activeIndex - 1, 0));
      } else if (e.key === 'Escape') {
        closeResults();
      } else if (e.key === 'Enter' && activeIndex >= 0 && currentResults[activeIndex]) {
        e.preventDefault();
        window.location.href = buildResultUrl(currentResults[activeIndex]);
      }
    });

    resultsBox.addEventListener('mousedown', function (e) {
      // mousedown (não click) pra disparar antes do blur do input
      var link = e.target.closest('a[data-index]');
      if (!link) return;
      e.preventDefault();
      window.location.href = link.getAttribute('href');
    });

    document.addEventListener('click', function (e) {
      if (!form.contains(e.target)) closeResults();
    });

    // Enter direto na caixa (sem escolher sugestão): vai pro primeiro
    // resultado encontrado ou, se nada bater, cai nas Dúvidas Frequentes.
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var termo = input.value.trim();
      if (termo === '') return;

      if (activeIndex >= 0 && currentResults[activeIndex]) {
        window.location.href = buildResultUrl(currentResults[activeIndex]);
        return;
      }

      var matches = searchIndex(termo);
      if (matches.length > 0) {
        window.location.href = buildResultUrl(matches[0]);
      } else {
        window.location.href = 'frequentes.html?q=' + encodeURIComponent(termo);
      }
    });
  }

  // ---------- Header "inteligente" ao rolar a página ----------
  // Descendo: encolhe e mostra só a barra de navegação (mais compacto).
  // Subindo: volta a mostrar o header inteiro (logo, busca, etc.).
  function initScrollBehavior() {
    var header = document.querySelector('.site-header');
    if (!header) return;

    var lastScrollY = window.scrollY;
    var ticking = false;
    var THRESHOLD = 10; // ignora tremidas pequenas (trackpad/inércia)

    function onScroll() {
      var currentScrollY = window.scrollY;
      var delta = currentScrollY - lastScrollY;

      if (currentScrollY <= 40) {
        // No topo da página, sempre mostra o header completo.
        header.classList.remove('header-compact');
        lastScrollY = currentScrollY;
      } else if (delta > THRESHOLD) {
        // Rolando pra baixo de verdade -> compacta.
        header.classList.add('header-compact');
        lastScrollY = currentScrollY;
      } else if (delta < -THRESHOLD) {
        // Rolando pra cima de verdade -> mostra tudo de novo.
        header.classList.remove('header-compact');
        lastScrollY = currentScrollY;
      }
      // Variações menores que o THRESHOLD são ignoradas (evita "piscar").

      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(onScroll);
        ticking = true;
      }
    });
  }

  // Se o DOM já carregou (script no fim da página), monta na hora.
  // Senão espera o DOMContentLoaded.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      mountMenu();
      initScrollBehavior();
    });
  } else {
    mountMenu();
    initScrollBehavior();
  }

})();
