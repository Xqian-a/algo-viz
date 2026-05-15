#!/usr/bin/env python3
"""
Build a single self-contained index.html from the modular source files.
Run: python build.py
Output: dist/index.html  (open directly in browser, no server needed)
"""
import os, re

BASE = os.path.dirname(os.path.abspath(__file__))
DIST = os.path.join(BASE, 'dist')

# JS files in dependency order (core/utils first, then renderers, algorithms, ui, app)
JS_FILES = [
    # Utils
    'js/utils/constants.js',
    'js/utils/dom.js',
    'js/utils/easing.js',
    'js/utils/color.js',
    # Core
    'js/core/event-bus.js',
    'js/core/registry.js',
    'js/core/step-engine.js',
    'js/core/animation.js',
    'js/core/canvas-manager.js',
    'js/core/state-store.js',
    # Renderers
    'js/renderers/base-renderer.js',
    'js/renderers/array-renderer.js',
    'js/renderers/linked-list-renderer.js',
    'js/renderers/stack-renderer.js',
    'js/renderers/queue-renderer.js',
    'js/renderers/tree-renderer.js',
    'js/renderers/graph-renderer.js',
    'js/renderers/string-renderer.js',
    'js/renderers/hash-renderer.js',
    # Algorithms ch1
    'js/algorithms/ch1-linear-list/sequential-list.js',
    'js/algorithms/ch1-linear-list/linked-list-ops.js',
    # Algorithms ch2
    'js/algorithms/ch2-stack-queue/stack-ops.js',
    'js/algorithms/ch2-stack-queue/queue-ops.js',
    'js/algorithms/ch2-stack-queue/circular-queue.js',
    # Algorithms ch3
    'js/algorithms/ch3-string/kmp.js',
    # Algorithms ch4
    'js/algorithms/ch4-tree/preorder-traversal.js',
    'js/algorithms/ch4-tree/inorder-traversal.js',
    'js/algorithms/ch4-tree/postorder-traversal.js',
    'js/algorithms/ch4-tree/levelorder-traversal.js',
    'js/algorithms/ch4-tree/bst-ops.js',
    'js/algorithms/ch4-tree/huffman.js',
    'js/algorithms/ch4-tree/avl-tree.js',
    # Algorithms ch5
    'js/algorithms/ch5-graph/dfs.js',
    'js/algorithms/ch5-graph/bfs.js',
    'js/algorithms/ch5-graph/dijkstra.js',
    'js/algorithms/ch5-graph/prim.js',
    'js/algorithms/ch5-graph/kruskal.js',
    'js/algorithms/ch5-graph/topological-sort.js',
    # Algorithms ch6
    'js/algorithms/ch6-search/binary-search.js',
    'js/algorithms/ch6-search/bst-search.js',
    'js/algorithms/ch6-search/hash-search.js',
    # Algorithms ch7
    'js/algorithms/ch7-sort/bubble-sort.js',
    'js/algorithms/ch7-sort/selection-sort.js',
    'js/algorithms/ch7-sort/insertion-sort.js',
    'js/algorithms/ch7-sort/shell-sort.js',
    'js/algorithms/ch7-sort/merge-sort.js',
    'js/algorithms/ch7-sort/quick-sort.js',
    'js/algorithms/ch7-sort/heap-sort.js',
    'js/algorithms/ch7-sort/counting-sort.js',
    'js/algorithms/ch7-sort/radix-sort.js',
    # UI
    'js/ui/sidebar.js',
    'js/ui/code-panel.js',
    'js/ui/control-bar.js',
    'js/ui/info-panel.js',
    'js/ui/user-code-upload.js',
    # App (must be last)
    'js/app.js',
]

CSS_FILES = [
    'css/variables.css',
    'css/reset.css',
    'css/layout.css',
    'css/sidebar.css',
    'css/code-panel.css',
    'css/controls.css',
    'css/components.css',
    'css/animations.css',
    'css/prism-theme.css',
]

def read(path):
    with open(os.path.join(BASE, path), 'r', encoding='utf-8') as f:
        return f.read()

