import React from 'react'

type IconProps = React.SVGProps<SVGSVGElement> & { size?: number }

const Icon: React.FC<IconProps & { children: React.ReactNode }> = ({
  size = 16,
  children,
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {children}
  </svg>
)

export const Send: React.FC<IconProps> = (props) => (
  <Icon {...props}><path d="M22 2 11 13" /><path d="M22 2 15 22 11 13 2 9z" /></Icon>
)

export const Copy: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </Icon>
)

export const Check: React.FC<IconProps> = (props) => (
  <Icon {...props}><path d="M20 6 9 17l-5-5" /></Icon>
)

export const ChevronDown: React.FC<IconProps> = (props) => (
  <Icon {...props}><path d="m6 9 6 6 6-6" /></Icon>
)

export const ChevronRight: React.FC<IconProps> = (props) => (
  <Icon {...props}><path d="m9 18 6-6-6-6" /></Icon>
)

export const ChevronUp: React.FC<IconProps> = (props) => (
  <Icon {...props}><path d="m18 15-6-6-6 6" /></Icon>
)

export const Plus: React.FC<IconProps> = (props) => (
  <Icon {...props}><path d="M5 12h14" /><path d="M12 5v14" /></Icon>
)

export const Minus: React.FC<IconProps> = (props) => (
  <Icon {...props}><path d="M5 12h14" /></Icon>
)

export const X: React.FC<IconProps> = (props) => (
  <Icon {...props}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></Icon>
)

export const Search: React.FC<IconProps> = (props) => (
  <Icon {...props}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></Icon>
)

export const Star: React.FC<IconProps> = (props) => (
  <Icon {...props}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></Icon>
)

export const StarFilled: React.FC<IconProps> = (props) => (
  <Icon {...props} fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></Icon>
)

export const Grid: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
  </Icon>
)

export const List: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
  </Icon>
)

export const Trash: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
  </Icon>
)

export const GripVertical: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <circle cx="9" cy="12" r="1" /><circle cx="9" cy="5" r="1" /><circle cx="9" cy="19" r="1" />
    <circle cx="15" cy="12" r="1" /><circle cx="15" cy="5" r="1" /><circle cx="15" cy="19" r="1" />
  </Icon>
)

export const Play: React.FC<IconProps> = (props) => (
  <Icon {...props}><polygon points="6 3 20 12 6 21 6 3" /></Icon>
)

export const RefreshCw: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
    <path d="M8 16H3v5" />
  </Icon>
)

export const Clock: React.FC<IconProps> = (props) => (
  <Icon {...props}><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></Icon>
)

export const Tag: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" />
    <circle cx="7.5" cy="7.5" r=".5" fill="currentColor" />
  </Icon>
)

export const History: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" /><path d="M12 7v5l4 2" />
  </Icon>
)

export const Sliders: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" />
    <line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" />
    <line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" />
    <line x1="2" y1="14" x2="6" y2="14" /><line x1="10" y1="8" x2="14" y2="8" />
    <line x1="18" y1="16" x2="22" y2="16" />
  </Icon>
)

export const Zap: React.FC<IconProps> = (props) => (
  <Icon {...props}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></Icon>
)

export const Code: React.FC<IconProps> = (props) => (
  <Icon {...props}><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></Icon>
)

export const FileText: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
    <line x1="10" y1="9" x2="8" y2="9" />
  </Icon>
)

export const ArrowRight: React.FC<IconProps> = (props) => (
  <Icon {...props}><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></Icon>
)

export const ArrowDown: React.FC<IconProps> = (props) => (
  <Icon {...props}><path d="M12 5v14" /><path d="m19 12-7 7-7-7" /></Icon>
)

export const Eye: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
    <circle cx="12" cy="12" r="3" />
  </Icon>
)

export const EyeOff: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
    <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
    <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
    <path d="m2 2 20 20" />
  </Icon>
)

export const Wand: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="M15 4V2" /><path d="M15 16v-2" /><path d="M8 9h2" /><path d="M20 9h2" />
    <path d="M17.8 11.8 19 13" /><path d="M15 9h.01" />
    <path d="M17.8 6.2 19 5" /><path d="m3 21 9-9" />
    <path d="M12.2 6.2 11 5" />
  </Icon>
)

export const ToggleLeft: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <rect x="1" y="5" width="22" height="14" rx="7" ry="7" />
    <circle cx="8" cy="12" r="3" />
  </Icon>
)

export const ToggleRight: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <rect x="1" y="5" width="22" height="14" rx="7" ry="7" />
    <circle cx="16" cy="12" r="3" />
  </Icon>
)

export const Sparkles: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    <path d="M20 3v4" /><path d="M22 5h-4" />
  </Icon>
)

export const Bot: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="M12 8V4H8" />
    <rect width="16" height="12" x="4" y="8" rx="2" />
    <path d="M2 14h2" /><path d="M20 14h2" />
    <path d="M15 13v2" /><path d="M9 13v2" />
  </Icon>
)

export const User: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </Icon>
)

export const Settings: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </Icon>
)

export const Columns: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
    <line x1="12" y1="3" x2="12" y2="21" />
  </Icon>
)
