import * as cheerio from 'cheerio';

/**
 * Automatically parses HTML content and injects internal links for specified keywords.
 * Avoids injecting links inside headers, existing links, or code blocks.
 * @param {string} htmlContent - The raw HTML content from the blog post.
 * @param {Array<{keyword: string, url: string}>} keywordsMap - Mappings of keywords to URLs.
 * @returns {string} - The modified HTML with injected internal links.
 */
export function autoLinkKeywords(htmlContent, keywordsMap) {
  if (!htmlContent || !keywordsMap || keywordsMap.length === 0) return htmlContent;

  const $ = cheerio.load(htmlContent, null, false);
  
  // Sort keywords by length descending to match longest multi-word phrases first
  const sortedMap = [...keywordsMap].sort((a, b) => b.keyword.length - a.keyword.length);

  const textNodes = [];

  function collectTextNodes(node) {
    if (node.type === 'text') {
      if (node.data.trim().length > 0) {
        textNodes.push(node);
      }
      return;
    }
    
    if (node.type === 'tag' || node.type === 'root') {
      const skipTags = ['a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'pre', 'code', 'script', 'style', 'button'];
      if (node.name && skipTags.includes(node.name.toLowerCase())) {
        return;
      }
      
      if (node.children) {
        node.children.forEach(collectTextNodes);
      }
    }
  }

  // Build list of text nodes to process
  $.root()[0].children.forEach(collectTextNodes);

  // Keep track of which URLs we've already linked to avoid over-linking the same post
  const usedUrls = new Set();
  
  textNodes.forEach(node => {
    let text = node.data;
    let modified = false;

    for (const { keyword, url } of sortedMap) {
      if (!keyword || !url) continue;
      
      // Limit to 1 internal link per destination URL per post to avoid link spam
      if (usedUrls.has(url)) continue;
      
      const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      // Case-insensitive, whole word boundary
      const regex = new RegExp(`\\b(${escapedKeyword})\\b`, 'i'); 
      
      if (regex.test(text)) {
        text = text.replace(regex, `<a href="${url}" class="text-primary-400 font-bold hover:text-primary-300 hover:underline transition-colors">$1</a>`);
        modified = true;
        usedUrls.add(url);
      }
    }
    
    if (modified) {
      $(node).replaceWith(text);
    }
  });

  return $.html();
}
