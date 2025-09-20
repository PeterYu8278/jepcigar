// 文件下载服务
// 用于处理各种文件的下载功能，包括PDF报告、数字名片等

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface DownloadOptions {
  filename?: string;
  mimeType?: string;
  quality?: number;
}

interface PDFOptions extends DownloadOptions {
  title?: string;
  author?: string;
  subject?: string;
  keywords?: string;
  orientation?: 'portrait' | 'landscape';
  unit?: 'mm' | 'pt' | 'px';
  format?: 'a4' | 'letter' | 'legal';
}

interface ImageOptions extends DownloadOptions {
  format?: 'png' | 'jpeg' | 'webp';
  backgroundColor?: string;
  scale?: number;
}

class FileDownloadService {
  // 下载文本文件
  async downloadText(content: string, filename: string, mimeType: string = 'text/plain'): Promise<void> {
    try {
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      console.log(`[FileDownloadService] Text file downloaded: ${filename}`);
    } catch (error) {
      console.error('[FileDownloadService] Failed to download text file:', error);
      throw error;
    }
  }

  // 下载JSON文件
  async downloadJSON(data: any, filename: string): Promise<void> {
    const jsonString = JSON.stringify(data, null, 2);
    return this.downloadText(jsonString, filename, 'application/json');
  }

  // 下载CSV文件
  async downloadCSV(data: any[], filename: string, headers?: string[]): Promise<void> {
    try {
      let csvContent = '';
      
      if (headers && headers.length > 0) {
        csvContent += headers.join(',') + '\n';
      }
      
      data.forEach(row => {
        const values = Object.values(row).map(value => {
          // 处理包含逗号的字段
          const stringValue = String(value || '');
          return stringValue.includes(',') ? `"${stringValue}"` : stringValue;
        });
        csvContent += values.join(',') + '\n';
      });
      
      return this.downloadText(csvContent, filename, 'text/csv;charset=utf-8;');
    } catch (error) {
      console.error('[FileDownloadService] Failed to download CSV file:', error);
      throw error;
    }
  }

