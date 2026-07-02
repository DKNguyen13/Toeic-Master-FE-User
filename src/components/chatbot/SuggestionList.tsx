type SuggestionListProps = {
  suggestions: string[];
  onClick: (text: string) => void;
  disabled?: boolean;
};

const SuggestionList: React.FC<SuggestionListProps> = ({
  suggestions,
  onClick,
  disabled = false,
}) => {
  if (!suggestions?.length) return null;

  return (
    <div className="grid grid-cols-2 gap-2 mt-2 animate-fadeIn">
      {suggestions.map((s, i) => (
        <button
          key={i}
          onClick={() => onClick(s)}
          disabled={disabled}
          title={s}
          className="px-3 py-1.5 text-xs rounded-full 
                    bg-blue-50 text-blue-600 
                    hover:bg-blue-100 
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all duration-200 hover:scale-105 active:scale-95
                    whitespace-nowrap overflow-hidden text-ellipsis">
          {s}
        </button>
      ))}
    </div>
  );
};

export default SuggestionList;