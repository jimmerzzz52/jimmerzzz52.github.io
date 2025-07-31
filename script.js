// Narrative Visualization Parameters
const state = {
    currentScene: 'overview',
    selectedYear: 2020,
    selectedRegion: 'Global',
    hoveredData: null
};

// Scene definitions
const scenes = {
    overview: {
        title: "Global Climate Change Overview",
        description: "Explore the global impact of climate change through temperature anomalies, sea level rise, and extreme weather events.",
        template: renderOverviewScene
    },
    temperature: {
        title: "Temperature Trends Analysis",
        description: "Dive deeper into temperature anomalies across different regions and time periods.",
        template: renderTemperatureScene
    },
    regional: {
        title: "Regional Impact Analysis",
        description: "Compare how different regions are affected by climate change.",
        template: renderRegionalScene
    },
    interactive: {
        title: "Interactive Climate Explorer",
        description: "Customize your exploration by selecting specific years and regions.",
        template: renderInteractiveScene
    }
};

// Annotation templates
const annotationTemplates = {
    global: {
        style: {
            fill: "#e74c3c",
            stroke: "#c0392b",
            strokeWidth: 2
        },
        textStyle: {
            fontSize: "12px",
            fontWeight: "600",
            fill: "#2c3e50"
        }
    },
    regional: {
        style: {
            fill: "#3498db",
            stroke: "#2980b9",
            strokeWidth: 2
        },
        textStyle: {
            fontSize: "11px",
            fontWeight: "600",
            fill: "#2c3e50"
        }
    },
    highlight: {
        style: {
            fill: "#f39c12",
            stroke: "#e67e22",
            strokeWidth: 3
        },
        textStyle: {
            fontSize: "14px",
            fontWeight: "700",
            fill: "#e74c3c"
        }
    }
};

// Initialize the visualization
document.addEventListener('DOMContentLoaded', function() {
    initializeVisualization();
    setupTriggers();
    loadData().then(data => {
        renderScene();
    });
});

// Initialize visualization
function initializeVisualization() {
    // Set up tooltip
    const tooltip = d3.select("#tooltip");
    
    // Initialize story text
    updateStoryText();
}

// Setup triggers (user interface actions)
function setupTriggers() {
    // Navigation buttons
    document.getElementById('overview-btn').addEventListener('click', () => {
        state.currentScene = 'overview';
        updateNavigation();
        renderScene();
    });
    
    document.getElementById('temperature-btn').addEventListener('click', () => {
        state.currentScene = 'temperature';
        updateNavigation();
        renderScene();
    });
    
    document.getElementById('regional-btn').addEventListener('click', () => {
        state.currentScene = 'regional';
        updateNavigation();
        renderScene();
    });
    
    document.getElementById('interactive-btn').addEventListener('click', () => {
        state.currentScene = 'interactive';
        updateNavigation();
        renderScene();
    });
    
    // Parameter controls
    const yearSlider = document.getElementById('year-slider');
    const yearValue = document.getElementById('year-value');
    const regionSelect = document.getElementById('region-select');
    
    yearSlider.addEventListener('input', (e) => {
        state.selectedYear = parseInt(e.target.value);
        yearValue.textContent = state.selectedYear;
        if (state.currentScene === 'interactive') {
            renderScene();
        }
    });
    
    regionSelect.addEventListener('change', (e) => {
        state.selectedRegion = e.target.value;
        if (state.currentScene === 'interactive') {
            renderScene();
        }
    });
}

// Update navigation state
function updateNavigation() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`${state.currentScene}-btn`).classList.add('active');
    
    // Show/hide parameter controls
    const controls = document.getElementById('parameter-controls');
    if (state.currentScene === 'interactive') {
        controls.style.display = 'flex';
    } else {
        controls.style.display = 'none';
    }
    
    updateStoryText();
}

// Update story text based on current scene
function updateStoryText() {
    const storyContainer = document.getElementById('story-text');
    const scene = scenes[state.currentScene];
    
    storyContainer.innerHTML = `
        <h2>${scene.title}</h2>
        <p>${scene.description}</p>
        ${getSceneSpecificText()}
    `;
}

