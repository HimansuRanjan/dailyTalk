import { useState, useRef, useEffect } from "react";
import { Share, Copy } from "lucide-react";

interface ShareMenuProps {
  url: string;
  title?: string;
}

export default function ShareMenu({ url, title }: ShareMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const shareLinks = [
    {
      name: "WhatsApp",
      link: `https://wa.me/?text=${encodeURIComponent(
        (title ? title + " " : "") + url
      )}`,
    },
    {
      name: "Facebook",
      link: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
    {
      name: "Twitter/X",
      link: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title || "")}`,
    },
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    alert("✅ Link copied to clipboard!");
  };

  return (
    <div className="relative" ref={menuRef}>
      <button 
        type="button"
        title="Share Post"
        className="flex items-center gap-1 text-gray-600 hover:text-green-500 dark:text-gray-300"
        onClick={() => setOpen((prev) => !prev)}
      >
        <Share size={18} />
      </button>

      {open && (
        <div className="absolute top-full mt-2 right-0 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-2 z-50">
          {shareLinks.map((item, idx) => (
            <a
              key={idx}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              {item.name}
            </a>
          ))}
          <button
            type="button"
            onClick={copyToClipboard}
            className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <Copy size={14} /> Copy Link
          </button>
        </div>
      )}
    </div>
  );
}

