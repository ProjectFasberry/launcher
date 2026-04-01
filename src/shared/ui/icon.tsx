import { JSX, splitProps } from 'solid-js';
import clsx from 'clsx';
import { sprites, type SpritesMeta } from '../sprite.gen';

export interface IconProps extends JSX.SvgSVGAttributes<SVGSVGElement> {
  name: IconName;
  invert?: boolean;
}

export type IconName = {
  [Key in keyof SpritesMeta]: `${Key}:${SpritesMeta[Key]}`;
}[keyof SpritesMeta];

export function Icon(props: IconProps) {
  const [local, rest] = splitProps(props, ['name', 'class', 'invert']);
  const meta = getIconMeta(local.name);
  const { viewBox, width, height } = meta.symbol;
  const scaleX = width > height;
  const scaleY = width < height;
  return (
    <svg
      class={clsx(
        {
          'icon-x': local.invert ? scaleY : scaleX,
          'icon-y': local.invert ? scaleX : scaleY,
          icon: width === height
        },
        local.class
      )}
      viewBox={viewBox}
      // focusable="false"
      aria-hidden
      {...rest}
    >
      <use href={meta.href} />
    </svg>
  );
}

function getIconMeta(name: IconName) {
  const [spriteName, iconName] = name.split(':');
  const item = sprites.experimental_get(spriteName!, iconName!, { baseUrl: '/sprites/' });
  if (!item) {
    console.error(`Icon "${name}" is not found in "${spriteName}" sprite`);
    return sprites.experimental_get('general', 'help', { baseUrl: '/sprites/' })!;
  }
  return item;
}