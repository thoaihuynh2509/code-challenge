import { useEffect, useState } from "react";
import { MOCK_USER_BALANCES } from "./constants";
import TokenModal from "./components/TokenModal";
import CurrencyInput from "./components/CurrencyInput";

export default function App() {
  const [prices, setPrices] = useState({});
  const [tokens, setTokens] = useState([]);
  const [balances, setBalances] = useState(MOCK_USER_BALANCES); // Track balances in state

  const [fromToken, setFromToken] = useState("ETH");
  const [toToken, setToToken] = useState("USDC");

  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("from");

  const [errorMessage, setErrorMessage] = useState("");
  const [submitStatus, setSubmitStatus] = useState("idle");

  // Fetch prices on initial render
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch(
          "https://interview.switcheo.com/prices.json"
        );
        const data = await response.json();

        const priceMap = {};
        const availableTokens = data
          .filter((item) => item.price)
          .map((item) => {
            priceMap[item.currency] = item.price;
            return item;
          });

        setPrices(priceMap);
        setTokens(availableTokens);
      } catch (error) {
        console.error("Failed to fetch token prices:", error);
        setSubmitStatus("error");
      }
    };
    fetchPrices();
  }, []);

  // Conversion logic
  useEffect(() => {
    if (
      fromAmount === "" ||
      fromAmount === "0" ||
      !prices[fromToken] ||
      !prices[toToken]
    ) {
      setToAmount("");
      return;
    }

    const amount = parseFloat(fromAmount);
    if (isNaN(amount)) return;

    const fromPrice = prices[fromToken];
    const toPrice = prices[toToken];
    const result = (amount * fromPrice) / toPrice;
    setToAmount(result.toFixed(6));
  }, [fromAmount, fromToken, toToken, prices]);

  // Validation logic
  useEffect(() => {
    const amount = parseFloat(fromAmount);
    const balance = balances[fromToken] || 0;

    if (isNaN(amount) || amount <= 0) {
      setErrorMessage("");
      return;
    }

    if (amount > balance) {
      setErrorMessage("Insufficient balance");
    } else {
      setErrorMessage("");
    }
  }, [fromAmount, fromToken, balances]);

  const handleFromAmountChange = (e) => {
    const value = e.target.value;
    if (value === "" || (parseFloat(value) >= 0 && !isNaN(value))) {
      setFromAmount(value);
    }
  };

  const openModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleSelectToken = (token) => {
    if (modalType === "from") {
      if (token === toToken) {
        setToToken(fromToken);
      }
      setFromToken(token);
    } else {
      if (token === fromToken) {
        setFromToken(toToken);
      }
      setToToken(token);
    }
  };

  const handleSwap = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount(toAmount);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (errorMessage || !fromAmount || fromAmount === "0") return;

    setSubmitStatus("loading");

    // Simulate API call
    setTimeout(() => {
      // Update balances after successful swap
      setBalances((prev) => ({
        ...prev,
        [fromToken]: prev[fromToken] - parseFloat(fromAmount),
        [toToken]: (prev[toToken] || 0) + parseFloat(toAmount),
      }));

      setSubmitStatus("success");
      // Reset form after success
      setTimeout(() => {
        setSubmitStatus("idle");
        setFromAmount("");
        setToAmount("");
      }, 2000);
    }, 1500);
  };

  const getSubmitButtonContent = () => {
    switch (submitStatus) {
      case "loading":
        return (
          <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        );
      case "success":
        return "Swap Successful!";
      case "error":
        return "Error fetching prices";
      default:
        return "Confirm Swap";
    }
  };

  const isSubmitDisabled =
    !!errorMessage ||
    !fromAmount ||
    fromAmount === "0" ||
    submitStatus !== "idle";
  const exchangeRate =
    prices[fromToken] && prices[toToken]
      ? (prices[fromToken] / prices[toToken]).toFixed(6)
      : 0;

  return (
    <div className="bg-[#121212] min-h-screen flex justify-center items-center font-sans p-4">
      <div className="w-full max-w-md mx-auto">
        <form
          onSubmit={handleSubmit}
          className="bg-[#1e1e1e] border border-gray-700 p-6 rounded-2xl shadow-lg space-y-4"
        >
          <h2 className="text-2xl font-bold text-white text-center mb-4">
            Currency Swap
          </h2>

          <CurrencyInput
            label="You send"
            amount={fromAmount}
            onAmountChange={handleFromAmountChange}
            onTokenSelect={() => openModal("from")}
            selectedToken={fromToken}
            balance={balances[fromToken] || 0}
            errorMessage={errorMessage}
          />

          <div className="flex justify-center my-[-8px] z-10 relative">
            <button
              type="button"
              onClick={handleSwap}
              className="bg-gray-800 text-white rounded-full p-2 border-4 border-[#1e1e1e] hover:bg-gray-700 hover:rotate-180 transition-transform duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 3v18m7-7l-7 7-7-7" />
              </svg>
            </button>
          </div>

          <CurrencyInput
            label="You receive"
            amount={toAmount}
            onAmountChange={() => {}}
            onTokenSelect={() => openModal("to")}
            selectedToken={toToken}
            balance={balances[toToken] || 0}
            isReadOnly={true}
            rateInfo={
              exchangeRate > 0
                ? `1 ${fromToken} ≈ ${exchangeRate} ${toToken}`
                : ""
            }
          />

          <button
            type="submit"
            disabled={isSubmitDisabled}
            className={`w-full text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex justify-center items-center h-14
                            ${
                              isSubmitDisabled
                                ? "bg-gray-600 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                            }
                            ${submitStatus === "success" && "!bg-green-600"}
                            ${submitStatus === "error" && "!bg-red-600"}
                        `}
          >
            {getSubmitButtonContent()}
          </button>
        </form>
      </div>

      <TokenModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        tokens={tokens}
        onSelectToken={handleSelectToken}
        selectedFrom={fromToken}
        selectedTo={toToken}
        modalType={modalType}
      />
    </div>
  );
}
