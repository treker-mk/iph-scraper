import { writeFileStr } from "https://deno.land/std/fs/write_file_str.ts";
import { readJson } from "https://deno.land/std/fs/read_json.ts";
import { exists } from "https://deno.land/std/fs/exists.ts";
import { Report, downloadUrl } from "./model.ts";

const reports = await readJson("json/search-results.json") as Report[];

for (const report of reports) {
    let folder:string;
    if (report.title.startsWith("Податоци")) {
        folder = "podatoci";
    } else if (report.title.startsWith("Состојба")) {
        folder = "sostojba";
    } else {
        folder = "unknown";
    }
    const filename = `html/reports/${folder}/${report.year}-${report.month}-${report.day}.html`;

    if (await exists(filename)) {
        console.log(`Conflict on ${filename} and ${report.title}`);
        continue;
    }

    const result = await downloadUrl(report.url);
    await writeFileStr(filename, result);
    console.log(`Wrote ${filename}`);
}

console.log("Done!");