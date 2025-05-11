import * as fs from 'fs';

type PostType = {
    date: string;
    filename: string;
    folder: string;
    title: string;
    tags: string[];
    categories: string;
}

export function parsePostFilename(category: string, filename: string): any {
    const match = filename.match(/^(\d{4}-\d{2}-\d{2})-(.+)\.md$/);
    if (!match) return null;

    const [, date, title] = match;

    return {
        date,
        filename,
        categories: category,
    };
}

/**
 * 주석 추출
 * @param pathToFile
 */
export function getMetadataFromMarkdown(pathToFile: string) {
    const content = fs.readFileSync(pathToFile, 'utf-8');
    return parseFrontMatterFromComment(content);
}

function parseFrontMatterFromComment(content: string): Record<string, any> {
    const commentMatch = content.match(/<!--([\s\S]*?)-->/);
    if (!commentMatch) return {};

    const lines = commentMatch[1]
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);

    const metadata: Record<string, any> = {};

    for (const line of lines) {
        const [key, ...rest] = line.split(':');
        if (!key || rest.length === 0) continue;

        const value = rest.join(':').trim();

        // 배열 형태인지 확인 (예: [A, B])
        if (value.startsWith('[') && value.endsWith(']')) {
            metadata[key.trim()] = value
                .slice(1, -1)
                .split(',')
                .map(item => item.trim());
        } else {
            metadata[key.trim()] = value;
        }
    }

    return metadata;
}

