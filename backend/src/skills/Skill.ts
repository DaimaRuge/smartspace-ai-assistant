export interface SkillParams {
  [key: string]: any;
}

export interface SkillResult {
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
}

export interface SkillConfig {
  id: string;
  name: string;
  description: string;
  triggers: string[];
  parameters?: {
    name: string;
    type: string;
    required: boolean;
    description: string;
  }[];
}

export abstract class Skill {
  abstract readonly config: SkillConfig;

  abstract execute(params: SkillParams): Promise<SkillResult>;

  canHandle(userInput: string): boolean {
    const lowerInput = userInput.toLowerCase();
    return this.config.triggers.some(trigger =>
      lowerInput.includes(trigger.toLowerCase())
    );
  }

  validateParams(params: SkillParams): boolean {
    if (!this.config.parameters) return true;

    for (const param of this.config.parameters) {
      if (param.required && params[param.name] === undefined) {
        return false;
      }
    }

    return true;
  }
}
