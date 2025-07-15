const svg = d3.select("svg");
const width = window.innerWidth;
const height = window.innerHeight;

nodes.forEach(n => n.completado = false);

const simulation = d3.forceSimulation(nodes)
  .force("link", d3.forceLink(links).id(d => d.id).distance(160))
  .force("charge", d3.forceManyBody().strength(-500))
  .force("center", d3.forceCenter(width / 2, height / 2));

const link = svg.append("g")
  .selectAll("line")
  .data(links)
  .join("line")
  .attr("class", "link");

const nodeGroup = svg.append("g")
  .selectAll("g")
  .data(nodes)
  .join("g")
  .attr("class", "node")
  .on("click", (event, d) => {
    d.completado = !d.completado;
    updateColors();
  });

nodeGroup.append("circle")
  .attr("r", 25);

nodeGroup.append("text")
  .text(d => d.id)
  .attr("dy", 4)
  .attr("text-anchor", "middle");

function updateColors() {
  const completados = new Set(nodes.filter(n => n.completado).map(n => n.id));
  const dependencias = {};
  nodes.forEach(n => dependencias[n.id] = []);
  links.forEach(l => dependencias[l.target].push(l.source));

  nodeGroup.select("circle")
    .attr("fill", d => {
      if (d.completado) return "#999"; // gris
      const prereq = dependencias[d.id];
      const desbloqueado = prereq.every(p => completados.has(p));
      return desbloqueado ? "#d81b60" : "#f8bbd0"; // fuerte o pastel
    });

  nodeGroup.select("text")
    .style("text-decoration", d => d.completado ? "line-through" : "none");
}

updateColors();

simulation.on("tick", () => {
  link
    .attr("x1", d => d.source.x)
    .attr("y1", d => d.source.y)
    .attr("x2", d => d.target.x)
    .attr("y2", d => d.target.y);

  nodeGroup.attr("transform", d => `translate(${d.x},${d.y})`);
});
