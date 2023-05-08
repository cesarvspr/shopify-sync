import Bull from 'bull';

export type Job = {
  id: string | Bull.JobId;
  state: string | undefined;
  processedOn: Date | number | string | undefined;
  progress: number;
};

export type JobResponse = Job[];
