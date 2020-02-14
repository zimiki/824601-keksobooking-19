'use strict';

var OFFER_TYPES = ['palace', 'flat', 'house', 'bungalo'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var TIMES = ['12:00', '13:00', '14:00'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var map = document.querySelector('.map');
var similarOfferTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
// var similarPhotoTemplate = document.querySelector('#card').content.querySelector('.popup__photo');
// var cardOfferTemplate = document.querySelector('#card').content.querySelector('.map__card');
var PIN_WIDTH = 50; // Ширина иконки
var PIN_HEIGHT = 70; // Высота иконки
var MAIN_PIN_WIDTH = 65; // Ширина главной метки
var MAIN_PIN_HEIGHT = 84; // Высота главной метки
var ENTER_KEY = 'Enter';
var LEFT_MOUSE_BUTTON = 0;


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

// Функция создания одного DOM-элемента на основе данных для PIN
var renderMapPin = function (offer) {
  var offerElement = similarOfferTemplate.cloneNode(true);
  var iconX = offer.location.x - (PIN_WIDTH / 2); // в разметку нужно верхний левый угол, то поправки  = - левее на (pin.width/2)
  var iconY = offer.location.y - PIN_HEIGHT; // Поправки = - выше на (pin.height)
  offerElement.style = 'left: ' + iconX + 'px; top: ' + iconY + 'px;';
  offerElement.querySelector('img').src = offer.author.avatar;
  offerElement.querySelector('img').alt = offer.offer.title;
  return offerElement;
};

/*
// Функция создания одного DOM-элемента на основе данных для PHOTO. Каждая строка массива  должна записываться как src
var renderPhoto = function (photo) {
  var photoElement = similarPhotoTemplate.cloneNode(true);
  photoElement.src = photo;
  return photoElement;
};


// Функция создания одного DOM-элемента на основе данных для FEATURES. Только доступные
var renderFeatur = function (featur) {
  var featurTemplate = document.querySelector('#card').content.querySelector('.popup__feature--' + featur);
  var featurElement = featurTemplate.cloneNode(true);
  return featurElement;
};


// Функция удаления всех дочерних элементов, которые были в шаблоне
var removeAllChildElement = function (parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
};
*/


// Функция создания фрагмента, принимает массив данных и функцию отрисовки элемента
var getFragment = function (arr, renderElement) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < arr.length; i++) {
    fragment.appendChild(renderElement(arr[i]));
  }
  return fragment;
};


