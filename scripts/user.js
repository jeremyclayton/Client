 const URL = SERVER_URL;
 let globalEventArray = [];
 let globalCategoryArray = [];
 let user = {};
 $(document).ready(function() {

     getUserInfo()
         .then((myInfo) => {
             user = myInfo;
             populateUserInfo(user);
         })
         .then(() => {
             return getCategories()
         })
         .then((categoryArray) => {
             globalCategoryArray = categoryArray;
             populateCategories(categoryArray);
         })
         .then(() => {
             setGlobalEventHandlers();
         })

     getEvents()
         .then((eventArray) => {
             return sortEvents(eventArray);
         })
         .then((sortedEventArray) => {
             const normalizedEventArray = sortedEventArray.map((event) => {
                 const normalizedEvent = normalizeData(event);
                 return normalizedEvent;
             });
             return normalizedEventArray
         })
         .then((normalizedEventArray) => {
             return filterPastEvents(normalizedEventArray);
         })
         .then((cleanEventArray) => {
             globalEventArray = cleanEventArray;
             populateEvents(cleanEventArray)
         })
         .then((data) => {
             let imageData = globalEventArray;
             populateImages(imageData);
         })
         .catch((error) => {
             console.log(error);
             console.log(error.status);
             //  if (res.status === 500) {

            //  alert("Sorry... our bad. Reloading the page.");
            //  window.location.reload();

             //  }
         });





 });

 function getEvents() {
     return $.get(`${URL}/userDashboard`)
         .then((result) => {
             if (result.checkedAuthorization) {
                 if (result.authorized === false) {
                     alert("Sorry, you must log in to view this page.");
                     window.location.href = "guestDashboard.html";
                 }
             } else {
                 return result;
             }
         })

 }

 function sortEvents(eventData) {

     let returnData = eventData.sort(function compare(objectA, objectB) {
         if (objectA.date < objectB.date) { //a is less than b by some ordering criterion
             return -1;
         }
         if (objectA.date > objectB.date) { //a is greater than b by the ordering criterion
             return 1;
         }
         // a must be equal to b
         return 0;
     });
     return returnData;
 }

 function populateEvents(eventArray) {
     eventArray.forEach((event) => {
         populateEvent(event);
     });

 }

 function populateEvent(event) {
     const parent = $('.card-container');
     const source = $(`#card-template`).html();
     const template = Handlebars.compile(source);
     const html = template(event);
     parent.append(html);
     createEventsEventHandler(event.id);
 }

 function populateImages(imageData) {
     for (var j = 0; j < 3; j++) {
         let index = null;
         let thisEvent = null;
         let image_link = null;
         let counter = 0;
         while (image_link === null && (counter < 200)) {
             index = generateRandomIndex(imageData.length);
             thisEvent = imageData[index];
             image_link = thisEvent.image_link;
             counter += 1;
         }


         const $thisCarouselCard = $(`#image-card-${j}`);
         const $thisH2 = $(`#caption-${j}`);
         $thisH2.text(`${thisEvent.event_name}`);
         $thisCarouselCard.css(`background-image`, `url(${image_link})`);
         generateCarouselClickHandler($thisCarouselCard, thisEvent.id);
     }
 }

 function generateCarouselClickHandler($carouselCard, id) {
     $carouselCard.click(() => {
         populateEventDetail(id);
     })
 }

 function generateRandomIndex(max) {
     const index = Math.floor(Math.random() * max);
     return index;
 }

 function getUserInfo() {
     let data = $.get(`${URL}/myInfo`);
     return data;
 }

 function populateUserInfo(user) {
     const $parent = $('.welcome-container');
     const source = $(`#welcome-template`).html();
     const template = Handlebars.compile(source);
     const html = template(user);
     $parent.append(html);
 }


 function createEventsEventHandler(eventID) {
     const $thisCardBtn = $(`#card-btn-${eventID}`);
     $thisCardBtn.click(() => {
         populateEventDetail(eventID);

     })
 }

 function populateEventDetail(id) {
     let $source = null;
     let $name = null;
     let $address = null;
     let $date = null;
     let $description = null;
     let $link = null;
     let $image = null;
     let $location = null;
     let $price = null;
     let $time = null;
     globalEventArray.forEach((event, index) => {
         const thisEvent = globalEventArray[index];
         if (id === thisEvent.id) {
             $(`.card-container`).empty();
             $(`#category-container`).empty();
             $(`#category-title`).css("display", "none");
             $details = $(`<div id="details" class="container well"></div>`);
             $source = $(`<p><span class="event-label">Sourced From: </span><a id="sourceLink" target="_blank">${thisEvent.source_name}</a></p>`);
             const sourceName = thisEvent.source_name;
             let sourceLink = ""
             if (sourceName == "WestWord") {
                 sourceLink = "http://www.westword.com/";
             } else if (sourceName == "Dear Denver") {
                 sourceLink = "http://www.deardenver.net"
             } else if (sourceName == "Meetup") {
                 sourceLink = "https://www.meetup.com/";
             } else {
                 sourceLink = "";
             }

             $("#event-header").text("Event Details");
             $name = $(`<h2 id="details-header">${thisEvent.event_name}</h2>`);
             $address = $(`<p><span class="event-label">Address: </span>${thisEvent.address}</p>`);
             $date = $(`<p><span class="event-label">Date: </span>${thisEvent.date}</p>`);
             $description = $(`<p>${thisEvent.description}</p>`);
             $link = $(`<a href="${thisEvent.event_link}" id="original-link" target="_blank">Click Here for Host's Event Page</a>`);
             const thisImageLink = thisEvent.image_link;
             $image = $(`<img class="event-image" src="${thisImageLink}">`);
             $location = $(`<p><span class="event-label">Location: </span>${thisEvent.location}</p>`);
             $price = $(`<p><span class="event-label">Price: </span>${thisEvent.price}</p>`);
             $time = $(`<p><span class="event-label">Time: </span>${thisEvent.time}</p>`);
             $('#parent-container').append($details);
             $($details).append($name);
             if (thisEvent.image_link !== null) {
                 $($details).append($image);
             }
             $($details).append($date);
             $($details).append($time);
             $($details).append($description);
             $($details).append($location);
             $($details).append($address);
             $($details).append($price);
             $($details).append($source);
             if (thisEvent.event_link !== null) {
                 $($details).append($link);
             }
             $($details).append(`<a class="btn btn-danger" id="back-btn">Back to Event List</a>`);
             $(`#back-btn`).on('click', function() {
                 window.location.reload();
             })

             const $sourceLink = $('#sourceLink');
             $sourceLink.attr('href', sourceLink);
             //  debugger;


         }
     })
    //  debugger;
 }

 function setGlobalEventHandlers() {
     $('#logout').click(() => {
         $.get(`${URL}/logout`)
             .then((result) => {
                 if (result.loggedIn === false) {
                     alert("You have been successfully logged out.");
                     window.location.href = "index.html"
                 }
             })
     })

     createCategoriesEventHandler("all");
 }


 function getCategories() {
     let data = $.get(`${URL}/category`);
     return data;
 }

 function populateCategories(categoryArray) {
     categoryArray.forEach((category) => {
         populateCategory(category);
         createCategoriesEventHandler(category.id);
     });
 }

 function populateCategory(category) {
     const $parent = $('.category-container');
     const source = $(`#category-template`).html();
     const template = Handlebars.compile(source);
     const html = template(category);
     $parent.append(html);
 }

 function createCategoriesEventHandler(categoryID) {
     const $thisCategory = $(`.category-${categoryID}`);
     $thisCategory.click(() => {
         $thisCategory.addClass('selected');
         $thisCategory.siblings().removeClass('selected');
         const $parent = $('.card-container');
         $parent.empty();
         filterCategories(categoryID);
     })
 }

 function filterCategories(categoryID) {
     let categoryName = null;

     if (categoryID !== "all") {
         categoryName = globalCategoryArray[categoryID - 1].name;
     }

     globalEventArray.forEach((event) => {
         let shouldPopulate = false;
         const eventCategories = event.categories;
         if (categoryID == "all") {
             shouldPopulate = true;
         } else {
             eventCategories.forEach((category) => {
                 if (categoryName == category) {
                     shouldPopulate = true;
                 }
             })
         }

         if (shouldPopulate) {
             populateEvent(event);
         }

     })
 }

 $(function carousel() {
     $('.carousel').carousel({
         interval: 3000
     });
 });

 function filterPastEvents(eventArray) {
     const filteredEventArray = eventArray.filter((event) => {
         return event.isValid;
     });
     return filteredEventArray;
 }

 function normalizeData(event) {

     if (!event.source_name) {
         event.source_name = "No Source Name Specified";
     }

     if (!event.event_link) {
         //Event link left deliberately blank
     }

     if (!event.description) {
         event.description = "Description Unavailable"
     }

     let date = null;
     let possibleDate = null;
     if (event.date) {
         try {
             diff = Sugar.Date('today').hoursUntil(event.date).raw;
             if (diff >= 0) {
                 possibleDate = Sugar.Date(event.date).format('{Dow}, {Month} {dd}, {yyyy}').raw;
                 event.isValid = true;
             } else {
                 event.isValid = false;
             }
         } catch (err) {
             possibleDate = event.date;
             event.isValid = false;
         }
         event.date = possibleDate;
     } else {
         event.isValid = false;
     }

     if (!event.time) {
         event.time = "TBD";
     }

     if (!event.event_name) {
         event.event_name = "Event Name Unavailable";
     }


     if (!event.image_link) {
         //ImageLink deliberately left null
     }

     if (!event.location) {
         event.location = "TBD";
     }

     if (!event.address) {
         event.address = "TBD";
     }

     if (!event.price) {
         event.price = "TBD";
     }

     if (!event.categories) {
         event.categories = ["Miscellaneous"];
     }

     return event;
 }
