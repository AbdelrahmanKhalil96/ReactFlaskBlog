//chat Popup
(function ($) {
    $(document).ready(function () {
        var $chatbox = $('.chatbox'),
            $chatboxTitle = $('.chatbox__title'),
            $chatboxTitleClose = $('.chatbox__title__close'),
            $chatboxCredentials = $('.chatbox__credentials');
        $chatboxTitle.on('click', function () {
            $chatbox.toggleClass('chatbox--tray');
        });
        $chatboxTitleClose.on('click', function (e) {
            e.stopPropagation();
            $chatbox.addClass('chatbox--closed');
        });
        $chatbox.on('transitionend', function () {
            if ($chatbox.hasClass('chatbox--closed')) $chatbox.remove();
        });
    });
})(jQuery);
//-----------------
//Rating Stars and get value of rating
$('#star1').starrr({
    rating: 1,
    change: function (e, value) {
        if (value) {
            $('.your-choice-was').show();
            $('.choice').text(value);
            var v = $('#hInput').val().split(",");
            v[v.length - 1] = value;
            $('#hInput').val(v);
            console.log($('#hInput').val())
        } else {
            $('.your-choice-was').hide();
        }
    }
});
//-----------------
//ajax and draw both request and output in chat
function getBotResponse() {
    $('#th').hide();
    $('#ple').show();
    var humandata = $("#btn-input").val();
    var userHtml = '<div class="chatbox__body__message chatbox__body__message--right"><div class="clearfix"></div><div class="ul_section_full"><ul class="ul_msg"><li><strong>Me</strong></li><li>' + humandata + '</li></ul><div class="clearfix"></div></div></div></div>'
    $("#btn-input").val('');
    $("#chat_body").append(userHtml);
    //document.getElementById('userInput').scrollIntoView({block: 'start', behavior: 'smooth'});
    req = $.ajax({
        type: "POST",
        url: '/chat',
        data: JSON.stringify(humandata),
        dataType: 'json'
    }).done(function (data) {
        lo = data['response'].replace(/'/g, '').replace('[', '').replace(']', '').split(",");
        console.log(lo);

        var i = 0;                  //  set your counter to 1

        function myLoop() {         //  create a loop function
            setTimeout(function () {   //  call a 3s setTimeout when the loop is called
                //  increment the counter
                if (i < lo.length) {           //  if the counter < 10, call the loop function
                    var botHtml = '<div class="chatbox__body__message chatbox__body__message--left"><img src="https://www.gstatic.com/webp/gallery/2.jpg" alt="Picture"><div class="clearfix"></div><div class="ul_section_full"><ul class="ul_msg"><li><strong>bot</strong></li><li>' + lo[i] + '</li></ul><div class="clearfix"></div></div></div></div>'
                    $("#chat_body").append(botHtml);
                    var objDiv = document.getElementById("chat_body");
                    objDiv.scrollTop = objDiv.scrollHeight;
                    myLoop();             //  ..  again which will trigger another
                }
                i++;                      //  ..  setTimeout()
            }, 500)
        }

        myLoop();

        var v = $('#hInput').val().split(",");
        v[0] = humandata;
        v[1] = lo
        console.log(v)
        $('#hInput').val(v);
        $("#rate").click();
    });
}
//-----------------
//trigger ajax function by button or press return
$("#btn-chat").click(getBotResponse)
$("#btn-input").keypress(function (e) {
    if ((e.which == 13) && document.getElementById("btn-input").value != "") {
        console.log('en');

        $("#btn-chat").click()

    }
});
//-----------------
//send final data to db
function sendEdit() {
    var rd = $('#hInput').val();
    $('#hInput').val('user,bot,1');
    console.log(rd)
    req = $.ajax({
        type: "POST",
        url: '/SaveChat',
        data: JSON.stringify(rd),
        dataType: 'json'
    }).done(function (data) {
        $('#th').show();
        $('#ple').hide();
        console.log(data);
        setTimeout(function () {
            $('#exampleModal').modal('hide');
            $('.your-choice-was').hide();
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();
            $("#clmodal").click();
        }, 2000);
    });


};
//-----------------