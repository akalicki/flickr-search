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
    $('#basicText').keydown(function(e) {
        if (e.which == 13) {
            e.preventDefault();
            basicSearch(flickr);
        }
    });

    $('#basicSearchBtn').click(function() {
        basicSearch(flickr);
    });

    $('#advSearchBtn').click(function() {
        advancedSearch(flickr);
    })
}

/* SEARCH METHODS */

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

    $('#basicText').val('');
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
            showPhotos(flickr, result.photos, options);
        }
    });
}

/* DISPLAY METHODS */

function showPhotos(flickr, photos, options) {
    var user_url,
        photo_url,
        photo_src,
        p,
        thumb_clone;

    $('#imgGallery').children().remove();
    for (i = 0; i < photos.photo.length; i++) {
        p = photos.photo[i];
        user_url = 'https://www.flickr.com/people/' + p.owner + '/';
        photo_url = 'https://www.flickr.com/photos/' + p.owner + '/' + p.id;
        photo_src = 'https://farm' + p.farm + '.staticflickr.com/' + p.server + '/' + p.id + '_' + p.secret + '_n.jpg';

        thumb_clone = $('#imgDummy').children('.img-thumbnail').first().clone();
        thumb_clone.find('img').first().attr({ src: photo_src, alt: p.title });
        thumb_clone.find('.img-title').first().attr('href', photo_url).text(p.title.length < 40 ? (p.title.length > 0 ? p.title : 'Untitled') : p.title.substring(0, 40) + '...');
        thumb_clone.find('.img-user').first().attr('href', user_url);
        thumb_clone.appendTo('#imgGallery');
    }

    if (options.page > 1) {
        $('#pagination .previous').removeClass('hide').off('click').on('click', function() {
            options.page--;
            imageSearch(flickr, options);
        });
    } else {
        $('#pagination .previous').addClass('hide');
    }

    if (options.page < photos.pages) {
        $('#pagination .next').removeClass('hide').off('click').on('click', function() {
            options.page++;
            imageSearch(flickr, options);
        });
    } else {
        $('#pagination .next').addClass('hide');
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
