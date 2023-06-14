#!/usr/bin/env python3

# For generate default colors use:
# ./gen-colors.py --transparent --currentColor -m rgb -dc neutral -c primary note tip warning important


import json
import argparse
from typing import Final

COLORS_DEST: Final = 'colors'
MODEL_DEST: Final = 'model'
DEFAULT_DEST: Final = 'default'
DEFAULT_TEMPLATE: Final = '{model}(var(--color-{name}){sep} <alpha-value>)'
TEMPLATE: Final = '{model}(var(--color-{name}-{scale}){sep} <alpha-value>)'
MODELS: Final = {
    'rgb': ' /',
    'hsl': ' /',
    'rgba': ','
}
SCALES: Final = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]

colors = {}
parser = argparse.ArgumentParser(description="generate colors for tailwind.conifg")


class AddOptional(argparse.Action):

    def __init__(self, option_strings, dest, nargs=None, **kwargs):
        if nargs is not None:
            raise ValueError("nargs not allowed")
        super().__init__(option_strings, dest, nargs=0, **kwargs)

    def __call__(self, parser, namespace, values, option_string=None) -> None:
        colors[self.const] = self.const


def genColors(names: list[str], model: str, default: bool) -> None:
    sep = MODELS[model]
    for name in names:
        colors[name] = {}
        if default:
            colors[name]['DEFAULT'] = DEFAULT_TEMPLATE.format(model=model, name=name, sep=sep)
        for scale in SCALES:
            colors[name][scale] = TEMPLATE.format(model=model, name=name, scale=scale, sep=sep)


class GenColors(argparse.Action):

    def __init__(self, option_strings, dest, **kwargs):
        super().__init__(option_strings, dest, **kwargs)

    def clearAttrs(self, namespace) -> None:
        setattr(namespace, COLORS_DEST, None)
        setattr(namespace, DEFAULT_DEST, False)

    def __call__(self, parser, namespace, values, option_string=None) -> None:
        setattr(namespace, self.dest, values)

        colorsAttr = getattr(namespace, COLORS_DEST)
        modelAttr = getattr(namespace, MODEL_DEST)

        if colorsAttr is not None and modelAttr is not None:
            defaultAttr = getattr(namespace, DEFAULT_DEST)
            genColors(names=colorsAttr, model=modelAttr, default=defaultAttr)
            self.clearAttrs(namespace)


required = parser.add_argument_group('required')
required.add_argument('-c', '--colors', type=str, help='a color names', nargs='+', required=True, action=GenColors, dest=COLORS_DEST)
required.add_argument('-m', '--model', choices=MODELS.keys(),
                      type=str, help='a color model', required=True, action=GenColors, dest=MODEL_DEST)

parser.add_argument('-d', '--default',
                    help='add DEFAULT to next colors', action='store_true', dest=DEFAULT_DEST)
parser.add_argument('--transparent',
                    help='add transparent to output json', const='transparent', action=AddOptional)
parser.add_argument('--currentColor',
                    help='add currentColor to output json', const='currentColor', action=AddOptional)


parser.parse_args()
print(json.dumps(colors, indent=2))
