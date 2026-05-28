import type { TopbarLinkWithIcon } from '../model/topbar-link-with-icon'

import { TopbarLinkView } from './topbar-link-view'

type TopbarLinkProps = {
  link: TopbarLinkWithIcon
  className?: string
  onClick?: () => void
}

export function TopbarLink({ link, className, onClick }: TopbarLinkProps) {
  return <TopbarLinkView link={link} className={className} onClick={onClick} />
}
