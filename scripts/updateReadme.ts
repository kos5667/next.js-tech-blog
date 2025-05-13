/**
 * kos5667/kos5667
 *
 * profile을 수정하는 typescript 구현체.
 */
import * as fs from 'fs';
import * as path from 'path';
import * as icons from 'simple-icons';
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
            const filePath = path.join(__dirname, '..', 'posts', categoryName, file)
            const meta = { ...getMetadataFromMarkdown(filePath) };

            if (Object.keys(meta).length === 0)
                continue;

            posts.push({
                ...meta,
                ...parsePostFilename(file),
                category: category,
                path: filePath,
            });
        }
    }
    return posts;
}

function findIconByName(name: string) {
    const iconList = Object.values(icons) as { title: string; hex: string; slug: string; }[];
    return iconList.find(icon => icon.title?.toLowerCase() === name.toLowerCase());
}

function getRandomHexColor(): string {
    return `${Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0')}`;
}


/**
 * 최근 등록된 포스터
 */
function newPosts(postContents: any[]): ReturnType<typeof getPostContent> {
    return postContents.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
}

/**
 * 최근 수정된 포스터
 */
function updatedPosts(): ReturnType<typeof getPostContent> | null  {
    return null;
}

/**
 * README에 표출할 선별된 컨텐츠를 작성한다.
 * @param posts
 */
function buildReadmeContents(posts: any[]): string {
    const github = '/kos5667/next.js-tech-blog/blob/main/posts';
    const iconsURL = 'https://img.shields.io/badge/'

    let contents = '';
    for (const post of posts) {
        contents += `### ${post.date} [${post.title}](${path.join(github, post.category.join('/'), post.filename)})\n`

        if (post.description) contents += `${post.description}\n\n`

        const logoColor = 'white';
        const style = 'flat'; // Possible values: [flat, flat-square, plastic, for-the-badge, social]
        if (post.tags.length > 0) {
            post.tags.forEach((tag: string) => {
                const iconName = findIconByName(tag)
                contents += `![${tag}](${iconsURL}${tag.replace(' ', '%20')}-${iconName?.hex || getRandomHexColor()}?style=${style}&logoColor=${logoColor}&logo=${iconName?.slug})\n`
            })
        }
        contents += '\n'
    }
    return contents;
}

/**
 * Profile README.md 작성.
 */
function buildProfileReadme() {
    const profilePath = path.resolve(__dirname, 'profile.md');

    let contents = fs.readFileSync(profilePath, 'utf-8');

    let postContents = getPostContent()

    contents += '## 📝 New Doc\n';
    const newPost = newPosts(postContents)
    contents += buildReadmeContents(newPost);

    postContents = postContents.filter(p => !newPost.some(post => post.filename === p.filename));
    fs.writeFileSync(profilePath, contents, 'utf-8');
}
buildProfileReadme();
