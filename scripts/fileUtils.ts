import * as fs from 'fs';

export type PostMeta = {
    title: string;
    description?: string;
    categories: string;
    tags?: string[];
    allow_publishing: boolean;
}

/**
 * 파일명에서 일자, 파일명, 카테고리 추출
 * @param category
 * @param filename
 */
export function parsePostFilename(category: string, filename: string): any {
    const match = filename.match(/^(\d{4}-\d{2}-\d{2})-(.+)\.md$/);
    if (!match) return null;

    const [, date, title] = match;

    return { date, filename, category };
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
        categories: '',
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

