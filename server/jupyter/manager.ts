import { spawn, type ChildProcess } from 'child_process';
import { log } from '../vite';
import { mkdirSync, existsSync } from 'fs';

interface JupyterInstance {
  process: ChildProcess;
  port: number;
  token: string;
  appId: string;
}

const instances: Map<string, JupyterInstance> = new Map();

export function startJupyterInstance(appId: string): Promise<{ port: number; token: string }> {
  return new Promise((resolve, reject) => {
    // Stop existing instance if any
    stopJupyterInstance(appId);

    const port = 8888 + instances.size; // Dynamic port assignment
    const token = Math.random().toString(36).substring(7);
    
    // Create notebook directory
    const notebookDir = `/tmp/jupyter-${appId}`;
    if (!existsSync(notebookDir)) {
      mkdirSync(notebookDir, { recursive: true });
    }

    const jupyterProcess = spawn('jupyter', [
      'notebook',
      '--no-browser',
      '--ip=0.0.0.0',
      `--port=${port}`,
      `--NotebookApp.token=${token}`,
      '--NotebookApp.allow_origin=*',
      '--NotebookApp.disable_check_xsrf=True',
      `--notebook-dir=${notebookDir}`,
    ], {
      env: { ...process.env, PATH: process.env.PATH },
    });

    let started = false;

    jupyterProcess.stdout?.on('data', (data) => {
      const output = data.toString();
      log(`[Jupyter ${appId}] ${output}`);
      
      if (output.includes('http://') && !started) {
        started = true;
        instances.set(appId, { process: jupyterProcess, port, token, appId });
        resolve({ port, token });
      }
    });

    jupyterProcess.stderr?.on('data', (data) => {
      log(`[Jupyter ${appId} ERROR] ${data.toString()}`);
    });

    jupyterProcess.on('error', (error) => {
      log(`[Jupyter ${appId}] Failed to start: ${error.message}`);
      if (!started) {
        reject(error);
      }
    });

    jupyterProcess.on('exit', (code) => {
      log(`[Jupyter ${appId}] Exited with code ${code}`);
      instances.delete(appId);
    });

    // Timeout after 30 seconds
    setTimeout(() => {
      if (!started) {
        jupyterProcess.kill();
        reject(new Error('Jupyter startup timeout'));
      }
    }, 30000);
  });
}

export function stopJupyterInstance(appId: string): void {
  const instance = instances.get(appId);
  if (instance) {
    instance.process.kill();
    instances.delete(appId);
    log(`[Jupyter ${appId}] Stopped`);
  }
}

export function getJupyterInstance(appId: string): JupyterInstance | undefined {
  return instances.get(appId);
}

export function listJupyterInstances(): string[] {
  return Array.from(instances.keys());
}
