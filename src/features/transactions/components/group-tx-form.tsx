import { UsersIcon } from 'lucide-react'
import type { Group } from '@/features/groups/types'
import type { User } from '@/features/users/types'
import type { ReactNode } from 'react'
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxItem,
  ComboboxList,
  useComboboxAnchor,
} from '@/components/ui/combobox'
import { FieldRow } from '@/components/ui/field-row'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useGroups } from '@/features/groups/api'
import { useCurrentUser, useFriends } from '@/features/users/api'
import { cn } from '@/lib/utils'

export type SelectionMode = 'group' | 'manual' | 'none'

export interface GroupPeopleMetadata {
  groupId: string
  members: Array<User>
  selectionMode: SelectionMode
}

export function GroupPeopleInput({
  metadata,
  updateMetadata,
}: {
  metadata: GroupPeopleMetadata
  updateMetadata: (updates: Partial<GroupPeopleMetadata>) => void
}) {
  const { data: groups = [], isLoading: isLoadingGroups } = useGroups()

  const isGroupSelectDiabled = metadata.selectionMode === 'manual'
  const isPeopleSeclectDisabled = metadata.selectionMode === 'group'

  const changeGroup = (groupId: string) => {
    const group = groups.find((g) => g.id === groupId)
    if (!group) return

    updateMetadata({
      groupId,
      members: [...group.members],
      selectionMode: 'group',
    })
  }

  const clearSelectedGroup = () => {
    updateMetadata({
      groupId: '',
      members: [],
      selectionMode: 'none',
    })
  }

  const handlePeopleChange = (people: Array<User>) => {
    updateMetadata({
      members: people,
      selectionMode: people.length > 0 ? 'manual' : 'none',
      groupId: '',
    })
  }

  return (
    <FieldRow label="Participant">
      <div className="flex w-full flex-col gap-4 xl:flex-row">
        <div className="w-full flex-1 xl:w-1/2">
          <GroupSelector
            groups={groups}
            isLoading={isLoadingGroups}
            selectedGroupId={metadata.groupId}
            onGroupChange={changeGroup}
            onClear={clearSelectedGroup}
            disabled={isGroupSelectDiabled}
          />
        </div>
        {/* Desktop */}
        <div className="text-muted-foreground relative -left-1 hidden items-center px-2 text-xs font-semibold tracking-widest uppercase xl:flex">
          OR
        </div>
        {/* Mobile */}
        <div className="relative my-2 flex w-full items-center px-4 xl:hidden">
          <div className="border-border absolute inset-y-1/2 right-0 left-0 z-0 border-t"></div>
          <div className="bg-background text-muted-foreground relative z-10 mx-auto px-3 text-xs font-semibold tracking-widest uppercase">
            OR
          </div>
        </div>
        <div className="w-full flex-1 xl:w-1/2">
          <PeopleChipsInput
            selectedPeople={metadata.members}
            onPeopleChange={handlePeopleChange}
            disabled={isPeopleSeclectDisabled}
          />
        </div>
      </div>
    </FieldRow>
  )
}

