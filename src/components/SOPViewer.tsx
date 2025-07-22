import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Lock } from 'lucide-react';
import { SOP } from '@/types/sop';

interface SOPViewerProps {
  sop: SOP;
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
                Menampilkan: {sop.file}
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