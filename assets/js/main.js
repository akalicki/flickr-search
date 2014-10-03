$(document).ready(function() {
    $('.datepicker').datepicker();

    var flickr = flickrInit();
    buttonInit(flickr);
});

function flickrInit() {
    return new Flickr({
        api_key: '0d35b59ee64d532fafced34b2d495513'
    });
}

function buttonInit(flickr) {
    $('#basicSearchBtn').click(function() {
        basicSearch(flickr);
    });

    $('#advSearchBtn').click(function() {
        advancedSearch(flickr);
    })
}

/* SEARCH METHODS */

var curOptions = {};
var curPages = 0;

function basicSearch(flickr) {
    var options = {
        text: $('#basicText').val(),
        per_page: 10,
        page: 1
    };

    imageSearch(flickr, options);
}

function advancedSearch(flickr) {
    var options = {
        text: $('#advText').val(),
        min_upload_date: $('#advUploadSince').val() !== '' ? Date.parse($('#advUploadSince').val()) / 1000 : '',
        max_upload_date: $('#advUploadUntil').val() !== '' ? Date.parse($('#advUploadUntil').val()) / 1000 : '',
        tags: $('#advTags').val(),
        per_page: 10,
        page: 1
    };

    addUserAndSearch(flickr, options);
}

function addUserAndSearch(flickr, options) {
    var user = $('#advUser').val();
    if (user === '') {
        imageSearch(flickr, options);
        return;
    }

    flickr.people.findByUsername({ username: user }, function(err, result) {
        if (err) {
            handleError(err);
        } else {
            options.user_id = result.user.nsid;
            imageSearch(flickr, options);
        }
    });
}

function imageSearch(flickr, options) {
    flickr.photos.search(options, function(err, result) {
        if (err) {
            handleError(err);
        } else {
            closeModal();
            curOptions = options;
            curPages = result.photos.pages;
            showPhotos(result.photos.photo);
        }
    });
}

/* DISPLAY METHODS */

function showPhotos(photos) {
    var photo_url,
        photo_src,
        p,
        thumb_clone;

    $('#imgGallery').children().remove();
    for (i = 0; i < photos.length; i++) {
        p = photos[i];
        photo_src = 'https://farm' + p.farm + '.staticflickr.com/' + p.server + '/' + p.id + '_' + p.secret + '_n.jpg';
        photo_url = 'https://www.flickr.com/photos/' + p.owner + '/' + p.id;

        thumb_clone = $('#imgDummy').children('.img-thumbnail').first().clone();
        thumb_clone.children('a').first().attr('href', photo_url);
        thumb_clone.find('img').first().attr({ src: photo_src, alt: p.title });
        thumb_clone.appendTo('#imgGallery');
    }
}

/* HELPER METHODS */

function closeModal() {
    $('#searchModal').modal('hide');
}


function handleError(err) {
    console.log("ERROR: " + err);
    closeModal();
}
