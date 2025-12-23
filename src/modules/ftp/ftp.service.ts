import { config } from 'dotenv';

import { Client } from 'basic-ftp';
import { Injectable } from '@nestjs/common';

config();

@Injectable()
export class FtpService {
  private readonly ftpClient = new Client();

  constructor() {
    this.ftpClient.access({
      host: process.env.FTP_HOST,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASSWORD,
      secure: false,
    });
  }

  public async uploadFile({
    localPath,
    remotePath,
  }: {
    localPath: string;
    remotePath: string;
  }): Promise<void> {
    try {
      await this.ftpClient.uploadFrom(localPath, remotePath);
      console.log(`File uploaded successfully to ${remotePath}`);
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  public async downloadFile({
    remotePath,
    localPath,
  }: {
    remotePath: string;
    localPath: string;
  }): Promise<void> {
    try {
      await this.ftpClient.downloadTo(localPath, remotePath);
      console.log(`File downloaded successfully to ${localPath}`);
    } catch (error) {
      console.error('Error downloading file:', error);
      throw error;
    }
  }

  public async removeFile(remotePath: string): Promise<void> {
    try {
      await this.ftpClient.remove(remotePath);
      console.log(`File removed successfully from ${remotePath}`);
    } catch (error) {
      console.error('Error removing file:', error);
      throw error;
    }
  }

  public async checkFileExists(remotePath: string): Promise<boolean> {
    try {
      const fileList = await this.ftpClient.list(remotePath);
      return fileList.length > 0;
    } catch (error) {
      if (error.code === 550) {
        return false; // File does not exist
      }
      console.error('Error checking file existence:', error);
      throw error;
    }
  }
}