/*
// Функция получения текстового значения. Квартира для flat, Бунгало для bungalo, Дом для house, Дворец для palace.
var getTypeText = function (type) {
  var typeOffer = 'не указано';
  if (type === 'flat') {
    typeOffer = 'квартира';
  } else if (type === 'bungalo') {
    typeOffer = 'бунгало';
  } else if (type === 'house') {
    typeOffer = 'дом';
  } else if (type === 'palace') {
    typeOffer = 'дворец';
  }
  return typeOffer;
};

// Функция создания одного DOM-элемента CARD на основе данных
  var renderOfferCard = function (offer) {
  var card = cardOfferTemplate.cloneNode(true);
  card.querySelector('.popup__title').textContent = offer.offer.title; // заголовок объявления offer.title в заголовок .popup__title.
  card.querySelector('.popup__text--address').textContent = offer.offer.address; // адрес offer.address в блок .popup__text--address.
  card.querySelector('.popup__text--price').textContent = offer.offer.price + '₽/ночь'; // цена offer.price в блок .popup__text--price строкой вида
  card.querySelector('.popup__text--capacity').textContent = offer.offer.rooms + ' комнаты для ' + offer.offer.guests + ' гостей'; // 2 комнаты для 3 гостей.
  card.querySelector('.popup__text--time').textContent = 'заезд после ' + offer.offer.checkin + ', выезд до ' + offer.offer.checkout; // заезд после 14:00, выезд до 12:00.
  card.querySelector('.popup__description').textContent = offer.offer.description; // в блок .popup__description выведите описание объекта недвижимости offer.description.
  card.querySelector('.popup__avatar').src = offer.author.avatar; //  src у аватарки пользователя —  author.avatar отрисовываемого объекта
  card.querySelector('.popup__type').textContent = getTypeText(offer.offer.type);

  // В блок .popup__photos выводим все фотографии из списка offer.photos
  var photos = card.querySelector('.popup__photos');
  removeAllChildElement(photos);// Удаляет пустой элемент из разметки
  var fragmentOfferPhotos = getFragment(offer.offer.photos, renderPhoto); // Вызываем функцию создания фрагмента с фото из массива
  photos.appendChild(fragmentOfferPhotos); // Вставляем  фрагмент с фотографиями

  // В список .popup__features вывлдим все доступные удобства в объявлении
  var features = card.querySelector('.popup__features');
  removeAllChildElement(features);// Удаляет пустой элемент из разметки
  var fragmentOfferFeatures = getFragment(offer.offer.features, renderFeatur);// Вызываем функцию создания фрагмента с преимущества из массива
  features.appendChild(fragmentOfferFeatures); // Вставляем  фрагмент с преимуществами


  var referenceElement = map.querySelector('.map__filters-container');
  map.insertBefore(card, referenceElement); // Вставка CARD в блок .map перед блоком.map__filters-container
  return card;
};

4. Отрисовка карточки предложения
renderOfferCard(offers[0]);
*/


// Генерация случайных данных
var offers = getMockData();


// ----------  О Б Р А Б О Т К А     С О Б Ы Т И Й   -----------


var mainPin = map.querySelector('.map__pin--main'); // Элемент активирующий карту
var mapFilter = map.querySelector('.map__filters'); // Форма №1 .map__filters
var adForm = document.querySelector('.ad-form'); // Форма №2 .ad-form
var resetFormButton = adForm.querySelector('.ad-form__reset'); // Элемент сбрасывающий карту до изначального неативного состояния
var mapPins = map.querySelector('.map__pins'); // Главная метка
var typeSelect = adForm.querySelector('#type');
var priceInput = adForm.querySelector('#price');
var roomSelect = adForm.querySelector('#room_number');
var capacitySelect = adForm.querySelector('#capacity');
var adFormTime = adForm.querySelector('.ad-form__element--time');
var inputAddress = adForm.querySelector('#address');


// Функция, которая устанавливает в неактивном состоянии страницы  адрес = координаты центра метки;
var setInactiveAdress = function () {
  var mainPinX = parseInt(mainPin.style.left, 10);
  var mainPinY = parseInt(mainPin.style.top, 10);
  var centerX = Math.floor(mainPinX + (MAIN_PIN_WIDTH / 2));
  var centerY = Math.floor(mainPinY + (MAIN_PIN_WIDTH / 2)); // не использую высоту, потому что метка круглая без хвостика
  inputAddress.placeholder = (centerX + ', ' + centerY);
};


// Функция, которая УСТАНАВЛИВАЕТ неактивное состояние на <input> и <select> формы с помощью атрибута disabled
var inactiveForm = function (form) {
  var allInput = form.querySelectorAll('input');
  var allSelect = form.querySelectorAll('select');
  for (var i = 0; i < allInput.length; i++) {
    allInput[i].setAttribute('disabled', 'disabled');
  }
  for (var j = 0; j < allSelect.length; j++) {
    allSelect[j].setAttribute('disabled', 'disabled');
  }
};

// Функция, которая СНИМАЕТ неактивное состояние на <input> и <select>
var activeForm = function (form) {
  var allInput = form.querySelectorAll('input');
  var allSelect = form.querySelectorAll('select');
  for (var i = 0; i < allInput.length; i++) {
    allInput[i].removeAttribute('disabled');
  }
  for (var j = 0; j < allSelect.length; j++) {
    allSelect[j].removeAttribute('disabled');
  }
};

