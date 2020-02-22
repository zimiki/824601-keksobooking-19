'use strict';

// Модуль, который отвечает за создание карточки объявлений

(function () {
  var similarPhotoTemplate = document.querySelector('#card').content.querySelector('.popup__photo');
  var cardOfferTemplate = document.querySelector('#card').content.querySelector('.map__card');
  var map = document.querySelector('.map');
  var referenceElement = map.querySelector('.map__filters-container'); // определение блока перед которым нужно вставить card перед блоком.map__filters-container

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
    var fragmentOfferPhotos = window.util.getFragment(offer.offer.photos, renderPhoto); // Вызываем функцию создания фрагмента с фото из массива
    photos.appendChild(fragmentOfferPhotos); // Вставляем  фрагмент с фотографиями

    // В список .popup__features вывлдим все доступные удобства в объявлении
    var features = card.querySelector('.popup__features');
    removeAllChildElement(features);// Удаляет пустой элемент из разметки
    var fragmentOfferFeatures = window.util.getFragment(offer.offer.features, renderFeatur);// Вызываем функцию создания фрагмента с преимущества из массива
    features.appendChild(fragmentOfferFeatures); // Вставляем  фрагмент с преимуществами
    return card;
  };


  // Функция вставки нового элемента в DOM
  var addOfferCard = function (offer) {
    if (map.querySelector('.popup')) { // Проверяем была ли до этого вызвана карточка, если она вызвана, нужно ее убрать
      removeCard();
    }
    var card = renderOfferCard(offer); // Вызываем функцию отрисовки карточки
    map.insertBefore(card, referenceElement); // Вставка card в карту
    var cardPopup = map.querySelector('.popup'); // После того как вставили находим этот карточку
    cardPopup.querySelector('.popup__close').addEventListener('click', removeCard); // при вставке элемента навешиваем обоаботчики его удаления
  };

  // Функция, которая удаляет все вставленные фрагметом метки объявлений
  var removeCard = function () {
    var cardPopup = map.querySelector('.popup');
    cardPopup.querySelector('.popup__close').removeEventListener('click', removeCard);
    cardPopup.remove();
  };

  window.card = {
    add: addOfferCard
  };

})()
;