  // 下载PDF文件
  async downloadPDF(
    content: string | HTMLElement,
    filename: string,
    options: PDFOptions = {}
  ): Promise<void> {
    try {
      const {
        title = 'JEP Cigar Report',
        author = 'JEP Cigar Business System',
        subject = 'Business Report',
        keywords = 'cigar, business, report',
        orientation = 'portrait',
        unit = 'mm',
        format = 'a4',
      } = options;

      const pdf = new jsPDF({
        orientation,
        unit,
        format,
      });

      // 设置PDF元数据
      pdf.setProperties({
        title,
        author,
        subject,
        keywords,
      });

      if (typeof content === 'string') {
        // 文本内容
        pdf.text(content, 20, 20);
      } else {
        // HTML元素
        const canvas = await html2canvas(content, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
        });
        
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 295; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;

        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
      }

      pdf.save(filename);
      console.log(`[FileDownloadService] PDF file downloaded: ${filename}`);
    } catch (error) {
      console.error('[FileDownloadService] Failed to download PDF file:', error);
      throw error;
    }
  }

  // 下载图片文件
  async downloadImage(
    element: HTMLElement,
    filename: string,
    options: ImageOptions = {}
  ): Promise<void> {
    try {
      const {
        format = 'png',
        backgroundColor = '#ffffff',
        scale = 2,
      } = options;

      const canvas = await html2canvas(element, {
        scale,
        backgroundColor,
        useCORS: true,
        allowTaint: true,
      });

      const mimeType = `image/${format}`;
      const dataUrl = canvas.toDataURL(mimeType, options.quality || 0.9);

      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log(`[FileDownloadService] Image file downloaded: ${filename}`);
    } catch (error) {
      console.error('[FileDownloadService] Failed to download image file:', error);
      throw error;
    }
  }

  // 下载Blob文件
  async downloadBlob(blob: Blob, filename: string): Promise<void> {
    try {
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      console.log(`[FileDownloadService] Blob file downloaded: ${filename}`);
    } catch (error) {
      console.error('[FileDownloadService] Failed to download blob file:', error);
      throw error;
    }
  }

  // 从URL下载文件
  async downloadFromURL(url: string, filename: string): Promise<void> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const blob = await response.blob();
      return this.downloadBlob(blob, filename);
    } catch (error) {
      console.error('[FileDownloadService] Failed to download from URL:', error);
      throw error;
    }
  }

  // 生成并下载客户报告PDF
  async downloadCustomerReport(customer: any, filename?: string): Promise<void> {
    const reportContent = `
JEP Cigar Business System - 客户报告

客户信息：
姓名：${customer.firstName} ${customer.lastName}
邮箱：${customer.email}
电话：${customer.phone || '未提供'}
公司：${customer.company || '未提供'}

偏好信息：
${customer.tastePreferences?.map((pref: any) => `- ${pref.category}: ${pref.value}`).join('\n') || '无偏好信息'}

预算范围：¥${customer.budgetRange?.min || 0} - ¥${customer.budgetRange?.max || 0}

数字名片状态：${customer.digitalCard?.isActive ? '已激活' : '未激活'}

生成时间：${new Date().toLocaleString('zh-CN')}
    `.trim();

    const defaultFilename = `customer-report-${customer.firstName}-${customer.lastName}-${Date.now()}.pdf`;
    
    return this.downloadPDF(reportContent, filename || defaultFilename, {
      title: `客户报告 - ${customer.firstName} ${customer.lastName}`,
      subject: '客户信息报告',
      keywords: 'customer, report, cigar',
    });
  }

  // 生成并下载库存报告PDF
  async downloadInventoryReport(inventory: any[], filename?: string): Promise<void> {
    const reportContent = `
JEP Cigar Business System - 库存报告

库存概览：
总商品数：${inventory.length}
低库存商品：${inventory.filter(item => item.currentStock <= item.minStock).length}

商品详情：
${inventory.map(item => `
品牌：${item.brand}
名称：${item.name}
产地：${item.origin}
当前库存：${item.currentStock}
最低库存：${item.minStock}
零售价：¥${item.retailPrice}
库存状态：${item.currentStock <= item.minStock ? '⚠️ 库存不足' : '✅ 库存充足'}
`).join('\n')}

生成时间：${new Date().toLocaleString('zh-CN')}
    `.trim();

    const defaultFilename = `inventory-report-${Date.now()}.pdf`;
    
    return this.downloadPDF(reportContent, filename || defaultFilename, {
      title: '库存报告',
      subject: '库存信息报告',
      keywords: 'inventory, report, cigar, stock',
    });
  }

  // 生成并下载数字名片
  async downloadDigitalCard(customer: any, element: HTMLElement, filename?: string): Promise<void> {
    const defaultFilename = `digital-card-${customer.firstName}-${customer.lastName}-${Date.now()}.png`;
    
    return this.downloadImage(element, filename || defaultFilename, {
      format: 'png',
      backgroundColor: '#ffffff',
      scale: 3,
      quality: 1,
    });
  }

  // 批量下载文件（打包为ZIP）
  async downloadMultipleFiles(): Promise<void> {
    try {
      // 这里需要集成JSZip库
      console.log('[FileDownloadService] Batch download not implemented yet');
      throw new Error('Batch download requires JSZip library');
    } catch (error) {
      console.error('[FileDownloadService] Failed to download multiple files:', error);
      throw error;
    }
  }

  // 检查下载支持
  isDownloadSupported(): boolean {
    return typeof document !== 'undefined' && 'download' in document.createElement('a');
  }

  // 获取文件大小
  getFileSize(content: string | Blob): number {
    if (typeof content === 'string') {
      return new Blob([content]).size;
    }
    return content.size;
  }

  // 格式化文件大小
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// 创建全局实例
export const fileDownloadService = new FileDownloadService();

// 导出类型
export type { DownloadOptions, PDFOptions, ImageOptions };
export default FileDownloadService;
