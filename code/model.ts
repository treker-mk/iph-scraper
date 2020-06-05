export interface Report {
    day: number;
    month: number;
    year: number;
    url: string;
    title: string;
}


export async function downloadUrl(url: string) {
    console.log(`fetching ${url}`);
    const response = await fetch(url);
    const result = await response.text();
    return result;
}