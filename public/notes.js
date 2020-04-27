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

                <script>
                $(function () {
                    $('[data-toggle="popover"]').popover()
                })
            </script>
   
            <button id="notesButton" data-toggle="popover" data-placement="right"
            data-content='
                       <form id="userNotes"> <h2>" + ${data[i].title} + "</h2>
                           <div class="form-group">
                              
                               <input id='titleinput' name='title' >
                               <textarea id='bodyinput' name='body'></textarea>
                               <button data-id='${data[i]._id}' id='savenote'>Save Note</button>
                           </div>
                       </form>' class="notes">Write Your Note</button>

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


    $(document).on("click", "#notesButton", function() {
        // Empty the notes from the note section
        $("#notes").empty();
        // Save the id from the p tag
        var thisId = $(this).attr("data-id");
      
        // Now make an ajax call for the Article
        $.ajax({
          method: "GET",
          url: "/articles/" + thisId
        })
          // With that done, add the note information to the page
          .then(function(data) {
            console.log(data);
           
            if (data.note) {
              // Place the title of the note in the title input
              $("#titleinput").val(data.note.title);
              // Place the body of the note in the body textarea
              $("#bodyinput").val(data.note.body);
            }
          });
      });

    //clear all articles
//     $(document).on("click", "#clear", function () {
//         var thisId = $(this).attr("data-id");
//         $.ajax({
//             type: "PUT",
//             url: "articles/clear",
//             data: {
//                 _id: thisId
//             }
//         }).then(function (data) {
//             location.reload();
//             return false;
//         });
//     });

});