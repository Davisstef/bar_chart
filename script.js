var drawBarChart = function(data, options, element){

  //enable bar chart options

  if(options.barSpacing){
    barSpacing = options.barSpacing;
  }
  if(options.valuePosition){
    barValuePosition = options.valuePosition;
  }
  if(options.title){
    barChartTitle = options.title;
  }
  if(options.titleFontSize){
    titleFontSize = options.titleFontSize;
  }
  if(options.titleColour){
    titleFontColour = options.titleColour;
  }
  if(options.width){
    barChartWidth = options.width;
  }
  if(options.height){
    barChartHeight = options.height;
  }

  //create bar chart outline located at element parameter
  var barChart = $(element);
  var table = $(`<table style="height: ${barChartHeight}; width: ${barChartWidth}" class='barChart'></table>`);
  table.prependTo(barChart);

  //add a title to bar chart
  var title = $(`<h1 id='title'
    style='color: ${titleFontColour};
    font-size: ${titleFontSize};'
    >${barChartTitle}
    </h1>`);
  title.prependTo(barChart);

  //make a variable that will contain an array of the y-values and be used to determine y increment
  var yArray = [];
  //make a variable that will contain the increment the y ayis will contain
  var yAxisInc = 1;

  //fill yArray with y values inputed by user
  for(var yValue in data){
    if(typeof data[yValue] === 'object'){
      for(var stackIndex=0; stackIndex < data[yValue]["inputValue"].length; stackIndex++){
        yArray.push(data[yValue]["inputValue"][stackIndex]);
      }
    } else{
      yArray.push(data[yValue]);
    }
  }
  //sort yArray and make a loop to determine if increment should be increased based on array range
  yArray.sort(function(a, b){
    return a - b;
  });
  while(yArray[yArray.length - 1] > yAxisInc * 5){
    yAxisInc *= 5;
  }
  //make variable that will be displayed on y ayis
  var yAxis = yAxisInc;

  //make a variable containing may domain value
  var yMax = yAxisInc;
  while(yMax < yArray[yArray.length - 1]){
    yMax += yAxisInc;
  }

  // console.log(yArray);

  var tableRow = $("<tr></tr>");
  tableRow.appendTo(table);

  //make a column for y axis values
  var yCell = $("<td class='yCell'></td>");
  var yColumn = $("<table class='yTable'></table>").appendTo(yCell);
  yCell.appendTo(tableRow);
  //add values to y column
  while(yMax + yAxisInc > yAxis){
    $(`<tr><th class='yAxis'>${yAxis}-<th></tr>`).prependTo(yColumn);
    yAxis += yAxisInc;
  }

  //create labels and bars for each property given
  for(var property in data){
    //for stacked data
    if(typeof data[property] === 'object'){
      var stackedData = data[property];
      var subTable = $(`<table style='width: ${barSpacing}' class='subTable'</table>`);
      var maxHeight;
      var prevHeight = 0;

      //make array linking values with colours in order to keep connection after sorting value array
      var currentColour = '';
      var stackArray = [];
      for(var i=0; i < stackedData["inputValue"].length; i++){
        var tempArray = [];
        tempArray.push(stackedData["inputValue"][i]);
        tempArray.push(stackedData["inputCatColour"][i]);
        stackArray.push(tempArray);
      }
      stackedData["inputValue"].sort(function (a, b) {  return a - b;  });

      for(var i=0; i < stackedData["inputValue"].length; i++){
        var orderedColour = '';
        for(var k=0; k < stackedData["inputValue"].length; k++){
          if(stackedData["inputValue"][i] === stackArray[k][0]){
            orderedColour = stackArray[k][1];
          }
        }
        //make variable to keep track of bar width
        var heightPercent = (stackedData["inputValue"][i] / yMax) * 100;
        // console.log(stackedData["inputCatColour"], heightPercent);
        var row = $("<tr></tr>");
        var bar = $(`<td style="
        height: ${heightPercent - prevHeight}%;
        background-color: ${orderedColour};
        vertical-align: ${barValuePosition}"
        class='bar'>${stackedData["inputValue"][i]}</td>`);

        bar.appendTo(row);
        row.prependTo(subTable);
        prevHeight = heightPercent;
      }

      //make variables for html table tags
      var empty = $(`<tr><td style="height: ${100 - maxHeight}%;" class='empty'></td></tr>`);
      var tableCell = $("<td class='dataCell'></td>");

      empty.prependTo(subTable);
      subTable.appendTo(tableCell);
      tableCell.appendTo(tableRow);
    }else{
      //select correct colour for current property
      var barColour = 'lightblue';
      for(var prop in options){
        if(prop == property + "BarColour"){
          barColour = options[prop];
        }
      }

      //make variable to keep track of bar width
      var heightPercent = (data[property] / yMax) * 100;

      //make variables for html table tags
      var subTable = $(`<table style='width: ${barSpacing}' class='subTable'</table>`);
      var row = $("<tr></tr>");
      var bar = $(`<td style="
        height: ${heightPercent}%;
        background-color: ${barColour};
        vertical-align: ${barValuePosition}"
        class='bar'>${data[property]}</td>`);
      var empty = $(`<tr><td style="height: ${100 - heightPercent}%;" class='empty'></td></tr>`);
      var tableCell = $("<td class='dataCell'></td>");

      bar.appendTo(row);
      empty.appendTo(subTable);
      row.appendTo(subTable);
      subTable.appendTo(tableCell);
      tableCell.appendTo(tableRow);
    }
  }

  //add table row for x labels
  var xRow = $("<tr></tr>");
  //add a placeholder
  $("<th></th>").appendTo(xRow);
  xRow.appendTo(table);
  for(var property in data){
    if(typeof data[property] === 'object'){
      //change label to chosen colour
      var labelColour = data[property]["inputLabelColour"];
    }else{
      var labelColour = 'black';
    }
    //change label to chosen colour
    for(var prop in options){
      if(prop == property + "LabelColour"){
        labelColour = options[prop];
      }
    }
    var xLabel = $(`<th style="color: ${labelColour}" class='xLabel'><p>${property}</p></th>`);
    xLabel.appendTo(xRow);
  }
}

