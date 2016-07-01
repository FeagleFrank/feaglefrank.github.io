$(function(){
    $(window).on('scroll',{
        previousTop: 0
    },function(){
        var currentTop = $(window).scrollTop();
        if(currentTop > this.previousTop){
            $('.navbar').addClass('is-visible');
        } else {
            $('.navbar').removeClass('is-visible');
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