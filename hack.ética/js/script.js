// ======================================================
// PrivAware — script.js
// Sem animações: apenas interações básicas de UI
// ======================================================

// O menu (header + navegação) agora é injetado pelo app.js.
// Este arquivo cuida só do que é específico desta página.

document.addEventListener('DOMContentLoaded', function () {

  // Newsletter do rodapé
  var newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = newsletterForm.querySelector('input[type="email"]');
      var email = input.value.trim();

      if (email === '') {
        return;
      }

      alert('Obrigado por assinar! Em breve novidades no e-mail: ' + email);
      input.value = '';
    });
  }

  // Favoritar tema (ícone de coração nos cards)
  var favButtons = document.querySelectorAll('.fav-btn');
  favButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var icon = btn.querySelector('i');
      var favoritado = icon.classList.contains('fa-solid');

      if (favoritado) {
        icon.classList.remove('fa-solid');
        icon.classList.add('fa-regular');
      } else {
        icon.classList.remove('fa-regular');
        icon.classList.add('fa-solid');
      }
    });
  });

});
