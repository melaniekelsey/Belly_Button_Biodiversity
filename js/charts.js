function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var chartMetadata = data.samples;
    console.log(chartMetadata);
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var chartResultArray = chartMetadata.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var chartResult = chartResultArray[0];
    console.log(chartResult);    
    
    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var gaugeMetadata = data.metadata;
    var gaugeResultArray = gaugeMetadata.filter(sampleObj => sampleObj.id == sample);
    var gaugeResult = gaugeResultArray[0];
    console.log(gaugeResult);
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIDs = chartResult.otu_ids;
    console.log(otuIDs);
    var otuLabels = chartResult.otu_labels;
    console.log(otuLabels);
    var sampleValues = chartResult.sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var sortedOTUIds = otuIDs.slice(0, 10).reverse();
    var yticks = sortedOTUIds.map(x => "OTU " + x);
    // 8. Create the trace for the bar chart. 
    var barData = [{type: 'bar',
      x: sampleValues,
      y: yticks,
      orientation: 'h',
      line: {width: 5},
      text: otuLabels}
    ];
    // 9. Create the layout for the bar chart. 
    var barLayout = {title: "Top 10 Bacteria Cultures Found",
    yaxis: {autorange:'reversed'}

    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

// 1. Create the trace for the bubble chart.
var bubbleData = [{x: otuIDs,
    y: sampleValues,
    text: otuLabels,
    mode: 'markers', 
    marker: {color: otuIDs,
    size: sampleValues}}
   
];

// 2. Create the layout for the bubble chart.
var bubbleLayout = {
    title: 'Bacteria Cultures per Sample',
    showlegend: false,
    height: 600,
    width: 1200,
    xaxis: {title: {text: "OTU ID"}}

};

// 3. Use Plotly to plot the data with the layout.
Plotly.newPlot("bubble", bubbleData, bubbleLayout); 

// 3. Create a variable that holds the washing frequency.
var wFreq = parseFloat(gaugeResult.wfreq);
console.log(wFreq);

// 4. Create the trace for the gauge chart.
    var gaugeData = [{
        value: wFreq,
        type: "indicator",
        mode: "gauge+number",
        title: { text: "Belly Button Washing Frequency"},
        gauge: {
            axis: { range: [null, 10]},
            bar: {color: "black"},
            steps: [
            {range: [0, 2], color: "red"},
            {range: [2, 4], color: "orange"},
            {range: [4, 6], color: "yellow"},
            {range: [6, 8], color: "limegreen"},
            {range: [8, 10], color: "green"}

        ]}
    }];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
        width: 100, height: 100, margin: { t: 0, b: 0 }
     
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}
