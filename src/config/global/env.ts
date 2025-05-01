class ConfigService {
  private readonly env: { [key: string]: string | undefined };

  constructor() {
    this.env = process.env;
  }

  get(key: string): string {
    const value = this.env[key];
    if (!value) {
      throw new Error(`Environment variable ${key} is not defined`);
    }
    return value;
  }

  getOptional(key: string, defaultValue: string): string {
    return this.env[key] || defaultValue;
  }
}

// Export specific environment variables
export const getEnvVar = (key: string, defaultValue?: string): string => {
  const configService = new ConfigService();
  if (!defaultValue) {
    return configService.get(key);
  }

  return configService.getOptional(key, defaultValue);
};
