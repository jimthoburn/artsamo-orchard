# Santa Monica Cultural Affairs (ArtSaMo)

Supporting files for the Santa Monica Cultural Affairs website, built with [Orchard CMS](https://orchardproject.net/)

These are CSS and JS files, which are convenient to manage on GitHub. They’re published with [GitHub Pages](https://pages.github.com/) and then loaded from the website…

The stylesheet link looks like this:
```
<link href="https://jimthoburn.github.io/artsamo-orchard/assets/css/site.css" rel="stylesheet" type="text/css" />
```

The JavaScript is inlined on the site, since it makes updates to content and layout–and load time is extra important.

## Events

Here’s the criteria we’re using to filter the city calendar events for the site…
 
1. The event has a location that matches one of these places:
   * Annenberg Community Beach House
   * Miles Memorial Playhouse
   * Palisades Park
2. The event is in the future, or occurred within the last three days.
3. If the event is at the Beach House, it has “Beach=Culture” as the contact name.

### Special cases

A) If an event doesn’t match those first three rules, but it does have the word “ArtSaMo” or “Belmar” anywhere in the title or description, it will appear in the Cultural Affairs calendar as well. This is meant for events that happen outside of the Cultural Affairs venues, such as the Airport Artwork, COAST, Jazz on the Lawn, Día de los Muertos, Artsmonth, and Belmar-related events.

B) Events on the “all events for Belmar” page will appear, even if they’re older than three days:
https://www.santamonica.gov/arts/belmar-events

### About the API

The [santa-monica-events](https://github.com/jimthoburn/santa-monica-events) repository has more information about the city events API along with code examples.
