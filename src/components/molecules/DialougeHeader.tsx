const DialougeHeader = ({ title }: { title: string }) => {
    return (
      <div className="border-b border-outline-low-em p-4 px-6 ">
        <h3 className="text-text-high-em text-2xl font-medium">{title}</h3>
      </div>
    );
  };  

    export default DialougeHeader