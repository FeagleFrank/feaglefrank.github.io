$(function(){
    $(window).on('scroll',{
        previousTop: 0
    },function(){
        var currentTop = $(window).scrollTop();
        if(currentTop > this.previousTop){
            $('.navbar').addClass('not-visible');
        } else {
            $('.navbar').removeClass('not-visible');
        }
        if(currentTop < 80){
            $('.navbar').removeClass('navbar-inverse');
            $('.navbar').addClass('navbar-default');
        } else {
            $('.navbar').addClass('navbar-inverse');
            $('.navbar').removeClass('navbar-default');
        }
        this.previousTop = currentTop;
    });
});