export default interface AppConfig {
  /**
   * Root web directory.
   */
  rootDirectory: string;

  /**
   * Port listened by the server.
   */
  port: number;

  /**
   * Path of error page.
   */
  errorPage: string;

  /**
   * Path of access log.
   */
  accessLog: string;
};
