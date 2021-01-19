
let menu = $('#menu_container'),
    sidebar_container = $('#sidebar_container'),
    sidebar = $('#sidebar'),
    canvas_container = $('.canvas-container'),
    open = true,
    mobile = false,
    scroll = 0,
    previousScroll = 0;

$("#menu_container, #sidebar h2").mousedown(function (e) {
    if (e.which === 1) {
        interact();
    }
});

$('#home-container ul li').on('dragstart', function (event) {
    event.preventDefault();
});

$("#home-container ul li").each(function (i) {
    $(this).click(function (e) {
        if (e.which === 1) {
            $(this).toggleClass("active");
            $('#home-container ul li').not(this).addClass('hide');
            $('#home-container').addClass('active');


        }
    });
});


function interact() {
    menu.toggleClass('active');
    sidebar.toggleClass('open');
    sidebar_container.toggleClass('open');
    canvas_container.toggleClass('open');
    $('#menu_container').removeClass("hidden");
    open = !open;
}

//   -------------   MOBILE-------------------
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    $('#sidebar ul li').mousedown(function (e) {
        e.preventDefault();

    });
    mobile = true;
    setTimeout(function () {
        $('#main_menu_alert').addClass("active");
    }, 4000);

}
else {
    $("#sidebar ul #home").add("#sidebar ul #about").mousedown(function (e) {
        if (e.which === 1) {
            interact();
        }
    });
}

$('#scroll-top').on('click', function () {

    $('html, body').animate({
        scrollTop: 0
    }, 'medium');

    return false;

});
