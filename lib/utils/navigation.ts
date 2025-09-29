import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

/**
 * Navigate with NextTopLoader support
 * Adds a small delay to ensure the toploader starts before navigation
 */
export function navigateWithLoader(router: AppRouterInstance, path: string, delay: number = 100) {
  setTimeout(() => {
    router.push(path);
  }, delay);
}

/**
 * Replace current route with NextTopLoader support
 */
export function replaceWithLoader(router: AppRouterInstance, path: string, delay: number = 100) {
  setTimeout(() => {
    router.replace(path);
  }, delay);
} 