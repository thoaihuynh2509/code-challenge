import { useMemo, useState } from "react";
import { TOKEN_ICON_BASE_URL } from "../constants";
import IconClose from "./IconClose";

const TokenModal = ({
  tokens,
  isOpen,
  onClose,
  onSelectToken,
  selectedFrom,
  selectedTo,
  modalType,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTokens = useMemo(() => {
    return tokens.filter((token) =>
      token.currency.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [tokens, searchTerm]);

  const handleSelect = (token) => {
    // Prevent selecting the same token for both fields
    if (
      (modalType === "from" && token.currency === selectedTo) ||
      (modalType === "to" && token.currency === selectedFrom)
    ) {
      // If the user tries to select the same token, we can just close the modal
      // or implement a swap logic here. For simplicity, we just close.
    } else {
      onSelectToken(token.currency);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4 animate-fade-in">
      <div className="bg-[#1e1e1e] rounded-2xl w-full max-w-md flex flex-col p-6 border border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-white">Select a token</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <IconClose />
          </button>
        </div>
        <input
          type="text"
          placeholder="Search token name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[#2a2a2a] border border-gray-600 rounded-lg p-3 mb-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex-grow overflow-y-auto max-h-[60vh]">
          {filteredTokens.length > 0 ? (
            filteredTokens.map((token) => (
              <div
                key={token.currency}
                onClick={() => handleSelect(token)}
                className="flex items-center p-3 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors"
              >
                <img
                  src={`${TOKEN_ICON_BASE_URL}${token.currency}.svg`}
                  alt={token.currency}
                  className="w-8 h-8 mr-4"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://placehold.co/32x32/2a2a2a/ffffff?text=?";
                  }}
                />
                <span className="text-white font-medium">{token.currency}</span>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400 py-4">No tokens found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TokenModal;
