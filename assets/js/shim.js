(function() {

  // Link logo to santamonica.gov
  let logo = document.querySelector("#layout-navigation .navbar .navbar-header .media a[href*='smgov.net']")
  if (logo) {
    logo.setAttribute("href", "https://santamonica.gov");
    let logoImage = logo.querySelector("img");
    if (logoImage) {
      logoImage.setAttribute("alt", "Brought to you by the City of Santa Monica");
    }
  }

  // Change the name of the site and remove the redundant home page link
  let logoLink = document.querySelector("#layout-navigation .navbar .navbar-header .media .navbar-link.media-body.media-center")
  if (logoLink) {
    logoLink.textContent = "Santa Monica Cultural Affairs"
    logoLink.removeAttribute("href")
  }

  // Move the main page heading after the image in the source order, for styling purposes
  let pageTitle = document.querySelector(".page.content-item > header:first-child")
  let primaryImage = document.querySelector(".page.content-item .image")
  if (pageTitle && primaryImage) {
    pageTitle.parentNode.removeChild(pageTitle)
    primaryImage.parentNode.insertBefore(pageTitle, primaryImage.nextSibling)
  }
  
  // Adjust the venue links on the home page
  let images = document.querySelectorAll(".previewvenue div > img");
  let links = document.querySelectorAll(".previewvenue a");
  if (images.length && images.length > 0 && images.length === links.length) {
    for (let index = 0; index < images.length; index++) {
      let image = images[index]
      let link = links[index]

      // 1) Move the image so it’s inside the link
      // (to make it easier to interact with the link)
      if (image.parentNode.nodeName.toLowerCase() != "a") {
        image.parentNode.removeChild(image)
        link.insertBefore(image, link.firstChild)
      }

      // 2) Change the civic auditorium link so it points to an external web site
      if (link.getAttribute("href").indexOf("civicauditorium") >= 0) {
        link.setAttribute("href", "https://www.smgov.net/departments/ccs/civicauditorium/")
      }
      
      // 3) Add icons
      let paragraph = link.querySelector("p")
      if (paragraph) {
        if (link.getAttribute("href").includes("beach")) {
          paragraph.insertAdjacentHTML("afterbegin", `<img src="/Media/arts/CA/icon-beachhouse.png" width="35" alt="" />`)
        } else if (link.getAttribute("href").includes("civic")) {
          paragraph.insertAdjacentHTML("afterbegin", `<img src="/Media/arts/CA/icon-civic-auditorium.png" width="35" alt="" />`)
        } else if (link.getAttribute("href").includes("camera")) {
          paragraph.insertAdjacentHTML("afterbegin", `<img src="/Media/arts/CA/icon-camera-obscura.png" width="35" alt="" />`)
        } else if (link.getAttribute("href").includes("miles")) {
          paragraph.insertAdjacentHTML("afterbegin", `<img src="/Media/arts/CA/icon-miles-playhouse.png" width="35" alt="" />`)
        }
      }
    }
  }

  const firstPreviewVenue = document.querySelector(".previewvenue .col-md-6");
  if (firstPreviewVenue) {
    const civicHTML = `
      <div class="col-md-6">
        <div>
          <a href="https://www.smgov.net/departments/ccs/civicauditorium/" target="_blank">
            <img src="/Media/arts/CA/civicauditorium.jpg" alt="">
            <p><img src="/Media/arts/CA/icon-civic-auditorium.png" width="35" alt="">The Civic Auditorium</p>
          </a>
        </div>
      </div>
      `
    firstPreviewVenue.insertAdjacentHTML("afterend", civicHTML)
  }
  
  // Remove the “attention artists” section from the home page
  let artist = document.querySelector(".artist.jumbotron")
  if (artist && document.documentElement.classList.contains("detail-home-page")) {
    artist.parentNode.removeChild(artist)
  }

  
  // Remove the policy section from the home page
  let policy = document.querySelector(".zone-policy")
  if (policy && document.documentElement.classList.contains("detail-home-page")) {
    let policyRow = policy.parentNode.parentNode
    policyRow.parentNode.removeChild(policyRow)
  }


  // Add a headline with a link above the "Upcoming Deadlines"
  let upcoming = document.querySelector(".upcoming-details")
  if (upcoming && document.documentElement.classList.contains("detail-home-page")) {
    let secondaryHeadline = upcoming.querySelector("h1")
    let headline = document.createElement("h1")
    headline.innerHTML = `<a href="/arts/opportunities">Opportunities for Artists and Organizations</a>`
    secondaryHeadline.parentNode.insertBefore(headline, secondaryHeadline)
    
    // Change the secondary headline to an “h2’
    let newSecondaryHeadline = document.createElement("h2")
    newSecondaryHeadline.textContent = secondaryHeadline.textContent
    secondaryHeadline.parentNode.replaceChild(newSecondaryHeadline, secondaryHeadline)
  }

  
  // Support HTML in featured artist section
  let featuredArtist = document.querySelector(".featuredartist p")
  if (featuredArtist && document.documentElement.classList.contains("detail-home-page")) {
    let link = featuredArtist.querySelector("a")
    link.parentNode.removeChild(link)
    link.removeAttribute("target")
    /*
    if (link.getAttribute("href") === "/arts/go-see-art") {
      link.setAttribute("href", "/arts/go-see-art#public-art")
    }
    */
    featuredArtist.innerHTML = featuredArtist.textContent
    featuredArtist.appendChild(link)
  }


/*
  const featuredEventsHTML = `
<a href="/arts/meet-me-at-reed" class="featured-event">
  <img src="/Media/arts/CA/2018_5_19_2018_Meet_Me_At_Reed_Taiko_Festival_Javier_Guillen (195 of 281).jpg" 
       class="featured-event__image"
       alt="" />
  <div class="featured-event__text">
    <h2 class="featured-event__title">Meet Me at Reed</h2>
    <p class="featured-event__description">Saturdays: June 15 to July 27, 2019, Free admission</p>
  </div>
</a>
<a href="/arts/jazz-2019" class="featured-event">
  <img src="/Media/arts/CA/JOTL-Banner.jpg" 
       class="featured-event__image"
       alt="" />
  <div class="featured-event__text">
    <h2 class="featured-event__title">Jazz on the Lawn</h2>
    <p class="featured-event__description">Sundays in August, Free admission</p>
  </div>
</a>
<a href="/arts/art-in-the-parks" class="featured-event">
  <img src="/Media/arts/CA/The%20Wonder%20Room%202015%20-%202%20William%20Short.jpg" 
       class="featured-event__image"
       alt="" />
  <div class="featured-event__text">
    <h2 class="featured-event__title">Art in the Parks</h2>
    <p class="featured-event__description">Free Outdoor Performances to Look Forward to This Summer</p>
  </div>
</a>
`
*/

/*
<a href="/arts/beach-dances" class="featured-event">
<img src="https://www.santamonica.gov/Media/arts/CA/2018_6_7_18_SarahElgart_BeachDances_BH_Sam%20McReynolds_Genna%20Moroni_%20Jonathan%20Stanley_%20Alexandria%20Diaz%20de%20Fato_photobyJasonAbraham2.jpg" 
     class="featured-event__image"
     alt="" />
<div class="featured-event__text">
  <h2 class="featured-event__title">Beach Dances</h2>
  <p class="featured-event__description">June 18 – 23, 2019, Free admission</p>
</div>
</a>
<a href="/arts/indigenous-now" class="featured-event">
  <img src="/Media/arts/CA/2018_Tongva_Park_Jason_Abraham-(4-of-52).jpg" 
       class="featured-event__image"
       alt="" />
  <div class="featured-event__text">
    <h2 class="featured-event__title">Indigenous Now</h2>
    <p class="featured-event__description">Saturday, May 11 from 12 – 4 p.m., Free admission</p>
  </div>
</a>
<a class="featured-event-image-only" href="/arts/airport-artwalk">
  <img src="/Media/arts/CA/art-walk.jpg"
       alt="Santa Monica Airpot Artwalk 2019. Saturday, March 23 from 12-5pm. Rain or shine! Free admission" />
</a>
*/

  if (featuredEventsHTML) {

    // Add the home page features
    let vision = document.querySelector(".vision")
    if (vision && document.documentElement.classList.contains("detail-home-page")) {
      vision.insertAdjacentHTML("afterend", featuredEventsHTML)
    }

    // Add the Go See Art features
    let featuredEventsPlaceholder = document.querySelector(".featured-events-placeholder")
    if (featuredEventsPlaceholder) {
      featuredEventsPlaceholder.insertAdjacentHTML("afterend", featuredEventsHTML)
    }
  }

  let featuredEvents = document.querySelectorAll("#featured-events li")
  featuredEvents.forEach(item => {
    let link = item.querySelector("a")
    let text = item.querySelector(".featured-event__text")
    if (link && text) {
      text.parentNode.removeChild(text)
      link.appendChild(text)
    }
  })

  // Open external links and PDFs in a new window
  document.querySelectorAll("a").forEach(link => {
    let url = link.getAttribute("href")
    if (url) {
      if ((url.indexOf("http") === 0 && !url.includes(window.location.hostname)) ||
           url.includes(".pdf")) {
        link.setAttribute("target", "_blank")
      }
    }
  })


})()
