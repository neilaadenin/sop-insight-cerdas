
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, History, Calendar, User, Clock, XCircle, Edit3, CheckCircle, FolderOpen } from 'lucide-react';
import { SOP } from '@/types/sop';

interface SOPCardProps {
  sop: SOP;
  onView: (sop: SOP) => void;
  onViewHistory?: (sop: SOP) => void;
}

const SOPCard: React.FC<SOPCardProps> = ({ sop, onView, onViewHistory }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Badge variant="secondary" className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 transition-colors"><Clock className="w-3 h-3 mr-1.5" />Pending</Badge>;
      case 'Rejected':
        return <Badge variant="destructive" className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100 transition-colors"><XCircle className="w-3 h-3 mr-1.5" />Rejected</Badge>;
      case 'Revisi':
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100 transition-colors"><Edit3 className="w-3 h-3 mr-1.5" />Revisi</Badge>;
      case 'Draft':
        return <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 transition-colors">Draft</Badge>;
      case 'Verified':
      case 'Active':
        return <Badge variant="default" className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 transition-colors"><CheckCircle className="w-3 h-3 mr-1.5" />Verified</Badge>;
      default:
        return <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 transition-colors">{status}</Badge>;
    }
  };

  return (
    <Card className="group relative overflow-hidden rounded-2xl border-0 bg-gradient-to-br from-white to-slate-50/50 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02]">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-transparent to-purple-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <CardHeader className="pb-4 pt-6 px-6 relative z-10">
        <div className="flex items-start justify-between gap-4">
          <CardTitle className="text-xl font-bold text-slate-800 line-clamp-2 leading-tight group-hover:text-slate-900 transition-colors">
            {sop.judul}
          </CardTitle>
          <div className="flex flex-col items-end gap-3 shrink-0">
            <Badge variant="outline" className="bg-white/80 backdrop-blur-sm border-slate-200 text-slate-700 font-medium px-3 py-1.5 rounded-full">
              v{sop.versi}
            </Badge>
            {sop.status && getStatusBadge(sop.status)}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="px-6 pb-4 space-y-4 relative z-10">
        {/* Category with icon */}
        <div className="flex items-center gap-3 p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-100">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FolderOpen className="w-5 h-5 text-blue-600" />
          </div>
          <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200 font-medium px-3 py-1.5 rounded-full">
            {sop.kategori}
          </Badge>
        </div>
        
        {/* Tags */}
        {sop.tag.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {sop.tag.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs bg-white/60 backdrop-blur-sm border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors px-2.5 py-1 rounded-full">
                #{tag}
              </Badge>
            ))}
          </div>
        )}
        
        {/* Metadata */}
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2.5 p-2.5 bg-white/40 backdrop-blur-sm rounded-lg border border-slate-100">
            <Calendar className="w-4 h-4 text-slate-500" />
            <span className="text-slate-700 font-medium">{sop.tanggal}</span>
          </div>
          <div className="flex items-center gap-2.5 p-2.5 bg-white/40 backdrop-blur-sm rounded-lg border border-slate-100">
            <User className="w-4 h-4 text-slate-500" />
            <span className="text-slate-700 font-medium">{sop.diunggah_oleh}</span>
          </div>
        </div>
        
        {/* Summary */}
        {sop.ringkasan && (
          <div className="p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-100">
            <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
              {sop.ringkasan}
            </p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="px-6 pb-6 pt-2 relative z-10">
        <div className="flex justify-between w-full gap-3">
          <Button 
            variant="default" 
            size="sm"
            onClick={() => onView(sop)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium px-4 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
          >
            <Eye className="w-4 h-4" />
            <span>Lihat SOP</span>
          </Button>
          
          {onViewHistory && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onViewHistory(sop)}
              className="flex items-center gap-2 border-slate-200 bg-white/80 backdrop-blur-sm hover:bg-white hover:border-slate-300 text-slate-700 font-medium px-4 py-2.5 rounded-xl transition-all duration-200 hover:scale-105"
            >
              <History className="w-4 h-4" />
              <span>Riwayat</span>
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default SOPCard;
