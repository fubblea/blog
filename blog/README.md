# Blog Content Conventions

This directory contains the source markdown files for the blog. It follows a structured approach for organizing content into **Series** and **Posts**.

## Directory Structure

- **Series Folder**: Every subdirectory under `blog/` is considered a "Series" (e.g., `blog/cylinder-bot/`).
- **Series Index**: Each series folder must contain an `index.md` file.
- **Posts**: Individual articles are `.md` files located within a series folder.

### File Naming
Posts should be prefixed with a number and a hyphen to determine their order within a series:
- `1-first-post.md`
- `2-second-post.md`
- ...

## Frontmatter Requirements

### For Posts (`1-example.md`)
To ensure the `<Frontmatter />` component renders correctly, include the following:

```yaml
---
# title: "Optional Title Override"
tags: [robotics, simulation]
tech: [python, c, modelica]
date-written: "17-04-2026"
last-updated: "18-04-2026"
---

# My Post Title

<Frontmatter />

## Content...
```

- **title**: (Optional) Title override. If omitted, the title is inferred from the filename.
- **tags**: (Optional) Displayed with a `#` prefix in the banner and index.
- **tech**: (Optional) Displays technology logos.
- **date-written**: (Optional) Date the post was first published. **Must follow `dd-mm-yyyy` format.**
- **last-updated**: (Optional) Date the post was last revised. **Must follow `dd-mm-yyyy` format.**

### For Series Index (`index.md`)
To render the series header and automatic post list, use:

```yaml
---
# title: "Optional Series Title Override"
description: "A comprehensive guide to building, modeling, and simulating a cylindrical robot from scratch."
---

# Cylinder Bot Series

<SeriesList />
```

- **title**: (Optional) Series title override. If omitted, the title is inferred from the folder name.
- **description**: (Optional) A brief overview of the series displayed in the index header.

## Components

- **`<Frontmatter />`**: Place this at the top of every post (after the frontmatter block). It renders the title banner, series progress (Part X/N), tags, and tech logos.
- **`<SeriesList />`**: Place this in the series `index.md`. It automatically generates a list of all posts in that folder, ordered by their filename prefix.

## Supported Tech Logos
The supported keys in the tech tags are in the following file: `blog/.vitepress/theme/utils.ts`.
