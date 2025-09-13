import { Client } from '@notionhq/client';

export class NotionService {
  private client: Client;
  private databaseId: string;

  constructor() {
    const authToken = process.env.NOTION_AUTH_TOKEN;
    this.databaseId = process.env.NOTION_DATABASE_ID || '';

    if (!authToken) {
      throw new Error('NOTION_AUTH_TOKEN is required');
    }

    this.client = new Client({ auth: authToken });
  }

  /**
   * Create or update a page in the Notion database
   * @param data The data to create or update the page with
   */
  async createOrUpdatePage(data: any): Promise<void> {
    try {
      // Check if a page already exists for this incident/bug
      const existingPage = await this.findExistingPage(data);

      if (existingPage) {
        // Update the existing page
        await this.updatePage(existingPage.id, data);
      } else {
        // Create a new page
        await this.createPage(data);
      }
    } catch (error) {
      console.error('Error creating or updating Notion page:', error);
    }
  }

  /**
   * Find an existing page based on the data
   * @param data The data to search for
   * @returns The existing page or null if not found
   */
  private async findExistingPage(data: any): Promise<any | null> {
    try {
      // This is a simplified implementation
      // In a real-world scenario, you would implement logic to find
      // an existing page based on criteria like title, ID, etc.

      // For now, we'll just return null to always create a new page
      return null;
    } catch (error) {
      console.error('Error finding existing Notion page:', error);
      return null;
    }
  }

  /**
   * Create a new page in the Notion database
   * @param data The data to create the page with
   */
  private async createPage(data: any): Promise<void> {
    try {
      const pageProperties: any = {
        // Title property (adjust based on your database schema)
        Name: {
          title: [
            {
              text: {
                content: data.summary || 'New Incident/Bug Report',
              },
            },
          ],
        },
      };

      // Add other properties based on your database schema
      if (data.category) {
        pageProperties.Category = {
          select: {
            name: data.category,
          },
        };
      }

      if (data.severity) {
        pageProperties.Severity = {
          select: {
            name: data.severity,
          },
        };
      }

      // Add any other properties from the data object
      if (data.affectedServices && Array.isArray(data.affectedServices)) {
        pageProperties['Affected Services'] = {
          multi_select: data.affectedServices.map((service: string) => ({
            name: service,
          })),
        };
      }

      await this.client.pages.create({
        parent: { database_id: this.databaseId },
        properties: pageProperties,
      });

      console.log('Successfully created Notion page');
    } catch (error) {
      console.error('Error creating Notion page:', error);
    }
  }

  /**
   * Update an existing page in the Notion database
   * @param pageId The ID of the page to update
   * @param data The data to update the page with
   */
  private async updatePage(pageId: string, data: any): Promise<void> {
    try {
      // For updates, we'll add a comment to the page
      // In a real implementation, you might update properties or add content

      // Add a comment with the new information
      const commentContent = data.summary || 'New update';

      // Note: The Notion API doesn't currently support adding comments directly
      // As an alternative, you could append content to the page or update properties
      // For now, we'll just log that an update was requested
      console.log(`Update requested for page ${pageId} with data:`, data);
    } catch (error) {
      console.error('Error updating Notion page:', error);
    }
  }

  /**
   * Add a comment to a Notion page
   * @param pageId The ID of the page to comment on
   * @param comment The comment text
   */
  async addComment(pageId: string, comment: string): Promise<void> {
    try {
      // Note: The Notion API doesn't currently support adding comments directly
      // This functionality would need to be implemented using another approach
      // such as appending content to the page or using properties

      console.log(`Comment for page ${pageId}: ${comment}`);
    } catch (error) {
      console.error('Error adding comment to Notion page:', error);
    }
  }
}
