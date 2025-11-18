import { ChevronLeft, BookOpen, FileText, MessageCircle, X, Compass } from "lucide-react";
import { useState, useEffect } from "react";

const FloatingDictionary = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = () => setMenuOpen(false);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [menuOpen]);

  const menuItems = [
    { icon: BookOpen, color: "blue", label: "Từ điển", onClick: () => setModalOpen(true) },
    { icon: FileText, color: "green", label: "Ghi chú", onClick: () => alert("Ghi chú") },
  ];

  return (
    <>
      {/* Floating Menu */}
      <div className="fixed right-4 bottom-40 z-50 flex items-center">
        <div
          className={`flex flex-col gap-4 transition-all duration-300 ${
            menuOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
          }`}
        >
          {menuItems.map((item, i) => (
            <div key={i} className="relative group">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  item.onClick();
                }}
                className={`p-2.5 bg-${item.color}-500 hover:bg-${item.color}-600 text-white rounded-full shadow-xl transition-all hover:scale-110`}
              >
                <item.icon className="w-5 h-5" />
              </button>
              <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Open/close menu */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen(!menuOpen);
          }}
          className="ml-4 p-2.5 bg-slate-700 hover:bg-slate-800 text-white rounded-full shadow-xl transition-all">
          <ChevronLeft
            className={`w-5 h-5 transition-transform duration-300 ${
              menuOpen ? "rotate-0" : "-rotate-180"
            }`}
          />
        </button>
      </div>

      {/* Modal Dictionary Laban */}
      {modalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-md"
          onClick={() => setModalOpen(false)}>
          {/* Modal */}
          <div className="bg-white rounded-3xl shadow-3xl w-full max-w-5xl mx-4 h-[92vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between p-5 bg-blue-800 text-white rounded-t-lg">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Compass className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Từ điển Laban</h2>
                  <p className="text-xs text-white/80">Powered by Glosbe</p>
                </div>
              </div>
              <button onClick={() => setModalOpen(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-all hover:scale-110">
                <X className="w-6 h-6" />
              </button>
          </div>

            {/* iframe */}
            <div className="flex-1 relative overflow-hidden bg-gray-50">
              <iframe
                src="https://dict.laban.vn/"
                className="absolute inset-0 w-full h-full border-0"
                title="Từ điển Laban"
                allow="clipboard-write"
                allowFullScreen
                sandbox="allow-scripts allow-same-origin allow-modals allow-popups allow-forms allow-top-navigation"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingDictionary;