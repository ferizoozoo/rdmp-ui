export type RoadmapSkill = {
  name: string;
  description: string;
  resources: string[];
};

export type RoadmapProject = {
  name: string;
  description: string;
  resources: string[];
};

export type RoadmapMonth = {
  month: number;
  skillsToLearn: string[];
  projectsToBuild: string[];
};

export type Roadmap = {
  skills: RoadmapSkill[];
  projects: RoadmapProject[];
  timeline: RoadmapMonth[];
};