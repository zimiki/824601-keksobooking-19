'use strict';
var OFFER_TYPE = ['palace', 'flat', 'house', 'bungalo'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var TIME = ['12:00', '13:00', '14:00'];


// Функция генерирующая случайное число в диапазоне
var getRandom = function (min, max) {
  var rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
};

// Функция выбирающая случайный элемент массива
var getRandomElementArr = function (arr) {
  var rand = Math.floor(Math.random() * arr.length);
  return arr[rand];
};

// Функция для перемешивания массива
var getRandomMixArr = function (arr) {
  for (var i = arr.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var swap = arr[i];
    arr[i] = arr[j];
    arr[j] = swap;
  }
  return arr;
};


// a) Массив для свойства location.x  - cлучайное число. Значение ограничено размерами блока, в котором перетаскивается метка
var randomLocation = [
  {
    x: '50',
    y: '150'
  },
  {
    x: '100',
    y: '180'
  },
  {
    x: '150',
    y: '200'
  },
  {
    x: '200',
    y: '230'
  },
  {
    x: '250',
    y: '500'
  },
  {
    x: '300',
    y: '100'
  },
  {
    x: '350',
    y: '150'
  },
  {
    x: '400',
    y: '180'
  }
];

var renderMockData = function () {
  var SIMILAR_ELEMENT = 8;
  // Создание массива для avatar со случайным порядком неповторяющихся значений от 01-08
  var avatarNumber = ['01', '02', '03', '04', '05', '06', '07', '08'];
  var avatarRandNumber = getRandomMixArr(avatarNumber);

  var arr = [];
  for (var i = 0; i < SIMILAR_ELEMENT; i++) {
    var element = {
      author: {
        avatar: 'img/avatars/user' + avatarRandNumber[i] + '.png' // строка, адрес изображения вида img/avatars/user{{xx}}.png, где {{xx}} - число от 01 до 08 не повторяются
      },
      offer: {
        title: 'Заголовок преложения # ' + 1, // строка, заголовок предложения
        address: randomLocation[i].x + ', ' + randomLocation[i].y, // строка представляет собой запись вида "{{location.x}}, {{location.y}}
        price: '5500', // число, стоимость
        type: getRandomElementArr(OFFER_TYPE), // строка с одним из фиксированных значений
        rooms: getRandom(1, 3), // число, количество комнат
        guests: getRandom(1, 10), // число, количество гостей
        checkin: getRandomElementArr(TIME), // строка с одним из фиксированных значений
        checkout: getRandomElementArr(TIME), // строка с одним из фиксированных значений
        features: getRandomElementArr(FEATURES), // !***массив строк случайной длины из FEATURES
        description: 'какое-то описание', // строка с описанием,
        photos: ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'],
      }, // !***массив строк случайной длины, содержащий адреса фотографий
      location: {
        x: randomLocation[i].x,
        y: randomLocation[i].y
      }
    };
    arr.push(element);
  }
  console.log(arr);
  return arr;
};


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
var offers = renderMockData();

// 4. Вызов функции создания фрагмента и добавление фрагмента в DOM
var offerList = renderFragment(offers);
document.querySelector('.map__pins').appendChild(offerList);

// 5. Отображение карты на странице
document.querySelector('.map').classList.remove('map--faded');
