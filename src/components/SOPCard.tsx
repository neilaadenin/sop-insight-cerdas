
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, History, Calendar, User } from 'lucide-react';
import { SOP } from '@/types/sop';
import { kategoris } from '@/data/sampleData';

interface SOPCardProps {
  sop: SOP;
  onView: (sop: SOP) => void;
  onViewHistory?: (sop: SOP) => void;
}

const SOPCard: React.FC<SOPCardProps> = ({ sop, onView, onViewHistory }) => {
  const kategori = kategoris.find(k => k.nama === sop.kategori);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold line-clamp-2">
            {sop.judul}
          </CardTitle>
          <Badge variant="outline" className="ml-2 shrink-0">
            {sop.versi}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{kategori?.icon}</span>
          <Badge variant="secondary">{sop.kategori}</Badge>
        </div>
        
        <div className="flex flex-wrap gap-1">
          {sop.tag.map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>{sop.tanggal}</span>
          </div>
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4" />
            <span>{sop.diunggah_oleh}</span>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2">
          {sop.ringkasan}
        </p>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-3">
        <Button 
          variant="default" 
          size="sm"
          onClick={() => onView(sop)}
          className="flex items-center space-x-2"
        >
          <Eye className="w-4 h-4" />
          <span>Lihat SOP</span>
        </Button>
        
        {onViewHistory && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onViewHistory(sop)}
            className="flex items-center space-x-2"
          >
            <History className="w-4 h-4" />
            <span>Riwayat</span>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default SOPCard;
