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
        $("#itemlist").fadeIn('fast');
        $("#itm-"+ $(active).data("featureid")).fadeIn('fast');
      }
      $("#hipster-container")
        .css("margin-left", $(".item-collection").outerWidth())
        .css("margin-top", "0");
    } else {
      var height = $("#item-selector").outerHeight() / 2;
      $("#item-selector").fadeOut('fast');
      $("#itemlist").fadeOut('fast');
      $("#hipster-container")
        .css("margin-left", 0)
        .css("margin-top", height);
    }
  }
  this.toggleControls = _toggleControls;
    
  function _screenResize() {
    var height = $("#item-selector").outerHeight() / 2;
    $("#hipster-container").css("margin-top", height);
    var winHeight = $(window).height();
    winHeight = winHeight - $(".topbar").height() - $("#item-selector").height();
    $("#itemlist, #hipster-container").height(winHeight);
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
        if (data[i].options[j].default_item) {
          item_but.addClass("active");
          item_but.data("default", true);
        } else {
          item_but.data("default", false);
        }
        item_but.data("multiple", data[i].multiple);
        item_but.data("featureid", data[i].featureid);
        item_but.data("itemid", data[i].options[j].id);
        item_but.data("name", data[i].options[j].name);
        if (data[i].options[j].file) {
          item_but.data("file", data[i].options[j].file);
          item_but.data("x", data[i].options[j].x);
          item_but.data("y", data[i].options[j].y);
          item_but.data("scale", data[i].options[j].scale);
        }
        items.append(item_but);
      }
      $("#itemlist").append(items);
    }
    featureButtons.find("button").click(function() {
      $("#item-selector .box.active").removeClass("active");
      $(this).addClass("active"); 
      
      if ($("#itemlist:visible").length == 0) {
        $("#hipster-container").css("margin-left", $("#itemlist").outerWidth());
        $("#itemlist").fadeIn('fast');
      }
      
      $(".item-collection:visible").hide();
      $("#itm-"+ $(this).data("featureid")).fadeIn('fast');
    });
    $(".item-collection").find("button").click(function() {
      _toggleItem($(this));
    });
    $("#item-selector").html(featureButtons);
  }
  
  function _toggleItem(jqElem) {
    if (!jqElem.data("multiple")) {
      if (!$(".item-collection:visible .active").is(jqElem)) {
        $(".item-collection:visible .active").removeClass("active");
        $("#hipster #" + jqElem.data("featureid")).remove();    
      }
    }
      
    var addAsset = !jqElem.hasClass("active");
    if (addAsset) {
      _addAsset(jqElem.data("file"), jqElem.data("itemid"), jqElem.data("x"), jqElem.data("y"), jqElem.data("scale"));
      jqElem.addClass("active");
    } else {
      _removeAsset(jqElem.data("itemid"));
      jqElem.removeClass("active");
    }
  }
  
  function _removeAsset(asset_id) {
    var selector = "#hipster #itemid-" + asset_id;
    $(selector).remove();
  }
  
  function _addAsset(url_to_asset, asset_id, x, y, scale) {
    var req = $.ajax({
      url: url_to_asset,
      dataType: "xml",
      cache: true
    });
    var item_info = {};
    item_info.id = asset_id;
    item_info.x = x;
    item_info.y = y;
    item_info.scale = scale;
    req.item_info = item_info;
    req.done(function(data, result, response) {
      var item = $(data).find("svg");
      var cw = item.attr("width");
      cw = parseInt(cw) * response.item_info.scale;
      item.addClass("custom-svg")
        .attr("id", "itemid-" + response.item_info.id)
        .attr("x", response.item_info.x)
        .attr("y", response.item_info.y)
        .attr("width", cw);
      $("#hipster").append(item);
    });
  }
  
  function _testAdd() {
    _addAsset('/assets/accessories/bluebeanie.svg', "bluebeanie", 125, -160, 0.8);
  }
  this.testAdd = _testAdd;
  function _testRemove() {
    _removeAsset("bluebeanie");
  }
  this.testRemove = _testRemove;
  
  function _resetHipster() {
    $("#hipster svg").remove();
  }
  this.resetHipster = _resetHipster;
  
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

