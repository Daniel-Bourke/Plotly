// CREATE THE FUNCTION
// Function when a dropdown option at element "selDataset" is selected
function dropDownSelected(selectedID) {

    // READ IN THE JSON DATA
    d3.json("data/samples.json").then((data) => {


        // SET UP THE DROPDOWN
        // select the dropdown element
        var dropdown = d3.select("#selDataset")
        // Clear dropdown element html
        dropdown.html("");
        // put the options into the dropdown selector
        // Select the metadata array  
        data.metadata.forEach(item => {
            // for each item append the item ID and adds ID to dropdown element
            dropdown.append('option').attr('value', item.id).text(item.id);
        });
        // get the Selected ID from the dropdown element
        dropdown.node().value = selectedID;

        // Filter Metadata based on dropdown selection
        var SelectedMetadata = data.metadata.filter(item => (item.id == selectedID));



        // SET UP THE DEMOGRAPHIC INFO
        // select the Demographic Info / sample metadata
        var DemographicInfo = d3.select("#sample-metadata");
        // Clear Demographic Info html
        DemographicInfo.html("");
        // For each of the key:value pairs in the selected Metadata
        Object.entries(SelectedMetadata[0]).forEach(item => {
            // create a new paragraph line, and convert the key to upper case and paste the text separated by ": "
            DemographicInfo.append("p").text(`${item[0].toUpperCase()}: ${item[1]}`)
        });


        // Filter samples array data based on dropdown selection (while converting string to integer)
        var idSample = data.samples.filter(item => parseInt(item.id) == selectedID);

        // BAR CHART
        // Slice top 10 sample values
        var top10sampleValue = idSample[0].sample_values.slice(0, 10);
        var top10otuID = idSample[0].otu_ids.slice(0, 10);
        var top10otuLabels = idSample[0].otu_labels
        top10sampleValue = top10sampleValue.reverse();
        top10otuID = top10otuID.reverse();
        top10otuLabels = top10otuLabels.reverse();

        // trace for bar
        var trace = {
            y: top10otuID.map(item => 'OTU ' + item),
            x: top10sampleValue,
            type: 'bar',
            orientation: "h",
            text: top10otuLabels.map(item => item.replace(/;/g, ', ')),
            // hoverinfo: 'none',
            marker: {
                color: '#6d757c',
                line: {
                    width: 1
                }
            }
        };

        // layout for bar
        var layout = {
            title: {
                text: `<b>Top 10 OTU's found for Individual ${selectedID}</b> <br><sup>Hover for more detail</sup> `,
                font: {
                    family: 'Ubuntu, sans-serif',
                    size: 24
                }
            },
            xaxis: {
                title: {
                    text: `# of Samples Collected`,
                    font: {
                        family: 'Ubuntu, sans-serif',
                        size: 18
                    }, standoff: 10
                },
                tickfont: {
                    family: 'Ubuntu, sans-serif',
                    size: 12,
                    color: 'dimgrey'
                }

            },
            yaxis: {
                title: {
                    text: `OTU ID`,
                    font: {
                        family: 'Ubuntu, sans-serif',
                        size: 18
                    }
                },
                tickfont: {
                    family: 'Ubuntu, sans-serif',
                    size: 12,
                    color: 'dimgrey'
                }

            },
            paper_bgcolor: '#eee'
        };

        // Plot using Plotly
        Plotly.newPlot('bar', [trace], layout, { responsive: true });




        // BUBBLE CHART
        // extract sample value, OTUID and labels from individual
        var sampleValue = idSample[0].sample_values;
        var otuID = idSample[0].otu_ids;
        var otuLabels = idSample[0].otu_labels

        // trace for bubble chart
        var trace1 = {
            x: otuID,
            y: sampleValue,
            text: otuLabels.map(item => item.replace(/;/g, ', ')),
            mode: 'markers',
            marker: {
                color: otuID,
                colorscale: 'Bluered',
                size: sampleValue
            }
        };

        // layout for bubble chart
        var layout1 = {
            title: {
                text: `<b>OTU's found for Individual ${selectedID}</b> <br><sup>Hover for more detail</sup> `,
                font: {
                    family: 'Ubuntu, sans-serif',
                    size: 24
                }
            },
            xaxis: {
                title: {
                    text: `OTU ID`,
                    font: {
                        family: 'Ubuntu, sans-serif',
                        size: 18
                    }, standoff: 10
                },
                tickfont: {
                    family: 'Ubuntu, sans-serif',
                    size: 12,
                    color: 'dimgrey'
                }
            },
            yaxis: {
                title: {
                    text: `# of Samples Collected`,
                    font: {
                        family: 'Ubuntu, sans-serif',
                        size: 18
                    }, standoff: 1
                },
                tickfont: {
                    family: 'Ubuntu, sans-serif',
                    size: 12,
                    color: 'dimgrey'
                }
            }, showlegend: false,
            paper_bgcolor: '#eee'
        };

        // Plot using Plotly
        Plotly.newPlot('bubble', [trace1], layout1);



        // BONUS: GAUGE CHART
        // select the Gauge
        var guageDisplay = d3.select("#gauge");
        // Clear Gauge html
        guageDisplay.html("");
        // extract washfrequency from individual
        var washFreq = SelectedMetadata[0].wfreq;

        var opacity = 0.5
        // Define Guage data 
        var guageData = [
            {
                domain: { x: [0, 1], y: [0, 1] },
                value: washFreq,
                title: {
                    text: "<b>Belly Button Washing Frequency </b><br><sup>(Scrubs Per Week)</sup> ",
                    font: {
                        family: 'Ubuntu, sans-serif',
                        size: 24
                    }
                },
                type: "indicator",
                mode: "gauge+number",
                gauge: {
                    axis: { range: [0, 9] },
                    bar: { color: "#333333", Line: "small" },
                    steps: [
                        { range: [0, 2], color: `rgba(243, 29, 100, ${opacity})` },
                        { range: [2, 4], color: `rgba(162, 36, 173, ${opacity})` },
                        { range: [4, 6], color: `rgba(106, 56, 179, ${opacity})` },
                        { range: [6, 8], color: `rgba(60, 80, 177, ${opacity})` },
                        { range: [8, 10], color: `rgba(0, 149, 239, ${opacity})` }
                    ],
                    threshold: {
                        value: washFreq
                    }
                }
            }
        ];
        var gaugeLayout = {
            font: { size: "16", color: "#333333", family: "Ubuntu, sans-serif" },
            paper_bgcolor: '#eee'
        };

        // Plot using Plotly
        Plotly.newPlot('gauge', guageData, gaugeLayout);
    });
}


// Randomly select a Test Subject to Start With
d3.json("data/samples.json").then((data) => {
    // get the array containing ID's in a string/text format
    var arrayOfStringIDs = data.names;
    // convert these text values to integers
    var arrayOfIntegerIDs = arrayOfStringIDs.map((i) => Number(i));
    // randomly select one of these ID's
    var randomID = arrayOfIntegerIDs[Math.floor(Math.random() * arrayOfIntegerIDs.length)];
    // start the initial selection on a random id from the list
    dropDownSelected(randomID);
})


// Event on change takes the value and calls the function during dropdown selection
d3.select("#selDataset").on('change', () => {
    dropDownSelected(d3.event.target.value);
});



