import { createPinia } from 'pinia'
import { useAuthStore } from './auth'

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default function store(/* { ssrContext } */) {
  const pinia = createPinia()

  return pinia
}

export { useAuthStore }