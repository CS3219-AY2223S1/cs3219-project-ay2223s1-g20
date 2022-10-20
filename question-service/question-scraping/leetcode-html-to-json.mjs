import cheerio from 'cheerio';
import fs from 'fs';
import { globby } from 'globby';

const main = async() => {
    const paths = await globby(['leetcode-html/*']);
    let results = [];

    let difficulties = [];
    let questionTitles = [];
    let questionDescriptions = [];
    let examplesArray = [];
    let constraintsArray = [];

    paths.forEach((path) => {
        const data = fs.readFileSync(path, { encoding: 'utf8', flag: 'r' });
        const $ = cheerio.load(data);

        //      const qMatch = /^(.+)/.exec($(".content__u3I1").childNodes[1].text());

        $('div[diff]').each(function (i, elem) {
            difficulties[i] = $(this).text();
        });
        $('div#title').each(function (i, elem) {
            questionTitles[i] = $(this).text().replace(/^\d+\./, "").trim();
        });
        // $(".content__u3I1 > div > p").filter((el) => !/Example/.test(el.toString())).text().replace(/Example \d:/g, "").replace(/Constraints:/g, "").replace(/\./g, ".\n").trim()
        $(".content__u3I1 > div").each(function (i, elem) {
            questionDescriptions[i] = $(this).text();
        });
        // $("pre").each(function (i, elem) {
        //     examplesArray[i] = $(this).text();
        //     // examplesArray[i] = $(this).text().split("\n");
        // });
        // $("ul > li").each(function (i, elem) {
        //     constraintsArray[i] = $(this).text();
        // });
        
        difficulties.forEach((diff, index) => {
            results.push({
                difficulty: diff,
                questionTitle: questionTitles[index],
                questionDescription: questionDescriptions[index],
                // examples: examplesArray[index],
                // constraints: constraintsArray[index],
            });
        });
            
    });

    fs.writeFileSync('data.json', JSON.stringify(results));
};

main();