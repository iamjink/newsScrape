$(document).ready(function () {

    //grab scraped articles
    $.getJSON("/articles", function (data) {
        if (data) {
            $("#notice").hide();

            for (let i = 0; i < data.length; i++) {
                if (data[i].saved === true) {
                    $("#results").append(`
                <div class='card' data-id='${data[i]._id}'>
                <h5 class='card-header'>${data[i].title}</h5>
                <div class="card-body">
                <button class="btn btn-warning" id="delButton" data-id='${data[i]._id}'>Delete From Saved</button>
                <button class="btn btn-info" id="notesButton" data-id='${data[i]._id}'>Article Notes</button>
                </div>
                </div>`)
                }

            };
        }
    });


    //delete articles
    $(document).on("click", "#delButton", function () {
        var thisId = $(this).attr("data-id");
        $.ajax({
            type: "POST",
            url: "articles/delete",
            data: {
                _id: thisId
            },
        }).then(function (data) {
            location.reload();
            return false;
        });
    });

    //clear all articles
    $(document).on("click", "#clear", function () {
        var thisId = $(this).attr("data-id");
        $.ajax({
            type: "PUT",
            url: "articles/clear",
            data: {
                _id: thisId
            }
        }).then(function (data) {
            location.reload();
            return false;
        });
    });

});