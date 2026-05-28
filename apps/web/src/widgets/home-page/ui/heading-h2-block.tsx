import type { HeadingH2BlockInput } from '@iva360/shared'

import { getHeadingH2SpacingStyle } from '../lib/heading-h2-spacing'

type HeadingH2BlockProps = {
  block: HeadingH2BlockInput
}

export function HeadingH2Block({ block }: HeadingH2BlockProps) {
  return (
    <section className="bg-background">
      <div
        className="container pt-4 pb-4 md:pt-6 md:pb-6 lg:pt-[var(--h2-spacing-top)] lg:pb-[var(--h2-spacing-bottom)]"
        style={getHeadingH2SpacingStyle(block.spacingTop, block.spacingBottom)}
      >
        <h2 className="text-fluid-h2-section font-medium tracking-tight text-foreground">
          {block.text}
        </h2>
      </div>
    </section>
  )
}
