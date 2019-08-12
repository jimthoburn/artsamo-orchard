
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

  function closest(element, tagName) {

    // If the element is the target
    if (element.nodeName.toLowerCase() === tagName) return element;

    var ancestor = element;
    while ((ancestor = ancestor.parentElement) && ancestor.nodeName && ancestor.nodeName.toLowerCase() !== tagName);
    if (ancestor && ancestor.nodeName && ancestor.nodeName.toLowerCase() === tagName) {
      return ancestor;
    }
  }

  function onIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        console.log(`intersectionRatio: ${ entry.intersectionRatio }`)
        if (entry.intersectionRatio >= 0.1) {
          console.log(`onIntersection: ${ entry.target }`)
          const closestDiv = closest(entry.target, "div");
          console.log(`closestDiv: ${ closestDiv }`);
          if (closestDiv) {
            const targetID = closestDiv.getAttribute("id");
            console.log(`targetID: ${ targetID }`);
            if (targetID) {
              const link = navigation.querySelector(`a[href="#${ targetID }"]`);
              console.log(`link: ${ link }`);
              if (link) {
                if (current) {
                  current.classList.remove("active");
                }
                current = link
                current.classList.add("active");
                console.log(`current: ${ current }`);
              }
            }
          }
        }
      }
    })
  }

  window.addEventListener('DOMContentLoaded', function() {
    const headlines = document.querySelectorAll("h2");

    // https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
    const observer = new IntersectionObserver(onIntersection, {
      threshold: 0,
      rootMargin: "0% 0% -90% 0%"
    })

    headlines.forEach(headline => {
      observer.observe(headline);
    })
  }, { passive: true });

})();

