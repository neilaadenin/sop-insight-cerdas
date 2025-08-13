import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Lock } from 'lucide-react';

interface APISOP {
  id: number;
  title: string;
  description: string;
  status: string;
  status_reason?: string;
  category: {
    id: number;
    category_name: string;
    description: string;
  };
  division: {
    id: number;
    division_name: string;
    description: string;
  };
  tags: string[] | null;
  created_at: string;
  updated_at: string;
}

interface SOPViewerProps {
  sop: APISOP;
}

const SOPViewer: React.FC<SOPViewerProps> = ({ sop }) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="w-5 h-5" />
          <span>Dokumen SOP</span>
          <Lock className="w-4 h-4 text-muted-foreground" />
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="bg-muted h-96 lg:h-[600px] flex items-center justify-center border rounded-b-lg">
          <div className="text-center space-y-4">
            <FileText className="w-16 h-16 mx-auto text-muted-foreground" />
            <div>
              <p className="font-medium">PDF Viewer Demo</p>
              <p className="text-sm text-muted-foreground">
                Menampilkan: {sop.title}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                🔒 Mode aman: Tanpa download, cetak, atau screenshot
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SOPViewer;