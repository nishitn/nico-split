import { Link } from '@tanstack/react-router'

export function NavLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <Link
      to={href}
      activeProps={{ className: 'bg-primary/10 text-primary' }}
      inactiveProps={{
        className:
          'text-muted-foreground hover:bg-sidebar-accent hover:text-foreground',
      }}
      className={
        'flex items-center gap-2 rounded-md p-2 text-sm flex-col md:flex-row w-full'
      }
    >
      {children}
    </Link>
  )
}
