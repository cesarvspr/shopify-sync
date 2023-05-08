import Bull from 'bull';
import {JobResponse} from '~/domain/models/private';

export function toJobResponse<UploadedFile>(
  jobs: Bull.Job<UploadedFile>[]
): Promise<JobResponse> {
  const aux = jobs.map(async (element: Bull.Job<UploadedFile>) => {
    const state = await element?.getState();
    const progress = await element.progress();

    return {
      id: element.id,
      state,
      processedOn:
        element.processedOn !== undefined
          ? new Date(element.processedOn * 1000).toUTCString()
          : undefined,
      progress,
    };
  });
  return Promise.all(aux);
}
