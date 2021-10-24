import Swiper from "swiper";

document.addEventListener("DOMContentLoaded", function () {
  function initializationAnswerSliders() {
    const contentSliders2 = document.querySelectorAll('.js--questions-and-answer-slider');
    for (let i = 0; i < contentSliders2.length; i++) {
      contentSliders2[i].classList.add(`js--questions-and-answer-slider-${i}`);
      // eslint-disable-next-line no-unused-vars
      const mySwiper = new Swiper(contentSliders2[i], {
        // init: false,
        slidesPerView: 1,
        spaceBetween: 20,
        simulateTouch: true,
        loop: true,
        breakpoints: {
          500: {
            loop: false,
            slidesPerView: 1,
            spaceBetween: 16,
          },
          768: {
            loop: false,
            // slidesPerView: 'auto',
            slidesPerView: 2,
            spaceBetween: 16,
            allowSlidePrev: true,
            allowSlideNext: true
          },
          1000: {
            slidesPerView: 3,
            spaceBetween: 16,
            allowSlidePrev: false,
            allowSlideNext: false
          }
        }
      });
      // mySwiper.init();
    }
  }
  var button = document.getElementById("items_menu");
  var buttons = document.querySelectorAll("#items_menu .round-cards__item")
  button.addEventListener("click", function (event) {
    let url = event.target.getAttribute('data-tab-url');

    if (url !== "") {
      url += "/";
    }

    history.pushState(null, null, `/questions/${url}`);

    for (i = 0; i < buttons.length; i++) {
      buttons[i].classList.remove('active');
    }
    event.target.classList.add('active');
    ajax(event.target);
  });
  var sort = document.getElementById('sort_block');
  sort.addEventListener('click', function (e) {
    if ($(e.target).attr('data-sort') !== '') {
      $(sort).find('li').removeClass('active');
      $(e.target).addClass('active');
      BX.ajax({
        url: '/local/templates/main/components/bitrix/news/question/bitrix/news.list/left_block/sort.php',
        data: {
          sort: $(e.target).attr('data-sort'),
          xml_id: $('button.round-cards__item.active').attr('data-tab-xml')
        },
        method: 'POST',
        dataType: 'html',
        timeout: 30,
        async: true,
        processData: true,
        scriptsRunFirst: true,
        emulateOnload: true,
        start: true,
        cache: false,
        onsuccess: function (data) {
          $('#items').html(data);
          window.fetchLikes();
          let share = $('.loadmore_wrap .ya-share2');
          if (share) {
            for (i = 0; i < share.length; i++) {
              Ya.share2(share[i], {
                content: {
                  url: $(share[i]).attr('data-url')
                }
              });
            }
          }
          initializationAnswerSliders();
        },
        onfailure: function () {

        }
      });
    }
  });

  function ajax(e) {
    var xml = e.getAttribute('data-tab-xml');
    console.log('sort:' + $('.select__list-item.js--select-item.active').attr('data-sort'));
    BX.ajax({
      url: '/local/templates/main/components/bitrix/news/question/bitrix/news.list/left_block/sort.php',
      data: {
        sort: $('.select__list-item.js--select-item.active').attr('data-sort'),
        xml_id: xml
      },
      method: 'POST',
      dataType: 'html',
      timeout: 30,
      async: true,
      processData: true,
      scriptsRunFirst: true,
      emulateOnload: true,
      start: true,
      cache: false,
      onsuccess: function (data) {
        if (data != '') {
          document.getElementById('items').innerHTML = data;
          let share = $('.loadmore_wrap .answer.loadmore_item .ya-share2');
          window.fetchLikes();
          if (share) {
            for (i = 0; i < share.length; i++) {
              Ya.share2(share[i], {
                content: {
                  url: $(share[i]).attr('data-url')
                }
              });
            }
          }
          initializationAnswerSliders();
        }
      },
      onfailure: function () {

      }
    });
  }
});
