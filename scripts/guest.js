let eventArray = [];
let categoryArray = [];
$(document).ready(function() {
    const baseURL = SERVER_URL;
    var eventURL = `${SERVER_URL}/events`;
    var categoryURL = `${SERVER_URL}/category`;
    var eventCategoryURL = `${SERVER_URL}/view_categoriesEvents/`;



    $.get(categoryURL)
        .then((data) => {
            categoryArray = data;
            for (var i = 0; i < categoryArray.length; i++) {
                var categoryName = categoryArray[i].name;
                var categoryId = categoryArray[i].id;
                var $listItem = $(`<div class="list-group-item category-filter" id="category-${categoryId}" val="${categoryId}">${categoryName}</div>`);
                $('#listTwo').append($listItem);
                createClickHandler(categoryId);
            }
            createClickHandler("all");
            createGoogleButtonHandler();
        })


    $.get(eventURL)
        .then((data) => {
            data = data.sort(function compare(objectA, objectB) {
                if (objectA.date < objectB.date) { //a is less than b by some ordering criterion
                    return -1;
                }
                if (objectA.date > objectB.date) { //a is greater than b by the ordering criterion
                    return 1;
                }
                // a must be equal to b
                return 0;
            });

            eventArray = data;
            eventArray = normalizeArray(eventArray);
            eventArray = filterPastEvents(eventArray);
            for (var i = 0; i < eventArray.length; i++) {
                var thisEvent = eventArray[i];
                populateEvent(thisEvent, i);
            }
        })
        .catch((error) => {
            alert("Sorry... our bad. Reloading the page.");
            window.location.reload();
        })




});

function createEventClickHandler(event) {
    const $thisCardBtn = $(`#card-${event.id}`);
    $thisCardBtn.click(() => {
        window.open(event.event_link);
    })
}


function createClickHandler(id) {
    $(`#category-${id}`).click(function() {
        $(`.list-group-item`).removeClass('selected');
        $(`#category-${id}`).addClass('selected');
        $('#listOne').empty();
        let thisCategory = null;

        for (var i = 0; i < eventArray.length; i++) {
            let shouldAppend = false;
            const thisEvent = eventArray[i];
            if (id !== "all") {
                thisCategory = categoryArray[id - 1];
                for (var j = 0; j < thisEvent.categories.length; j++) {
                    const thisEventCategory = thisEvent.categories[j];
                    if (thisEventCategory === thisCategory.name) {
                        shouldAppend = true;
                    }
                }
            } else {
                shouldAppend = true;
            }

            if (shouldAppend) {
                populateEvent(thisEvent, i);
            }
        }
    });
}

function populateEvent(thisEvent) {
    var sourceName = null;
    thisEvent = normalizeData(thisEvent);


    var $card = $('<div class="panel panel-default event-card" + id="card-' + thisEvent.id + '"></div>');


    var $heading = $('<div class="panel-heading"><h3 class="panel-title">' + thisEvent.event_name + '</h3></div>');
    var $body = $('<div class="panel-body"">' + thisEvent.date + ' at ' + thisEvent.time + '</div>');
    $($card).append($heading);
    $($card).append($body);

    $('#listOne').append($card);

    createEventClickHandler(thisEvent);


}

function filterPastEvents(eventArray) {
    const filteredEventArray = eventArray.filter((event) => {
        return event.isValid;
    });
    return filteredEventArray;

}

function normalizeArray(array) {
    // console.log(array)
    const normalizedArray = array.map((event) => {
        return normalizeData(event);
    });
    // console.log(normalizedArray);
    return normalizedArray;
}



function createGoogleButtonHandler() {
    $loginButton = $("#sign-in");
    $loginButton.attr('href', `${SERVER_URL}/auth/google`);
}


function normalizeData(event) {

    if (!event.source_name) {
        event.source_name = "No Source Name Specified";
    }

    if (!event.event_link) {
        event.event_link = "No Link Available";
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
                possibleDate = event.date;
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
