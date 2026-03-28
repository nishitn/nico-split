export interface ActiveFormContext {
  parentHref: string
  label: string
}

export function getActiveFormContext(
  pathname: string,
  searchStr = '',
): ActiveFormContext | null {
  const isEditing = new URLSearchParams(searchStr).has('id')

  if (pathname === '/transactions/form') {
    return {
      parentHref: '/transactions',
      label: isEditing ? 'Edit Transaction' : 'New Transaction',
    }
  }

  if (pathname === '/accounts/form') {
    return {
      parentHref: '/accounts',
      label: isEditing ? 'Edit Account' : 'New Account',
    }
  }

  if (pathname === '/categories/form') {
    return {
      parentHref: '/categories',
      label: isEditing ? 'Edit Category' : 'New Category',
    }
  }

  if (pathname === '/groups/form') {
    return {
      parentHref: '/groups',
      label: isEditing ? 'Edit Group' : 'New Group',
    }
  }

  if (pathname === '/chapters/form') {
    return {
      parentHref: '/more',
      label: isEditing ? 'Edit Chapter' : 'New Chapter',
    }
  }

  return null
}
