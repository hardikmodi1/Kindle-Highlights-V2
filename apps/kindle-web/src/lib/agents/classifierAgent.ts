import { Agent } from '@mastra/core/agent';

export const classifierAgent = new Agent({
  name: 'Classifier',
  instructions: {
    role: 'system',
    content: `You are expert at classifying the highlights according to keywords whether the given highlight 
      matches correctly with that keyword or not.
    `,
  },
  model: 'google/gemini-2.5-pro',
});
