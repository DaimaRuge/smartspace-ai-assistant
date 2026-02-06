import { Skill, SkillParams, SkillResult, SkillConfig } from './Skill.js';

export class CalendarSkill extends Skill {
  readonly config: SkillConfig = {
    id: 'calendar',
    name: '日历与提醒',
    description: '查询日程、添加提醒、设置闹钟',
    triggers: [
      '日程', '日历', '会议', '提醒', '闹钟',
      '添加', '查看', '今天', '明天', '下周',
      '提醒我', '设置', '下午', '上午'
    ],
    parameters: [
      {
        name: 'action',
        type: 'string',
        required: true,
        description: '操作类型 (view/add/delete)',
      },
      {
        name: 'title',
        type: 'string',
        required: false,
        description: '日程或提醒标题',
      },
      {
        name: 'time',
        type: 'string',
        required: false,
        description: '时间',
      },
      {
        name: 'date',
        type: 'string',
        required: false,
        description: '日期',
      },
    ],
  };

  private events: any[] = [];

  async execute(params: SkillParams): Promise<SkillResult> {
    const { action, title, time, date } = params;

    try {
      let result: any = {};
      let message = '';

      switch (action) {
        case 'view':
          result = {
            events: this.events,
            count: this.events.length,
          };
          message = this.getEventSummary();
          break;

        case 'add':
          const newEvent = {
            id: `evt-${Date.now()}`,
            title: title || '提醒',
            time: time || '明天 9:00',
            date: date || new Date().toISOString().split('T')[0],
            created: new Date().toISOString(),
          };
          this.events.push(newEvent);
          result = newEvent;
          message = `已添加日程: ${newEvent.title}，时间: ${newEvent.time}`;
          break;

        case 'delete':
          const eventIndex = this.events.findIndex(e => e.id === title);
          if (eventIndex > -1) {
            const deletedEvent = this.events.splice(eventIndex, 1)[0];
            result = { deleted: deletedEvent };
            message = `已删除日程: ${deletedEvent.title}`;
          } else {
            return {
              success: false,
              error: '未找到指定的日程',
            };
          }
          break;

        default:
          return {
            success: false,
            error: `Unknown action: ${action}`,
          };
      }

      return {
        success: true,
        data: result,
        message,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private getEventSummary(): string {
    if (this.events.length === 0) {
      return '当前没有日程安排';
    }

    const summary = this.events
      .map(e => `${e.title} - ${e.time}`)
      .join('，');

    return `您有 ${this.events.length} 个日程: ${summary}`;
  }
}