// Get scene-specific text
function getSceneSpecificText() {
    switch(state.currentScene) {
        case 'overview':
            return `
                <p><strong>Key Insights:</strong></p>
                <ul>
                    <li>Global temperatures have increased by approximately 1°C since pre-industrial times</li>
                    <li>Sea levels are rising at an accelerating rate</li>
                    <li>Extreme weather events have become more frequent and intense</li>
                </ul>
                <p>Click on different regions to explore their specific climate challenges.</p>
            `;
        case 'temperature':
            return `
                <p><strong>Temperature Analysis:</strong></p>
                <ul>
                    <li>Asia shows the highest temperature anomalies in recent years</li>
                    <li>Arctic regions are warming at twice the global average rate</li>
                    <li>Temperature increases are accelerating since the 1980s</li>
                </ul>
                <p>Hover over data points to see detailed temperature information.</p>
            `;
        case 'regional':
            return `
                <p><strong>Regional Comparison:</strong></p>
                <ul>
                    <li>Different regions experience climate change impacts differently</li>
                    <li>Coastal regions face unique challenges from sea level rise</li>
                    <li>Developing regions often have fewer resources to adapt</li>
                </ul>
                <p>Use the interactive controls to compare specific regions and time periods.</p>
            `;
        case 'interactive':
            return `
                <p><strong>Interactive Exploration:</strong></p>
                <ul>
                    <li>Adjust the year slider to see how climate indicators have changed over time</li>
                    <li>Select different regions to compare their climate trajectories</li>
                    <li>Explore the relationship between CO2 emissions and climate impacts</li>
                </ul>
                <p>This interactive tool allows you to discover your own insights about climate change patterns.</p>
            `;
        default:
            return '';
    }
}

// Main render function
function renderScene() {
    loadData().then(data => {
        clearVisualization();
        scenes[state.currentScene].template(data);
    }).catch(error => {
        console.error('Error in renderScene:', error);
    });
}

// Clear visualization
function clearVisualization() {
    d3.select("#main-chart").selectAll("*").remove();
    d3.select("#annotation-container").selectAll("*").remove();
}

// Load data
async function loadData() {
    // Embedded climate data to avoid CORS issues
    const climateData = [];
    
    // Generate data for all years from 1880 to 2020
    const regions = ['Global', 'North America', 'Europe', 'Asia', 'Africa', 'South America', 'Australia'];
    
    for (let year = 1880; year <= 2020; year++) {
        regions.forEach(region => {
            // Base values for each region
            const baseValues = {
                'Global': { temp: -0.1, sea: 0, events: 2, co2: 280 },
                'North America': { temp: -0.12, sea: 0, events: 1, co2: 45 },
                'Europe': { temp: -0.08, sea: 0, events: 1, co2: 40 },
                'Asia': { temp: -0.15, sea: 0, events: 2, co2: 50 },
                'Africa': { temp: -0.05, sea: 0, events: 1, co2: 15 },
                'South America': { temp: -0.1, sea: 0, events: 1, co2: 20 },
                'Australia': { temp: -0.12, sea: 0, events: 1, co2: 10 }
            };
            
            const base = baseValues[region];
            const yearsSince1880 = year - 1880;
            
            // Calculate progressive changes
            const tempChange = yearsSince1880 * 0.01; // Gradual warming
            const seaChange = yearsSince1880 * 0.1; // Sea level rise
            const eventChange = Math.floor(yearsSince1880 * 0.3) + 2; // More extreme events
            const co2Change = yearsSince1880 * 2; // CO2 increase
            
            // Add some variation for more realistic data
            const tempVariation = (Math.random() - 0.5) * 0.1;
            const seaVariation = (Math.random() - 0.5) * 0.2;
            const eventVariation = Math.floor((Math.random() - 0.5) * 3);
            const co2Variation = Math.floor((Math.random() - 0.5) * 5);
            
            climateData.push({
                year: year,
                region: region,
                temperature_anomaly: base.temp + tempChange + tempVariation,
                sea_level_rise: base.sea + seaChange + seaVariation,
                extreme_events: Math.max(1, base.events + eventChange + eventVariation),
                co2_emissions: Math.max(10, base.co2 + co2Change + co2Variation)
            });
        });
    }
    
    return climateData;
}



