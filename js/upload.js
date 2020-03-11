'use strict';

// Модуль, который отвечает за отправку формы
(function () {
  var TIMEOUT_IN_MS = 10000;
  var URL = 'https://js.dump.academy/keksobooking';
  var StatusCode = {
    OK: 200
  };


  window.upload = function (data, onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === StatusCode.OK) {
        onSuccess(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = TIMEOUT_IN_MS;
    xhr.open('POST', URL);
    xhr.send(data);
  };
})();
