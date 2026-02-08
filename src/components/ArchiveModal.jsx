import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Button } from './ui/button';
import { useTranslation } from 'react-i18next';
import { Archive, Undo2, Trash2, X, AlertTriangle } from 'lucide-react';

function ArchiveModal({ projects, archivedProjects, onRestore, onDelete, onClose }) {
  const { t } = useTranslation('sidebar');
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  const archivedList = projects.filter(p => archivedProjects.has(p.name));

  const handleDelete = (project) => {
    setDeleteConfirmation(project);
  };

  const confirmDelete = () => {
    if (deleteConfirmation) {
      onDelete(deleteConfirmation);
      setDeleteConfirmation(null);
    }
  };

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-card border border-border rounded-xl shadow-2xl max-w-lg w-full overflow-hidden max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Archive className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">
              {t('archive.title')}
            </h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 px-0"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {archivedList.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mx-auto mb-4">
                <Archive className="w-6 h-6 text-muted-foreground" />
              </div>
              <h4 className="text-sm font-medium text-foreground mb-1">
                {t('archive.noArchivedProjects')}
              </h4>
              <p className="text-xs text-muted-foreground">
                {t('archive.noArchivedDescription')}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {archivedList.map((project) => (
                <div
                  key={project.name}
                  className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-foreground truncate">
                      {project.displayName || project.name}
                    </div>
                    <div className="text-xs text-muted-foreground truncate" title={project.fullPath}>
                      {project.fullPath || project.name}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0 ml-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 px-0 hover:bg-green-50 dark:hover:bg-green-900/20"
                      onClick={() => onRestore(project.name)}
                      title={t('archive.restoreTooltip')}
                    >
                      <Undo2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 px-0 hover:bg-red-50 dark:hover:bg-red-900/20"
                      onClick={() => handleDelete(project)}
                      title={t('archive.deleteTooltip')}
                    >
                      <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Delete confirmation within the modal */}
        {deleteConfirmation && (
          <div className="border-t border-border p-4 bg-red-50/50 dark:bg-red-900/10">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground font-medium">
                  {t('archive.confirmDelete')}{' '}
                  <span className="font-semibold">
                    {deleteConfirmation.displayName || deleteConfirmation.name}
                  </span>?
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {t('deleteConfirmation.cannotUndo')}
                </p>
                <div className="flex gap-2 mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeleteConfirmation(null)}
                  >
                    {t('actions.cancel')}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="bg-red-600 hover:bg-red-700 text-white"
                    onClick={confirmDelete}
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    {t('actions.delete')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

export default ArchiveModal;
