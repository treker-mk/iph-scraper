import { writeJson } from "https://deno.land/std/fs/write_json.ts";
import cheerio from "https://dev.jspm.io/cheerio@1.0.0-rc.3";
import { Report, downloadUrl } from "./model.ts";

async function main() {
    let index = 1;

    // await writeFileStr(`html/search.${index}.html`, result);
    // console.log(`Wrote page ${index} of search results html`);
    const result = await downloadSearchUrl(index);
    const $ = cheerio.load(result);
    const resultCount = parseInt($("#search-results-count").text());
    const pages =
        resultCount % 10 === 0
            ? resultCount / 10
            : ((resultCount / 10) | 0) + 1;

    const reports = processSearchResults(result);

    for (index = 2; index <= pages; index++) {
        reports.push(...processSearchResults(await downloadSearchUrl(index)));
    }

    await writeJson("json/search-results.json", reports, {spaces: 2});
    console.log("Done!");
}

function processSearchResults(searchResult: string) {
    const results: Report[] = [];
    const $ = cheerio.load(searchResult);
    $(".search-entry-text a").each((index: number, item: any) => {
        const element = $(item);
        const title: string = element.text();
        const dateMatch = title.match(/(\d+)\.(\d+)\.(\d+)/);
        if (!dateMatch) {
            return;
        }
        const day = parseInt(dateMatch[1]);
        const month = parseInt(dateMatch[2]);
        const year = parseInt(dateMatch[3]);

        const url = element.attr("href");
        results.push({
            day,
            month,
            year,
            url,
            title
        });
    });
    return results;
}

// for (let index = 1; index < 14; index++) {
// }

function downloadSearchUrl(index: number) {
    return downloadUrl(
        `https://www.iph.mk/page/${index}/?s=%D0%9F%D0%BE%D0%B4%D0%B0%D1%82%D0%BE%D1%86%D0%B8+%D0%B7%D0%B0+COVID-19+%D0%B7%D0%B0`
    );
}



main();