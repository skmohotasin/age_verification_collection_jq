theme.Modals = (function() {
    function Modal(id, name, options) {
        var defaults = {
            close: '.js-modal-close',
            open: '.js-modal-open-' + name,
            openClass: 'modal--is-active',
            closingClass: 'modal--is-closing',
            bodyOpenClass: 'modal-open',
            bodyOpenSolidClass: 'modal-open--solid',
            bodyClosingClass: 'modal-closing',
            closeOffContentClick: false
        };

        this.id = id;
        this.modal = document.getElementById(id);

        if (!this.modal) {
            return false;
        }

        this.modalContent = this.modal.querySelector('.modal__inner');

        this.config = Object.assign(defaults, options);
        this.modalIsOpen = false;
        this.focusOnOpen = this.config.focusIdOnOpen ? document.getElementById(this.config.focusIdOnOpen) : this.modal;
        this.isSolid = this.config.solid;

        this.init();
    }

    Modal.prototype.init = function() {
        document.querySelectorAll(this.config.open).forEach(btn => {
            btn.setAttribute('aria-expanded', 'false');
            btn.addEventListener('click', this.open.bind(this));
        });

        this.modal.querySelectorAll(this.config.close).forEach(btn => {
            btn.addEventListener('click', this.close.bind(this));
        });

        // Close modal if a drawer is opened
        document.addEventListener('drawerOpen', function() {
            this.close();
        }.bind(this));
    };

    Modal.prototype.open = function(evt) {
        // Keep track if modal was opened from a click, or called by another function
        var externalCall = false;

        // don't open an opened modal
        if (this.modalIsOpen) {
            return;
        }

        // Prevent following href if link is clicked
        if (evt) {
            evt.preventDefault();
        } else {
            externalCall = true;
        }

        // Without this, the modal opens, the click event bubbles up to $nodes.page
        // which closes the modal.
        if (evt && evt.stopPropagation) {
            evt.stopPropagation();
            // save the source of the click, we'll focus to this on close
            this.activeSource = evt.currentTarget.setAttribute('aria-expanded', 'true');
        }

        if (this.modalIsOpen && !externalCall) {
            this.close();
        }

        this.modal.classList.add(this.config.openClass);

        document.documentElement.classList.add(this.config.bodyOpenClass);

        if (this.isSolid) {
            document.documentElement.classList.add(this.config.bodyOpenSolidClass);
        }

        this.modalIsOpen = true;

        theme.a11y.trapFocus({
            container: this.modal,
            elementToFocus: this.focusOnOpen,
            namespace: 'modal_focus'
        });

        document.dispatchEvent(new CustomEvent('modalOpen'));
        document.dispatchEvent(new CustomEvent('modalOpen.' + this.id));

        this.bindEvents();
    };

    Modal.prototype.close = function(evt) {
        // don't close a closed modal
        if (!this.modalIsOpen) {
            return;
        }

        // Do not close modal if click happens inside modal content
        if (evt) {
            if (evt.target.closest('.js-modal-close')) {
                // Do not close if using the modal close button
            } else if (evt.target.closest('.modal__inner')) {
                return;
            }
        }

        // deselect any focused form elements
        document.activeElement.blur();

        this.modal.classList.remove(this.config.openClass);
        this.modal.classList.add(this.config.closingClass);

        document.documentElement.classList.remove(this.config.bodyOpenClass);
        document.documentElement.classList.add(this.config.bodyClosingClass);

        window.setTimeout(function() {
            document.documentElement.classList.remove(this.config.bodyClosingClass);
            this.modal.classList.remove(this.config.closingClass);
            if (this.activeSource && this.activeSource.getAttribute('aria-expanded')) {
                this.activeSource.setAttribute('aria-expanded', 'false').focus();
            }
        }.bind(this), 500); // modal close css transition

        if (this.isSolid) {
            document.documentElement.classList.remove(this.config.bodyOpenSolidClass);
        }

        this.modalIsOpen = false;

        theme.a11y.removeTrapFocus({
            container: this.modal,
            namespace: 'modal_focus'
        });

        document.dispatchEvent(new CustomEvent('modalClose.' + this.id));

        this.unbindEvents();
    };

    Modal.prototype.bindEvents = function() {
        window.on('keyup.modal', function(evt) {
            if (evt.keyCode === 27) {
                this.close();
            }
        }.bind(this));

        if (this.config.closeOffContentClick) {
            // Clicking outside of the modal content also closes it
            this.modal.on('click.modal', this.close.bind(this));
        }
    };

    Modal.prototype.unbindEvents = function() {
        document.documentElement.off('.modal');

        if (this.config.closeOffContentClick) {
            this.modal.off('.modal');
        }
    };

    return Modal;
})();

function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

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

function eraseCookie(name) {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function updateCookie(name, value, days) {
    var getcookie = getCookie(name);
    if (getcookie != null) {
        getcookie += ',' + value.toString();
        var uniquegetcookie = Array.from(new Set(getcookie.split(','))).toString();
        setCookie(name, uniquegetcookie, days);
    } else {
        setCookie(name, value, days);
    }
    return null;
}

window.addEventListener('DOMContentLoaded', function() {
    var CookieValue = 'no',
        CookieValueProduct = theme.ageVerification.product,
        YesButton = document.querySelector('.av_yes'),
        NoButton = document.querySelector('.av_no'),
        modalContentWrapper = document.querySelector('#modal_content_wrapper'),
        modalRegretWrapper = document.querySelector('#modal_regret_wrapper'),
        CurrentCookie = 'no',
        days = theme.ageVerification.days,
        delay = theme.ageVerification.delay,
        modal = new theme.Modals('age-verification-modal');

    YesButton.addEventListener("click", function(e) {
        e.preventDefault();
        CookieValue = 'yes';
        setCookie('is_adult', CookieValue, days);
        updateCookie('is_adult_products', CookieValueProduct, 1);
        modal.close();
    }, false);

    NoButton.addEventListener("click", function(e) {
        e.preventDefault();
        CookieValue = 'no';
        setCookie('is_adult', CookieValue, days);
        modalContentWrapper.style.display = "none";
        modalRegretWrapper.style.display = "block";
    }, false);

    CurrentCookie = getCookie('is_adult') ? getCookie('is_adult') : null;

    setTimeout(function() {
        if (CurrentCookie == null || days == 0) {
            setCookie('is_adult', CookieValue, days);
            modal.open();
        } else {
            if (CurrentCookie == 'no') {
                modal.open();
            }
        }
    }, delay);
});