import { Injectable, Logger } from '@nestjs/common';
import { IProcessedEmailMessageQueue } from 'src/lib/dtos';
import { IAITagReport } from '../llm/dtos/llm.dto';

/**
 * @description :  This service is responsible for taking actions based on the processed email message and user's preferences.
 */
@Injectable()
export class ToolsService {
  private readonly logger = new Logger(ToolsService.name);

  public runTool(data: IProcessedEmailMessageQueue) {
    const { processedEmail } = data;

    // Iterate over the tags and their confidence levels
    for (const [tag, report] of Object.entries(processedEmail.tags)) {
      const typedReport = report as IAITagReport;
      const confidence = typedReport.confidence;

      if (confidence > 0.9) {
        this.logger.log(`Running high-confidence tool for tag: ${tag}`);
        this.runHighConfidenceTool(tag, typedReport);
      } else if (confidence > 0.5) {
        this.logger.log(`Running medium-confidence tool for tag: ${tag}`);
        this.runMediumConfidenceTool(tag, typedReport);
      } else {
        this.logger.log(`Skipping low-confidence tag: ${tag}`);
      }
    }
  }

  private runHighConfidenceTool(tag: string, report: IAITagReport) {
    // Implement logic for high-confidence tools
    this.logger.log(`High-confidence tool executed for ${tag}`);
    this.logger.log(report);
  }

  private runMediumConfidenceTool(tag: string, report: IAITagReport) {
    // Implement logic for medium-confidence tools
    this.logger.log(`Medium-confidence tool executed for ${tag}`);
    this.logger.log(report);
  }
}
