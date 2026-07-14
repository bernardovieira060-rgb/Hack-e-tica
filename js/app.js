// ======================================================
// PrivAware — app.js
// Componente de Menu reutilizável.
// Basta colocar <script src="../js/app.js"></script> em
// qualquer página que o menu (header + navegação) aparece
// pronto, já puxando o style.css e as fontes/ícones
// necessários — e já refletindo se o usuário está logado.
// ======================================================

(function () {

  // Estrutura de pastas do projeto: /html/*.html, /css/style.css, /js/app.js
  // Como as páginas ficam em /html, o CSS é referenciado subindo uma pasta.
  var CSS_PATH = '../css/style.css';

  // Chave usada no localStorage para guardar a sessão (mesma usada em login.js)
  var SESSION_KEY = 'privaware_session';

  // Evita duplicar um <link>/<script> que já exista na página
  function ensureAsset(tag, attrs) {
    var key = attrs.href || attrs.src;
    var already = document.head.querySelector('[href="' + key + '"], [src="' + key + '"]');
    if (already) return;

    var el = document.createElement(tag);
    Object.keys(attrs).forEach(function (attr) {
      el.setAttribute(attr, attrs[attr]);
    });

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

  // Lê a sessão salva pelo login.js (retorna null se não houver ninguém logado)
  function getSession() {
    try {
      var raw = localStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function clearSession() {
    localStorage.removeItem(SESSION_KEY);
  }

  // HTML do menu (mesmo markup usado no index.html), montado dinamicamente
  // de acordo com o estado de login
  function buildMenuHTML() {
    var session = getSession();

    var authArea;
    if (session) {
      authArea =
        '<div class="user-menu" id="appUserMenu">' +
          '<button type="button" class="user-menu-toggle" id="appUserMenuToggle">' +
            '<span class="user-avatar"><i class="fa-solid fa-user"></i></span>' +
            '<span class="user-name">' + escapeHTML(session.name.split(' ')[0]) + '</span>' +
            '<i class="fa-solid fa-chevron-down user-caret"></i>' +
          '</button>' +
          '<div class="user-menu-dropdown" id="appUserMenuDropdown" hidden>' +
            '<button type="button" id="appLogoutBtn"><i class="fa-solid fa-arrow-right-from-bracket"></i> Sair</button>' +
          '</div>' +
        '</div>';
    } else {
      authArea = '<a href="login.html" class="login-link">Cadastrar/Entrar</a>';
    }

    return (
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
          authArea +
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

  function escapeHTML(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // Insere o menu: usa <div id="app-menu"></div> se existir na página,
  // ou coloca no topo do <body> automaticamente.
  function mountMenu() {
    var mount = document.getElementById('app-menu');
    if (mount) {
      mount.innerHTML = buildMenuHTML();
    } else {
      document.body.insertAdjacentHTML('afterbegin', buildMenuHTML());
    }
    setActiveLink();
    initToggle();
    initSearch();
    initUserMenu();
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

  // Dropdown do usuário logado (nome + botão "Sair")
  function initUserMenu() {
    var toggle = document.getElementById('appUserMenuToggle');
    var dropdown = document.getElementById('appUserMenuDropdown');
    var logoutBtn = document.getElementById('appLogoutBtn');
    if (!toggle || !dropdown) return;

    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      dropdown.hidden = !dropdown.hidden;
    });

    document.addEventListener('click', function () {
      dropdown.hidden = true;
    });

    if (logoutBtn) {
      logoutBtn.addEventListener('click', function () {
        clearSession();
        // Recarrega a página atual para refletir o logout em toda a UI
        window.location.reload();
      });
    }
  }

  // Se outra aba fizer login/logout, mantém este menu sincronizado
  window.addEventListener('storage', function (e) {
    if (e.key === SESSION_KEY) {
      mountMenu();
    }
  });

  // Se o DOM já carregou (script no fim da página), monta na hora.
  // Senão espera o DOMContentLoaded.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountMenu);
  } else {
    mountMenu();
  }

})();