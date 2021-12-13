/**
 * Logger class that will write log on files/console depending of the level.
 */
export class Logger {

  /* tslint:disable:no-console */
  public debug(...args: any[]): void {
    console.debug(args);
  }

  public error(...args: any[]): void {
    console.error(args);
  }
}
