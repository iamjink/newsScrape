$(document).ready(function () {

    //grab scraped articles
    $.getJSON("/articles", function (data) {
        if (data) {
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
        alert(thisId);

        $.ajax({
            method: "PUT",
            url: "articles/" + thisId,
            data: {
                saved: true
            }
        }).then(function (data) {
            console.log('saved');

        });
    })
})