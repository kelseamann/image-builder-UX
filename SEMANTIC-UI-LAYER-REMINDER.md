# 🔗 SEMANTIC-UI-LAYER NPM LINK REMINDER

## ⚠️ IMPORTANT: DO NOT REINSTALL SEMANTIC-UI-LAYER

This `image-builder-UX` project uses **semantic-ui-layer** via npm link.

### ✅ What This Means:
- `semantic-ui-layer` is npm linked to this project
- Changes to `semantic-ui-layer` will be reflected here instantly
- No need to publish/bump versions during development

### 🚫 What NOT to Do:
- ❌ **Do NOT** run `npm install semantic-ui-layer`
- ❌ **Do NOT** run `npm install` expecting to get semantic-ui-layer
- ❌ **Do NOT** delete and reinstall node_modules completely
- ❌ **Do NOT** update package.json with version requirements

### ✅ What TO Do Instead:
- ✅ If `semantic-ui-layer` changes: **Restart the dev server** (`npm run start:dev`)
- ✅ If you need semantic-ui-layer updates: **Build it** (`npm run build` in semantic-ui-layer)
- ✅ If linking breaks: **Re-run the npm link** (from semantic-ui-layer directory)

### 📍 How It Works:
1. `semantic-ui-layer` is built and linked globally
2. This project references the linked version
3. Changes appear instantly without reinstalling

### 🔧 If Something Goes Wrong:
```bash
# In semantic-ui-layer directory:
npm run build
npm link

# In this image-builder-UX directory:
npm link semantic-ui-layer
npm run start:dev
```

---
**Remember**: This file should remind you that semantic-ui-layer is npm linked, NOT a regular dependency!
