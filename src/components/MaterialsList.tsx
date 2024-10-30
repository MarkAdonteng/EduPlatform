import React from 'react';
import { FileText, Download } from 'lucide-react';

interface Material {
  id: string;
  title: string;
  type: string;
  url: string;
}

interface MaterialsListProps {
  materials: Material[];
}

function MaterialsList({ materials }: MaterialsListProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-medium">Course Materials</h3>
      
      <div className="space-y-4">
        {materials.map((material) => (
          <div
            key={material.id}
            className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300"
          >
            <div className="flex items-center space-x-3">
              <FileText className="h-6 w-6 text-gray-400" />
              <div>
                <h4 className="font-medium text-gray-900">{material.title}</h4>
                <p className="text-sm text-gray-500">{material.type.toUpperCase()}</p>
              </div>
            </div>
            
            <button
              onClick={() => window.open(material.url, '_blank')}
              className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-800"
            >
              <Download className="h-5 w-5" />
              <span>Download</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MaterialsList;