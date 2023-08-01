#!/usr/bin/env python3

# For generate default colors use:
# ./gen-colors.py --transparent --currentColor -m hsl -dc neutral -c primary note tip warning important


import json
import argparse
from typing import Final
from collections import Counter

COLORS_DEST: Final = 'colors'
MODEL_DEST: Final = 'model'
DEFAULT_DEST: Final = 'default'
SCALES_DEST: Final = 'scales'
DEFAULT_TEMPLATE: Final = '{model}(var(--color-{name}){sep} <alpha-value>)'
TEMPLATE: Final = '{model}(var(--color-{name}-{scale}){sep} <alpha-value>)'
MODELS: Final = {
    'rgb': ' /',
    'hsl': ' /',
    'rgba': ','
}
SCALES: Final = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]

colors = {}


class StoreSequences(argparse.Action):

    def checkUnique(self, values):
        counts = Counter(values)
        for value in values:
            if counts[value] != 1:
                raise ValueError(f'{value} is set several times')

    def isAllowed(self, value):
        if int(value) not in self.sequence:
            raise ValueError(f'{value} is not in list')

    def __init__(self, option_strings, dest, sequence, nargs=None, **kwargs):
        if nargs is not None:
            raise ValueError('nargs not allowed')
        self.sequence = sequence
        super().__init__(option_strings, dest, nargs='+', **kwargs)

    def __call__(self, parser, namespace, values, option_string=None) -> None:
        for i in range(len(values)):
            if type(values[i]) is str and '-' in values[i]:
                [start, end] = values[i].split('-')
                start = self.sequence.index(int(start))
                end = self.sequence.index(int(end))

                del values[i]
                while end >= 0:
                    values.insert(i, self.sequence[end])
                    if end == start:
                        break
                    end -= 1
            else:
                values[i] = int(values[i])
                self.isAllowed(values[i])

        self.checkUnique(values)
        setattr(namespace, self.dest, values)


class AddOptional(argparse.Action):

    def __init__(self, option_strings, dest, nargs=None, **kwargs):
        if nargs is not None:
            raise ValueError('nargs not allowed')
        super().__init__(option_strings, dest, nargs=0, **kwargs)

    def __call__(self, parser, namespace, values, option_string=None) -> None:
        colors[self.const] = self.const


def genColors(names: list[str], model: str, default: bool, scales: list[int]) -> None:
    sep = MODELS[model]
    for name in names:
        colors[name] = {}
        if default:
            colors[name]['DEFAULT'] = DEFAULT_TEMPLATE.format(model=model, name=name, sep=sep)
        for scale in scales:
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
            genColors(names=colorsAttr, model=modelAttr, default=defaultAttr, scales=getattr(namespace, SCALES_DEST))
            self.clearAttrs(namespace)


def main():
    parser = argparse.ArgumentParser(description='generate colors for tailwind.conifg')
    required = parser.add_argument_group('required')
    required.add_argument('-c', '--colors', type=str, help='a color names', nargs='+', required=True, action=GenColors, dest=COLORS_DEST)
    required.add_argument('-m', '--model', choices=MODELS.keys(),
                          type=str, help='a color model', required=True, action=GenColors, dest=MODEL_DEST)

    parser.add_argument('-s', '--scales',
                        type=str, help=f'a color scales {SCALES}. Also you can use syntax like {SCALES[0]}-{SCALES[-1]}', sequence=SCALES, action=StoreSequences, dest=SCALES_DEST, default=SCALES)
    parser.add_argument('-d', '--default',
                        help='add DEFAULT to next colors', action='store_true', dest=DEFAULT_DEST)
    parser.add_argument('--transparent',
                        help='add transparent to output json', const='transparent', action=AddOptional)
    parser.add_argument('--currentColor',
                        help='add currentColor to output json', const='currentColor', action=AddOptional)

    parser.parse_args()
    print(json.dumps(colors, indent=2))


if __name__ == "__main__":
    main()
