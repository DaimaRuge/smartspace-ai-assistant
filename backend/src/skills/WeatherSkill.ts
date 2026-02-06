import { Skill, SkillParams, SkillResult, SkillConfig } from './Skill.js';

export class WeatherSkill extends Skill {
  readonly config: SkillConfig = {
    id: 'weather',
    name: '天气查询',
    description: '查询当前天气和未来天气预报',
    triggers: [
      '天气', '气温', '温度', '下雨', '晴', '阴', '多云',
      '今天天气', '明天天气', '天气预报', '空气质量'
    ],
    parameters: [
      {
        name: 'type',
        type: 'string',
        required: false,
        description: '查询类型 (current/forecast)',
      },
      {
        name: 'location',
        type: 'string',
        required: false,
        description: '地点',
      },
    ],
  };

  async execute(params: SkillParams): Promise<SkillResult> {
    const { type = 'current', location = '当前位置' } = params;

    try {
      // TODO: Integrate with weather API (OpenMeteo or OpenWeatherMap)
      // Here we simulate weather data

      const weatherData = {
        location,
        type,
        timestamp: new Date().toISOString(),
        data: type === 'current'
          ? {
              temperature: 22,
              condition: '晴',
              humidity: 65,
              windSpeed: 5,
              aqi: 45,
            }
          : {
              forecast: [
                { date: '今天', temp: '18-26', condition: '晴' },
                { date: '明天', temp: '17-24', condition: '多云' },
                { date: '后天', temp: '16-23', condition: '小雨' },
              ],
            },
      };

      const message = type === 'current'
        ? `${location}当前天气：${weatherData.data.condition}，温度 ${weatherData.data.temperature}°C，湿度 ${weatherData.data.humidity}%，空气质量 ${weatherData.data.aqi}`
        : `${location}未来3天天气预报：${weatherData.data.forecast.map((f: any) => `${f.date} ${f.condition} ${f.temp}`).join('，')}`;

      return {
        success: true,
        data: weatherData,
        message,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
