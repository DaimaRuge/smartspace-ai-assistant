import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { PerformanceMonitor } from '../utils/PerformanceMonitor';

describe('PerformanceMonitor', () => {
  let monitor: PerformanceMonitor;
  const ITERATIONS = 5; // Number of benchmark samples

  beforeAll(() => {
    monitor = new PerformanceMonitor();
  });

  describe('ASR Latency', () => {
    it('should measure ASR latency', async () => {
      const metrics = await monitor.measureASRLatency();
      
      expect(metrics).toBeDefined();
      expect(metrics).toBeGreaterThan(0);
      expect(metrics).toBeLessThan(3000); // Max 3s for ASR
      
      console.log(`ASR Latency: ${metrics}ms`);
    }, 10000);

    it('should meet ASR SLA on average', async () => {
      const latencies: number[] = [];
      
      for (let i = 0; i < ITERATIONS; i++) {
        const latency = await monitor.measureASRLatency();
        latencies.push(latency);
        console.log(`Iteration ${i+1}/${ITERATIONS}: ${latency}ms`);
      }

      const avgLatency = latencies.reduce((sum, val) => sum + val, 0) / latencies.length;
      
      expect(avgLatency).toBeLessThan(1000); // 1s SLA
      console.log(`Average ASR Latency: ${avgLatency.toFixed(0)}ms`);
      console.log(`ASR SLA: < 1000ms - ${avgLatency < 1000 ? '✅ PASS' : '❌ FAIL'}`);
    }, 50000);
  });

  describe('LLM Latency', () => {
    it('should measure LLM latency', async () => {
      const metrics = await monitor.measureLLMLatency();
      
      expect(metrics).toBeDefined();
      expect(metrics).toBeGreaterThan(0);
      expect(metrics).toBeLessThan(5000); // Max 5s for LLM
      
      console.log(`LLM Latency: ${metrics}ms`);
    }, 15000);

    it('should meet LLM SLA on average', async () => {
      const latencies: number[] = [];
      
      for (let i = 0; i < ITERATIONS; i++) {
        const latency = await monitor.measureLLMLatency();
        latencies.push(latency);
        console.log(`Iteration ${i+1}/${ITERATIONS}: ${latency}ms`);
      }

      const avgLatency = latencies.reduce((sum, val) => sum + val, 0) / latencies.length;
      
      expect(avgLatency).toBeLessThan(2000); // 2s SLA
      console.log(`Average LLM Latency: ${avgLatency.toFixed(0)}ms`);
      console.log(`LLM SLA: < 2000ms - ${avgLatency < 2000 ? '✅ PASS' : '❌ FAIL'}`);
    }, 100000);
  });

  describe('TTS Latency', () => {
    it('should measure TTS latency', async () => {
      const metrics = await monitor.measureTTSLatency();
      
      expect(metrics).toBeDefined();
      expect(metrics).toBeGreaterThan(0);
      expect(metrics).toBeLessThan(2000); // Max 2s for TTS
      
      console.log(`TTS Latency: ${metrics}ms`);
    }, 5000);

    it('should meet TTS SLA on average', async () => {
      const latencies: number[] = [];
      
      for (let i = 0; i < ITERATIONS; i++) {
        const latency = await monitor.measureTTSLatency();
        latencies.push(latency);
        console.log(`Iteration ${i+1}/${ITERATIONS}: ${latency}ms`);
      }

      const avgLatency = latencies.reduce((sum, val) => sum + val, 0) / latencies.length;
      
      expect(avgLatency).toBeLessThan(500); // 0.5s SLA
      console.log(`Average TTS Latency: ${avgLatency.toFixed(0)}ms`);
      console.log(`TTS SLA: < 500ms - ${avgLatency < 500 ? '✅ PASS' : '❌ FAIL'}`);
    }, 25000);
  });

  describe('End-to-End Latency', () => {
    it('should measure end-to-end latency', async () => {
      const latency = await monitor.measureEndToEndLatency();
      
      expect(latency).toBeDefined();
      expect(latency).toBeGreaterThan(0);
      expect(latency).toBeLessThan(5000); // Max 5s
      
      console.log(`End-to-End Latency: ${latency}ms`);
      console.log(`End-to-End SLA: < 2000ms - ${latency < 2000 ? '✅ PASS' : '❌ FAIL'}`);
    }, 30000);

    it('should meet end-to-end SLA on average', async () => {
      const latencies: number[] = [];
      let passCount = 0;
      
      for (let i = 0; i < ITERATIONS; i++) {
        const latency = await monitor.measureEndToEndLatency();
        latencies.push(latency);
        
        if (latency < 2000) {
          passCount++;
        }
        
        console.log(`Iteration ${i+1}/${ITERATIONS}: ${latency}ms - ${latency < 2000 ? '✅ PASS' : '❌ FAIL'}`);
      }

      const avgLatency = latencies.reduce((sum, val) => sum + val, 0) / latencies.length;
      const passRate = (passCount / ITERATIONS) * 100;
      
      expect(avgLatency).toBeLessThan(2000); // 2s SLA
      expect(passRate).toBeGreaterThanOrEqual(80); // 80% pass rate
      console.log(`Average End-to-End Latency: ${avgLatency.toFixed(0)}ms`);
      console.log(`Pass Rate: ${passRate.toFixed(1)}%`);
      console.log(`End-to-End SLA: < 2000ms & 80% pass rate - ${avgLatency < 2000 && passRate >= 80 ? '✅ PASS' : '❌ FAIL'}`);
    }, 150000);
  });

  describe('CPU Usage', () => {
    it('should measure CPU usage', async () => {
      const cpuUsage = await monitor.measureCPUUsage();
      
      expect(cpuUsage).toBeDefined();
      expect(cpuUsage).toBeGreaterThanOrEqual(0);
      expect(cpuUsage).toBeLessThanOrEqual(100);
      
      console.log(`CPU Usage: ${cpuUsage.toFixed(1)}%`);
      console.log(`CPU SLA: < 70% - ${cpuUsage < 70 ? '✅ PASS' : '❌ FAIL'}`);
    }, 5000);
  });

  describe('Memory Usage', () => {
    it('should measure memory usage', async () => {
      const memUsage = await monitor.measureMemoryUsage();
      
      expect(memUsage).toBeDefined();
      expect(memUsage).toBeGreaterThanOrEqual(0);
      expect(memUsage).toBeLessThanOrEqual(100);
      
      console.log(`Memory Usage: ${memUsage.toFixed(1)}%`);
      console.log(`Memory SLA: < 70% - ${memUsage < 70 ? '✅ PASS' : '❌ FAIL'}`);
    }, 5000);
  });

  describe('Average Metrics', () => {
    it('should calculate average metrics over multiple samples', async () => {
      const sampleCount = 10;
      const samples: any[] = [];
      
      for (let i = 0; i < sampleCount; i++) {
        const metrics = await monitor.collectMetrics();
        samples.push(metrics);
        console.log(`Sample ${i+1}/${sampleCount} collected`);
      }

      const avgMetrics = monitor.getAverageMetrics();
      
      expect(avgMetrics).toBeDefined();
      expect(avgMetrics.asrLatency).toBeGreaterThan(0);
      expect(avgMetrics.llmLatency).toBeGreaterThan(0);
      expect(avgMetrics.ttsLatency).toBeGreaterThan(0);
      expect(avgMetrics.endToEndLatency).toBeGreaterThan(0);
      expect(avgMetrics.cpuUsage).toBeGreaterThanOrEqual(0);
      expect(avgMetrics.memoryUsage).toBeGreaterThanOrEqual(0);
      
      monitor.printMetrics(avgMetrics);
    }, 60000);

    it('should verify SLA compliance', async () => {
      const avgMetrics = await monitor.collectMetrics();
      
      // SLA verification
      const asrSLA = avgMetrics.asrLatency < 1000;
      const llmSLA = avgMetrics.llmLatency < 2000;
      const ttsSLA = avgMetrics.ttsLatency < 500;
      const endToEndSLA = avgMetrics.endToEndLatency < 2000;
      const cpuSLA = avgMetrics.cpuUsage < 70;
      const memSLA = avgMetrics.memoryUsage < 70;
      
      const allSLA = asrSLA && llmSLA && ttsSLA && endToEndSLA && cpuSLA && memSLA;
      
      console.log('\n📊 SLA Compliance Report');
      console.log('========================');
      console.log(`ASR Latency: ${avgMetrics.asrLatency.toFixed(0)}ms - ${asrSLA ? '✅ PASS' : '❌ FAIL'} (SLA: < 1000ms)`);
      console.log(`LLM Latency: ${avgMetrics.llmLatency.toFixed(0)}ms - ${llmSLA ? '✅ PASS' : '❌ FAIL'} (SLA: < 2000ms)`);
      console.log(`TTS Latency: ${avgMetrics.ttsLatency.toFixed(0)}ms - ${ttsSLA ? '✅ PASS' : '❌ FAIL'} (SLA: < 500ms)`);
      console.log(`End-to-End: ${avgMetrics.endToEndLatency.toFixed(0)}ms - ${endToEndSLA ? '✅ PASS' : '❌ FAIL'} (SLA: < 2000ms)`);
      console.log(`CPU Usage: ${avgMetrics.cpuUsage.toFixed(1)}% - ${cpuSLA ? '✅ PASS' : '❌ FAIL'} (SLA: < 70%)`);
      console.log(`Memory Usage: ${avgMetrics.memoryUsage.toFixed(1)}% - ${memSLA ? '✅ PASS' : '❌ FAIL'} (SLA: < 70%)`);
      console.log('========================');
      console.log(`Overall SLA: ${allSLA ? '✅ PASS' : '❌ FAIL'}`);
      
      expect(allSLA).toBe(true); // Assert that all SLAs are met
    }, 65000);
  });

  afterAll(() => {
    monitor.clearMetrics();
    console.log('\n✅ Performance benchmarks completed');
  });
});
