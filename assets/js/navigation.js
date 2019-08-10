

(function() {
  var navigation = document.getElementById('navigation');
  var navigationPlaceholder = document.getElementById('navigation-placeholder');
  console.log(navigation);
  console.log(navigationPlaceholder);
  if (navigation && navigationPlaceholder) {
    navigationPlaceholder.innerHTML = navigation.innerHTML;
  }
})();


(function() {
  var navLink = document.querySelector('#navigation-link');
  if (navLink) {

    // https://stackoverflow.com/questions/1034621/get-the-current-url-with-javascript
    // var currentPage = window.location.href.toString().split(window.location.host)[1];

    // navLink.setAttribute('href', '/navigation?previous_page=' + currentPage);

    // navLink.parentNode.style.display = 'none';
    navLink.addEventListener('click', function(e) {
      document.body.classList.toggle('has-active-nav');

      // If the user wants to open the link in a new window, let the browser handle it.
      if (e && (e.shiftKey || e.ctrlKey || e.altKey || e.metaKey)) return;

      e.preventDefault();
    }, false);
  }

  // var headerLinks = document.querySelectorAll('.navigation-link nav a');
  // for (var index = 0; index < headerLinks.length; index++) {
  //   headerLinks[index].addEventListener('focus', function(e) {
  //     setTimeout(function() {
  //       if (document.body.classList.contains('header-not-visible')) {
  //         document.body.classList.add('has-active-nav');
  //       }
  //     }, 300);
  //   }, false);
  // }
})();



(function() {
  /* Do we have the features we need? */
  if (!document.querySelector || !window.addEventListener || !document.body.classList) return;

  var fadeInTimer;
  function fadeIn() {
    document.body.classList.add('transition-header-in');
    clearTimeout(fadeInTimer);
    fadeInTimer = setTimeout(function() {
      document.body.classList.remove('transition-header-in');
    }, 400);
  }

  var animationTimer;
  var assumedHeaderHeight = 500;
  function updateHeaderHeight() {
    var firstContentItem = document.querySelector('.first-content-item');
    if (firstContentItem) {
      assumedHeaderHeight = firstContentItem.offsetHeight;
    }
  }
  function updateScrollPosition() {

    /* OPTIONAL: Add a class name of “header-not-visible” to the header,
                 including the navigation, is not visible. */

    if (window.scrollY >= assumedHeaderHeight && !document.body.classList.contains('header-not-visible')) {
      document.body.classList.add('header-not-visible');

      clearTimeout(animationTimer);
      setTimeout(function() {
        document.body.classList.add('animate-header');
      }, 1);
      // fadeIn();
    } else if (window.scrollY < assumedHeaderHeight && document.body.classList.contains('header-not-visible')) {
      document.body.classList.remove('header-not-visible');
      document.body.classList.remove('animate-header');
      clearTimeout(animationTimer);
      // fadeIn();
    }

    document.body.classList.remove('has-active-nav');
  }

  updateScrollPosition();
  updateHeaderHeight();

  window.addEventListener('scroll', updateScrollPosition, { passive: true });
  window.addEventListener('resize', updateHeaderHeight,   { passive: true });

})();

