import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  Briefcase,
  Building2,
  CheckIcon,
  ChevronDownIcon,
  HeartHandshake,
  Home,
  
  Plane,
  SearchIcon,
  Users
} from 'lucide-react'
import * as React from 'react'
import { z } from 'zod'
import type {LucideIcon} from 'lucide-react';
import { AppLayout } from '@/components/layout/app-layout'
import { FormSection } from '@/components/layout/form-section'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import type { User } from '@/features/users/types'
import { useCurrentUser, useFriends } from '@/features/users/api'
import { cn } from '@/lib/utils'

const searchSchema = z.object({
  id: z.string().optional(),
})

export const Route = createFileRoute('/groups/form')({
  component: GroupFormPage,
  validateSearch: searchSchema,
})

interface GroupIconOption {
  value: string
  label: string
  icon: LucideIcon
  keywords: Array<string>
}

const GROUP_ICON_OPTIONS: Array<GroupIconOption> = [
  {
    value: 'users',
    label: 'People',
    icon: Users,
    keywords: [
      'group',
      'people',
      'friends',
      'flatmates',
      'roommates',
      'team',
      'crew',
      'squad',
    ],
  },
  {
    value: 'home',
    label: 'Home',
    icon: Home,
    keywords: ['home', 'house', 'flat', 'apartment', 'rent', 'room'],
  },
  {
    value: 'plane',
    label: 'Trip',
    icon: Plane,
    keywords: ['trip', 'travel', 'vacation', 'holiday', 'goa', 'flight'],
  },
  {
    value: 'briefcase',
    label: 'Work',
    icon: Briefcase,
    keywords: ['work', 'office', 'project', 'client', 'business', 'startup'],
  },
  {
    value: 'building',
    label: 'Stay',
    icon: Building2,
    keywords: ['stay', 'hotel', 'hostel', 'building', 'society', 'tower'],
  },
  {
    value: 'heart-handshake',
    label: 'Family',
    icon: HeartHandshake,
    keywords: ['family', 'parents', 'siblings', 'couple', 'wedding', 'home'],
  },
]

function getBestMatchingGroupIcon(name: string) {
  const normalizedName = name.trim().toLowerCase()
  if (!normalizedName) return GROUP_ICON_OPTIONS[0].value

  const tokens = normalizedName.split(/[\s/-]+/).filter(Boolean)

  let bestOption = GROUP_ICON_OPTIONS[0]
  let bestScore = 0

  for (const option of GROUP_ICON_OPTIONS) {
    let score = 0

    if (normalizedName === option.label.toLowerCase()) score += 120
    if (normalizedName.includes(option.label.toLowerCase())) score += 60

    for (const keyword of option.keywords) {
      if (normalizedName === keyword) score += 120
      else if (normalizedName.includes(keyword)) score += 50
      if (tokens.includes(keyword)) score += 30
    }

    if (score > bestScore) {
      bestScore = score
      bestOption = option
    }
  }

  return bestOption.value
}

