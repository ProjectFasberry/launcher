const getStaticFile = (path: string) => `${import.meta.env.VITE_VOLUME_URL}${path}` // temporarly

export const BACKGROUND_IMG = getStaticFile("/static/arts/8332de192322939.webp")