'use strict';

var OFFER_TYPES = ['palace', 'flat', 'house', 'bungalo'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var TIMES = ['12:00', '13:00', '14:00'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var map = document.querySelector('.map');
var similarOfferTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var PIN_WIDTH = 50; // Ширина иконки
var PIN_HEIGHT = 70; // Высота иконки


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
var getMixArr = function (arr) {
  for (var i = arr.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var swap = arr[i];
    arr[i] = arr[j];
    arr[j] = swap;
  }
  return arr;
};

// Функция для получения из исходного массива, нового массива случаной длины и неповторяющегося содержания
var getRandomArr = function (arr) {
  var newArr = [];
  while (newArr.length < getRandom(1, arr.length)) {
    var element = arr[getRandom(0, (arr.length - 1))];
    if (newArr.indexOf(element) === -1) {
      newArr.push(element);
    }
  }
  return newArr;
};

// Функция генерирующая случайные координаты с учетом пределов отображения метки. У вернехнего левого угла метки пределы x (0, (mapLimits.width-pin.width)) y(130,  630)
// Значит пределы в которых должна генерироваться координата для острого конца метки: x = + правее на (pin.width/2);  y = + ниже на (pin.height)
var getRandomLocations = function (n) {
  var mapLimits = map.querySelector('.map__overlay').getBoundingClientRect();
  var locations = [];
  for (var i = 0; i < n; i++) {
    var location = {
      x: getRandom((PIN_WIDTH / 2), mapLimits.width - (PIN_WIDTH / 2)),
      y: getRandom(130 + PIN_HEIGHT, 630 + PIN_HEIGHT)
    };
    locations.push(location);
  }
  return locations;
};

// Функция для создания случанйых данных
var getMockData = function () {
  var SIMILAR_OFFER = 8;
  var avatarNumber = ['01', '02', '03', '04', '05', '06', '07', '08'];
  var avatarRandNumber = getMixArr(avatarNumber);
  var randomLocations = getRandomLocations(SIMILAR_OFFER);

  var arr = [];
  for (var i = 0; i < SIMILAR_OFFER; i++) {
    var pin = {
      author: {
        avatar: 'img/avatars/user' + avatarRandNumber[i] + '.png' // строка, вида img/avatars/user{{xx}}.png, где {{xx}} - число от 01 до 08 не повторяются
      },
      offer: {
        title: 'Заголовок преложения # ' + (i + 1), // строка, заголовок предложения
        address: randomLocations[i].x + ', ' + randomLocations[i].y, // строка, запись вида "{{location.x}}, {{location.y}}
        price: '5500', // число, стоимость
        type: getRandomElementArr(OFFER_TYPES), // строка с одним из фиксированных значений
        rooms: getRandom(1, 3), // число, количество комнат
        guests: getRandom(1, 10), // число, количество гостей
        checkin: getRandomElementArr(TIMES), // строка с одним из фиксированных значений
        checkout: getRandomElementArr(TIMES), // строка с одним из фиксированных значений
        features: getRandomArr(FEATURES), // массив строк случайной
        description: 'какое-то описание', // строка с описанием,
        photos: getRandomArr(PHOTOS), // массив строк случайной длины
      },
      location: {
        x: randomLocations[i].x,
        y: randomLocations[i].y
      }
    };
    arr.push(pin);
  }
  return arr;
};

// Функция создания одного DOM-элемента на основе данных
var renderMapPin = function (offer) {
  var offerElement = similarOfferTemplate.cloneNode(true);
  var iconX = offer.location.x - (PIN_WIDTH / 2); // в разметку нужно верхний левый угол, то поправки  = - левее на (pin.width/2)
  var iconY = offer.location.y - PIN_HEIGHT; // Поправки = - выше на (pin.height)
  offerElement.style = 'left: ' + iconX + 'px; top: ' + iconY + 'px;';
  offerElement.querySelector('img').src = offer.author.avatar;
  offerElement.querySelector('img').alt = offer.offer.title;
  return offerElement;
};

// Функция создания фрагмента
var getFragmentWithPins = function (arr) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < arr.length; i++) {
    fragment.appendChild(renderMapPin(arr[i]));
  }
  return fragment;
};

// Алгоритм:
// 1. Генерация случайных данных
var offers = getMockData();
// 2. Вызов функции создания фрагмента и добавление фрагмента в DOM
var fragmentWithPins = getFragmentWithPins(offers);
map.querySelector('.map__pins').appendChild(fragmentWithPins);
// 3. Отображение карты на странице
map.classList.remove('map--faded');
