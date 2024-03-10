import degit from 'degit';
import * as p from '@clack/prompts';
import shelljs from 'shelljs';
import * as fs from 'fs';

export async function setupProject(cwd: string) {
    p.log.step("Creating project in " + cwd);
    // make sure the directory exists
    if (!fs.existsSync(cwd)) {
        fs.mkdirSync(cwd);
    }
    // create the project directory
    fs.mkdirSync(cwd, { recursive: true });
    let original_cwd = process.cwd();
    const emitter = degit("okupter/kitforstartups/starter", {
        cache: false,
        force: true,
        verbose: false,
    });

    emitter.on('warn', warning => {
        p.log.warn(warning.message);
    });

    await emitter.clone(cwd).then(() => {
        shelljs.cd(original_cwd);
    });
}

export async function createGitRepo(cwd: string) {
    p.log.step("Creating Git repository in " + cwd);
    shelljs.cd(cwd);
    shelljs.exec('git init', { silent: true });
    shelljs.exec('git add .', { silent: true });
}