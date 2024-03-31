const MinValue = ({ Item, Value, MaxoMin, Simbol }) => {
  return (
    <div className="MinValue">
      {Item} {MaxoMin} de {Simbol}
      {Value}{" "}
    </div>
  );
};

export default MinValue;
