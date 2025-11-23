function noopDecorator(..._args: any[]) {
  return function () {
    // metadata-only decorator placeholder
  } as any;
}

export const ApiProperty = noopDecorator;
export const ApiPropertyOptional = noopDecorator;
export const ApiTags = noopDecorator;
export const ApiBearerAuth = noopDecorator;

export class DocumentBuilder {
  private options: Record<string, any> = {};

  setTitle(title: string): this {
    this.options.title = title;
    return this;
  }

  setDescription(description: string): this {
    this.options.description = description;
    return this;
  }

  setVersion(version: string): this {
    this.options.version = version;
    return this;
  }

  addBearerAuth(): this {
    this.options.bearerAuth = true;
    return this;
  }

  build(): Record<string, any> {
    return this.options;
  }
}

export const SwaggerModule = {
  createDocument: (..._args: any[]) => ({}),
  setup: (..._args: any[]) => undefined,
};
