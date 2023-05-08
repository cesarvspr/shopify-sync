import {Product} from '@prisma/client';
export type ProductQuery = {id: string};
export type ProductResponse = Product | Product[];
