import { Injectable } from '@nestjs/common';
import { IProcessedEmailMessageQueue } from 'src/lib/types';

/**
 * @description :  This service is responsible for taking actions based on the processed email message and user's preferences.
 */
@Injectable()
export class ToolsService {
  public runTool(data: IProcessedEmailMessageQueue) {
    const { processedEmail } = data;

    // Iterate over the tags and their confidence levels
    for (const [tag, report] of Object.entries(processedEmail.tags)) {
      const confidence = report.confidence; // Assuming IAITagReport has a 'confidence' property

      if (confidence > 0.9) {
        console.log(`Running high-confidence tool for tag: ${tag}`);
        this.runHighConfidenceTool(tag, report);
      } else if (confidence > 0.5) {
        console.log(`Running medium-confidence tool for tag: ${tag}`);
        this.runMediumConfidenceTool(tag, report);
      } else {
        console.log(`Skipping low-confidence tag: ${tag}`);
      }
    }
  }

  private runHighConfidenceTool(tag: string, report: any) {
    // Implement logic for high-confidence tools
    console.log(`High-confidence tool executed for ${tag}`);
  }

  private runMediumConfidenceTool(tag: string, report: any) {
    // Implement logic for medium-confidence tools
    console.log(`Medium-confidence tool executed for ${tag}`);
  }
}
