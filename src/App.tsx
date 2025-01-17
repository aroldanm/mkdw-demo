import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { SignInModal } from './components/SignInModal';
import { AdminPanel } from './components/AdminPanel';
import { MarkdownEditor } from './components/MarkdownEditor';
import { FileText, Edit, Share2, Shield } from 'lucide-react';
import type { User, MarkdownFile } from './types';

function App() {
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [markdownFiles, setMarkdownFiles] = useState<MarkdownFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<MarkdownFile | null>(null);
  const [isAdminView, setIsAdminView] = useState(true);
  const [isEditorView, setIsEditorView] = useState(false);
  const [tempNewFile, setTempNewFile] = useState<MarkdownFile | null>(null);

  // Check URL parameters on mount and when files change
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const docId = params.get('docId');
    
    if (docId) {
      const file = markdownFiles.find(f => f.id === docId);
      if (file) {
        if (file.isPublic || user) {
          setSelectedFile(file);
          setIsAdminView(false);
          setIsEditorView(false);
        } else {
          setSelectedFile(null);
        }
      }
    } else {
      if (!tempNewFile) {
        setIsAdminView(true);
        setIsEditorView(false);
        setSelectedFile(null);
      }
    }
  }, [markdownFiles, user, tempNewFile]);

  const handleSignIn = (email: string, password: string) => {
    setUser({
      id: '1',
      email: email
    });
    setIsSignInModalOpen(false);
    setIsAdminView(true);
    setIsEditorView(false);
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
      setSelectedFile(newFile);
      setIsAdminView(false);
      setIsEditorView(true);
    };
    reader.readAsText(file);
  };

  const handleCreateNew = () => {
    const tempFile: MarkdownFile = {
      id: 'temp-' + Math.random().toString(36).substr(2, 9),
      fileName: 'new-document.md',
      title: 'New Document',
      content: '',
      userId: user?.id || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPublic: false
    };
    setTempNewFile(tempFile);
    setSelectedFile(tempFile);
    setIsAdminView(false);
    setIsEditorView(true);
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
    setIsEditorView(false);
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('docId', file.id);
    window.history.pushState({}, '', newUrl);
  };

  const handleEditFile = (file: MarkdownFile) => {
    setSelectedFile(file);
    setIsAdminView(false);
    setIsEditorView(true);
  };

  const handleFinishEditing = () => {
    setIsEditorView(false);
    setIsAdminView(true);
    setSelectedFile(null);
    setTempNewFile(null);
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.delete('docId');
    window.history.pushState({}, '', newUrl);
  };

  const handleUpdateContent = (fileId: string, newContent: string) => {
    // If it's a temporary new file, create it as a permanent file
    if (tempNewFile && fileId === tempNewFile.id) {
      const permanentFile: MarkdownFile = {
        ...tempNewFile,
        id: Math.random().toString(36).substr(2, 9),
        content: newContent,
        updatedAt: new Date().toISOString()
      };
      setMarkdownFiles(prev => [...prev, permanentFile]);
      setTempNewFile(null);
      setSelectedFile(null);
      setIsEditorView(false);
      setIsAdminView(true);
      return;
    }

    // Otherwise update existing file
    setMarkdownFiles(prev => prev.map(file => {
      if (file.id === fileId) {
        return {
          ...file,
          content: newContent,
          updatedAt: new Date().toISOString()
        };
      }
      return file;
    }));

    if (selectedFile?.id === fileId) {
      setSelectedFile(prev => prev ? {
        ...prev,
        content: newContent
      } : null);
    }
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
    url.searchParams.set('docId', fileId);
    return url.toString();
  };

  if (user) {
    return (
      <div className="min-h-screen bg-white relative">
        {/* Header with title */}
        <div className="w-full h-20 px-6 flex justify-between items-center border-b border-gray-100">
          <h1 className="text-3xl font-bold text-gray-800">
            {isEditorView ? (tempNewFile ? 'New Document' : 'Edit Document') : (isAdminView ? 'Admin Panel' : (selectedFile?.title || ''))}
          </h1>
        </div>

        {/* Main content */}
        {isEditorView && (selectedFile || tempNewFile) ? (
          <MarkdownEditor
            file={tempNewFile || selectedFile!}
            onSave={handleUpdateContent}
            onFinish={handleFinishEditing}
          />
        ) : isAdminView ? (
          <AdminPanel
            markdownFiles={markdownFiles}
            onUpload={handleUpload}
            onDelete={handleDelete}
            onSelect={handleFileSelect}
            onEdit={handleEditFile}
            onUpdateTitle={handleUpdateTitle}
            onToggleVisibility={handleToggleVisibility}
            getShareableLink={getShareableLink}
            onCreateNew={handleCreateNew}
          />
        ) : selectedFile ? (
          <div className="container mx-auto px-4 pt-12 pb-16 max-w-4xl prose prose-slate">
            {selectedFile.isPublic || user ? (
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
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500 text-2xl">Document not found</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 py-16 sm:py-24">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
              Your Markdown Publishing Platform
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Create, edit, and share your markdown documents with ease. Perfect for documentation, blogs, and technical writing.
            </p>
          </div>
        </div>
        {/* Background decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-6xl opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-700 via-blue-800 to-transparent"></div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">
            Everything you need for markdown publishing
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {/* Feature 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                <Edit className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Rich Markdown Editor</h3>
              <p className="text-gray-600">
                Write in markdown with our intuitive editor featuring live preview and support for GitHub Flavored Markdown.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                <Share2 className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Easy Sharing</h3>
              <p className="text-gray-600">
                Share your documents with anyone using public links, or keep them private for your eyes only.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Secure Access</h3>
              <p className="text-gray-600">
                Control who can view your documents with our simple but powerful privacy settings.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to start publishing?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join now and experience the easiest way to create and share markdown documents.
          </p>
          <button
            onClick={() => setIsSignInModalOpen(true)}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors duration-200"
          >
            Sign Up Now
          </button>
        </div>
      </div>

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