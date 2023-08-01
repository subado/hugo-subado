#!/usr/bin/env -S npx tsx

import arg from 'arg'
import { globSync } from 'glob'
import { text } from '@clack/prompts'
import { TinyColor, random, ColorFormats } from '@ctrl/tinycolor'

const scales = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const
type Scales = (typeof scales)[number]
type Palette = { [T in Scales]: TinyColor }

const supportedFormats = ['hsl', 'rgb'] as const
type SupportedFormat = (typeof supportedFormats)[number]

const { scaleToLightness } = new (class {
  divider: number | null = null
  scaleToLightness = (scale: Scales) => {
    if (!this.divider) {
      let max = Math.max(...scales)
      this.divider = 1
      while (Math.abs(max) > 1) {
        max /= 10
        this.divider *= 10
      }
    }
    return 1 - scale / this.divider
  }
})()

function validateColor(color: string) {
  if (color.length && !new TinyColor(color).isValid)
    return 'Please enter valid color'
}

function isSupportedFormat(format: unknown): format is SupportedFormat {
  return supportedFormats.includes(format as SupportedFormat)
}

function getColorFormat(str: string): ColorFormats {
  let format: unknown = ''
  for (const i of str) {
    if (i === '(') break
    format += i
  }
  if (isSupportedFormat(format)) return format as ColorFormats
  return 'hex'
}

function getCssVar(str: string) {
  let cssVar = ''
  for (let i = str.indexOf('var(') + 4; str[i] !== ')'; ++i) {
    cssVar += str[i]
  }
  return cssVar
}

function genPalette(baseColor: TinyColor): Palette {
  const baseHsl = baseColor.toHsl()
  const palette: Palette = {} as Palette
  const medianIndex = Math.floor(scales.length / 2) + (scales.length % 2) - 1
  const median = scales[medianIndex]

  type Shift = typeof baseHsl.l
  const lightMaxShift: Shift = median - scales[0],
    darkMaxShift: Shift = median - scales[scales.length - 1]
  const lightL: Shift = scaleToLightness(scales[0]) - baseHsl.l,
    darkL: Shift = scaleToLightness(scales[scales.length - 1]) - baseHsl.l

  let shift: Shift, maxShift: Shift
  for (const scale of scales) {
    shift = 0
    if (scale !== median) {
      if (scale < median) {
        maxShift = lightMaxShift
        shift = lightL
      } else {
        maxShift = darkMaxShift
        shift = darkL
      }
      shift *= (median - scale) / maxShift
    }
    palette[scale] = new TinyColor({ ...baseHsl, l: baseHsl.l + shift })
  }
  return palette
}

const args = arg({
  // Types
  '--help': Boolean,
  '--config': String,

  // Aliases
  '-h': '--help',
  '-c': '--config',
})

if (args['--help']) {
  console.log()
}

async function main() {
  let configPath = args['--config'] || 'tailwind.config.*'
  const files = globSync(configPath)

  if (files.length) {
    configPath = files[0]
  } else {
    throw Error(`Config file not found: '${configPath}'`)
  }

  require.main!.paths.push('.')
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const config = require(`${configPath}`)
  const colors = config.theme.colors
  const root = {}

  for (const color in colors) {
    if (color === 'transparent' || color === 'currentColor') continue

    let colorFormat: ColorFormats, cssVar: string
    let palette: Palette | null = null

    for (const scale in colors[color]) {
      colorFormat = getColorFormat(colors[color][scale])
      cssVar = getCssVar(colors[color][scale])

      if (!colorFormat || !cssVar) {
        throw Error(
          `Can't recognize ${color}-${scale}(${colors[color][scale]})`
        )
      }

      if (scale === 'DEFAULT') {
        root[cssVar] = await text({
          message: `Enter a ${scale} color of ${color}`,
          defaultValue: random().toString(colorFormat),
          validate: validateColor,
        })
        continue
      } else if (!palette) {
        const baseColor = await text({
          message: `Enter a base color(${color}-500) for ${color} palette`,
          defaultValue: random().toString(colorFormat),
          validate: validateColor,
        })
        palette = genPalette(new TinyColor(baseColor.toString()))
      }
      root[cssVar] = palette[scale].toString(colorFormat)
    }

    console.log(root)
  }
}

main()
