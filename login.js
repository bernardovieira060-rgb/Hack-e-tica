// ======================================================
// PrivAware — login.js
// Lógica da página de login/cadastro.
//
// IMPORTANTE: este é um site 100% estático (sem servidor),
// então o "banco de usuários" e a sessão ficam salvos no
// localStorage do próprio navegador. É ótimo para portfólio
// e protótipo, mas não deve ser usado com senhas reais em
// produção — para isso, o ideal é um backend de verdade
// (Node, Firebase Auth, Supabase etc.) fazendo o hash e a
// validação das senhas do lado do servidor.
// ======================================================

(function () {

    var USERS_KEY = 'privaware_users';     // "banco" de usuários cadastrados
    var SESSION_KEY = 'privaware_session'; // usuário logado atualmente
  
    // ---------- Helpers de storage ----------
  
    function getUsers() {
      try {
        return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
      } catch (e) {
        return [];
      }
    }
  
    function saveUsers(users) {
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
  
    function setSession(user) {
      localStorage.setItem(SESSION_KEY, JSON.stringify({
        name: user.name,
        email: user.email
      }));
    }
  
    function getSession() {
      try {
        return JSON.parse(localStorage.getItem(SESSION_KEY));
      } catch (e) {
        return null;
      }
    }
  
    // Ofuscação simples só para não deixar a senha 100% em texto puro
    // no localStorage. Isso NÃO é criptografia segura — em um projeto
    // real, o hash de senha deve acontecer no servidor (ex: bcrypt).
    function encode(str) {
      return btoa(unescape(encodeURIComponent(str)));
    }
  
    function normalizeEmail(email) {
      return email.trim().toLowerCase();
    }
  
    // ---------- Se já está logado, não faz sentido ficar na tela de login ----------
  
    if (getSession()) {
      window.location.href = 'index.html';
      return;
    }
  
    // ---------- Abas (Entrar / Criar conta) ----------
  
    var tabs = document.querySelectorAll('.login-tab');
    var loginForm = document.getElementById('loginForm');
    var cadastroForm = document.getElementById('cadastroForm');
  
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
  
        var isCadastro = tab.getAttribute('data-tab') === 'cadastro';
        cadastroForm.hidden = !isCadastro;
        loginForm.hidden = isCadastro;
  
        clearError(loginError);
        clearError(cadastroError);
      });
    });
  
    // ---------- Mensagens de erro ----------
  
    var loginError = document.getElementById('loginError');
    var cadastroError = document.getElementById('cadastroError');
  
    function showError(el, msg) {
      if (!el) return;
      el.textContent = msg;
    }
  
    function clearError(el) {
      if (!el) return;
      el.textContent = '';
    }
  
    // ---------- Login ----------
  
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      clearError(loginError);
  
      var email = normalizeEmail(loginForm.email.value);
      var password = loginForm.password.value;
  
      if (!email || !password) {
        showError(loginError, 'Preencha e-mail e senha.');
        return;
      }
  
      var users = getUsers();
      var user = users.find(function (u) { return u.email === email; });
  
      if (!user || user.password !== encode(password)) {
        showError(loginError, 'E-mail ou senha incorretos.');
        return;
      }
  
      var submitBtn = loginForm.querySelector('.login-submit');
      submitBtn.disabled = true;
      submitBtn.textContent = 'ENTRANDO...';
  
      setSession(user);
      window.location.href = 'index.html';
    });
  
    // ---------- Cadastro ----------
  
    cadastroForm.addEventListener('submit', function (e) {
      e.preventDefault();
      clearError(cadastroError);
  
      var name = cadastroForm.name.value.trim();
      var email = normalizeEmail(cadastroForm.email.value);
      var password = cadastroForm.password.value;
  
      if (!name || !email || !password) {
        showError(cadastroError, 'Preencha todos os campos.');
        return;
      }
  
      if (password.length < 6) {
        showError(cadastroError, 'A senha precisa ter pelo menos 6 caracteres.');
        return;
      }
  
      var users = getUsers();
      var alreadyExists = users.some(function (u) { return u.email === email; });
  
      if (alreadyExists) {
        showError(cadastroError, 'Já existe uma conta com este e-mail. Tente entrar.');
        return;
      }
  
      var newUser = { name: name, email: email, password: encode(password) };
      users.push(newUser);
      saveUsers(users);
  
      var submitBtn = cadastroForm.querySelector('.login-submit');
      submitBtn.disabled = true;
      submitBtn.textContent = 'CRIANDO CONTA...';
  
      // Loga automaticamente o usuário recém-cadastrado
      setSession(newUser);
      window.location.href = 'index.html';
    });
  
  })();