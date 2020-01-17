
/*

This repository has an example and notes for the API:

https://github.com/jimthoburn/santa-monica-events

*/


/*
Example Style

<style>
  .error .message,
  .loading .message {
    display: block !important;
  }
  .error .message {
    color: red;
  }
</style>
*/

/*
Example HTML

<h1>Events for the City of Santa Monica in Palisades Park</h1>
<p role="status" class="message" style="display: none;"></p>
<ol id="event-list"></ol>
*/

(function() {
  let list = document.querySelector('[data-events-locations],[data-events-keywords]')
  if (!list) return

  let template = `
    <li class="{{ className }}">
      <details>
        <summary>
          <div class="summary">
            <h3><span><abbr aria-label="{{ weekday }}">{{ weekdayAbbreviation }}</abbr><br /><abbr aria-label="{{ month }}">{{ monthAbbreviation }}</abbr> {{ day }}</span></h3>
            <p>{{ title }}</p>
            <p>{{ time }}</p>
            <p>{{ location }}</p>
          </div>
          <div class="mask-behind-details"></div>
        </summary>
        <div class="details">
          <h3>{{ title }}</h3>
          <h4>{{ weekday }}, {{ month }} {{ day }}, {{ year }}</h4>
          <p>{{ time }}</p>
          <p>{{ description }}</p>

          <dl>
            <dt>Location</dt>
            <dd>{{ location }}</dd>
            <dd>{{ address }}</dd>
            <dt>Categories</dt>
            <dd>{{ categories }}</dd>
            <dt>Ages</dt>
            <dd>{{ ages }}</dd>
            <dt>Contact<dt>
            <dd>Santa Monica Cultural Affairs</dd>
            <dd><a href="mailto:culture@smgov.net">culture@smgov.net</a></dd>
            <dd>310-458-8350</dd>
          </dl>

          <p><a href="{{ url }}" target="_blank">Get more details about this event at {{ urlDomain }}</a></p>
        </div>
      </details>
    </li>
  `;

  // Example requests for the City of Santa Monica events API

  // Everything
  // https://data.smgov.net/resource/tu9m-76aw.json

  // Only locations and calendars
  // https://data.smgov.net/resource/tu9m-76aw.json?$select=calendar,location&$order=calendar,location&$group=calendar,location

  // showLoadingMessage()

  // const EVENT_TYPES = []
  // const EVENT_TYPES = [
  //   "Art Event",
  //   "Arts/Crafts",
  //   "Concerts/Dance",
  //   "Festival/Celebration",
  //   "Lecture/Panel",
  //   "Movies/Film",
  //   "Play/Performance Art"
  // ]
  
  // const LOCATIONS = []
  // const LOCATIONS = [
  //   "Miles Memorial Playhouse",
  //   "Palisades Park",
  //   "Annenberg Community Beach House"
  // ]
  // const CONTACT_NAMES = list.getAttribute("data-events-contact-name").split(",")
  
  const CONTACT_EMAILS = []
  // const CONTACT_EMAILS = [
  //   "culture@smgov.net",
  //   "naomi.okuyama@smgov.net"
  // ]

  const LOCATIONS      = list.getAttribute("data-events-locations") ? list.getAttribute("data-events-locations").split(",") : []
  const EVENT_TYPES    = list.getAttribute("data-events-types")     ? list.getAttribute("data-events-types").split(",")     : []
  const EVENT_KEYWORDS = list.getAttribute("data-events-keywords")  ? list.getAttribute("data-events-keywords").split(",")  : []

  // https://data.smgov.net/resource/tu9m-76aw.json?$where=contact_name   = 'culture@smgov.net' OR contact_name   = 'naomi.okuyama@smgov.net'
  // https://data.smgov.net/resource/tu9m-76aw.json?$where=contact_emails = 'culture@smgov.net' OR contact_emails = 'naomi.okuyama@smgov.net'
  function getWhereClause(columnName, items) {
    let asStrings = items.map(item => `'${item}'`)
    return `${columnName} = ${asStrings.join(` OR ${columnName} = `)}`
  }

  let eventTypesWhereClause = getWhereClause(`event_types`,   EVENT_TYPES)
  let contactEmailsClause   = getWhereClause(`contact_email`, CONTACT_EMAILS)
  let locationsClause       = getWhereClause(`location`,      LOCATIONS)

  let whereClause

  if (LOCATIONS.length > 0 && EVENT_TYPES.length > 0) {
    whereClause = `${locationsClause} OR (${eventTypesWhereClause})`
  } else if (CONTACT_EMAILS.length > 0) {
    whereClause = contactEmailsClause
  } else if (LOCATIONS.length > 0) {
    whereClause = locationsClause
  } else if (EVENT_TYPES.length > 0) {
    whereClause = eventTypesWhereClause
  }

  let urls = []

  if (EVENT_KEYWORDS.length > 0) {
    EVENT_KEYWORDS.forEach(keyword => {
      urls.push(`https://data.smgov.net/resource/tu9m-76aw.json?$limit=10000&$q=${encodeURIComponent(`'${keyword}'`)}`)
    })
  }

  if (whereClause) {
    urls.push(`https://data.smgov.net/resource/tu9m-76aw.json?$limit=10000&$where=${encodeURIComponent(whereClause)}`)
  }
  
  if (urls.length <= 0) {
    urls.push(`https://data.smgov.net/resource/tu9m-76aw.json?$limit=10000`)
  }

  // SHIM: Avoid showing unrelated events from Annenberg Community Beach House
  function isCulturalAffairsEvent(event) {
    return (event.location     !== "Annenberg Community Beach House" || 
            event.contact_name === "Beach=Culture")
  }

  console.log(urls)

  const urlPromises = urls.map(url => getData(url))

  Promise.all(urlPromises).then(values => {
    const data = values.reduce((accumulator, value) => accumulator.concat(value))
    addItems(data)
  })

  function getData(url) {
    return new Promise((resolve, reject) => {
      fetch(url)
        .then(function(response) {
          return response.json()
        })
        .then(function(myJson) {
          resolve(myJson)
          // hideLoadingMessage()
        })
        .catch(function(error) {
          console.error(error)
          reject(error)
          // showErrorMessage()
        })
    })
  }

  function addItems(data) {
    // let template = document.getElementById('event-template')
    let itemLimit = 10000
    if ( list.getAttribute("data-events-limit") && 
         !isNaN(list.getAttribute("data-events-limit"))) {
      itemLimit = Number(list.getAttribute("data-events-limit"))
    }
    let createdItems = 0
    let itemLimitReached = false
    if (data && list && template) {
      data.sort(function(a, b) {
        let aDate = new Date(a.start_date)
        let bDate = new Date(b.start_date)
        // a is less than b by some ordering criterion
        if (aDate < bDate) {
          return -1;
        }
        // a is greater than b by the ordering criterion
        if (aDate > bDate) {
          return 1;
        }
        // a must be equal to b
        return 0;
      })
      for (let index = 0; index < data.length; index++) {
        if (isCulturalAffairsEvent(data[index])) {
          // console.log({ createdItems, itemLimit })
          if (createdItems < itemLimit) {
            let success = null
            try {
              success = createItem(data[index], list, template)
            } catch(e) {
              console.error(`Something went wrong while rendering an event using this data: `)
              console.error(e)
              console.dir({ data: data[index] })
            }
            if (success) {
              createdItems++
            }
          } else {
            itemLimitReached = true
          }
        }
      }
      if (list.querySelectorAll("li").length <= 0) {
        list.insertAdjacentHTML('beforebegin', "<p>More events are coming soon…</p>")
      }
    }

    console.log({ itemLimitReached })

    let more = document.querySelector("[data-events-more]")
    if (itemLimitReached && more) {
      more.style.visibility = "visible"
    } else {
      if (more) more.style.display = "none"
    }

    let fallback = document.querySelector("[data-events-fallback]")
    if (fallback) fallback.parentNode.removeChild(fallback)
  }

  function paddedZeros(number) {
    return (number < 10) ? `0${number}` : number
  }

  // KUDOS: https://stackoverflow.com/questions/8888491/how-do-you-display-javascript-datetime-in-12-hour-am-pm-format
  function getFormattedTime(date) {
    let hours   = date.getHours()
    let minutes = date.getMinutes()
    let ampm    = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = (hours == 0) ? 12 : hours; // the hour '0' should be '12'
    return `${hours}:${paddedZeros(minutes)} ${ampm}`
  }

  function createItem(itemData, list, template) {
    const daysOfTheWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    let startDate = new Date(`${itemData.start_date}-08:00`)
    let endDate   = new Date(`${itemData.end_date}-08:00`)

    // Switch to these values if “Daylight saving time” is in effect 
    // let startDate = new Date(`${itemData.start_date}-07:00`)
    // let endDate   = new Date(`${itemData.end_date}-07:00`)

    let startTime = getFormattedTime(startDate)
    let endTime   = getFormattedTime(endDate)

    let weekday     = daysOfTheWeek[startDate.getDay()]
    let month       = monthNames[startDate.getMonth()]

    let weekdayAbbreviation = weekday.substring(0, 3)
    let monthAbbreviation   = month.substring(0, 3)

    let year        = startDate.getFullYear();
    let day         = startDate.getDate();
    let title       = itemData.title
    let time        = (startDate.getHours() == 0) ? `All day` : (endTime) ? `${startTime} to ${endTime}` : startTime
    let location    = itemData.location
    let address     = itemData.address_address
    // let city        = itemData.address_city
    // let state       = itemData.address_state
    // let zip         = itemData.address_zip
    let description = itemData.description
    let categories  = itemData.event_types
    let ages        = itemData.age_groups
    let url
    if (typeof(itemData.detail_url) == "object") {
      url = itemData.detail_url.url
    } else {
      url = itemData.detail_url
    }
    let urlDomain   = url.split("/")[2]
    let dataCategories = itemData.event_types ? itemData.event_types.toLowerCase() : null
    let dataDescription = itemData.description ? itemData.description.toLowerCase() : null

    let className   = ""
    if (location.toLowerCase().includes("palisades")) {
      className = "palisades";
    }
    if (location.toLowerCase().includes("miles")) {
      className = "miles";
    }
    if (location.toLowerCase().includes("beach")) {
      className = "beach";
    }

    let html = template
      .replace(/\{\{ weekday \}\}/g,     weekday)
      .replace(/\{\{ month \}\}/g,       month)
      .replace(/\{\{ year \}\}/g,        year)
      .replace(/\{\{ weekdayAbbreviation \}\}/g, weekdayAbbreviation)
      .replace(/\{\{ monthAbbreviation \}\}/g,   monthAbbreviation)
      .replace(/\{\{ day \}\}/g,         day)
      .replace(/\{\{ time \}\}/g,        time)
      .replace(/\{\{ title \}\}/g,       title)
      .replace(/\{\{ description \}\}/g, description)
      .replace(/\{\{ location \}\}/g,    location)
      .replace(/\{\{ address \}\}/g,    address)
      .replace(/\{\{ url \}\}/g,         url)
      .replace(/\{\{ urlDomain \}\}/g,  urlDomain)
      .replace(/\{\{ className \}\}/g,  className)
      .replace(/\{\{ dataCategories \}\}/g,  dataCategories)
      .replace(/\{\{ dataDescription \}\}/g,  dataDescription)
      
  
    if (categories) {
      html = html.replace(/\{\{ categories \}\}/g, categories)
    } else {
      html = html.replace("<dt>Categories</dt>", "")
      html = html.replace("<dd>{{ categories }}</dd>", "")
    }

    if (ages) {
      html = html.replace(/\{\{ ages \}\}/g, ages)
    } else {
      html = html.replace("<dt>Ages</dt>", "")
      html = html.replace("<dd>{{ ages }}</dd>", "")
    }

    // https://stackoverflow.com/questions/6963311/add-days-to-a-date-object
    const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;
    const THREE_DAYS = 3 * MILLISECONDS_PER_DAY;
    let today = new Date();
    let threeDaysAgo = new Date(today.setTime( today.getTime() - THREE_DAYS ));

    // If the event is happening in the future or if it happened recently
    if (startDate > threeDaysAgo) {
      list.insertAdjacentHTML('beforeend', html)
      return true
    }

    return false
  }
  function showLoadingMessage() {
    document.body.classList.add('loading');
    document.querySelector('.message').textContent = 'Loading data…'
  }
  function showErrorMessage() {
    document.body.classList.add('error');
    document.querySelector('.message').textContent = 'An error occurred while loading the data.'
  }
  function hideLoadingMessage() {
    document.body.classList.remove('loading');
    document.querySelector('.message').textContent = 'The data has finished loading.'
  }
})();
