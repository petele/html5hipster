/* Author:

*/

var Hipster = (function(){

  $(document).ready(function(){
    _screenResize(); 
    _updateFeatures(hipster_data);
  });
  
  // recalculate window width if you resize the browser
  $(window).resize(function() {
    screenResize();
  });
  
  $("#imgDrag").bind('dragstart', function(e) {
    //TODO finish drag out
    //console.log(e, "y");
    //e.dataTransfer.setData('DownloadURL', "A");
  });
  
  $("#item-collection .box").click(function() {
    $(this).toggleClass("active");  
  });
  
  $("#hipster-container").click(function() {
    _toggleControls(); 
  });
  
  // google analytics
  var _gaq=[['_setAccount','UA-9988000-4'],['_trackPageview'],['_trackPageLoadTime']];
  (function(d,t){var g=d.createElement(t),s=d.getElementsByTagName(t)[0];g.async=1;
  g.src=('https:'==location.protocol?'//ssl':'//www')+'.google-analytics.com/ga.js?v=2';
  s.parentNode.insertBefore(g,s)}(document,'script'));
  
  function _toggleControls(show) {
    if (show === undefined) {
      if ($("#item-selector:visible").length >= 1) {
        show = false;
      } else {
        show = true;
      }
    }
    if (show) {
      $("#item-selector").fadeIn('fast');
      var active = $("#item-selector .box.active");
      if (active.length >= 1) {
        $("#itm-"+ $(active).data("featureid")).fadeIn('fast');
      }
      $("#hipster-container")
        .css("margin-left", $("#item-collection").outerWidth())
        .css("margin-top", "0");
    } else {
      var height = $("#item-selector").outerHeight() / 2;
      $("#item-selector").fadeOut('fast');
      $(".item-collection").fadeOut('fast');
      $("#hipster-container")
        .css("margin-left", "0")
        .css("margin-top", height);
    }
  }
  this.toggleControls = _toggleControls;
    
  function _screenResize() {
    var winHeight = $(window).height();
    winHeight = winHeight - $(".topbar").height() - $("#item-selector").height();
    $(".item-collection, #hipster-container").height(winHeight);
    console.log(winHeight);
    $("#hipster").height(winHeight);
  }
  this.screenResize = _screenResize;
  
  function _updateFeatures(data){
    var len = data.length;
    var featureButtons = $("<div id='items' />");
    for (var i = 0; i < len; i++) {
      var but = $("<button type='button' class='box' id='item-"+ data[i].featureid+"'>"+data[i].featurename+"</button>");
      but.data("featureid", data[i].featureid);
      featureButtons.append(but);
      var items = $("<div class='item-collection'></div>");
      items.attr("id", "itm-" + data[i].featureid)
      var item_len = data[i].options.length;
      for (var j = 0; j < item_len; j++) {
        var item_but = $("<button type='button' class='box' id='item-"+ data[i].options[j].id+"'>"+data[i].options[j].name+"</button>"); 
        if (data[i].options[j].default) {
          item_but.addClass("active");
        }
        items.append(item_but);
      }
      $("#itemlist").append(items);
    }
    featureButtons.find("button").click(function() {
      $("#item-selector .box.active").removeClass("active");
      $(this).addClass("active"); 
      var x = "#itm-"+ $(this).data("featureid");
      $(".item-collection:visible").fadeOut('fast');
      $(x).fadeIn('fast');
    });
    $(".item-collection").find("button").click(function() {
      _toggleItem($(this));
    });
    $("#item-selector").html(featureButtons);
  }
  
  function _toggleItem(jqElem) {
    console.log(jqElem);
    jqElem.toggleClass("active");
  }
  
  function _convertSVG(sourceSVG, targetCanvas) {
    // http://www.svgopen.org/2010/papers/62-From_SVG_to_Canvas_and_Back/
    // https://developer.mozilla.org/en/XMLSerializer
    svg_xml = (new XMLSerializer()).serializeToString(sourceSVG);
    var ctx = targetCanvas.getContext('2d');

    // this is just a JavaScript (HTML) image
    var img = new Image();
    // http://en.wikipedia.org/wiki/SVG#Native_support
    // https://developer.mozilla.org/en/DOM/window.btoa
    img.src = "data:image/svg+xml;base64," + btoa(svg_xml);
    console.log("Image Source", img.src);
  }
  
  function _savePNG() {
    var svg = $("#hipster");
    var canvas = $("#saveCanvas");
    _convertSVG(svg[0], canvas[0]);
  }
  this.savePNG = _savePNG;
 
	return this;
 
})();

