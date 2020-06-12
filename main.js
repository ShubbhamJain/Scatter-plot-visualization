fetch(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
)
  .then((response) => response.json())
  .then((res) => {
    createScatterPlot(
      res.map((r) => [
        convertMinAndSec(r.Time),
        r.Year,
        r.Place,
        r.Name,
        r.Nationality,
        r.Doping,
      ])
    );
  });

function convertMinAndSec(str) {
  return new Date(`2010 01 01 00:${str}`);
}

let createScatterPlot = (data) => {
  const width = 920;
  const height = 560;
  const padding = 40;

  let tooltip = d3
    .select(".visHolder")
    .append("div")
    .attr("id", "tooltip")
    .style("position", "absolute")
    .style("padding", "5px")
    .style("background", "lightsteelblue")
    .style("font-size", "11px")
    .style("line-height", "1.6")
    .style("border-radius", "5px")
    .style("font-family", "Arial")
    .style("text-align", "start")
    .style("box-shadow", "2px 2px 10px")
    .style("color", "#000")
    .style("pointer-events", "none")
    .style("opacity", 0);

  const yScale = d3
    .scaleTime()
    .domain([d3.min(data, (d) => d[0]), d3.max(data, (d) => d[0])])
    .range([padding, height - padding]);

  const xScale = d3
    .scaleTime()
    .domain([
      d3.min(data, (d) => new Date(d[1] - 1)),
      d3.max(data, (d) => new Date(d[1] + 1)),
    ])
    .range([padding, width - padding]);

  let svgContainer = d3
    .select(".visHolder")
    .append("svg")
    .attr("id", "svgContainer")
    .attr("height", height)
    .attr("width", width);

  let timeFormatforTime = d3.timeFormat("%M:%S");
  let timeFormatforYear = d3.format("d");
  const xAxis = d3.axisBottom(xScale).tickFormat(timeFormatforYear);
  const yAxis = d3.axisLeft(yScale).tickFormat(timeFormatforTime);

  svgContainer
    .append("g")
    .attr("id", "x-axis")
    .call(xAxis)
    .attr("transform", `translate(0, ${height - padding})`);

  svgContainer
    .append("g")
    .attr("id", "y-axis")
    .call(yAxis)
    .attr("transform", `translate(${padding}, 0)`);

  svgContainer
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .style("stroke", "#000")
    .style("fill", (d) => {
      if (d[5] === "") {
        return "orange";
      } else {
        return "#33adff";
      }
    })
    .attr("cx", (d) => {
      return xScale(d[1]);
    })
    .attr("cy", (d) => {
      return yScale(d[0]);
    })
    .attr("r", 5)
    .attr("data-xvalue", (d) => {
      return d[1];
    })
    .attr("data-yvalue", (d) => {
      return d[0];
    })
    .on("mouseover", (d) => {
      tooltip
        .transition()
        .style("opacity", 1)
        .style("left", d3.event.pageX + 20 + "px")
        .style("top", d3.event.pageY - 45 + "px");
      tooltip
        .html(
          "<p>" +
            d[3] +
            ": " +
            d[4] +
            "</p>" +
            "<p>Time: " +
            timeFormatforTime(d[0]) +
            ", " +
            "Year: " +
            d[1] +
            "</p><br>" +
            (d[5] ? d[5] : "")
        )
        .attr("data-year", d[1]);
    })
    .on("mouseout", () => {
      tooltip.style("opacity", 0);
    });

  svgContainer
    .append("text")
    .attr("id", "sub-heading")
    .attr("x", width / 2 + 100)
    .attr("y", 30)
    .style("font-size", "20px")
    .style("font-weight", "bold")
    .text("Doping in Professional Bicycle Racing");

  let legendElement1 = svgContainer.append("g").attr("id", "legend");
  let legendElement2 = svgContainer.append("g").attr("id", "legend");

  legendElement1
    .selectAll("#legend")
    .append("g")
    .attr("transform", (d, i) => {
      return "translate(0," + (height / 2 - i * 20) + ")";
    });

  legendElement1
    .append("rect")
    .attr("x", width - 40)
    .attr("y", 100)
    .attr("width", 20)
    .attr("height", 20)
    .style("fill", "orange");

  legendElement1
    .append("text")
    .attr("x", width - 44)
    .attr("y", 115)
    .style("text-anchor", "end")
    .text("No doping allegations");

  legendElement2
    .selectAll("#legend")
    .append("g")
    .attr("transform", (d, i) => {
      return "translate(0," + (height / 2 - i * 20) + ")";
    });

  legendElement2
    .append("rect")
    .attr("x", width - 40)
    .attr("y", 135)
    .attr("width", 20)
    .attr("height", 20)
    .style("fill", "#33adff");

  legendElement2
    .append("text")
    .attr("x", width - 44)
    .attr("y", 150)
    .style("text-anchor", "end")
    .text("Riders with doping allegations");
};
