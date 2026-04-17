import sanitizeHtml from 'sanitize-html';

export const sanitizeOptions = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat([
    'img', 'iframe', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span', 'div'
  ]),
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    'img': ['src', 'alt', 'title', 'width', 'height', 'loading', 'class', 'style'],
    'iframe': ['src', 'width', 'height', 'frameborder', 'allow', 'allowfullscreen', 'class', 'style'],
    'a': ['href', 'name', 'target', 'rel', 'class', 'style'],
    'h1': ['id', 'class', 'style'],
    'h2': ['id', 'class', 'style'],
    'h3': ['id', 'class', 'style'],
    'h4': ['id', 'class', 'style'],
    'h5': ['id', 'class', 'style'],
    'h6': ['id', 'class', 'style'],
    'p': ['class', 'style'],
    'span': ['class', 'style'],
    'div': ['class', 'style'],
    '*': ['class', 'style'] // Allow class and style on everything for now to match blog editor needs
  },
  allowedIframeHostnames: ['www.youtube.com', 'player.vimeo.com', 'youtube.com'],
  allowedStyles: {
    '*': {
      // Allow specific CSS properties commonly used in blog editors
      'color': [/^#(?:[0-9a-fA-F]{3}){1,2}$/, /^rgb\(\d+,\s*\d+,\s*\d+\)$/, /^rgba\(\d+,\s*\d+,\s*\d+,\s*[\d.]+\)$/],
      'background-color': [/^#(?:[0-9a-fA-F]{3}){1,2}$/],
      'text-align': [/^left$/, /^right$/, /^center$/, /^justify$/],
      'font-size': [/^\d+(?:px|em|rem|%)$/],
      'margin': [true],
      'padding': [true],
      'width': [true],
      'height': [true]
    }
  }
};

export const sanitize = (html) => {
  if (!html) return '';
  return sanitizeHtml(html, sanitizeOptions);
};
