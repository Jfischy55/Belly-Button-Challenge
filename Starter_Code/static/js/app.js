// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    console.log(data);
    // get the metadata field
    let metaData = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let result = metaData.filter(sampleResult => sampleResult.id == sample);

    // Use d3 to select the panel with id of `#sample-metadata`
    let resultData = result[0];

    // Use `.html("") to clear any existing metadata
    d3.select("#sample-metadata").html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(resultData).forEach(([key, value]) => {
      d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
    });
  });
};

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let sampleData = data.samples;

    // Filter the samples for the object with the desired sample number
    let result = sampleData.filter(sampleResult => sampleResult.id == sample);

    let resultData = result[0];
    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = resultData.otu_ids;
    let otu_labels = resultData.otu_labels;
    let sample_values = resultData.sample_values;

    // Build a Bubble Chart
    function buildBubble(sample) {

      let bubbleChart = {
        y: sample_values,
        x: otu_ids,
        text: otu_labels,
        mode: "markers",
        marker: {
          size: sample_values,
          color: otu_ids
        }
      };

      let layout = {
        title: "Bacteria Culture Per Sample",
        hovermode: "closest",
        xaxis: {title: "OTU ID"},
        yaxis: {title: "Number of Bacteria"}
      };
    // Render the Bubble Chart
      Plotly.newPlot("bubble", [bubbleChart], layout)
    };

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    function buildBar(sample){
    
      let yticks = otu_ids.slice(0, 10).map(id => `OTU $(id)`);
      let xValues = sample_values.slice(0, 10);
      let textLabels = otu_labels.slice(0, 10);
      
      let barChart = {
        y: yticks.reverse(),
        x: xValues.reverse(),
        text: textLabels.reverse(),
        type: "bar",
        orientation: "h"
      };

      let layout = {
        title: "Top 10 Bacteria Cultures Found"
    };

    // Render the Bar Chart
      Plotly.newPlot("bar", [barChart], layout)
  };
})};

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    // Use d3 to select the dropdown with id of `#selDataset`
    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    // Get the first sample from the list
    // Build charts and metadata panel with the first sample
    let sampleNames = data.names;
    sampleNames.forEach((sample) => {
      select.append("option").text(sample).property("value", sample);
    });
    let sample1 = sampleNames[0];
    buildMetadata(sample1);
    buildBubble(sample1);
    buildBar(sample);
  });
};

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildMetadata(item);
  buildBubble(item);
  buildBar(item);
}

// Initialize the dashboard
init();
