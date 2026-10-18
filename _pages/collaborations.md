---
layout: single
title: "Research Collaborations"
permalink: /collaborations/
author_profile: true
toc: true
toc_label: "Contents"
toc_sticky: true
classes: wide
---


Explore my academic affiliations and research collaborations.

<div class="research-dashboard">
  <h2>Global Research Collaborations</h2>

  <div class="research-controls">
    <label for="map-filter">Filter institutions:</label>
    <select id="map-filter">
      <option value="all">All locations</option>
      <option value="affiliation">Academic affiliations</option>
      <option value="collaboration">Coauthor institutions</option>
    </select>
    <button id="reset-map" type="button">Reset map</button>
  </div>

  <div id="collaboration-map"></div>

  <div id="institution-details" class="research-details">
    <h3>Select an institution</h3>
    <p>Click a marker to explore the institution and related research.</p>
  </div>

  <h2>Coauthor Network</h2>
  <p>Click a researcher or institution to explore their connections.</p>
  <div id="coauthor-network"></div>

  <div id="coauthor-details" class="research-details">
    <h3>Research network</h3>
    <p>Select a node in the graph.</p>
  </div>

  <p>
    <a href="https://scholar.google.com/scholar?q=Alan+Osorio-Mora"
       target="_blank" rel="noopener noreferrer">
      Find my publications on Google Scholar →
    </a>
  </p>
</div>

<link rel="stylesheet"
 href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">

<style>
.research-dashboard {
  margin: 1.5rem 0;
}

.research-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  margin: 1rem 0;
}

.research-controls select,
.research-controls button {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

#collaboration-map {
  height: 480px;
  width: 100%;
  border-radius: 10px;
  margin: 1rem 0;
  z-index: 0;
}

#coauthor-network {
  height: 520px;
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 10px;
  margin: 1rem 0;
}

.research-details {
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 16px;
  margin: 1.5rem 0;
  overflow-wrap: anywhere;
}

.research-details h3 {
  margin-top: 0;
}

@media (max-width: 600px) {
  #collaboration-map { height: 360px; }
  #coauthor-network { height: 450px; }
}
</style>

<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script src="https://unpkg.com/vis-network@9.1.9/standalone/umd/vis-network.min.js"></script>

