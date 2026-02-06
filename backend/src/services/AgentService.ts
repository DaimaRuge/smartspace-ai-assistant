import { LLMService } from './LLMService.js';
import { Skill, SkillParams, SkillResult } from '../skills/Skill.js';
import { skillRegistry } from '../skills/SkillRegistry.js';
import { Message } from '../types/message.js';

export interface AgentConfig {
  systemPrompt?: string;
  maxIterations?: number;
  temperature?: number;
}

export interface AgentTask {
  id: string;
  userIntent: string;
  context?: Record<string, any>;
  startTime: Date;
}

export interface AgentResult {
  taskId: string;
  success: boolean;
  response: string;
  usedSkills: string[];
  duration: number;
  error?: string;
}

export class AgentService {
  private llm: LLMService;
  private config: Required<AgentConfig>;
  private conversationHistory: Map<string, Message[]> = new Map();

  constructor(llm: LLMService, config: AgentConfig = {}) {
    this.llm = llm;
    this.config = {
      systemPrompt: config.systemPrompt || this.getDefaultSystemPrompt(),
      maxIterations: config.maxIterations || 3,
      temperature: config.temperature || 0.7,
    };
  }

  private getDefaultSystemPrompt(): string {
    const skills = skillRegistry.getAll().map(s =>
      `- ${s.config.id}: ${s.config.description}\n  Triggers: ${s.config.triggers.join(', ')}`
    ).join('\n');

    return `You are SmartSpace AI Assistant, an intelligent voice assistant for smart spaces.

## Available Skills:
${skills}

## Your Role:
1. Understand user's intent from their voice/text input
2. Determine which skill(s) to use
3. Execute the skill(s) with appropriate parameters
4. Provide a helpful, conversational response

## Guidelines:
- Be concise and helpful
- Ask for clarification if user intent is unclear
- Use skills to accomplish tasks
- Provide status updates for complex tasks
- Handle errors gracefully

## Response Format:
If you use a skill, structure your response as:
"Skill used: [skill name]
Result: [result]
Message: [your conversational response]"
`;
  }

  async processTask(userIntent: string, sessionId: string): Promise<AgentResult> {
    const startTime = Date.now();
    const taskId = `task-${Date.now()}`;

    try {
      // Get conversation history
      const history = this.getConversationHistory(sessionId);

      // Build messages for LLM
      const messages: Message[] = [
        { role: 'system', content: this.config.systemPrompt },
        ...history,
        { role: 'user', content: userIntent },
      ];

      // Get LLM response
      const response = await this.llm.chat(messages);

      // Analyze response to determine if skill should be used
      const { shouldUseSkill, skillId, skillParams } = this.analyzeIntent(userIntent, response);

      let usedSkills: string[] = [];
      let finalResponse = response;

      if (shouldUseSkill && skillId) {
        // Execute skill
        const skillResult = await this.executeSkill(skillId, skillParams);
        usedSkills.push(skillId);

        // Generate response based on skill result
        if (skillResult.success) {
          finalResponse = skillResult.message || `已完成${skillId}任务。`;
        } else {
          finalResponse = `抱歉，执行${skillId}任务时出错：${skillResult.error}`;
        }
      }

      // Update conversation history
      this.addMessageToHistory(sessionId, { role: 'user', content: userIntent });
      this.addMessageToHistory(sessionId, { role: 'assistant', content: finalResponse });

      // Limit history to last 10 messages
      this.trimHistory(sessionId, 10);

      return {
        taskId,
        success: true,
        response: finalResponse,
        usedSkills,
        duration: Date.now() - startTime,
      };
    } catch (error) {
      return {
        taskId,
        success: false,
        response: '抱歉，处理您的请求时出错。',
        usedSkills: [],
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private analyzeIntent(userIntent: string, llmResponse: string): {
    shouldUseSkill: boolean;
    skillId?: string;
    skillParams?: SkillParams;
  } {
    // Find matching skills based on triggers
    const matchingSkills = skillRegistry.findMatchingSkills(userIntent);

    if (matchingSkills.length === 0) {
      return { shouldUseSkill: false };
    }

    // Use the first matching skill (could be improved with LLM-based selection)
    const selectedSkill = matchingSkills[0];
    const skillParams = this.extractParams(userIntent, selectedSkill);

    return {
      shouldUseSkill: true,
      skillId: selectedSkill.config.id,
      skillParams,
    };
  }

  private extractParams(userIntent: string, skill: Skill): SkillParams {
    // Simple parameter extraction - could be improved with NLP
    const params: SkillParams = {};

    // Extract device name for smart home
    if (skill.config.id === 'smart-home') {
      const deviceMatch = userIntent.match(/(?:打开|关闭|控制)\s*(?:.*?的)?(\w+)(?:的)?(\w+)/);
      if (deviceMatch) {
        params.location = deviceMatch[1];
        params.device = deviceMatch[2];
      }

      const actionMatch = userIntent.match(/(打开|关闭|开启|停止)/);
      if (actionMatch) {
        params.action = actionMatch[1] === '打开' || actionMatch[1] === '开启' ? 'turnOn' : 'turnOff';
      }
    }

    // Extract location for weather
    if (skill.config.id === 'weather') {
      const locationMatch = userIntent.match(/(\w+)(?:的)?天气/);
      if (locationMatch) {
        params.location = locationMatch[1];
      }
    }

    return params;
  }

  private async executeSkill(skillId: string, params: SkillParams): Promise<SkillResult> {
    const skill = skillRegistry.get(skillId);
    if (!skill) {
      return { success: false, error: `Skill not found: ${skillId}` };
    }

    return skill.execute(params);
  }

  private getConversationHistory(sessionId: string): Message[] {
    return this.conversationHistory.get(sessionId) || [];
  }

  private addMessageToHistory(sessionId: string, message: Message): void {
    const history = this.getConversationHistory(sessionId);
    history.push(message);
    this.conversationHistory.set(sessionId, history);
  }

  private trimHistory(sessionId: string, maxMessages: number): void {
    const history = this.getConversationHistory(sessionId);
    if (history.length > maxMessages) {
      this.conversationHistory.set(sessionId, history.slice(-maxMessages));
    }
  }

  clearHistory(sessionId: string): void {
    this.conversationHistory.delete(sessionId);
  }

  clearAllHistory(): void {
    this.conversationHistory.clear();
  }
}