//variable to keep track of user inputed data in order to select and delete
var track = 0;

//function that adds users input for label and value for bar chart
var customizeInput = function(){
  var inputLabel = $(".inputLabel")[0].value;
  var inputValue = $(".inputValue")[0].value;

  //bool var to check if label is already in data object
  var inObj = false;
  for(var property in testData){
    if(property == inputLabel){
      inObj = true;
    }
  }
  //make conditions to make sure inputed value is a non negative number
  if((Number(inputValue) || inputValue == 0) && inputValue >= 0 && !(inObj) ){
    testData[inputLabel] = inputValue;
    $(`<p id='p${track}'>
    <span id='sp${track}'>${inputLabel}: </span><button id='${track}' class='remove'>Remove</button></p>`)
    .prependTo("#userInput");
    testOptions[inputLabel+"LabelColour"] = currentLabelColour;
    testOptions[inputLabel+"BarColour"] = currentBarColour;
    //add event listener to "remove" button to delete label and value from chart
    $(".remove").click(removeInput);
    track++;
    newChart();
  }
}

//function that removes specified value and key from chart
var removeInput = function(event){
  spTrack = event.target.id;
  var par = $(`#p${spTrack}`);
  var item = $(`#sp${spTrack}`);
  var str = item[0].innerHTML;
  var rmKey = str.split(":")[0];

  delete testData[rmKey];
  par.remove();
  newChart();
}

//function that clears old graph and calls drawBarChart function
var newChart = function (){
  $(".barChart").remove();
  $("#title").remove();
  drawBarChart(testData, testOptions, testElement);
}

//add event listener to change bar spacing
$(".barSpacing").click(function(){
  testOptions['barSpacing'] = $('.inputSpacing')[0].value;
  newChart();
})

//adding event listener to change colour of label and bar
var currentBarColour = "blue";
var currentLabelColour = "black";
$('.inputLabelColour').change(function(e){
currentLabelColour = e.target.value;
});
$('.inputBarColour').change(function(e){
currentBarColour = e.target.value;
});

// event listener that adds user input when "add to chart" button is clicked
$(".inputData").click(customizeInput);

//add event listener that changes width and height to users input
$(".inputDim").click(function(){
  testOptions["height"] = $('.inputHeight')[0].value;
  testOptions["width"] = $('.inputWidth')[0].value;
  newChart();
});

//event listener to track title colour and store it in a variable
var currentTitleColour = 'black';
$(".inputFontColour").change(function(e){
  currentTitleColour = e.target.value;
})
//add event listener that chagnes chart title to users input
$(".changeTitle").click(function(){
  testOptions["title"] = $('.inputTitle')[0].value;
  testOptions["titleFontSize"] = $('.inputFontSize')[0].value;
  testOptions["titleColour"] = currentTitleColour;
  newChart();
})

