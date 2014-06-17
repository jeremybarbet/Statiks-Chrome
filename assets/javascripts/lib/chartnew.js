/*
 * ChartNew.js
 *
 * Vancoppenolle Francois - January 2014
 * francois.vancoppenolle@favomo.be
 *
 * Source location : http:\\www.favomo.be\graphjs
 * GitHub community : https://github.com/FVANCOP/ChartNew.js
 *
 * This file is an adaptation of the chart.js source developped by Nick Downie (2013)
 * https://github.com/nnnick/Chart.js
 */

var charJSPersonalDefaultOptions = {}
var charJSPersonalDefaultOptionsLine = {}

///////// FUNCTIONS THAN CAN BE USED IN THE TEMPLATES ///////////////////////////////////////////

function roundToWithThousands(config, num, place) {
  var newval = 1 * unFormat(config, num);

  if (typeof(newval) == "number" && place != "none") {
    if (place <= 0) {
      var roundVal = -place;
      newval = +(Math.round(newval + "e+" + roundVal) + "e-" + roundVal);
    } else {
      var roundVal = place;
      var divval = "1e+" + roundVal;
      value = +(Math.round(newval / divval)) * divval;
    }
  }
  newval = fmtChartJS(config, newval, "none");
  return (newval);
};

function unFormat(config, num) {

  if ((config.decimalSeparator != "." || config.thousandSeparator != "") && typeof(num) == "string") {
    var v1 = "" + num;
    if (config.thousandSeparator != "") {
      while (v1.indexOf(config.thousandSeparator) >= 0) v1 = "" + v1.replace(config.thousandSeparator, "");
    }
    if (config.decimalSeparator != ".") v1 = "" + v1.replace(config.decimalSeparator, ".")
      // v1=fmtChartJS(config,1*roundToWithThousands(1*v1,place),"none")
    return 1 * v1;
  } else {
    return num;
  }
};

///////// ANNOTATE PART OF THE SCRIPT ///////////////////////////////////////////

/********************************************************************************
Copyright (C) 1999 Thomas Brattli
This script is made by and copyrighted to Thomas Brattli
Visit for more great scripts. This may be used freely as long as this msg is intact!
I will also appriciate any links you could give me.
Distributed by Hypergurl
********************************************************************************/

var cachebis = {};

function fmtChartJSPerso(config, value, fmt) {
  switch (fmt) {
    case "SampleJS_Format":
      if (typeof(value) == "number") return_value = "My Format : " + value.toString() + " $";
      else return_value = value + "XX";
      break;
    case "Change_Month":
      if (typeof(value) == "string") return_value = value.toString() + " 2014";
      else return_value = value.toString() + "YY";
      break;

    default:
      return_value = value;
      break;
  }
  return (return_value);
};

function fmtChartJS(config, value, fmt) {

  var return_value;
  if (fmt == "notformatted") {
    return_value = value;
  } else if (fmt == "none" && typeof(value) == "number") {
    if (config.roundNumber != "none") {
      if (config.roundNumber <= 0) {
        var roundVal = -config.roundNumber;
        value = +(Math.round(value + "e+" + roundVal) + "e-" + roundVal);
      } else {
        var roundVal = config.roundNumber;
        var divval = "1e+" + roundVal;
        value = +(Math.round(value / divval)) * divval;
      }
    }
    if (config.decimalSeparator != "." || config.thousandSeparator != "") {
      return_value = value.toString().replace(/\./g, config.decimalSeparator);
      if (config.thousandSeparator != "") {
        var part1 = return_value;
        var part2 = "";
        var posdec = part1.indexOf(config.decimalSeparator);
        if (posdec >= 0) {
          part2 = part1.substring(posdec + 1, part1.length);
          part2 = part2.split('').reverse().join(''); // reverse string
          part1 = part1.substring(0, posdec);
        }
        part1 = part1.toString().replace(/\B(?=(\d{3})+(?!\d))/g, config.thousandSeparator);
        // part2=part2.toString().replace(/\B(?=(\d{3})+(?!\d))/g, config.thousandSeparator);
        part2 = part2.split('').reverse().join(''); // reverse string
        return_value = part1
        if (part2 != "") return_value = return_value + config.decimalSeparator + part2;
      }
    } else return_value = value;
  } else if (fmt != "none" && fmt != "notformatted") {
    return_value = fmtChartJSPerso(config, value, fmt);
  } else {
    return_value = value;
  }
  return (return_value);
};


function tmplbis(str, data) {
  // Figure out if we're getting a template, or if we need to
  // load the template - and be sure to cache the result.
  var fn = !/\W/.test(str) ?
    cachebis[str] = cachebis[str] ||
    tmplbis(document.getElementById(str).innerHTML) :

    // Generate a reusable function that will serve as a template
    // generator (and which will be cached).
    new Function("obj",
      "var p=[],print=function(){p.push.apply(p,arguments);};" +

      // Introduce the data as local variables using with(){}
      "with(obj){p.push('" +

      // Convert the template into pure JavaScript
      str
      .replace(/[\r\t\n]/g, " ")
      .split("<%").join("\t")
      .replace(/((^|%>)[^\t]*)'/g, "$1\r")
      .replace(/\t=(.*?)%>/g, "',$1,'")
      .split("\t").join("');")
      .split("%>").join("p.push('")
      .split("\r").join("\\'") + "');}return p.join('');");

  // Provide some basic currying to the user
  return data ? fn(data) : fn;
};

cursorDivCreated = false;

//Set these variables:
fromLeft = 10; // How much from the left of the cursor should the div be?
fromTop = 10; // How much from the top of the cursor should the div be?

/********************************************************************
Initilizes the objects
*********************************************************************/

function cursorInit() {
  scrolled = bw.ns4 || bw.ns5 ? "window.pageYOffset" : "document.body.scrollTop"
  if (bw.ns4) document.captureEvents(Event.MOUSEMOVE)
};
/********************************************************************
Contructs the cursorobjects
*********************************************************************/
function makeCursorObj(obj, nest) {

  createCursorDiv();

  nest = (!nest) ? '' : 'document.' + nest + '.'
  this.css = bw.dom ? document.getElementById(obj).style : bw.ie4 ? document.all[obj].style : bw.ns4 ? eval(nest + "document.layers." + obj) : 0;
  this.moveIt = b_moveIt;

  cursorInit();

  return this
};

function b_moveIt(x, y) {
  this.x = x;
  this.y = y;
  this.css.left = this.x + "px";
  this.css.top = this.y + "px";
};

function isIE() {
  var myNav = navigator.userAgent.toLowerCase();
  return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
};

function mergeChartConfig(defaults, userDefined) {
  var returnObj = {};
  for (var attrname in defaults) {
    returnObj[attrname] = defaults[attrname];
  }
  for (var attrname in userDefined) {
    returnObj[attrname] = userDefined[attrname];
  }
  return returnObj;
};

function sleep(ms) {
  var dt = new Date();
  dt.setTime(dt.getTime() + ms);
  while (new Date().getTime() < dt.getTime()) {};
};

if (typeof String.prototype.trim !== 'function') {
  String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, '');
  }
};

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
};

///////// GRAPHICAL PART OF THE SCRIPT ///////////////////////////////////////////

