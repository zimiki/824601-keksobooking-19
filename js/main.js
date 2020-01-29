'use strict';
var OFFER_TYPE = ['palace', 'flat', 'house', 'bungalo'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var TIME = ['12:00', '13:00', '14:00'];
var map = document.querySelector('.map');


// Функция генерирующая случайное число в диапазоне
var getRandom = function (min, max) {
  var rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
};

// Создание массивов на 8 свойств со случайными значениями
// a) Массив для свойства avatar вида 'img/avatars/user{{xx}}.png', где {{xx}} это число от 01 до 08. Адреса изображений не повторяются
var userNumber = ['01', '02', '03', '04', '05', '06', '07', '08'];
// a) Массив для свойства location.x  - cлучайное число. Значение ограничено размерами блока, в котором перетаскивается метка
var locationX = ['50', '100', '150', '200', '220', '360', '480', '550'];
// a) Массив для свойства location.x  - cлучайное число от 130 до 630.
var locationY = ['130', '100', '150', '200', '220', '360', '480', '630'];


var offers = [
  // Первый объект
  {
    author: {
      avatar: 'img/avatars/user' + userNumber[1] + '.png'
    },
    offer: {
      title: 'Заголовок преложения # ' + 1,
      address: locationX[1] + ', ' + locationY[1],
      price: '5500',
      type: OFFER_TYPE[0],
      rooms: getRandom(1, 3), // число, количество комнат
      guests: getRandom(1, 10), // число, количество гостей
      checkin: TIME[getRandom(0, TIME.length)],
      checkout: TIME[getRandom(0, TIME.length)],
      features: FEATURES[getRandom(0, FEATURES.length)],
      description: 'какое-то описание',
      photos: ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'],
    },
    location: {
      x: locationX[0],
      y: locationY[0]
    },
  },

  // Второй объект
  {
    author: {
      avatar: 'img/avatars/user01.png'
    },
    offer: {
      title: 'Заголовок преложения #2',
      address: '600, 350',
      price: '5500',
      type: OFFER_TYPE[0],
      rooms: 2,
      guests: 5,
      checkin: TIME[2],
      checkout: TIME[0],
      features: FEATURES[0],
      description: 'какое-то описание',
      photos: ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'],
    },
    location: {
      x: 150,
      y: 600
    },
  },
  // 3 объект
  {
    author: {
      avatar: 'img/avatars/user01.png'
    },
    offer: {
      title: 'Заголовок преложения #2',
      address: '600, 350',
      price: '5500',
      type: OFFER_TYPE[0],
      rooms: 2,
      guests: 5,
      checkin: TIME[2],
      checkout: TIME[0],
      features: FEATURES[0],
      description: 'какое-то описание',
      photos: ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'],
    },
    location: {
      x: 150,
      y: 130
    },
  }
];
console.log(offers[0]);


// Функция создания одного DOM-элемента на основе данных
var renderElement = function (offer) {
  var similarOfferTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var PIN_WIDTH = 50; // Ширина иконки
  var PIN_HEIGHT = 70; // Высота иконки
  var iconX = offer.location.x - (PIN_WIDTH / 2); // Поправки для положения иконки - сдвинуть влево на 1/2 ширины
  var iconY = offer.location.y - PIN_HEIGHT; // Поправки для положения иконки -  сдвинуть вверх на полную высоту
  var offerElement = similarOfferTemplate.cloneNode(true);
  offerElement.style = 'left: ' + iconX + 'px; top: ' + iconY + 'px;';
  return offerElement;
};

// Функция создания фрагмента
var renderFragment = function (arr) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < arr.length; i++) {
    fragment.appendChild(renderElement(arr[i]));
  }
  return fragment;
};

// 1. Генерация случайных данных

// 4. Вызов функции создания фрагмента и добавление фрагмента в DOM
var offerList = renderFragment(offers);
map.querySelector('.map__pins').appendChild(offerList);

// 5. Отображение карты на странице
map.classList.remove('map--faded');
