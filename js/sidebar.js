function igniteGUI(params) {

    let groups = $('#sidebar li.group');
    let group_button = $('.group-button');
    let animateTime = 10; //ms
    let material = $('.material');
    let collapse = $('.collapse');


    // group_button.mousedown(function (e) {
    //     group.toggleClass("open");
    //     console.log("open");
    // });

    // group.each(function (i) {
    group_button.mousedown(function (e) {
        e.stopPropagation();
        e.stopImmediatePropagation();
        let parent = $(this).parent();
        parent.toggleClass('open');
        console.log("open");
        if (parent.is('.open')) {
            autoHeightAnimate(parent, animateTime);
        } else {
            parent.stop().animate({ height: '50' }, animateTime);
        }
    });

    material.mousedown(function (e) {
        let parent = $(this).parent();
        parent.children().each(function (e) {
            $(this).removeClass("set");
        });
        e.stopPropagation();
        e.stopImmediatePropagation();
        $(this).toggleClass("set");
    });


    collapse.mousedown(function (e) {
        groups.each(function (e) {
            $(this).removeClass("open").stop().animate({ height: '50' }, animateTime);
        })
    });

    // });
    interact();
}

/* Function to animate height: auto */
function autoHeightAnimate(element, time) {
    var curHeight = element.height(), // Get Default Height
        autoHeight = element.css('height', 'auto').height(); // Get Auto Height
    element.height(curHeight); // Reset to Default Height
    element.stop().animate({ height: autoHeight }, time); // Animate to Auto Height
}