//Define the global Chart Variable as a class.
window.Chart = function(context) {

  var chart = this;

  //Easing functions adapted from Robert Penner's easing equations
  //http://www.robertpenner.com/easing/

  var animationOptions = {
    linear: function(t) {
      return t;
    },
    easeInCubic: function(t) {
      return t * t * t;
    },
    easeOutCubic: function(t) {
      return 1 * ((t = t / 1 - 1) * t * t + 1);
    },
    easeInOutCubic: function(t) {
      if ((t /= 1 / 2) < 1) return 1 / 2 * t * t * t;
      return 1 / 2 * ((t -= 2) * t * t + 2);
    },
    easeInBounce: function(t) {
      return 1 - animationOptions.easeOutBounce(1 - t);
    },
    easeOutBounce: function(t) {
      if ((t /= 1) < (1 / 2.75)) {
        return 1 * (7.5625 * t * t);
      } else if (t < (2 / 2.75)) {
        return 1 * (7.5625 * (t -= (1.5 / 2.75)) * t + .75);
      } else if (t < (2.5 / 2.75)) {
        return 1 * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375);
      } else {
        return 1 * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375);
      }
    },
    easeInOutBounce: function(t) {
      if (t < 1 / 2) return animationOptions.easeInBounce(t * 2) * .5;
      return animationOptions.easeOutBounce(t * 2 - 1) * .5 + 1 * .5;
    }
  };

  //Variables global to the chart
  var width = context.canvas.width;
  var height = context.canvas.height;

  //High pixel density displays - multiply the size of the canvas height/width by the device pixel ratio, then scale.
  if (window.devicePixelRatio) {
    context.canvas.style.width = width + "px";
    context.canvas.style.height = height + "px";
    context.canvas.height = height * window.devicePixelRatio;
    context.canvas.width = width * window.devicePixelRatio;
    context.scale(window.devicePixelRatio, window.devicePixelRatio);
  };

  this.Line = function(data, options) {
    chart.Line.defaults = {
      inGraphDataShow: false,
      inGraphDataPaddingX: 3,
      inGraphDataPaddingY: 3,
      inGraphDataTmpl: "<%=v3%>",
      inGraphDataAlign: "left",
      inGraphDataVAlign: "bottom",
      inGraphDataRotate: 0,
      inGraphDataFontFamily: "'Arial'",
      inGraphDataFontSize: 12,
      inGraphDataFontStyle: "normal",
      inGraphDataFontColor: "#666",
      scaleOverlay: false,
      scaleOverride: false,
      scaleSteps: null,
      scaleStepWidth: null,
      scaleStartValue: null,
      scaleLineColor: "rgba(0,0,0,.1)",
      scaleLineWidth: 1,
      scaleShowLabels: true,
      scaleLabel: "<%=value%>",
      scaleFontFamily: "'Arial'",
      scaleFontSize: 12,
      scaleFontStyle: "normal",
      scaleFontColor: "#666",
      scaleShowGridLines: true,
      scaleXGridLinesStep: 1,
      scaleYGridLinesStep: 1,
      scaleGridLineColor: "rgba(0,0,0,.05)",
      scaleGridLineWidth: 1,
      showYAxisMin: true, // Show the minimum value on Y axis (in original version, this minimum is not displayed - it can overlap the X labels)
      rotateLabels: "smart", // smart <=> 0 degre if space enough; otherwise 45 degres if space enough otherwise90 degre; 
      // you can force an integer value between 0 and 180 degres
      logarithmic: false, // can be 'fuzzy',true and false ('fuzzy' => if the gap between min and maximum is big it's using a logarithmic y-Axis scale
      scaleTickSizeLeft: 5,
      scaleTickSizeRight: 5,
      scaleTickSizeBottom: 5,
      scaleTickSizeTop: 5,
      bezierCurve: true,
      pointDot: true,
      pointDotRadius: 4,
      pointDotStrokeWidth: 2,
      datasetStrokeWidth: 2,
      datasetFill: true,
      animation: true,
      animationSteps: 60,
      animationEasing: "easeOutQuart",
      onAnimationComplete: null,
      annotateLabel: "<%=(v1 == '' ? '' : v1) + (v1!='' && v2 !='' ? ' - ' : '')+(v2 == '' ? '' : v2)+(v1!='' || v2 !='' ? ':' : '') + v3%>"
    };

    // merge annotate defaults
    chart.Line.defaults = mergeChartConfig(chart.defaults.commonOptions, chart.Line.defaults);
    chart.Line.defaults = mergeChartConfig(chart.defaults.xyAxisCommonOptions, chart.Line.defaults);
    chart.Line.defaults = mergeChartConfig(chart.Line.defaults, charJSPersonalDefaultOptions);
    chart.Line.defaults = mergeChartConfig(chart.Line.defaults, charJSPersonalDefaultOptionsLine);

    var config = (options) ? mergeChartConfig(chart.Line.defaults, options) : chart.Line.defaults;

    return new Line(data, config, context);
  };

  chart.defaults = {};

  chart.defaults.commonOptions = {
    clearRect: true, // do not change clearRect options; for internal use only
    dynamicDisplay: false,
    graphSpaceBefore: 5,
    graphSpaceAfter: 5,
    canvasBorders: false,
    canvasBackgroundColor: "none",
    canvasBordersWidth: 3,
    canvasBordersColor: "black",
    graphTitle: "",
    graphTitleFontFamily: "'Arial'",
    graphTitleFontSize: 24,
    graphTitleFontStyle: "bold",
    graphTitleFontColor: "#666",
    graphTitleSpaceBefore: 5,
    graphTitleSpaceAfter: 5,
    graphSubTitle: "",
    graphSubTitleFontFamily: "'Arial'",
    graphSubTitleFontSize: 18,
    graphSubTitleFontStyle: "normal",
    graphSubTitleFontColor: "#666",
    graphSubTitleSpaceBefore: 5,
    graphSubTitleSpaceAfter: 5,
    footNote: "",
    footNoteFontFamily: "'Arial'",
    footNoteFontSize: 8,
    footNoteFontStyle: "bold",
    footNoteFontColor: "#666",
    footNoteSpaceBefore: 5,
    footNoteSpaceAfter: 5,
    legend: false,
    legendFontFamily: "'Arial'",
    legendFontSize: 12,
    legendFontStyle: "normal",
    legendFontColor: "#666",
    legendBlockSize: 15,
    legendBorders: true,
    legendBordersWidth: 1,
    legendBordersColors: "#666",
    legendBordersSpaceBefore: 5,
    legendBordersSpaceAfter: 5,
    legendBordersSpaceLeft: 5,
    legendBordersSpaceRight: 5,
    legendSpaceBeforeText: 5,
    legendSpaceAfterText: 5,
    legendSpaceLeftText: 5,
    legendSpaceRightText: 5,
    legendSpaceBetweenTextVertical: 5,
    legendSpaceBetweenTextHorizontal: 5,
    legendSpaceBetweenBoxAndText: 5,
    annotateDisplay: false,
    savePng: false,
    savePngOuput: "NewWindow", // Allowed values : "NewWindow", "CurrentWindow", "Save"
    savePngFunction: "mousedown right",
    savePngBackgroundColor: 'WHITE',
    annotateFunction: "mousemove",
    annotateFontFamily: "'Arial'",
    annotateBorder: 'none',
    annotateBorderRadius: '2px',
    annotateBackgroundColor: 'rgba(0,0,0,0.8)',
    annotateFontSize: 12,
    annotateFontColor: 'white',
    annotateFontStyle: "normal",
    annotatePadding: "3px",
    annotateClassName: "",
    crossText: [""],
    crossTextIter: ["all"],
    crossTextOverlay: [true],
    crossTextFontFamily: ["'Arial'"],
    crossTextFontSize: [12],
    crossTextFontStyle: ["normal"],
    crossTextFontColor: ["rgba(220,220,220,1)"],
    crossTextRelativePosX: [2],
    crossTextRelativePosY: [2],
    crossTextBaseline: ["middle"],
    crossTextAlign: ["center"],
    crossTextPosX: [0],
    crossTextPosY: [0],
    crossTextAngle: [0],
    crossTextFunction: null,
    spaceTop: 0,
    spaceBottom: 0,
    spaceRight: 0,
    spaceLeft: 0,
    decimalSeparator: ".",
    thousandSeparator: "",
    roundNumber: "none",
    roundPct: -1,
    animationStartValue: 0,
    animationStopValue: 1,
    animationCount: 1,
    animationPauseTime: 5,
    animationBackward: false,
    defaultStrokeColor: "rgba(220,220,220,1)",
    defaultFillColor: "rgba(220,220,220,0.5)"
  };

  chart.defaults.xyAxisCommonOptions = {
    yAxisLeft: true,
    yAxisRight: false,
    xAxisBottom: true,
    xAxisTop: false,
    xAxisSpaceBetweenLabels: 5,
    yAxisLabel: "",
    yAxisFontFamily: "'Arial'",
    yAxisFontSize: 16,
    yAxisFontStyle: "normal",
    yAxisFontColor: "#666",
    yAxisLabelSpaceRight: 5,
    yAxisLabelSpaceLeft: 5,
    yAxisSpaceRight: 5,
    yAxisSpaceLeft: 5,
    xAxisLabel: "",
    xAxisFontFamily: "'Arial'",
    xAxisFontSize: 16,
    xAxisFontStyle: "normal",
    xAxisFontColor: "#666",
    xAxisLabelSpaceBefore: 5,
    xAxisLabelSpaceAfter: 5,
    xAxisSpaceBefore: 5,
    xAxisSpaceAfter: 5,
    yAxisUnit: "",
    yAxisUnitFontFamily: "'Arial'",
    yAxisUnitFontSize: 8,
    yAxisUnitFontStyle: "normal",
    yAxisUnitFontColor: "#666",
    yAxisUnitSpaceBefore: 5,
    yAxisUnitSpaceAfter: 5
  };

  var clear = function(c) {
    c.clearRect(0, 0, width, height);
  };

  var Line = function(data, config, ctx) {
    var maxSize, scaleHop, calculatedScale, labelHeight, scaleHeight, valueBounds, labelTemplateString, valueHop, widestXLabel, xAxisLength, yAxisPosX, xAxisPosY, rotateLabels = 0,
        msr;

    var annotateCnt = 0;

    if (typeof ctx.ChartNewId == "undefined") {
      var cvdate = new Date();
      var cvmillsec = cvdate.getTime();
      ctx.ChartNewId = "Line_" + cvmillsec;
    }

    // adapt data when length is 1;
    var mxlgt = 0;
    for (var i = 0; i < data.datasets.length; i++) mxlgt = Max([mxlgt, data.datasets[i].data.length]);
    if (mxlgt == 1) {
      if (typeof(data.labels[0]) == "string") data.labels = ["", data.labels[0], ""];
      for (var i = 0; i < data.datasets.length; i++) {
        if (typeof(data.datasets[i].data[0] != "undefined")) data.datasets[i].data = [undefined, data.datasets[i].data[0], undefined];
      }
    }

    msr = setMeasures(data, config, ctx, height, width, [""], false, false, true, true, config.datasetFill);

    valueBounds = getValueBounds();

    // true or fuzzy (error for negativ values (included 0))
    if (config.logarithmic !== false) {
      if (valueBounds.minValue <= 0) {
        config.logarithmic = false;
      }
    }

    // Check if logarithmic is meanigful
    var OrderOfMagnitude = calculateOrderOfMagnitude(Math.pow(10, calculateOrderOfMagnitude(valueBounds.maxValue) + 1)) - calculateOrderOfMagnitude(Math.pow(10, calculateOrderOfMagnitude(valueBounds.minValue)));
    if ((config.logarithmic == 'fuzzy' && OrderOfMagnitude < 4) || config.scaleOverride) {
      config.logarithmic = false;
    }

    //Check and set the scale
    labelTemplateString = (config.scaleShowLabels) ? config.scaleLabel : "";

    if (!config.scaleOverride) {
      calculatedScale = calculateScale(config, valueBounds.maxSteps, valueBounds.minSteps, valueBounds.maxValue, valueBounds.minValue, labelTemplateString);
      msr = setMeasures(data, config, ctx, height, width, calculatedScale.labels, false, false, true, true, config.datasetFill);
    } else {
      calculatedScale = {
        steps: config.scaleSteps,
        stepValue: config.scaleStepWidth,
        graphMin: config.scaleStartValue,
        graphMax: config.scaleStartValue + config.scaleSteps * config.scaleStepWidth,
        labels: []
      }
      populateLabels(config, labelTemplateString, calculatedScale.labels, calculatedScale.steps, config.scaleStartValue, calculatedScale.graphMax, config.scaleStepWidth);
      msr = setMeasures(data, config, ctx, height, width, calculatedScale.labels, false, false, true, true, config.datasetFill);
    }
    msr.availableHeight = msr.availableHeight - config.scaleTickSizeBottom - config.scaleTickSizeTop;
    msr.availableWidth = msr.availableWidth - config.scaleTickSizeLeft - config.scaleTickSizeRight;

    scaleHop = Math.floor(msr.availableHeight / calculatedScale.steps);
    valueHop = Math.floor(msr.availableWidth / (data.labels.length - 1));
    if (valueHop == 0) valueHop = (msr.availableWidth / (data.labels.length - 1));

    msr.clrwidth = msr.clrwidth - (msr.availableWidth - (data.labels.length - 1) * valueHop);
    msr.availableWidth = (data.labels.length - 1) * valueHop;
    msr.availableHeight = (calculatedScale.steps) * scaleHop;

    yAxisPosX = msr.leftNotUsableSize + config.scaleTickSizeLeft;
    xAxisPosY = msr.topNotUsableSize + msr.availableHeight + config.scaleTickSizeTop;

    drawLabels();
    var zeroY = 0;
    if (valueBounds.minValue < 0) {
      var zeroY = calculateOffset(config, 0, calculatedScale, scaleHop);
    }

    animationLoop(config, drawScale, drawLines, ctx, msr.clrx, msr.clry, msr.clrwidth, msr.clrheight, yAxisPosX + msr.availableWidth / 2, xAxisPosY - msr.availableHeight / 2, yAxisPosX, xAxisPosY, data);

    function drawLines(animPc) {
      drawLinesDataset(animPc, data, config, ctx, {
        xAxisPosY: xAxisPosY,
        yAxisPosX: yAxisPosX,
        valueHop: valueHop,
        scaleHop: scaleHop,
        zeroY: zeroY,
        calculatedScale: calculatedScale,
        annotateCnt: annotateCnt
      });
    };

    function drawScale() {

      //X axis line                                                          

      ctx.lineWidth = config.scaleLineWidth;
      ctx.strokeStyle = config.scaleLineColor;
      ctx.beginPath();
      ctx.moveTo(yAxisPosX - config.scaleTickSizeLeft, xAxisPosY);
      ctx.lineTo(yAxisPosX + msr.availableWidth + config.scaleTickSizeRight, xAxisPosY);

      ctx.stroke();

      for (var i = 0; i < data.labels.length; i++) {
        ctx.beginPath();
        ctx.moveTo(yAxisPosX + i * valueHop, xAxisPosY + config.scaleTickSizeBottom);
        ctx.lineWidth = config.scaleGridLineWidth;
        ctx.strokeStyle = config.scaleGridLineColor;

        //Check i isnt 0, so we dont go over the Y axis twice.

        if (config.scaleShowGridLines && i > 0 && i % config.scaleXGridLinesStep == 0) {
          ctx.lineTo(yAxisPosX + i * valueHop, xAxisPosY - msr.availableHeight - config.scaleTickSizeTop);
        } else {
          ctx.lineTo(yAxisPosX + i * valueHop, xAxisPosY);
        }
        ctx.stroke();
      }

      //Y axis

      ctx.lineWidth = config.scaleLineWidth;
      ctx.strokeStyle = config.scaleLineColor;
      ctx.beginPath();
      ctx.moveTo(yAxisPosX, xAxisPosY + config.scaleTickSizeBottom);
      ctx.lineTo(yAxisPosX, xAxisPosY - msr.availableHeight - config.scaleTickSizeTop);
      ctx.stroke();

      for (var j = 0; j < calculatedScale.steps; j++) {
        ctx.beginPath();
        ctx.moveTo(yAxisPosX - config.scaleTickSizeLeft, xAxisPosY - ((j + 1) * scaleHop));
        ctx.lineWidth = config.scaleGridLineWidth;
        ctx.strokeStyle = config.scaleGridLineColor;
        if (config.scaleShowGridLines && j % config.scaleYGridLinesStep == 0) {
          ctx.lineTo(yAxisPosX + msr.availableWidth + config.scaleTickSizeRight, xAxisPosY - ((j + 1) * scaleHop));
        } else {
          ctx.lineTo(yAxisPosX, xAxisPosY - ((j + 1) * scaleHop));
        }
        ctx.stroke();
      }
    };

    function drawLabels() {
      ctx.font = config.scaleFontStyle + " " + config.scaleFontSize + "px " + config.scaleFontFamily;

      //X Labels     
      if (config.xAxisTop || config.xAxisBottom) {
        ctx.textBaseline = "top";
        if (msr.rotateLabels > 90) {
          ctx.save();
          ctx.textAlign = "left";
        } else if (msr.rotateLabels > 0) {
          ctx.save();
          ctx.textAlign = "right";
        } else {
          ctx.textAlign = "center";

        }
        ctx.fillStyle = config.scaleFontColor;

        if (config.xAxisBottom) {
          for (var i = 0; i < data.labels.length; i++) {
            ctx.save();
            if (msr.rotateLabels > 0) {
              ctx.translate(yAxisPosX + i * valueHop - config.scaleFontSize / 2, msr.xLabelPos);
              ctx.rotate(-(msr.rotateLabels * (Math.PI / 180)));
              ctx.fillText(fmtChartJS(config, data.labels[i]), 0, 0);
            } else {
              ctx.fillText(fmtChartJS(config, data.labels[i]), yAxisPosX + i * valueHop, msr.xLabelPos);
            }
            ctx.restore();
          }
        }
      }

      //Y Labels

      ctx.textAlign = "right";
      ctx.textBaseline = "middle";

      for (var j = ((config.showYAxisMin) ? -1 : 0); j < calculatedScale.steps; j++) {
        if (config.scaleShowLabels) {
          if (config.yAxisLeft) {
            ctx.textAlign = "right";
            ctx.fillText(calculatedScale.labels[j + 1], yAxisPosX - (config.scaleTickSizeLeft + config.yAxisSpaceRight), xAxisPosY - ((j + 1) * scaleHop));
          }
          if (config.yAxisRight) {
            ctx.textAlign = "left";
            ctx.fillText(calculatedScale.labels[j + 1], yAxisPosX + msr.availableWidth + (config.scaleTickSizeRight + config.yAxisSpaceRight), xAxisPosY - ((j + 1) * scaleHop));
          }
        }
      }
    };

    function getValueBounds() {
      var upperValue = Number.MIN_VALUE;
      var lowerValue = Number.MAX_VALUE;
      for (var i = 0; i < data.datasets.length; i++) {
        for (var j = 0; j < data.datasets[i].data.length; j++) {
          if (1 * data.datasets[i].data[j] > upperValue) {
            upperValue = 1 * data.datasets[i].data[j]
          };
          if (1 * data.datasets[i].data[j] < lowerValue) {
            lowerValue = 1 * data.datasets[i].data[j]
          };
        }
      };

      if (Math.abs(upperValue - lowerValue) < 0.00000001) {
        upperValue = Max([upperValue * 2, 1]);
        lowerValue = 0;
      }

      // AJOUT CHANGEMENT
      if (!isNaN(config.graphMin)) lowerValue = config.graphMin;
      if (!isNaN(config.graphMax)) upperValue = config.graphMax;

      labelHeight = config.scaleFontSize;
      scaleHeight = msr.availableHeight;

      //scaleHeight+" "+labelHeight);

      var maxSteps = Math.floor((scaleHeight / (labelHeight * 0.66)));
      var minSteps = Math.floor((scaleHeight / labelHeight * 0.5));

      return {
        maxValue: upperValue,
        minValue: lowerValue,
        maxSteps: maxSteps,
        minSteps: minSteps
      };
    };
  };

  function calculateOffset(config, val, calculatedScale, scaleHop) {
    if (!config.logarithmic) { // no logarithmic scale
      var outerValue = calculatedScale.steps * calculatedScale.stepValue;
      var adjustedValue = val - calculatedScale.graphMin;
      var scalingFactor = CapValue(adjustedValue / outerValue, 1, 0);
      return (scaleHop * calculatedScale.steps) * scalingFactor;
    } else { // logarithmic scale
      return CapValue(log10(val) * scaleHop - calculateOrderOfMagnitude(calculatedScale.graphMin) * scaleHop, undefined, 0);
    }
  };

  function animationLoop(config, drawScale, drawData, ctx, clrx, clry, clrwidth, clrheight, midPosX, midPosY, borderX, borderY, data) {

    var cntiter = 0;
    var animationCount = 1;
    var multAnim = 1;

    if (config.animationStartValue < 0 || config.animationStartValue > 1) config.animation.StartValue = 0;
    if (config.animationStopValue < 0 || config.animationStopValue > 1) config.animation.StopValue = 1;
    if (config.animationStopValue < config.animationStartValue) config.animationStopValue = config.animationStartValue;

    if (isIE() < 9 && isIE() != false) config.animation = false;

    var animFrameAmount = (config.animation) ? 1 / CapValue(config.animationSteps, Number.MAX_VALUE, 1) : 1,
      easingFunction = animationOptions[config.animationEasing],
      percentAnimComplete = (config.animation) ? 0 : 1;

    if (config.animation && config.animationStartValue > 0 && config.animationStartValue <= 1) {
      while (percentAnimComplete < config.animationStartValue) {
        cntiter++;
        percentAnimComplete += animFrameAmount;
      }
    }
    var beginAnim = cntiter;
    var beginAnimPct = percentAnimComplete;

    if (typeof drawScale !== "function") drawScale = function() {};

    if (config.clearRect) requestAnimFrame(animLoop);
    else animLoop();


    function animateFrame() {
      var easeAdjustedAnimationPercent = (config.animation) ? CapValue(easingFunction(percentAnimComplete), null, 0) : 1;

      if (1 * cntiter >= 1 * CapValue(config.animationSteps, Number.MAX_VALUE, 1) || config.animation == false) easeAdjustedAnimationPercent = 1;
      else if (easeAdjustedAnimationPercent >= 1) easeAdjustedAnimationPercent = 0.9999;

      if (!(isIE() < 9 && isIE() != false) && config.clearRect) ctx.clearRect(clrx, clry, clrwidth, clrheight);

      if (config.scaleOverlay) {
        drawData(easeAdjustedAnimationPercent);
        drawScale();
      } else {
        drawScale();
        drawData(easeAdjustedAnimationPercent);
      }
    };

    function animLoop() {
      //We need to check if the animation is incomplete (less than 1), or complete (1).
      cntiter += multAnim;

      percentAnimComplete += multAnim * animFrameAmount;

      if (cntiter == config.animationSteps || config.animation == false) percentAnimComplete = 1;
      else if (percentAnimComplete >= 1) percentAnimComplete = 0.999;

      animateFrame();
      //Stop the loop continuing forever

      if (multAnim == -1 && cntiter <= beginAnim) {
        if (typeof config.onAnimationComplete == "function") config.onAnimationComplete(ctx, config, data, 0, animationCount + 1);
        multAnim = 1;
        requestAnimFrame(animLoop);
      } else if (percentAnimComplete < config.animationStopValue) {
        requestAnimFrame(animLoop);
      } else {
        if (typeof config.onAnimationComplete == "function") config.onAnimationComplete(ctx, config, data, 1, animationCount + 1);
        // stop animation ? 
        if (animationCount < config.animationCount || config.animationCount == 0) {
          animationCount++;
          if (config.animationBackward && multAnim == 1) {
            percentAnimComplete -= animFrameAmount;
            multAnim = -1;
          } else {
            multAnim = 1;
            cntiter = beginAnim - 1;
            percentAnimComplete = beginAnimPct - animFrameAmount;
          }
          window.setTimeout(animLoop, 2000);
        }
      }
    };
  };

  //Declare global functions to be called within this namespace here.

  // shim layer with setTimeout fallback
  var requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function(callback) {
        window.setTimeout(callback, 1000 / 60);
      };
  })();

  function calculateScale(config, maxSteps, minSteps, maxValue, minValue, labelTemplateString) {
    var graphMin, graphMax, graphRange, stepValue, numberOfSteps, valueRange, rangeOrderOfMagnitude, decimalNum;

    if (!config.logarithmic) { // no logarithmic scale
      valueRange = maxValue - minValue;
      rangeOrderOfMagnitude = calculateOrderOfMagnitude(valueRange);
      graphMin = Math.floor(minValue / (1 * Math.pow(10, rangeOrderOfMagnitude))) * Math.pow(10, rangeOrderOfMagnitude);
      graphMax = Math.ceil(maxValue / (1 * Math.pow(10, rangeOrderOfMagnitude))) * Math.pow(10, rangeOrderOfMagnitude);
    } else { // logarithmic scale
      graphMin = Math.pow(10, calculateOrderOfMagnitude(minValue));
      graphMax = Math.pow(10, calculateOrderOfMagnitude(maxValue) + 1);
      rangeOrderOfMagnitude = calculateOrderOfMagnitude(graphMax) - calculateOrderOfMagnitude(graphMin);
    }

    graphRange = graphMax - graphMin;
    stepValue = Math.pow(10, rangeOrderOfMagnitude);
    numberOfSteps = Math.round(graphRange / stepValue);

    if (!config.logarithmic) { // no logarithmic scale

      //Compare number of steps to the max and min for that size graph, and add in half steps if need be.         
      while (numberOfSteps < minSteps || numberOfSteps > maxSteps) {
        if (numberOfSteps < minSteps) {
          stepValue /= 2;
          numberOfSteps = Math.round(graphRange / stepValue);
        } else {
          stepValue *= 2;
          numberOfSteps = Math.round(graphRange / stepValue);
        }
      }
    } else { // logarithmic scale
      numberOfSteps = rangeOrderOfMagnitude; // so scale is  10,100,1000,...
    }

    var labels = [];

    populateLabels(config, labelTemplateString, labels, numberOfSteps, graphMin, graphMax, stepValue);

    return {
      steps: numberOfSteps,
      stepValue: stepValue,
      graphMin: graphMin,
      labels: labels,
      maxValue: maxValue
    }
  };

  function calculateOrderOfMagnitude(val) {
    return Math.floor(Math.log(val) / Math.LN10);
  };

  //Populate an array of all the labels by interpolating the string.
  function populateLabels(config, labelTemplateString, labels, numberOfSteps, graphMin, graphMax, stepValue) {
    if (labelTemplateString) {
      //Fix floating point errors by setting to fixed the on the same decimal as the stepValue.
      if (!config.logarithmic) { // no logarithmic scale
        for (var i = 0; i < numberOfSteps + 1; i++) {
          labels.push(tmpl(labelTemplateString, {
            value: fmtChartJS(config, 1 * ((graphMin + (stepValue * i)).toFixed(getDecimalPlaces(stepValue))))
          }));
        }
      } else { // logarithmic scale 10,100,1000,...
        var value = graphMin;
        while (value < graphMax) {
          labels.push(tmpl(labelTemplateString, {
            value: fmtChartJS(config, 1 * value.toFixed(getDecimalPlaces(stepValue)))
          }));
          value *= 10;
        }
      }
    }
  };

  //Max value from array
  function Max(array) {
    return Math.max.apply(Math, array);
  };

  //Min value from array
  function Min(array) {
    return Math.min.apply(Math, array);
  };
  //Default if undefined

  function Default(userDeclared, valueIfFalse) {
    if (!userDeclared) {
      return valueIfFalse;
    } else {
      return userDeclared;
    }
  };

  //Is a number function
  function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  };

  //Apply cap a value at a high or low number
  function CapValue(valueToCap, maxValue, minValue) {
    if (isNumber(maxValue)) {
      if (valueToCap > maxValue) {
        return maxValue;
      }
    }
    if (isNumber(minValue)) {
      if (valueToCap < minValue) {
        return minValue;
      }
    }
    return valueToCap;
  };

  function getDecimalPlaces(num) {
    var numberOfDecimalPlaces;
    if (num % 1 != 0) {
      return num.toString().split(".")[1].length
    } else {
      return 0;
    }
  };

  function mergeChartConfig(defaults, userDefined) {
    var returnObj = {};
    for (var attrname in defaults) {
      returnObj[attrname] = defaults[attrname];
    }
    for (var attrname in userDefined) {
      returnObj[attrname] = userDefined[attrname];
    }
    return returnObj;
  };

  //Javascript micro templating by John Resig - source at http://ejohn.org/blog/javascript-micro-templating/
  var cache = {};

  function tmpl(str, data) {
    // Figure out if we're getting a template, or if we need to
    // load the template - and be sure to cache the result.
    var fn = !/\W/.test(str) ?
      cache[str] = cache[str] ||
      tmpl(document.getElementById(str).innerHTML) :

      // Generate a reusable function that will serve as a template
      // generator (and which will be cached).
      new Function("obj",
        "var p=[],print=function(){p.push.apply(p,arguments);};" +

        // Introduce the data as local variables using with(){}
        "with(obj){p.push('" +

        // Convert the template into pure JavaScript
        str
        .replace(/[\r\t\n]/g, " ")
        .split("<%").join("\t")
        .replace(/((^|%>)[^\t]*)'/g, "$1\r")
        .replace(/\t=(.*?)%>/g, "',$1,'")
        .split("\t").join("');")
        .split("%>").join("p.push('")
        .split("\r").join("\\'") + "');}return p.join('');");

    // Provide some basic currying to the user
    return data ? fn(data) : fn;
  };

  //****************************************************************************************
  function setMeasures(data, config, ctx, height, width, ylabels, reverseLegend, reverseAxis, drawAxis, drawLegendOnData, legendBox) {

    if (config.canvasBackgroundColor != "none") ctx.canvas.style.background = config.canvasBackgroundColor;

    var borderWidth = 0;

    var yAxisLabelWidth = 0;
    var yAxisLabelPos = 0;

    var graphTitleHeight = 0;
    var graphTitlePosY = 0;

    var graphSubTitleHeight = 0;
    var graphSubTitlePosY = 0;

    var footNoteHeight = 0;
    var footNotePosY = 0;

    var yAxisUnitHeight = 0;
    var yAxisUnitPosY = 0;

    var widestLegend = 0;
    var nbeltLegend = 0;
    var nbLegendLines = 0;
    var nbLegendCols = 0;
    var spaceLegendHeight = 0;
    var xFirstLegendTextPos = 0;
    var yFirstLegendTextPos = 0;
    var xLegendBorderPos = 0;
    var yLegendBorderPos = 0;

    var yAxisLabelWidth = 0;
    var yAxisLabelPos = 0;

    var xAxisLabelHeight = 0;
    var xLabelHeight = 0;

    var widestXLabel = 1;

    var leftNotUsableSize = 0;
    var rightNotUsableSize = 0;

    var rotateLabels = 0;
    var xLabelPos = 0;

    // Borders

    if (config.canvasBorders) borderWidth = config.canvasBordersWidth;

    // compute widest X label

    if (drawAxis) {
      ctx.font = config.scaleFontStyle + " " + config.scaleFontSize + "px " + config.scaleFontFamily;
      for (var i = 0; i < data.labels.length; i++) {
        var textLength = ctx.measureText(fmtChartJS(config, data.labels[i])).width;
        //If the text length is longer - make that equal to longest text!
        widestXLabel = (textLength > widestXLabel) ? textLength : widestXLabel;
      }
    }

    // compute Y Label Width

    widestYLabel = 1;

    if (drawAxis) {
      if (ylabels != null) {
        ctx.font = config.scaleFontStyle + " " + config.scaleFontSize + "px " + config.scaleFontFamily;
        for (var i = ylabels.length - 1; i >= 0; i--) {
          if (typeof(ylabels[i]) == "string") {
            if (ylabels[i].trim() != "") {
              var textLength = ctx.measureText(fmtChartJS(config, ylabels[i])).width;
              //If the text length is longer - make that equal to longest text!
              widestYLabel = (textLength > widestYLabel) ? textLength : widestYLabel;
            }
          }
        }
      }
    }

    // yAxisLabel
    leftNotUsableSize = borderWidth + config.spaceLeft
    rightNotUsableSize = borderWidth + config.spaceRight;

    if (drawAxis) {
      if (typeof(config.yAxisLabel) != "undefined") {
        if (config.yAxisLabel.trim() != "") {
          yAxisLabelWidth = (config.yAxisFontSize + config.yAxisLabelSpaceLeft + config.yAxisLabelSpaceRight);
          yAxisLabelPosLeft = borderWidth + config.spaceLeft + config.yAxisLabelSpaceLeft + config.yAxisFontSize;
          yAxisLabelPosRight = width - borderWidth - config.spaceRight - config.yAxisLabelSpaceLeft - config.yAxisFontSize;
        }
      }

      if (config.yAxisLeft) {
        if (reverseAxis == false) leftNotUsableSize = borderWidth + config.spaceLeft + yAxisLabelWidth + widestYLabel + config.yAxisSpaceLeft + config.yAxisSpaceRight;
        else leftNotUsableSize = borderWidth + config.spaceLeft + yAxisLabelWidth + widestXLabel + config.yAxisSpaceLeft + config.yAxisSpaceRight;
      }

      if (config.yAxisRight) {
        if (reverseAxis == false) rightNotUsableSize = borderWidth + config.spaceRight + yAxisLabelWidth + widestYLabel + config.yAxisSpaceLeft + config.yAxisSpaceRight;
        else rightNotUsableSize = borderWidth + config.spaceRight + yAxisLabelWidth + widestXLabel + config.yAxisSpaceLeft + config.yAxisSpaceRight;
      }
    }

    availableWidth = width - leftNotUsableSize - rightNotUsableSize;

    // Title

    if (config.graphTitle.trim() != "") {
      graphTitleHeight = (config.graphTitleFontSize + config.graphTitleSpaceBefore + config.graphTitleSpaceAfter);
      graphTitlePosY = borderWidth + config.spaceTop + graphTitleHeight - config.graphTitleSpaceAfter;
    }

    // subTitle

    if (config.graphSubTitle.trim() != "") {
      graphSubTitleHeight = (config.graphSubTitleFontSize + config.graphSubTitleSpaceBefore + config.graphSubTitleSpaceAfter);
      graphSubTitlePosY = borderWidth + config.spaceTop + graphTitleHeight + graphSubTitleHeight - config.graphSubTitleSpaceAfter;
    }

    // yAxisUnit

    if (drawAxis) {
      if (typeof(config.yAxisUnit) != "undefined") {
        if (config.yAxisUnit.trim() != "") {
          yAxisUnitHeight = (config.yAxisUnitFontSize + config.yAxisUnitSpaceBefore + config.yAxisUnitSpaceAfter);
          yAxisUnitPosY = borderWidth + config.spaceTop + graphTitleHeight + graphSubTitleHeight + yAxisUnitHeight - config.yAxisUnitSpaceAfter;
        }
      }
    }

    topNotUsableSize = borderWidth + config.spaceTop + graphTitleHeight + graphSubTitleHeight + yAxisUnitHeight + config.graphSpaceBefore;

    // footNote

    if (typeof(config.footNote) != "undefined") {
      if (config.footNote.trim() != "") {
        footNoteHeight = (config.footNoteFontSize + config.footNoteSpaceBefore + config.footNoteSpaceAfter);
        footNotePosY = height - config.spaceBottom - borderWidth - config.footNoteSpaceAfter;
      }
    }

    // compute space for Legend
    if (typeof(config.legend) != "undefined") {
      if (config.legend == true) {
        ctx.font = config.legendFontStyle + " " + config.legendFontSize + "px " + config.legendFontFamily;
        if (drawLegendOnData) {
          for (var i = data.datasets.length - 1; i >= 0; i--) {
            if (typeof(data.datasets[i].title) == "string") {

              if (data.datasets[i].title.trim() != "") {
                nbeltLegend++;
                var textLength = ctx.measureText(fmtChartJS(config, data.datasets[i].title)).width;
                //If the text length is longer - make that equal to longest text!
                widestLegend = (textLength > widestLegend) ? textLength : widestLegend;
              }
            }
          }
        } else {
          for (var i = data.length - 1; i >= 0; i--) {
            if (typeof(data[i].title) == "string") {
              if (data[i].title.trim() != "") {
                nbeltLegend++;
                var textLength = ctx.measureText(fmtChartJS(config, data[i].title)).width;
                //If the text length is longer - make that equal to longest text!
                widestLegend = (textLength > widestLegend) ? textLength : widestLegend;
              }
            }
          }
        }

        if (nbeltLegend > 1) {
          widestLegend += config.legendBlockSize + config.legendSpaceBetweenBoxAndText;

          availableLegendWidth = width - config.spaceLeft - config.spaceRight - 2 * (borderWidth) - config.legendSpaceLeftText - config.legendSpaceRightText;
          if (config.legendBorders == true) availableLegendWidth -= 2 * (config.legendBordersWidth) - config.legendBordersSpaceLeft - config.legendBordersSpaceRight;

          maxLegendOnLine = Math.floor((availableLegendWidth + config.legendSpaceBetweenTextHorizontal) / (widestLegend + config.legendSpaceBetweenTextHorizontal));
          nbLegendLines = Math.ceil(nbeltLegend / maxLegendOnLine);

          nbLegendCols = Math.ceil(nbeltLegend / nbLegendLines);

          spaceLegendHeight = nbLegendLines * (config.legendFontSize + config.legendSpaceBetweenTextVertical) - config.legendSpaceBetweenTextVertical + config.legendSpaceBeforeText + config.legendSpaceAfterText;

          yFirstLegendTextPos = height - borderWidth - config.spaceBottom - footNoteHeight - spaceLegendHeight + config.legendSpaceBeforeText + config.legendFontSize;

          xFirstLegendTextPos = config.spaceLeft + (width - config.spaceLeft - config.spaceRight - nbLegendCols * (widestLegend + config.legendSpaceBetweenTextHorizontal) + config.legendSpaceBetweenTextHorizontal) / 2;
          if (config.legendBorders == true) {
            spaceLegendHeight += 2 * config.legendBordersWidth + config.legendBordersSpaceBefore + config.legendBordersSpaceAfter;
            yFirstLegendTextPos -= (config.legendBordersWidth + config.legendBordersSpaceAfter);
            yLegendBorderPos = Math.floor(height - borderWidth - config.spaceBottom - footNoteHeight - spaceLegendHeight + (config.legendBordersWidth / 2) + config.legendBordersSpaceBefore);
            xLegendBorderPos = Math.floor(xFirstLegendTextPos - config.legendSpaceLeftText - (config.legendBordersWidth / 2));
            legendBorderHeight = Math.ceil(spaceLegendHeight - config.legendBordersWidth) - config.legendBordersSpaceBefore - config.legendBordersSpaceAfter;
            legendBorderWidth = Math.ceil(nbLegendCols * (widestLegend + config.legendSpaceBetweenTextHorizontal)) - config.legendSpaceBetweenTextHorizontal + config.legendBordersWidth + config.legendSpaceRightText + config.legendSpaceLeftText;
          }
        }
      }
    }

    // xAxisLabel

    if (drawAxis) {
      if (typeof(config.xAxisLabel) != "undefined") {
        if (config.xAxisLabel.trim() != "") {
          xAxisLabelHeight = (config.xAxisFontSize + config.xAxisLabelSpaceBefore + config.xAxisLabelSpaceAfter);
          xAxisLabelPos = height - borderWidth - config.spaceBottom - footNoteHeight - spaceLegendHeight - config.xAxisLabelSpaceAfter;
        }
      }
    }

    xLabelWidth = 0;

    if (drawAxis && (config.xAxisBottom || config.xAxisTop)) {
      if (reverseAxis == false) {
        widestLabel = widestXLabel;
        nblab = data.labels.length;
      } else {
        widestLabel = widestYLabel;
        nblab = ylabels.length;
      }
      if (config.rotateLabels == "smart") {
        rotateLabels = 0;
        if ((availableWidth + config.xAxisSpaceBetweenLabels) / nblab < (widestLabel + config.xAxisSpaceBetweenLabels)) {
          rotateLabels = 45;
          if (availableWidth / nblab < Math.abs(Math.cos(rotateLabels * Math.PI / 180) * widestLabel)) {
            rotateLabels = 90;
          }
        }
      } else {
        rotateLabels = config.rotateLabels
        if (rotateLabels < 0) rotateLabels = 0;
        if (rotateLabels > 180) rotateLabels = 180;
      }

      if (rotateLabels > 90) rotateLabels += 180;
      xLabelHeight = Math.abs(Math.sin(rotateLabels * Math.PI / 180) * widestLabel) + Math.abs(Math.sin((rotateLabels + 90) * Math.PI / 180) * config.scaleFontSize) + config.xAxisSpaceBefore + config.xAxisSpaceAfter;
      xLabelPos = height - borderWidth - config.spaceBottom - footNoteHeight - spaceLegendHeight - xAxisLabelHeight - (xLabelHeight - config.xAxisSpaceBefore) - config.graphSpaceAfter;
      xLabelWidth = Math.abs(Math.cos(rotateLabels * Math.PI / 180) * widestLabel) + Math.abs(Math.cos((rotateLabels + 90) * Math.PI / 180) * config.scaleFontSize);

      leftNotUsableSize = Max([leftNotUsableSize, borderWidth + config.spaceLeft + xLabelWidth / 2]);
      rightNotUsableSize = Max([rightNotUsableSize, borderWidth + config.spaceRight + xLabelWidth / 2]);
      availableWidth = width - leftNotUsableSize - rightNotUsableSize;
    }

    if (config.xAxisBottom) {
      bottomNotUsableHeightWithoutXLabels = borderWidth + config.spaceBottom + footNoteHeight + spaceLegendHeight + xAxisLabelHeight;
      bottomNotUsableHeightWithXLabels = bottomNotUsableHeightWithoutXLabels + xLabelHeight + config.graphSpaceAfter;
      availableHeight = height - topNotUsableSize - bottomNotUsableHeightWithXLabels;
    } else {
      bottomNotUsableHeightWithoutXLabels = borderWidth + config.spaceBottom + footNoteHeight + spaceLegendHeight + xAxisLabelHeight;
      bottomNotUsableHeightWithXLabels = bottomNotUsableHeightWithoutXLabels + config.graphSpaceAfter;
      availableHeight = height - topNotUsableSize - bottomNotUsableHeightWithXLabels;
    }

    // ----------------------- DRAW EXTERNAL ELEMENTS -------------------------------------------------

    // Draw Borders

    if (borderWidth > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.lineWidth = 2 * borderWidth;
      ctx.strokeStyle = config.canvasBordersColor;
      ctx.moveTo(0, 0);
      ctx.lineTo(0, height);
      ctx.lineTo(width, height);
      ctx.lineTo(width, 0);
      ctx.lineTo(0, 0);
      ctx.stroke();
      ctx.restore();
    }

    // Draw Graph Title

    if (graphTitleHeight > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.font = config.graphTitleFontStyle + " " + config.graphTitleFontSize + "px " + config.graphTitleFontFamily;
      ctx.fillStyle = config.graphTitleFontColor;
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      ctx.translate(config.spaceLeft + (width - config.spaceLeft - config.spaceRight) / 2, graphTitlePosY);
      ctx.fillText(config.graphTitle, 0, 0);
      ctx.stroke();
      ctx.restore();
    }

    // Draw Graph Sub-Title

    if (graphSubTitleHeight > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.font = config.graphSubTitleFontStyle + " " + config.graphSubTitleFontSize + "px " + config.graphSubTitleFontFamily;
      ctx.fillStyle = config.graphSubTitleFontColor;
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      ctx.translate(config.spaceLeft + (width - config.spaceLeft - config.spaceRight) / 2, graphSubTitlePosY);
      ctx.fillText(config.graphSubTitle, 0, 0);
      ctx.stroke();
      ctx.restore();
    }

    // Draw Y Axis Unit

    if (yAxisUnitHeight > 0) {
      if (config.yAxisLeft) {
        ctx.save();
        ctx.beginPath();
        ctx.font = config.yAxisUnitFontStyle + " " + config.yAxisUnitFontSize + "px " + config.yAxisUnitFontFamily;
        ctx.fillStyle = config.yAxisUnitFontColor;
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        ctx.translate(leftNotUsableSize, yAxisUnitPosY);
        ctx.fillText(config.yAxisUnit, 0, 0);
        ctx.stroke();
        ctx.restore();
      }
      if (config.yAxisRight) {
        ctx.save();
        ctx.beginPath();
        ctx.font = config.yAxisUnitFontStyle + " " + config.yAxisUnitFontSize + "px " + config.yAxisUnitFontFamily;
        ctx.fillStyle = config.yAxisUnitFontColor;
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        ctx.translate(width - rightNotUsableSize, yAxisUnitPosY);
        ctx.fillText(config.yAxisUnit, 0, 0);
        ctx.stroke();
        ctx.restore();
      }
    }

    // Draw Y Axis Label

    if (yAxisLabelWidth > 0) {
      if (config.yAxisLeft) {
        ctx.save();
        ctx.beginPath();
        ctx.font = config.yAxisFontStyle + " " + config.yAxisFontSize + "px " + config.yAxisFontFamily;
        ctx.fillStyle = config.yAxisFontColor;
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        ctx.translate(yAxisLabelPosLeft, topNotUsableSize + (availableHeight / 2));
        ctx.rotate(-(90 * (Math.PI / 180)));
        ctx.fillText(config.yAxisLabel, 0, 0);
        ctx.stroke();
        ctx.restore();
      }
      if (config.yAxisRight) {
        ctx.save();
        ctx.beginPath();
        ctx.font = config.yAxisFontStyle + " " + config.yAxisFontSize + "px " + config.yAxisFontFamily;
        ctx.fillStyle = config.yAxisFontColor;
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        ctx.translate(yAxisLabelPosRight, topNotUsableSize + (availableHeight / 2));
        ctx.rotate(+(90 * (Math.PI / 180)));
        ctx.fillText(config.yAxisLabel, 0, 0);
        ctx.stroke();
        ctx.restore();
      }
    }

    // Draw X Axis Label

    if (xAxisLabelHeight > 0) {
      if (config.xAxisBottom) {
        ctx.save();
        ctx.beginPath();
        ctx.font = config.xAxisFontStyle + " " + config.xAxisFontSize + "px " + config.xAxisFontFamily;
        ctx.fillStyle = config.xAxisFontColor;
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        ctx.translate(leftNotUsableSize + (availableWidth / 2), xAxisLabelPos);
        ctx.fillText(config.xAxisLabel, 0, 0);
        ctx.stroke();
        ctx.restore();
      }
    }

    // Draw Legend

    if (nbeltLegend > 1) {
      if (config.legendBorders == true) {
        ctx.save();
        ctx.beginPath();

        ctx.lineWidth = config.legendBordersWidth;
        ctx.strokeStyle = config.legendBordersColors;

        ctx.moveTo(xLegendBorderPos, yLegendBorderPos);
        ctx.lineTo(xLegendBorderPos, yLegendBorderPos + legendBorderHeight);
        ctx.lineTo(xLegendBorderPos + legendBorderWidth, yLegendBorderPos + legendBorderHeight);
        ctx.lineTo(xLegendBorderPos + legendBorderWidth, yLegendBorderPos);
        ctx.lineTo(xLegendBorderPos, yLegendBorderPos);
        ctx.lineTo(xLegendBorderPos + legendBorderWidth, yLegendBorderPos);
        ctx.lineTo(xLegendBorderPos, yLegendBorderPos);
        ctx.lineTo(xLegendBorderPos, yLegendBorderPos + legendBorderHeight);

        ctx.stroke();
        ctx.restore();
      }

      nbcols = nbLegendCols - 1;
      ypos = yFirstLegendTextPos - (config.legendFontSize + config.legendSpaceBetweenTextVertical);
      xpos = 0;

      if (drawLegendOnData) fromi = data.datasets.length;
      else fromi = data.length;

      for (var i = fromi - 1; i >= 0; i--) {
        orderi = i;
        if (reverseLegend) {
          if (drawLegendOnData) orderi = data.datasets.length - i - 1;
          else orderi = data.length - i - 1;
        }

        if (drawLegendOnData) tpof = typeof(data.datasets[orderi].title);
        else tpof = typeof(data[orderi].title)

        if (tpof == "string") {
          if (drawLegendOnData) lgtxt = fmtChartJS(config, data.datasets[orderi].title).trim();
          else lgtxt = fmtChartJS(config, data[orderi].title).trim();
          if (lgtxt != "") {
            nbcols++;
            if (nbcols == nbLegendCols) {
              nbcols = 0;
              xpos = xFirstLegendTextPos;
              ypos += config.legendFontSize + config.legendSpaceBetweenTextVertical;
            } else {
              xpos += widestLegend + config.legendSpaceBetweenTextHorizontal;
            }

            ctx.save();
            ctx.beginPath();

            if (drawLegendOnData) {
              if (typeof data.datasets[orderi].strokeColor == "function") ctx.strokeStyle = data.datasets[orderi].strokeColor("STROKECOLOR", data, config, orderi, -1, 1, -1);
              else if (typeof data.datasets[orderi].strokeColor == "string") ctx.strokeStyle = data.datasets[orderi].strokeColor;
              else ctx.strokeStyle = config.defaultStrokeColor;
            } else {
              if (typeof data[orderi].color == "function") ctx.fillStyle = data[orderi].color("COLOR", data, config, orderi, -1, 1, data[orderi].value);
              else if (typeof data[orderi].color == "string") ctx.strokeStyle = data[orderi].color;
              else ctx.strokeStyle = config.defaultStrokeColor;
            }



            if (legendBox) {
              ctx.lineWidth = 1;
              ctx.moveTo(xpos, ypos);
              ctx.lineTo(xpos + config.legendBlockSize, ypos);
              ctx.lineTo(xpos + config.legendBlockSize, ypos - config.legendFontSize);
              ctx.lineTo(xpos, ypos - config.legendFontSize);
              ctx.lineTo(xpos, ypos);
              ctx.closePath();
              if (drawLegendOnData) {
                if (typeof data.datasets[i].fillColor == "function") ctx.fillStyle = data.datasets[i].fillColor("FILLCOLOR", data, config, i, -1, 1, -1);
                else if (typeof data.datasets[orderi].fillColor == "string") ctx.fillStyle = data.datasets[orderi].fillColor;
                else ctx.fillStyle = config.defaultFillColor;
              } else {
                if (typeof data[orderi].color == "string") ctx.fillStyle = data[orderi].color;
                else ctx.fillStyle = config.defaultFillColor;
              }
              ctx.fill();
            } else {
              ctx.lineWidth = config.datasetStrokeWidth;
              ctx.moveTo(xpos + 2, ypos - (config.legendFontSize / 2));
              ctx.lineTo(xpos + 2 + config.legendBlockSize, ypos - (config.legendFontSize / 2));
            }
            ctx.stroke();
            ctx.restore();
            ctx.save();
            ctx.beginPath();
            ctx.font = config.legendFontStyle + " " + config.legendFontSize + "px " + config.legendFontFamily;
            ctx.fillStyle = config.legendFontColor;
            ctx.textAlign = "left";
            ctx.textBaseline = "bottom";
            ctx.translate(xpos + config.legendBlockSize + config.legendSpaceBetweenBoxAndText, ypos);
            ctx.fillText(lgtxt, 0, 0);
            ctx.stroke();
            ctx.restore();
          }
        }
      }
    }

    // Draw FootNote
    if (config.footNote.trim() != "") {
      ctx.save();
      ctx.font = config.footNoteFontStyle + " " + config.footNoteFontSize + "px " + config.footNoteFontFamily;
      ctx.fillStyle = config.footNoteFontColor;
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      ctx.translate(leftNotUsableSize + (availableWidth / 2), footNotePosY);
      ctx.fillText(config.footNote, 0, 0);
      ctx.stroke();
      ctx.restore();
    }

    clrx = leftNotUsableSize;
    clrwidth = availableWidth;
    clry = topNotUsableSize;
    clrheight = availableHeight;

    return {
      leftNotUsableSize: leftNotUsableSize,
      rightNotUsableSize: rightNotUsableSize,
      availableWidth: availableWidth,
      topNotUsableSize: topNotUsableSize,
      bottomNotUsableHeightWithoutXLabels: bottomNotUsableHeightWithoutXLabels,
      bottomNotUsableHeightWithXLabels: bottomNotUsableHeightWithXLabels,
      availableHeight: availableHeight,
      widestXLabel: widestXLabel,
      rotateLabels: rotateLabels,
      xLabelPos: xLabelPos,
      clrx: clrx,
      clry: clry,
      clrwidth: clrwidth,
      clrheight: clrheight
    };
  };

  // Function for additionalLine (BarLine|Line)

  function drawLinesDataset(animPc, data, config, ctx, vars) {
    var xAxisPosY = vars.xAxisPosY;
    var yAxisPosX = vars.yAxisPosX;
    var valueHop = vars.valueHop;
    var scaleHop = vars.scaleHop;
    var zeroY = vars.zeroY;
    var calculatedScale = vars.calculatedScale;
    var annotateCnt = vars.annotateCnt;

    var totvalue = new Array();
    var maxvalue = new Array();

    for (var i = 0; i < data.datasets.length; i++) {
      for (var j = 0; j < data.datasets[i].data.length; j++) {
        totvalue[j] = 0;
        maxvalue[j] = -999999999;
      }
    }
    for (var i = 0; i < data.datasets.length; i++) {
      for (var j = 0; j < data.datasets[i].data.length; j++) {
        totvalue[j] += data.datasets[i].data[j];
        maxvalue[j] = Max([maxvalue[j], data.datasets[i].data[j]]);
      }
    }

    for (var i = 0; i < data.datasets.length; i++) {

      var prevpt = -1;
      var frstpt = -1;

      if (animPc >= 1) {
        if (typeof(data.datasets[i].title) == "string") lgtxt = data.datasets[i].title.trim();
        else lgtxt = "";
      }

      if (typeof data.datasets[i].strokeColor == "function") {
        ctx.strokeStyle = data.datasets[i].strokeColor("STROKECOLOR", data, config, i, -1, animPc, -1);
      } else if (typeof data.datasets[i].strokeColor == "string") {
        ctx.strokeStyle = data.datasets[i].strokeColor;
      } else ctx.strokeStyle = config.defaultStrokeColor;
      ctx.lineWidth = config.datasetStrokeWidth;
      ctx.beginPath();

      for (var j = 0; j < data.datasets[i].data.length; j++) {
        if (!(typeof(data.datasets[i].data[j]) == 'undefined')) {

          if (prevpt == -1) {
            ctx.moveTo(xPos(j), yPos(i, j));
            frstpt = j;
          } else {
            if (config.bezierCurve) {
              ctx.bezierCurveTo(xPos(j - (j - prevpt) / 2), yPos(i, prevpt), xPos(j - (j - prevpt) / 2), yPos(i, j), xPos(j), yPos(i, j));
            } else {
              ctx.lineTo(xPos(j), yPos(i, j));
            }
          }
          prevpt = j;
          if (animPc >= 1) {
            if (i == 0) divprev = data.datasets[i].data[j];
            else divprev = data.datasets[i].data[j] - data.datasets[i - 1].data[j];
            if (i == data.datasets.length - 1) divnext = data.datasets[i].data[j];
            else divnext = data.datasets[i].data[j] - data.datasets[i + 1].data[j];

            if (typeof(data.labels[j]) == "string") lgtxt2 = data.labels[j].trim();
            else lgtxt2 = "";
            
            if (config.inGraphDataShow) {
              ctx.save();
              ctx.textAlign = config.inGraphDataAlign;
              ctx.textBaseline = config.inGraphDataVAlign;
              ctx.font = config.inGraphDataFontStyle + ' ' + config.inGraphDataFontSize + 'px ' + config.inGraphDataFontFamily;
              ctx.fillStyle = config.inGraphDataFontColor;
              var dotX = yAxisPosX + (valueHop * k),
                dotY = xAxisPosY - animPc * (calculateOffset(config, data.datasets[i].data[j], calculatedScale, scaleHop)),
                paddingTextX = config.inGraphDataPaddingX,
                paddingTextY = config.inGraphDataPaddingY;
              var dispString = tmplbis(config.inGraphDataTmpl, {
                config: config,
                v1: fmtChartJS(config, lgtxt),
                v2: fmtChartJS(config, lgtxt2),
                v3: fmtChartJS(config, 1 * data.datasets[i].data[j]),
                v4: fmtChartJS(config, divprev),
                v5: fmtChartJS(config, divnext),
                v6: fmtChartJS(config, maxvalue[j]),
                v7: fmtChartJS(config, totvalue[j]),
                v8: roundToWithThousands(config, fmtChartJS(config, 100 * data.datasets[i].data[j] / totvalue[j]), config.roundPct),
                v9: fmtChartJS(config, yAxisPosX + (valueHop * k)),
                v10: fmtChartJS(config, xAxisPosY - (calculateOffset(config, data.datasets[i].data[j], calculatedScale, scaleHop))),
              });
              ctx.translate(xPos(j) + paddingTextX, yPos(i, j) - paddingTextY);
              ctx.rotate(config.inGraphDataRotate * (Math.PI / 180));
              ctx.fillText(dispString, 0, 0);
              ctx.restore();
            }
          }
        }
      }

      ctx.stroke();

      if (config.datasetFill) {
        ctx.lineTo(yAxisPosX + (valueHop * (data.datasets[i].data.length - 1)), xAxisPosY - zeroY);
        ctx.lineTo(xPos(frstpt), xAxisPosY - zeroY);
        ctx.lineTo(xPos(frstpt), yPos(i, frstpt));
        ctx.closePath();
        if (typeof data.datasets[i].fillColor == "function") ctx.fillStyle = data.datasets[i].fillColor("FILLCOLOR", data, config, i, -1, animPc, -1);
        else if (typeof data.datasets[i].fillColor == "string") ctx.fillStyle = data.datasets[i].fillColor;
        else ctx.fillStyle = config.defaultFillColor;
        ctx.fill();
      } else {
        ctx.closePath();
      }
      if (config.pointDot) {
        if (typeof data.datasets[i].pointColor == "function") ctx.fillStyle = data.datasets[i].pointColor("POINTCOLOR", data, config, i, -1, animPc, -1);
        else ctx.fillStyle = data.datasets[i].pointColor;
        if (typeof data.datasets[i].pointStrokeColor == "function") ctx.strokeStyle = data.datasets[i].pointStrokeColor("POINTSTROKECOLOR", data, config, i, -1, animPc, -1);
        else ctx.strokeStyle = data.datasets[i].pointStrokeColor;

        ctx.lineWidth = config.pointDotStrokeWidth;
        for (var k = 0; k < data.datasets[i].data.length; k++) {
          if (!(typeof(data.datasets[i].data[k]) == 'undefined')) {
            ctx.beginPath();
            ctx.arc(yAxisPosX + (valueHop * k), xAxisPosY - animPc * (calculateOffset(config, data.datasets[i].data[k], calculatedScale, scaleHop)), config.pointDotRadius, 0, Math.PI * 2, true);
            ctx.fill();
            ctx.stroke();
          }
        }
      }
    };

    function yPos(dataSet, iteration) {
      return xAxisPosY - animPc * (calculateOffset(config, data.datasets[dataSet].data[iteration], calculatedScale, scaleHop));
    };

    function xPos(iteration) {
      return yAxisPosX + (valueHop * iteration);
    };
  }

  function log10(val) {
    return Math.log(val) / Math.LN10;
  };
};
