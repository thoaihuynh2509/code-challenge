import { TOKEN_ICON_BASE_URL } from "../constants";

const CurrencyInput = ({
  label,
  amount,
  onAmountChange,
  onTokenSelect,
  selectedToken,
  balance,
  isReadOnly = false,
  errorMessage = "",
  rateInfo = "",
}) => {
  return (
    <div
      className={`bg-[#2a2a2a] p-4 rounded-xl border ${
        errorMessage ? "border-red-500" : "border-transparent"
      } transition-colors`}
    >
      <div className="flex justify-between items-center text-sm text-gray-400 mb-2">
        <span>{label}</span>
        {balance !== null && <span>Balance: {balance.toFixed(2)}</span>}
      </div>
      <div className="flex items-center gap-4">
        <input
          type="number"
          value={amount}
          onChange={onAmountChange}
          placeholder="0.00"
          readOnly={isReadOnly}
          className="bg-transparent text-3xl font-medium text-white w-full outline-none"
          step="any"
          min="0"
        />
        <button
          onClick={onTokenSelect}
          className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-full transition-colors"
        >
          <img
            src={`${TOKEN_ICON_BASE_URL}${selectedToken}.svg`}
            alt={selectedToken}
            className="w-6 h-6"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://placehold.co/24x24/808080/ffffff?text=?";
            }}
          />
          {selectedToken}
          <span className="text-gray-400">&#9662;</span>
        </button>
      </div>
      <div className="text-xs text-gray-400 mt-2 min-h-[1.2em]">
        {errorMessage ? (
          <span className="text-red-500">{errorMessage}</span>
        ) : (
          <span>{rateInfo}</span>
        )}
      </div>
    </div>
  );
};

export default CurrencyInput;