// Функция, которая удаляет все вставленные фрагметом метки объявлений
var removeNewMapPins = function () {
  var newMapPins = mapPins.querySelectorAll('.map__pin');
  for (var i = 0; i < newMapPins.length; i++) {
    if (!newMapPins[i].classList.contains('map__pin--main')) {
      mapPins.removeChild(newMapPins[i]);
    }
  }
};

// Обработчик изменения priceInput
var onPriceInputChange = function () {
  var min = parseInt(priceInput.min, 10);
  var max = parseInt(priceInput.max, 10);
  if (priceInput.value < min) {
    priceInput.setCustomValidity('Минимальное значение - ' + min);
  } else if (priceInput.value > max) {
    priceInput.setCustomValidity('Максимальное значение - ' + max);
  } else if (priceInput.validity.valueMissing) {
    priceInput.setCustomValidity('Обязательное поле');
  } else {
    priceInput.setCustomValidity('');
  }
};

// Обработчик изменения селекта time
var setMinPrice = function () {
  var type = typeSelect.value;
  var minPrice = 0;
  if (type === 'bungalo') {
    minPrice = 0;
  } else if (type === 'flat') {
    minPrice = 1000;

  } else if (type === 'house') {
    minPrice = 5000;
  } else {
    minPrice = 10000;
  }
  priceInput.min = minPrice;
  priceInput.placeholder = minPrice;
};

var onTypeSelectChange = function () {
  setMinPrice();
  onPriceInputChange();
};


// Обработчик изменения селекта room
var onRoomSelectChange = function () {
  var rooms = parseInt(roomSelect.value, 10);
  var capacity = parseInt(capacitySelect.value, 10);
  if (rooms === 1 && capacity !== 1) {
    roomSelect.setCustomValidity('для 1 гостя');
  } else if (rooms === 2 && (capacity < 1 || capacity > 2)) {
    roomSelect.setCustomValidity('для 2 гостей или для 1 гостя');
  } else if (rooms === 3 && (capacity < 1 || capacity > 3)) {
    roomSelect.setCustomValidity('для 3 гостей, для 2 гостей или для 1 гостя');
  } else if (rooms === 100 && capacity !== 0) {
    roomSelect.setCustomValidity('не для гостей');
  } else {
    roomSelect.setCustomValidity('');
  }
};

// Обработчик синхронизирует поля «Время заезда» и «Время выезда»
var onTimeSelectCange = function (evt) {
  var timeinSelect = adForm.querySelector('#timein');
  var timeoutSelect = adForm.querySelector('#timeout');
  if (evt.target === timeinSelect) {
    timeoutSelect.value = timeinSelect.value;
  } else if (evt.target === timeoutSelect) {
    timeinSelect .value = timeoutSelect.value;
  }
};

// Функция, которая учитывает поправки на передачу координат ГЛАВНОЙ метки  (левого вехнего угла--> острого конца)
var getMainPinMarkCoord = function (pinX, pinY) {
  var markX = Math.floor(pinX + (MAIN_PIN_WIDTH / 2)); // получим координаты для остного конца метки(правее +(ширины/2), ниже +высоты)
  var markY = Math.floor(pinY + MAIN_PIN_HEIGHT);
  var markCoord = {
    x: markX,
    y: markY
  };
  return (markCoord);
};

// Функция, которыя устанавливает значения поля ввода адреса. Это координаты, на которые метка указывает своим острым концом.
var setMouseСoordAddress = function (evt) {
  var mapCoord = map.getBoundingClientRect(); // получим координаты карты. X/Y-координаты начала прямоугольника относительно окна
  var mainPinX = Math.floor(evt.clientX - mapCoord.x); // получим координаты мышки относительно окна карты (это пин)
  var mainPinY = Math.floor(evt.clientY - mapCoord.y);
  var pinMarkCoord = getMainPinMarkCoord(mainPinX, mainPinY); // внесем поправки для передачи координат
  inputAddress.value = pinMarkCoord.x + ', ' + pinMarkCoord.y; // в интуп для адреса, запишем координаты
};

