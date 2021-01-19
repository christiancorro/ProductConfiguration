let menu = $('#menu_container'),
    sidebar_container = $('#sidebar_container'),
    sidebar = $('#sidebar'),
    canvas_container = $('.canvas-container'),
    open = true,
    mobile = false,
    scroll = 0,
    previousScroll = 0;


function interact() {
    menu.toggleClass('active');
    sidebar.toggleClass('open');
    sidebar_container.toggleClass('open');
    canvas_container.toggleClass('open');
    $('#menu_container').removeClass("hidden");
    open = !open;
}
