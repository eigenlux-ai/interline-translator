/** Explicitly labeled promotional illustration, not a live player capture. */
import { readFile } from 'node:fs/promises';
import { createElement as h } from 'react';
import { ActionIcon, MantineProvider, Text } from '@mantine/core';
import { renderToStaticMarkup } from 'react-dom/server';

const icons = await readFile(new URL('../../src/react-app/components/icons.tsx', import.meta.url), 'utf8');
const gear = icons.match(/export function GearIcon[\s\S]*?<svg[^>]*>([\s\S]*?)<\/svg>/)?.[1];
if (!gear) throw new Error('Cannot extract the product GearIcon');
export function subtitleIllustrationHtml(source, translation, labels) {
  // Same ActionIcon props and placement as the production subtitle renderer.
  const controls = renderToStaticMarkup(
    h(
      MantineProvider,
      {
        forceColorScheme: 'light',
        theme: { radius: { md: '9px' } },
      },
      h(
        'div',
        { className: 'tools' },
        h(
          ActionIcon,
          {
            variant: 'filled',
            color: '#B63E2A',
            size: 34,
            radius: 'md',
            type: 'button',
            'aria-label': labels.toggle,
            title: labels.toggle,
            'aria-pressed': true,
          },
          h(Text, { component: 'span', size: 'xs', fw: 600 }, 'CC')
        ),
        h(
          ActionIcon,
          {
            variant: 'default',
            size: 34,
            radius: 'md',
            type: 'button',
            'aria-label': labels.settings,
            title: labels.settings,
            'aria-expanded': false,
          },
          h('svg', {
            width: 16,
            height: 16,
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            strokeWidth: 1.75,
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            dangerouslySetInnerHTML: { __html: gear },
          })
        )
      )
    )
  );

  const escape = (s) => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  return `<!doctype html><html data-mantine-color-scheme="light"><meta charset="utf-8"><link rel="stylesheet" href="/mantine.css"><style>
*{box-sizing:border-box}body{margin:0;width:1120px;height:600px;overflow:hidden;background:#161a1f;font-family:system-ui,-apple-system,sans-serif}.scene{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}.captions{position:absolute;left:5%;width:90%;bottom:54px;text-align:center;color:#fff;font-size:26px;line-height:1.45;text-shadow:0 1px 3px #000}.line{display:table;margin:4px auto;padding:3px 12px;background:rgba(0,0,0,.75);border-radius:4px;max-width:100%;overflow-wrap:anywhere}.translation{font-weight:600}.tools{position:absolute;top:16px;right:16px;display:flex;gap:6px;z-index:2}
</style><img class="scene" src="/subtitle-scene.png">${controls}<div class="captions"><div class="line" dir="auto">${escape(source)}</div><div class="line translation" dir="auto">${escape(translation)}</div></div></html>`;
}
