$(document).ready(function () {
    //grab scraped articles
    $.getJSON("/articles", function (data) {
        if (!data[0]) {
            $("#notice").show();
        } else {
            $("#notice").hide();
            for (let i = 0; i < data.length; i++) {
                if (data[i].saved === true) {
                    $("#results").append(`
                <div class='card' data-id='${data[i]._id}'>
                <h5 class='card-header'>${data[i].title}</h5>
                <div class="card-body">
                <button class="btn btn-warning" id="delButton" data-id='${data[i]._id}'>Delete From Saved</button>

                <script>
                $(function () {
                    $('[data-toggle="popover"]').popover(
        
                    )
                })
            </script>
   
                <button class="btn btn-info" data-html="true" data-title="Note to This Article" id="notesButton" data-toggle="popover" data-placement="right" data-content='
                <form id="userNotes">
                    <div class="form-group">
                       
                        <input id=" titleinput" name="title" placeholder="Title">
         <textarea id="bodyinput" name="body" placeholder="Write your note"></textarea>
         <button data-id="${data[i]._id}" id="saveNote">Save Note</button>
         </div>
         </form>'>Write Your Note</button>

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
            type: "PUT",
            url: "articles/delete/" + thisId,
            data: {
                _id: thisId
            },
        }).then(function (data) {
            // $(['data-id=thisId']).hide()
            location.reload();
            return false;
        });
    });

    // Saving Notes
    $(document).on("click", "#saveNote", function () {
        // Grab the id associated with the article from the submit button
        var thisId = $(this).attr("data-id");
        // Run a POST request to change the note, using what's entered in the inputs
        $.ajax({
                method: "POST",
                url: "/articles/" + thisId,
                data: {
                    title: $("#titleinput").val(),
                    // Value taken from note textarea
                    body: $("#bodyinput").val()
                }
            })
            .then(function (data) {
                console.log(data);
                $("#notes").empty();
            });

        $("#titleinput").val("");
        $("#bodyinput").val("");
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