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

function basicSearch(flickr) {
    var options = {
        text: $('#basicText').val(),
        per_page: 10
    };

    imageSearch(flickr, options);
}

function advancedSearch(flickr) {
    var options = {
        text: $('#advText').val(),
        min_upload_date: $('#advUploadSince').val() !== '' ? Date.parse($('#advUploadSince').val()) / 1000 : '',
        max_upload_date: $('#advUploadUntil').val() !== '' ? Date.parse($('#advUploadUntil').val()) / 1000 : '',
        tags: $('#advTags').val(),
        per_page: 10
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
    closeModal();

    flickr.photos.search(options, function(err, result) {
        if (err) {
            handleError(err);
        } else {
            console.log(result);
        }
    });
}

/* HELPER METHODS */

function closeModal() {
    $('#searchModal').modal('hide');
}


function handleError(err) {
    console.log("ERROR: " + err);
    closeModal();
}
