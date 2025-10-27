const fs = require('fs');
const path = require('path');

function parseMarkdown(md) {
  return md
    // Frontmatter (remove YAML metadata)
    .replace(/^---[\s\S]*?---/, '')

    // Headings
    .replace(/^###### (.*$)/gim, '<h6 class="text-base font-semibold my-2">$1</h6>')
    .replace(/^##### (.*$)/gim, '<h5 class="text-lg font-semibold my-2">$1</h5>')
    .replace(/^#### (.*$)/gim, '<h4 class="text-xl font-semibold my-3">$1</h4>')
    .replace(/^### (.*$)/gim, '<h3 class="text-2xl font-bold my-3">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-3xl font-bold my-4">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-4xl font-black my-5">$1</h1>')

    // Horizontal rules
    .replace(/^---$/gim, '<hr class="border-t-2 border-gray-300 my-6" />')

    // Blockquotes
    .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-gray-400 pl-4 italic my-3">$1</blockquote>')

    // Bold & Italic
    .replace(/\*\*\*(.*?)\*\*\*/gim, '<b><i>$1</i></b>')
    .replace(/\*\*(.*?)\*\*/gim, '<b>$1</b>')
    .replace(/\*(.*?)\*/gim, '<i>$1</i>')

    // Inline code
    .replace(/`([^`]+)`/gim, '<code class="bg-gray-100 text-sm px-1 py-0.5 rounded">$1</code>')

    // Code blocks (``` ... ```)
    .replace(/```([\s\S]*?)```/gim, '<pre class="bg-gray-900 text-white text-sm p-3 rounded my-3"><code>$1</code></pre>')

    // Images ![alt](url)
    .replace(/!\[(.*?)\]\((.*?)\)/gim, '<div class="w-full flex justify-center items-center"><img src="$2" alt="$1" class="rounded my-4 max-w-full h-auto" /></div>')

    // Links [text](url)
    .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" class="text-blue-600 hover:underline" target="_blank">$1</a>')

    // Bulleted lists (- item)
    .replace(/^\* (.*)$/gim, '<li class="ml-6 list-disc">$1</li>')
    .replace(/^- (.*$)/gim, '<li class="ml-6 list-disc">$1</li>')
    .replace(/(<li.*<\/li>)(\n<li.*<\/li>)+/gim, m => `<ul class="list-disc ml-6 my-3">${m}</ul>`)

    // Numbered lists (1. item)
    .replace(/^\d+\. (.*$)/gim, '<li class="ml-6 list-decimal">$1</li>')
    .replace(/(<li.*<\/li>)(\n<li.*<\/li>)+/gim, m => `<ol class="list-decimal ml-6 my-3">${m}</ol>`)

    // Paragraphs (convert double line breaks)
    .replace(/\n{2,}/g, '</p><p>')

    // Line breaks
    .replace(/(?<!\n)\n(?!\n)/g, '<br />')

    // Wrap everything inside <p>
    .replace(/^/, '<p>')
    .replace(/$/, '</p>');
}

// Simple markdown to HTML converter
// function parseMarkdown(markdown) {
//   let html = markdown
//     // Headers
//     .replace(/^###### (.*$)/gim, '<h6 class="text-base font-semibold my-2">$1</h6>')
//     .replace(/^##### (.*$)/gim, '<h5 class="text-lg font-semibold my-2">$1</h5>')
//     .replace(/^#### (.*$)/gim, '<h4 class="text-xl font-semibold my-3">$1</h4>')
//     .replace(/^### (.*$)/gim, '<h3 class="text-2xl font-bold my-3">$1</h3>')
//     .replace(/^## (.*$)/gim, '<h2 class="text-3xl font-bold my-4">$1</h2>')
//     .replace(/^# (.*$)/gim, '<h1 class="text-4xl font-black my-5">$1</h1>')
//     //line
//     .replace(/^---$/gim, '<hr class="border-t-2 border-gray-400 my-4" />')
//     //breakline
//     .replace(/\n/g, '<br />')
    
    

//     // Bold
//     .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
//     // Italic
//     .replace(/\*(.*?)\*/gim, '<em>$1</em>')
//     // Images
//     .replace(/!\[([^\]]*)\]\(([^\)]*)\)/gim, '<img src="$2" alt="$1" class="w-full h-auto object-cover rounded-lg my-6">')
//     // Links
//     .replace(/\[([^\]]*)\]\(([^\)]*)\)/gim, '<a href="$2" class="text-accent-color hover:underline">$1</a>')
//     // Code blocks
//     .replace(/```[\s\S]*?```/gim, function(match) {
//       const lines = match.split('\n');
//       const language = lines[0].replace('```', '').trim();
//       const code = lines.slice(1, -1).join('\n');
//       return `<pre class="bg-gray-800 text-gray-100 p-4 rounded-lg overflow-x-auto my-4"><code>${code}</code></pre>`;
//     })
//     // Inline code
//     .replace(/`([^`]*)`/gim, '<code class="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm">$1</code>')
//     // Line breaks and paragraphs
//     .split('\n')
//     .map(paragraph => {
//       if (paragraph.trim() === '') return '';
//       if (paragraph.startsWith('<h') || 
//           paragraph.startsWith('<ul') || 
//           paragraph.startsWith('<ol') || 
//           paragraph.startsWith('<pre') || 
//           paragraph.startsWith('<img')) {
//         return paragraph;
//       }
//       // Handle lists
//       if (paragraph.includes('\n- ')) {
//         const items = paragraph.split('\n- ').filter(item => item.trim());
//         const firstItem = items[0];
//         const listItems = items.slice(1).map(item => `<li>${item.trim()}</li>`).join('\n');
//         return `${firstItem.includes('- ') ? '' : '<p>' + firstItem + '</p>'}\n<ul class="list-disc ml-6 my-4">\n<li>${items[0].replace(/^- /, '')}</li>\n${listItems}\n</ul>`;
//       }
//       if (paragraph.includes('\n1. ')) {
//         const items = paragraph.split(/\n\d+\. /).filter(item => item.trim());
//         const listItems = items.map(item => `<li>${item.trim()}</li>`).join('\n');
//         return `<ol class="list-decimal ml-6 my-4">\n${listItems}\n</ol>`;
//       }
//       return `<p>${paragraph.trim()}</p>`;
//     })
//     .filter(p => p.trim() !== '')
//     .join('\n\n');

//   return html;
// }

// Parse frontmatter
function parseFrontmatter(content) {
  // Normalize line endings
  content = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    console.log('Frontmatter regex failed. First 200 chars of content:');
    console.log(JSON.stringify(content.substring(0, 200)));
    throw new Error('No frontmatter found');
  }

  const frontmatter = {};
  const frontmatterLines = match[1].split('\n');
  
  frontmatterLines.forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > -1) {
      const key = line.substring(0, colonIndex).trim();
      const value = line.substring(colonIndex + 1).trim();
      frontmatter[key] = value;
    }
  });

  const markdownContent = match[2];
  
  return {
    frontmatter,
    content: parseMarkdown(markdownContent)
  };
}

