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
  
  function _updateFeatures(data) {
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
          item_but.data("default", true).addClass("default");
        } else {
          item_but.data("default", false);
        }
        item_but.data("multiple", data[i].multiple);
        item_but.data("featureid", data[i].featureid);
        item_but.data("itemid", data[i].options[j].id);
        item_but.data("name", data[i].options[j].name);
        item_but.addClass(data[i].featureid);
        if (data[i].min) {
          item_but.data("min", data[i].min);
        } else {
          item_but.data("min", 0);
        }
        item_but.data("min", data[i].min);
        
        if (data[i].options[j].file) {
          item_but.data("file", data[i].options[j].file)
            .data("x", data[i].options[j].x)
            .data("y", data[i].options[j].y)
            .data("scale", data[i].options[j].scale);
        } else if (data[i].featureid == "bodycolor") {
          item_but.data("dark", data[i].options[j].dark)
            .data("light", data[i].options[j].light)
            .data("inner1", data[i].options[j].inner1)
            .data("inner2", data[i].options[j].inner2)
            .data("shoulder", data[i].options[j].shoulder)
            .data("forarm", data[i].options[j].forarm)
            .data("hand", data[i].options[j].hand)
            .data("leg", data[i].options[j].leg)
        } else if (data[i].featureid == "haircolor") {
          item_but.data("color", data[i].options[j].color);
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
      var jqElem = $(this);
      var featureid = jqElem.data("featureid");
      var allowMultiple = jqElem.data("multiple");
      var minSelected = jqElem.data("min");
      var curSelected = $(".item-collection:visible .active")
      var numSelected = curSelected.length;
      
      if (!allowMultiple) {
        if ((numSelected == 1) && (jqElem.is(curSelected))) {
          //console.log("Do Nothing");
        } else {
          //console.log("Single Toggle");
          if (featureid == "bodycolor") {
            _setBodyColor(jqElem, allowMultiple, minSelected);
          } else if (featureid == "haircolor") {
            _setHairColor(jqElem, allowMultiple, minSelected);
          } else if (featureid == "shirts") {
            _addShirt(jqElem, allowMultiple, minSelected);
          } else if (featureid == "pants") {
            _addPants(jqElem, allowMultiple, minSelected);
          } else if (featureid == "shoes") {
            _addShoes(jqElem, allowMultiple, minSelected);
          } else if (featureid == "hair") {
            $(".item-collection:visible .active").removeClass("active");
            _toggleAsset(jqElem);
          }
        }
      } else {
        _toggleAsset(jqElem);
      }      
    });
    $("#item-selector").html(featureButtons);
  }
  
  function _setBodyColor(jqElem) {
    console.log("SetBodyColor", jqElem, jqElem.data("dark"));
    $(".item-collection:visible .active").removeClass("active");
    jqElem.addClass("active");
    $("#torso-dark").attr("fill", jqElem.data("dark"));
    $("#torso-light").attr("fill", jqElem.data("light"));
    $("#torso-five-dark").attr("fill", jqElem.data("inner1"));
    $("#torso-five-light").attr("fill", jqElem.data("inner2"));
    $("#arm-left-shoulder, #arm-right-shoulder").attr("fill", jqElem.data("shoulder"));
    $("#arm-left-forarm, #arm-right-forarm").attr("fill", jqElem.data("forarm"));
    $("#arm-left-hand, #arm-right-hand").attr("fill", jqElem.data("hand"));
    $("#leg-left, #leg-right").attr("fill", jqElem.data("leg"));
    //$("#arm-left-hand, #arm-right-forarm, #arm-right-hand, #arm-right-forarm").attr("fill", "#000000")
  }
  
  function _setHairColor(jqElem) {
    console.log("SetHairColor", jqElem, jqElem.data("color"), $("#hair"));
    $(".haircolor.active").removeClass("active");
    jqElem.addClass("active");
    $("#hair").attr("fill", jqElem.data("color"));
  }
  
  function _addShirt(jqElem) {
    console.log("AddShirt", jqElem);
    $(".item-collection:visible .active").removeClass("active");
    jqElem.addClass("active");
  }
  
  function _addPants(jqElem) {
    console.log("AddPants", jqElem);
    $(".item-collection:visible .active").removeClass("active");
    jqElem.addClass("active");
  }
  
  function _addShoes(jqElem) {
    console.log("AddShoes", jqElem);
    $(".item-collection:visible .active").removeClass("active");
    jqElem.addClass("active");
  }
  
  function _toggleAsset(jqElem) {
    console.log("ToggleAsset", jqElem);
    if (!jqElem.data("multiple")) {
      if (!$(".item-collection:visible .active").is(jqElem)) {
        $("#hipster ." + jqElem.data("featureid")).remove();  
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
    var item = $("#itemid-" + asset_id);
    item.remove();
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
      var item = $(data).find("svg g");
      item.attr("class", "custom-svg " + item.attr("id"))
        .attr("id", "itemid-" + response.item_info.id)
        .attr("transform", "translate(" + response.item_info.x + ", " + response.item_info.y + "), scale(" + response.item_info.scale + ")");
      if (item.find("#hair").length == 1) {
        item.find("#hair").attr("fill", $(".haircolor.active").data("color"));
      }
      $("#hipster").append(item);
      //console.log("Add", item);
    });
  }
  
  function _resetHipster() {
    $("#hipster .custom-svg").remove();
    $(".item-collection .active").removeClass("active");
    $(".item-collection .default").addClass("active");
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