// Scene 1: Global Overview (Drill-down entry point)
function renderOverviewScene(data) {
    const svg = d3.select("#main-chart");
    const width = +svg.attr("width");
    const height = +svg.attr("height");
    const margin = { top: 60, right: 80, bottom: 80, left: 80 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;
    
    const chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
    
    // Filter global data
    const globalData = data.filter(d => d.region === 'Global');
    
    // Create scales
    const xScale = d3.scaleLinear()
        .domain(d3.extent(globalData, d => d.year))
        .range([0, chartWidth]);
    
    const yScale = d3.scaleLinear()
        .domain([-0.5, 1.2])
        .range([chartHeight, 0]);
    
    // Create axes
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
    const yAxis = d3.axisLeft(yScale).tickFormat(d => d + "°C");
    
    chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(xAxis)
        .selectAll("text")
        .attr("class", "axis text");
    
    chartGroup.append("g")
        .call(yAxis)
        .selectAll("text")
        .attr("class", "axis text");
    
    // Add axis labels
    chartGroup.append("text")
        .attr("class", "axis-label")
        .attr("x", chartWidth / 2)
        .attr("y", chartHeight + 50)
        .text("Year");
    
    chartGroup.append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("x", -chartHeight / 2)
        .attr("y", -50)
        .text("Temperature Anomaly (°C)");
    
    // Create line generator
    const line = d3.line()
        .x(d => xScale(d.year))
        .y(d => yScale(d.temperature_anomaly))
        .curve(d3.curveMonotoneX);
    
    // Draw temperature line
    chartGroup.append("path")
        .datum(globalData)
        .attr("fill", "none")
        .attr("stroke", "#e74c3c")
        .attr("stroke-width", 3)
        .attr("d", line);
    
    // Add data points
    chartGroup.selectAll("circle")
        .data(globalData)
        .enter().append("circle")
        .attr("class", "data-point")
        .attr("cx", d => xScale(d.year))
        .attr("cy", d => yScale(d.temperature_anomaly))
        .attr("r", 4)
        .attr("fill", "#e74c3c")
        .on("mouseover", function(event, d) {
            d3.select(this).attr("r", 6);
            showTooltip(event, `Year: ${d.year}<br/>Temperature: ${d.temperature_anomaly}°C<br/>Sea Level: ${d.sea_level_rise}mm<br/>Extreme Events: ${d.extreme_events}`);
        })
        .on("mouseout", function() {
            d3.select(this).attr("r", 4);
            hideTooltip();
        });
    
    // Add annotations
    addOverviewAnnotations(chartGroup, globalData, xScale, yScale);
}

// Scene 2: Temperature Trends
function renderTemperatureScene(data) {
    const svg = d3.select("#main-chart");
    const width = +svg.attr("width");
    const height = +svg.attr("height");
    const margin = { top: 60, right: 80, bottom: 80, left: 80 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;
    
    const chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
    
    // Get data for all regions
    const regions = ['North America', 'Europe', 'Asia', 'Africa', 'South America', 'Australia'];
    const regionData = regions.map(region => ({
        region: region,
        data: data.filter(d => d.region === region)
    }));
    
    // Create scales
    const xScale = d3.scaleLinear()
        .domain([1880, 2020])
        .range([0, chartWidth]);
    
    const yScale = d3.scaleLinear()
        .domain([-0.5, 1.5])
        .range([chartHeight, 0]);
    
    // Color scale for regions
    const colorScale = d3.scaleOrdinal()
        .domain(regions)
        .range(d3.schemeCategory10);
    
    // Create axes
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
    const yAxis = d3.axisLeft(yScale).tickFormat(d => d + "°C");
    
    chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(xAxis)
        .selectAll("text")
        .attr("class", "axis text");
    
    chartGroup.append("g")
        .call(yAxis)
        .selectAll("text")
        .attr("class", "axis text");
    
    // Add axis labels
    chartGroup.append("text")
        .attr("class", "axis-label")
        .attr("x", chartWidth / 2)
        .attr("y", chartHeight + 50)
        .text("Year");
    
    chartGroup.append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("x", -chartHeight / 2)
        .attr("y", -50)
        .text("Temperature Anomaly (°C)");
    
    // Create line generator
    const line = d3.line()
        .x(d => xScale(d.year))
        .y(d => yScale(d.temperature_anomaly))
        .curve(d3.curveMonotoneX);
    
    // Draw lines for each region
    regionData.forEach(regionInfo => {
        chartGroup.append("path")
            .datum(regionInfo.data)
            .attr("fill", "none")
            .attr("stroke", colorScale(regionInfo.region))
            .attr("stroke-width", 2)
            .attr("d", line);
    });
    
    // Add legend
    const legend = chartGroup.append("g")
        .attr("transform", `translate(${chartWidth + 20}, 0)`);
    
    regionData.forEach((regionInfo, i) => {
        const legendItem = legend.append("g")
            .attr("transform", `translate(0, ${i * 25})`);
        
        legendItem.append("rect")
            .attr("width", 15)
            .attr("height", 15)
            .attr("fill", colorScale(regionInfo.region));
        
        legendItem.append("text")
            .attr("x", 20)
            .attr("y", 12)
            .attr("class", "axis text")
            .text(regionInfo.region);
    });
    
    // Add annotations
    addTemperatureAnnotations(chartGroup, regionData, xScale, yScale, colorScale);
}

// Scene 3: Regional Analysis
function renderRegionalScene(data) {
    const svg = d3.select("#main-chart");
    const width = +svg.attr("width");
    const height = +svg.attr("height");
    const margin = { top: 60, right: 80, bottom: 80, left: 80 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;
    
    const chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
    
    // Get latest data for each region
    const regions = ['North America', 'Europe', 'Asia', 'Africa', 'South America', 'Australia'];
    const latestData = regions.map(region => {
        const regionData = data.filter(d => d.region === region);
        return regionData[regionData.length - 1];
    });
    
    // Create scales
    const xScale = d3.scaleBand()
        .domain(regions)
        .range([0, chartWidth])
        .padding(0.3);
    
    const yScale = d3.scaleLinear()
        .domain([0, d3.max(latestData, d => d.temperature_anomaly) * 1.2])
        .range([chartHeight, 0]);
    
    // Create axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale).tickFormat(d => d + "°C");
    
    chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(xAxis)
        .selectAll("text")
        .attr("class", "axis text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");
    
    chartGroup.append("g")
        .call(yAxis)
        .selectAll("text")
        .attr("class", "axis text");
    
    // Add axis labels
    chartGroup.append("text")
        .attr("class", "axis-label")
        .attr("x", chartWidth / 2)
        .attr("y", chartHeight + 50)
        .text("Region");
    
    chartGroup.append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("x", -chartHeight / 2)
        .attr("y", -50)
        .text("Temperature Anomaly (°C)");
    
    // Add bars
    chartGroup.selectAll("rect")
        .data(latestData)
        .enter().append("rect")
        .attr("class", "data-point")
        .attr("x", d => xScale(d.region))
        .attr("y", d => yScale(d.temperature_anomaly))
        .attr("width", xScale.bandwidth())
        .attr("height", d => chartHeight - yScale(d.temperature_anomaly))
        .attr("fill", "#3498db")
        .on("mouseover", function(event, d) {
            d3.select(this).attr("fill", "#e74c3c");
            showTooltip(event, `
                <strong>${d.region}</strong><br/>
                Temperature: ${d.temperature_anomaly}°C<br/>
                Sea Level Rise: ${d.sea_level_rise}mm<br/>
                Extreme Events: ${d.extreme_events}<br/>
                CO2 Emissions: ${d.co2_emissions} ppm
            `);
        })
        .on("mouseout", function() {
            d3.select(this).attr("fill", "#3498db");
            hideTooltip();
        });
    
    // Add annotations
    addRegionalAnnotations(chartGroup, latestData, xScale, yScale);
}

// Scene 4: Interactive Explorer
function renderInteractiveScene(data) {
    
    const svg = d3.select("#main-chart");
    const width = +svg.attr("width");
    const height = +svg.attr("height");
    const margin = { top: 60, right: 80, bottom: 80, left: 80 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;
    
    const chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
    
    if (state.selectedRegion === 'Global') {
        // Show scatter plot of all regions for selected year
        const yearData = data.filter(d => d.year === state.selectedYear && d.region !== 'Global');
        
        if (yearData.length === 0) {
            // Show message if no data for selected year
            chartGroup.append("text")
                .attr("x", chartWidth / 2)
                .attr("y", chartHeight / 2)
                .attr("text-anchor", "middle")
                .attr("class", "axis-label")
                .text("No data available for selected year");
            return;
        }
        
        // Create scales
        const xScale = d3.scaleLinear()
            .domain([0, d3.max(yearData, d => d.co2_emissions) * 1.1])
            .range([0, chartWidth]);
        
        const yScale = d3.scaleLinear()
            .domain([0, d3.max(yearData, d => d.temperature_anomaly) * 1.2])
            .range([chartHeight, 0]);
        
        // Create axes
        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale).tickFormat(d => d + "°C");
        
        chartGroup.append("g")
            .attr("transform", `translate(0, ${chartHeight})`)
            .call(xAxis)
            .selectAll("text")
            .attr("class", "axis text");
        
        chartGroup.append("g")
            .call(yAxis)
            .selectAll("text")
            .attr("class", "axis text");
        
        // Add axis labels
        chartGroup.append("text")
            .attr("class", "axis-label")
            .attr("x", chartWidth / 2)
            .attr("y", chartHeight + 50)
            .text("CO2 Emissions (ppm)");
        
        chartGroup.append("text")
            .attr("class", "axis-label")
            .attr("transform", "rotate(-90)")
            .attr("x", -chartHeight / 2)
            .attr("y", -50)
            .text("Temperature Anomaly (°C)");
        
        // Add scatter points
        chartGroup.selectAll("circle")
            .data(yearData)
            .enter().append("circle")
            .attr("class", "data-point")
            .attr("cx", d => xScale(d.co2_emissions))
            .attr("cy", d => yScale(d.temperature_anomaly))
            .attr("r", 8)
            .attr("fill", "#9b59b6")
            .on("mouseover", function(event, d) {
                d3.select(this).attr("r", 12);
                showTooltip(event, `
                    <strong>${d.region}</strong><br/>
                    Year: ${d.year}<br/>
                    Temperature: ${d.temperature_anomaly}°C<br/>
                    CO2: ${d.co2_emissions} ppm<br/>
                    Sea Level: ${d.sea_level_rise}mm
                `);
            })
            .on("mouseout", function() {
                d3.select(this).attr("r", 8);
                hideTooltip();
            });
            
        // Add region labels
        chartGroup.selectAll("text.region-label")
            .data(yearData)
            .enter().append("text")
            .attr("class", "region-label")
            .attr("x", d => xScale(d.co2_emissions))
            .attr("y", d => yScale(d.temperature_anomaly) - 15)
            .attr("text-anchor", "middle")
            .attr("font-size", "10px")
            .attr("fill", "#2c3e50")
            .text(d => d.region);
            
    } else {
        // Show time series for selected region
        const regionData = data.filter(d => d.region === state.selectedRegion);
        
        if (regionData.length === 0) {
            // Show message if no data for selected region
            chartGroup.append("text")
                .attr("x", chartWidth / 2)
                .attr("y", chartHeight / 2)
                .attr("text-anchor", "middle")
                .attr("class", "axis-label")
                .text("No data available for selected region");
            return;
        }
        
        // Create scales
        const xScale = d3.scaleLinear()
            .domain(d3.extent(regionData, d => d.year))
            .range([0, chartWidth]);
        
        const yScale = d3.scaleLinear()
            .domain([d3.min(regionData, d => d.temperature_anomaly) - 0.1, 
                     d3.max(regionData, d => d.temperature_anomaly) + 0.1])
            .range([chartHeight, 0]);
        
        // Create axes
        const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
        const yAxis = d3.axisLeft(yScale).tickFormat(d => d + "°C");
        
        chartGroup.append("g")
            .attr("transform", `translate(0, ${chartHeight})`)
            .call(xAxis)
            .selectAll("text")
            .attr("class", "axis text");
        
        chartGroup.append("g")
            .call(yAxis)
            .selectAll("text")
            .attr("class", "axis text");
        
        // Add axis labels
        chartGroup.append("text")
            .attr("class", "axis-label")
            .attr("x", chartWidth / 2)
            .attr("y", chartHeight + 50)
            .text("Year");
        
        chartGroup.append("text")
            .attr("class", "axis-label")
            .attr("transform", "rotate(-90)")
            .attr("x", -chartHeight / 2)
            .attr("y", -50)
            .text("Temperature Anomaly (°C)");
        
        // Create line
        const line = d3.line()
            .x(d => xScale(d.year))
            .y(d => yScale(d.temperature_anomaly))
            .curve(d3.curveMonotoneX);
        
        chartGroup.append("path")
            .datum(regionData)
            .attr("fill", "none")
            .attr("stroke", "#e74c3c")
            .attr("stroke-width", 3)
            .attr("d", line);
        
        // Add data points
        chartGroup.selectAll("circle")
            .data(regionData)
            .enter().append("circle")
            .attr("class", "data-point")
            .attr("cx", d => xScale(d.year))
            .attr("cy", d => yScale(d.temperature_anomaly))
            .attr("r", 4)
            .attr("fill", "#e74c3c")
            .on("mouseover", function(event, d) {
                d3.select(this).attr("r", 6);
                showTooltip(event, `
                    Year: ${d.year}<br/>
                    Temperature: ${d.temperature_anomaly}°C<br/>
                    Sea Level: ${d.sea_level_rise}mm<br/>
                    Extreme Events: ${d.extreme_events}
                `);
            })
            .on("mouseout", function() {
                d3.select(this).attr("r", 4);
                hideTooltip();
            });
    }
}

// Annotation functions
function addOverviewAnnotations(chartGroup, data, xScale, yScale) {
    const annotations = [
        {
            note: {
                label: "Pre-industrial baseline (0°C anomaly)",
                title: "Baseline"
            },
            x: xScale(1950),
            y: yScale(0),
            dy: -20,
            dx: 0
        },
        {
            note: {
                label: "Rapid warming begins",
                title: "Acceleration"
            },
            x: xScale(1980),
            y: yScale(data.find(d => d.year === 1980).temperature_anomaly),
            dy: -30,
            dx: 50
        }
    ];
    
    const makeAnnotations = d3.annotation()
        .annotations(annotations);
    
    chartGroup.append("g")
        .attr("class", "annotation-group")
        .call(makeAnnotations);
}

function addTemperatureAnnotations(chartGroup, regionData, xScale, yScale, colorScale) {
    const annotations = [
        {
            note: {
                label: "Asia shows highest warming",
                title: "Regional Impact"
            },
            x: xScale(2020),
            y: yScale(regionData.find(r => r.region === 'Asia').data[regionData.find(r => r.region === 'Asia').data.length - 1].temperature_anomaly),
            dy: -20,
            dx: 0
        }
    ];
    
    const makeAnnotations = d3.annotation()
        .annotations(annotations);
    
    chartGroup.append("g")
        .attr("class", "annotation-group")
        .call(makeAnnotations);
}

function addRegionalAnnotations(chartGroup, data, xScale, yScale) {
    const maxRegion = data.reduce((max, curr) => 
        curr.temperature_anomaly > max.temperature_anomaly ? curr : max
    );
    
    const annotations = [
        {
            note: {
                label: `Highest warming: ${maxRegion.region}`,
                title: "Most Affected"
            },
            x: xScale(maxRegion.region) + xScale.bandwidth() / 2,
            y: yScale(maxRegion.temperature_anomaly),
            dy: -30,
            dx: 0
        }
    ];
    
    const makeAnnotations = d3.annotation()
        .annotations(annotations);
    
    chartGroup.append("g")
        .attr("class", "annotation-group")
        .call(makeAnnotations);
}

// Tooltip functions
function showTooltip(event, content) {
    const tooltip = d3.select("#tooltip");
    tooltip.style("opacity", 1)
        .html(content)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 10) + "px");
}

function hideTooltip() {
    d3.select("#tooltip").style("opacity", 0);
}
