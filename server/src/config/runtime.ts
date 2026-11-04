export const isProductionRuntime = () =>
  process.env.NODE_ENV === 'production' ||
  (Boolean(process.env.VERCEL) && process.env.NODE_ENV !== 'test');

export const getJwtSecret = (): string | null => process.env.JWT_SECRET?.trim() || null;