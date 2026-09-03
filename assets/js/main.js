// SELLER LAB — общий скрипт: мобильное меню + отправка форм заявок

document.addEventListener('DOMContentLoaded', function () {
  var header = document.querySelector('[data-header]');
  var toggle = document.querySelector('[data-nav-toggle]');
  if (toggle && header) {
    toggle.addEventListener('click', function () {
      header.classList.toggle('is-open');
    });
  }

  // Закрывать мобильное меню при клике по ссылке
  document.querySelectorAll('.nav a').forEach(function (link) {
    link.addEventListener('click', function () {
      if (header) header.classList.remove('is-open');
    });
  });

  // Обработка форм заявок.
  // ВАЖНО: бэкенд ещё не подключён (см. бриф — оплата и приём заявок временно ручные).
  // Форма проверяет обязательные поля и показывает подтверждение.
  // Перед запуском в прод нужно подключить приём данных (email-сервис / Telegram-бот / Google Sheets)
  // и заменить блок ниже на реальную отправку (fetch на нужный endpoint).
  document.querySelectorAll('[data-lead-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var status = form.querySelector('[data-form-status]');
      var requiredOk = true;
      form.querySelectorAll('[required]').forEach(function (field) {
        if (!field.value || (field.type === 'checkbox' && !field.checked)) {
          requiredOk = false;
          field.style.borderColor = '#C85A38';
        } else {
          field.style.borderColor = '';
        }
      });

      if (!requiredOk) {
        if (status) {
          status.textContent = 'Заполните обязательные поля и подтвердите согласие на обработку данных.';
          status.classList.add('is-visible');
        }
        return;
      }

      // Временное поведение до подключения бэкенда: собираем данные и открываем
      // черновик письма с заполненной заявкой, чтобы её не потерять.
      var data = new FormData(form);
      var lines = [];
      data.forEach(function (value, key) {
        if (value) lines.push(key + ': ' + value);
      });

      var subject = encodeURIComponent(form.getAttribute('data-lead-form') || 'Заявка с сайта SELLER LAB');
      var body = encodeURIComponent(lines.join('\n'));
      var mailTo = form.getAttribute('data-lead-email') || 'hello@sellerlab.io';

      if (status) {
        status.textContent = 'Заявка сформирована. Сейчас откроется черновик письма — отправьте его, и мы свяжемся с вами в течение рабочего дня.';
        status.classList.add('is-visible');
      }

      form.reset();
      window.location.href = 'mailto:' + mailTo + '?subject=' + subject + '&body=' + body;
    });
  });
});