//add event listeners to top mid and bot radio buttons
var setPosition = function(){
  if($('#positionTop')[0].checked){
    testOptions["valuePosition"] = 'top';
  }else if($('#positionMiddle')[0].checked){
    testOptions["valuePosition"] = 'middle';
  }else if($('#positionBottom')[0].checked){
    testOptions["valuePosition"] = 'bottom';
  }
  newChart();
}
$('#positionTop').click(setPosition);
$('#positionMiddle').click(setPosition);
$('#positionBottom').click(setPosition);

//add toggle to stacked and single chart options
$("#stacked").attr("class", "hidden");
$(".toggleType").click(function(){
  if(!testOptions["stacked"]){
    $("#stacked").attr("class", "show");
    $("#single").attr("class", "hidden");
    testOptions["stacked"] = true;
  } else{
    $("#single").attr("class", "show")
    $("#stacked").attr("class", "hidden");
    testOptions["stacked"] = false;
  }
})

//add event listener to add catagory button that adds catagory options for user
$(".addCat").click(function(){
  var newCat =
    `<div>
      Catagory Name:
      <input placeholder='text' class="inputCat" type="text" name="Catagory">
      Catagory Colour: <input
      placeholder='Colour'
      class="inputCatColour"
      type="color"
      name="catColour">
      Value:
      <input placeholder='number' class="inputValue" type="text" name="Value">
      <button class='removeCat'>Remove Catagory</button>
      <br>
    </div>`
  $(".addCatagory").append(newCat);

  //add option to remove added catagory
  $(".removeCat").click(function(e){
    var catDiv = e.target.parentElement;
    catDiv.remove();
  })
})

//add event listener to add stacked data to chart
$(".inputStackedData").click(function(e){

  var stackedObj = {
    inputLabel: '',
    inputCat: [],
    inputCatColour: [],
    inputValue: []
  }
  //function that searches for input tags and stores target value in array
  var inputSearch = function(inputTag, obj){

    for(var idx=0; idx < inputTag.length; idx++){
      if(inputTag[idx].tagName == "DIV"){
        inputSearch(inputTag[idx].children);
      }else if(inputTag[idx].tagName == "INPUT"){
        stackedObj[inputTag[idx].className].push(inputTag[idx].value);
      }
    }
  }
  var stackedDiv = e.target.parentElement.children

  for(var k=0; k < stackedDiv.length; k++){
    if(stackedDiv[k].tagName == "INPUT"){
      stackedObj[stackedDiv[k].className] = stackedDiv[k].value;
    }else if(stackedDiv[k].tagName == "DIV"){
      inputSearch(stackedDiv[k].children);
    }
  }
  //make sure label names are unique
  for(var props in testData){
    if(props === stackedObj["inputLabel"]){
      return;
    }
  }
  //make sure input value is a number
  if((!Number(stackedObj["inputLabel"]) || stackedObj["inputLabel"] == 0) && stackedObj["inputLabel"] <= 0){
    return;
  }

  var stackTable = $(`<table id='${stackedObj['inputLabel']}-table' class='stackTable'></table>`);
  var row = $("<tr></tr>").appendTo(stackTable);
  var labelHeader = $(`<th colspan='2' class='labelHeader' >${stackedObj["inputLabel"]}</th>`).appendTo(row);
  for(var i=0; i < stackedObj["inputValue"].length; i++){
    var stackRow = $("<tr></tr>");
    var colourCell = $(`<td class='colourCell' style="background-color: ${stackedObj['inputCatColour'][i]};" ></td>`);
    var catCell = $(`<td class='catCell' >${stackedObj['inputCat'][i]}</td>`);

    colourCell.appendTo(stackRow);
    catCell.appendTo(stackRow);
    stackRow.appendTo(stackTable);
  }

  var removeStack = $(`<button id='${stackedObj['inputLabel']}-remove' class='removeStack'>Remove</button>`).appendTo(stackTable);
  stackTable.appendTo("#barChart");
  //event listener for remove button
  removeStack.click(function(e){
    var targetLabel = e.currentTarget.id.split("-")[0];
    //remove key
    e.currentTarget.parentElement.remove();
    //remove bar
    delete testData[targetLabel];
    newChart();
  })


  testData[stackedObj["inputLabel"]] = stackedObj;
  newChart(testData, testOptions, testElement);
})


var testData = {};
var testOptions = {
  width: '80%',
  height: '400px',
  title: 'Bar Chart Title',
  titleFontSize: '2em',
  titleColour: 'black',
  valuePosition: 'middle',
  barSpacing: '80%',
  stacked: false
};
var testElement = "#barChart";

drawBarChart(testData, testOptions, testElement);
