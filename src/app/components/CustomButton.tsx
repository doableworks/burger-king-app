type CustomButtonProps = {
    id: string;
    text: string;
    onClick?: () => void;
  };
  
  export default function CustomButton({ id, text, onClick }: CustomButtonProps) {
    return (
      <button
        id={id}
        onClick={onClick}
        style={{
          width: '132px',
          height: '51px',
          borderRadius: '12px',
          boxShadow: '4px 4px 16px 0px #ED222499',
          background: 'linear-gradient(137.68deg, #F45254 17.96%, #ED2224 98.89%)',
          animationDuration: '0ms',
          fontWeight: 400,
          fontSize: '16px',
          textAlign: 'center',
          letterSpacing: '-2%',
          margin: '20px auto 30px auto',
          color: 'white',
          display: 'block',
        }}
      >
        <span>{text}</span>
      </button>
    );
  }
  