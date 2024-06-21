import getReadingTime from 'reading-time';
import { toString } from 'mdast-util-to-string';

export function remarkReadingTime() {
  return function (tree, { data }) {
    const textOnPage = toString(tree);
    const readingTime = getReadingTime(textOnPage);
    const readingTimeText = `${readingTime.minutes.toFixed(0)} 分钟`;
    const words = `${readingTime.words} 字`;

    data.astro.frontmatter.readingTime = readingTimeText;
    data.astro.frontmatter.words = words;
  };
}
