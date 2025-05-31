type Props = {
    hand: 'グー' | 'チョキ' | 'パー';
    onClick: () => void;
  };
  
  const handImageMap: Record<Props['hand'], string> = {
    グー: '/assets/goo.png',
    チョキ: '/assets/choki.png',
    パー: '/assets/pa.png',
  };
  
  export function HandButton({ hand, onClick }: Props) {
    return (
      <button onClick={onClick} className="focus:outline-none">
        <img
          src={handImageMap[hand]}
          alt={hand}
          style={{ width: '160px', height: '160px' }}
        />
      </button>
    );
  }
  