def strip_es_modules(js_code, filename):
    """Remove import/export statements, convert to plain JS."""
    lines = js_code.split('\n')
    result = []
    for line in lines:
        stripped = line.strip()
        # Skip import lines
        if re.match(r"^\s*import\s+", stripped):
            continue
        # Convert "export const/let/function/class" to just declaration
        if re.match(r"^\s*export\s+(const|let|function|class|default)\s+", stripped):
            line = re.sub(r"^\s*export\s+(default\s+)?", "", line)
        # Remove trailing "export default ..."
        if re.match(r"^\s*export\s+default\s+", stripped):
            line = re.sub(r"^\s*export\s+default\s+", "", line)
        result.append(line)
    return '\n'.join(result)

# Files that need IIFE wrapping to avoid duplicate variable names
IIFE_FILES = {
    # Algorithm files that use 'const entry'
    'js/algorithms/',
    # Tree traversal files that use 'const TREE'
    'js/algorithms/ch4-tree/',
}

def build():
    os.makedirs(DIST, exist_ok=True)

    # Read and inline CSS
    css_bundle = '\n'.join(f'/* === {f} === */\n{read(f)}' for f in CSS_FILES)

    # Files that are core/global (don't wrap in IIFE — they export shared singletons/functions)
    CORE_FILES = {
        'js/utils/constants.js', 'js/utils/dom.js', 'js/utils/easing.js', 'js/utils/color.js',
        'js/core/event-bus.js', 'js/core/registry.js', 'js/core/step-engine.js',
        'js/core/animation.js', 'js/core/canvas-manager.js', 'js/core/state-store.js',
        'js/renderers/base-renderer.js', 'js/renderers/array-renderer.js',
        'js/renderers/linked-list-renderer.js', 'js/renderers/stack-renderer.js',
        'js/renderers/queue-renderer.js', 'js/renderers/tree-renderer.js',
        'js/renderers/graph-renderer.js', 'js/renderers/string-renderer.js',
        'js/renderers/hash-renderer.js',
        'js/ui/sidebar.js', 'js/ui/code-panel.js', 'js/ui/control-bar.js',
        'js/ui/info-panel.js', 'js/ui/user-code-upload.js',
        'js/app.js',
    }

    # Read and inline JS (strip ES module syntax)
    js_parts = []
    for f in JS_FILES:
        code = read(f)
        code = strip_es_modules(code, f)
        header = f'// === {f} ==='
        if f in CORE_FILES:
            js_parts.append(f'{header}\n{code}')
        else:
            # Wrap non-core files in IIFE to avoid duplicate variable names
            js_parts.append(f'{header}\n;(function(){{\n{code}\n}})();')
    js_bundle = '\n'.join(js_parts)

    # Read HTML template
    html = read('index.html')

    # Remove CSS link tags (replace with inline style)
    html = re.sub(
        r'\s*<link rel="stylesheet" href="css/[^"]*">\s*\n?',
        '', html
    )
    # Insert inline CSS before </head>
    html = html.replace('</head>', f'<style>\n{css_bundle}\n</style>\n</head>')

    # Remove external JS script tags (Prism.js CDN + app module)
    html = re.sub(r'\s*<script[^>]*src="js/app\.js"[^>]*></script>\s*\n?', '', html)
    # Keep Prism.js CDN scripts, they're fine

    # Remove the global error handler script (not needed for bundled version)
    html = re.sub(
        r'\s*<script>\s*\n\s*window\.addEventListener\([^\n]*\n\s*window\.addEventListener\([^\n]*\n\s*</script>\s*\n?',
        '', html
    )

    # Insert inline JS before </body>
    html = html.replace('</body>', f'<script>\n{js_bundle}\n</script>\n</body>')

    # Write output
    out_path = os.path.join(DIST, 'index.html')
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(html)

    print(f'[OK] Build complete: {out_path}')
    print(f'     Size: {os.path.getsize(out_path) / 1024:.0f} KB')
    print(f'     Open directly in browser - no server needed!')

if __name__ == '__main__':
    build()
