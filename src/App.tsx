import React, { useState, useEffect } from 'react';
import { LayoutPanelLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { SignInModal } from './components/SignInModal';
import { AdminPanel } from './components/AdminPanel';
import type { User, MarkdownFile } from './types';

function App() {
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [markdownFiles, setMarkdownFiles] = useState<MarkdownFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<MarkdownFile | null>(null);
  const [isAdminView, setIsAdminView] = useState(false);
  const [sharedFileId, setSharedFileId] = useState<string | null>(null);

  // Check for shared file in URL on mount and when files change
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fileId = params.get('file');
    if (fileId) {
      const file = markdownFiles.find(f => f.id === fileId);
      if (file) {
        if (file.isPublic || user) {
          setSelectedFile(file);
          setIsAdminView(false);
        } else {
          setSelectedFile(null);
        }
      }
    }
  }, [markdownFiles, user]);

  const handleSignIn = (email: string, password: string) => {
    setUser({
      id: '1',
      email: email
    });
    setIsSignInModalOpen(false);
    setIsAdminView(true);
  };

  const handleUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const newFile: MarkdownFile = {
        id: Math.random().toString(36).substr(2, 9),
        fileName: file.name.replace('.md', ''),
        title: file.name.replace('.md', ''),
        content: content,
        userId: user?.id || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isPublic: false
      };
      setMarkdownFiles(prev => [...prev, newFile]);
    };
    reader.readAsText(file);
  };

  const handleDelete = (fileId: string) => {
    setMarkdownFiles(prev => prev.filter(file => file.id !== fileId));
    if (selectedFile?.id === fileId) {
      setSelectedFile(null);
    }
  };

  const handleFileSelect = (file: MarkdownFile) => {
    setSelectedFile(file);
    setIsAdminView(false);
  };

  const handleUpdateTitle = (fileId: string, newTitle: string) => {
    setMarkdownFiles(prev => prev.map(file => {
      if (file.id === fileId) {
        return {
          ...file,
          title: newTitle || file.fileName,
          updatedAt: new Date().toISOString()
        };
      }
      return file;
    }));

    if (selectedFile?.id === fileId) {
      setSelectedFile(prev => prev ? {
        ...prev,
        title: newTitle || prev.fileName
      } : null);
    }
  };

  const handleToggleVisibility = (fileId: string) => {
    setMarkdownFiles(prev => prev.map(file => {
      if (file.id === fileId) {
        return {
          ...file,
          isPublic: !file.isPublic,
          updatedAt: new Date().toISOString()
        };
      }
      return file;
    }));

    if (selectedFile?.id === fileId) {
      setSelectedFile(prev => prev ? {
        ...prev,
        isPublic: !prev.isPublic
      } : null);
    }
  };

  const getShareableLink = (fileId: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set('file', fileId);
    return url.toString();
  };

  return (
    <div className="min-h-screen bg-white relative">
      {/* Header with title and admin button */}
      <div className="w-full h-20 px-6 flex justify-between items-center border-b border-gray-100">
        <h1 className="text-3xl font-bold text-gray-800">
          {isAdminView ? 'Admin Panel' : (selectedFile?.title || '')}
        </h1>
        {user ? (
          !isAdminView && (
            <button 
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg transition-colors duration-200 hover:bg-gray-50"
              onClick={() => setIsAdminView(true)}
            >
              <LayoutPanelLeft size={18} />
              <span>Admin Panel</span>
            </button>
          )
        ) : (
          <button 
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg transition-colors duration-200 hover:bg-gray-50"
            onClick={() => setIsSignInModalOpen(true)}
          >
            <LayoutPanelLeft size={18} />
            <span>Admin Panel</span>
          </button>
        )}
      </div>

      {/* Main content */}
      {isAdminView ? (
        <AdminPanel
          markdownFiles={markdownFiles}
          onUpload={handleUpload}
          onDelete={handleDelete}
          onSelect={handleFileSelect}
          onUpdateTitle={handleUpdateTitle}
          onToggleVisibility={handleToggleVisibility}
          getShareableLink={getShareableLink}
        />
      ) : (
        <div className="container mx-auto px-4 pt-12 pb-16 max-w-4xl prose prose-slate">
          {selectedFile ? (
            selectedFile.isPublic || user ? (
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  h1: ({node, ...props}) => <h1 className="text-4xl font-bold mb-6" {...props} />,
                  h2: ({node, ...props}) => <h2 className="text-3xl font-bold mb-4 mt-8" {...props} />,
                  h3: ({node, ...props}) => <h3 className="text-2xl font-bold mb-3 mt-6" {...props} />,
                  p: ({node, ...props}) => <p className="mb-4 text-gray-700" {...props} />,
                  a: ({node, ...props}) => <a className="text-blue-600 hover:text-blue-800 underline" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc ml-6 mb-4" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal ml-6 mb-4" {...props} />,
                  li: ({node, ...props}) => <li className="mb-2" {...props} />,
                  blockquote: ({node, ...props}) => (
                    <blockquote className="border-l-4 border-gray-200 pl-4 italic my-4" {...props} />
                  ),
                  code: ({node, inline, ...props}) => (
                    inline ? 
                    <code className="bg-gray-100 rounded px-1 py-0.5" {...props} /> :
                    <code className="block bg-gray-100 p-4 rounded-lg my-4 overflow-x-auto" {...props} />
                  ),
                  img: ({node, ...props}) => (
                    <img className="max-w-full h-auto rounded-lg my-4" {...props} />
                  ),
                  table: ({node, ...props}) => (
                    <div className="overflow-x-auto my-4">
                      <table className="min-w-full border border-gray-200" {...props} />
                    </div>
                  ),
                  th: ({node, ...props}) => (
                    <th className="border border-gray-200 px-4 py-2 bg-gray-50" {...props} />
                  ),
                  td: ({node, ...props}) => (
                    <td className="border border-gray-200 px-4 py-2" {...props} />
                  ),
                }}
              >
                {selectedFile.content}
              </ReactMarkdown>
            ) : (
              <div className="flex items-center justify-center h-64">
                <p className="text-gray-500 text-2xl">This document is private. Please sign in to view it.</p>
              </div>
            )
          ) : (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500 text-2xl">There isn't any file selected</p>
            </div>
          )}
        </div>
      )}

      {/* Sign In Modal */}
      <SignInModal
        isOpen={isSignInModalOpen}
        onClose={() => setIsSignInModalOpen(false)}
        onSignIn={handleSignIn}
      />
    </div>
  );
}

export default App;