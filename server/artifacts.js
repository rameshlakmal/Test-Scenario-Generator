const fs = require("node:fs");
const path = require("node:path");
const matter = require("gray-matter");

function loadArtifacts(artifactsDir) {
  const dir = artifactsDir || path.join(__dirname, "..", "artifact-templates");
  const entries = fs.existsSync(dir) ? fs.readdirSync(dir) : [];

  const artifacts = [];
  for (const name of entries) {
    if (!name.toLowerCase().endsWith(".md")) continue;
    const fullPath = path.join(dir, name);
    const rawFile = fs.readFileSync(fullPath, "utf8");

    const parsed = matter(rawFile);
    const id = (parsed.data && parsed.data.id) || path.basename(name, ".md");
    const title = (parsed.data && parsed.data.title) || id;
    const type = (parsed.data && parsed.data.type) || "document";
    const tags = Array.isArray(parsed.data && parsed.data.tags) ? parsed.data.tags : [];

    artifacts.push({
      id: String(id),
      title: String(title),
      type: String(type),
      tags: tags.map((t) => String(t)),
      markdown: rawFile,
      fileName: name
    });
  }

  artifacts.sort((a, b) => a.id.localeCompare(b.id));
  return artifacts;
}

module.exports = {
  loadArtifacts
};
