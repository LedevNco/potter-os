import { json } from '@sveltejs/kit';
import * as fs from 'fs';


export async function GET({ request }) {
    let extensions = [];

    const directories = fs.readdirSync("./src/lib/extensions", { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);


    for (const directory of directories) {
        const manifest = JSON.parse(fs.readFileSync("./src/lib/extensions/" + directory + "/extension.json", "utf8"));
        extensions.push(manifest);
    }


    return json(
        extensions
    );
}