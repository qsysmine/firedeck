(function() {
  var iN = 0;
  window.initEditor = function() {
    $('#presentBtn').removeAttr("disabled");
    $('#mainDash').slideUp(300);
    $('#mainEdit').slideDown(300);
    $('#sL').html("");
    if (window.history && window.history.pushState) {
      window.history.pushState('forward', null, './#editor');
      $(window).on('popstate', function(e) {
        console.log(e);
        $(window).off('popstate');
        unInitEditor();
        clearInterval(iN);
      });
    }
  };
  window.unInitEditor = function() {
    $('#mainDash').slideDown(300);
    $('#mainEdit').slideUp(300);
  };
  window.editPresentation = function(isNew, arg2) {
    var key = "";
    var name = "";
    if (isNew) {
      var nName = arg2;
      var ref = fb.child("presentations/" + fb.getAuth().uid).push({
        name: nName
      });
      var refSK = ref.child("slides/content").push({
        contents: "<h1>An Excellent Slideshow</h1> <p>By " + fb.getAuth().google.displayName + "</p>"
      }).key();
      ref.child("order").set([
        [refSK, "content"]
      ]);
      name = nName;
      key = ref.key();
      var ref2 = fb.child("users/" + fb.getAuth().uid + "/presentations");
      ref2.child(key).set({
        name: name
      });
    } else {
      key = arg2;
    }

    $('#presentBtn').attr("href", "./present#" + key);
    var presentation = fb.child("presentations/" + fb.getAuth().uid + "/" + key);
    var currentSlide = 0;
    var order = [];
    var renderList = function() {
      $('#sL').html("");
      for (var i in order) {
        var op = order[i][1] == "content" ? "contents" : "query";
        $('#sL').append("<li class=\"list-item slideCl\" data-slide=\"i\">" + (currentSlide == i ? "<b>" : "") + $(presData.slides[order[i][1]][order[i][0]][op]).filter('div').get(0).innerText + (currentSlide == i ? "<b>" : "") + "<span class=\"badge deleter\"></li>");
      }
    };
    var saveSlide = function(sN, cB) {
      $('span#loading').text("Saved.");
      $('span#loading').show();
      $('span#loading').fadeOut(1000);
      var slC = quill.getHTML();
      var slide = fb.child("presentations/" + fb.getAuth().uid + "/" + key + "/slides/" + order[sN][1] + "/" + order[sN][0]);
      if (order[sN][1] == "content") {
        slide.update({
          "contents": slC
        }, cB);
        presData.slides[order[sN][1]][order[sN][0]].contents = slC;
      } else if (order[sN][1] == "questions") {
        slide.update({
          "query": slC
        }, cB);
        presData.slides[order[sN][1]][order[sN][0]].query = slC;
      }
      renderList();
    };
    iN = setInterval(function() {
      saveSlide(currentSlide);
    }, 10000);
    $('#newSlide').click(function() {
      _modal({
        "title": "New Slide",
        "body": "<div class=\"form-group\"><select id=\"type\" class=\"btn btn-default form-control\"><option value=\"content\">Informational</option><option value=\"questions\">Inquisitive</option></select></div>",
        "footer": "<span class=\"btn btn-success\" id=\"newSlideB\">Create</span>."
      });
      $('#newSlideB').click(function() {
        $('#newSlideB').off("click");
        currentSlide = order.length;
        var objToPush = {};
        if ($('#type').val() == "questions") {
          objToPush.query = "<div><span style=\"font-size: 56px;\"><span style=\"font-family: Montserrat, sans-serif;\"><b>Title.</b></span></span></div><span style=\"font-size: 45px;\"><span style=\"font-family: Roboto, sans-serif;\">Subtitle.</span></span><div>";
        } else {
          objToPush.contents = "<div><span style=\"font-size: 56px;\"><span style=\"font-family: Montserrat, sans-serif;\"><b>Title.</b></span></span></div><span style=\"font-size: 45px;\"><span style=\"font-family: Roboto, sans-serif;\">Subtitle.</span></span><div>";
        }
        var nSRef = fb.child("presentations/" + fb.getAuth().uid + "/" + key + "/slides/" + $('#type').val()).push(objToPush);
        var nSKey = nSRef.key();
        order.push([nSKey, $('#type').val()]);
        presData.slides[$('#type').val()][nSKey] = objToPush;
        quill.setHTML(objToPush[$('#type').val() == "questions" ? "query" : "contents"]);
        fb.child("presentations/" + fb.getAuth().uid + "/" + key + "/order").set(order);
        var sN = currentSlide + 1;
        $('#currentSlide').text("Slide " + sN);
        renderList();
        _modal({
          "close": "true"
        });
      });
    });
    $('.delSlide').click(function() {
      var stype = order[currentSlide][1];
      var skey = order[currentSlide][0];
      fb.child("presentations/" + fb.getAuth().uid + "/" + key + "/slides/" + stype + "/" + skey).remove();
      delete presData.slides[stype][skey];
      delete order[currentSlide];
      renderList();
      currentSlide--;
      if (currentSlide + 1 < order.length - 1) {
        for (var i = currentSlide + 1; i < order.length; i++) {
          if (order[i] != undefined) {
            order[i - 1] = order[i];
          }
        }
      }
      order.pop();
      fb.child("presentations/" + fb.getAuth().uid + "/" + key + "/order").set(order);
      quill.setHTML(presData.slides[order[currentSlide][1]][order[currentSlide][0]][currentSlide[1] == "content" ? "contents" : "query"]);
      console.log(order);
    });
    var sessionLock = false;
    var slidesLoadedOnce = false;
    var presData = {};
    presentation.once("value", function(s) {
      console.log(currentSlide);
      presData = s.val();
      name = presData.name;
      $('.presName').text(name);
      order = presData.order;
      console.log(presData.order);
      if (iN != 0) {
        clearInterval(iN);
      }
      var slideKey = order[0][0];
      var slideType = order[0][1];
      renderList();
      var slide = presData.slides[slideType][slideKey];
      var sD = null;
      sD = slide;
      console.log(sD);
      if (slideType == "questions") {
        quill.setHTML(sD.query)
      } else if (slideType == "content") {
        quill.setHTML(sD.contents);
      }
    });

    quill.on("selection-change", function(range) {
      if (range == null) {
        saveSlide(currentSlide);
      }
    });
    $(window).on('popstate', function(e) {
      console.log(e);
      saveSlide(currentSlide);
      $(window).off('popstate');
      unInitEditor();
      clearInterval(iN);
    });

    $('#nextSlide').click(function() {
      saveSlide(currentSlide, function() {
        if (currentSlide + 1 < order.length) {
          currentSlide++;
          renderList();
          var sN = currentSlide + 1;
          $('#currentSlide').text("Slide " + sN);
          console.log(currentSlide);
          var cT = "contents";
          if (order[currentSlide][1] != "content") {
            cT = "query";
          }
          console.log(presData);
          quill.setHTML(presData.slides[order[currentSlide][1]][order[currentSlide][0]][cT]);
        }
      });
    });

    $('#prevSlide').click(function() {

      saveSlide(currentSlide, function() {
        if (currentSlide > 0) {
          currentSlide--;
          renderList();
          var sN = currentSlide + 1;
          $('#currentSlide').text("Slide " + sN);
          console.log(currentSlide);
          console.log(currentSlide);
          var cT = "contents";
          if (order[currentSlide][1] != "content") {
            cT = "query";
          }
          console.log(presData);
          quill.setHTML(presData.slides[order[currentSlide][1]][order[currentSlide][0]][cT]);
        }
      });
    });
  };

  window.editNewPresentation = function(name) {
    editPresentation(true, name);
  }
})();