var modal_content,
	modal_screen;

// Start Working ASAP.
$(document).ready(function() {
   function show_modal(){
       av_legality_check();
      }
   window.setTimeout(show_modal, {{ settings.age_verification_delay | times:1000 }}); // delay before it calls the modal function
});

var JQ = jQuery.noConflict();
av_legality_check = function() {
  if (typeof JQ.cookie('is_legal') === 'undefined'){
  av_showmodal();
    // Make sure the prompt stays in the middle.
    $(window).on('resize', av_positionPrompt);
  } else {
   if (JQ.cookie('is_legal') == "yes") {
      // legal!
      // Do nothing?
    } else {
      av_showmodal();
      // Make sure the prompt stays in the middle.
      $(window).on('resize', av_positionPrompt);
    }
  }
};

av_showmodal = function() {
  modal_screen = $('<div id="modal_screen"></div>');
  modal_content = $('<div id="modal_content" style="display:none"></div>');
  var modal_content_wrapper = $('<div id="modal_content_wrapper" class="content_wrapper"></div>');
  var modal_regret_wrapper = $('<div id="modal_regret_wrapper" class="content_wrapper" style="display:none;"></div>');

  // Question Content
  var content_heading = $('<h2>{{ settings.age_verification_title | escape }}</h2>');
  var content_buttons = $('<nav><ul><li><a href="#nothing" class="av_btn av_go" rel="yes">Yes</a></li><li><a href="#nothing" class="av_btn av_no" rel="no">No</a></li></nav>');
  var content_text = $('{{ settings.age_verification_body }}');

  // Regret Content
  var regret_heading = $('<h2>{{ settings.age_verification_no_title | escape }}</h2>');
  var regret_text = $('<nav><ul><li><a href="{% if settings.age_verification_no_btn_link != blank %}{{ settings.age_verification_no_btn_link }}{% else %}#nothing{% endif %}" class="av_btn av_no" rel="go">{{ settings.age_verification_no_btn | escape }}</a></li></ul></nav>');
  var regret_buttons = $('{{ settings.age_verification_no_body }}<br>');

  modal_content_wrapper.append(content_heading, content_buttons, content_text);
  modal_regret_wrapper.append(regret_heading, regret_buttons, regret_text);
  modal_content.append(modal_content_wrapper, modal_regret_wrapper);

  // Append the prompt to the end of the document
  $('body').append(modal_screen, modal_content);

  // Center the box
  av_positionPrompt();

  modal_content.find('a.av_btn').on('click', av_setCookie);
};

av_setCookie = function(e) {
  e.preventDefault();
  
  var is_legal = $(e.currentTarget).attr('rel');
  
  JQ.cookie('is_legal', is_legal, {
    expires: {{ settings.age_verification_return }},
    path: '{{ settings.age_verification_collection }}'
  });

  if (is_legal == "yes") {
    av_closeModal();
    $(window).off('resize');
  } else if (is_legal == "no") {
    av_showRegret();
  }
  else {
    window.location = this.href;
  }
};

av_closeModal = function() {
  modal_content.fadeOut();
  modal_screen.fadeOut();
};

av_showRegret = function() {
  modal_screen.addClass('nope');
  modal_content.find('#modal_content_wrapper').hide();
  modal_content.find('#modal_regret_wrapper').show();
};

av_positionPrompt = function() {
  var top = ($(window).outerHeight() - $('#modal_content').outerHeight()) / 2;
  var left = ($(window).outerWidth() - $('#modal_content').outerWidth()) / 2;
  modal_content.css({
    'top': top,
    'left': left
  });

  if (modal_content.is(':hidden') && (JQ.cookie('is_legal') != "yes")) {
    modal_content.fadeIn('slow')
  }
};
