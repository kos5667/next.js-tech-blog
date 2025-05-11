/**
 * kos5667/kos5667
 *
 * profile을 수정하는 typescript 구현체.
 */
import * as fs from 'fs';
import * as path from 'path';
import {getMetadataFromMarkdown, parsePostFilename} from './fileUtils';

type PostType = {
    date: string;
    title: string;
    categories: string;
    tags: string[];
}

const postsRoot = path.join(__dirname, '..', 'posts');

function getCategories(): string[] {
    const entries = fs.readdirSync(postsRoot, { withFileTypes: true });

    return entries
        .filter(entry => entry.isDirectory())
        .map(dir => dir.name);
}

// const categories = getCategories();
// console.log('
// 카테고리 목록:', categories);

function getCategoryFiles() {
    const categories = getCategories();

    const posts = [];
    for (const category of categories) {
        const categoryPath = path.join(postsRoot, category);
        const files = fs.readdirSync(categoryPath)
            .filter(file => file.endsWith('.md'));

        for (const file of files) {
            posts.push(getMetadataFromMarkdown(path.join(__dirname, '..', 'posts', category, file)))
        }

        // parsePostFilename(category, files[0])
        // console.log(parsePostFilename(category, files[0]))
    }
    console.log(posts)
}
getCategoryFiles();

const a = {
    title: "제목",
    categories: "카테고리",
    tags: ["tag1", "tag2"]
}
// title: "[백준]10986 나머지 합 풀이"
// excerpt_image: "../assets/images/excerpt-2024-09-24-Algorithm-Backjoon-G310986.png"
// categories: Algorithm
// tags: [Algorithm, Java]
// allow_publishing: true
