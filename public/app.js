$(document).ready(function () {

    //grab scraped articles
    $.getJSON("/articles", function (data) {
        if (data[0]) {
            $("#notice").hide();

            for (let i = 0; i < data.length; i++) {
                if (data[i].saved === false) {
                    $("#results").append(`
                <div class='card' data-id='${data[i]._id}'>
                <h5 class='card-header'>${data[i].title}</h5>
                <div class="card-body">
                <button class="btn btn-warning" id="saveButton" data-id='${data[i]._id}'>Save Article</button>
                <a href="${data[i].link}}" class="btn btn-info">Go to article</a>
                </div>
                </div>`)
                }

            };
        }
    });

    //save article button
    $(document).on("click", "#saveButton", function () {

        var thisId = $(this).attr("data-id");

        $.ajax({
            type: "PUT",
            url: "articles/" + thisId
        }).then(function (data) {
            location.reload();
            return false;
        });
    });

    //clear articles
    // $(document).on("click", "#clear", function () {

    //     $.ajax({
    //         type: "PUT",
    //         url: "articles/clear"
    //     }).then(function (data) {
    //         location.reload();
    //         return false;
    //     });
    // });


});

