"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJwtSecret = exports.isProductionRuntime = void 0;
const isProductionRuntime = () => process.env.NODE_ENV === 'production' ||
    (Boolean(process.env.VERCEL) && process.env.NODE_ENV !== 'test');
exports.isProductionRuntime = isProductionRuntime;
const getJwtSecret = () => process.env.JWT_SECRET?.trim() || null;
exports.getJwtSecret = getJwtSecret;
