(function ($) {
    "use strict";

    $(document).ready(function () {
        /*--------POS Nav with Submenu----------*/
        var posHasSub = $(".fk-pos-nav__list-has-sub");
        var posSub = $(".fk-pos-nav__sub");

        $(".fk-pos-nav__list-has-sub > a").on("click", function (e) {
            e.preventDefault();
        });
        posHasSub.on("click", function () {
            $(this).find(posSub).slideDown();
            $(this).siblings().find(posSub).slideUp();
            $(this).addClass("active").siblings().removeClass("active");
        });

        /*--------POS Nav with Submenu End----------*/

        /*--------Calculator Toggle----------*/
        var calculatorToggler = $('.fk-calculator-toggle');
        calculatorToggler.on("click", function() {
            $(".calculator").toggleClass("active");
        })
        /*--------Calculator Toggle End----------*/

        /*--------Feather Icon----------*/
        feather.replace();
        /*--------Feather Icon End----------*/

        /*--------Quantity Add/Deduct----------*/
        $(".fk-qty__add").on("click", function () {
            var $qty = $(this).closest(".fk-qty").find(".fk-qty__input");
            var currentVal = parseInt($qty.val());
            if (!isNaN(currentVal)) {
                $qty.val(currentVal + 1);
            }
        });
        $(".fk-qty__deduct").on("click", function () {
            var $qty = $(this).closest(".fk-qty").find(".fk-qty__input");
            var currentVal = parseInt($qty.val());
            if (!isNaN(currentVal) && currentVal > 0) {
                $qty.val(currentVal - 1);
            }
        });
        /*--------Quantity Add/Deduct End----------*/

        /*-------Navigation Toggle-----------*/
        var navIcon = $(".fk-phn-nav__icon");
        var navMenu = $(".fk-phn-nav__menu");
        navIcon.on("click", function () {
            navMenu.toggleClass("active");
        });
        /*-------Navigation Toggle end-------*/

        /*----------Dgigital Clock-----------*/
        function showTime() {
            var date = new Date();
            var h = date.getHours(); // 0 - 23
            var m = date.getMinutes(); // 0 - 59
            var s = date.getSeconds(); // 0 - 59
            var session = "AM";

            if (h == 0) {
                h = 12;
            }

            if (h > 12) {
                h = h - 12;
                session = "PM";
            }

            h = h < 10 ? "0" + h : h;
            m = m < 10 ? "0" + m : m;
            s = s < 10 ? "0" + s : s;

            var time = h + ":" + m + ":" + s + " " + session;

            document.getElementById("MyClockDisplay").innerText = time;
            document.getElementById("MyClockDisplay").textContent = time;

            setTimeout(showTime, 1000);
        }

        showTime();
        /*----------Dgigital Clock End-----------*/

        /*-----Select---------*/
        $(".fk-select").select2();
        /*-----Select End---------*/

        

        /*----Enable Bootstrap Tooltip and Popover-------*/
        $('[data-toggle="tooltip"]').tooltip();
        $('[data-toggle="popover"]').popover();
        /*----Enable Bootstrap Tooltip and Popover End-------*/

        /*-----Mobile Nav Active Toggle---------*/
        var mobileNav = $(".fk-sm-nav__list");
        mobileNav.on("click", function () {
            $(this).addClass("active").siblings().removeClass("active");
        });
        /*-----Mobile Nav Active Toggle End---------*/
        
    });
})(jQuery);



