import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface PerformanceMetrics {
  asrLatency: number;
  llmLatency: number;
  ttsLatency: number;
  endToEndLatency: number;
  cpuUsage: number;
  memoryUsage: number;
}

export class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];

  async measureEndToEndLatency(): Promise<number> {
    const startTime = Date.now();

    try {
      // Simulate ASR
      await this.measureASRLatency();

      // Simulate LLM
      await this.measureLLMLatency();

      // Simulate TTS
      await this.measureTTSLatency();

      return Date.now() - startTime;
    } catch (error) {
      console.error('End-to-end latency measurement error:', error);
      return -1;
    }
  }

  async measureASRLatency(): Promise<number> {
    const startTime = Date.now();

    // Simulate ASR (would be actual Whisper call in production)
    await this.simulateDelay(500, 1500);

    const latency = Date.now() - startTime;
    console.log(`🎤 ASR Latency: ${latency}ms`);

    return latency;
  }

  async measureLLMLatency(): Promise<number> {
    const startTime = Date.now();

    // Simulate LLM (would be actual GLM call in production)
    await this.simulateDelay(1000, 3000);

    const latency = Date.now() - startTime;
    console.log(`🧠 LLM Latency: ${latency}ms`);

    return latency;
  }

  async measureTTSLatency(): Promise<number> {
    const startTime = Date.now();

    // Simulate TTS (would be actual Edge-TTS call in production)
    await this.simulateDelay(200, 800);

    const latency = Date.now() - startTime;
    console.log(`🔊 TTS Latency: ${latency}ms`);

    return latency;
  }

  private async simulateDelay(min: number, max: number): Promise<void> {
    const delay = Math.random() * (max - min) + min;
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  async measureCPUUsage(): Promise<number> {
    try {
      const { stdout } = await execAsync('top -bn1 | grep "Cpu(s)"');
      const cpuUsage = parseFloat(stdout.trim().split(',')[0].split(':')[1].trim());
      return cpuUsage;
    } catch (error) {
      console.error('CPU usage measurement error:', error);
      return 0;
    }
  }

  async measureMemoryUsage(): Promise<number> {
    try {
      const { stdout } = await execAsync('free -m | awk \'NR==2{print $3 * 100 / $2}\'');
      const memUsage = parseFloat(stdout.trim());
      return memUsage;
    } catch (error) {
      console.error('Memory usage measurement error:', error);
      return 0;
    }
  }

  async collectMetrics(): Promise<PerformanceMetrics> {
    const metrics = {
      asrLatency: await this.measureASRLatency(),
      llmLatency: await this.measureLLMLatency(),
      ttsLatency: await this.measureTTSLatency(),
      endToEndLatency: 0,
      cpuUsage: await this.measureCPUUsage(),
      memoryUsage: await this.measureMemoryUsage(),
    };

    metrics.endToEndLatency = metrics.asrLatency + metrics.llmLatency + metrics.ttsLatency;

    this.metrics.push(metrics);

    return metrics;
  }

  getAverageMetrics(): PerformanceMetrics | null {
    if (this.metrics.length === 0) return null;

    const sum = this.metrics.reduce((acc, m) => ({
      asrLatency: acc.asrLatency + m.asrLatency,
      llmLatency: acc.llmLatency + m.llmLatency,
      ttsLatency: acc.ttsLatency + m.ttsLatency,
      endToEndLatency: acc.endToEndLatency + m.endToEndLatency,
      cpuUsage: acc.cpuUsage + m.cpuUsage,
      memoryUsage: acc.memoryUsage + m.memoryUsage,
    }), {
      asrLatency: 0,
      llmLatency: 0,
      ttsLatency: 0,
      endToEndLatency: 0,
      cpuUsage: 0,
      memoryUsage: 0,
    });

    const count = this.metrics.length;

    return {
      asrLatency: sum.asrLatency / count,
      llmLatency: sum.llmLatency / count,
      ttsLatency: sum.ttsLatency / count,
      endToEndLatency: sum.endToEndLatency / count,
      cpuUsage: sum.cpuUsage / count,
      memoryUsage: sum.memoryUsage / count,
    };
  }

  printMetrics(metrics: PerformanceMetrics): void {
    console.log('\n📊 Performance Metrics Report');
    console.log('================================');
    console.log(`ASR Latency:       ${metrics.asrLatency.toFixed(0)}ms`);
    console.log(`LLM Latency:       ${metrics.llmLatency.toFixed(0)}ms`);
    console.log(`TTS Latency:       ${metrics.ttsLatency.toFixed(0)}ms`);
    console.log(`End-to-End:        ${metrics.endToEndLatency.toFixed(0)}ms`);
    console.log(`CPU Usage:          ${metrics.cpuUsage.toFixed(1)}%`);
    console.log(`Memory Usage:       ${metrics.memoryUsage.toFixed(1)}%`);
    console.log('================================\n');

    // Check if latency meets target (< 2s)
    if (metrics.endToEndLatency < 2000) {
      console.log('✅ End-to-end latency meets target (< 2s)');
    } else {
      console.log('⚠️  End-to-end latency exceeds target (≥ 2s)');
    }
  }

  clearMetrics(): void {
    this.metrics = [];
    console.log('Metrics cleared');
  }

  getMetricsCount(): number {
    return this.metrics.length;
  }
}

// CLI interface
if (import.meta.url === `file://${process.argv[1]}`) {
  const monitor = new PerformanceMonitor();

  async function runBenchmark() {
    console.log('🚀 Starting performance benchmark...\n');

    // Collect 5 samples
    for (let i = 1; i <= 5; i++) {
      console.log(`\nSample ${i}/5:`);
      const metrics = await monitor.collectMetrics();
      monitor.printMetrics(metrics);

      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Print average
    console.log('\n📈 Average Metrics (5 samples):');
    console.log('================================');
    const avgMetrics = monitor.getAverageMetrics();
    if (avgMetrics) {
      monitor.printMetrics(avgMetrics);
    }
  }

  runBenchmark();
}
