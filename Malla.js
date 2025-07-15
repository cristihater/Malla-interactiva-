const nodes = [
  { id: "Álgebra I", tipo: "general", semestre: 1, completado: false },
  { id: "Cálculo I", tipo: "general", semestre: 1, completado: false },
  { id: "Álgebra Lineal", tipo: "general", semestre: 2, completado: false },
  { id: "Cálculo II", tipo: "general", semestre: 2, completado: false },
  { id: "Estadística", tipo: "general", semestre: 3, completado: false },
  { id: "Investigación de Operaciones", tipo: "especialidad", semestre: 5, completado: false },
  { id: "Gestión Estratégica", tipo: "profesional", semestre: 9, completado: false }
];

const links = [
  { source: "Álgebra I", target: "Álgebra Lineal" },
  { source: "Cálculo I", target: "Cálculo II" },
  { source: "Cálculo II", target: "Estadística" },
  { source: "Estadística", target: "Investigación de Operaciones" },
  { source: "Investigación de Operaciones", target: "Gestión Estratégica" }
];

const svg = d3.select("svg");
const width = window.innerWidth;
const height = window.innerHeight;

const simulation = d3.forceSimulation(nodes)
  .force("link", d3.forceLink(links).id(d => d.id).distance(150))
  .force("charge", d3.forceManyBody().strength(-400))
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
  .attr("r", 20);

nodeGroup.append("text")
  .text(d => d.id)
  .attr("dy", 4)
  .attr("text-anchor", "middle");

function updateColors() {
  // Recalcular disponibilidad
  const completed = new Set(nodes.filter(n => n.completado).map(n => n.id));
  const dependencies = Object.fromEntries(nodes.map(n => [n.id, []]));

  links.forEach(l => {
    dependencies[l.target].push(l.source);
  });

  nodeGroup.select("circle")
    .attr("fill", d => {
      if (d.completado) return "#aaa"; // gris si ya está completado
      const prereqs = dependencies[d.id] || [];
      const ready = prereqs.every(p => completed.has(p));
      return ready ? "#D81B60" : "#F8BBD0"; // rosado fuerte o rosado claro
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
