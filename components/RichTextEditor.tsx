import React, { useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Bold, Italic, List, ListOrdered, Heading1, Heading2, RotateCcw } from 'lucide-react';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, placeholder }) => {
    const editorRef = useRef<HTMLDivElement>(null);

    // Sync external value changes to editor content only if different
    useEffect(() => {
        if (editorRef.current && editorRef.current.innerHTML !== value) {
            // Only update if value is truthy, otherwise empty string
            editorRef.current.innerHTML = value || '';
        }
    }, [value]);

    const handleInput = () => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    };

    const execCommand = (command: string, arg?: string) => {
        document.execCommand(command, false, arg);
        editorRef.current?.focus();
    };

    return (
        <div className="border rounded-md bg-transparent border-input focus-within:ring-1 focus-within:ring-ring">
            {/* Toolbar */}
            <div className="flex items-center gap-1 p-1 border-b bg-muted/20">
                <ToolbarButton onClick={() => execCommand('bold')} icon={<Bold className="w-4 h-4" />} title="Bold" />
                <ToolbarButton onClick={() => execCommand('italic')} icon={<Italic className="w-4 h-4" />} title="Italic" />
                <div className="w-px h-4 bg-border mx-1" />
                <ToolbarButton onClick={() => execCommand('formatBlock', 'H3')} icon={<Heading1 className="w-4 h-4" />} title="Heading 1" />
                <ToolbarButton onClick={() => execCommand('formatBlock', 'H4')} icon={<Heading2 className="w-4 h-4" />} title="Heading 2" />
                <div className="w-px h-4 bg-border mx-1" />
                <ToolbarButton onClick={() => execCommand('insertUnorderedList')} icon={<List className="w-4 h-4" />} title="Bullet List" />
                <ToolbarButton onClick={() => execCommand('insertOrderedList')} icon={<ListOrdered className="w-4 h-4" />} title="Numbered List" />
                <div className="flex-1" />
                <ToolbarButton onClick={() => execCommand('removeFormat')} icon={<RotateCcw className="w-4 h-4" />} title="Clear Format" />
            </div>

            {/* Editable Area */}
            <div
                ref={editorRef}
                className="rich-text-content p-4 min-h-[200px] outline-none max-h-[400px] overflow-y-auto text-sm"
                contentEditable
                onInput={handleInput}
                data-placeholder={placeholder}
            />

            <style>{`
                .rich-text-content:empty:before {
                    content: attr(data-placeholder);
                    color: #9ca3af;
                    pointer-events: none;
                }
                .rich-text-content h1 { font-size: 1.5em; font-weight: bold; margin-bottom: 0.5em; margin-top: 0.5em; }
                .rich-text-content h2 { font-size: 1.25em; font-weight: bold; margin-bottom: 0.5em; margin-top: 0.5em; }
                .rich-text-content h3 { font-size: 1.1em; font-weight: bold; margin-bottom: 0.5em; margin-top: 0.5em; }
                .rich-text-content h4 { font-weight: bold; margin-bottom: 0.5em; margin-top: 0.5em; }
                .rich-text-content ul { list-style-type: disc; padding-left: 1.5em; margin-bottom: 0.5em; }
                .rich-text-content ol { list-style-type: decimal; padding-left: 1.5em; margin-bottom: 0.5em; }
                .rich-text-content li { margin-bottom: 0.2em; }
                .rich-text-content p { margin-bottom: 0.5em; }
                .rich-text-content b, .rich-text-content strong { font-weight: bold; }
                .rich-text-content i, .rich-text-content em { font-style: italic; }
            `}</style>
        </div>
    );
};

const ToolbarButton = ({ onClick, icon, title }: { onClick: () => void; icon: React.ReactNode; title: string }) => (
    <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8 hover:bg-muted"
        onMouseDown={(e) => {
            e.preventDefault(); // Prevent focus loss
            onClick();
        }}
        title={title}
    >
        {icon}
    </Button>
);

export default RichTextEditor;
