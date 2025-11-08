import { useState } from 'react';
import { Download, FileSpreadsheet, FileText, Loader2 } from 'lucide-react';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../ui';

interface ExportButtonProps {
  data: any[];
  filename?: string;
  className?: string;
  disabled?: boolean;
  exportFormats?: ('csv' | 'excel' | 'json')[];
}

export function ExportButton({
  data,
  filename = 'export',
  className,
  disabled = false,
  exportFormats = ['csv', 'excel', 'json'],
}: ExportButtonProps) {
  const [exporting, setExporting] = useState(false);

  const exportToCSV = async () => {
    if (data.length === 0) return;

    setExporting(true);
    try {
      // Dynamically import xlsx only when needed
      const XLSX = await import('xlsx');
      const ws = XLSX.utils.json_to_sheet(data);
      const csv = XLSX.utils.sheet_to_csv(ws);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting to CSV:', error);
    } finally {
      setExporting(false);
    }
  };

  const exportToExcel = async () => {
    if (data.length === 0) return;

    setExporting(true);
    try {
      // Dynamically import xlsx only when needed
      const XLSX = await import('xlsx');
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      XLSX.writeFile(wb, `${filename}.xlsx`);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
    } finally {
      setExporting(false);
    }
  };

  const exportToJSON = () => {
    if (data.length === 0) return;

    setExporting(true);
    try {
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}.json`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting to JSON:', error);
    } finally {
      setExporting(false);
    }
  };

  if (exportFormats.length === 1) {
    const format = exportFormats[0];
    const handlers = {
      csv: exportToCSV,
      excel: exportToExcel,
      json: exportToJSON,
    };

    return (
      <Button
        onClick={handlers[format]}
        disabled={disabled || exporting || data.length === 0}
        className={className}
        variant="outline"
      >
        {exporting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Exporting...
          </>
        ) : (
          <>
            <Download className="w-4 h-4 mr-2" />
            Export {format.toUpperCase()}
          </>
        )}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          disabled={disabled || exporting || data.length === 0}
          className={className}
          variant="outline"
        >
          {exporting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Export
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {exportFormats.includes('csv') && (
          <DropdownMenuItem onClick={exportToCSV}>
            <FileText className="w-4 h-4 mr-2" />
            Export as CSV
          </DropdownMenuItem>
        )}
        {exportFormats.includes('excel') && (
          <DropdownMenuItem onClick={exportToExcel}>
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Export as Excel
          </DropdownMenuItem>
        )}
        {exportFormats.includes('json') && (
          <DropdownMenuItem onClick={exportToJSON}>
            <FileText className="w-4 h-4 mr-2" />
            Export as JSON
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

