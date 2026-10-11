const width = 1000;
const height = 700;

const svg = d3.select("#network")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

d3.json("/assets/data/coauthors.json").then(data => {

  const simulation = d3.forceSimulation(data.nodes)
    .force("link",
      d3.forceLink(data.links)
        .id(d => d.id)
        .distance(120))
    .force("charge",
      d3.forceManyBody().strength(-400))
    .force("center",
      d3.forceCenter(width/2,height/2));

  const link = svg.append("g")
    .selectAll("line")
    .data(data.links)
    .enter()
    .append("line")
    .attr("stroke","#999")
    .attr("stroke-width",
      d => d.weight);

  const node = svg.append("g")
    .selectAll("circle")
    .data(data.nodes)
    .enter()
    .append("circle")
    .attr("r", d => d.size)
    .attr("fill", d =>
      d.id === "Andres Soto"
      ? "#d62728"
      : "#1f77b4");

  const label = svg.append("g")
    .selectAll("text")
    .data(data.nodes)
    .enter()
    .append("text")
    .text(d => d.id)
    .style("font-size","12px");

  simulation.on("tick", () => {

    link
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);

    node
      .attr("cx", d => d.x)
      .attr("cy", d => d.y);

    label
      .attr("x", d => d.x + 10)
      .attr("y", d => d.y);
  });
});
