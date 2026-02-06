import { Skill, SkillParams, SkillResult, SkillConfig } from './Skill.js';

export class SmartHomeSkill extends Skill {
  readonly config: SkillConfig = {
    id: 'smart-home',
    name: '智能家居控制',
    description: '控制智能设备的开关、场景模式等',
    triggers: [
      '打开', '关闭', '开启', '停止', '调高', '调低',
      '灯光', '空调', '窗帘', '电视', '风扇', '加湿器',
      '客厅', '卧室', '厨房', '卫生间',
      '回家', '离家', '睡眠', '观影', '离家模式'
    ],
    parameters: [
      {
        name: 'action',
        type: 'string',
        required: true,
        description: '操作类型 (turnOn/turnOff/setScene/setTemperature)',
      },
      {
        name: 'device',
        type: 'string',
        required: false,
        description: '设备名称或类型',
      },
      {
        name: 'location',
        type: 'string',
        required: false,
        description: '房间位置',
      },
      {
        name: 'value',
        type: 'any',
        required: false,
        description: '设置值 (温度、亮度等)',
      },
    ],
  };

  async execute(params: SkillParams): Promise<SkillResult> {
    const { action, device, location, value } = params;

    try {
      // TODO: Integrate with device manager
      // Here we simulate device control

      let result: any = {};

      switch (action) {
        case 'turnOn':
        case 'turnOff':
          result = {
            device: device || '指定设备',
            location: location || '全屋',
            state: action === 'turnOn' ? 'on' : 'off',
            timestamp: new Date().toISOString(),
          };
          break;

        case 'setScene':
          result = {
            scene: value || '默认场景',
            activated: true,
            timestamp: new Date().toISOString(),
          };
          break;

        case 'setTemperature':
          result = {
            device: device || '空调',
            location: location || '当前房间',
            temperature: value,
            timestamp: new Date().toISOString(),
          };
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
        message: this.getSuccessMessage(action, device, location, value),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private getSuccessMessage(
    action: string,
    device?: string,
    location?: string,
    value?: any
  ): string {
    const loc = location ? `${location}的` : '';
    const dev = device || '设备';

    switch (action) {
      case 'turnOn':
        return `已${loc}${dev}打开`;
      case 'turnOff':
        return `已${loc}${dev}关闭`;
      case 'setScene':
        return `已激活场景: ${value}`;
      case 'setTemperature':
        return `${loc}${dev}已设置为 ${value}°C`;
      default:
        return '操作完成';
    }
  }
}
