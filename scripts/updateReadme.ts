/**
 * kos5667/kos5667
 *
 * profile을 수정하는 typescript 구현체.
 */
import * as fs from 'fs';
import * as path from 'path';
import { getMetadataFromMarkdown, parsePostFilename, getCategoryFiles } from './fileUtils';

const postsRoot = path.join(__dirname, '..', 'posts');

function getPostContent() {
    const categories = getCategoryFiles(postsRoot);

    const posts = [];
    for (const category of categories) {
        const categoryName = category.length > 1 ? category.join('/') : category[0];
        const categoryPath = path.join(postsRoot, categoryName);

        const files = fs.readdirSync(categoryPath)
            .filter(file => file.endsWith('.md'));

        for (const file of files) {
            const file_path = path.join(__dirname, '..', 'posts', categoryName, file)
            const meta = { ...getMetadataFromMarkdown(file_path) };

            if (Object.keys(meta).length === 0)
                continue;

            posts.push({
                ...meta,
                ...parsePostFilename(file),
                category: category,
                path: file_path,
            });
        }
    }
    console.log(posts);
    return posts;
}

getPostContent()



// 2025-05-07 [Java] Spring 사용법. `new`
// 2025-05-07 [Java][SpringBoot][AOP]

// Spring 사용법.
// 00000000000000000000
// aop, annotation, aspect

// 2025-05-08 [NodeJS] express 사용법 `update`

// title: "[백준]10986 나머지 합 풀이"
// excerpt_image: "../assets/images/excerpt-2024-09-24-Algorithm-Backjoon-G310986.png"
// categories: Algorithm
// tags: [Algorithm, Java]
// allow_publishing: true
