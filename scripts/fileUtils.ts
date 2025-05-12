import * as fs from 'fs';
import path from "path";

export type PostMeta = {
    title: string;
    description?: string;
    tags?: string[];
    allow_publishing: boolean;
}

/**
 * 재귀를 이용하여 directory(category)를 추출
 * @param dir
 * @param baseDir
 */
export function getCategoryFiles(dir: string, baseDir: string = dir): string[][] {
    let results: string[][] = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            const relative = path.relative(baseDir, fullPath);
            const categoryPath = relative.split(path.sep)

            results.push(categoryPath)
            results = results.concat(getCategoryFiles(fullPath, baseDir)); // 재귀 호출
        }
    }

    return results;
}

/**
 * 파일명에서 일자, 파일명, 카테고리 추출
 * @param filename
 */
export function parsePostFilename(filename: string): any {
    const match = filename.match(/^(\d{4}-\d{2}-\d{2})-(.+)\.md$/);
    if (!match) return null;

    const [, date, title] = match;

    return { date, filename };
}

/**
 * 주석 추출
 * @param pathToFile
 */
export function getMetadataFromMarkdown(pathToFile: string) : PostMeta | null {
    const content = fs.readFileSync(pathToFile, 'utf-8');

    const commentMatch = content.match(/<!--([\s\S]*?)-->/);
    if (!commentMatch) return null;

    const lines = commentMatch[1]
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);

    const metadata: PostMeta = {
        title: '',
        tags: [],
        allow_publishing: false
    };

    for (const line of lines) {
        const [key, ...rest] = line.split(':');
        const keyName = key.trim() as keyof PostMeta;
        const keyValue = rest.join(':').trim();

        if (!keyName || keyValue.length === 0) continue;
        if (!(keyName in metadata)) continue;

        if (keyName === 'tags') {
            metadata[keyName] = keyValue.split(',').map(tag => tag.trim());
        } else if (keyName === 'allow_publishing') {
            metadata[keyName] = keyValue === 'true';
        } else {
            metadata[keyName] = keyValue as any;
        }
    }

    if (!metadata.allow_publishing) return null;
    return metadata;
}

