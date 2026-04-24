const fs = require("fs");
const path = require("path");
const esbuild = require("esbuild");

function read(file) {
    return fs.readFileSync(file, "utf8");
}

function readDirFiles(dir, ext) {
    let results = [];

    const items = fs.readdirSync(dir, { withFileTypes: true });

    for (const item of items) {
        const fullPath = path.join(dir, item.name);

        if (item.isDirectory()) {
            results.push(readDirFiles(fullPath, ext));
        } else if (item.name.endsWith(ext)) {
            results.push(read(fullPath));
        }
    }

    return results.join("\n");
}

async function build() {
    let html = read("./src/index.html");
    let css = read("./src/styles.css");

    const styles = readDirFiles("./src/styles", ".css");
    const rolltemplates = readDirFiles("./src/rolltemplates", ".html");

    // Bundle JS modules
    const bundle = await esbuild.build({
        entryPoints: ["./src/sheetworkers/main.js"],
        bundle: true,
        write: false,
        format: "iife",
        target: "es2018",
        minify: true
    });

    const workers = bundle.outputFiles[0].text;

    css = css.replace("{{styles}}", styles);

    html = html.replace("{{workers}}", workers);
    html = html.replace("{{rolltemplates}}", rolltemplates);

    // inject components
    const components = fs.readdirSync("./src/components");

    for (const file of components) {
        const name = file.replace(".html", "");
        html = html.replace(
            `{{${name}}}`,
            read(`./src/components/${file}`)
        );
    }

    fs.mkdirSync("./dist", { recursive: true });

    fs.writeFileSync("./dist/Freegliders.html", html);
    fs.writeFileSync("./dist/Freegliders.css", css);

    console.log("Compiled successfully.");
}

build().catch(err => {
    console.error(err);
    process.exit(1);
});