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

  // HTML do menu (mesmo markup usado no index.html)
  var menuHTML =
    '<header class="site-header">' +
      '<div class="header-top container">' +
        '<a href="index.html" class="logo">' +
          '<span class="logo-badge"><i class="fa-solid fa-shield-halved"></i></span>' +
          'PrivAware' +
        '</a>' +

        '<form class="search-form" id="appMenuSearchForm">' +
          '<input type="text" placeholder="Pesquisar" aria-label="Buscar">' +
          '<button type="submit" aria-label="Buscar"><i class="fa-solid fa-magnifying-glass"></i></button>' +
        '</form>' +

        '<div class="header-actions">' +
          '<button class="icon-btn" aria-label="Carrinho"><i class="fa-solid fa-cart-shopping"></i></button>' +
          '<a href="login.html" class="login-link">Cadastrar/Entrar</a>' +
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
    '</header>';

  // Insere o menu: usa <div id="app-menu"></div> se existir na página,
  // ou coloca no topo do <body> automaticamente.
  function mountMenu() {
    var mount = document.getElementById('app-menu');
    if (mount) {
      mount.innerHTML = menuHTML;
    } else {
      document.body.insertAdjacentHTML('afterbegin', menuHTML);
    }
    setActiveLink();
    initToggle();
    initSearch();
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

  // Busca do topo (dentro do menu)
  function initSearch() {
    var form = document.getElementById('appMenuSearchForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = form.querySelector('input');
      var termo = input.value.trim();
      if (termo === '') return;

      alert('Buscando por: "' + termo + '"');
      input.value = '';
    });
  }

  // Se o DOM já carregou (script no fim da página), monta na hora.
  // Senão espera o DOMContentLoaded.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountMenu);
  } else {
    mountMenu();
  }

})();