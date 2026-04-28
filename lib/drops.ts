import {
  LAUNCHES,
  getLaunchBySlug,
  getLaunchByTag,
  getLaunchForProductTags,
  isLaunchLive,
  type Launch,
  type LaunchStatus,
} from '@/lib/launches'

export type DropStatus = LaunchStatus
export type Drop = Launch

export const DROPS: Drop[] = LAUNCHES

export const getDropBySlug = getLaunchBySlug
export const getDropByTag = getLaunchByTag
export const getDropForProductTags = getLaunchForProductTags
export const isDropLive = isLaunchLive
