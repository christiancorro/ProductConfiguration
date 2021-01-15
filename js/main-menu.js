$('document').ready(function () {
    var menu = $('#menu_container'),
        sidebar_container = $('#sidebar_container'),
        sidebar = $('#sidebar'),
        canvas = $('.canvas-container'),
        open = true,
        mobile = false,
        scroll = 0,
        previousScroll = 0;

    $("#menu_container, #sidebar h2").mousedown(function (e) {
        if (e.which === 1) {
            interact();
        }
    });

    //      fadeout effect HOME


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
        canvas.toggleClass('open');
        $('#menu_container').removeClass("hidden");
        open = !open;
    }



    //      DROPWDOWN CONENT

    var Home = $('#drop_home'),
        Luoghi = $('#drop_luoghi'),
        Formazioni = $('#drop_home'),
        Armamaneti = $('#drop_home'),
        Vita = $('#drop_home'),
        Documenti = $('#drop_home'),
        About = $('#drop_home');

    var hover = false;
    $("#sidebar ul li a").each(function (i) {

        var side_id = $(this).attr("id");

        $(this).add("#drop_" + side_id).mouseover(function () {
            hover = true;
            if (hover) {
                $("#drop_" + side_id).addClass("visible");
                $("#" + side_id).addClass("active");
            }
        }).mouseout(function () {
            $("#drop_" + side_id).removeClass("visible");
            $("#" + side_id).removeClass("active");
            hover = false;
        });
    });

    if ($(window).width() < 670) {
        mobile = true;
        $('#main_menu_alert').addClass('active');
    } else {
        $('#main_menu_alert').removeClass('active');
        mobile = false;
    }
    $(window).resize(function () {
        if ($(window).width() < 670) {
            $('#main_menu_alert').addClass('active');

            mobile = true;
        } else {
            if (scroll < 250) $('#main_menu_alert').removeClass('active');
            mobile = false;
            $('#menu_container').removeClass("hidden");
        }

    });


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

    $(document).scroll(function () {
        ;
        scroll = $(document).scrollTop();
        if ((scroll > 250) & !mobile) {
            $('#main_menu_alert').addClass("active");
        } else if (!mobile) $('#main_menu_alert').removeClass("active");
        if (mobile & !open) {
            var scroll = $(this).scrollTop();
            if (scroll > previousScroll) {
                $('#menu_container').addClass("hidden");

            } else {
                $('#menu_container').removeClass("hidden");
            }
            previousScroll = scroll;
        }
    });
    //     end 
});