// Функция, которыя устанавливает значения поля ввода адреса. Вариация для Enter
var setKeyСoordinatesAddress = function (evt) {
  var mainPinX = evt.target.offsetLeft;
  var mainPinY = evt.target.offsetTop;
  var pinMarkCoord = getMainPinMarkCoord(mainPinX, mainPinY); // внесем поправки для передачи координат
  inputAddress.value = pinMarkCoord.x + ', ' + pinMarkCoord.y; // в интуп для адреса, запишем координаты
};

var openMap = function () {
  map.classList.remove('map--faded'); // Снимает неактивное состояние .map содержит класс map--faded;
  adForm.classList.remove('ad-form--disabled');
  activeForm(mapFilter); // Снимает неактивное состояние c формы №1
  activeForm(adForm); // Снимает неактивное состояние c формы №2
  var fragmentWithPins = getFragment(offers, renderMapPin); // Вызов функции создания фрагмента c pin объявлений
  map.querySelector('.map__pins').appendChild(fragmentWithPins); // Добавление фрагмента c pin в DOM
  setMinPrice(); // Установим минимум для выбраного селекта из разметки
  inputAddress.setAttribute('disabled', 'disabled'); // Заблокируем поля ввода адреса
  // Добавление обработчиков:
  typeSelect.addEventListener('change', onTypeSelectChange); // Проверка изменений по типу жилья
  priceInput.addEventListener('input', onPriceInputChange); // Проверка изменений цены жилья
  adFormTime.addEventListener('change', onTimeSelectCange); // Синхронизация времени
  roomSelect.addEventListener('change', onRoomSelectChange); // Валидация значений при смене количества комнат
  capacitySelect.addEventListener('change', onRoomSelectChange); // Валидация значений при смене количества комнат
  resetFormButton.addEventListener('click', closeMap); // Обработчик для перехода к начальному состоянию
};

var closeMap = function () {
  map.classList.add('map--faded');
  adForm.classList.add('ad-form--disabled');
  inactiveForm(mapFilter);
  inactiveForm(adForm);
  setInactiveAdress();
  removeNewMapPins();
  // Снятие обработчиков:
  typeSelect.removeEventListener('change', onTypeSelectChange);
  priceInput.removeEventListener('input', onPriceInputChange);
  adFormTime.removeEventListener('change', onTimeSelectCange);
  roomSelect.removeEventListener('change', onRoomSelectChange);
  capacitySelect.removeEventListener('change', onRoomSelectChange);
  resetFormButton.removeEventListener('click', closeMap);
};

var onMainPinClik = function (evt) {
  if (typeof evt === 'object') {
    switch (evt.button) { // Проверка на то что клик приходит с левой кнопки мыши
      case LEFT_MOUSE_BUTTON:
        openMap();
        setMouseСoordAddress(evt);
    }
  }
};

var onMainPinKeydown = function (evt) {
  if (evt.key === ENTER_KEY) {
    openMap();
    setKeyСoordinatesAddress(evt);
  }
};

// Запускаем код:
// Приводит страницу в изначальное неактивное состояние
inactiveForm(mapFilter); // Заблокирована форма №1 .map__filters
inactiveForm(adForm); // Заблокирована форма №2 .ad-form
setInactiveAdress(); // Устанавливаем адрес = центру метки

// Добавялет обработчик АКТИВАЦИИ на mousedown
mainPin.addEventListener('mousedown', onMainPinClik);

// Добавялет обработчик АКТИВАЦИИ на keydown с проверкой на то что это кнопка Enter
mainPin.addEventListener('keydown', onMainPinKeydown);

