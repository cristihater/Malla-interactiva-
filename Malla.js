const nodes = [
  { id: "Álgebra I", tipo: "general", semestre: 1 },
  { id: "Cálculo I", tipo: "general", semestre: 1 },
  { id: "Álgebra Lineal", tipo: "general", semestre: 2 },
  { id: "Cálculo II", tipo: "general", semestre: 2 },
  { id: "Estadística", tipo: "general", semestre: 3 },
  { id: "Investigación de Operaciones", tipo: "especialidad", semestre: 5 },
  { id: "Gestión Estratégica", tipo: "profesional", semestre: 9 }
];

const links = [
  { source: "Álgebra I", target: "Álgebra Lineal" },
  { source: "Cálculo I", target: "Cálculo II" },
  { source: "Cálculo II", target: "Estadística" },
  { source: "Estadística", target: "Investigación de Operaciones" },
  { source: "Investigación de Operaciones", target: "Gestión Estratégica" }
];

const color = {
  general: "#1E88E5",
  especialidad: "#E53935",
  optativa: "#43A047",
  profesional: "#FB8C00"
};

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

const node = svg.append("g")
  .selectAll("g")
  .data(nodes)
  .join("g")
  .attr("class", "node");

node.append("circle")
  .attr("r", 20)
  .attr("fill", d => color[d.tipo]);

node.append("text")
  .text(d => d.id)
  .attr("dy", 4);

simulation.on("tick", () => {
  link
    .attr("x1", d => d.source.x)
    .attr("y1", d => d.source.y)
    .attr("x2", d => d.target.x)
    .attr("y2", d => d.target.y);

  node.attr("transform", d => `translate(${d.x},${d.y})`);
});
