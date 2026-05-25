import {
  AlertCircleIcon,
  ArrowDown01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  ArrowUp01Icon,
  Calendar03Icon,
  Cancel01Icon,
  CheckmarkCircle01Icon,
  CloudUploadIcon,
  Copy01Icon,
  Delete02Icon,
  DownloadIcon,
  EditIcon,
  EyeIcon,
  File01Icon,
  Folder01Icon,
  HelpCircleIcon,
  Home01Icon,
  Image01Icon,
  InformationCircleIcon,
  LinkIcon,
  Loading03Icon,
  Logout01Icon,
  Mail01Icon,
  Menu01Icon,
  MinusSignIcon,
  Notification03Icon,
  PlusSignIcon,
  RefreshIcon,
  Search01Icon,
  Settings01Icon,
  Share01Icon,
  Tick02Icon,
  UserIcon,
  ViewOffIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"
import type { ComponentProps } from "react"

export { HugeiconsIcon }
export type { IconSvgElement }

export type IconProps = Omit<ComponentProps<typeof HugeiconsIcon>, "icon">

function createIcon(icon: IconSvgElement, displayName: string) {
  function Icon(props: IconProps) {
    return <HugeiconsIcon icon={icon} {...props} />
  }

  Icon.displayName = displayName
  return Icon
}

// Raw icon elements for direct HugeiconsIcon usage.
export {
  AlertCircleIcon,
  ArrowDown01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  ArrowUp01Icon,
  Calendar03Icon,
  Cancel01Icon,
  CheckmarkCircle01Icon,
  CloudUploadIcon,
  Copy01Icon,
  Delete02Icon,
  DownloadIcon,
  EditIcon,
  EyeIcon,
  File01Icon,
  Folder01Icon,
  HelpCircleIcon,
  Home01Icon,
  Image01Icon,
  InformationCircleIcon,
  LinkIcon,
  Loading03Icon,
  Logout01Icon,
  Mail01Icon,
  Menu01Icon,
  MinusSignIcon,
  Notification03Icon,
  PlusSignIcon,
  RefreshIcon,
  Search01Icon,
  Settings01Icon,
  Share01Icon,
  Tick02Icon,
  UserIcon,
  ViewOffIcon,
}

// Wrapped icon components — extend as UI Kit components are added.
export const ArrowDown = createIcon(ArrowDown01Icon, "ArrowDown")
export const ArrowLeft = createIcon(ArrowLeft01Icon, "ArrowLeft")
export const ArrowRight = createIcon(ArrowRight01Icon, "ArrowRight")
export const ArrowUp = createIcon(ArrowUp01Icon, "ArrowUp")
export const Check = createIcon(Tick02Icon, "Check")
export const CheckCircle = createIcon(CheckmarkCircle01Icon, "CheckCircle")
export const ChevronDown = createIcon(ArrowDown01Icon, "ChevronDown")
export const ChevronLeft = createIcon(ArrowLeft01Icon, "ChevronLeft")
export const ChevronRight = createIcon(ArrowRight01Icon, "ChevronRight")
export const ChevronUp = createIcon(ArrowUp01Icon, "ChevronUp")
export const CircleX = createIcon(Cancel01Icon, "CircleX")
export const Copy = createIcon(Copy01Icon, "Copy")
export const Download = createIcon(DownloadIcon, "Download")
export const Eye = createIcon(EyeIcon, "Eye")
export const EyeOff = createIcon(ViewOffIcon, "EyeOff")
export const Home = createIcon(Home01Icon, "Home")
export const Loader2 = createIcon(Loading03Icon, "Loader2")
export const Menu = createIcon(Menu01Icon, "Menu")
export const Minus = createIcon(MinusSignIcon, "Minus")
export const Plus = createIcon(PlusSignIcon, "Plus")
export const Search = createIcon(Search01Icon, "Search")
export const Settings = createIcon(Settings01Icon, "Settings")
export const Trash2 = createIcon(Delete02Icon, "Trash2")
export const Upload = createIcon(CloudUploadIcon, "Upload")
export const User = createIcon(UserIcon, "User")
export const X = createIcon(Cancel01Icon, "X")
