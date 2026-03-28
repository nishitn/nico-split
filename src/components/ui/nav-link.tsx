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
      activeOptions={{ exact: true }}
      activeProps={{ className: 'bg-primary/10 text-primary' }}
      inactiveProps={{
        className:
          'text-muted-foreground hover:bg-sidebar-accent hover:text-foreground',
      }}
      className={
        'flex w-full flex-col items-center gap-2 rounded-md p-2 text-sm md:flex-row'
      }
    >
      {children}
    </Link>
  )
}
