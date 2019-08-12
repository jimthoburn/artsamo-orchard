
// Sticky navigation for COAST 2019


(function() {

  // Create the sticky navigation by making a copy of the main navigation
  var navigation = document.getElementById('navigation');
  var navigationPlaceholder = document.getElementById('navigation-placeholder');
  console.log(navigation);
  console.log(navigationPlaceholder);
  if (navigation && navigationPlaceholder) {
    navigationPlaceholder.innerHTML = navigation.innerHTML;
  }

})();


(function() {

  // Toggle the visibility of the sticky navigation when the appropriate button is pressed
  var navLink = document.querySelector('#navigation-link');
  if (navLink) {

    navLink.addEventListener('click', function(e) {
      document.body.classList.toggle('has-active-nav');

      // If the user wants to open the link in a new window, let the browser handle it.
      if (e && (e.shiftKey || e.ctrlKey || e.altKey || e.metaKey)) return;

      e.preventDefault();
    }, false);
  }

  // Hide the sticky navigation, when a user scrolls
  window.addEventListener('scroll', function() {
    document.body.classList.remove('has-active-nav');
  }, { passive: true });

})();


(function() {

  // Highlight the current button
  const navigation = document.getElementById('navigation-placeholder');

  let current;

  function activate(target) {
    const targetID = target.getAttribute("id");
    console.log(`targetID: ${ targetID }`);
    if (!targetID) return

    const link = navigation.querySelector(`a[href="#${ targetID }"]`);
    console.log(`link: ${ link }`);
    if (!link) return;

    if (current) {
      current.classList.remove("active");
    }
    current = link
    current.classList.add("active");
    console.log(`current: ${ current }`);
  }

  function onIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        console.log(`intersectionRatio: ${ entry.intersectionRatio }`)
        if (entry.intersectionRatio >= 0) {
          console.log(`onIntersection: ${ entry.target }`)
          activate(entry.target);
        }
      }
    })
  }

  window.addEventListener('DOMContentLoaded', function() {
    const targets = document.querySelectorAll("[id]");

    // https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
    const observer = new IntersectionObserver(onIntersection, {
      threshold: 0,
      rootMargin: "0% 0% 0% 0%"
    })

    targets.forEach(target => {
      observer.observe(target);
    })
  }, { passive: true });

})();

