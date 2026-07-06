const fs = require('fs');
const files = [
  'src/routes/careers.tsx',
  'src/routes/career-guide.tsx',
  'src/routes/privacy.tsx',
  'src/routes/terms.tsx',
  'src/routes/resume-templates.tsx'
];

for (const file of files) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');

    content = content.replace(/className=\"min-h-screen bg-\[#030712\]/g, 'className=\"min-h-screen bg-white dark:bg-[#030712] transition-colors duration-300');
    content = content.replace(/text-purple-400/g, 'text-purple-600 dark:text-purple-400');
    content = content.replace(/from-white via-white to-white\/60/g, 'from-slate-900 via-slate-800 to-slate-500 dark:from-white dark:via-white dark:to-white/60');
    
    // Replace text colors
    content = content.replace(/text-slate-400/g, 'text-slate-600 dark:text-slate-400');
    content = content.replace(/text-white\/60/g, 'text-slate-500 dark:text-white/60');
    content = content.replace(/text-white\/80/g, 'text-slate-700 dark:text-white/80');
    content = content.replace(/text-white\/50/g, 'text-slate-600 dark:text-white/50');
    content = content.replace(/text-white\/30/g, 'text-slate-400 dark:text-white/30');
    
    content = content.replace(/(?<!-|\/)text-white(?!\/)/g, 'text-slate-900 dark:text-white');
    
    content = content.replace(/border-white\/5/g, 'border-slate-200 dark:border-white/5 bg-white/50 dark:bg-transparent shadow-sm');
    content = content.replace(/border-white\/10/g, 'border-slate-200 dark:border-white/10');
    content = content.replace(/text-slate-300/g, 'text-slate-700 dark:text-slate-300');
    
    content = content.replace(/bg-white\/5(?!0)/g, 'bg-slate-100 dark:bg-white/5');
    content = content.replace(/group-hover:text-white/g, 'group-hover:text-slate-900 dark:group-hover:text-white');
    content = content.replace(/hover:bg-white\/\[0\.02\]/g, 'hover:bg-slate-50 dark:hover:bg-white/[0.02]');
    
    // Buttons
    content = content.replace(/bg-white text-black/g, 'bg-slate-900 dark:bg-white text-white dark:text-black');
    content = content.replace(/text-slate-900 dark:text-slate-900 dark:text-white/g, 'text-slate-900 dark:text-white'); 

    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed ' + file);
  } else {
    console.log('File not found: ' + file);
  }
}
