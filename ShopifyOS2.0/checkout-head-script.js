function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

var getCookieisAdultProducts = getCookie('is_adult_products') ? getCookie('is_adult_products') : null;

if (getCookieisAdultProducts != null) {
    var caseTypeckeck = false;
    var collectionisAdultProducts = getCookie('is_adult_products').split(',');
    var checkoutProductIDs = theme.ageVerification.Checkoutproducts;

    checkoutProductIDs.map(function(id) {
        var caseType = collectionisAdultProducts.includes(id.toString());
        if (caseType) {
            caseTypeckeck = caseType;
        }
    });

    if (caseTypeckeck) {
        window.addEventListener('DOMContentLoaded', function() {
            var shopifySectionCheckout = document.querySelector("#shopify-section-checkout");
            shopifySectionCheckout.style.opacity = 0;

            if (Shopify.Checkout.step === 'payment_method') {
                var GatewayOne = document.querySelector('[data-select-gateway="72110997693"]') ? document.querySelector('[data-select-gateway="72110997693"]') : null;
                var GatewayTwo = document.querySelector('[data-select-gateway="73208398013"]') ? document.querySelector('[data-select-gateway="73208398013"]') : null;
                var GatewayThree = document.querySelector('[data-select-gateway="73477521597"]') ? document.querySelector('[data-select-gateway="73477521597"]') : null;
                var GatewayFour = document.querySelector('[data-select-gateway="74930225341"]') ? document.querySelector('[data-select-gateway="74930225341"]') : null;
                var GatewayFive = document.querySelector('[data-select-gateway="73477652669"]') ? document.querySelector('[data-select-gateway="73477652669"]') : null;

                if (GatewayOne != null) {
                    GatewayOne.style.display = "none";
                }
                if (GatewayTwo != null) {
                    GatewayTwo.style.display = "none";
                }
                if (GatewayThree != null) {
                    GatewayThree.style.display = "none";
                }
                if (GatewayFour != null) {
                    GatewayFour.style.display = "none";
                }
                if (GatewayFive != null) {
                    GatewayFive.style.display = "none";
                }
            }
        });
    }
}