import { Skill } from './Skill.js';
import { SmartHomeSkill } from './SmartHomeSkill.js';
import { WeatherSkill } from './WeatherSkill.js';
import { CalendarSkill } from './CalendarSkill.js';
import { OpenClawSkill } from './OpenClawSkill.js';

export class SkillRegistry {
  private skills: Map<string, Skill> = new Map();

  constructor() {
    // Register default skills
    this.register(new SmartHomeSkill());
    this.register(new WeatherSkill());
    this.register(new CalendarSkill());
    this.register(new OpenClawSkill());
  }

  register(skill: Skill): void {
    this.skills.set(skill.config.id, skill);
  }

  get(id: string): Skill | undefined {
    return this.skills.get(id);
  }

  getAll(): Skill[] {
    return Array.from(this.skills.values());
  }

  findMatchingSkills(userInput: string): Skill[] {
    return Array.from(this.skills.values()).filter(skill =>
      skill.canHandle(userInput)
    );
  }

  async executeSkill(skillId: string, params: any): Promise<any> {
    const skill = this.get(skillId);
    if (!skill) {
      throw new Error(`Skill not found: ${skillId}`);
    }
    return skill.execute(params);
  }
}

export const skillRegistry = new SkillRegistry();
