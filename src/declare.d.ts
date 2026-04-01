declare global {
  type WrapRes<T> = { data: T } | { error: string }
}

export {}