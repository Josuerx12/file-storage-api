export global {
  namespace NodeJS {
    interface ProcessEnv {
      FTP_HOST: string;
      FTP_USER: string;
      FTP_PASSWORD: string;
      DB_HOST: string;
      DB_USER: string;
      DB_PORT: string;
      DB_PASSWORD: string;
      DB_NAME: string;
      DB_DIALECT:
        | 'mysql'
        | 'postgres'
        | 'sqlite'
        | 'mariadb'
        | 'mssql'
        | 'oracle';
    }
  }
}
