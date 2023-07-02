import { NextResponse } from 'next/server';
import { strapiFetch } from '../../../modules/strapi/strapi.utils';
import {
  StrapiResponseCollection,
  Survey,
  SurveyResult,
} from '@pluto/survey-model';
import { extractError } from '../../../modules/utils/fetch.utils';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const version = searchParams.get('version') || 'v1.0.0';
  const response = await strapiFetch('/results', {
    'filters[version][$eq]': version,
  });
  if (!response.ok) {
    return NextResponse.json(await extractError(response), {
      status: response.status,
    });
  }

  const data = await response.json();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  // the results we want to persist
  const payload: SurveyResult = await request.json();

  // first we look up the Survey by version so that we can attach it as relationship
  const response = await strapiFetch('/surveys', {
    'filters[version][$eq]': payload.survey,
  });
  if (!response.ok) {
    return NextResponse.json(await extractError(response), {
      status: response.status,
    });
  }

  const { data }: StrapiResponseCollection<Survey> = await response.json();
  if (data.length === 0) {
    return NextResponse.json(
      { error: `Survey with id ${payload.survey} not found` },
      { status: 404 }
    );
  }
  const surveyId = data[0].id;
  const payloadWithId = { ...payload, survey: surveyId };
  const wrappedPayload = { data: payloadWithId };

  // now we create the result
  const resultResponse = await strapiFetch(
    '/results',
    {},
    {
      method: 'POST',
      body: JSON.stringify(wrappedPayload),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  if (!resultResponse.ok) {
    return NextResponse.json(await extractError(resultResponse), {
      status: resultResponse.status,
    });
  }
  return NextResponse.json(await resultResponse.json());
}