// Main function to build posts
function buildPosts() {
  console.log('Current working directory:', process.cwd());
  console.log('Script location:', __dirname);
  
  // Try multiple possible folder names
  const possiblePaths = ['./Posts', './posts', './assets/Posts', './Assets/Posts'];
  let postsDir = null;
  
  for (const testPath of possiblePaths) {
    console.log(`Checking: ${testPath}`);
    if (fs.existsSync(testPath)) {
      postsDir = testPath;
      console.log(`Found posts directory at: ${postsDir}`);
      break;
    }
  }
  
  if (!postsDir) {
    console.error('Posts directory not found in any of these locations:');
    possiblePaths.forEach(p => console.error(`  - ${p}`));
    console.log('\nCurrent directory contents:');
    try {
      const items = fs.readdirSync('./');
      items.forEach(item => {
        const stat = fs.statSync(item);
        console.log(`  ${stat.isDirectory() ? '[DIR]' : '[FILE]'} ${item}`);
      });
    } catch (err) {
      console.error('Error reading directory:', err.message);
    }
    return;
  }

  const outputFile = path.join(__dirname, 'assets', 'js', 'data.js');

  try {
    // Read all markdown files
    const files = fs.readdirSync(postsDir)
      .filter(file => file.endsWith('.md'))
      .sort();

    console.log(`Found ${files.length} markdown files:`, files);

    if (files.length === 0) {
      console.log('No markdown files found in posts directory');
      return;
    }

    const posts = [];

    // Process each markdown file
    files.forEach(file => {
      try {
        const filePath = path.join(postsDir, file);
        console.log(`Reading file: ${filePath}`);
        const content = fs.readFileSync(filePath, 'utf8');
        const parsed = parseFrontmatter(content);
        
        const post = {
          id: parsed.frontmatter.id,
          title: parsed.frontmatter.title,
          date: parsed.frontmatter.date,
          category: parsed.frontmatter.category,
          excerpt: parsed.frontmatter.excerpt,
          cover: parsed.frontmatter.cover,
          content: parsed.content
        };

        posts.push(post);
        console.log(`✓ Processed: ${file}`);
      } catch (error) {
        console.error(`✗ Error processing ${file}:`, error.message);
      }
    });

    // Generate categories
    const categories = ['All', ...new Set(posts.map(p => p.category))];

    // Generate the data.js file
    const jsContent = `// Auto-generated from markdown files
// Run 'node build-posts.js' to regenerate

const postsData = ${JSON.stringify(posts, null, 2)};

const CATEGORIES = ${JSON.stringify(categories)};
`;

    // Write the file
    fs.writeFileSync(outputFile, jsContent);
    
    console.log(`\n🎉 Successfully built ${posts.length} posts!`);
    console.log(`📝 Categories: ${categories.slice(1).join(', ')}`);
    console.log(`📁 Output: ${outputFile}`);
    
  } catch (error) {
    console.error('Build failed:', error);
  }
}

// Run the build
buildPosts();
