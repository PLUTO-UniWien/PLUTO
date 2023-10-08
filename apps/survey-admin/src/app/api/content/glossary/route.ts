import { singleTypeGetter } from '../../../../modules/strapi/strapi.utils';

export const GET = singleTypeGetter('/glossary-page', { populate: '*' });