// Select User for Group Transfer
export function UserSelect({
  people,
  value,
  onChange,
  placeholder,
}: {
  people: Array<User>
  value: string
  onChange: (value: string) => void
  placeholder: string
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent align="end" position="popper">
        {people.length === 0 ? (
          <SelectItem value="none">Add people first</SelectItem>
        ) : (
          people.map((person) => (
            <SelectItem key={person.id} value={person.id}>
              {person.name}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  )
}

function GroupSelector({
  groups,
  isLoading,
  selectedGroupId,
  onGroupChange,
  onClear,
  disabled,
}: {
  groups: Array<Group>
  isLoading: boolean
  selectedGroupId: string
  onGroupChange: (groupId: string) => void
  onClear: () => void
  disabled: boolean
}) {
  const selectedGroup = groups.find((group) => group.id === selectedGroupId)

  let groupList: ReactNode
  if (isLoading) {
    groupList = <SelectItem value="loading">Loading...</SelectItem>
  } else {
    groupList = groups.map((group) => (
      <SelectItem key={group.id} value={group.id}>
        <div className="flex items-center gap-2">
          <UsersIcon className="text-muted-foreground size-3.5" />
          <span>{group.label}</span>
          <span className="text-muted-foreground text-xs">
            · {group.members.length} members
          </span>
        </div>
      </SelectItem>
    ))
  }

  return (
    <div className="flex w-full items-start gap-2">
      <div className="relative min-w-0 flex-1">
        <div
          className={cn(
            'rounded-md transition-all duration-200',
            disabled && 'bg-muted/50 pointer-events-none opacity-60 grayscale',
          )}
        >
          <Select value={selectedGroupId} onValueChange={onGroupChange}>
            <SelectTrigger
              className={cn(
                'w-full transition-all',
                selectedGroup &&
                  !disabled &&
                  'border-primary/30 bg-primary/5 text-foreground font-medium',
                disabled &&
                  'text-muted-foreground border-border/50 bg-transparent',
              )}
            >
              <div className="flex items-center gap-2 overflow-hidden">
                {selectedGroup && (
                  <UsersIcon className="text-primary size-4 shrink-0" />
                )}
                <SelectValue placeholder="Select a group" />
              </div>
            </SelectTrigger>
            <SelectContent align="end" position="popper">
              {groupList}
            </SelectContent>
          </Select>
        </div>

        {disabled && (
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            <span className="text-muted-foreground/60 text-xs italic">
              People added manually
            </span>
          </div>
        )}
      </div>

      {selectedGroup && !disabled && (
        <button
          type="button"
          onClick={onClear}
          className="text-destructive hover:text-destructive/80 hover:bg-destructive/10 shrink-0 rounded-md px-3 py-2.5 text-xs font-medium transition-colors"
        >
          Remove
        </button>
      )}
    </div>
  )
}

function PeopleChipsInput({
  selectedPeople,
  onPeopleChange,
  disabled,
}: {
  selectedPeople: Array<User>
  onPeopleChange: (people: Array<User>) => void
  disabled: boolean
}) {
  const { data: currentUser } = useCurrentUser()
  const { data: friends = [] } = useFriends()
  const chipsAnchor = useComboboxAnchor()
  const allUsers = [currentUser, ...friends].filter(
    (user, index, users) =>
      users.findIndex((candidate) => candidate.id === user.id) === index,
  )

  const availableUsers = allUsers.filter(
    (user) => !selectedPeople.some((person) => person.id === user.id),
  )

  const handleSelectionChange = (selectedValues: Array<string>) => {
    const newPeople = selectedValues
      .map((id) => allUsers.find((user) => user.id === id)!)
      .filter(Boolean)
    onPeopleChange(newPeople)
  }

  const selectedValues = selectedPeople.map((person) => person.id)

  return (
    <div className="relative w-full">
      <Combobox
        multiple
        value={selectedValues}
        onValueChange={handleSelectionChange}
      >
        <ComboboxChips
          ref={chipsAnchor}
          className={cn(
            'min-h-11 transition-all duration-200',
            disabled &&
              'border-border/50 bg-muted/50 pointer-events-none opacity-60 grayscale',
            !disabled && selectedPeople.length === 0 && 'py-0',
          )}
        >
          {selectedPeople.map((person) => (
            <ComboboxChip
              key={person.id}
              showRemove={!disabled}
              className={cn(
                'animate-in fade-in zoom-in-95 duration-200',
                disabled
                  ? 'text-muted-foreground border-border/50 border bg-transparent'
                  : 'bg-muted hover:bg-muted/80',
              )}
            >
              <span className="max-w-24 truncate text-xs font-semibold">
                {person.name}
              </span>
            </ComboboxChip>
          ))}
          {!disabled && (
            <ComboboxChipsInput
              placeholder={
                selectedPeople.length === 0
                  ? 'Type to add people...'
                  : 'Add more...'
              }
              className="text-sm"
            />
          )}
        </ComboboxChips>

        {!disabled && (
          <ComboboxContent anchor={chipsAnchor.current} align="start">
            <ComboboxList>
              {availableUsers.map((user) => (
                <ComboboxItem key={user.id} value={user.id}>
                  <div className="flex items-center gap-2.5">
                    <div className="bg-primary/10 text-primary flex size-6 items-center justify-center rounded-full text-xs font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium">{user.name}</span>
                  </div>
                </ComboboxItem>
              ))}
            </ComboboxList>
          </ComboboxContent>
        )}
      </Combobox>
    </div>
  )
}