function GroupFormPage() {
  const search = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })
  const isEditing = !!search.id
  const { data: currentUser } = useCurrentUser()
  const { data: friends = [] } = useFriends()

  const [groupName, setGroupName] = React.useState('')
  const [iconName, setIconName] = React.useState('users')
  const [memberIds, setMemberIds] = React.useState<Array<string>>([])
  const [peopleQuery, setPeopleQuery] = React.useState('')
  const [peopleOpen, setPeopleOpen] = React.useState(false)

  React.useEffect(() => {
    setIconName(getBestMatchingGroupIcon(groupName))
  }, [groupName])

  const selectedGroupIcon =
    GROUP_ICON_OPTIONS.find((option) => option.value === iconName) ??
    GROUP_ICON_OPTIONS[0]
  const selectablePeople = React.useMemo(() => {
    const deduped = new Map<string, User>()
    deduped.set(currentUser.id, currentUser)
    friends.forEach((friend) => deduped.set(friend.id, friend))
    return Array.from(deduped.values())
  }, [currentUser, friends])

  const selectedUsers = selectablePeople.filter((user) => memberIds.includes(user.id))
  const filteredUsers = selectablePeople.filter((user) => {
    const normalizedQuery = peopleQuery.trim().toLowerCase()
    if (!normalizedQuery) return true

    const searchableName = user.id === currentUser.id ? `${user.name} you` : user.name

    return searchableName.toLowerCase().includes(normalizedQuery)
  })

  React.useEffect(() => {
    if (memberIds.length === 0) {
      setMemberIds([currentUser.id])
    }
  }, [currentUser.id, memberIds.length])

  const toggleMember = (userId: string) => {
    setMemberIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate({ to: '/groups' })
  }

  return (
    <AppLayout
      routeTitle={isEditing ? 'Edit Group' : 'New Group'}
      routeSubtitle="Create a shared space with the right people first"
    >
      <div className="pb-20">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8 md:gap-10">
          <FormSection>
            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-[96px_minmax(0,1fr)] items-start gap-3 md:grid-cols-[120px_minmax(0,1fr)] md:gap-4">
                <GroupIconPicker
                  selectedGroupIcon={selectedGroupIcon}
                  iconName={iconName}
                  setIconName={setIconName}
                />

                <div className="flex flex-col gap-3">
                  <Label htmlFor="group-name" className="text-base font-semibold">
                    Group Label
                  </Label>
                  <Input
                    id="group-name"
                    placeholder="e.g. Flatmates, Goa Trip"
                    autoFocus
                    required
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    className="h-12 text-base"
                  />
                </div>
              </div>
            </div>
          </FormSection>

          <FormSection>
            <div className="grid gap-3 md:grid-cols-[120px_minmax(0,1fr)] md:items-start md:gap-4">
              <Label className="text-base font-semibold md:pt-3">People</Label>
              <div className="flex flex-col gap-3">
                <Popover open={peopleOpen} onOpenChange={setPeopleOpen}>
                  <div className="relative">
                    <PopoverAnchor asChild>
                      <div className="relative">
                        <SearchIcon className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                        <Input
                          value={peopleQuery}
                          onChange={(e) => {
                            const nextValue = e.target.value
                            setPeopleQuery(nextValue)
                            setPeopleOpen(nextValue.trim().length > 0)
                          }}
                          onFocus={() => {
                            if (peopleQuery.trim().length > 0) {
                              setPeopleOpen(true)
                            }
                          }}
                          onBlur={() => {
                            if (peopleQuery.trim().length === 0) {
                              setPeopleOpen(false)
                            }
                          }}
                          placeholder="Search people"
                          className="h-14 pl-9 text-base"
                        />
                      </div>
                    </PopoverAnchor>
                  </div>
                  {peopleQuery.trim().length > 0 ? (
                    <PopoverContent
                      className="w-(--radix-popover-trigger-width) p-2"
                      align="start"
                      sideOffset={8}
                      onOpenAutoFocus={(e) => e.preventDefault()}
                      onCloseAutoFocus={(e) => e.preventDefault()}
                    >
                      <div className="flex max-h-80 flex-col gap-2 overflow-y-auto pr-1">
                        {filteredUsers.length > 0 ? (
                          filteredUsers.map((user) => {
                            const checked = memberIds.includes(user.id)
                            return (
                              <button
                                key={user.id}
                                type="button"
                                onClick={() => {
                                  toggleMember(user.id)
                                  setPeopleQuery('')
                                  setPeopleOpen(false)
                                }}
                                className={cn(
                                  'flex items-center gap-3 rounded-xl border px-3 py-3 text-left transition-colors',
                                  checked
                                    ? 'border-primary bg-primary/10 text-primary'
                                    : 'hover:bg-muted/70 border-border bg-card text-foreground',
                                )}
                              >
                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-sm font-medium">
                                    {user.id === currentUser.id
                                      ? `${user.name} (You)`
                                      : user.name}
                                  </p>
                                </div>
                                {checked ? (
                                  <CheckIcon className="size-4 shrink-0" />
                                ) : null}
                              </button>
                            )
                          })
                        ) : (
                          <div className="text-muted-foreground px-3 py-4 text-sm">
                            No people match that search.
                          </div>
                        )}
                      </div>
                    </PopoverContent>
                  ) : null}
                </Popover>

                {selectedUsers.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedUsers.map((user) => (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => toggleMember(user.id)}
                        className="bg-primary/10 text-primary inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium"
                      >
                        <span className="truncate">
                          {user.id === currentUser.id ? `${user.name} (You)` : user.name}
                        </span>
                        <span className="text-primary/70 text-xs">x</span>
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </FormSection>

          <FormSection>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Button
                type="submit"
                size="lg"
                className="w-full font-semibold shadow-sm sm:w-auto sm:min-w-48"
              >
                Save
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="w-full sm:w-auto sm:min-w-32"
                onClick={() => navigate({ to: '/groups' })}
              >
                Cancel
              </Button>
            </div>
          </FormSection>
        </form>
      </div>
    </AppLayout>
  )
}

function GroupIconPicker({
  selectedGroupIcon,
  iconName,
  setIconName,
}: {
  selectedGroupIcon: GroupIconOption
  iconName: string
  setIconName: (value: string) => void
}) {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState('')

  const filteredOptions = React.useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return GROUP_ICON_OPTIONS

    return GROUP_ICON_OPTIONS.filter((option) =>
      option.label.toLowerCase().includes(normalizedQuery),
    )
  }, [query])

  return (
    <Popover
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (!nextOpen) setQuery('')
      }}
      modal={true}
    >
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className="relative h-16 w-full rounded-xl border-transparent bg-transparent p-0 shadow-none hover:bg-transparent md:h-[72px]"
        >
          <div className="relative h-full w-full">
            <div className="bg-primary/10 text-primary absolute inset-y-0 left-0 z-10 flex w-16 items-center justify-center rounded-xl md:w-[72px]">
              <selectedGroupIcon.icon className="size-7" />
            </div>
            <div className="absolute top-1/2 right-0 flex h-16 w-7 -translate-y-1/2 items-center justify-center rounded-r-xl transition-colors duration-200 group-hover/button:bg-muted/50 group-focus-visible/button:bg-muted/50 group-data-[state=open]:bg-primary/10 md:h-[72px]">
              <ChevronDownIcon className="text-muted-foreground size-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
            </div>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 max-w-[calc(100vw-2rem)] p-2"
        align="start"
        sideOffset={8}
      >
        <div className="flex flex-col gap-2">
          <div className="relative">
            <SearchIcon className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search icons"
              className="pl-9"
            />
          </div>

          <div className="flex max-h-80 flex-col gap-2 overflow-y-auto pr-1">
            {filteredOptions.map((option) => {
              const isSelected = option.value === iconName

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    setIconName(option.value)
                    setOpen(false)
                  }}
                  className={cn(
                    'flex items-center gap-3 rounded-xl border px-3 py-3 text-left transition-colors',
                    isSelected
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'hover:bg-muted/70 border-border bg-card text-foreground',
                  )}
                >
                  <div
                    className={cn(
                      'flex size-10 shrink-0 items-center justify-center rounded-xl border',
                      isSelected
                        ? 'border-primary/30 bg-primary/10'
                        : 'border-border bg-background',
                    )}
                  >
                    <option.icon className="size-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{option.label}</p>
                  </div>
                  {isSelected ? <CheckIcon className="size-4 shrink-0" /> : null}
                </button>
              )
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
