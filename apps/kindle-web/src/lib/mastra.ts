import { Mastra } from '@mastra/core';
import { bookRecommenderAgent } from './agents/bookRecommenderAgent';
import { classifierAgent } from './agents/classifierAgent';

export const mastra = new Mastra({ agents: { bookRecommenderAgent, classifierAgent } });
