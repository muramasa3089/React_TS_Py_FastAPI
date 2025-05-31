type Props = {
    hand: string;
    onClick: () => void;
  };
  
  export function HandButton({ hand, onClick }: Props) {
    return (
      <button
        onClick={onClick}
        className="text-lg px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-700 transition"
      >
        {hand}
      </button>
    );
  }
  