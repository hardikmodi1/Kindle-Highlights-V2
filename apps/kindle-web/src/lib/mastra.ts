import { Mastra } from '@mastra/core';
import { bookRecommenderAgent } from './agents/bookRecommenderAgent';

export const mastra = new Mastra({ agents: { bookRecommenderAgent } });
