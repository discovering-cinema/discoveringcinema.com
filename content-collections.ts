import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX } from "@content-collections/mdx";
import path from "path";
import { z } from "zod";
import remarkFrontmatter from "remark-frontmatter";
import remarkMath from "remark-math";
import rehypeSlug from "rehype-slug";
import rehypeKatex from "rehype-katex";

const Post = defineCollection({
  name: "posts",
  directory: "content/articles",
  include: "**/*.mdx",
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    date: z.string().optional(),
    description: z.string(),
    tags: z.array(z.string()).default([]),
    image: z.string().optional(),
    imageDescription: z.string().optional(),
    hugeImage: z.boolean().optional(),
    series: z.string().optional(),
    order: z.number().optional(),
    opengraph: z.object({
      title: z.string().optional(),
      description: z.string().optional(),
    }).optional(),
    faq: z.array(z.object({
      question: z.string(),
      answer: z.string(),
    })).optional(),
    dataset: z.object({
      name: z.string(),
      description: z.string(),
      creator: z.string(),
      variableMeasured: z.array(z.object({
        name: z.string(),
        value: z.string(),
      })).optional(),
      distribution: z.array(z.object({
        encodingFormat: z.string(),
        contentUrl: z.string(),
      })).optional(),
    }).optional(),
    lastWatched: z.string().optional(),
    content: z.string(),
  }),
  transform: async (doc, context) => {
    const content = doc.content.replace(/^import .* from ['"]@\/app\/components\/.*['"];?\s*$/gm, "");
    const body = await compileMDX(context, { ...doc, content }, {
      remarkPlugins: [remarkFrontmatter, remarkMath],
      rehypePlugins: [rehypeSlug, rehypeKatex],
    });
    return {
      ...doc,
      body: {
        code: body,
        raw: doc.content,
      },
      slug: doc._meta.path,
      seriesSlug: doc._meta.path.split("/").length > 1 ? doc._meta.path.split("/")[0] : undefined,
    };
  },
});

const Concept = defineCollection({
  name: "concepts",
  directory: "content/concepts",
  include: "*.mdx",
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    description: z.string(),
    image: z.string().optional(),
    imageDescription: z.string().optional(),
    tags: z.array(z.string()).default([]),
    opengraph: z.object({
      title: z.string().optional(),
      description: z.string().optional(),
    }).optional(),
    faq: z.array(z.object({
      question: z.string(),
      answer: z.string(),
    })).optional(),
    resources: z.array(z.object({
      title: z.string(),
      url: z.string(),
      type: z.string(),
    })).optional(),
    relatedArticles: z.array(z.string()).default([]),
    content: z.string(),
  }),
  transform: async (doc, context) => {
    const content = doc.content.replace(/^import .* from ['"]@\/app\/components\/.*['"];?\s*$/gm, "");
    const body = await compileMDX(context, { ...doc, content }, {
      remarkPlugins: [remarkFrontmatter, remarkMath],
      rehypePlugins: [rehypeSlug, rehypeKatex],
    });
    return {
      ...doc,
      body: {
        code: body,
        raw: doc.content,
      },
      slug: path.basename(doc._meta.path),
    };
  },
});

const Series = defineCollection({
  name: "series",
  directory: "content/articles",
  include: "**/series.yml",
  parser: "yaml",
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    description: z.string(),
    opengraph: z.object({
      title: z.string().optional(),
      description: z.string().optional(),
    }).optional(),
  }),
  transform: (doc) => {
    const parts = doc._meta.path.split("/");
    return {
      ...doc,
      slug: parts[parts.length - 2],
    };
  },
});

export default defineConfig({
  content: [Post, Concept, Series],
});
