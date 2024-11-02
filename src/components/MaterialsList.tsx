import { FileText, Download, FileType } from 'lucide-react';

interface Material {
  id: string;
  title: string;
  type: string;
  url: string;
  description?: string; // Make description optional
}

interface MaterialsListProps {
  materials: Material[];
}

function MaterialsList({ materials }: MaterialsListProps) {
  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return <FileText className="h-6 w-6 text-red-500" />;
      case 'doc':
        return <FileText className="h-6 w-6 text-blue-500" />;
      case 'ppt':
        return <FileText className="h-6 w-6 text-orange-500" />;
      default:
        return <FileType className="h-6 w-6 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-medium">Course Materials</h3>
      
      <div className="space-y-4">
        {materials.map((material) => (
          <div
            key={material.id}
            className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
          >
            <div className="flex items-center space-x-3">
              {getFileIcon(material.type)}
              <div>
                <h4 className="font-medium text-gray-900">{material.title}</h4>
                <p className="text-sm text-gray-500">{material.description || 'No description available'}</p>
                <p className="text-xs text-gray-400 mt-1">{material.type.toUpperCase()}</p>
              </div>
            </div>
            
            <a
              href={material.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              <Download className="h-5 w-5" />
              <span>Download</span>
            </a>
          </div>
        ))}

        {materials.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-2 text-gray-400" />
            <p>No materials available yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MaterialsList;
