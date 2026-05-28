import type { FooterInput } from '@iva360/shared'

import { decodeCmsTextEntities } from '@/entities/cms-media'
import { cn } from '@/shared/lib/utils'

const socialPlatformLabels: Record<
  NonNullable<NonNullable<FooterInput['socialLinks']>[number]['platform']>,
  string
> = {
  vk: 'VK',
  telegram: 'Telegram',
  youtube: 'YouTube',
  other: 'Ссылка',
}

type FooterShellProps = {
  footer: FooterInput | null
}

export function FooterShell({ footer }: FooterShellProps) {
  if (!footer) {
    return null
  }

  const copyright = footer.copyright?.trim()
  const links = footer.links?.filter((link) => link.label.trim().length > 0) ?? []
  const socialLinks =
    footer.socialLinks?.filter((link) => link.url.trim().length > 0) ?? []
  const email = footer.contact?.email?.trim()
  const phone = footer.contact?.phone?.trim()
  const address = footer.contact?.address?.trim()

  const hasContact = Boolean(email || phone || address)
  const hasContent = Boolean(copyright || links.length || socialLinks.length || hasContact)

  if (!hasContent) {
    return null
  }

  return (
    <footer className="mt-auto border-t border-border bg-background pb-[calc(4rem+env(safe-area-inset-bottom))] lg:pb-0">
      <div className="container flex flex-col gap-8 py-10 text-sm text-muted-foreground">
        {hasContact ? (
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-8 sm:gap-y-2">
            {email ? (
              <a href={`mailto:${email}`} className="transition-colors hover:text-primary">
                {email}
              </a>
            ) : null}
            {phone ? (
              <a href={`tel:${phone.replace(/\s/g, '')}`} className="transition-colors hover:text-primary">
                {phone}
              </a>
            ) : null}
            {address ? (
              <p className="text-muted-foreground">{decodeCmsTextEntities(address)}</p>
            ) : null}
          </div>
        ) : null}

        {links.length > 0 ? (
          <nav aria-label="Ссылки в подвале">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {links.map((link, index) => (
                <li key={link.id ?? `${link.label}-${index}`}>
                  <a
                    href={link.url}
                    className="font-medium text-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}

        <div
          className={cn(
            'flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between',
            !copyright && socialLinks.length === 0 && 'hidden',
          )}
        >
          {copyright ? <p>{decodeCmsTextEntities(copyright)}</p> : <span />}
          {socialLinks.length > 0 ? (
            <ul className="flex flex-wrap gap-4">
              {socialLinks.map((link, index) => (
                <li key={link.id ?? `${link.platform}-${index}`}>
                  <a
                    href={link.url}
                    className="font-medium text-foreground transition-colors hover:text-primary"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {socialPlatformLabels[link.platform]}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </footer>
  )
}
