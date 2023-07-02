import { NextResponse } from 'next/server';
import { strapiFetch } from '../../../modules/strapi/strapi.utils';
import { StrapiResponseCollection, Survey } from '@pluto/survey-model';
import { extractError } from '@pluto/utils';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const version = searchParams.get('version') || 'v1.0.0';
  const response = await strapiFetch('/surveys', {
    'filters[version][$eq]': version,
    'populate[0]': 'groups',
    'populate[1]': 'groups.questions',
  });
  if (!response.ok) {
    return NextResponse.json(await extractError(response), {
      status: response.status,
    });
  }

  const data: StrapiResponseCollection<Survey> = await response.json();
  return NextResponse.json(data);
}