<script>
(function () {
  "use strict";

  const mapElement = document.getElementById("collaboration-map");
  const networkElement = document.getElementById("coauthor-network");

  if (!mapElement || !networkElement || mapElement.dataset.ready) return;
  mapElement.dataset.ready = "true";

  /*
   * EDIT YOUR RESEARCH DATA HERE.
   * Coordinates point to cities, not exact university buildings.
   * Add only verified affiliations and publications.
   */

  const institutions = [
    {
      id: "rptu",
      name: "RPTU Kaiserslautern-Landau",
      city: "Kaiserslautern, Germany",
      lat: 49.4447,
      lng: 7.7689,
      type: "affiliation",
      description: "Current academic affiliation.",
      url: "https://rptu.de/",
      authors: ["Alan Osorio-Mora"],
      papers: []
    },
    {
      id: "bologna",
      name: "University of Bologna",
      city: "Bologna, Italy",
      lat: 44.4949,
      lng: 11.3426,
      type: "affiliation",
      description: "Doctoral studies and research connections in operations research.",
      url: "https://www.unibo.it/en",
      authors: ["Alan Osorio-Mora", "Paolo Toth", "Daniele Vigo"],
      papers: [
        {
          title: "Effective metaheuristics for the latency location routing problem",
          url: "https://doi.org/10.1111/itor.13294"
        }
      ]
    },
    {
      id: "ubiobio",
      name: "Universidad del Bío-Bío",
      city: "Concepción, Chile",
      lat: -36.8201,
      lng: -73.0444,
      type: "affiliation",
      description: "Previous academic connection and research network.",
      url: "https://www.ubiobio.cl/",
      authors: ["Carlos Rey", "Rodrigo Linfati", "Alan Osorio-Mora"],
      papers: [
        {
          title: "The Multi-Depot Cumulative Vehicle Routing Problem With Mandatory Visit Times and Minimum Delayed Latency",
          url: "https://doi.org/10.1109/ACCESS.2021.3057482"
        }
      ]
    },
    {
      id: "unab",
      name: "Universidad Andrés Bello",
      city: "Santiago, Chile",
      lat: -33.4489,
      lng: -70.6693,
      type: "collaboration",
      description: "Coauthor institution to verify against the publication record.",
      url: "https://www.unab.cl/",
      authors: ["Gustavo Gatica"],
      papers: []
    },
    {
      id: "usach",
      name: "University of Santiago of Chile",
      city: "Santiago, Chile",
      lat: -33.4500,
      lng: -70.6867,
      type: "collaboration",
      description: "Coauthor institution to verify against the publication record.",
      url: "https://www.usach.cl/",
      authors: ["Pedro Palominos"],
      papers: []
    }
  ];

  /*
   * A coauthor's papers establish a link to Alan.
   * Institution links are included only where an institution ID is supplied.
   */
  const coauthors = [
    {
      id: "carlos",
      name: "Carlos Rey",
      institutions: ["ubiobio"],
      papers: []
    },
    {
      id: "paolo",
      name: "Paolo Toth",
      institutions: ["bologna"],
      papers: [
        {
          title: "Effective metaheuristics for the latency location routing problem",
          url: "https://doi.org/10.1111/itor.13294"
        }
      ]
    },
    {
      id: "daniele",
      name: "Daniele Vigo",
      institutions: ["bologna"],
      papers: [
        {
          title: "Effective metaheuristics for the latency location routing problem",
          url: "https://doi.org/10.1111/itor.13294"
        }
      ]
    },
    {
      id: "john",
      name: "John Willmer Escobar",
      institutions: [],
      papers: []
    },
    {
      id: "rodrigo",
      name: "Rodrigo Linfati",
      institutions: ["ubiobio"],
      papers: []
    },
    {
      id: "mauricio",
      name: "Mauricio Soto-Bustos",
      institutions: ["ubiobio"],
      papers: []
    },
    {
      id: "gustavo",
      name: "Gustavo Gatica",
      institutions: ["unab"],
      papers: []
    },
    {
      id: "pedro",
      name: "Pedro Palominos",
      institutions: ["usach"],
      papers: []
    }
  ];

  const institutionMap = new Map(
    institutions.map(item => [item.id, item])
  );

  const filter = document.getElementById("map-filter");
  const resetButton = document.getElementById("reset-map");
  const institutionDetails = document.getElementById("institution-details");
  const coauthorDetails = document.getElementById("coauthor-details");

  function element(tag, text) {
    const node = document.createElement(tag);
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function addLink(parent, text, url) {
    try {
      const parsed = new URL(url);
      if (!["http:", "https:"].includes(parsed.protocol)) {
        parent.appendChild(element("span", text));
        return;
      }

      const link = element("a", text);
      link.href = parsed.href;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      parent.appendChild(link);
    } catch (error) {
      parent.appendChild(element("span", text));
    }
  }

  function showInstitution(institution) {
    institutionDetails.replaceChildren();
    institutionDetails.appendChild(element("h3", institution.name));
    institutionDetails.appendChild(element("p", institution.city));
    institutionDetails.appendChild(element("p", institution.description));

    const website = element("p");
    addLink(website, "Institution website ↗", institution.url);
    institutionDetails.appendChild(website);

    institutionDetails.appendChild(element("h4", "Researchers"));
    const authorList = element("ul");

    institution.authors.forEach(name => {
      authorList.appendChild(element("li", name));
    });

    institutionDetails.appendChild(authorList);

    if (institution.papers.length) {
      institutionDetails.appendChild(element("h4", "Publications"));
      const paperList = element("ul");

      institution.papers.forEach(paper => {
        const item = element("li");
        addLink(item, paper.title, paper.url);
        paperList.appendChild(item);
      });

      institutionDetails.appendChild(paperList);
    }
  }

  // Interactive world map.
  const map = L.map("collaboration-map", {
    scrollWheelZoom: false
  }).setView([10, -15], 2);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  const markerLayer = L.featureGroup().addTo(map);
  const markerMap = new Map();

  institutions.forEach(institution => {
    const color = institution.type === "collaboration"
      ? "#d97706"
      : "#2563eb";

    const marker = L.circleMarker(
      [institution.lat, institution.lng],
      {
        radius: 9,
        color: color,
        fillColor: color,
        fillOpacity: 0.9,
        weight: 2
      }
    );

    marker.bindTooltip(institution.name);
    marker.on("click", () => showInstitution(institution));

    const popup = element("div");
    popup.appendChild(element("strong", institution.name));
    popup.appendChild(element("p", institution.city));

    const button = element("button", "View details");
    button.type = "button";
    button.addEventListener("click", () => showInstitution(institution));
    popup.appendChild(button);

    marker.bindPopup(popup);
    markerMap.set(institution.id, marker);
  });

  function updateMap() {
    markerLayer.clearLayers();

    const visible = institutions.filter(institution =>
      filter.value === "all" || institution.type === filter.value
    );

    visible.forEach(institution => {
      markerMap.get(institution.id).addTo(markerLayer);
    });

    if (visible.length) {
      map.fitBounds(markerLayer.getBounds(), {
        padding: [30, 30],
        maxZoom: 4
      });
    } else {
      map.setView([10, -15], 2);
    }
  }

  filter.addEventListener("change", updateMap);

  // Interactive coauthor graph.
  const nodes = new vis.DataSet([
    {
      id: "alan",
      label: "Alan Osorio-Mora",
      group: "me",
      shape: "dot",
      size: 25
    }
  ]);

  const edges = new vis.DataSet();

  coauthors.forEach(author => {
    nodes.add({
      id: author.id,
      label: author.name,
      group: "author",
      shape: "dot",
      size: 17
    });

    edges.add({
      from: "alan",
      to: author.id,
      color: { color: "#94a3b8", highlight: "#2563eb" }
    });

    author.institutions.forEach(id => {
      const institution = institutionMap.get(id);
      if (!institution) return;

      const nodeId = "inst-" + id;

      if (!nodes.get(nodeId)) {
        nodes.add({
          id: nodeId,
          label: institution.name,
          group: "institution",
          shape: "box"
        });
      }

      edges.add({
        from: author.id,
        to: nodeId,
        dashes: true,
        color: { color: "#cbd5e1" }
      });
    });
  });

  institutions.forEach(institution => {
    if (!nodes.get("inst-" + institution.id)) {
      nodes.add({
        id: "inst-" + institution.id,
        label: institution.name,
        group: "institution",
        shape: "box"
      });
    }
  });

  const network = new vis.Network(
    networkElement,
    { nodes: nodes, edges: edges },
    {
      autoResize: true,
      interaction: {
        hover: true,
        navigationButtons: true,
        keyboard: true
      },
      physics: {
        stabilization: { iterations: 150 },
        barnesHut: {
          gravitationalConstant: -5000,
          springLength: 150
        }
      },
      nodes: {
        borderWidth: 2,
        font: { face: "Arial", size: 14, color: "#202938" }
      },
      groups: {
        me: {
          color: { background: "#2563eb", border: "#1d4ed8" },
          font: { color: "#ffffff" }
        },
        author: {
          color: { background: "#fbbf24", border: "#d97706" }
        },
        institution: {
          color: { background: "#e2e8f0", border: "#64748b" }
        }
      },
      edges: {
        smooth: { type: "dynamic" }
      }
    }
  );

  network.on("click", event => {
    if (!event.nodes.length) return;

    const id = event.nodes[0];

    if (id === "alan") {
      coauthorDetails.replaceChildren(
        element("h3", "Alan Osorio-Mora"),
        element("p", "Research in operations research, logistics, vehicle routing, and optimization.")
      );

      const link = element("p");
      addLink(
        link,
        "Search Google Scholar ↗",
        "https://scholar.google.com/scholar?q=Alan+Osorio-Mora"
      );
      coauthorDetails.appendChild(link);
      return;
    }

    if (id.startsWith("inst-")) {
      const institution = institutionMap.get(id.slice(5));
      if (institution) showInstitution(institution);
      return;
    }

    const author = coauthors.find(item => item.id === id);
    if (!author) return;

    coauthorDetails.replaceChildren();
    coauthorDetails.appendChild(element("h3", author.name));

    if (author.institutions.length) {
      coauthorDetails.appendChild(element("h4", "Institutions"));
      const list = element("ul");

      author.institutions.forEach(institutionId => {
        const institution = institutionMap.get(institutionId);
        if (institution) {
          list.appendChild(element("li", institution.name));
        }
      });

      coauthorDetails.appendChild(list);
    } else {
      coauthorDetails.appendChild(
        element("p", "No verified institution has been added to this record.")
      );
    }

    if (author.papers.length) {
      coauthorDetails.appendChild(element("h4", "Publications"));
      const list = element("ul");

      author.papers.forEach(paper => {
        const item = element("li");
        addLink(item, paper.title, paper.url);
        list.appendChild(item);
      });

      coauthorDetails.appendChild(list);
    } else {
      coauthorDetails.appendChild(
        element("p", "Add verified shared publications to this author's data record.")
      );
    }
  });

  resetButton.addEventListener("click", () => {
    filter.value = "all";
    updateMap();
    map.setView([10, -15], 2);
    network.fit();
  });

  updateMap();

  window.addEventListener("resize", () => {
    map.invalidateSize();
    network.redraw();
  });
})();
</script>
