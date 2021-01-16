$('document').ready(function () {

    let group_button = $('#sidebar li .group-button');
    let group = $('#sidebar li .group-button');
    let animateTime = 10; //ms

    // group_button.mousedown(function (e) {
    //     group.toggleClass("open");
    //     console.log("open");
    // });

    group.each(function (i) {
        $(this).mousedown(function (e) {
            let parent = $(this).parent();
            parent.toggleClass('open');
            // $(this).slideDown(2000); 
            if (parent.is('.open')) {
                autoHeightAnimate(parent, animateTime);
            } else {
                parent.stop().animate({ height: '50' }, animateTime);
            }
        });

    });


});

/* Function to animate height: auto */
function autoHeightAnimate(element, time) {
    var curHeight = element.height(), // Get Default Height
        autoHeight = element.css('height', 'auto').height(); // Get Auto Height
    element.height(curHeight); // Reset to Default Height
    element.stop().animate({ height: autoHeight, easing: "ease" }, time); // Animate to Auto Height
}
